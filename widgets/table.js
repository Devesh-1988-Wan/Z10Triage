
(function(){
  window.Widgets = window.Widgets || {};
  window.Widgets.table = {
    render(el, cfg, ds){
      const src = getPath(ds, cfg.query) || {columns:[], rows:[]};
      const th = src.columns.map(c=>`<th>${c}</th>`).join('');
      const tr = src.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('');
      el.innerHTML = `<div style="overflow:auto"><table class="table"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table></div>`;
    }
  };
  function getPath(o, p){ return p.split('.').reduce((a,k)=>a&&a[k], o); }
})();
