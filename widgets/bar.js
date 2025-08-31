
(function(){
  function drawBar(ctx, data, labels, colors){
    const w = ctx.canvas.width, h = ctx.canvas.height;
    const max = Math.max(...data, 1);
    const pad = 24; const bw = (w - pad*2) / data.length * 0.7;
    ctx.clearRect(0,0,w,h);
    ctx.font = '12px system-ui'; ctx.fillStyle = '#98a2b3';
    data.forEach((v,i)=>{
      const x = pad + i * ((w - pad*2)/data.length) + (((w - pad*2)/data.length)-bw)/2;
      const bh = (h - pad*2) * (v/max);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(x, h - pad - bh, bw, bh);
      ctx.fillStyle = '#98a2b3';
      ctx.fillText(labels[i], x, h - 6);
    });
  }

  window.Widgets = window.Widgets || {};
  window.Widgets.bar = {
    render(el, cfg, ds){
      el.innerHTML = '<canvas class="canvas"></canvas>';
      const canvas = el.querySelector('canvas');
      canvas.width = el.clientWidth; canvas.height = 260;
      const ctx = canvas.getContext('2d');
      const src = getPath(ds, cfg.query) || {labels:[], values:[]};
      const palette = ['#0ea5e9','#16a34a','#f59e0b','#ef4444'];
      drawBar(ctx, src.values, src.labels, palette);
      new ResizeObserver(()=>{ canvas.width = el.clientWidth; drawBar(ctx, src.values, src.labels, palette); }).observe(el);
    }
  };

  function getPath(o, p){ return p.split('.').reduce((a,k)=>a&&a[k], o); }
})();
