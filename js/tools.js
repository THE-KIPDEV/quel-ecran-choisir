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
     1bis. DECODEUR DE REFERENCE LG ULTRAGEAR
     Grammaire de la gamme UltraGear :
       [taille]G[lettre-génération][tier][suffixe]-[coloris]
       G           = UltraGear (gaming)
       2e lettre   = génération / millésime :
                     L ≈ 2019-2020, N ≈ 2020, P ≈ 2021, R ≈ 2022-2023, X = OLED
       850/83B/800 = le tier dans la génération
       P avant -B  = variante revendeur/région (même dalle) : 27GP850P-B = 27GP850-B
       -B / -W     = coloris (Black / White)
     -------------------------------------------- */

  var LG_KNOWN = {
    '27GP850': {
      nom: 'LG UltraGear 27GP850-B',
      dalle: 'Nano IPS', courbure: 'Plate', taille: '27"', res: '2560 x 1440 (QHD)',
      hz: '165 Hz natif, 180 Hz en overclock (via DisplayPort 1.4)',
      reponse: '1 ms GtG', hdr: 'VESA DisplayHDR 400', usb: 'Hub USB 3.0 intégré',
      sortie: '2021 (génération GP)',
      verdict: 'ok',
      resume: "C'est la référence de 2021 que la plupart des gens veulent : Nano IPS 1440p, 165 Hz poussable à 180, DisplayHDR 400 et un hub USB. Le hub et la certification HDR400 sont précisément ce qui la sépare de sa petite sœur 27GP83B-B.",
      lien: 'https://www.amazon.fr/s?k=LG+27GP850-B&tag=yohannleskits-21'
    },
    '27GP850P': {
      nom: 'LG UltraGear 27GP850P-B',
      dalle: 'Nano IPS', courbure: 'Plate', taille: '27"', res: '2560 x 1440 (QHD)',
      hz: '165 Hz natif, 180 Hz en overclock (via DisplayPort 1.4)',
      reponse: '1 ms GtG', hdr: 'VESA DisplayHDR 400', usb: 'Hub USB 3.0 intégré',
      sortie: '2021 (génération GP)',
      verdict: 'ok',
      resume: "Le P inséré avant le -B n'est pas une meilleure version : c'est la même dalle Nano IPS, les mêmes 165/180 Hz, le même hub USB que le 27GP850-B. Ce suffixe est une référence de revendeur/région (elle apparaît sur les fiches UK/EU). Ne payez pas plus cher pour le P : les deux cartons contiennent le même écran.",
      lien: 'https://www.amazon.fr/s?k=LG+27GP850P-B&tag=yohannleskits-21'
    },
    '27GP83B': {
      nom: 'LG UltraGear 27GP83B-B',
      dalle: 'Nano IPS', courbure: 'Plate', taille: '27"', res: '2560 x 1440 (QHD)',
      hz: '165 Hz natif, 180 Hz en overclock (via DisplayPort 1.4)',
      reponse: '1 ms GtG', hdr: 'HDR10 seul (pas de certification DisplayHDR 400)',
      usb: 'Aucun hub USB',
      sortie: '2021 (génération GP)',
      verdict: 'attention',
      resume: "Même dalle Nano IPS que le 27GP850-B, mêmes 165/180 Hz : sur l'image et la fluidité, vous ne verrez pas la différence. Ce qui saute, c'est le hub USB (absent) et la certification DisplayHDR 400 (ici c'est du HDR10 non certifié). C'est la version dégradée, à ne prendre que si elle est nettement moins chère.",
      lien: 'https://www.amazon.fr/s?k=LG+27GP83B-B&tag=yohannleskits-21'
    },
    '27GL850': {
      nom: 'LG UltraGear 27GL850-B',
      dalle: 'Nano IPS', courbure: 'Plate', taille: '27"', res: '2560 x 1440 (QHD)',
      hz: '144 Hz', reponse: '1 ms GtG', hdr: 'VESA DisplayHDR 400', usb: 'Hub USB 3.0 intégré',
      sortie: '2019 (génération GL)',
      verdict: 'attention',
      resume: "C'est l'ancêtre de 2019 (génération GL, pas GP). Même diagonale, même Nano IPS, mais 144 Hz au lieu de 165/180. Un GL vendu au prix d'un GP n'a aucun intérêt : vous payez une génération pour une fréquence de moins.",
      lien: 'https://www.amazon.fr/s?k=LG+27GL850-B&tag=yohannleskits-21'
    },
    '27GN850': {
      nom: 'LG UltraGear 27GN850-B',
      dalle: 'Nano IPS', courbure: 'Plate', taille: '27"', res: '2560 x 1440 (QHD)',
      hz: '144 Hz natif, 165 Hz en overclock', reponse: '1 ms GtG', hdr: 'VESA DisplayHDR 400',
      usb: 'Hub USB 3.0 intégré',
      sortie: '2020 (génération GN)',
      verdict: 'attention',
      resume: "La génération intermédiaire de 2020 (GN). 144 Hz natif, 165 Hz en overclock : un cran sous le 27GP850 qui fait 165 natif et grimpe à 180. Bon écran, mais ce n'est pas le GP que vous cherchiez si vous visiez les 180 Hz.",
      lien: 'https://www.amazon.fr/s?k=LG+27GN850-B&tag=yohannleskits-21'
    },
    '27GR83Q': {
      nom: 'LG UltraGear 27GR83Q-B',
      dalle: 'IPS', courbure: 'Plate', taille: '27"', res: '2560 x 1440 (QHD)',
      hz: '240 Hz', reponse: '1 ms GtG', hdr: 'VESA DisplayHDR 400', usb: 'Aucun hub USB',
      sortie: '2023 (génération GR)',
      verdict: 'ok',
      resume: "Le cran au-dessus de 2023 : même 1440p, mais 240 Hz et HDMI 2.1. Si vous hésitez avec le 27GP850, la vraie question est : avez-vous une carte graphique capable de pousser 240 fps en 1440p ? Sinon, les 75 Hz de plus ne se voient pas et vous payez pour rien.",
      lien: 'https://www.amazon.fr/s?k=LG+27GR83Q-B&tag=yohannleskits-21'
    },
    '27GL83A': {
      nom: 'LG UltraGear 27GL83A-B',
      dalle: 'Nano IPS', courbure: 'Plate', taille: '27"', res: '2560 x 1440 (QHD)',
      hz: '144 Hz', reponse: '1 ms GtG', hdr: 'HDR10 seul', usb: 'Aucun hub USB',
      sortie: '2020 (génération GL, version réduite)',
      verdict: 'attention',
      resume: "La version allégée du GL850 de 2019 : 144 Hz, mais sans hub USB ni DisplayHDR 400. Deux générations derrière le 27GP850 et amputée de ses ports. À réserver aux très bonnes affaires.",
      lien: 'https://www.amazon.fr/s?k=LG+27GL83A-B&tag=yohannleskits-21'
    }
  };

  // Normalise une référence LG : majuscules, retire espaces, "LG", "ULTRAGEAR"
  // et le coloris final (-B, -W, /BK...). Conserve le P de 27GP850P et le B de 27GP83B.
  function normalizeLg(raw) {
    var s = String(raw || '').toUpperCase();
    s = s.replace(/\s+/g, '');
    s = s.replace(/ULTRAGEAR/g, '').replace(/^LG/, '');
    // coloris : seulement précédé d'un tiret ou d'un slash, sinon on garde (27GP83B)
    s = s.replace(/[-/](BK|WS|SW|B|W)$/, '');
    return s;
  }

  function decodeLgGrammar(ref) {
    var m = ref.match(/^(\d{2,3})G([A-Z])(\d{2,4})([A-Z]?)$/);
    if (!m) return null;
    var taille = m[1];
    var gen = m[2];
    var genMap = {
      L: '≈ 2019-2020 (génération GL)',
      N: '≈ 2020 (génération GN)',
      P: '≈ 2021 (génération GP)',
      R: '≈ 2022-2023 (génération GR)',
      S: '≈ 2024 (génération GS)',
      X: 'dalle OLED (série GX)'
    };
    return {
      nom: 'LG UltraGear ' + ref,
      dalle: gen === 'X' ? 'OLED (série GX)' : 'IPS / Nano IPS selon le tier (à vérifier)',
      courbure: 'À vérifier (la plupart des 27" UltraGear sont plats)',
      taille: taille + '"',
      res: taille === '27' ? 'Souvent 2560 x 1440 sur cette diagonale (à confirmer)' : 'À vérifier sur la fiche',
      hz: 'Gamme gaming : 144 Hz ou plus, à vérifier',
      reponse: 'À vérifier', hdr: 'À vérifier',
      usb: 'À vérifier sur la fiche du vendeur',
      sortie: genMap[gen] || 'Génération non répertoriée ici',
      verdict: 'inconnu',
      resume: "Cette référence exacte n'est pas dans notre table vérifiée. Le décodage vient de la grammaire UltraGear (la 2e lettre après le G indique le millésime), pas d'une fiche constructeur : confirmez la dalle et la fréquence sur la fiche du vendeur avant de commander.",
      lien: 'https://www.amazon.fr/s?k=LG+' + encodeURIComponent(ref) + '&tag=yohannleskits-21'
    };
  }

  function decodeLg(raw) {
    var ref = normalizeLg(raw);
    if (!ref) return null;
    if (LG_KNOWN[ref]) {
      var known = LG_KNOWN[ref];
      var copy = {};
      for (var k in known) if (Object.prototype.hasOwnProperty.call(known, k)) copy[k] = known[k];
      copy.exact = true;
      return copy;
    }
    // 27GP850P non listé mais 27GP850 connu → variante revendeur du modèle de base
    if (/P$/.test(ref) && LG_KNOWN[ref.slice(0, -1)]) {
      var base = LG_KNOWN[ref.slice(0, -1)];
      var c = {};
      for (var j in base) if (Object.prototype.hasOwnProperty.call(base, j)) c[j] = base[j];
      c.nom = 'LG UltraGear ' + ref + '-B';
      c.resume = "Le P final est un suffixe de revendeur/région : même dalle et mêmes specs que le " + base.nom + ". Ne payez pas de supplément pour cette variante.";
      c.exact = true;
      return c;
    }
    var g = decodeLgGrammar(ref);
    if (g) g.exact = false;
    return g;
  }

  function mountLgDecoder(root) {
    var input = find(root, '[data-lg-input]');
    var btn = find(root, '[data-lg-btn]');
    var out = find(root, '[data-lg-result]');
    if (!input || !btn || !out) return;

    function render() {
      var saisie = normalizeLg(input.value);
      var res = decodeLg(input.value);
      if (!res) {
        out.hidden = false;
        out.innerHTML = saisie
          ? '<h3>Référence illisible</h3><p>« ' + esc(input.value) + ' » ne suit pas la grammaire des références LG UltraGear. Ce décodeur ne connaît que les écrans LG : pour une autre marque, il ne saura rien vous dire. Une référence UltraGear ressemble à <strong>27GP850-B</strong>, <strong>27GP83B-B</strong> ou <strong>27GR83Q-B</strong>.</p>'
          : '<h3>Référence vide</h3><p>Tapez une référence LG, par exemple <strong>27GP850P-B</strong> ou <strong>27GP83B-B</strong>.</p>';
        return;
      }

      var couleur = res.verdict === 'ok' ? 'text-green' : (res.verdict === 'attention' ? 'text-orange' : 'text-cyan');
      var titre = res.verdict === 'ok'
        ? "C'est bien la génération que vous croyez"
        : (res.verdict === 'attention' ? 'Attention, ce n\'est pas exactement le 27GP850' : 'Référence non répertoriée');

      var rows = [
        ['Dalle', res.dalle],
        ['Courbure', res.courbure],
        ['Taille', res.taille],
        ['Définition', res.res],
        ['Fréquence', res.hz],
        ['Temps de réponse', res.reponse],
        ['HDR', res.hdr],
        ['USB', res.usb],
        ['Génération', res.sortie]
      ];
      var html = '<h3><span class="' + couleur + '">' + titre + '</span> — ' + res.nom + '</h3>';
      html += '<p>' + res.resume + '</p>';
      html += '<div class="table-wrap mt-2"><table class="comp-table"><caption class="sr-only">Caractéristiques décodées de la référence ' + res.nom + '</caption><tbody>';
      for (var i = 0; i < rows.length; i++) {
        html += '<tr><td class="model-name">' + rows[i][0] + '</td><td>' + rows[i][1] + '</td></tr>';
      }
      html += '</tbody></table></div>';
      if (!res.exact) {
        html += '<p class="text-muted mt-2" style="font-size:0.85rem">Décodage déduit de la grammaire UltraGear. Non vérifié sur une fiche constructeur.</p>';
      }
      html += '<p class="mt-2"><a class="btn-amazon" href="' + res.lien + '" target="_blank" rel="nofollow noopener">Voir le ' + res.nom + ' sur Amazon</a></p>';

      out.hidden = false;
      out.innerHTML = html;
      kpEvent('outbound_click_intent', { tool: 'lg_decoder', ref: res.nom });
    }

    btn.addEventListener('click', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); render(); }
    });

    root.querySelectorAll('[data-lg-preset]').forEach(function (b) {
      b.addEventListener('click', function () {
        input.value = b.getAttribute('data-lg-preset');
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
    document.querySelectorAll('[data-lg-decoder]').forEach(mountLgDecoder);
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
  window.QEC = { decodeAoc: decodeAoc, decodeLg: decodeLg, computePpi: computePpi, normalizeRef: normalizeRef, normalizeLg: normalizeLg };
})();
