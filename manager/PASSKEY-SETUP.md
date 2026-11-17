# KAWEERA Manager passkey setup

Direct URL: https://doudoushehab2003-create.github.io/kaweera-by-sheebo/manager/

## Status and authorization audit

This repository originally contained a static published Expo game and a standalone Manager. Manager uses Firebase Authentication REST email-link sign-in, localStorage refresh-token persistence, and direct Firestore REST requests in project kora-w-bas. Its stored-email UI check is not authorization. Startup now also validates the saved session with Firebase account lookup. Firestore rules remain the actual protection for reads and writes.

No deployed Firestore rules, backend source, Firebase administrator connection, or owner UID was available for this change. Live owner authorization could not be verified. Passkeys therefore ship disabled (empty API URL); existing email sign-in remains.

## Required administrator setup

1. In Firebase Authentication for kora-w-bas, find the existing verified owner account ahmedabdelgawad11803@gmail.com. Copy its UID; do not create a replacement account. Ensure email-link sign-in is enabled and doudoushehab2003-create.github.io is an authorized domain.
2. Audit the default database rules before enabling passkeys. Manager-only reads/writes must require the exact owner UID and verified owner email. Preserve valid player permissions, but check overlapping wildcard rules: any matching allow grants access. Test unauthenticated users, ordinary players, and forged owner data cannot access manager records or change balances. This change intentionally does not replace unknown game rules.
3. Create a separate Firestore Native database named manager-passkeys. Apply the supplied deny-all rules to that database ONLY. Never apply those rules to the game's default database. Admin SDK accesses it via IAM; clients must have no access even with an owner ID token.
4. With Node 22+, Firebase CLI, billing enabled for functions, and administrator access: run npm install in passkey-backend, review dependency audit, retain the resulting lockfile, and run npm test. Put OWNER_UID=the-existing-owner-uid in passkey-backend/.env.kora-w-bas (ignored by Git). Do not put credentials or service-account keys in GitHub.
5. From the repository root, deploy rules with firebase deploy --project kora-w-bas --only firestore, then the function with firebase deploy --project kora-w-bas --only functions:manager-passkeys. The supplied firebase.json targets only the named passkey database. Confirm the database/rules exist before deploying the function.
6. Give the function runtime service account only the necessary Firestore and Firebase Auth access and permission to sign custom tokens (IAM signBlob / Service Account Token Creator on the signing service account). Enable the IAM API if needed. Use managed runtime credentials.
7. Test the deployed endpoint and the default database authorization with real accounts before activation. Then set window.KAWEERA_PASSKEY_API in manager/passkey-config.js to the HTTPS URL returned for managerPasskeys, without a trailing slash, and publish.

## Owner enrollment and Mac setup

Open the direct Manager URL in Safari. Sign in using a NEW owner email link, then choose Add a passkey within five minutes. Enrollment requires a recently authenticated verified owner; a remembered session or passkey session alone cannot enroll another key. Keep email access for recovery.

After enrollment, use Safari File > Add to Dock (macOS Sonoma 14 or later). Open the Dock app and, if it has no saved session, select Sign in with Touch ID / passkey. Safari and Dock apps may have separate storage: do not assume the saved session transfers. macOS chooses Touch ID or its permitted device-unlock fallback; a website cannot require a fingerprint specifically. Sessions persist in each app's storage until sign-out, revocation, expiration, or storage removal. This is not a Touch ID lock on every launch.

No service worker caches Manager or its private API responses. Its own manifest starts in /manager/, not the game. Browser storage is not an encrypted credential vault; scripts on this GitHub Pages origin share the origin. Keep all sites under this account trusted and audit content injection.

## Security, recovery, and verification

The backend checks exact HTTPS origin and RP hostname, signature, required user verification, credential owner and user handle, and counters. Random challenges expire after three minutes and are transactionally consumed once. Enrollment checks revoked tokens, recent auth_time, exact UID, verified email, and the email/password provider used by Firebase email links. Successful assertions mint a Firebase custom token for that existing UID; game authorization is not changed.

Registration is limited to ten keys. To revoke a lost key, an administrator deletes its credential document in manager-passkeys/credentials, and revokes the owner's Firebase refresh tokens to invalidate saved sessions. Disable the owner account for emergency lockout. Deleting a passkey alone does not invalidate existing Firebase sessions. Recover via a fresh owner email link and enroll again. Configure retention cleanup for expired challenge and rate-limit documents; the current expiry is enforced by code, not Firestore TTL. Review abuse monitoring and quotas before public activation.

Automated tests cover one-time/expired/wrong-operation challenges, wrong-owner enrollment, disabled owner, and foreign origins using mocked storage/Auth. Frontend scripts were syntax checked. These tests do not replace real cryptographic, emulator, and browser acceptance tests. Before activation test invalid signatures, wrong RP/origin, missing UV, replay/concurrent requests, revoked/stale enrollment, disabled owner, unknown credentials, cancellation, token refresh, sign-out, and Safari/Dock relaunch. A physical Touch ID test requires the owner.

References:
- https://simplewebauthn.dev/docs/packages/server
- https://firebase.google.com/docs/auth/admin/create-custom-tokens
- https://support.apple.com/104996
