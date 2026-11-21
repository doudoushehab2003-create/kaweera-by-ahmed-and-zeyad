// Kaweera XI hotfix for the published Expo/Metro bundle.
// Apply only to the known module IDs and exact source signatures; otherwise preserve originals.
// Remove this shim when the source application is rebuilt with the same rules.
(function(){
  "use strict";
  const edits={"419":[["F=(0,l.useMemo)(()=>('xi'===e?(0,h.shuffle)(y.LINEUPS.map((e,t)=>t)):(0,h.shuffle)(j.LISTS.map((e,t)=>t))).slice(0,k),[e,k])","F=(0,l.useMemo)(()=>{if(\"xi\"!==e)return(0,h.shuffle)(j.LISTS.map((e,t)=>t)).slice(0,k);const n=y.LINEUPS.filter(e=>(0,S.opponent)(e,y.LINEUPS)),t=(0,h.shuffle)(n)[0];if(!t)return[];const a=(0,S.matchKey)(t);return[t,y.LINEUPS.find(e=>e.id!==t.id&&(0,S.matchKey)(e)===a)].filter(Boolean).slice(0,Math.min(k,2)).map(e=>y.LINEUPS.indexOf(e))},[e,k])"]],"432":[["e.opponent=a,e.matchName=function","e.matchKey=b,e.opponent=a,e.matchName=function"],["function a(n,a){const o=/^(.*?final)/.exec(n.id)?.[1];if(!o)return null;const u=a.find(a=>a.id!==n.id&&a.team!==n.team&&/^(.*?final)/.exec(a.id)?.[1]===o);return u?u.team:null}","function b(n){const a=/^(.*?final)/.exec(n.id)?.[1];return a?`${a}:${n.year}:${/-2$/.test(n.id)?\"replay\":\"original\"}`:null}function a(n,a){const o=b(n);if(!o||11!==n.players?.length)return null;const u=a.filter(n=>b(n)===o);return 2===u.length&&u.every(n=>11===n.players?.length)&&u[0].team!==u[1].team?u.find(a=>a.id!==n.id)?.team??null:null}"]],"500":[["'xi'===E?(0,e.shuffle)(n.LINEUPS).slice(0,u).map(e=>e.id)","'xi'===E?(()=>{const g=new Map;for(const t of n.LINEUPS){const a=/^(.*?final)/.exec(t.id)?.[1];if(!a||11!==t.players.length)continue;const k=`${a}:${t.year}:${/-2$/.test(t.id)?\"replay\":\"original\"}`;g.set(k,[...g.get(k)??[],t])}const p=[...g.values()].filter(t=>2===t.length&&t[0].team!==t[1].team);return(0,e.shuffle)(p)[0]?.map(t=>t.id)??[]})()"]],"527":[["X=(0,i.useMemo)(()=>(0,$.shuffle)(I.LINEUPS.map((e,t)=>t)),[])","X=(0,i.useMemo)(()=>(0,$.shuffle)(I.LINEUPS.map((e,t)=>(0,P.opponent)(e,I.LINEUPS)?t:-1).filter(e=>e>=0)),[])"]],"528":[["const l=/^(.*?final)/.exec(t.id)?.[1];l&&e.set(l,[...e.get(l)??[],t])}return[...e.values()].filter(e=>2===e.length&&e[0].team!==e[1].team)","const l=(0,$.matchKey)(t);l&&11===t.players.length&&e.set(l,[...e.get(l)??[],t])}return[...e.values()].filter(e=>2===e.length&&e[0].team!==e[1].team&&e[0].year===e[1].year)"]],"561":[["xi:[1,3,5],top10","xi:[1,2],top10"]]};
  const status={patched:[],skipped:[]};
  globalThis.__KAWEERA_XI_PATCH_STATUS__=status;
  function wrap(define){
    if(define.__kaweeraXiWrapped)return define;
    function patched(factory,id,deps){
      const rules=edits[id];
      if(!rules)return define(factory,id,deps);
      let source=Function.prototype.toString.call(factory);
      for(const [before,after] of rules){
        if(source.split(before).length!==2){
          status.skipped.push(id);
          console.warn("Kaweera XI patch skipped: unexpected module",id);
          return define(factory,id,deps);
        }
        source=source.replace(before,after);
      }
      try{
        const replacement=Function("return ("+source+");")();
        status.patched.push(id);
        return define(replacement,id,deps);
      }catch(error){
        status.skipped.push(id);
        console.warn("Kaweera XI patch failed; using original module",id,error);
        return define(factory,id,deps);
      }
    }
    patched.__kaweeraXiWrapped=true;
    return patched;
  }
  if(typeof globalThis.__d==="function"){
    globalThis.__d=wrap(globalThis.__d);
  }else{
    let value=globalThis.__d;
    Object.defineProperty(globalThis,"__d",{
      configurable:true,
      enumerable:true,
      get(){return value;},
      set(next){value=typeof next==="function"?wrap(next):next;}
    });
  }
})();
