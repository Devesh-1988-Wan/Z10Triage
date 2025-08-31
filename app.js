
// Z10 Dashboard - Vanilla JS widget framework (no build step)
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

// Registry populated by each widget module
const REGISTRY = window.Widgets = window.Widgets || {};

const state = {
  edit: false,
  theme: localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'),
  layout: [], // array of widget configs
  data: {},
};

const grid = $('#grid');

addEventListener('DOMContentLoaded', init);

async function init(){
  applyTheme(state.theme);
  bindUI();
  state.layout = await DB.loadLayout() || defaultLayout();
  state.data = await loadSampleData();
  render();
}

function applyTheme(t){ document.documentElement.dataset.theme=t; localStorage.setItem('theme', t); }

function bindUI(){
  $('#btn-theme').onclick = () => { state.theme = state.theme==='dark'?'light':'dark'; applyTheme(state.theme); };
  $('#btn-toggle-edit').onclick = () => { state.edit = !state.edit; $('#btn-toggle-edit').textContent = `Edit: ${state.edit?'On':'Off'}`; $$('.widget').forEach(w=>w.dataset.edit = state.edit); };
  $('#btn-reset').onclick = async ()=>{ if(confirm('Reset layout to defaults?')){ state.layout = defaultLayout(); await DB.saveLayout(state.layout); render(); }};
  $('#btn-export').onclick = exportJSON;
  $('#import-file').onchange = importJSON;
  $('#btn-add-widget').onclick = ()=> openModal();
}

async function loadSampleData(){
  const res = await fetch('data/sample-data.json');
  return res.json();
}

function render(){
  grid.innerHTML = '';
  state.layout.forEach(cfg => grid.appendChild(renderWidget(cfg)));
}

function renderWidget(cfg){
  const tpl = $('#tpl-widget');
  const el = tpl.content.firstElementChild.cloneNode(true);
  el.style.setProperty('--x', cfg.x);
  el.style.setProperty('--w', cfg.w);
  el.style.setProperty('--h', cfg.h);
  $('.title', el).textContent = cfg.title || cfg.type;
  el.dataset.id = cfg.id;
  if(state.edit) el.dataset.edit = 'true';

  // Body render via registry
  const body = $('.widget-b', el);
  const impl = REGISTRY[cfg.type];
  if(impl && impl.render){ impl.render(body, cfg, state.data); }
  else body.textContent = `Unknown widget: ${cfg.type}`;

  // Actions
  el.querySelector('[data-action="remove"]').onclick = async ()=>{
    if(!confirm('Remove widget?')) return;
    state.layout = state.layout.filter(w=>w.id!==cfg.id);
    await DB.saveLayout(state.layout); render();
  };
  el.querySelector('[data-action="config"]').onclick = ()=> openModal(cfg);

  // Drag/resize only in edit mode
  const dragHandle = el.querySelector('.drag-handle');
  const resizeHandle = el.querySelector('.resize');
  enableDragResize(el, dragHandle, resizeHandle);

  return el;
}

function enableDragResize(el, dragHandle, resizeHandle){
  function pos(e){ const r = grid.getBoundingClientRect(); const x = Math.max(0, e.clientX - r.left); const y = Math.max(0, e.clientY - r.top); return {x,y,r}; }
  function snapX(px){ const colW = (grid.clientWidth - 11*parseFloat(getComputedStyle(grid).gap))/12; return Math.min(12, Math.max(1, Math.round(px/ (colW + parseFloat(getComputedStyle(grid).gap)) ) + 1)); }
  function snapY(py){ const rowH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--row-h')); const gap = parseFloat(getComputedStyle(grid).gap); return Math.max(1, Math.round(py/ (rowH + gap)) ); }

  let moving = false, resizing = false, start, orig;

  const onMove = (e) => {
    if(!state.edit) return;
    const p = pos(e);
    if(moving){
      const x = snapX(p.x);
      el.style.setProperty('--x', x);
    }
    if(resizing){
      const x = snapX(p.x); const y = snapY(p.y);
      const w = Math.max(2, x - parseInt(getComputedStyle(el).getPropertyValue('--x')) + 1);
      const h = Math.max(1, y - 1);
      el.style.setProperty('--w', w);
      el.style.setProperty('--h', h);
    }
  };
  const onUp = async () => {
    if(!state.edit) return;
    if(moving || resizing){ await persistPosition(el); }
    moving = resizing = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp);
  };

  dragHandle.onmousedown = (e)=>{ if(!state.edit) return; moving = true; start = e; window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp); };
  resizeHandle.onmousedown = (e)=>{ if(!state.edit) return; resizing = true; start = e; window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp); };
}

