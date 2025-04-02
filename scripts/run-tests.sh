#!/bin/bash

echo "🚦 Parando containers anteriores (se houver)..."
docker-compose down

echo "🔨 Construindo imagem..."
docker-compose build

echo "🚀 Executando testes ..."
docker-compose up

echo "✅ Testes concluídos!"