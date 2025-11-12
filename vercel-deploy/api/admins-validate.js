const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Vercel Serverless function: /api/admins/validate
// Validates admin credentials (username + password) against adminaccess.json using bcrypt.

import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const adminFile = path.join(process.cwd(), 'public', 'adminaccess.json');
    const data = JSON.parse(fs.readFileSync(adminFile, 'utf-8'));
    const admin = data.admins?.find(a => a.username === username);

    if (!admin || !(await bcrypt.compare(password, admin.hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(200).json({ ok: true, username: admin.username });
  } catch (err) {
    console.error('Error validating admin:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
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

    const match = await bcrypt.compare(password, admin.hash);
    if (!match) return res.status(401).json({ ok: false, error: 'invalid credentials' });

    return res.json({ ok: true, username });
  } catch (err) {
    console.error('admin validate error', err);
    return res.status(500).json({ ok: false, error: 'server error' });
  }
};
