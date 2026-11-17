import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { randomBytes, createHash } from 'node:crypto';
const source = readFileSync(new URL('./index.js', import.meta.url), 'utf8')
  .replace(/^import .*;$/gm, '').replace('export const managerPasskeys', 'globalThis.handler');
function fixture() {
  const rows = new Map();
  const db = {
    collection: col => ({doc: id => {
      const path = col+'/'+id;
      return {path,create: async value=>{assert.ok(!rows.has(path));rows.set(path,value)}};
    }}),
    runTransaction: async fn => fn({
      get:async ref=>({data:()=>rows.get(ref.path)}),
      delete:ref=>rows.delete(ref.path),set:(ref,value)=>rows.set(ref.path,value)
    })
  };
  const auth = {getUser:async()=>({uid:'owner',email:'ahmedabdelgawad11803@gmail.com',emailVerified:true}),
    verifyIdToken:async()=>({uid:'attacker',email:'ahmedabdelgawad11803@gmail.com',email_verified:true,auth_time:Date.now()/1000,firebase:{sign_in_provider:'password'}})};
  const context = vm.createContext({initializeApp(){},getAuth:()=>auth,getFirestore:()=>db,
    onRequest:(_,handler)=>handler,process:{env:{OWNER_UID:'owner'}},randomBytes,createHash,Buffer,TextEncoder,Date});
  vm.runInContext(source,context);
  return {context,auth};
}
test('challenge is bound to operation, expires, and cannot be replayed',async()=>{
  const {context:c}=fixture();
  c.id=await vm.runInContext("challenge('login','nonce')",c);
  await assert.rejects(vm.runInContext("consume(id,'register')",c));
  assert.equal(await vm.runInContext("consume(id,'login')",c),'nonce');
  await assert.rejects(vm.runInContext("consume(id,'login')",c));
  c.id=await vm.runInContext("challenge('login','expired')",c);
  vm.runInContext('Date = {now:()=>Number.MAX_SAFE_INTEGER}',c);
  await assert.rejects(vm.runInContext("consume(id,'login')",c));
});
test('enrollment rejects another UID even with matching email',async()=>{
  const {context:c}=fixture();
  await assert.rejects(vm.runInContext("enrollment({headers:{authorization:'Bearer bad'}},{uid:'owner'})",c));
});
test('owner must remain verified and enabled',async()=>{
  const {context:c,auth}=fixture();
  auth.getUser=async()=>({uid:'owner',email:'ahmedabdelgawad11803@gmail.com',emailVerified:true,disabled:true});
  await assert.rejects(vm.runInContext('owner()',c));
});
test('foreign origins rejected before authentication or database access',async()=>{
  const {context:c}=fixture();let status;
  await c.handler({headers:{origin:'https://evil.example'}},{set(){},status(s){status=s;return this},end(){}});
  assert.equal(status,403);
});
