# Simulateur de Notes GEA — Signatures Unilim (v2.0)

Extension de navigateur (Manifest V3) et application Safari macOS permettant de calculer, simuler et visualiser en temps réel ses moyennes et objectifs par UE directement sur le bulletin de notes **Signatures Unilim** (`https://signatures.unilim.fr/*` — BUT GEA, Université de Limoges).

## Fonctionnalités (v2.0)

- **Intégration native sur la page du bulletin** : Bandeau récapitulatif intégré directement au-dessus des tableaux de chaque semestre (compatible 1re, 2e et 3e année, tous parcours dont GEMA, GC2F, GPRH...).
- **Cartes par UE (Compétences 1 à 5)** :
  - Moyenne provisoire calculée en temps réel.
  - Barre de progression des coefficients notés et points acquis (`/1000 pts`).
  - Calcul automatique de la **note moyenne requise sur les coefficients restants** pour valider l'UE à **10/20** ou atteindre le seuil de compensation BUT à **8/20**.
- **Simulation interactive directe dans le tableau** :
  - Champs de saisie sur chaque devoir (`level-3`) et chaque module/ressource (`level-2`).
  - **Synchronisation inter-UE** : Les matières communes à plusieurs UEs (`SAE`, `PPP`, `Stage`) se synchronisent automatiquement dans toutes les UEs où elles comptent.
  - **Calcul automatique des SAÉ (Règle 60% / 40% IUT Limoges)** : Calcule automatiquement la part 40% (moyenne des ressources associées) et la combine avec la note projet (60%).
  - Boutons de simulation rapide (*Simuler 10/20 partout*, *Simuler 12/20 partout*, *Réinitialiser*) et sauvegarde locale (`localStorage`).
- **Onglet BILAN enrichi** : Mise à jour en direct des moyennes semestrielles, annuelles et de l'objectif de compensation au semestre pair.

## Structure du projet

```text
extension-gea/
├── manifest.json       # Configuration de l'extension Web (Manifest V3)
├── content.js          # Moteur de calcul, simulation interactive et intégration DOM
├── popup.html          # Fenêtre popup de l'extension
├── icon.png            # Icône de l'extension
└── Simulateur GEA/     # Projet Xcode pour l'extension Safari macOS
```

## Installation

### Safari (macOS)
1. Ouvrez `Simulateur GEA/Simulateur GEA.xcodeproj` dans Xcode.
2. Compilez et lancez l'application (`Cmd + R`).
3. Activez l'extension dans **Safari > Réglages > Extensions**.

### Chrome / Brave / Arc / Edge
1. Rendez-vous sur `chrome://extensions/`.
2. Activez le **Mode développeur** (en haut à droite).
3. Cliquez sur **Charger l'extension non empaquetée** et sélectionnez ce dossier.
