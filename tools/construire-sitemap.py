#!/usr/bin/env python3
"""Regénère sitemap.xml depuis les pages réellement présentes.

🚨 Pourquoi : au 09/09/2026, Google déclarait « 13 URLs soumises, 0 indexée » et
n'avait pas retéléchargé ce sitemap depuis le 24 juillet. Ses `lastmod` étaient
écrits à la main et figés. Un sitemap qui ne bouge jamais cesse d'être relu, et
cinq pages du site — pourtant liées par les treize autres et répondant 200 —
étaient encore « Google ne reconnaît pas cette URL », jamais explorées.

Le `lastmod` vient du mtime du fichier : il ne peut pas mentir, et il change
quand la page change.

    ./tools/construire-sitemap.py
"""
import datetime
import pathlib

RACINE = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://quel-ecran-choisir.fr"
EXCLUES = {"404.html"}

PRIORITES = {
    "index.html": ("1.0", "weekly"),
    "gaming.html": ("0.9", "weekly"),
    "pas-cher.html": ("0.9", "weekly"),
    "27-ou-32-pouces.html": ("0.9", "monthly"),
    "ecran-24-ou-27-pouces.html": ("0.9", "monthly"),
    "bureautique.html": ("0.8", "monthly"),
    "creation.html": ("0.8", "monthly"),
    "programmation.html": ("0.8", "monthly"),
    "ultrawide.html": ("0.8", "monthly"),
    "ecran-incurve-ou-plat.html": ("0.7", "monthly"),
    "meilleur-ecran-ps5.html": ("0.7", "monthly"),
    "aoc-q27g2u.html": ("0.6", "monthly"),
    "lg-ultragear-27gp850p-b.html": ("0.6", "monthly"),
}

lignes = ['<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

for page in sorted(RACINE.glob("*.html")):
    if page.name in EXCLUES:
        continue
    prio, freq = PRIORITES.get(page.name, ("0.5", "monthly"))
    loc = f"{SITE}/" if page.name == "index.html" else f"{SITE}/{page.name}"
    lastmod = datetime.date.fromtimestamp(page.stat().st_mtime).isoformat()
    lignes += ["  <url>", f"    <loc>{loc}</loc>", f"    <lastmod>{lastmod}</lastmod>",
               f"    <changefreq>{freq}</changefreq>", f"    <priority>{prio}</priority>", "  </url>"]

lignes.append("</urlset>")
(RACINE / "sitemap.xml").write_text("\n".join(lignes) + "\n", encoding="utf-8")
print(f"sitemap.xml : {sum(1 for l in lignes if l == '  <url>')} URLs")
