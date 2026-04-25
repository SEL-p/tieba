#!/bin/bash

# Configuration
APP_NAME="tieba-market"

echo "🚀 Démarrage du déploiement de $APP_NAME..."

# 1. Récupérer les dernières modifications
echo "📥 Récupération des fichiers depuis GitHub..."
git pull origin main

# 2. Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# 3. Synchroniser la base de données (Prisma)
echo "🗄️ Mise à jour de la base de données..."
npx prisma db push

# 4. Builder le projet
echo "🏗️ Construction du projet Next.js..."
npm run build

# 5. Redémarrer l'application avec PM2
echo "🔄 Redémarrage de l'application..."
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

# 6. Nettoyage
echo "🧹 Nettoyage du cache..."
npm cache clean --force

echo "✅ Déploiement terminé avec succès !"
