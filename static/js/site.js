(function(){
  function ready(fn){
    if(document.readyState !== 'loading'){ fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  ready(function(){
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if(!toggle || !links) return;
    toggle.addEventListener('click', function(){
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
})();