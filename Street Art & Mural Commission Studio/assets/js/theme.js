/**
 * CRUX Studio - Theme & Direction Logic
 */

const htmlEl = document.documentElement;

function applyTheme(dark) {
  if (dark) {
    htmlEl.classList.add('dark');
    htmlEl.classList.remove('light');
  } else {
    htmlEl.classList.remove('dark');
    htmlEl.classList.add('light');
  }
}

function toggleTheme() {
  const isDark = htmlEl.classList.contains('dark');
  const newDark = !isDark;
  applyTheme(newDark);
  localStorage.setItem('crux-theme', newDark ? 'dark' : 'light');
}

function initTheme() {
  const stored = localStorage.getItem('crux-theme');
  if (stored) {
    applyTheme(stored === 'dark');
  } else {
    applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
}

function toggleDir() {
  const current = htmlEl.getAttribute('dir') ?? 'ltr';
  const next = current === 'ltr' ? 'rtl' : 'ltr';
  htmlEl.setAttribute('dir', next);
  const dirToggle = document.getElementById('dir-toggle');
  if (dirToggle) {
    dirToggle.textContent = next.toUpperCase() === 'RTL' ? 'LTR' : 'RTL';
  }
}

// Global exposure for inline onclick handlers
window.toggleTheme = toggleTheme;
window.toggleDir = toggleDir;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
});
