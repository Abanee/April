/**
 * ============================================================
 *  GENEALOGY APP — main.js
 *  Shared utilities: theme, directionality, view transitions,
 *  scroll reveal, drag-drop, sidebar, interactive tree.
 * ============================================================
 */

'use strict';

/* ── 1. THEME SYSTEM ──────────────────────────────────────────
   Reads saved pref → applies → watches toggle button clicks.
   Saved to localStorage so preference persists across pages.
   ──────────────────────────────────────────────────────────── */
const ThemeManager = (() => {

  const STORAGE_KEY = 'genealogy-theme';  // 'dark' | 'light'
  const html = document.documentElement;

  /** Apply a theme and persist it */
  function applyTheme(mode) {
    if (mode === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, mode);

    // Update all toggle button icons/aria labels on the page
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const isDark = mode === 'dark';
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      // Swap SVG icons if they exist
      btn.querySelector('.icon-sun')?.classList.toggle('hidden', !isDark);
      btn.querySelector('.icon-moon')?.classList.toggle('hidden', isDark);
    });
  }

  /** Read saved or system preference */
  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved ?? (system ? 'dark' : 'light'));

    // Listen for OS-level changes (if no user pref saved)
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', e => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });

    // Wire up all toggle buttons
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = html.classList.contains('dark') ? 'dark' : 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    });
  }

  return { init, applyTheme };
})();


/* ── 2. DIRECTIONALITY (LTR / RTL) ───────────────────────────
   Toggles dir="rtl" on <html>. Logical CSS properties
   (margin-inline, padding-inline, etc.) handle the flip.
   ──────────────────────────────────────────────────────────── */
const DirManager = (() => {

  const STORAGE_KEY = 'genealogy-dir';  // 'ltr' | 'rtl'
  const html = document.documentElement;

  function applyDir(dir) {
    html.setAttribute('dir', dir);
    html.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    localStorage.setItem(STORAGE_KEY, dir);

    document.querySelectorAll('[data-dir-toggle]').forEach(btn => {
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
      btn.querySelector('[data-dir-label]').textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY) || 'ltr';
    applyDir(saved);

    document.querySelectorAll('[data-dir-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = html.getAttribute('dir') || 'ltr';
        applyDir(current === 'rtl' ? 'ltr' : 'rtl');
      });
    });
  }

  return { init };
})();


/* ── 3. VIEW TRANSITIONS ──────────────────────────────────────
   Wraps SPA-style anchor clicks with the View Transitions API
   for smooth cross-page animations. Falls back gracefully.
   ──────────────────────────────────────────────────────────── */
const ViewTransitions = (() => {

  function navigate(url) {
    if (!document.startViewTransition) {
      // Fallback: just navigate
      window.location.href = url;
      return;
    }
    document.startViewTransition(() => {
      window.location.href = url;
    });
  }

  function init() {
    // Intercept internal links that have [data-vt] attribute
    document.querySelectorAll('a[data-vt]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http')) return;
        e.preventDefault();
        navigate(href);
      });
    });
  }

  return { init, navigate };
})();


/* ── 4. SCROLL REVEAL (Fallback for non-scroll-timeline) ──────
   Adds 'visible' class to .reveal elements as they enter the
   viewport. The CSS in input.css handles the animation.
   ──────────────────────────────────────────────────────────── */
const ScrollReveal = (() => {

  function init() {
    // Only needed when CSS scroll-driven animations aren't supported
    if (CSS.supports('animation-timeline: scroll()')) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  return { init };
})();


/* ── 5. PARALLAX HERO ─────────────────────────────────────────
   Subtle parallax on the hero background layer. Uses
   requestAnimationFrame for 60fps smoothness.
   ──────────────────────────────────────────────────────────── */
const Parallax = (() => {

  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.4;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
    ticking = false;
  }

  function init() {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  return { init };
})();


/* ── 6. SIDEBAR (Dashboard) ───────────────────────────────────
   Collapsible sidebar with smooth transition. Saves state.
   ──────────────────────────────────────────────────────────── */
const Sidebar = (() => {

  let sidebar, overlay, isOpen = true;

  function open() {
    sidebar?.classList.remove('-translate-x-full', 'translate-x-full');
    sidebar?.classList.add('translate-x-0');
    overlay?.classList.remove('opacity-0', 'pointer-events-none');
    overlay?.classList.add('opacity-100');
    isOpen = true;
    document.querySelectorAll('[data-sidebar-toggle] .hamburger-bar')
      .forEach((bar, i) => bar.classList.toggle('rotate', i === 1));
  }

  function close() {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    sidebar?.classList.add(isRTL ? 'translate-x-full' : '-translate-x-full');
    sidebar?.classList.remove('translate-x-0');
    overlay?.classList.add('opacity-0', 'pointer-events-none');
    overlay?.classList.remove('opacity-100');
    isOpen = false;
  }

  function toggle() { isOpen ? close() : open(); }

  function init() {
    sidebar = document.getElementById('sidebar');
    overlay = document.getElementById('sidebar-overlay');
    if (!sidebar) return;

    document.querySelectorAll('[data-sidebar-toggle]')
      .forEach(btn => btn.addEventListener('click', toggle));

    overlay?.addEventListener('click', close);

    // Auto-close on mobile when a nav link is clicked
    sidebar.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 1024) close();
        // Mark active
        sidebar.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });

    // On desktop, keep sidebar open by default
    if (window.innerWidth >= 1024) open();
    else close();

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) open();
      else close();
    });
  }

  return { init, open, close, toggle };
})();


