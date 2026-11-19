(function(){
  var sec=document.getElementById('pour'),v=document.getElementById('pour-video'),bar=document.getElementById('pour-bar');
  var copies=[].slice.call(document.querySelectorAll('.pc'));
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var target=0,cur=0,dur=12;
  function prog(){var r=sec.getBoundingClientRect(),max=sec.offsetHeight-window.innerHeight;return Math.min(1,Math.max(0,-r.top/max));}
  function show(p){copies.forEach(function(c){c.classList.toggle('on',p>=+c.dataset.from&&p<+c.dataset.to);});bar.style.transform='scaleX('+p+')';}
  function tick(){
    target=prog(); cur+= (target-cur)*0.14; if(Math.abs(target-cur)<0.0005)cur=target;
    if(v.readyState>0&&v.duration){dur=v.duration; var t=Math.min(dur-0.04,cur*dur); if(Math.abs(v.currentTime-t)>0.02)v.currentTime=t;}
    show(target); requestAnimationFrame(tick);
  }
  if(reduce){v.removeAttribute('src');v.style.display='none';sec.classList.add('static');show(0.5);return;}
  v.addEventListener('loadedmetadata',function(){v.currentTime=0;});
  v.load();
  var pr=v.play(); if(pr&&pr.then){pr.then(function(){v.pause();v.currentTime=0;}).catch(function(){});}
  requestAnimationFrame(tick);
})();
