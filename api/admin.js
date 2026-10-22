// Vercel serverless function: powers /admin. Saves data straight into the GitHub repo; Vercel then redeploys the site.
const crypto = require('crypto');
const { ADMIN_PASSWORD, SESSION_SECRET, GITHUB_TOKEN, GITHUB_REPO } = process.env;
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const FILES = ['properties', 'careers'];
const sign = v => crypto.createHmac('sha256', SESSION_SECRET || '').update(v).digest('hex');
const safeEq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
function authed(req) {
  const m = (req.headers.cookie || '').match(/(?:^|;\s*)igh_admin=([^;]+)/);
  if (!m || !SESSION_SECRET) return false;
  const [exp, sig] = m[1].split('.');
  return Number(exp) > Date.now() && safeEq(sig || '', sign(exp));
}
function send(res, code, obj) { res.setHeader('Cache-Control', 'no-store'); res.status(code).json(obj); }
function gh(path, opt = {}) {
  return fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, { ...opt, headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'igrey-admin', 'Content-Type': 'application/json' } });
}
async function commit(path, buf, message) {
  let sha;
  const g = await gh(`${path}?ref=${BRANCH}`);
  if (g.ok) sha = (await g.json()).sha; else if (g.status !== 404) throw new Error('GitHub read failed (' + g.status + ')');
  const p = await gh(path, { method: 'PUT', body: JSON.stringify({ message, content: buf.toString('base64'), branch: BRANCH, sha }) });
  if (!p.ok) { const e = await p.json().catch(() => ({})); throw new Error('GitHub save failed (' + p.status + '): ' + (e.message || '')); }
}
module.exports = async (req, res) => {
  const a = req.query.a;
  try {
    if (a === 'me') return send(res, 200, { auth: authed(req) });
    if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
    if (a === 'login') {
      if (!ADMIN_PASSWORD || !SESSION_SECRET) return send(res, 500, { error: 'Not configured: set ADMIN_PASSWORD and SESSION_SECRET in Vercel' });
      await new Promise(r => setTimeout(r, 800));
      if (!safeEq((req.body || {}).password || '', ADMIN_PASSWORD)) return send(res, 401, { error: 'Wrong password' });
      const exp = String(Date.now() + 8 * 3600 * 1000);
      res.setHeader('Set-Cookie', `igh_admin=${exp}.${sign(exp)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`);
      return send(res, 200, { ok: true });
    }
    if (a === 'logout') { res.setHeader('Set-Cookie', 'igh_admin=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'); return send(res, 200, { ok: true }); }
    if (!authed(req)) return send(res, 401, { error: 'Not signed in' });
    if (!GITHUB_TOKEN || !GITHUB_REPO) return send(res, 500, { error: 'Not configured: set GITHUB_TOKEN and GITHUB_REPO in Vercel' });
    const b = req.body || {};
    if (a === 'get') {
      if (!FILES.includes(b.file)) return send(res, 400, { error: 'Bad request' });
      const g = await gh(`data/${b.file}.json?ref=${BRANCH}`);
      if (g.status === 404) return send(res, 200, { items: [] });
      if (!g.ok) throw new Error('GitHub read failed (' + g.status + ')');
      const j = await g.json();
      return send(res, 200, { items: JSON.parse(Buffer.from(j.content, 'base64').toString('utf8')) });
    }
    if (a === 'save') {
      if (!FILES.includes(b.file) || !Array.isArray(b.items)) return send(res, 400, { error: 'Bad request' });
      const json = JSON.stringify(b.items, null, 2);
      if (json.length > 500000) return send(res, 400, { error: 'Too much data' });
      await commit(`data/${b.file}.json`, Buffer.from(json), `Admin: update ${b.file}`);
      return send(res, 200, { ok: true });
    }
    if (a === 'upload') {
      const buf = Buffer.from(String(b.data || ''), 'base64');
      const ext = buf.slice(0, 3).toString('hex') === 'ffd8ff' ? 'jpg' : buf.slice(0, 4).toString('hex') === '89504e47' ? 'png'
        : (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') ? 'webp' : null;
      if (!ext || buf.length > 3 * 1024 * 1024) return send(res, 400, { error: 'Only JPG, PNG or WebP images under 3 MB' });
      const path = `assets/uploads/${crypto.randomBytes(8).toString('hex')}.${ext}`;
      await commit(path, buf, 'Admin: upload image');
      return send(res, 200, { path });
    }
    return send(res, 404, { error: 'Unknown action' });
  } catch (e) { return send(res, 500, { error: e.message }); }
};
