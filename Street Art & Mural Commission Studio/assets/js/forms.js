/**
 * CRUX Studio - Form Logic & Validation
 */

/* ── Budget slider ──────────────────────────────────────────── */
function updateBudget(val) {
  const num = parseInt(val, 10);
  const display = document.getElementById('budget-display');
  if (display) {
    display.textContent = `$${num.toLocaleString()}`;
  }
}

/* ── Multi-step form ────────────────────────────────────────── */
let currentStep = 1;
const totalSteps = 3;

function showStep(step) {
  for (let i = 1; i <= totalSteps; i++) {
    const el = document.getElementById(`form-step-${i}`);
    if (el) el.classList.toggle('active', i === step);
  }
  // Update dots
  for (let i = 1; i <= totalSteps; i++) {
    const dot = document.getElementById(`step-dot-${i}`);
    if (dot) dot.classList.toggle('active', i <= step);
  }
  const labels = ['Step 1 of 3 — Your Details', 'Step 2 of 3 — Project Details', 'Step 3 of 3 — References & Submit'];
  const lbl = document.getElementById('step-label');
  if (lbl && step <= totalSteps) lbl.textContent = labels[step - 1];
  currentStep = step;
}

function showError(id, show) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('visible', show);
}

function validateStep1() {
  let valid = true;
  const name = document.getElementById('field-name')?.value.trim();
  const email = document.getElementById('field-email')?.value.trim();
  const service = document.getElementById('field-service')?.value;

  if (!name) { showError('err-name', true); valid = false; }
  else showError('err-name', false);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('err-email', true); valid = false;
  } else showError('err-email', false);

  if (!service) { showError('err-service', true); valid = false; }
  else showError('err-service', false);

  return valid;
}

function validateStep2() {
  let valid = true;
  const w = document.getElementById('field-width')?.value;
  const h = document.getElementById('field-height')?.value;
  const style = document.getElementById('field-style')?.value;

  if (!w || parseFloat(w) <= 0) { showError('err-width', true); valid = false; }
  else showError('err-width', false);

  if (!h || parseFloat(h) <= 0) { showError('err-height', true); valid = false; }
  else showError('err-height', false);

  if (!style) { showError('err-style', true); valid = false; }
  else showError('err-style', false);

  return valid;
}

function nextStep(step) {
  if (step === 1 && !validateStep1()) return;
  if (step === 2 && !validateStep2()) return;
  showStep(step + 1);
}

function prevStep(step) {
  showStep(step - 1);
}

/* ── File upload ────────────────────────────────────────────── */
function renderFileList(files) {
  const container = document.getElementById('file-list');
  if (!container) return;
  if (files.length === 0) { container.classList.add('hidden'); return; }
  container.classList.remove('hidden');
  container.innerHTML = [...files].map(f => `
    <div style="display:flex;align-items:center;gap:.75rem;padding:.5rem .75rem;background:#181818;border-radius:2px;border:1px solid #1e1e1e;">
      <svg style="width:16px;height:16px;flex-shrink:0;color:#e8ff00;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
      <span style="font-family:'DM Mono',monospace;font-size:.7rem;color:#888;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${f.name}</span>
      <span style="font-family:'DM Mono',monospace;font-size:.65rem;color:#444;">${(f.size/1024).toFixed(0)}KB</span>
    </div>
  `).join('');
}

function handleFileInput(input) {
  renderFileList(input.files);
}

function handleFileDrop(e) {
  e.preventDefault();
  document.getElementById('file-drop')?.classList.remove('drag-over');
  const files = e.dataTransfer?.files;
  if (files) renderFileList(files);
}

// Global exposure
window.updateBudget = updateBudget;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.handleFileInput = handleFileInput;
window.handleFileDrop = handleFileDrop;

document.addEventListener('DOMContentLoaded', () => {
  /* ── Inquiry form submit ───────────────────────────────────── */
  document.getElementById('inquiry-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const consent = document.getElementById('consent-check')?.checked;
    if (!consent) { showError('err-consent', true); return; }
    showError('err-consent', false);

    const btn = document.getElementById('submit-btn');
    const txt = document.getElementById('submit-text');
    const spin = document.getElementById('submit-spinner');
    if (btn) btn.disabled = true;
    if (txt) txt.style.display = 'none';
    if (spin) spin.classList.add('visible');

    // Simulate API call
    setTimeout(() => {
      for (let i = 1; i <= totalSteps; i++) {
        const el = document.getElementById(`form-step-${i}`);
        if (el) el.classList.remove('active');
      }
      const success = document.getElementById('form-step-success');
      if (success) success.classList.add('active');
      const stepLabel = document.getElementById('step-label');
      if (stepLabel) stepLabel.textContent = 'Inquiry Sent ✓';
      for (let i = 1; i <= totalSteps; i++) {
        const dot = document.getElementById(`step-dot-${i}`);
        if (dot) dot.classList.add('active');
      }
    }, 1800);
  });

  /* ── Login form submit ─────────────────────────────────────── */
  document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    const email = document.getElementById('login-email')?.value.trim();
    const pass  = document.getElementById('login-password')?.value;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('err-login-email', true); valid = false;
    } else showError('err-login-email', false);

    if (!pass || pass.length < 8) {
      showError('err-login-password', true); valid = false;
    } else showError('err-login-password', false);

    if (!valid) return;

    const btn = document.getElementById('login-submit-btn');
    const txt = document.getElementById('login-submit-text');
    const spin = document.getElementById('login-spinner');
    if (btn) btn.disabled = true;
    if (txt) txt.style.display = 'none';
    if (spin) spin.classList.toggle('visible', true);

    // Simulate auth
    setTimeout(() => {
      if (txt) {
        txt.textContent = 'Welcome Back ✓';
        txt.style.display = 'inline';
      }
      if (spin) spin.classList.toggle('visible', false);
      if (btn) btn.disabled = false;
    }, 1600);
  });
});
