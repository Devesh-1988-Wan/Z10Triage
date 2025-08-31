
(function(){
  function drawPie(ctx, data, labels, colors){
    const w = ctx.canvas.width, h = ctx.canvas.height; const r = Math.min(w,h)/2 - 10; const cx = w/2, cy = h/2;
    ctx.clearRect(0,0,w,h);
    const total = data.reduce((a,b)=>a+b,0)||1; let start = -Math.PI/2;
    data.forEach((v,i)=>{
      const ang = v/total * Math.PI*2; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,start,start+ang); ctx.closePath(); ctx.fillStyle = colors[i%colors.length]; ctx.fill(); start += ang; });
    ctx.font='12px system-ui'; ctx.fillStyle='#98a2b3';
    // legend
    labels.forEach((lb,i)=>{ ctx.fillStyle=colors[i%colors.length]; ctx.fillRect(10,10+i*18,10,10); ctx.fillStyle='#98a2b3'; ctx.fillText(lb+` (${data[i]}%)`, 26, 19+i*18); });
  }

  window.Widgets = window.Widgets || {};
  window.Widgets.pie = {
    render(el, cfg, ds){
      el.innerHTML = '<canvas class="canvas"></canvas>';
      const canvas = el.querySelector('canvas');
      canvas.width = el.clientWidth; canvas.height = 260; const ctx = canvas.getContext('2d');
      const src = getPath(ds, cfg.query) || {labels:[], values:[]};
      const palette = ['#0ea5e9','#16a34a','#f59e0b','#ef4444','#a78bfa'];
      drawPie(ctx, src.values, src.labels, palette);
      new ResizeObserver(()=>{ canvas.width = el.clientWidth; drawPie(ctx, src.values, src.labels, palette); }).observe(el);
    }
  };

  function getPath(o, p){ return p.split('.').reduce((a,k)=>a&&a[k], o); }
})();
