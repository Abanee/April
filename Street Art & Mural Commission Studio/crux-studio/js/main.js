/* ═══════════════════════════════════════════════════════════
   CRUX STUDIO — Shared JavaScript
   ES2026 · Vanilla · No dependencies
═══════════════════════════════════════════════════════════ */
'use strict';

/* ── Custom Cursor ─────────────────────────────────────────── */
const cursorDot = document.getElementById('cursor-dot');
if (cursorDot && window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('pointermove', e => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top  = `${e.clientY}px`;
  });
}

/* ── Theme ─────────────────────────────────────────────────── */
const htmlEl = document.documentElement;

function applyTheme(dark) {
  htmlEl.classList.toggle('dark', dark);
  htmlEl.classList.toggle('light', !dark);
}

function toggleTheme() {
  const newDark = !htmlEl.classList.contains('dark');
  applyTheme(newDark);
  localStorage.setItem('crux-theme', newDark ? 'dark' : 'light');
}

// Init on every page
(function initTheme() {
  const stored = localStorage.getItem('crux-theme');
  if (stored) {
    applyTheme(stored === 'dark');
  } else {
    applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
})();

window.toggleTheme = toggleTheme;

/* ── RTL / LTR ─────────────────────────────────────────────── */
function toggleDir() {
  const next = htmlEl.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
  htmlEl.setAttribute('dir', next);
  const btn = document.getElementById('dir-toggle');
  if (btn) btn.textContent = next === 'rtl' ? 'LTR' : 'RTL';
}
window.toggleDir = toggleDir;

/* ── Mobile Menu ───────────────────────────────────────────── */
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('open');
}
window.toggleMobileMenu = toggleMobileMenu;

/* ── Nav Scroll Effect ─────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.backdropFilter = window.scrollY > 50
      ? 'blur(30px) saturate(220%)'
      : 'blur(22px) saturate(180%)';
  }, { passive: true });
})();

/* ── Active Nav Link ───────────────────────────────────────── */
(function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
})();

/* ── Scroll Reveal ─────────────────────────────────────────── */
(function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ── Budget slider helper ──────────────────────────────────── */
function updateBudget(val) {
  const n = parseInt(val, 10);
  const el = document.getElementById('budget-display');
  if (el) el.textContent = `$${n.toLocaleString()}`;
}
window.updateBudget = updateBudget;

/* ── Multi-step commission form ─────────────────────────────── */
let currentStep = 1;
const TOTAL_STEPS = 3;

function showStep(step) {
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    document.getElementById(`step-${i}`)?.classList.toggle('active', i === step);
    document.getElementById(`dot-${i}`)?.classList.toggle('active', i <= step);
  }
  const labels = [
    'Step 1 / 3 — Your Details',
    'Step 2 / 3 — Project Details',
    'Step 3 / 3 — References & Submit',
  ];
  const lbl = document.getElementById('step-label');
  if (lbl && step <= TOTAL_STEPS) lbl.textContent = labels[step - 1];
  currentStep = step;
}

function showErr(id, show) {
  document.getElementById(id)?.classList.toggle('show', show);
}
function fieldErr(inputId, errId, valid) {
  document.getElementById(inputId)?.classList.toggle('has-error', !valid);
  showErr(errId, !valid);
  return valid;
}

function validateStep1() {
  const name    = document.getElementById('f-name')?.value.trim();
  const email   = document.getElementById('f-email')?.value.trim();
  const service = document.getElementById('f-service')?.value;
  let ok = true;
  ok = fieldErr('f-name',    'e-name',    !!name) && ok;
  ok = fieldErr('f-email',   'e-email',   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) && ok;
  ok = fieldErr('f-service', 'e-service', !!service) && ok;
  return ok;
}
function validateStep2() {
  const w = parseFloat(document.getElementById('f-width')?.value || 0);
  const h = parseFloat(document.getElementById('f-height')?.value || 0);
  const s = document.getElementById('f-style')?.value;
  let ok = true;
  ok = fieldErr('f-width',  'e-width',  w > 0) && ok;
  ok = fieldErr('f-height', 'e-height', h > 0) && ok;
  ok = fieldErr('f-style',  'e-style',  !!s)   && ok;
  return ok;
}

