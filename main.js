/* ================================================================
   main.js — federico.travaini.xyz
================================================================ */

'use strict';

// ----------------------------------------------------------------
// MATRIX RAIN — red characters, ambient background
// ----------------------------------------------------------------
(function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const ctx  = canvas.getContext('2d');
  const FONT = 13;
  const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>{}[]=/\\+-';

  let cols, drops;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / FONT);
    if (!drops) {
      drops = new Array(cols).fill(0).map(() => Math.random() * -60);
    } else if (drops.length < cols) {
      drops = drops.concat(new Array(cols - drops.length).fill(0));
    }
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.07)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${FONT}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      const x = i * FONT;
      const y = drops[i] * FONT;

      // Occasional bright leading char
      ctx.fillStyle = (Math.random() > 0.97)
        ? 'rgba(220, 80, 80, 0.85)'
        : `rgba(196, 32, 32, ${(Math.random() * 0.1) + 0.03})`;

      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  setInterval(draw, 44);
})();


// ----------------------------------------------------------------
// NAV — scroll blur & hamburger
// ----------------------------------------------------------------
const navbar    = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', open);
});

mobileNav.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  })
);

document.querySelectorAll('a[href^="#"]').forEach(a =>
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  })
);


// ----------------------------------------------------------------
// TYPED TEXT
// ----------------------------------------------------------------
const lines = [
  '> there is no spoon',
];

const typedEl = document.getElementById('typed-text');
let li = 0, ci = 0, del = false;

function tick() {
  const cur = lines[li];
  typedEl.textContent = del ? cur.slice(0, ci - 1) : cur.slice(0, ci + 1);
  if (del) ci--; else ci++;

  let d = del ? 28 : 64;
  if (!del && ci === cur.length) { d = 99999999; }
  else if (del && ci === 0)      { del = false; li = (li + 1) % lines.length; d = 320; }

  setTimeout(tick, d);
}
setTimeout(tick, 1500);


// ----------------------------------------------------------------
// SCROLL REVEAL
// ----------------------------------------------------------------
const revealObs = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    revealObs.unobserve(e.target);
  }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


// ----------------------------------------------------------------
// 3D CARD TILT
// ----------------------------------------------------------------
function initTilt(sel, max = 5) {
  document.querySelectorAll(sel).forEach(card => {
    card.addEventListener('mousemove', e => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = ((e.clientX - left) / width  - 0.5) * max;
      const y = ((e.clientY - top)  / height - 0.5) * max;
      card.style.transform =
        `translateY(-3px) perspective(700px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}
initTilt('.cv-card', 2);


// ----------------------------------------------------------------
// HERO PARALLAX
// ----------------------------------------------------------------
const heroContent = document.querySelector('.hero-content');
if (heroContent) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight)
      heroContent.style.transform = `translateY(${window.scrollY * 0.13}px)`;
  }, { passive: true });
}


// ----------------------------------------------------------------
// ACTIVE NAV LINK
// ----------------------------------------------------------------
const navAs = document.querySelectorAll('.nav-links a[href^="#"]');
const sObs  = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    navAs.forEach(a =>
      a.classList.toggle('nav-active', a.getAttribute('href') === `#${e.target.id}`)
    );
  }),
  { threshold: 0.4 }
);
document.querySelectorAll('section[id]').forEach(s => sObs.observe(s));
