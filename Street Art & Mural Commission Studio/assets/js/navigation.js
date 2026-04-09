/**
 * CRUX Studio - Navigation & UI Animations
 */

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('hidden');
}

function triggerReveal() {
  const els = document.querySelectorAll('.reveal:not(.revealed)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}

function handleNavScroll() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  if (window.scrollY > 40) {
    nav.style.backdropFilter = 'blur(28px) saturate(200%)';
  } else {
    nav.style.backdropFilter = 'blur(20px) saturate(180%)';
  }
}

function initCursor() {
  const dot = document.getElementById('cursor-dot');
  if (!dot) return;

  window.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
  });
}

function applyLightModeBento() {
  const bentoSection = document.querySelector('.bento-section'); // Updated selector for specific pages
  if (!bentoSection) return;
  if (document.documentElement.classList.contains('light')) {
    bentoSection.style.background = '#f5f0ea';
  } else {
    bentoSection.style.background = '#0f0f0f';
  }
}

// Global exposure
window.toggleMobileMenu = toggleMobileMenu;

document.addEventListener('DOMContentLoaded', () => {
  triggerReveal();
  initCursor();
  
  window.addEventListener('scroll', () => {
    triggerReveal();
    handleNavScroll();
  }, { passive: true });

  // Watch theme changes for bento background
  const themeObserver = new MutationObserver(applyLightModeBento);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  applyLightModeBento();
});
