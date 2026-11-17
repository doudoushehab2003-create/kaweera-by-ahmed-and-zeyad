import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { randomBytes, createHash } from 'node:crypto';
import { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server';
initializeApp();
const auth = getAuth();
// Dedicated database: never store credentials under unknown game database rules.
const db = getFirestore('manager-passkeys');
const origin = 'https://doudoushehab2003-create.github.io';
const rpID = 'doudoushehab2003-create.github.io';
const email = 'ahmedabdelgawad11803@gmail.com';
const key = value => createHash('sha256').update(value).digest('hex');
function requireValue(ok) { if (!ok) throw new Error('Denied'); }
async function owner() {
  requireValue(process.env.OWNER_UID);
  const u = await auth.getUser(process.env.OWNER_UID);
  requireValue(!u.disabled && u.emailVerified && u.email === email);
  return u;
}
async function enrollment(req, u) {
  const t = await auth.verifyIdToken((req.headers.authorization || '').replace(/^Bearer /, ''), true);
  requireValue(t.uid === u.uid && t.email === email && t.email_verified === true);
  requireValue(t.firebase?.sign_in_provider === 'password' && Date.now()/1000 - t.auth_time < 300);
}
async function challenge(kind, value) {
  const id = randomBytes(32).toString('base64url');
  await db.collection('challenges').doc(id).create({ kind, value, expires: Date.now()+180000 });
  return id;
}
async function consume(id, kind) {
  requireValue(typeof id === 'string' && /^[A-Za-z0-9_-]{43}$/.test(id));
  return db.runTransaction(async tx => {
    const ref = db.collection('challenges').doc(id), snap = await tx.get(ref), c = snap.data();
    requireValue(c && c.kind === kind && c.expires > Date.now());
    tx.delete(ref);
    return c.value;
  });
}
export const managerPasskeys = onRequest({ region: 'us-central1', maxInstances: 3, invoker: 'public' }, async (req, res) => {
  res.set('Cache-Control', 'no-store');
  if (req.headers.origin !== origin) return res.status(403).end();
  res.set('Access-Control-Allow-Origin', origin);
  res.set('Vary', 'Origin');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST' || !req.is('application/json') || JSON.stringify(req.body).length > 32768) return res.status(400).end();
  try {
    const u = await owner(), action = req.path.split('/').pop();
    // Shared quota persists across instances. Fail closed on storage errors.
    await db.runTransaction(async tx => {
      const ref = db.collection('limits').doc(key(req.ip || 'unknown'));
      const s = (await tx.get(ref)).data(), now = Date.now();
      const count = s && s.until > now ? s.count + 1 : 1;
      requireValue(count <= 30);
      tx.set(ref, { count, until: s && s.until > now ? s.until : now + 60000 });
    });
    if (action.startsWith('register')) await enrollment(req, u);
    if (action === 'register-options') {
      const existing = await db.collection('credentials').get();
      requireValue(existing.size < 10);
      const options = await generateRegistrationOptions({ rpName:'KAWEERA Manager', rpID,
        userID: new TextEncoder().encode(u.uid), userName: email, attestationType:'none',
        excludeCredentials:existing.docs.map(d=>({id:d.data().id})),
        authenticatorSelection:{residentKey:'required',userVerification:'required',authenticatorAttachment:'platform'} });
      return res.json({options, challengeId:await challenge('register',options.challenge)});
    }
    if (action === 'register-verify') {
      const expectedChallenge = await consume(req.body.challengeId,'register');
      const v = await verifyRegistrationResponse({response:req.body.response, expectedChallenge, expectedOrigin:origin, expectedRPID:rpID, requireUserVerification:true});
      requireValue(v.verified && v.registrationInfo);
      const c = v.registrationInfo.credential;
      await db.collection('credentials').doc(key(c.id)).create({id:c.id,publicKey:Buffer.from(c.publicKey).toString('base64url'),counter:c.counter,uid:u.uid});
      return res.json({verified:true});
    }
    if (action === 'login-options') {
      const options = await generateAuthenticationOptions({rpID,userVerification:'required'});
      return res.json({options,challengeId:await challenge('login',options.challenge)});
    }
    if (action === 'login-verify') {
      const expectedChallenge = await consume(req.body.challengeId,'login');
      requireValue(typeof req.body.response?.id === 'string');
      const ref = db.collection('credentials').doc(key(req.body.response.id));
      await db.runTransaction(async tx => {
        const c = (await tx.get(ref)).data();
        requireValue(c && c.uid === u.uid);
        const handle = req.body.response.response?.userHandle;
        requireValue(handle && Buffer.from(handle,'base64url').equals(Buffer.from(u.uid)));
        const v = await verifyAuthenticationResponse({response:req.body.response,expectedChallenge,expectedOrigin:origin,expectedRPID:rpID,requireUserVerification:true,
          credential:{id:c.id,publicKey:new Uint8Array(Buffer.from(c.publicKey,'base64url')),counter:c.counter}});
        requireValue(v.verified);
        tx.update(ref,{counter:v.authenticationInfo.newCounter});
      });
      await owner();
      return res.json({customToken:await auth.createCustomToken(u.uid)});
    }
    return res.status(404).end();
  } catch { return res.status(403).json({error:'Sign-in failed. Retry, or use a fresh owner email link to enroll.'}); }
});
