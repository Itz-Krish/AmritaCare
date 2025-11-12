Vercel Deploy Package — Release Notes

This release package contains a ready-to-deploy copy of the AmritaCare frontend and serverless endpoints for Vercel.

Contents
- public/ — static site (index.html, admin.html, adminaccess.json, videos/...)
- api/ — serverless endpoints: cloudinary-sign.js, firebase-config.js, admins-validate.js

Before you deploy on Vercel
- Add the following Environment Variables in Vercel Project Settings (Production):
  - CLOUDINARY_API_KEY
  - CLOUDINARY_API_SECRET
  - CLOUDINARY_CLOUD_NAME
  - FIREBASE_API_KEY (optional; if not set, client falls back to embedded config)
  - FIREBASE_AUTH_DOMAIN
  - FIREBASE_PROJECT_ID
  - FIREBASE_STORAGE_BUCKET
  - FIREBASE_MESSAGING_SENDER_ID
  - FIREBASE_APP_ID
  - FIREBASE_MEASUREMENT_ID
  - OPENAI_API_KEY (optional)

Security notes
- CLOUDINARY_API_SECRET must remain server-side. Do not commit secrets into the repository.
- `public/adminaccess.json` contains a development admin entry (username: wasitkrish). Replace or remove in production as needed.

How to use this release asset (two quick ways)

1) GitHub Release (recommended if you only need to attach the ZIP)
   - Create a new Release in the AmritaCare repository and attach `vercel-deploy.zip` as an asset.

2) Push the folder to a branch and connect to Vercel
   - Create a branch `vercel-deploy` in the repo, copy the `vercel-deploy/` folder into the repository root, commit and push. Then import that branch in Vercel.

Quick verification
- The ZIP is at the repository root as `vercel-deploy.zip` (confirm size before uploading to GitHub Releases).

If you want
- I can provide the exact `gh` CLI commands to create the release and upload the zip (you'll run them locally), or a copy-paste-ready web UI release description.

Release notes (short):
"Vercel deploy package for AmritaCare — includes public site and serverless endpoints for Cloudinary signing and Firebase config. Set required environment variables in Vercel before deploying."
