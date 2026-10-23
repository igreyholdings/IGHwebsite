// Vercel serverless function: "Kitty", the website's AI chat assistant.
// Uses FREE AI APIs only (no paid plan needed). It tries these in order and moves on if one is busy or out of free quota:
//   1. Groq  (free, no credit card)   GROQ_API_KEY    model GROQ_MODEL           (default llama-3.3-70b-versatile)
//   2. Groq  (same key, own free quota) model GROQ_FALLBACK_MODEL                 (default llama-3.1-8b-instant)
//   3. Google Gemini (free tier)       GEMINI_API_KEY  model GEMINI_MODEL         (default gemini-flash-lite-latest)
// Set at least one key in Vercel > Settings > Environment Variables, then redeploy.
const buildSystem = require('./_prompt');
const GROQ_KEY = process.env.GROQ_API_KEY, GEMINI_KEY = process.env.GEMINI_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_FALLBACK = process.env.GROQ_FALLBACK_MODEL || 'llama-3.1-8b-instant';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
const MAX_TOKENS = 400, TIMEOUT_MS = 8000;

const hits = new Map();
function limited(ip) {            // best-effort limit: 25 messages per 10 minutes per visitor
  const now = Date.now(), a = (hits.get(ip) || []).filter(t => now - t < 600000);
  a.push(now); hits.set(ip, a); if (hits.size > 5000) hits.clear();
  return a.length > 25;
}
function post(url, headers, body) {
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  return fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body), signal: ctl.signal })
    .finally(() => clearTimeout(t));
}
async function askGroq(model, system, msgs) {
  const r = await post('https://api.groq.com/openai/v1/chat/completions', { authorization: 'Bearer ' + GROQ_KEY },
    { model, max_tokens: MAX_TOKENS, temperature: 0.5, messages: [{ role: 'system', content: system }, ...msgs] });
  if (!r.ok) throw new Error('groq ' + model + ' ' + r.status + ' ' + (await r.text()).slice(0, 200));
  const d = await r.json();
  return ((d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content) || '').trim();
}
async function askGemini(model, system, msgs) {
  const r = await post('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent', { 'x-goog-api-key': GEMINI_KEY },
    { systemInstruction: { parts: [{ text: system }] },
      contents: msgs.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
      generationConfig: { maxOutputTokens: 800, temperature: 0.5 } });
  if (!r.ok) throw new Error('gemini ' + model + ' ' + r.status + ' ' + (await r.text()).slice(0, 200));
  const d = await r.json(), c = d.candidates && d.candidates[0];
  return ((c && c.content && c.content.parts) || []).map(p => p.text || '').join('').trim();
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!GROQ_KEY && !GEMINI_KEY) return res.status(500).json({ error: 'Chat is not configured' });
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'Too many messages. Please try again in a few minutes.' });
  let m = (req.body || {}).messages;
  if (!Array.isArray(m)) return res.status(400).json({ error: 'Bad request' });
  m = m.slice(-12).map(x => ({ role: x && x.role === 'assistant' ? 'assistant' : 'user', content: String((x && x.content) || '').slice(0, 1000).trim() })).filter(x => x.content);
  const msgs = [];
  for (const x of m) { const l = msgs[msgs.length - 1]; if (l && l.role === x.role) l.content += '\n' + x.content; else msgs.push(x); }
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return res.status(400).json({ error: 'Bad request' });
  let listings = [], jobs = [];
  try {
    const base = 'https://' + req.headers.host;
    [listings, jobs] = await Promise.all(['properties', 'careers'].map(f => fetch(`${base}/data/${f}.json`).then(r => r.json())));
  } catch (e) { /* answer without live data */ }
  const system = buildSystem(listings, jobs);
  const tries = [];
  if (GROQ_KEY) { tries.push(() => askGroq(GROQ_MODEL, system, msgs)); if (GROQ_FALLBACK && GROQ_FALLBACK !== GROQ_MODEL) tries.push(() => askGroq(GROQ_FALLBACK, system, msgs)); }
  if (GEMINI_KEY) tries.push(() => askGemini(GEMINI_MODEL, system, msgs));
  for (const t of tries) {
    try {
      const reply = await t();
      if (reply) return res.status(200).json({ reply });
    } catch (e) { console.error('Kitty provider failed:', e.message); }
  }
  return res.status(502).json({ error: 'The assistant is unavailable right now.' });
};
