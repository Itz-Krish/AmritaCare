const crypto = require('crypto');

module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  try {
    const body = req.body || {};
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = [];
    if (body.folder) paramsToSign.push(`folder=${body.folder}`);
    if (body.public_id) paramsToSign.push(`public_id=${body.public_id}`);
    if (body.transformation) paramsToSign.push(`transformation=${body.transformation}`);
    paramsToSign.push(`timestamp=${timestamp}`);

    const toSign = paramsToSign.join('&');
    const secret = process.env.CLOUDINARY_API_SECRET || '';
    if (!secret) return res.status(500).json({ ok: false, error: 'CLOUDINARY_API_SECRET not configured' });
    const signature = crypto.createHash('sha1').update(toSign + secret).digest('hex');

    return res.json({ ok: true, cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, timestamp, signature });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
// Vercel Serverless function: /api/cloudinary-sign
// Expects these env vars to be set in Vercel dashboard (Project → Settings → Environment Variables):
// CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!apiKey || !apiSecret || !cloudName) {
    return res.status(500).json({ error: 'Cloudinary not configured on server. Set CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME in environment.' });
  }

  try {
    const body = req.body || {};
    // allow timestamp override for testing
    const timestamp = Math.floor(Date.now() / 1000);

    // Build params_to_sign string. Commonly timestamp + optional folder/public_id
    const params = {
      timestamp: body.timestamp || timestamp,
    };

    // include optional params if provided (e.g., folder, eager)
    if (body.folder) params.folder = body.folder;
    if (body.public_id) params.public_id = body.public_id;
    if (body.transformation) params.transformation = body.transformation;

    // sort keys and build query string
    const toSign = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
    const signature = crypto.createHmac('sha1', apiSecret).update(toSign).digest('hex');

    return res.json({ ok: true, cloud_name: cloudName, api_key: apiKey, timestamp: params.timestamp, signature });
  } catch (err) {
    console.error('sign error', err);
    return res.status(500).json({ error: 'Signing failed' });
  }
};
