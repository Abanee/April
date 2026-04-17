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
  };

  function updateToggles() {
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.innerHTML = html.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
    }
  }

  // Initial update after DOM load
  document.addEventListener('DOMContentLoaded', updateToggles);
})();
