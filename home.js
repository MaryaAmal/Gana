(function(){
  var slides=[].slice.call(document.querySelectorAll('.slide')),dots=[].slice.call(document.querySelectorAll('.steps button'));
  var bottle=document.querySelector('.c-bottle'),i=0,timer=null;
  var rot=[18,-12,28,6],sc=[1,1.06,.96,1.04];
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('year').textContent=new Date().getFullYear();
  function go(n){
    i=(n+slides.length)%slides.length;
    slides.forEach(function(s,k){s.classList.toggle('on',k===i);s.setAttribute('aria-hidden',k===i?'false':'true');});
    dots.forEach(function(d,k){d.classList.toggle('on',k===i);});
    bottle.style.setProperty('--r',rot[i]+'deg');bottle.style.setProperty('--s',sc[i]);
  }
  function play(){ if(reduce)return; stop(); timer=setInterval(function(){go(i+1);},6500); }
  function stop(){ if(timer){clearInterval(timer);timer=null;} }
  dots.forEach(function(d){d.addEventListener('click',function(){go(+d.dataset.go);play();});});
  document.querySelector('.c-next').addEventListener('click',function(){go(i+1);play();});
  document.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){go(i+1);play();}if(e.key==='ArrowLeft'){go(i-1);play();}});
  var card=document.querySelector('.card');card.addEventListener('mouseenter',stop);card.addEventListener('mouseleave',play);
  go(0);play();
})();
