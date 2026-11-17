/* Owner-only API: Firebase verifies every request; the browser never awards official points. */
(()=>{
const API=window.KAWEERA_COMPETITION_API||'https://us-central1-kora-w-bas.cloudfunctions.net/competitionApi';
const tabs=document.querySelector('.tabs'),button=document.createElement('button');button.textContent='Reviews & reports';button.id='review-tab';tabs.append(button);
const section=document.createElement('section');section.id='reviews';section.hidden=true;section.innerHTML='<h2>Reviews & fair play</h2><p>Competition points become official only after your review. Corrections replace the previous decision and recalculate standings.</p><button id="review-refresh">Refresh</button> <button id="push-enable">Enable notifications</button> <button id="push-disable">Disable notifications</button><p id="review-message" role="status"></p><div id="review-items"></div><h3>Player and answer reports</h3><div id="report-items"></div><h3>Recently reviewed — correct a decision</h3><div id="review-history"></div>';tabs.after(section);
const say=s=>document.querySelector('#review-message').textContent=s;
async function api(action,body={}){const r=await fetch(API+'/'+action,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+await token()},body:JSON.stringify(body)});const j=await r.json();if(!r.ok)throw Error(j.error||'Request failed');return j;}
const node=(tag,value)=>{const e=document.createElement(tag);e.textContent=value;return e;};
function renderItem(item,target){
 const box=document.createElement('details');box.id='review-'+item.id;box.append(node('summary',`${item.name} · ${item.mode} · ${new Date(item.createdAt).toLocaleString()} · ${item.status==='reviewed'?item.points+' confirmed pts':'Awaiting review'}`));
 const inputs=item.answers.map(a=>{const row=document.createElement('div');row.style.cssText='padding:12px;border-bottom:1px solid #555';row.append(node('strong',a.question),node('p','Submitted: '+a.answer));const expected=document.createElement('input');expected.value=a.expected;expected.setAttribute('aria-label','Correct answer');const select=document.createElement('select');for(const [value,label] of [['false','Incorrect'],['true','Correct']]){const o=node('option',label);o.value=value;select.append(o);}select.value=String(a.correct);row.append(node('label','Expected answer / corrected answer key'),expected,node('label',' Decision '),select);let verdict;
 if(a.kind==='prediction'){verdict=document.createElement('select');for(const v of ['exact','result']){const o=node('option',v==='exact'?'Exact score — 5 pts':'Right outcome — 2 pts');o.value=v;verdict.append(o);}verdict.value=a.verdict||'exact';row.append(verdict);}
 box.append(row);return {a,expected,select,verdict};});
 const save=node('button','Save review / recalculate points');save.onclick=async()=>{save.disabled=true;try{await api('review',{id:item.id,revision:item.revision,decisions:inputs.map(({a,expected,select,verdict})=>({id:a.id,expected:expected.value,correct:select.value==='true',verdict:verdict?.value||'exact'}))});say('Review saved. Standings recalculated.');await refresh();}catch(e){say(e.message);}finally{save.disabled=false;}};box.append(save);
 const audit=node('button','Show audit history');audit.onclick=async()=>{try{const r=await api('audit',{id:item.id});const pre=node('pre',JSON.stringify(r.items,null,2));pre.style.whiteSpace='pre-wrap';box.append(pre);}catch(e){say(e.message);}};box.append(audit);target.append(box);
}
async function refresh(){try{const q=await api('queue');button.textContent=`Reviews (${q.count}) · Reports (${q.reports.length})`;for(const [selector,items] of [['#review-items',q.pending],['#review-history',q.recent]]){const el=document.querySelector(selector);el.replaceChildren();items.forEach(i=>renderItem(i,el));}
 const reports=document.querySelector('#report-items');reports.replaceChildren();q.reports.forEach(r=>{const box=document.createElement('div');box.style.padding='12px';box.id='review-'+r.id;box.append(node('strong',r.kind==='player'?'Reported username: '+r.username:'Answer report'),node('p',r.reason),node('p',r.context),node('small',new Date(r.createdAt).toLocaleString()));const input=document.createElement('textarea');input.placeholder='Your review notes / resolution';const resolve=node('button','Resolve report');resolve.onclick=async()=>{if(!input.value.trim())return;resolve.disabled=true;try{await api('resolve-report',{id:r.id,resolution:input.value});await refresh();}catch(e){say(e.message);resolve.disabled=false;}};box.append(input,resolve);reports.append(box);});
 const id=location.hash.match(/^#review=([a-f0-9]{64})$/)?.[1];if(id){const item=document.getElementById('review-'+id);if(item){item.open=true;item.scrollIntoView({block:'center'});}}
 }catch(e){say(e.message+' Check backend deployment and owner sign-in.');}}
button.onclick=()=>{document.querySelectorAll('section').forEach(s=>s.hidden=s!==section);section.hidden=false;refresh();};
tabs.addEventListener('click',e=>{if(e.target.closest('[data-t]'))section.hidden=true;});
document.querySelector('#review-refresh').onclick=refresh;
function keyBytes(s){const raw=atob(s.replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(raw,c=>c.charCodeAt(0));}
document.querySelector('#push-enable').onclick=async()=>{
 try{if(!('serviceWorker'in navigator)||!('PushManager'in window)||!('Notification'in window))throw Error('Push is unavailable in this browser. Use the Manager review badge.');
 const permission=await Notification.requestPermission();if(permission!=='granted')throw Error('Notifications were not allowed. You can enable them in browser settings.');
 const {publicKey}=await api('push-config');if(!publicKey)throw Error('Push credentials have not been configured on the server.');
 const reg=await navigator.serviceWorker.register('./review-sw.js',{scope:'./'});await navigator.serviceWorker.ready;
 const sub=await reg.pushManager.getSubscription()||await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:keyBytes(publicKey)});await api('subscribe',{subscription:sub.toJSON()});say('Notifications enabled on this device.');
 }catch(e){say(e.message);}
};
document.querySelector('#push-disable').onclick=async()=>{try{const reg=await navigator.serviceWorker.getRegistration('./');const sub=await reg?.pushManager.getSubscription();if(sub){await api('unsubscribe',{endpoint:sub.endpoint});await sub.unsubscribe();}say('Notifications disabled on this device.');}catch(e){say(e.message);}};
setInterval(()=>{if(session&&!document.hidden)refresh();},30000);
if(location.hash.startsWith('#review='))button.click();
})();
