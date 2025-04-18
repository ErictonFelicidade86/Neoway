#!/bin/sh
echo "🕓 Aguardando geração do relatório Allure..."

while [ ! -f /usr/share/nginx/html/index.html ]; do
  sleep 2
done

echo "✅ Relatório encontrado! Iniciando NGINX..."
sleep 2
echo "🚀 Iniciando NGINX..."
exec nginx -g 'daemon off;'