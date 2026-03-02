// pricing.js
// Handles monthly/yearly pricing toggle with animated price transitions

(function() {
  var toggle = document.getElementById('pricing-toggle');
  if (!toggle) return;

  var amounts = document.querySelectorAll('.pcard-amount');
  var labels = document.querySelectorAll('.toggle-label');
  var billedLabels = document.querySelectorAll('.pcard-billed');
  var isYearly = false;

  toggle.addEventListener('click', function() {
    isYearly = !isYearly;
    toggle.setAttribute('aria-checked', isYearly);

    // Update toggle labels
    labels.forEach(function(l, i) {
      l.setAttribute('data-active', i === 0 ? !isYearly : isYearly);
    });

    // Update billed labels
    billedLabels.forEach(function(l) {
      l.textContent = isYearly ? 'billed annually' : 'billed monthly';
    });

    // Animate price change
    amounts.forEach(function(el) {
      var monthly = parseInt(el.dataset.monthly, 10);
      var yearly = parseInt(el.dataset.yearly, 10);
      var target = isYearly ? yearly : monthly;

      el.classList.add('switching');
      setTimeout(function() {
        el.textContent = '$' + target;
        el.classList.remove('switching');
      }, 150);
    });
  });
})();
