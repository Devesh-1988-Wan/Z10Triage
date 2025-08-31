
const DB_NAME = 'z10dashboard';
const DB_VERSION = 1;

function openDB(){
  return new Promise((resolve, reject)=>{
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e)=>{
      const db = e.target.result;
      if(!db.objectStoreNames.contains('layout')) db.createObjectStore('layout', {keyPath:'id'});
      if(!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
    };
    req.onsuccess = ()=> resolve(req.result);
    req.onerror = ()=> reject(req.error);
  });
}

async function saveLayout(layout){
  const db = await openDB();
  return new Promise((res, rej)=>{
    const tx = db.transaction('kv','readwrite');
    tx.objectStore('kv').put(layout, 'layout');
    tx.oncomplete = ()=>res();
    tx.onerror = ()=>rej(tx.error);
  });
}

async function loadLayout(){
  const db = await openDB();
  return new Promise((res, rej)=>{
    const tx = db.transaction('kv','readonly');
    const req = tx.objectStore('kv').get('layout');
    req.onsuccess = ()=> res(req.result || null);
    req.onerror = ()=> rej(req.error);
  });
}

window.DB = { saveLayout, loadLayout };
