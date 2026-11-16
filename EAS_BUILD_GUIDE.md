# 📱 Kaweera — EAS Build Guide (Android APK & iOS IPA)

> Step-by-step guide to build native Android and iOS apps from the Kaweera Expo project using EAS Build.

---

## ⚠️ Important: Source Code Required

> [!CAUTION]
> The files in this directory (`Kaweera v1.0.2/`) are the **static web export** — the pre-built web version. EAS Build requires the **Expo source project** (the original `.tsx`/`.ts` source files, `App.tsx`, screen components, etc.).
>
> The configuration files created below (`app.json`, `eas.json`, `package.json`) are **ready-to-use scaffolds**. You must place them in (or merge them into) your **source project root** — the directory where you run `npx expo start`.

If you have the source project elsewhere (e.g., a private repo), copy these config files into that project root.

---

## Prerequisites

### 1. Install EAS CLI globally
```bash
npm install -g eas-cli
```

### 2. Log in to your Expo account
```bash
eas login
# If you don't have an account: https://expo.dev/signup
```

### 3. Link your project
```bash
cd /path/to/your/kaweera-source-project
eas init
# This will create/update the "extra.eas.projectId" in app.json
```

---

## Created Configuration Files

### `app.json` — Mobile App Configuration

| Setting | Value | Notes |
|:--------|:------|:------|
| `ios.bundleIdentifier` | `com.y0ussef.kaweera` | Unique iOS app ID |
| `android.package` | `com.y0ussef.kaweera` | Unique Android package name |
| `icon` | `./assets/icon.png` | 512×512 ball logo |
| `splash.image` | `./assets/splash.png` | Arabic wordmark on `#06210F` |
| `splash.backgroundColor` | `#06210F` | Stadium dark green |
| `orientation` | `portrait` | Locked to portrait |
| `userInterfaceStyle` | `dark` | Dark mode by default |
| `scheme` | `kaweera` | Deep link scheme (`kaweera://`) |

### `eas.json` — Build Profiles

```
┌─────────────────┬────────────────────────┬────────────────────────┐
│ Profile         │ Android                │ iOS                    │
├─────────────────┼────────────────────────┼────────────────────────┤
│ development     │ APK (debug)            │ Simulator build        │
│ preview         │ APK (internal distro)  │ Device build (ad-hoc)  │
│ production      │ AAB (Google Play)      │ IPA (App Store)        │
└─────────────────┴────────────────────────┴────────────────────────┘
```

---

## Building

### 🤖 Android APK (Preview)
```bash
# Build an APK you can install directly on any Android device
eas build --profile preview --platform android
```
After the build completes (~10-15 min), EAS prints a download URL for the `.apk` file.

### 🤖 Android AAB (Production — Google Play)
```bash
eas build --profile production --platform android
```
This produces an `.aab` bundle for Google Play Store upload.

### 🍎 iOS Simulator Build (Development)
```bash
eas build --profile development --platform ios
```
Downloads a `.tar.gz` that can be dragged into the iOS Simulator.

### 🍎 iOS IPA (Preview — TestFlight/Ad-Hoc)
```bash
eas build --profile preview --platform ios
```

> [!NOTE]
> iOS builds require an **Apple Developer account** ($99/year). EAS will prompt you for your Apple ID and create the necessary provisioning profiles automatically.

### 🍎 iOS IPA (Production — App Store)
```bash
eas build --profile production --platform ios
```

---

## Submitting to Stores

### Google Play Store
1. Create a Google Play Console service account and download the JSON key.
2. Save it as `google-services-key.json` in the project root.
3. Run:
```bash
eas submit --platform android --profile production
```

### Apple App Store
1. Update the `submit.production.ios` section in `eas.json` with your:
   - `appleId` — your Apple ID email
   - `ascAppId` — App Store Connect app ID (numeric)
   - `appleTeamId` — your team ID
2. Run:
```bash
eas submit --platform ios --profile production
```

---

## Customizing the Bundle Identifier

If you want a different package name, update **both** files:

**`app.json`:**
```json
"ios": {
  "bundleIdentifier": "com.yourname.kaweera"
},
"android": {
  "package": "com.yourname.kaweera"
}
```

> [!WARNING]
> Once you publish to a store with a bundle identifier, you **cannot change it** without creating a new app listing. Choose carefully.

---

## Placeholder Values to Replace

| Placeholder | Location | What to put |
|:------------|:---------|:------------|
| `YOUR_EAS_PROJECT_ID` | `app.json` → `extra.eas.projectId` | Auto-filled by `eas init` |
| `YOUR_APPLE_ID@example.com` | `eas.json` → `submit.production.ios.appleId` | Your Apple ID email |
| `YOUR_APP_STORE_CONNECT_APP_ID` | `eas.json` → `submit.production.ios.ascAppId` | Numeric ID from App Store Connect |
| `YOUR_APPLE_TEAM_ID` | `eas.json` → `submit.production.ios.appleTeamId` | Found in Apple Developer portal |
| `google-services-key.json` | `eas.json` → `submit.production.android` | Google Play service account key |

---

## Asset Checklist

| Asset | Size Required | Current Source | Status |
|:------|:-------------|:---------------|:-------|
| `assets/icon.png` | 1024×1024 recommended (512×512 min) | `ball.*.png` (512×512) | ✅ Created |
| `assets/adaptive-icon.png` | 1024×1024 recommended | `ball.*.png` (512×512) | ✅ Created |
| `assets/splash.png` | 1284×2778 recommended | `wordmark-ar.*.png` (810×478) | ⚠️ Works but should be resized |
| `assets/favicon.png` | 48×48 recommended | `ball.*.png` (512×512) | ✅ Created |

> [!TIP]
> For a polished store listing, create a proper 1024×1024 icon and a full-screen splash image (1284×2778) with the Kaweera branding centered on `#06210F` background.
