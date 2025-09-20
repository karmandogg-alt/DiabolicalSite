// index.js — render home + contador + hero sync + faq
const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
const esc = s=> String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const t = (obj, lang)=> typeof obj === 'string' ? obj : (obj?.[document.documentElement.getAttribute('data-lang')] ?? obj?.es ?? '');

const data = JSON.parse($('#index-data').textContent);

// Discord CTA
$('#discord-cta')?.setAttribute('href', data.discordInvite || '#');

// Contador (y sincroniza con hero)
(function counter(){
  const main = $('#player-counter'); const hero = $('#hero-online');
  let base = 300 + Math.floor(Math.random()*80);
  function tick(){
    base += Math.floor(Math.random()*10 - 5);
    if (base<0) base=0;
    if (main) main.textContent = String(base);
    if (hero) hero.textContent = String(base);
  }
  tick(); setInterval(tick, 3000);
})();

// Scroll suave desde la flecha
$('.hero-scroll')?.addEventListener('click', ()=>{
  document.querySelector('main section:nth-of-type(2)')?.scrollIntoView({behavior:'smooth'});
});

// News
(function renderNews(){
  const wrap = $('#news-list'); if (!wrap) return;
  wrap.innerHTML = (data.news||[]).map(n=>`
    <article>
      <div class="text-amber-400 font-bold mb-2">${esc(n.date)}</div>
      <h3 class="text-xl font-bold mb-2">${esc(t(n.title))}</h3>
      <p class="text-gray-300">${esc(t(n.text))}</p>
    </article>
  `).join('');
})();

// Testimonials
(function renderTestimonials(){
  const wrap = $('#testimonials-list'); if (!wrap) return;
  wrap.innerHTML = (data.testimonials||[]).map(ti=>`
    <div class="p-6 flex flex-col items-center">
      <img src="${esc(ti.avatar)}" class="w-16 h-16 rounded-full mb-3 border-2 border-amber-500" alt="${esc(ti.name)}">
      <div class="italic text-gray-300 mb-2">"${esc(t(ti.text))}"</div>
      <div class="font-bold text-amber-400">${esc(ti.name)}</div>
    </div>
  `).join('');
})();

// Ranking
(function renderRanking(){
  const tbody = $('#ranking-table'); if (!tbody) return;
  tbody.innerHTML = (data.ranking||[]).map(r=>`
    <tr>
      <td class="py-2 px-4 font-bold">${esc(r.name)}</td>
      <td class="py-2 px-4">${esc(r.pvp)}</td>
      <td class="py-2 px-4">${esc(r.pk)}</td>
      <td class="py-2 px-4">${esc(r.clan)}</td>
    </tr>
  `).join('');
})();

// Gallery
(function renderGallery(){
  const wrap = $('#gallery-list'); if (!wrap) return;
  wrap.innerHTML = (data.gallery||[]).map(url=>`
    <img src="${esc(url)}" class="rounded-xl shadow-md w-full h-32 object-cover" alt="L2jBrasil gallery">
  `).join('');
})();

// FAQ
(function renderFAQ(){
  const wrap = $('#faq-list'); if (!wrap) return;
  wrap.innerHTML = (data.faq||[]).map(f=>`
    <div class="mb-4">
      <button class="w-full text-left font-bold text-amber-400 focus:outline-none faq-btn" aria-expanded="false">${esc(t(f.q))}</button>
      <div class="hidden bg-gray-900 rounded p-3 mt-1 text-gray-300 faq-panel">${esc(t(f.a))}</div>
    </div>
  `).join('');
  $$('.faq-btn', wrap).forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const panel = btn.nextElementSibling;
      const hidden = panel.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', String(!hidden));
    });
  });
})();
