
(function(){
  window.Widgets = window.Widgets || {};
  window.Widgets.kpi = {
    render(el, cfg, ds){
      const src = getPath(ds, cfg.query) || [];
      const items = Array.isArray(src)? src : (src.items || []);
      const html = `<div class="kpis">${items.map(k=>{
        const cls = k.delta>=0 ? 'up' : 'down';
        const sign = k.delta>=0 ? '▲' : '▼';
        return `<div class="kpi"><div class="label">${k.label}</div><div class="value">${k.value}</div><div class="delta ${cls}">${sign} ${Math.abs(k.delta)}%</div></div>`;
      }).join('')}</div>`;
      el.innerHTML = html;
    }
  };
  function getPath(o, p){ return p.split('.').reduce((a,k)=>a&&a[k], o); }
})();
