/**
 * main.js — Global Scripts for Bonsai Nursery & Care Workshop (2026 Edition)
 * Handles: Theme toggle, RTL/LTR toggle, Mobile menu, Scroll-reveal, Navbar scroll state
 */

// ─────────────────────────────────────────────────────────────
// THEME MANAGEMENT
// ─────────────────────────────────────────────────────────────

function getStoredTheme() { return localStorage.getItem('bonsai-theme'); }
function getSystemTheme() { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }

function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === 'dark') { html.classList.add('dark'); } else { html.classList.remove('dark'); }
  updateThemeIcons(theme);
  localStorage.setItem('bonsai-theme', theme);
}

function updateThemeIcons(theme) {
  document.querySelectorAll('[data-sun-icon]').forEach(el => el.classList.toggle('hidden', theme !== 'dark'));
  document.querySelectorAll('[data-moon-icon]').forEach(el => el.classList.toggle('hidden', theme === 'dark'));
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
}

function initTheme() {
  const theme = getStoredTheme() || getSystemTheme();
  applyTheme(theme);
}

// ─────────────────────────────────────────────────────────────
// RTL / LTR MANAGEMENT
// ─────────────────────────────────────────────────────────────

function applyDir(dir) {
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
  localStorage.setItem('bonsai-dir', dir);
  updateDirButtons(dir);
}

function updateDirButtons(dir) {
  document.querySelectorAll('[data-dir-label]').forEach(el => {
    el.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
  });
  document.querySelectorAll('[data-dir-toggle]').forEach(btn => {
    btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
  });
}

function toggleDir() {
  const current = document.documentElement.getAttribute('dir') || 'ltr';
  applyDir(current === 'rtl' ? 'ltr' : 'rtl');
}

function initDir() {
  const stored = localStorage.getItem('bonsai-dir') || 'ltr';
  applyDir(stored);
}

// ─────────────────────────────────────────────────────────────
// MOBILE MENU
// ─────────────────────────────────────────────────────────────

function initMobileMenu() {
  const openBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileMenuClose');
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  if (!openBtn || !menu) return;

  const dir = () => document.documentElement.getAttribute('dir') || 'ltr';

  const openMenu = () => {
    if (dir() === 'rtl') {
      menu.classList.remove('translate-x-full');
    } else {
      menu.classList.remove('-translate-x-full');
    }
    overlay?.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    if (dir() === 'rtl') {
      menu.classList.add('translate-x-full');
    } else {
      menu.classList.add('-translate-x-full');
    }
    overlay?.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

// ─────────────────────────────────────────────────────────────
// NAVBAR SCROLL STATE
// ─────────────────────────────────────────────────────────────

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    if (window.scrollY > 30) { navbar.classList.add('nav-scrolled'); }
    else { navbar.classList.remove('nav-scrolled'); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ─────────────────────────────────────────────────────────────
// SCROLL-REVEAL ANIMATIONS
// ─────────────────────────────────────────────────────────────

function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('sr-visible'), parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-sr]').forEach(el => observer.observe(el));
}

// ─────────────────────────────────────────────────────────────
// COUNTER ANIMATION
// ─────────────────────────────────────────────────────────────

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        let start = 0;
        const step = target / 60;
        const tick = () => {
          start = Math.min(start + step, target);
          el.textContent = Math.floor(start) + suffix;
          if (start < target) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────

initTheme();
initDir();

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initNavbarScroll();
  initScrollReveal();
  initCounters();

  document.querySelectorAll('[data-theme-toggle]').forEach(btn => btn.addEventListener('click', toggleTheme));
  document.querySelectorAll('[data-dir-toggle]').forEach(btn => btn.addEventListener('click', toggleDir));
});
