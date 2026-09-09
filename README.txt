ELIAS BET — NETLIFY READY

This version is prepared for Netlify.
- index.html = public website
- admin.html = separate admin panel
- netlify/functions/api.js = serverless backend
- Netlify Blobs = persistent shared data storage
- netlify.toml = Netlify routing

DEPLOY:
1. Upload this whole project folder/ZIP to Netlify.
2. Netlify will detect netlify.toml and install the function dependency.
3. Open your site URL for the public website.
4. Open /admin.html for the separate admin panel.

DEFAULT ADMIN LOGIN:
Username: admin
Password: ChangeMe_1122!

IMPORTANT BEFORE PUBLIC USE:
In Netlify: Site configuration -> Environment variables, set:
ADMIN_USER = your admin username
ADMIN_PASSWORD = a strong new password
ADMIN_SECRET = a long random secret
Then redeploy.

The shared data is stored in Netlify Blobs, so Admin changes are available to the public website through the same backend. This is a virtual/demo credit system; no real-money payment processing is included.
