// Vercel serverless function: emails each website enquiry to hello@igreyholdings.com and sends the visitor an automatic reply.
// Uses Resend (resend.com). Without RESEND_API_KEY it answers 501 and the website falls back to FormSubmit.
const KEY = process.env.RESEND_API_KEY;
const TO = process.env.ENQUIRY_TO || 'hello@igreyholdings.com';
const FROM = process.env.ENQUIRY_FROM || 'iGREY Holdings <hello@igreyholdings.com>';
const hits = new Map();
const limited = ip => { const n = Date.now(), a = (hits.get(ip) || []).filter(t => n - t < 600000); a.push(n); hits.set(ip, a); if (hits.size > 5000) hits.clear(); return a.length > 10; };
const line = v => String(v == null ? '' : v).replace(/[\r\n]+/g, ' ').trim();
async function send(body) {
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) console.error('Resend error', r.status, await r.text());
  return r.ok;
}
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!KEY) return res.status(501).json({ error: 'Not configured' });
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'Too many requests. Please try again in a few minutes.' });
  const b = req.body || {}, f = {};
  Object.keys(b.fields || {}).slice(0, 25).forEach(k => { const key = line(k).slice(0, 40); if (key) f[key] = String(b.fields[k]).slice(0, 2000).trim(); });
  const get = n => { const k = Object.keys(f).find(x => x.toLowerCase() === n); return k ? f[k] : ''; };
  const name = line(get('name')).slice(0, 100), email = line(get('email'));
  if (!name || !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid name and email.' });
  const career = b.kind === 'Career application', property = b.kind === 'Property enquiry';
  const kind = career ? 'Career application' : property ? 'Property enquiry' : 'Website enquiry';
  let attachments;
  if (career) {
    const r = b.resume;
    if (!r || !/\.(pdf|docx?)$/i.test(String(r.name || '')) || typeof r.data !== 'string' || r.data.length > 4300000) return res.status(400).json({ error: 'Please attach your resume (PDF, DOC or DOCX, under 3 MB).' });
    attachments = [{ filename: line(r.name).replace(/[^\w.\- ]/g, '_').slice(0, 80), content: r.data }];
  }
  const text = `New ${kind} from the iGREY Holdings website\n\n` + Object.keys(f).map(k => `${k}: ${f[k]}`).join('\n') + '\n';
  const subject = line(b.subject || `New ${kind}`).slice(0, 150);
  const ok = await send({ from: FROM, to: [TO], reply_to: email, subject, text, ...(attachments ? { attachments } : {}) });
  if (!ok) return res.status(502).json({ error: 'Could not send' });
  const what = career ? 'application' : 'enquiry', about = property && f.Property ? ` about ${f.Property}${f['Property ID'] ? ' (' + f['Property ID'] + ')' : ''}` : '';
  await send({ from: FROM, to: [email], reply_to: TO, subject: `We have received your ${what} - iGREY Holdings`,
    text: `Hello ${name},\n\nThank you for contacting iGREY Holdings. We have received your ${what}${about} and our team will get back to you within one business day.\n\nIf it is urgent, please call us on +91 8147172449.\n\nRegards,\niGREY Holdings\nhello@igreyholdings.com\n` });
  return res.status(200).json({ ok: true });
};
