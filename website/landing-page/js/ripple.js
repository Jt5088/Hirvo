// ripple.js
// Button ripple effect: on click, creates a .ripple <span> positioned at the
// click coordinates inside the nearest .btn-pri ancestor, then removes it
// after the CSS animation duration (read from --d3 token) plus a small buffer.

(function() {

  // Read --d3 token once and parse to ms; add 50ms buffer for safety
  const d3Raw = getComputedStyle(document.documentElement).getPropertyValue('--d3').trim();
  const rippleDuration = parseInt(d3Raw, 10) + 50 || 470;

  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn-pri');
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = (e.clientX - rect.left - 30) + 'px';
    ripple.style.top  = (e.clientY - rect.top  - 30) + 'px';
    btn.appendChild(ripple);

    setTimeout(() => ripple.remove(), rippleDuration);
  });

})();
