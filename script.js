/* =========================================================
   NEW INTERACTION LAYER
   - scroll progress
   - active nav section tracking
   - reveal-on-scroll
   - animated hero counters
   - mobile navigation
   - light/dark mode
   - print / PDF action
   - back-to-top
   - contact-form demo feedback
   ========================================================= */
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const nav = $('#nav');
const progress = $('#progress');
const backtop = $('#backtop');

function onScroll(){
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  nav.classList.toggle('scrolled', y > 20);
  backtop.classList.toggle('show', y > 500);
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* Reveal sections only when they enter the viewport. */
const revealObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12});
$$('.reveal').forEach(el=>revealObserver.observe(el));

/* Animate numeric credibility indicators once. */
const counterObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || '';
    let start = 0;
    const duration = 900;
    const t0 = performance.now();
    function tick(now){
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(start + (target-start)*eased) + suffix;
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
},{threshold:.7});
$$('[data-count]').forEach(el=>counterObserver.observe(el));

/* Active section highlight in navigation. */
const sections = $$('main section[id]');
const navItems = $$('.nav-links a');
const sectionObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navItems.forEach(a=>a.classList.toggle('active', a.getAttribute('href') === '#'+entry.target.id));
    }
  });
},{rootMargin:'-35% 0px -55% 0px',threshold:0});
sections.forEach(s=>sectionObserver.observe(s));

/* Mobile menu */
const menuBtn = $('#menuBtn');
const navLinks = $('#navLinks');
menuBtn.addEventListener('click', ()=>{
  navLinks.classList.toggle('open');
  menuBtn.innerHTML = navLinks.classList.contains('open')
    ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
});
navItems.forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));

/* Theme toggle — preference is saved locally. */
const themeBtn = $('#themeBtn');
const savedTheme = localStorage.getItem('portfolio-theme');
if(savedTheme === 'dark') document.body.classList.add('dark');
function applyThemeIcon(){
  themeBtn.innerHTML = document.body.classList.contains('dark')
    ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
}
themeBtn.addEventListener('click',()=>{
  document.body.classList.toggle('dark');
  localStorage.setItem('portfolio-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  applyThemeIcon();
});
applyThemeIcon();

/* Print / Save as PDF */
$('#printBtn').addEventListener('click',()=>window.print());

/* Back to top */
backtop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* Demo-safe form behavior: prevents a dead # submission. */
$('#contactForm').addEventListener('submit', e=>{
  e.preventDefault();
  const note = $('#formNote');
  note.textContent = 'Thanks — the form is working on the page. Connect it to your preferred email/API endpoint to receive submissions.';
  note.style.color = '#087f68';
});

/* =========================================================
   NEW: DARK MODE OVERRIDES
   ========================================================= */
