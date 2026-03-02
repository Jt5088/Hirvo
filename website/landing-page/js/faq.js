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
