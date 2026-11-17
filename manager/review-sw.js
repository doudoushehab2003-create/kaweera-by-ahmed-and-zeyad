self.addEventListener('push',event=>{
 let data={};try{data=event.data?.json()||{};}catch{}
 event.waitUntil(self.registration.showNotification('KAWEERA review',{body:'A new submission or report needs your review.',tag:data.tag||'kaweera-review',renotify:false,data:{url:typeof data.url==='string'&&data.url.startsWith('/kaweera-by-sheebo/manager/')?data.url:'/kaweera-by-sheebo/manager/'}}));
});
self.addEventListener('notificationclick',event=>{event.notification.close();const url=new URL(event.notification.data.url,self.location.origin).href;event.waitUntil((async()=>{const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});const match=windows.find(c=>c.url.startsWith(self.registration.scope));if(match){await match.navigate(url);return match.focus();}return self.clients.openWindow(url);})());});
