(function() {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const savedDir = localStorage.getItem('dir') || 'ltr';

  // Apply immediately to prevent FOUC
  html.setAttribute('data-theme', savedTheme);
  html.setAttribute('dir', savedDir);

  window.toggleTheme = function() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggles();
  };

  window.toggleDir = function() {
    const currentDir = html.getAttribute('dir');
    const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
    html.setAttribute('dir', newDir);
    localStorage.setItem('dir', newDir);
    updateToggles();
  };

  function updateToggles() {
    // Update Theme Toggles
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const isDark = html.getAttribute('data-theme') === 'dark';
    themeToggles.forEach(btn => {
      btn.innerHTML = isDark ? '☀️' : '🌙';
    });

    // Update Dir Toggles
    const dirToggles = document.querySelectorAll('.dir-toggle');
    const isRtl = html.getAttribute('dir') === 'rtl';
    dirToggles.forEach(btn => {
      btn.innerHTML = isRtl ? 'RTL' : 'LTR';
    });
  }

  // Mobile Menu Logic
  document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      });

      // Close menu when clicking links
      const mobileLinks = mobileMenu.querySelectorAll('a');
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
          body.style.overflow = '';
        });
      });
    }

    updateToggles();
  });
})();
