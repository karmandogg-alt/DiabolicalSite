// download.js — render descargas, copiar SHA, feedback, OS detect
const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
const esc = s=> String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const t = (obj)=> typeof obj === 'string' ? obj : (obj?.[document.documentElement.getAttribute('data-lang')] ?? obj?.es ?? '');
function setLang(lang){ document.documentElement.setAttribute('data-lang', lang); localStorage.setItem('l2j_lang', lang); }
$('#lang-es')?.addEventListener('click', ()=> setLang('es'));
$('#lang-en')?.addEventListener('click', ()=> setLang('en'));
setLang(localStorage.getItem('l2j_lang') || 'es');

const data = JSON.parse(document.getElementById('downloads-data').textContent);
const osName = document.getElementById('os-name');
(function detectOS(){
  const ua = navigator.userAgent.toLowerCase();
  let name = 'Windows';
  if (/mac|iphone|ipad|ipod/.test(ua)) name = 'macOS';
  else if (/linux/.test(ua)) name = 'Linux';
  osName.textContent = name;
})();

function card(p){
  const mirrors = (p.mirrors||[]).map(m=>`
    <a href="${esc(m.url)}" class="btn-primary dl-start" data-url="${esc(m.url)}">
      <i class="fa-solid fa-download"></i> ${esc(m.name)}
    </a>`).join('');
  return `
    <article class="dl-card">
      <div class="card-title">${esc(t(p.kind))}</div>
      <div class="card-desc">${esc(t(p.description))}</div>
      <div class="flex flex-wrap gap-2 mb-3">
        <span class="badge"><i class="fa-solid fa-code-branch"></i> v${esc(p.version)}</span>
        <span class="badge"><i class="fa-solid fa-file-zipper"></i> ${esc(p.size)}</span>
        <span class="badge"><i class="fa-solid fa-file"></i> ${esc(p.file)}</span>
      </div>
      <div class="card-actions">
        ${mirrors}
        <button class="btn-ghost copy-btn" data-copy="${esc(p.sha256)}"><i class="fa-regular fa-clone"></i> <span data-lang="es">Copiar SHA-256</span><span data-lang="en">Copy SHA-256</span></button>
      </div>
      <div class="progress-fake"><i></i></div>
    </article>
  `;
}

(function render(){
  const panel = document.getElementById('panel-windows');
  panel.innerHTML = (data.windows||[]).map(card).join('');

  // copiar sha
  $$('.copy-btn', panel).forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const val = btn.getAttribute('data-copy') || '';
      try{
        await navigator.clipboard.writeText(val);
        const prev = btn.innerHTML;
        btn.innerHTML = `<span class="copy-ok">✔</span> ${document.documentElement.getAttribute('data-lang')==='es'?'¡Copiado!':'Copied!'}`;
        setTimeout(()=> btn.innerHTML = prev, 1200);
      }catch{
        alert((document.documentElement.getAttribute('data-lang')==='es'?'No se pudo copiar:\n':'Copy failed:\n') + val);
      }
    });
  });

  // feedback de descarga
  $$('.dl-start', panel).forEach(a=>{
    a.addEventListener('click', ()=>{
      const bar = a.closest('.dl-card').querySelector('.progress-fake');
      if (!bar) return;
      bar.style.display='block';
      setTimeout(()=> bar.style.display='none', 3200);
    });
  });

  // checksums
  const ck = document.getElementById('checksums');
  ck.innerHTML = (data.windows||[]).map(p=>`
    <div class="dl-card">
      <div class="font-semibold mb-1">${esc(p.file)}</div>
      <div class="codebox break-all">${esc(p.sha256)}</div>
    </div>`).join('');

  // Discord CTA
  const dl = document.getElementById('discord-link');
  if (dl && data.discord) dl.href = data.discord;
})();