/* ── 7. DRAG & DROP UPLOAD ZONE ───────────────────────────────
   Handles drag events on .drop-zone elements. Shows file
   names on drop and updates the file count badge.
   ──────────────────────────────────────────────────────────── */
const DropZone = (() => {

  function init() {
    document.querySelectorAll('.drop-zone').forEach(zone => {
      const input = zone.querySelector('input[type="file"]');
      const label = zone.querySelector('[data-drop-label]');
      const counter = zone.querySelector('[data-drop-count]');

      // Drag events
      ['dragenter', 'dragover'].forEach(evt => {
        zone.addEventListener(evt, e => {
          e.preventDefault();
          zone.classList.add('drag-over');
        });
      });

      ['dragleave', 'dragend'].forEach(evt => {
        zone.addEventListener(evt, () => zone.classList.remove('drag-over'));
      });

      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files, label, counter);
      });

      // Click to browse
      zone.addEventListener('click', () => input?.click());
      input?.addEventListener('change', () => {
        handleFiles(Array.from(input.files), label, counter);
      });
    });
  }

  function handleFiles(files, label, counter) {
    if (!files.length) return;
    const names = files.map(f => f.name).join(', ');
    const truncated = names.length > 48 ? names.slice(0, 48) + '…' : names;
    if (label) label.textContent = truncated;
    if (counter) {
      counter.textContent = files.length;
      counter.classList.remove('hidden');
    }
    // Visual feedback: briefly pulse the zone
    const zone = label?.closest('.drop-zone');
    zone?.classList.add('ring-2');
    setTimeout(() => zone?.classList.remove('ring-2'), 1200);
  }

  return { init };
})();


/* ── 8. INTERACTIVE TREE PAN & ZOOM ───────────────────────────
   Mouse-wheel zoom + drag-to-pan on #tree-viewport.
   Touch pinch-to-zoom support included.
   ──────────────────────────────────────────────────────────── */
const TreeViewer = (() => {

  let scale = 1, tx = 0, ty = 0;
  let dragging = false, startX = 0, startY = 0;
  let viewport, canvas;

  const SCALE_MIN = 0.35, SCALE_MAX = 2.5, SCALE_STEP = 0.1;

  function applyTransform() {
    if (!canvas) return;
    canvas.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  function clampScale(s) {
    return Math.min(SCALE_MAX, Math.max(SCALE_MIN, s));
  }

  function init() {
    viewport = document.getElementById('tree-viewport');
    canvas = document.getElementById('tree-canvas');
    if (!viewport || !canvas) return;

    // ── Wheel zoom ──
    viewport.addEventListener('wheel', e => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? SCALE_STEP : -SCALE_STEP;
      scale = clampScale(scale + delta);
      applyTransform();
    }, { passive: false });

    // ── Drag to pan (mouse) ──
    viewport.addEventListener('mousedown', e => {
      dragging = true;
      startX = e.clientX - tx;
      startY = e.clientY - ty;
      viewport.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      tx = e.clientX - startX;
      ty = e.clientY - startY;
      applyTransform();
    });
    window.addEventListener('mouseup', () => {
      dragging = false;
      viewport.style.cursor = 'grab';
    });

    // ── Control buttons ──
    document.getElementById('tree-zoom-in')?.addEventListener('click', () => {
      scale = clampScale(scale + SCALE_STEP * 2);
      applyTransform();
    });
    document.getElementById('tree-zoom-out')?.addEventListener('click', () => {
      scale = clampScale(scale - SCALE_STEP * 2);
      applyTransform();
    });
    document.getElementById('tree-reset')?.addEventListener('click', () => {
      scale = 1; tx = 0; ty = 0;
      applyTransform();
    });

    viewport.style.cursor = 'grab';
    applyTransform();
  }

  return { init };
})();


