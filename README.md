# Calculateur de Notes GEA

Extension de navigateur (Manifest V3) et application Safari permettant de calculer et d'afficher automatiquement la moyenne pondérée directement sur le bulletin de notes de l'ENT (IUT GEA - Université de Limoges).

## Fonctionnalités

- **Calcul automatique de la moyenne** : Analyse les notes et coefficients affichés sur `signatures.unilim.fr` pour calculer en temps réel la moyenne générale et par unité d'enseignement.
- **Interface intégrée (Overlay)** : Affichage moderne et discret directement sur la page du bulletin.
- **Support Safari & Chrome/Chromium** :
  - Extension Web compatible Manifest V3 (`manifest.json`, `content.js`, `popup.html`).
  - Projet Xcode complet pour Safari macOS (`Calculateur de Notes GEA.xcodeproj`).

## Structure du projet

```text
extension-gea/
├── manifest.json                    # Fichier de configuration de l'extension (MV3)
├── content.js                       # Script d'analyse des notes et calcul des moyennes
├── popup.html                       # Fenêtre popup de l'extension
└── Calculateur de Notes GEA/        # Projet Safari macOS (Xcode)
```

## Installation & Utilisation

### Safari (macOS)
1. Ouvrez `Calculateur de Notes GEA/Calculateur de Notes GEA.xcodeproj` dans Xcode.
2. Compilez et lancez l'application.
3. Activez l'extension dans Safari > Réglages > Extensions.

### Chrome / Brave / Edge
1. Rendez-vous sur `chrome://extensions/`.
2. Activez le **Mode développeur** (en haut à droite).
3. Cliquez sur **Charger l'extension non empaquetée** et sélectionnez ce dossier.
