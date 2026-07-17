/* ============================================
   QUEL ECRAN CHOISIR - Outils réutilisables
   1. Decodeur de référence AOC   -> [data-aoc-decoder]
   2. Calculateur PPI             -> [data-ppi-calc]
   3. Comparateur persistant      -> [data-compare-add] + [data-compare-list]
   4. Tableau triable             -> table[data-sortable]
   Aucun appel réseau. Tout est calculé dans le navigateur.
   ============================================ */
(function () {
  'use strict';

  function kpEvent(name, data) {
    try {
      if (window.kipstats && window.kipstats.event) window.kipstats.event(name, data || {});
    } catch (e) {}
  }

  // Cherche d'abord dans le bloc de l'outil, puis dans le document.
  // La zone de résultat est souvent posée en soeur du bloc, pas dedans.
  function find(root, sel) {
    return root.querySelector(sel) || document.querySelector(sel);
  }

  /* --------------------------------------------
     1. DECODEUR DE REFERENCE AOC
     Grammaire de la gamme Gaming G2 :
       [C][Q|U] + taille + série + suffixes + /coloris
       C      = incurvé (dalle VA sur la série G2)
       Q      = QHD 2560x1440 ; U EN TETE = UHD 4K ; rien = 1080p
       U EN FIN = hub USB intégré
       /BK    = coloris noir
     -------------------------------------------- */

  var AOC_KNOWN = {
    'Q27G2U': {
      nom: 'AOC Q27G2U',
      dalle: 'IPS', courbure: 'Plate', taille: '27"', res: '2560 x 1440 (QHD)',
      hz: '144 Hz', usb: 'Hub USB 3.0 (4 ports + 1 sleep-and-charge)',
      sortie: 'Décembre 2019',
      verdict: 'ok',
      resume: "C'est l'IPS plat 1440p 144 Hz. Celui que la plupart des gens croient commander quand ils tapent « q27g2u », et pour une fois la référence correspond à l'attente.",
      lien: 'https://www.amazon.fr/s?k=AOC+Q27G2U&tag=yohannleskits-21'
    },
    'CQ27G2U': {
      nom: 'AOC CQ27G2U',
      dalle: 'VA', courbure: 'Incurvée (1500R)', taille: '27"', res: '2560 x 1440 (QHD)',
      hz: '144 Hz', usb: 'Hub USB 3.0',
      sortie: 'Gamme G2',
      verdict: 'attention',
      resume: "Le C change tout : dalle VA et écran incurvé, pas l'IPS plat. Contraste bien meilleur, mais c'est la référence sur laquelle du ghosting (traînées sombres) est remonté par les utilisateurs. Si vous vouliez le plat, ce n'est pas celui-là.",
      lien: 'https://www.amazon.fr/s?k=AOC+CQ27G2U&tag=yohannleskits-21'
    },
    '27G2U': {
      nom: 'AOC 27G2U',
      dalle: 'IPS', courbure: 'Plate', taille: '27"', res: '1920 x 1080 (Full HD)',
      hz: '144 Hz', usb: 'Hub USB 3.0',
      sortie: 'Gamme G2',
      verdict: 'attention',
      resume: "Pas de Q : c'est du 1080p, pas du 1440p. Sur 27 pouces, ça fait 82 PPI — la densité la plus basse de toute la gamme. Un pixel de 0,31 mm, visible à 70 cm. L'erreur de commande la plus coûteuse de la série.",
      lien: 'https://www.amazon.fr/s?k=AOC+27G2U&tag=yohannleskits-21'
    },
    'Q27G2S': {
      nom: 'AOC Q27G2S',
      dalle: 'IPS', courbure: 'Plate', taille: '27"', res: '2560 x 1440 (QHD)',
      hz: '165 Hz sur le Q27G2S/EU vendu en France (170 Hz sur la fiche AOC US)',
      usb: 'Aucun hub USB — pas de U final dans la référence',
      sortie: 'Gamme G2',
      verdict: 'attention',
      resume: "Si vous cherchiez « le Q27G2U 165 Hz », c'est ce modèle-ci que vous voulez : le Q27G2U plafonne à 144 Hz, les 165 Hz appartiennent au Q27G2S. Même dalle IPS plate, même 1440p. Mais le S n'a pas le U : vous gagnez 21 Hz et vous perdez le hub USB. À vous de dire lequel des deux vous sert vraiment tous les jours.",
      lien: 'https://www.amazon.fr/s?k=AOC+Q27G2S&tag=yohannleskits-21'
    },
    'CQ27G2': {
      nom: 'AOC CQ27G2',
      dalle: 'VA', courbure: 'Incurvée (1500R)', taille: '27"', res: '2560 x 1440 (QHD)',
      hz: '144 Hz', usb: 'Aucun hub USB',
      sortie: 'Gamme G2',
      verdict: 'attention',
      resume: "Le CQ27G2U sans le hub USB. Même dalle VA incurvée, mêmes réserves sur le ghosting, un port en moins. La seule différence entre les deux références tient dans ce U final.",
      lien: 'https://www.amazon.fr/s?k=AOC+CQ27G2&tag=yohannleskits-21'
    },
    'Q27V4EA': {
      nom: 'AOC Q27V4EA',
      dalle: 'IPS', courbure: 'Plate', taille: '27"', res: '2560 x 1440 (QHD)',
      hz: '75 Hz', usb: 'Aucun hub USB',
      sortie: 'Gamme V4 (bureautique)',
      verdict: 'ok',
      resume: "Pas de G2 dans la référence : ce n'est pas un écran gaming. 75 Hz, gamme bureautique. C'est un bon 1440p pas cher pour travailler, mais si vous cherchiez les 144 Hz, ce n'est pas lui.",
      lien: 'https://www.amazon.fr/s?k=AOC+Q27V4EA&tag=yohannleskits-21'
    },
    '24G2SPAE': {
      nom: 'AOC 24G2SPAE',
      dalle: 'IPS', courbure: 'Plate', taille: '23,8"', res: '1920 x 1080 (Full HD)',
      hz: '165 Hz', usb: 'Aucun hub USB',
      sortie: 'Gamme G2',
      verdict: 'ok',
      resume: "Le 24 pouces 1080p 165 Hz de la gamme. En 23,8 pouces, le 1080p tient la route (93 PPI). C'est le même raisonnement qui condamne le 27G2U et sauve celui-ci : la densité, pas la définition.",
      lien: 'https://www.amazon.fr/s?k=AOC+24G2SPAE&tag=yohannleskits-21'
    }
  };

  // Normalise : majuscules, retire espaces, tirets, "AOC" et le coloris /BK.
  function normalizeRef(raw) {
    var s = String(raw || '').toUpperCase();
    s = s.replace(/\s+/g, '').replace(/-/g, '');
    s = s.replace(/^AOC/, '');
    s = s.replace(/\/(BK|BZ|WS|SW|B)$/, '');
    return s;
  }

  // Décodage par la grammaire, quand la référence n'est pas dans la table.
  function decodeGrammar(ref) {
    var m = ref.match(/^(C?)(Q|U?)(\d{2})(.*)$/);
    if (!m) return null;

    var courbe = m[1] === 'C';
    var prefixRes = m[2];
    var taille = m[3];
    var reste = m[4] || '';

    // "U" en tête de référence = UHD, mais seulement s'il précède la taille.
    var res, ppiNote;
    if (prefixRes === 'Q') res = '2560 x 1440 (QHD)';
    else if (prefixRes === 'U') res = '3840 x 2160 (UHD / 4K)';
    else res = '1920 x 1080 (Full HD)';

    var out = {
      nom: 'AOC ' + ref,
      dalle: courbe ? 'VA (probable : chez AOC, incurvé = VA)' : 'Plate, donc plutôt IPS ou TN selon la gamme',
      courbure: courbe ? 'Incurvée' : 'Plate',
      taille: taille + '"',
      res: res,
      hz: /G\d/.test(reste) ? 'Gamme gaming : 144 Hz ou plus, à vérifier' : 'À vérifier (gamme non gaming : souvent 60 à 75 Hz)',
      usb: /U$/.test(reste) ? 'Hub USB intégré (le U final)' : 'Pas de hub USB indiqué',
      sortie: 'Non répertoriée ici',
      verdict: 'inconnu',
      resume: 'Cette référence exacte ne fait pas partie de notre table vérifiée. Le décodage ci-dessus vient de la grammaire des références AOC, pas d\'une fiche constructeur : vérifiez la dalle et la fréquence sur la fiche du vendeur avant de commander.',
      lien: 'https://www.amazon.fr/s?k=AOC+' + encodeURIComponent(ref) + '&tag=yohannleskits-21'
    };
    if (ppiNote) out.note = ppiNote;
    return out;
  }

  function decodeAoc(raw) {
    var ref = normalizeRef(raw);
    if (!ref) return null;
    if (AOC_KNOWN[ref]) {
      var known = AOC_KNOWN[ref];
      var copy = {};
      for (var k in known) if (Object.prototype.hasOwnProperty.call(known, k)) copy[k] = known[k];
      copy.exact = true;
      return copy;
    }
    var g = decodeGrammar(ref);
    if (g) g.exact = false;
    return g;
  }

  function mountDecoder(root) {
    var input = find(root, '[data-aoc-input]');
    var btn = find(root, '[data-aoc-btn]');
    var out = find(root, '[data-aoc-result]');
    if (!input || !btn || !out) return;

    function render() {
      var saisie = normalizeRef(input.value);
      var res = decodeAoc(input.value);
      if (!res) {
        out.hidden = false;
        // Champ vide et référence non déchiffrable sont deux cas distincts :
        // afficher « Référence vide » à quelqu'un qui a tapé un modèle Dell
        // lui fait croire que son clavier a lâché.
        out.innerHTML = saisie
          ? '<h3>Référence illisible</h3><p>« ' + esc(input.value) + ' » ne suit pas la grammaire des références AOC. Ce décodeur ne connaît que les écrans AOC : pour une autre marque, il ne saura rien vous dire. Une référence AOC ressemble à <strong>Q27G2U</strong>, <strong>CQ27G2U/BK</strong> ou <strong>24G2SPAE</strong>.</p>'
          : '<h3>Référence vide</h3><p>Tapez une référence AOC, par exemple <strong>Q27G2U</strong> ou <strong>CQ27G2U/BK</strong>.</p>';
        return;
      }

      var couleur = res.verdict === 'ok' ? 'text-green' : (res.verdict === 'attention' ? 'text-orange' : 'text-cyan');
      var titre = res.verdict === 'ok'
        ? "C'est bien celui que vous croyez"
        : (res.verdict === 'attention' ? 'Attention, ce n\'est pas le même écran' : 'Référence non répertoriée');

      var rows = [
        ['Dalle', res.dalle],
        ['Courbure', res.courbure],
        ['Taille', res.taille],
        ['Définition', res.res],
        ['Fréquence', res.hz],
        ['USB', res.usb],
        ['Sortie', res.sortie]
      ];
      var html = '<h3><span class="' + couleur + '">' + titre + '</span> — ' + res.nom + '</h3>';
      html += '<p>' + res.resume + '</p>';
      html += '<div class="table-wrap mt-2"><table class="comp-table"><caption class="sr-only">Caractéristiques décodées de la référence ' + res.nom + '</caption><tbody>';
      for (var i = 0; i < rows.length; i++) {
        html += '<tr><td class="model-name">' + rows[i][0] + '</td><td>' + rows[i][1] + '</td></tr>';
      }
      html += '</tbody></table></div>';
      if (!res.exact) {
        html += '<p class="text-muted mt-2" style="font-size:0.85rem">Décodage déduit de la grammaire des références AOC. Non vérifié sur une fiche constructeur.</p>';
      }
      html += '<p class="mt-2"><a class="btn-amazon" href="' + res.lien + '" target="_blank" rel="nofollow noopener">Voir le ' + res.nom + ' sur Amazon</a></p>';

      out.hidden = false;
      out.innerHTML = html;
      kpEvent('outbound_click_intent', { tool: 'aoc_decoder', ref: res.nom });
    }

    btn.addEventListener('click', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); render(); }
    });

    root.querySelectorAll('[data-aoc-preset]').forEach(function (b) {
      b.addEventListener('click', function () {
        input.value = b.getAttribute('data-aoc-preset');
        render();
      });
    });
  }

  /* --------------------------------------------
     2. CALCULATEUR PPI (reutilisable)
     PPI = racine(largeur^2 + hauteur^2) / diagonale
     Pas de pixel (mm) = 25,4 / PPI
     -------------------------------------------- */

  function computePpi(wPx, hPx, diagIn) {
    if (!(wPx > 0 && hPx > 0 && diagIn > 0)) return null;
    var diagPx = Math.sqrt(wPx * wPx + hPx * hPx);
    var ppi = diagPx / diagIn;
    return {
      ppi: ppi,
      diagPx: diagPx,
      pitchMm: 25.4 / ppi,
      // Largeur/hauteur physiques de la dalle, en cm.
      largeurCm: (wPx / ppi) * 2.54,
      hauteurCm: (hPx / ppi) * 2.54
    };
  }

  function ppiVerdict(ppi) {
    if (ppi < 90) return { cls: 'text-orange', mot: 'Grossier', txt: 'Sous 90 PPI, la grille de pixels se voit sur les contours de texte à 70 cm. Acceptable en jeu et de loin, pénible pour lire toute la journee.' };
    if (ppi < 120) return { cls: 'text-green', mot: 'Le point d\'équilibre', txt: 'Entre 90 et 120 PPI, Windows tourne à 100 % sans mise a l\'echelle et le texte est déjà net. Rien a régler.' };
    if (ppi < 150) return { cls: 'text-cyan', mot: 'Dense', txt: 'Au-delà de 120 PPI, une mise a l\'echelle de 125 à 150 % devient nécessaire pour que le texte reste lisible.' };
    return { cls: 'text-cyan', mot: 'Tres dense', txt: 'Au-delà de 150 PPI, le texte est quasi imprimé, mais le scaling à 150 % est obligatoire : vous payez la netteté, pas la surface de travail.' };
  }

  function fmt(n, d) {
    return n.toFixed(d === undefined ? 1 : d).replace('.', ',');
  }

  function mountPpi(root) {
    var selRes = find(root, '[data-ppi-res]');
    var inDiag = find(root, '[data-ppi-diag]');
    var btn = find(root, '[data-ppi-btn]');
    var out = find(root, '[data-ppi-result]');
    if (!selRes || !inDiag || !btn || !out) return;

    function render() {
      var parts = String(selRes.value || '').split('x');
      var w = parseInt(parts[0], 10);
      var h = parseInt(parts[1], 10);
      var diag = parseFloat(String(inDiag.value).replace(',', '.'));
      var r = computePpi(w, h, diag);

      if (!r) {
        out.hidden = false;
        out.innerHTML = '<h3>Diagonale invalide</h3><p>Entrez une diagonale en pouces, entre 15 et 60.</p>';
        return;
      }
      var v = ppiVerdict(r.ppi);
      out.hidden = false;
      out.innerHTML =
        '<h3><span class="' + v.cls + '">' + fmt(r.ppi) + ' PPI — ' + v.mot + '</span></h3>' +
        '<p>' + v.txt + '</p>' +
        '<div class="specs mt-2">' +
        '<span class="spec spec--highlight"><span class="spec-label">PPI</span> <span class="spec-value">' + fmt(r.ppi) + '</span></span>' +
        '<span class="spec"><span class="spec-label">Pas de pixel</span> <span class="spec-value">' + fmt(r.pitchMm, 2) + ' mm</span></span>' +
        '<span class="spec"><span class="spec-label">Dalle</span> <span class="spec-value">' + fmt(r.largeurCm) + ' x ' + fmt(r.hauteurCm) + ' cm</span></span>' +
        '<span class="spec"><span class="spec-label">Diag. en px</span> <span class="spec-value">' + Math.round(r.diagPx) + '</span></span>' +
        '</div>' +
        '<p class="text-muted mt-2" style="font-size:0.85rem">Calcul : &radic;(' + w + '&sup2; + ' + h + '&sup2;) = ' + Math.round(r.diagPx) + ' px de diagonale, divisé par ' + fmt(diag) + ' pouces. Refaites-le à la main, vous trouverez la même chose.</p>';
    }

    btn.addEventListener('click', render);
    selRes.addEventListener('change', render);
    inDiag.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); render(); }
    });
  }

  /* --------------------------------------------
     3. COMPARATEUR PERSISTANT (localStorage)
     -------------------------------------------- */

  var STORE_KEY = 'qec_compare_v1';

  function loadCompare() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function saveCompare(arr) {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  function renderCompareList() {
    var list = document.querySelector('[data-compare-list]');
    if (!list) return;
    var items = loadCompare();

    if (!items.length) {
      list.innerHTML = '<p class="text-muted">Aucun écran dans votre comparateur. Cochez « Comparer » sur les écrans qui vous intéressent : la liste vous suit de page en page, elle est gardée dans votre navigateur.</p>';
    } else {
      var html = '<div class="table-wrap"><table class="comp-table"><caption class="sr-only">Écrans retenus dans votre comparateur</caption><thead><tr><th>Écran</th><th>Dalle</th><th>Définition</th><th>Fréquence</th><th></th></tr></thead><tbody>';
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        html += '<tr>' +
          '<td class="model-name">' + esc(it.nom) + '</td>' +
          '<td>' + esc(it.dalle || '-') + '</td>' +
          '<td>' + esc(it.res || '-') + '</td>' +
          '<td>' + esc(it.hz || '-') + '</td>' +
          '<td><button type="button" class="btn-details" data-compare-remove="' + esc(it.id) + '">Retirer</button></td>' +
          '</tr>';
      }
      html += '</tbody></table></div>';
      list.innerHTML = html;
    }

    syncCompareButtons();
  }

  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function syncCompareButtons() {
    var items = loadCompare();
    document.querySelectorAll('[data-compare-add]').forEach(function (btn) {
      var id = btn.getAttribute('data-compare-add');
      var inList = items.some(function (i) { return i.id === id; });
      btn.textContent = inList ? '✓ dans le comparateur' : '+ Comparer';
      btn.setAttribute('aria-pressed', inList ? 'true' : 'false');
    });
    var count = document.querySelector('[data-compare-count]');
    if (count) count.textContent = String(items.length);
  }

  function initCompare() {
    if (!document.querySelector('[data-compare-add]') && !document.querySelector('[data-compare-list]')) return;

    document.addEventListener('click', function (e) {
      var add = e.target.closest('[data-compare-add]');
      if (add) {
        var id = add.getAttribute('data-compare-add');
        var items = loadCompare();
        var idx = -1;
        for (var i = 0; i < items.length; i++) if (items[i].id === id) idx = i;

        if (idx >= 0) {
          items.splice(idx, 1);
        } else {
          items.push({
            id: id,
            nom: add.getAttribute('data-compare-nom') || id,
            dalle: add.getAttribute('data-compare-dalle') || '',
            res: add.getAttribute('data-compare-res') || '',
            hz: add.getAttribute('data-compare-hz') || ''
          });
          kpEvent('compare_add', { product: add.getAttribute('data-compare-nom') || id });
        }
        saveCompare(items);
        renderCompareList();
        return;
      }

      var rm = e.target.closest('[data-compare-remove]');
      if (rm) {
        var rid = rm.getAttribute('data-compare-remove');
        var list = loadCompare().filter(function (i) { return i.id !== rid; });
        saveCompare(list);
        renderCompareList();
        return;
      }

      var clear = e.target.closest('[data-compare-clear]');
      if (clear) {
        saveCompare([]);
        renderCompareList();
      }
    });

    renderCompareList();
  }

  /* --------------------------------------------
     4. TABLEAU TRIABLE
     -------------------------------------------- */

  function cellValue(row, index) {
    var cell = row.cells[index];
    if (!cell) return '';
    var raw = cell.getAttribute('data-sort-value');
    return raw !== null ? raw : cell.textContent.trim();
  }

  function initSortable() {
    document.querySelectorAll('table[data-sortable]').forEach(function (table) {
      var headers = table.querySelectorAll('thead th');
      headers.forEach(function (th, index) {
        if (th.hasAttribute('data-no-sort')) return;
        th.setAttribute('role', 'button');
        th.setAttribute('tabindex', '0');
        th.style.cursor = 'pointer';
        th.title = 'Trier sur cette colonne';

        function sort() {
          var body = table.tBodies[0];
          if (!body) return;
          var rows = Array.prototype.slice.call(body.rows);
          var asc = th.getAttribute('data-sort-dir') !== 'asc';

          rows.sort(function (a, b) {
            var va = cellValue(a, index);
            var vb = cellValue(b, index);
            var na = parseFloat(String(va).replace(',', '.'));
            var nb = parseFloat(String(vb).replace(',', '.'));
            var cmp;
            if (!isNaN(na) && !isNaN(nb)) cmp = na - nb;
            else cmp = String(va).localeCompare(String(vb), 'fr');
            return asc ? cmp : -cmp;
          });

          rows.forEach(function (r) { body.appendChild(r); });
          headers.forEach(function (h) {
            h.removeAttribute('data-sort-dir');
            h.setAttribute('aria-sort', 'none');
          });
          th.setAttribute('data-sort-dir', asc ? 'asc' : 'desc');
          th.setAttribute('aria-sort', asc ? 'ascending' : 'descending');
        }

        th.addEventListener('click', sort);
        th.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sort(); }
        });
      });
    });
  }

  /* -------------------------------------------- */

  function init() {
    document.querySelectorAll('[data-aoc-decoder]').forEach(mountDecoder);
    document.querySelectorAll('[data-ppi-calc]').forEach(mountPpi);
    initCompare();
    initSortable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose pour tests / réutilisation sur d'autres pages du parc.
  window.QEC = { decodeAoc: decodeAoc, computePpi: computePpi, normalizeRef: normalizeRef };
})();
