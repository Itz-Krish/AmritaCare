# AmritaCare Vercel Deployment Guide

This folder contains a complete Vercel-ready deployment package for AmritaCare.

## Quick Start

### 1. Import into Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **New Project** → **Import Git Repository**
3. Select **Itz-Krish/AmritaCare** repository
4. Choose branch: **vercel-deploy**
5. Click **Deploy**

### 2. Set Environment Variables
After importing, go to **Project Settings** → **Environment Variables** and add:

#### Required (Cloudinary Signing)
- `CLOUDINARY_API_KEY` — Your Cloudinary API key
- `CLOUDINARY_API_SECRET` — Your Cloudinary API secret (server-side only)
- `CLOUDINARY_CLOUD_NAME` — Your Cloudinary cloud name

#### Optional (Firebase)
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

#### Optional (OpenAI)
- `OPENAI_API_KEY` — If using ChatGPT features

### 3. Redeploy
After adding environment variables:
1. Go to **Deployments** → **New Deployment**
2. Select branch **vercel-deploy** and trigger

## What's Included

- **public/** — Static HTML, CSS, JS, admin portal, and videos
- **api/** — Serverless functions:
  - `/api/cloudinary-sign` — Signs Cloudinary uploads
  - `/api/firebase-config` — Returns Firebase client config
  - `/api/admins/validate` — Validates admin credentials

## Architecture

- **Frontend**: Static site with vanilla JS, localStorage chat, Firebase optional integration
- **Serverless**: Node.js functions for Cloudinary signing, Firebase config delivery, admin validation
- **Admin Portal**: Local password validation using `public/adminaccess.json` (bcrypt hashed)
- **Media**: Video files stored in `public/videos/orig_videos/` (Git LFS tracked)

## Environment Variable Details

### CLOUDINARY_API_SECRET
**Must be set as a server-side environment variable.** This secret is used by `/api/cloudinary-sign` to sign uploads and must never be exposed to the client.

### FIREBASE_* (Optional)
If you set Firebase environment variables, the `/api/firebase-config` endpoint will return them. Clients will use the provided config for real-time chat and database features. If not set, clients fall back to an embedded config.

### OPENAI_API_KEY (Optional)
If integrating with OpenAI APIs, set this variable for serverless functions to use it.

## Testing Endpoints

After deployment, test endpoints using curl or Postman:

```bash
# Test Firebase config endpoint (returns 404 if not configured)
curl https://<your-vercel-url>.vercel.app/api/firebase-config

# Test Cloudinary signing endpoint
curl -X POST https://<your-vercel-url>.vercel.app/api/cloudinary-sign \
  -H "Content-Type: application/json" \
  -d '{"folder":"uploads"}'

# Test admin validation endpoint
curl -X POST https://<your-vercel-url>.vercel.app/api/admins/validate \
  -H "Content-Type: application/json" \
  -d '{"username":"wasitkrish","password":"Krish@2020"}'
```

## Troubleshooting

- **502 Bad Gateway**: Check function logs in Vercel dashboard. Common causes: missing env vars, syntax errors, or function timeout.
- **404 on /api/firebase-config**: Firebase environment variables not set. Client falls back to embedded config; this is expected behavior.
- **401 on /api/admins/validate**: Invalid credentials. Check `public/adminaccess.json` for correct username/hash.

## Security Notes

- `CLOUDINARY_API_SECRET` is never exposed to the client; all signing happens server-side.
- `public/adminaccess.json` uses bcrypt hashed passwords for development convenience.
- Embedded Firebase config in `public/index.html` is non-secret (safe to commit).
- For production, replace local admin validation with a proper auth service.

## Next Steps

1. Verify the deployment is live at your Vercel URL.
2. Test the serverless endpoints using the curl examples above.
3. Customize `public/index.html` and related files as needed for your deployment.
4. Monitor logs in Vercel dashboard for any runtime issues.

---
**Deployment Package Date**: 2025-11-13  
**Branch**: vercel-deploy  
**Repository**: Itz-Krish/AmritaCare
