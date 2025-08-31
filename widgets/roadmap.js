
(function(){
  window.Widgets = window.Widgets || {};
  window.Widgets.roadmap = {
    render(el, cfg, ds){
      const src = getPath(ds, cfg.query) || [];
      el.innerHTML = `<ol>${src.slice(0,20).map(it=>`<li><strong>${it.title}</strong> — <em>${it.status}</em> <span class="badge">${it.priority}</span></li>`).join('')}</ol>`;
    }
  };
  function getPath(o, p){ return p.split('.').reduce((a,k)=>a&&a[k], o); }
})();
