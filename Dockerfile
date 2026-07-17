FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Glob volontaire : un COPY fichier par fichier a deja fait qu'une page publiee
# (aoc-q27g2u.html) n'etait pas dans l'image. nginx servait alors index.html en
# fallback -> soft 404 a 200, aucune alerte. Toute nouvelle page .html part
# desormais en prod sans toucher au Dockerfile.
COPY *.html /usr/share/nginx/html/
COPY robots.txt /usr/share/nginx/html/
COPY sitemap.xml /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY img/ /usr/share/nginx/html/img/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
