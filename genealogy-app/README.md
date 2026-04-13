# 🌳 Rootbound — Genealogy Research & Family History App

A modern, 2026-standard multi-page web application template for a genealogy research service.  
Built with semantic HTML5, advanced CSS custom properties, and modular Vanilla JS (ESNext).

---

## 📁 Project Structure

```
genealogy-app/
├── index.html          ← Landing page (hero, tree preview, pricing, testimonials)
├── services.html       ← Services detail page (packages, process timeline, FAQ)
├── login.html          ← Authentication (sign-in + registration with tab switcher)
├── blog.html           ← Blog listing (search, category filter, article grid)
├── dashboard.html      ← Client dashboard (sidebar, tree viewer, chat, reports)
│
├── css/
│   └── style.css       ← All custom styles (design tokens, components, animations)
│
├── js/
│   └── main.js         ← All JS modules (theme, RTL, sidebar, drag-drop, chat, tree)
│
├── tailwind.config.js  ← Heritage color palette, custom fonts, keyframes, plugins
├── input.css           ← Tailwind base directives + heritage overrides (source)
└── README.md           ← This file
```

---

## 🚀 Getting Started

### Option 1: Open directly (no build step)
Each page uses the **Tailwind CDN Play CDN** for prototyping.  
Simply open any `.html` file in a modern browser — no server required.

```bash
# macOS / Linux
open index.html

# Or use a local server (recommended)
npx serve .
# → http://localhost:3000
```

### Option 2: Build with Tailwind CLI (production)
Install and compile for production-optimized CSS:

```bash
# Install Tailwind CLI
npm install -D tailwindcss

# Compile (watches for changes)
npx tailwindcss -i input.css -o css/tailwind.css --watch

# Then replace the CDN <script> in each HTML with:
# <link rel="stylesheet" href="css/tailwind.css"/>
```

---

## 🎨 Design System

### Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-bg` | `#FAF6F0` (parchment) | `#121212` (charcoal) | Page background |
| `--color-bg-alt` | `#F3EAD8` | `#1A1A1A` | Section alternates |
| `--color-bg-card` | `#FEFCF8` | `#1E1E1E` | Cards, panels |
| `--color-accent` | `#8B6914` (sepia gold) | `#C9A84C` (antique gold) | Interactive elements |
| `--color-text` | `#1C1005` (deep ink) | `#E8E0D0` (cream) | Body text |

### Typography

| Role | Font | Usage |
|------|------|-------|
| `.font-display` | Cormorant Garamond | Headlines, card names |
| `.font-body` | EB Garamond | Body copy, descriptions |
| `.font-ui` | Jost | Labels, nav, badges, buttons |

### Key CSS Classes

```css
.glass-card        /* Glassmorphism card with backdrop blur */
.btn-primary       /* Filled accent button with glow hover */
.btn-ghost         /* Outline button */
.badge             /* Small uppercase pill label */
.section-eyebrow   /* Decorative section label with flanking lines */
.ancestor-card     /* Family tree node card with glow hover */
.nav-link          /* Sidebar/header navigation link */
.step-node         /* Progress tracker circle (done/active/pending) */
.drop-zone         /* Drag-and-drop upload area */
.chat-bubble-in/out /* Chat message bubbles */
.text-gradient     /* Gold gradient text effect */
.reveal            /* Scroll-reveal animation trigger */
.texture-parchment /* Subtle noise texture overlay */
```

---

## ✨ Features

### 🌙 Dark / Light Mode
- Toggles the `dark` class on `<html>`
- Saved to `localStorage` so preference persists across sessions
- Respects `prefers-color-scheme` media query as default
- All colors driven by CSS custom properties — instant switching

### 🌐 RTL / LTR Directionality
- Toggles `dir="rtl"` on `<html>`
- Saved to `localStorage`
- All layout uses CSS logical properties (`margin-inline-start`, `padding-inline-end`, etc.)
- Sidebar and layout flip seamlessly

### 🎬 View Transitions API
- Smooth cross-fade + slide animation when navigating between pages
- Graceful fallback for unsupported browsers (instant navigation)
- Enable by using `<a data-vt>` on internal links

### 📜 Scroll-Driven Animations
- Elements with `.reveal` class animate as they enter the viewport
- Uses native CSS `animation-timeline: view()` where supported
- IntersectionObserver fallback for broader browser support

### 🌳 Interactive Family Tree
- Mouse-drag to pan the tree canvas
- Mouse-wheel / button controls to zoom in/out
- Reset button returns to default view
- Ancestor cards with glowing hover borders

### 💬 Chat Interface
- Simulated real-time conversation with genealogist
- Typing indicator with animated dots
- Rotates through realistic response messages
- Smooth auto-scroll to latest message

### 📤 Drag & Drop Upload
- Full drag-and-drop file upload zone
- Click-to-browse fallback
- Visual feedback on hover/drag states
- Supports images, PDFs, documents

### 🔐 Login / Registration
- Animated tab switcher (Sign In ↔ Create Account)
- Password show/hide toggle
- Password strength meter (3-bar visual)
- View Transitions on submit → dashboard redirect
- Social OAuth placeholder buttons

### 📊 Dashboard
- Collapsible sidebar (auto-open desktop, drawer on mobile)
- Single-page panel navigation (no page reload)
- Animated progress tracker (done/active/pending states)
- Animated progress bars (scroll-triggered)
- Notification badges and indicators

---

## 🧩 JavaScript Modules

All modules live in `js/main.js` as IIFE namespaces:

| Module | Purpose |
|--------|---------|
| `ThemeManager` | Dark/light mode toggle + persistence |
| `DirManager` | RTL/LTR toggle + persistence |
| `ViewTransitions` | Smooth page navigation |
| `ScrollReveal` | Viewport-based reveal animations |
| `Parallax` | Hero section parallax effect |
| `Sidebar` | Dashboard sidebar open/close |
| `DropZone` | Drag-and-drop file upload |
| `TreeViewer` | Pan and zoom family tree |
| `ChatInterface` | Simulated genealogist chat |
| `Accordion` | FAQ expand/collapse |
| `BlogFilter` | Blog search + category filter |
| `MobileNav` | Mobile hamburger menu |
| `CardTilt` | 3D tilt on pricing cards |
| `ProgressBars` | Scroll-triggered bar animations |

---

## 🌍 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CSS Custom Properties | ✅ | ✅ | ✅ | ✅ |
| View Transitions API | ✅ 111+ | ✅ 119+ | ✅ 18+ | ✅ 111+ |
| Scroll-Driven Animations | ✅ 115+ | 🔄 WIP | ⚠️ Partial | ✅ 115+ |
| Backdrop Filter | ✅ | ✅ | ✅ | ✅ |
| CSS Logical Properties | ✅ | ✅ | ✅ | ✅ |

All features have graceful fallbacks for non-supporting browsers.

---

## 📦 Production Checklist

- [ ] Replace Tailwind CDN Play with compiled CLI output
- [ ] Add real authentication (replace login form submit handler)
- [ ] Connect chat interface to real WebSocket / API
- [ ] Implement real file upload endpoint for drop zone
- [ ] Add GEDCOM file import/export for family tree data
- [ ] Replace sample ancestor data with API-driven content
- [ ] Add proper ARIA live regions for dynamic content updates
- [ ] Compress and optimize all images
- [ ] Add Content Security Policy headers
- [ ] Configure HTTPS and proper caching headers

---

## 📄 License

Template created for demonstration purposes.  
Fonts served via Google Fonts (SIL Open Font License).

---

*Crafted with care for every family's story. 🌿*
