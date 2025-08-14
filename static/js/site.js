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

function copyToClipboard(el) {
  const text = el.getAttribute('data-copy');
  navigator.clipboard.writeText(text).then(() => {
       alert('کپی شد!');
  });
}