async function persistPosition(el){
  const id = el.dataset.id;
  const x = parseInt(getComputedStyle(el).getPropertyValue('--x'));
  const w = parseInt(getComputedStyle(el).getPropertyValue('--w'));
  const h = parseInt(getComputedStyle(el).getPropertyValue('--h'));
  const item = state.layout.find(w=>w.id===id);
  Object.assign(item, {x,w,h});
  await DB.saveLayout(state.layout);
}

// Modal for add/edit
function openModal(cfg){
  const modal = $('#modal');
  modal.classList.add('open');
  const types = Object.keys(REGISTRY);
  const typeSel = $('#fld-type');
  typeSel.innerHTML = types.map(t=>`<option value="${t}">${t}</option>`).join('');
  $('#fld-title').value = cfg?.title || '';
  $('#fld-type').value = cfg?.type || types[0];
  $('#fld-source').value = cfg?.source || 'sample';
  $('#fld-query').value = cfg?.query || '';
  $('#fld-size').value = `${cfg?.w||6}x${cfg?.h||3}`;

  $('#btn-cancel').onclick = ()=> modal.classList.remove('open');
  $('#btn-save').onclick = async ()=>{
    const [w,h] = $('#fld-size').value.split('x').map(n=>parseInt(n)||3);
    const newCfg = {
      id: cfg?.id || crypto.randomUUID(),
      type: $('#fld-type').value,
      title: $('#fld-title').value || $('#fld-type').value,
      source: $('#fld-source').value,
      query: $('#fld-query').value,
      x: cfg?.x || 1, w, h
    };
    if(cfg){
      const ix = state.layout.findIndex(x=>x.id===cfg.id);
      state.layout[ix] = newCfg;
    } else {
      state.layout.push(newCfg);
    }
    await DB.saveLayout(state.layout);
    modal.classList.remove('open');
    render();
  };
}

function exportJSON(){
  const blob = new Blob([JSON.stringify({layout:state.layout, data: state.data}, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'z10dashboard-export.json'; a.click();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}

async function importJSON(e){
  const file = e.target.files[0]; if(!file) return;
  const text = await file.text();
  const obj = JSON.parse(text);
  if(obj.layout) state.layout = obj.layout;
  if(obj.data) state.data = obj.data;
  await DB.saveLayout(state.layout);
  render();
}

function defaultLayout(){
  return [
    {id: crypto.randomUUID(), type:'kpi', title:'Weekly Bugs Snapshot', source:'sample', query:'bugs.weeklySummary', x:1, w:6, h:2},
    {id: crypto.randomUUID(), type:'bar', title:'Issues by Month', source:'sample', query:'issues.monthly', x:7, w:6, h:3},
    {id: crypto.randomUUID(), type:'pie', title:'Bug Mix (Dev Done)', source:'sample', query:'bugs.devDoneMix', x:1, w:3, h:2},
    {id: crypto.randomUUID(), type:'pie', title:'Bug Mix (Reported)', source:'sample', query:'bugs.reportedMix', x:4, w:3, h:2},
    {id: crypto.randomUUID(), type:'table', title:'Customer Support – In Progress', source:'sample', query:'support.inProgress', x:7, w:6, h:3},
    {id: crypto.randomUUID(), type:'roadmap', title:'August Priorities', source:'sample', query:'roadmap.august', x:1, w:6, h:3}
  ];
}
