# 🚀 Kaweera — Hostinger Deployment Checklist

> Step-by-step guide to deploy Kaweera v1.0.2 on Hostinger (Shared, Cloud, or VPS hosting).

---

## Prerequisites

- ✅ Hostinger hosting plan with a domain or subdomain configured.
- ✅ SSL/TLS certificate (Hostinger provides free Let's Encrypt via hPanel).
- ✅ Access to hPanel File Manager or SSH/SFTP credentials.

---

## Step 1: Upload Files

### Option A: File Manager (hPanel)

1. Log in to [hPanel](https://hpanel.hostinger.com/).
2. Navigate to **Files → File Manager**.
3. Open the `public_html/` directory.
4. **Delete** any existing default files (`index.html`, `.htaccess`, etc.) from the default Hostinger template.
5. Upload the **entire contents** of the `Kaweera v1.0.2/` folder into `public_html/`. The final structure should be:

```
public_html/
├── .htaccess
├── .nojekyll
├── index.html
├── favicon.ico
├── metadata.json
├── ARCHITECTURE.md
├── DEPLOYMENT.md
├── README.md
├── _expo/
│   └── static/js/web/
│       └── index-335090c3f943670f03a0907382621a35.js
├── assets/
│   ├── assets/  (images)
│   └── node_modules/  (fonts)
└── manager/
    └── index.html
```

### Option B: SFTP Upload

1. In hPanel → **Files → FTP Accounts**, note your SFTP credentials.
2. Connect via FileZilla or WinSCP:
   - Host: your domain or `ftp.yourdomain.com`
   - Port: `22` (SFTP) or `21` (FTP)
   - Username / Password: from hPanel
3. Navigate to `public_html/` and upload all files from `Kaweera v1.0.2/`.

### Option C: Git Deploy (VPS only)

1. SSH into your VPS.
2. Clone or pull the repository into a staging directory.
3. Copy the contents of `Kaweera v1.0.2/` to your web root:
   ```bash
   rsync -av --delete "Kaweera v1.0.2/" /var/www/html/
   # or for Hostinger VPS default:
   rsync -av --delete "Kaweera v1.0.2/" /home/USERNAME/public_html/
   ```

---

## Step 2: Configure SSL (HTTPS)

1. In hPanel → **Security → SSL**.
2. Click **Install SSL** for your domain (Let's Encrypt — free).
3. Wait for propagation (usually < 5 minutes).
4. Verify: visit `https://yourdomain.com` — the `.htaccess` will auto-redirect HTTP → HTTPS.

> **Note:** If you see a redirect loop, temporarily comment out the HTTPS redirect block in `.htaccess` until SSL is fully active.

---

## Step 3: Verify the App

| Check | URL | Expected Result |
|:------|:----|:----------------|
| Main app loads | `https://yourdomain.com/` | Kaweera welcome screen renders |
| Favicon shows | Browser tab | Football icon visible |
| Fonts load | Inspect Network tab | `.ttf` files load from `./assets/node_modules/...` |
| Images load | Welcome/results screen | Ball logo, Arabic wordmark visible |
| Manager access | `https://yourdomain.com/manager/` | Login screen with owner email |
| Manager sign-in | Click "Email me a sign-in link" | Email received, link redirects back to manager |

---

## Step 4: Update Firebase Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/) → Project **kora-w-bas**.
2. Navigate to **Authentication → Settings → Authorized domains**.
3. Add your new domain (e.g., `yourdomain.com`) to the whitelist.
4. This is **required** for email-link sign-in to work on the Manager.

---

## Step 5: Restrict the API Key (Recommended)

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Click the API key `AIzaSyDXgdmAfP0lXRxt-vgZxMy1muNPqcCoucc`.
3. Under **Application restrictions**, select **HTTP referrers**.
4. Add your domains:
   - `https://yourdomain.com/*`
   - `https://www.yourdomain.com/*`
   - `https://doudoushehab2003-create.github.io/*` (keep for backward compatibility)
5. Save.

---

## Step 6: Manager Email-Link `continueUrl` Configuration

The Manager sign-in uses `location.origin + location.pathname` as the `continueUrl`, so it automatically adapts to your new domain. No code change is needed.

However, ensure Firebase Console → **Authentication → Sign-in method → Email/Password** has **Email link (passwordless sign-in)** enabled.

---

## Step 7: Performance Verification

After deployment, run a quick check:

1. **Lighthouse Audit**: Open Chrome DevTools → Lighthouse → run a Performance + SEO audit.
2. **Compression**: In the Network tab, verify that `.js` files have `Content-Encoding: gzip` or `br`.
3. **Cache Headers**: Verify `.js` and `.ttf` files return `Cache-Control: public, max-age=31536000, immutable`.
4. **Security Headers**: Visit [securityheaders.com](https://securityheaders.com) and enter your domain.

---

## Troubleshooting

| Problem | Solution |
|:--------|:---------|
| **404 on page refresh** | Verify `.htaccess` is in `public_html/` root and `mod_rewrite` is enabled (it is by default on Hostinger). |
| **HTTPS redirect loop** | Comment out the HTTPS block in `.htaccess`, confirm SSL is active in hPanel, then re-enable. |
| **Fonts not loading** | Check that `assets/node_modules/@expo-google-fonts/` was uploaded with correct folder structure. |
| **Manager login fails** | Add your domain to Firebase Authorized Domains (Step 4). |
| **Blank white screen** | Open browser console — look for `net::ERR_ABORTED 404` on the JS bundle. Verify `_expo/static/js/web/index-*.js` exists. |
| **CORS errors on Firestore** | Firestore REST API allows any origin by default. If you added API key restrictions, ensure your domain is whitelisted. |

---

## Files Created / Modified for Deployment

| File | Purpose |
|:-----|:--------|
| `.htaccess` | HTTPS redirect, SPA fallback, compression, caching, security headers |
| `index.html` | Fixed paths from absolute `/kaweera-by-sheebo/...` to relative `./...`; added meta tags |
| `_expo/static/js/web/index-*.js` | Fixed 14 hardcoded asset paths from `/kaweera-by-sheebo/assets/...` to `./assets/...` |
| `manager/index.html` | Security patches (XSS escaping, image source validation) |
| `ARCHITECTURE.md` | Permanent architecture documentation |
| `DEPLOYMENT.md` | This file |