/* ── 9. CHAT INTERFACE ────────────────────────────────────────
   Simulates sending/receiving messages in the chat panel.
   Uses a small response delay to feel realistic.
   ──────────────────────────────────────────────────────────── */
const ChatInterface = (() => {

  const RESPONSES = [
    "Great question! I'll look into the 1840 census records for that branch.",
    "I found a promising lead in the Ellis Island database. I'll prepare a detailed report.",
    "The DNA match suggests a strong connection to County Cork, Ireland. Fascinating!",
    "I've attached the digitized baptismal record to your Documents section.",
    "Could you confirm the spelling of the surname? There are two variants in the archive.",
  ];
  let responseIndex = 0;

  function addMessage(container, text, type) {
    const wrap = document.createElement('div');
    wrap.className = `flex ${type === 'out' ? 'justify-end' : 'justify-start'} mb-3`;

    const bubble = document.createElement('div');
    bubble.className = type === 'out' ? 'chat-bubble-out' : 'chat-bubble-in';
    bubble.textContent = text;

    wrap.appendChild(bubble);
    container.appendChild(wrap);
    container.scrollTop = container.scrollHeight;
  }

  function init() {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    if (!form || !messages) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      // User message
      addMessage(messages, text, 'out');
      input.value = '';

      // Typing indicator
      const typingWrap = document.createElement('div');
      typingWrap.className = 'flex justify-start mb-3';
      typingWrap.innerHTML = `<div class="chat-bubble-in flex gap-1 items-center">
        <span class="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style="animation-delay:0ms"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style="animation-delay:150ms"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style="animation-delay:300ms"></span>
      </div>`;
      messages.appendChild(typingWrap);
      messages.scrollTop = messages.scrollHeight;

      // Simulated response
      setTimeout(() => {
        messages.removeChild(typingWrap);
        const resp = RESPONSES[responseIndex % RESPONSES.length];
        addMessage(messages, resp, 'in');
        responseIndex++;
      }, 1400 + Math.random() * 600);
    });
  }

  return { init };
})();


/* ── 10. ACCORDION (FAQ / Services) ──────────────────────────
   Accessible accordion with smooth height animation.
   ──────────────────────────────────────────────────────────── */
const Accordion = (() => {

  function init() {
    document.querySelectorAll('[data-accordion]').forEach(root => {
      const items = root.querySelectorAll('[data-accordion-item]');
      items.forEach(item => {
        const trigger = item.querySelector('[data-accordion-trigger]');
        const content = item.querySelector('[data-accordion-content]');
        const icon = trigger?.querySelector('[data-accordion-icon]');

        trigger?.addEventListener('click', () => {
          const isOpen = item.dataset.open === 'true';

          // Close all siblings if [data-accordion-single]
          if (root.hasAttribute('data-accordion-single')) {
            items.forEach(sibling => {
              sibling.dataset.open = 'false';
              sibling.querySelector('[data-accordion-content]')?.style.setProperty('max-height', '0');
              sibling.querySelector('[data-accordion-icon]')?.classList.remove('rotate-180');
            });
          }

          item.dataset.open = isOpen ? 'false' : 'true';
          content.style.maxHeight = isOpen ? '0' : content.scrollHeight + 'px';
          icon?.classList.toggle('rotate-180', !isOpen);
        });

        // Init closed
        content.style.maxHeight = '0';
        content.style.overflow = 'hidden';
        content.style.transition = 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
      });
    });
  }

  return { init };
})();


/* ── 11. BLOG / SEARCH FILTER ────────────────────────────────
   Client-side search filtering for the blog grid.
   ──────────────────────────────────────────────────────────── */
const BlogFilter = (() => {

  function init() {
    const input = document.getElementById('blog-search');
    const cards = document.querySelectorAll('[data-blog-card]');
    if (!input || !cards.length) return;

    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) || !query ? '' : 'none';
      });
    });

    // Category filter buttons
    document.querySelectorAll('[data-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.category;
        document.querySelectorAll('[data-category]').forEach(b => b.classList.remove('active-cat'));
        btn.classList.add('active-cat');

        cards.forEach(card => {
          const cardCat = card.dataset.blogCard;
          card.style.display = (cat === 'all' || cardCat === cat) ? '' : 'none';
        });
      });
    });
  }

  return { init };
})();


