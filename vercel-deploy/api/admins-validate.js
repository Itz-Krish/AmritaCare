const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  try {
    const body = req.body || {};
    const username = (body.username || '').toString();
    const password = (body.password || '').toString();
    if (!username || !password) return res.status(400).json({ ok: false, error: 'missing credentials' });

    const filePath = path.join(__dirname, '..', 'public', 'adminaccess.json');
    if (!fs.existsSync(filePath)) return res.status(500).json({ ok: false, error: 'admin store missing' });
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const found = (json.admins || []).find(a => a.username === username);
    if (!found) return res.status(401).json({ ok: false, error: 'invalid' });
    const match = await bcrypt.compare(password, found.hash);
    if (!match) return res.status(401).json({ ok: false, error: 'invalid' });
    return res.json({ ok: true, username });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
// Vercel Serverless function: /api/admins/validate
// Validates admin username/password against `public/adminaccess.json` (bcrypt hash).
// NOTE: This is for convenience in development. For production, prefer a proper user store.

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = req.body || {};
    const username = (body.username || '').trim();
    const password = body.password || '';
    if (!username || !password) return res.status(400).json({ ok: false, error: 'username and password required' });

    const file = path.join(process.cwd(), 'public', 'adminaccess.json');
    if (!fs.existsSync(file)) return res.status(500).json({ ok: false, error: 'adminaccess.json not found' });
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const admin = data.admins && data.admins.find(a => a.username === username);
    if (!admin) return res.status(401).json({ ok: false, error: 'invalid credentials' });

    const match = bcrypt.compareSync(password, admin.hash);
    if (!match) return res.status(401).json({ ok: false, error: 'invalid credentials' });

    return res.json({ ok: true, username });
  } catch (err) {
    console.error('admin validate error', err);
    return res.status(500).json({ ok: false, error: 'server error' });
  }
};
