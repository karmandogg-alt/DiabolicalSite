// information.js — render rates, roadmap, rules
const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));
const esc = s=> String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const t = (obj)=> typeof obj === 'string' ? obj : (obj?.[document.documentElement.getAttribute('data-lang')] ?? obj?.es ?? '');
const data = JSON.parse(document.getElementById('info-data').textContent);

// Rates cards
(function renderRates(){
  const wrap = document.getElementById('rates-cards'); if (!wrap) return;
  wrap.innerHTML = (data.rates||[]).map(cat=>`
    <div class="server-card p-6">
      <div class="flex items-center mb-3 gap-2">
        <span class="badge"><i class="fa-solid ${esc(cat.icon)}"></i></span>
        <h3 class="font-bold text-lg">${esc(t(cat.title))}</h3>
      </div>
      <div class="space-y-2">
        ${(cat.items||[]).map(it=>`
          <div class="flex items-center justify-between">
            <span class="muted">${esc(t(it.label))}</span>
            <span class="rate-badge">${esc(it.value)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
})();

// Roadmap timeline
(function renderRoadmap(){
  const wrap = document.getElementById('roadmap'); if (!wrap) return;
  wrap.innerHTML = (data.roadmap||[]).map(i=>`
    <div class="timeline-item">
      <h4>${esc(i.date)} — ${esc(t(i.title))}</h4>
      <p class="muted">${esc(t(i.desc))}</p>
    </div>
  `).join('');
})();

// Rules accordion
(function renderRules(){
  const wrap = document.getElementById('rules'); if (!wrap) return;
  wrap.innerHTML = (data.rules||[]).map(r=>`
    <div class="item">
      <button class="ask">${esc(t(r.q))}</button>
      <div class="ans">${esc(t(r.a))}</div>
    </div>
  `).join('');
  $$('.accordion .ask', wrap).forEach(btn=>{
    btn.addEventListener('click', ()=>{
      btn.parentElement.classList.toggle('open');
    });
  });
})();
