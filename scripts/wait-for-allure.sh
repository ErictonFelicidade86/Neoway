#!/bin/sh
set -e

echo "🕓 Aguardando geração do relatório Allure..."

# Aguarda o arquivo index.html aparecer (relatório pronto)
while [ ! -f /usr/share/nginx/html/index.html ]; do
  sleep 2
done

echo "✅ Relatório encontrado! Iniciando NGINX..."
exec nginx -g 'daemon off;'
