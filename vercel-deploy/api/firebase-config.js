module.exports = (req, res) => {
  // Return firebase client config if env vars are present. 404 if not configured so client falls back to embedded config.
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!apiKey) return res.status(404).json({ ok: false, error: 'firebase not configured' });
  const cfg = {
    apiKey: apiKey,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  };
  res.setHeader('Cache-Control', 'public, max-age=60');
  return res.json(cfg);
};
// Vercel Serverless function: /api/firebase-config
// Returns non-secret Firebase client config read from environment variables.
// Set these in Vercel dashboard (Project → Settings → Environment Variables):
// FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET,
// FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID (optional)

module.exports = (req, res) => {
  const cfg = {
    apiKey: process.env.FIREBASE_API_KEY || null,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || null,
    projectId: process.env.FIREBASE_PROJECT_ID || null,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || null,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || null,
    appId: process.env.FIREBASE_APP_ID || null,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || null
  };

  // If no config found, return 404 so client can fallback to embedded config
  const any = Object.values(cfg).some(v => v && v !== 'your_api_key_here');
  if (!any) return res.status(404).json({ error: 'No firebase config set on server' });

  return res.json(cfg);
};
