// faq.js
// FAQ accordion: clicking a .faq-btn toggles .open on its parent .faq-item,
// uses CSS grid-template-rows 0fr→1fr for a composited-friendly expand/collapse,
// updates aria-expanded, and closes any other open item first.

(function() {

  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close every currently-open item (CSS grid transition handles animation)
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
      });

      // If this item was not already open, open it
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

})();

/* ── Divider line glow — mouse proximity brightens nearby lines ── */
(function () {
  'use strict';

  var items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  var PROXIMITY = 80;
  var mx = 0, my = 0, rafId = null;

  function tick() {
    var anyActive = false;

    for (var i = 0; i < items.length; i++) {
      var rect = items[i].getBoundingClientRect();
      var inX = mx > rect.left - 40 && mx < rect.right + 40;

      /* Top divider (::before) — glow based on distance to top edge */
      var distTop = Math.abs(my - rect.top);
      var glow = (inX && distTop < PROXIMITY) ? 1 - distTop / PROXIMITY : 0;
      items[i].style.setProperty('--line-glow', glow.toFixed(3));
      if (glow > 0) anyActive = true;

      /* Bottom divider on last item (::after) */
      if (i === items.length - 1) {
        var distBot = Math.abs(my - rect.bottom);
        var glowB = (inX && distBot < PROXIMITY) ? 1 - distBot / PROXIMITY : 0;
        items[i].style.setProperty('--line-glow-b', glowB.toFixed(3));
        if (glowB > 0) anyActive = true;
      }
    }

    rafId = anyActive ? requestAnimationFrame(tick) : null;
  }

  function onMove(e) {
    mx = e.clientX;
    my = e.clientY;
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  document.body.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('scroll', function () {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }, { passive: true });
})();
