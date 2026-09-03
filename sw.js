const CACHE='ritmi-static-v0.12.0';
const ASSETS=['./','./index.html','./styles.css?v=12','./app.js?v=12','./manifest.json','./icon.svg','./404.html'];
const DB_NAME='nijritu-local';
const STORE='state';
self.addEventListener('install',function(event){event.waitUntil(caches.open(CACHE).then(function(cache){return cache.addAll(ASSETS);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(event){event.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(event){
  if(event.request.method!=='GET') return;
  var url=new URL(event.request.url);
  if(url.origin!==location.origin) return;
  event.respondWith(
    fetch(event.request).then(function(response){
      if(response && response.ok){var copy=response.clone();caches.open(CACHE).then(function(cache){cache.put(event.request,copy);});}
      return response;
    }).catch(function(){return caches.match(event.request).then(function(cached){return cached||caches.match('./index.html');});})
  );
});
function openDB(){return new Promise(function(resolve,reject){var r=indexedDB.open(DB_NAME,4);r.onsuccess=function(){resolve(r.result);};r.onerror=function(){reject(r.error);};r.onupgradeneeded=function(){if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE);};});}
function readState(){return openDB().then(function(db){return new Promise(function(resolve,reject){var r=db.transaction(STORE,'readonly').objectStore(STORE).get('state');r.onsuccess=function(){resolve(r.result);};r.onerror=function(){reject(r.error);};});});}
function localDate(timeZone){try{return new Intl.DateTimeFormat('en-CA',{timeZone:timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}catch(e){return new Date().toISOString().slice(0,10);}}
self.addEventListener('periodicsync',function(event){if(event.tag!=='nijritu-reminder')return;event.waitUntil((async function(){try{var s=await readState();var r=s&&s.settings&&s.settings.reminder;if(!r||!r.enabled)return;var date=localDate(r.timeZone);if(r.lastNotified===date)return;await self.registration.showNotification('Ritmi',{body:'Take a moment to log today if you want to keep your cycle history current.',tag:'ritmi-daily-log',icon:'./icon.svg',data:{url:'./'}});var db=await openDB();s.settings=Object.assign({},s.settings,{reminder:Object.assign({},r,{lastNotified:date})});await new Promise(function(resolve,reject){var tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(s,'state');tx.oncomplete=resolve;tx.onerror=function(){reject(tx.error);};});}catch(e){console.error('Ritmi reminder failed',e);}})();});
self.addEventListener('notificationclick',function(event){event.notification.close();event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(function(list){for(var i=0;i<list.length;i++){if('focus' in list[i])return list[i].focus();}return clients.openWindow('./');}));});
