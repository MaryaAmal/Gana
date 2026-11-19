(function(){
  document.getElementById('year').textContent=new Date().getFullYear();
  var hero=document.querySelector('.hero');
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var cans=[].slice.call(document.querySelectorAll('.can')),k=[10,16,24];
  hero.addEventListener('mousemove',function(e){
    var x=(e.clientX/window.innerWidth-.5),y=(e.clientY/window.innerHeight-.5);
    cans.forEach(function(c,i){c.style.setProperty('--px',(-x*k[i])+'px');c.style.setProperty('--py',(-y*k[i]*.6)+'px');});
  });
})();
