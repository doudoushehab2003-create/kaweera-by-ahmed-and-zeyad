(() => {
  const api = window.KAWEERA_PASSKEY_API;
  const decode = s => Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')), c=>c.charCodeAt(0));
  const encode = b => b ? btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'') : null;
  async function call(path, body, bearer) {
    if (!api || new URL(api).protocol !== 'https:') throw new Error('Passkeys need server setup first.');
    const r = await fetch(api + '/' + path, {method:'POST',credentials:'omit',headers:{'Content-Type':'application/json',...(bearer?{Authorization:'Bearer '+bearer}:{})},body:JSON.stringify(body)});
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || 'Passkey request failed');
    return j;
  }
  function serialize(c) {
    const r = c.response;
    return {id:c.id,rawId:encode(c.rawId),type:c.type,clientExtensionResults:c.getClientExtensionResults(),
      response:{clientDataJSON:encode(r.clientDataJSON),
        ...(r.attestationObject?{attestationObject:encode(r.attestationObject),transports:r.getTransports?.()||[]}:
          {authenticatorData:encode(r.authenticatorData),signature:encode(r.signature),userHandle:encode(r.userHandle)})}};
  }
  window.managerPasskeys = {
    available:!!api && window.isSecureContext && !!window.PublicKeyCredential,
    async login() {
      const j = await call('login-options',{});
      j.options.challenge = decode(j.options.challenge);
      if(j.options.allowCredentials) j.options.allowCredentials.forEach(c=>c.id=decode(c.id));
      const c = await navigator.credentials.get({publicKey:j.options});
      return call('login-verify',{challengeId:j.challengeId,response:serialize(c)});
    },
    async register(bearer) {
      const j = await call('register-options',{},bearer);
      j.options.challenge = decode(j.options.challenge);
      j.options.user.id = decode(j.options.user.id);
      j.options.excludeCredentials?.forEach(c=>c.id=decode(c.id));
      const c = await navigator.credentials.create({publicKey:j.options});
      return call('register-verify',{challengeId:j.challengeId,response:serialize(c)},bearer);
    }
  };
})();
