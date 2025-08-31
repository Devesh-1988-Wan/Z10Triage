
const CACHE='z10dash-v1';
const ASSETS=['/','/index.html','/styles.css','/app.js','/db.js','/manifest.webmanifest','/data/sample-data.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))))})
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(cc=>cc.put(e.request,cp));return r;}).catch(()=>c)))})