function nextStep(n) {
  if (n === 1 && !validateStep1()) return;
  if (n === 2 && !validateStep2()) return;
  showStep(n + 1);
}
function prevStep(n) { showStep(n - 1); }
window.nextStep = nextStep;
window.prevStep = prevStep;

/* ── Commission form submit ─────────────────────────────────── */
const inquiryForm = document.getElementById('inquiry-form');
if (inquiryForm) {
  inquiryForm.addEventListener('submit', e => {
    e.preventDefault();
    const consent = document.getElementById('consent')?.checked;
    if (!consent) { showErr('e-consent', true); return; }
    showErr('e-consent', false);

    const btn  = document.getElementById('submit-btn');
    const txt  = document.getElementById('submit-text');
    const spin = document.getElementById('submit-spin');
    if (btn) btn.disabled = true;
    if (txt) txt.style.display = 'none';
    if (spin) spin.classList.add('spin');

    setTimeout(() => {
      for (let i = 1; i <= TOTAL_STEPS; i++)
        document.getElementById(`step-${i}`)?.classList.remove('active');
      document.getElementById('step-success')?.classList.add('active');
      const sl = document.getElementById('step-label');
      if (sl) sl.textContent = '✓ Inquiry Sent!';
      for (let i = 1; i <= TOTAL_STEPS; i++)
        document.getElementById(`dot-${i}`)?.classList.add('active');
    }, 1800);
  });
}

/* ── Login form submit ──────────────────────────────────────── */
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('l-email')?.value.trim();
    const pass  = document.getElementById('l-pass')?.value;
    let ok = true;
    ok = fieldErr('l-email', 'le-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email||'')) && ok;
    ok = fieldErr('l-pass',  'le-pass',  (pass||'').length >= 8) && ok;
    if (!ok) return;

    const btn  = document.getElementById('login-btn');
    const txt  = document.getElementById('login-text');
    const spin = document.getElementById('login-spin');
    if (btn) btn.disabled = true;
    if (txt) txt.style.display = 'none';
    if (spin) spin.classList.add('spin');

    setTimeout(() => {
      if (txt) { txt.textContent = 'Welcome back ✓'; txt.style.display = 'inline'; }
      if (spin) spin.classList.remove('spin');
      if (btn) btn.disabled = false;
    }, 1800);
  });
}

/* ── File upload ─────────────────────────────────────────────── */
function handleFileDrop(e) {
  e.preventDefault();
  document.getElementById('file-drop')?.classList.remove('dragover');
  renderFileList(e.dataTransfer?.files);
}
function handleFileInput(input) { renderFileList(input.files); }
function renderFileList(files) {
  const container = document.getElementById('file-list');
  if (!container || !files?.length) return;
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '.4rem';
  container.style.marginTop = '.75rem';
  container.innerHTML = [...files].map(f => `
    <div style="display:flex;align-items:center;gap:.6rem;padding:.45rem .75rem;background:#181818;border-radius:2px;border:1px solid #1e1e1e;">
      <svg style="width:14px;height:14px;flex-shrink:0;color:#e8ff00;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
      <span style="font-family:'DM Mono',monospace;font-size:.68rem;color:#888;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${f.name}</span>
      <span style="font-family:'DM Mono',monospace;font-size:.62rem;color:#444;">${(f.size/1024).toFixed(0)}KB</span>
    </div>`).join('');
}
window.handleFileDrop = handleFileDrop;
window.handleFileInput = handleFileInput;

/* ── Gallery filter ──────────────────────────────────────────── */
function initGalleryFilter() {
  const pills = document.querySelectorAll('.filter-pill');
  const items = document.querySelectorAll('.filterable');
  if (!pills.length || !items.length) return;
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.filter;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.style.opacity = show ? '1' : '0';
        item.style.transform = show ? 'scale(1)' : 'scale(.92)';
        item.style.pointerEvents = show ? 'auto' : 'none';
        item.style.transition = 'opacity .4s ease, transform .4s ease';
        item.style.display = show ? '' : 'none';
      });
      // Re-trigger reveal on visible items
      setTimeout(() => {
        items.forEach(item => {
          if (item.style.display !== 'none') item.classList.add('in');
        });
      }, 50);
    });
  });
}
window.addEventListener('DOMContentLoaded', initGalleryFilter);
