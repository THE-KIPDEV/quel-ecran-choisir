/* ============================================
   QUEL ECRAN CHOISIR - Main JS
   Mobile menu, FAQ, details toggle
   ============================================ */

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      var isOpen = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click (mobile)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      });
    });
  }
});

// Toggle product details (pros/cons)
function toggleDetails(id) {
  var el = document.getElementById(id + '-details');
  if (!el) return;
  var isHidden = el.classList.contains('pros-cons--hidden');
  el.classList.toggle('pros-cons--hidden');

  // Update button text
  var card = document.getElementById(id);
  if (card) {
    var btn = card.querySelector('.btn-details');
    if (btn) {
      btn.textContent = isHidden ? '- masquer' : '+ de details';
    }
  }
}

// FAQ accordion
function toggleFaq(el) {
  var item = el.parentElement;
  if (!item) return;

  // Close others
  var siblings = item.parentElement.querySelectorAll('.faq-item');
  siblings.forEach(function (s) {
    if (s !== item) s.classList.remove('open');
  });

  item.classList.toggle('open');
}

// Smooth scroll for anchor links
document.addEventListener('click', function (e) {
  var link = e.target.closest('a[href^="#"]');
  if (!link) return;
  var target = document.querySelector(link.getAttribute('href'));
  if (target) {
    e.preventDefault();
    var offset = 80; // header height
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }
});

// Active nav link based on current page
(function () {
  var path = window.location.pathname;
  var links = document.querySelectorAll('.nav a');
  links.forEach(function (link) {
    var href = link.getAttribute('href');
    if (path.endsWith(href) || (href === '/' && (path === '/' || path.endsWith('index.html')))) {
      link.classList.add('active');
    }
  });
})();
