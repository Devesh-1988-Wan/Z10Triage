
(function(){
  function drawTrend(ctx, data, labels, color){
    const w = ctx.canvas.width, h = ctx.canvas.height; const pad=24; ctx.clearRect(0,0,w,h);
    const max = Math.max(...data,1), min=Math.min(...data,0);
    const dx = (w - pad*2) / Math.max(1,data.length-1);
    ctx.strokeStyle = color; ctx.lineWidth=2; ctx.beginPath();
    data.forEach((v,i)=>{ const x=pad+i*dx; const y = h-pad - (h-pad*2)*( (v-min)/(max-min||1) ); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
    ctx.stroke();
  }
  window.Widgets = window.Widgets || {};
  window.Widgets.trend = {
    render(el, cfg, ds){
      el.innerHTML = '<canvas class="canvas"></canvas>';
      const c = el.querySelector('canvas'); c.width = el.clientWidth; c.height = 260; const ctx=c.getContext('2d');
      const src = getPath(ds, cfg.query) || {labels:[], values:[]};
      drawTrend(ctx, src.values, src.labels, '#0ea5e9');
      new ResizeObserver(()=>{ c.width = el.clientWidth; drawTrend(ctx, src.values, src.labels, '#0ea5e9'); }).observe(el);
    }
  };
  function getPath(o, p){ return p.split('.').reduce((a,k)=>a&&a[k], o); }
})();
