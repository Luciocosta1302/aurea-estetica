// Áurea Estética Avançada — interações da página

// Header: sombra ao rolar
const header = document.querySelector('.header');
addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', scrollY > 10);
}, { passive: true });

// Menu mobile
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// Tabs de especialidades
const tabs = [...document.querySelectorAll('.tab')];
const panels = [...document.querySelectorAll('.panel')];
tabs.forEach(tab => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', e => {
    const i = tabs.indexOf(tab);
    if (e.key === 'ArrowRight') activateTab(tabs[(i + 1) % tabs.length], true);
    if (e.key === 'ArrowLeft') activateTab(tabs[(i - 1 + tabs.length) % tabs.length], true);
  });
});
function activateTab(tab, focus) {
  tabs.forEach(t => {
    const active = t === tab;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', active);
    t.tabIndex = active ? 0 : -1;
  });
  panels.forEach(p => {
    const active = p.id === tab.getAttribute('aria-controls');
    p.classList.toggle('is-active', active);
    p.hidden = !active;
    if (active) p.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  });
  if (focus) tab.focus();
}

// Comparador antes/depois
const ba = document.getElementById('ba');
if (ba) {
  const range = ba.querySelector('.ba-range');
  range.addEventListener('input', () => {
    ba.style.setProperty('--pos', range.value + '%');
  });
}

// Reveal ao rolar
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// Fallback elegante para fotos que não carregarem: troca por um gradiente SVG
const FALLBACK_SRC = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 800">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#EDDCD3"/><stop offset=".55" stop-color="#E3CBBF"/><stop offset="1" stop-color="#C0714F"/>
    </linearGradient></defs>
    <rect width="640" height="800" fill="url(#g)"/>
    <text x="320" y="418" font-size="60" text-anchor="middle" fill="rgba(255,253,251,.85)">✦</text>
  </svg>`
);
document.querySelectorAll('img[src^="https://images.unsplash.com"]').forEach(img => {
  img.addEventListener('error', () => {
    if (img.dataset.fallback) return;
    img.dataset.fallback = '1';
    img.src = FALLBACK_SRC;
  });
  // caso o erro tenha ocorrido antes deste script rodar
  if (img.complete && img.naturalWidth === 0 && !img.dataset.fallback) {
    img.dataset.fallback = '1';
    img.src = FALLBACK_SRC;
  }
});
