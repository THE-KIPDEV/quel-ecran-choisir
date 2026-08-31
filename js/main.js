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

// KipStats engagement events (client-side only, guarded)
function kp(n, d) {
  try {
    if (window.kipstats && window.kipstats.event) window.kipstats.event(n, d || {});
  } catch (e) {}
}

// ---------------------------------------------------------------------------
// Affiliation Amazon : un seul endroit pour l'identifiant, et de quoi mesurer.
//
// L'identifiant de suivi etait ecrit en dur dans le href de chaque lien, sur
// douze pages : impossible de savoir, dans Amazon Associates, ce que ce site
// rapporte par rapport aux vingt-cinq autres qui portaient le meme. Il est
// desormais pose au chargement, depuis cette constante — un seul endroit a
// changer le jour ou chaque site aura le sien (100 identifiants autorises par
// compte). Le href reste valide sans JS : c'est un remplacement, pas un ajout.
// ---------------------------------------------------------------------------
var AMAZON_TAG = 'yohannleskits-21';

/** L'ASIN du produit vise, seule facon de savoir QUOI a ete clique. */
function amazonItem(href) {
  var dp = /\/(?:dp|gp\/product)\/([A-Z0-9]{10})/.exec(href || '');
  if (dp) return dp[1];
  var search = /[?&]k=([^&]+)/.exec(href || '');
  return search ? decodeURIComponent(search[1]).replace(/\+/g, ' ').slice(0, 40) : null;
}

/** Le bloc de la page ou se trouve le lien : sait-on quel emplacement travaille ? */
function amazonPlacement(link) {
  var card = link.closest('.monitor-card');
  if (card) return 'carte_produit';
  return link.closest('table') ? 'comparatif' : 'contenu';
}

function amazonLabel(link) {
  var card = link.closest('.monitor-card');
  var titleEl = card ? card.querySelector('.card-title') : null;
  return titleEl ? titleEl.textContent.trim() : (link.textContent || '').trim().slice(0, 60);
}

(function () {
  var links = [].slice.call(document.querySelectorAll('a[href*="amazon."]'));
  if (!links.length) return;

  links.forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href.indexOf('tag=') !== -1) {
      a.setAttribute('href', href.replace(/([?&])tag=[^&]*/, '$1tag=' + AMAZON_TAG));
    } else if (href.indexOf('amazon.') !== -1) {
      a.setAttribute('href', href + (href.indexOf('?') === -1 ? '?' : '&') + 'tag=' + AMAZON_TAG);
    }
  });

  // Une impression n'est comptee que si l'encart entre VRAIMENT dans l'ecran :
  // un lien rendu tout en bas d'une page que personne ne deroule n'a ete vu par
  // personne, et gonflerait le denominateur du taux de clic.
  if (!('IntersectionObserver' in window)) return;

  // ... et pas avant que le tracker ait ouvert la session. `tracker.js` est en
  // `defer` (donc execute APRES ce fichier, place en fin de body) et envoie son
  // pageview en `requestIdleCallback` : un event emis avant est jete en
  // silence, avec un HTTP 200 pour faire bonne mesure. On se met derriere lui
  // dans la meme file d'attente, avec un filet de securite.
  var started = false;
  function observeAll() {
    if (started) return;
    started = true;
    var seen = new WeakSet();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        io.unobserve(entry.target);
        kp('partner_impression', {
          network: 'amazon',
          item: amazonItem(entry.target.getAttribute('href')),
          placement: amazonPlacement(entry.target)
        });
      });
    }, { threshold: 0.5 });
    links.forEach(function (a) { io.observe(a); });
  }

  function queueObserve() {
    if (window.requestIdleCallback) window.requestIdleCallback(observeAll);
    else setTimeout(observeAll, 200);
  }
  if (document.readyState === 'complete') queueObserve();
  else window.addEventListener('load', queueObserve);
  setTimeout(observeAll, 3000);
})();

document.addEventListener('click', function (e) {
  // partner_click — clic sortant vers un lien d'achat affilie Amazon
  var amazon = e.target.closest('a[href*="amazon."]');
  if (amazon) {
    kp('partner_click', {
      network: 'amazon',
      item: amazonItem(amazon.getAttribute('href')),
      placement: amazonPlacement(amazon),
      label: amazonLabel(amazon),
      tag: AMAZON_TAG
    });
    return;
  }

  // cta_click — clic sur une carte de categorie (CTA principal)
  var cat = e.target.closest('a.cat-card');
  if (cat) {
    var h3 = cat.querySelector('h3');
    var label = h3 ? h3.textContent.trim() : (cat.getAttribute('href') || 'categorie');
    kp('cta_click', { cta: 'category_' + label });
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
