# 📱 Guide de Génération de l'APK - Tiéba Market

Ce projet a été configuré avec **Capacitor** pour permettre la génération d'une application Android native (APK).

## 🛠 Prérequis
1. **Android Studio** installé sur votre ordinateur.
2. **Java JDK 17** ou plus récent.
3. Le projet doit être buildé au moins une fois.

## 🚀 Étapes pour générer l'APK

### 1. Préparer le projet Next.js
Si vous avez un serveur distant (ex: Vercel), modifiez `capacitor.config.ts` pour y ajouter l'URL :
```typescript
server: {
  url: 'https://votre-site.com',
  allowNavigation: ['votre-site.com']
}
```

### 2. Build et Synchronisation
Exécutez ces commandes dans votre terminal :
```bash
npm run build
npx cap sync
```

### 3. Ouvrir dans Android Studio
Lancez la commande suivante pour ouvrir le projet natif :
```bash
npx cap open android
```

### 4. Générer l'APK dans Android Studio
Une fois Android Studio ouvert et le projet chargé (cela peut prendre quelques minutes) :
1. Allez dans le menu **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
2. Android Studio va compiler l'application.
3. Une fois terminé, une notification apparaîtra. Cliquez sur **locate** pour trouver votre fichier `app-debug.apk`.

## 🎨 Personnalisation (Icônes & Splash)
Les ressources se trouvent dans le dossier `./android/app/src/main/res`.
- Les icônes sont dans les dossiers `mipmap-*`.
- Vous pouvez utiliser un générateur comme [App Icon Generator](https://appicon.co/) pour créer toutes les tailles requises.

## ⚠️ Notes importantes
- **NextAuth** : Pour que la connexion fonctionne dans l'APK, assurez-vous que `NEXTAUTH_URL` dans vos variables d'environnement pointe bien vers l'URL publique de votre site.
- **Permissions** : Le projet est déjà configuré pour demander la Géolocalisation (nécessaire pour les livreurs).
