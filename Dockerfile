FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY index.html /usr/share/nginx/html/
COPY gaming.html /usr/share/nginx/html/
COPY bureautique.html /usr/share/nginx/html/
COPY creation.html /usr/share/nginx/html/
COPY programmation.html /usr/share/nginx/html/
COPY ultrawide.html /usr/share/nginx/html/
COPY pas-cher.html /usr/share/nginx/html/
COPY robots.txt /usr/share/nginx/html/
COPY sitemap.xml /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY img/ /usr/share/nginx/html/img/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
