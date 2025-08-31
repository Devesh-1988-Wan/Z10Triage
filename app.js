
// Z10Triage - offline-first triage board
// Accessibility, keyboard, drag-and-drop, IndexedDB persistence, export/import

const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

const columns = ['new','in_progress','blocked','done'];

const state = {
  items: [],
  filters: { q: '', priority: '', assignee: '' },
  theme: localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
};

document.addEventListener('DOMContentLoaded', init);

function init() {
  applyTheme(state.theme);
  registerSW();
  bindUI();
  loadItems();
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
}

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(console.warn);
  }
}

function bindUI() {
  $('#btn-theme').addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(state.theme);
    $('#btn-theme').setAttribute('aria-pressed', String(state.theme === 'dark'));
  });

  $('#btn-new').addEventListener('click', () => openDialog());
  $('#btn-clear').addEventListener('click', () => { state.filters = { q:'', priority:'', assignee:'' }; $('#search').value=''; $('#filter-priority').value=''; $('#filter-assignee').value=''; render(); });

  $('#search').addEventListener('input', (e)=> { state.filters.q = e.target.value; render(); });
  $('#filter-priority').addEventListener('change', (e)=> { state.filters.priority = e.target.value; render(); });
  $('#filter-assignee').addEventListener('input', (e)=> { state.filters.assignee = e.target.value; render(); });

  $('#btn-export').addEventListener('click', exportJSON);
  $('#import-file').addEventListener('change', importJSON);

  // Drag & Drop handlers
  $$('.dropzone').forEach(zone => {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', ()=> zone.classList.remove('dragover'));
    zone.addEventListener('drop', e => onDrop(e, zone.closest('.column').dataset.status));
  });

  // Keyboard move across columns
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    if (!active.classList.contains('card')) return;
    const id = active.dataset.id;
    if (e.ctrlKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      const item = state.items.find(it => it.id === id);
      const idx = columns.indexOf(item.status);
      const next = e.key === 'ArrowLeft' ? Math.max(0, idx-1) : Math.min(columns.length-1, idx+1);
      item.status = columns[next];
      DB.put(item).then(render);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      openDialog(state.items.find(it => it.id === id));
    } else if (e.key === 'Delete') {
      e.preventDefault();
      removeItem(id);
    }
  });
}

async function loadItems() {
  state.items = await DB.getAll();
  render();
}

function render() {
  const filters = state.filters;
  const norm = (s) => (s||'').toLowerCase();
  const q = norm(filters.q);

  const byStatus = Object.fromEntries(columns.map(c => [c, []]));
  state.items.forEach(it => {
    const hay = [it.title, it.description, (it.tags||[]).join(','), it.assignee].map(norm).join(' ');
    if (q && !hay.includes(q)) return;
    if (filters.priority && it.priority !== filters.priority) return;
    if (filters.assignee && norm(it.assignee) !== norm(filters.assignee)) return;
    byStatus[it.status||'new'].push(it);
  });

  $$('.column').forEach(col => {
    const status = col.dataset.status;
    const zone = $('.dropzone', col);
    zone.innerHTML = '';
    byStatus[status].sort(sorter).forEach(it => zone.appendChild(renderCard(it)));
    $('.count', col).textContent = String(byStatus[status].length);
  });
}

function sorter(a,b){
  const prioRank = {Critical:0, High:1, Medium:2, Low:3};
  if (prioRank[a.priority] !== prioRank[b.priority]) return prioRank[a.priority]-prioRank[b.priority];
  const da = a.due || '9999-12-31', db = b.due || '9999-12-31';
  return da.localeCompare(db);
}

function renderCard(it){
  const tpl = $('#card-template');
  const node = tpl.content.firstElementChild.cloneNode(true);
  node.dataset.id = it.id;
  $('.title', node).textContent = it.title;
  const desc = it.description?.trim();
  $('.desc', node).textContent = desc ? (desc.length>160? desc.slice(0,157)+'…' : desc) : '';
  const pill = $('.pill.priority', node);
  pill.textContent = it.priority;
  pill.dataset.priority = it.priority;
  $('.assignee', node).textContent = it.assignee ? `@${it.assignee}` : '';
  $('.tags', node).textContent = (it.tags||[]).map(t=>`#${t}`).join(' ');
  if (it.due) { const t = $('.due', node); t.dateTime = it.due; t.textContent = new Date(it.due).toLocaleDateString(); }

  node.addEventListener('dblclick', ()=> openDialog(it));
  node.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', it.id); });
  return node;
}

function onDrop(e, targetStatus){
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const it = state.items.find(x=>x.id===id);
  if (!it) return;
  it.status = targetStatus;
  DB.put(it).then(render);
}

function openDialog(item){
  const dlg = $('#item-dialog');
  const form = $('#item-form');
  form.reset();
  $('#btn-delete').hidden = !item;
  $('#dialog-title').textContent = item ? 'Edit Triage Item' : 'New Triage Item';
  if (item){
    form.title.value = item.title || '';
    form.description.value = item.description || '';
    form.priority.value = item.priority || 'High';
    form.severity.value = item.severity || 'S2';
    form.assignee.value = item.assignee || '';
    form.tags.value = (item.tags||[]).join(',');
    form.due.value = item.due || '';
    form.status.value = item.status || 'new';
    $('#item-id').value = item.id;
  } else {
    $('#item-id').value = '';
  }

  dlg.showModal();

  form.onsubmit = async (ev) => {
    ev.preventDefault();
    const id = $('#item-id').value || crypto.randomUUID();
    const payload = {
      id,
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      priority: form.priority.value,
      severity: form.severity.value,
      assignee: form.assignee.value.trim(),
      tags: form.tags.value.split(',').map(s=>s.trim()).filter(Boolean),
      due: form.due.value || null,
      status: form.status.value
    };
    await DB.put(payload);
    state.items = await DB.getAll();
    render();
    dlg.close();
  };

  $('#btn-delete').onclick = async () => {
    if (!$('#item-id').value) return;
    await DB.delete($('#item-id').value);
    state.items = await DB.getAll();
    render();
    dlg.close();
  };
}

function removeItem(id){ DB.delete(id).then(loadItems); }

function exportJSON(){
  const blob = new Blob([JSON.stringify(state.items, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'z10triage-export.json'; a.click();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
}

async function importJSON(e){
  const file = e.target.files[0];
  if (!file) return;
  const text = await file.text();
  const arr = JSON.parse(text);
  if (!Array.isArray(arr)) { alert('Invalid JSON'); return; }
  await DB.bulkPut(arr.map(x=> ({...x, id: x.id || crypto.randomUUID()})));
  state.items = await DB.getAll();
  render();
}
