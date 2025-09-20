// site.js — idioma, nav activo, helpers compartidos
const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));

function setLang(lang){
  document.documentElement.setAttribute('data-lang', lang);
  localStorage.setItem('l2j_lang', lang);
}
$('#lang-es')?.addEventListener('click', ()=> setLang('es'));
$('#lang-en')?.addEventListener('click', ()=> setLang('en'));
setLang(localStorage.getItem('l2j_lang') || 'es');

// Marcar activo en el menú según URL
(function highlightNav(){
  const path = location.pathname.split('/').pop() || 'index.html';
  const map = {
    'index.html':'home',
    'information.html':'info',
    'download.html':'download'
  };
  const key = map[path] || 'home';
  $$('a[data-nav]').forEach(a=>{
    a.classList.toggle('active', a.dataset.nav===key);
  });
})();