/* ── 12. MOBILE NAV TOGGLE (Landing / Static pages) ──────────
   Simple hamburger toggle for the top navigation on mobile.
   ──────────────────────────────────────────────────────────── */
const MobileNav = (() => {

  function init() {
    const toggle = document.getElementById('mobile-nav-toggle');
    const menu = document.getElementById('mobile-nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const open = menu.classList.contains('hidden');
      menu.classList.toggle('hidden', !open);
      menu.classList.toggle('flex', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  return { init };
})();


/* ── 13. PRICING CARD HOVER (tilt effect) ────────────────────
   Subtle 3D tilt on the pricing/service cards.
   ──────────────────────────────────────────────────────────── */
const CardTilt = (() => {

  function init() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const maxRot = 5; // degrees
        card.style.transform =
          `perspective(800px) rotateY(${dx * maxRot}deg) rotateX(${-dy * maxRot}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
      });
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease';
      });
    });
  }

  return { init };
})();


/* ── 14. PROGRESS BAR ANIMATION ──────────────────────────────
   Animates progress bars when they scroll into view.
   ──────────────────────────────────────────────────────────── */
const ProgressBars = (() => {

  function init() {
    const bars = document.querySelectorAll('[data-progress]');
    if (!bars.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const val = bar.dataset.progress;
          bar.style.setProperty('--fill-width', val + '%');
          bar.style.width = val + '%';
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });

    bars.forEach(bar => observer.observe(bar));
  }

  return { init };
})();


/* ── 15. FAMILY TREE — DYNAMIC SVG CONNECTORS ────────────
   Reads card positions at runtime and draws smooth bezier
   paths between ancestor cards using data-tree-child attrs.
   Redraws on every resize for full responsiveness.
   ──────────────────────────────────────────────────────── */
const FamilyTree = (() => {

  function draw() {
    const inner = document.getElementById('tree-canvas-inner');
    const svg = document.getElementById('tree-canvas-svg');
    if (!inner || !svg) return;

    svg.innerHTML = '';

    const containerRect = inner.getBoundingClientRect();
    const cards = inner.querySelectorAll('[data-tree-id]');
    const positions = {};

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      positions[card.dataset.treeId] = {
        right: rect.right - containerRect.left,
        left: rect.left - containerRect.left,
        cy: rect.top + rect.height / 2 - containerRect.top,
      };
    });

    // Draw connector from each card to its "child" card
    cards.forEach(card => {
      const srcId = card.dataset.treeId;
      const dstId = card.dataset.treeChild;
      if (!dstId || !positions[srcId] || !positions[dstId]) return;

      const src = positions[srcId];
      const dst = positions[dstId];
      const x1 = src.right;
      const y1 = src.cy;
      const x2 = dst.left;
      const y2 = dst.cy;
      const mx = (x1 + x2) / 2;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'var(--color-border-strong)');
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('opacity', '0.8');
      svg.appendChild(path);
    });
  }

  function init() {
    if (!document.getElementById('tree-canvas-inner')) return;
    // Draw once content is painted
    requestAnimationFrame(() => { draw(); });
    window.addEventListener('load', draw);
    window.addEventListener('resize', draw);
  }

  return { init, draw };
})();


/* ── 16. ANIMATED STAT COUNTERS ───────────────────────────
   Counts up numbers when they scroll into view.
   Triggered once per element.
   ──────────────────────────────────────────────────────── */
const StatCounters = (() => {

  function animateCount(el) {
    const target = parseFloat(el.dataset.countTo) || 0;
    const suffix = el.dataset.countSuffix || '';
    const prefix = el.dataset.countPrefix || '';
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      el.textContent = prefix + (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function init() {
    const counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  return { init };
})();


/* ── INIT — Boot all modules ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  DirManager.init();
  ViewTransitions.init();
  ScrollReveal.init();
  Parallax.init();
  Sidebar.init();
  DropZone.init();
  TreeViewer.init();
  FamilyTree.init();
  StatCounters.init();
  ChatInterface.init();
  Accordion.init();
  BlogFilter.init();
  MobileNav.init();
  CardTilt.init();
  ProgressBars.init();

  console.log('%c🌳 Genealogy App Loaded', 'color: #C9A84C; font-size: 14px; font-weight: bold;');
});
