# 🗺️ Géoportail interactif – Région du Grand Casablanca

## 📌 Description

Ce projet consiste en l’élaboration d’un Géoportail interactif développé avec *ArcGIS Maps SDK for JavaScript*, permettant de visualiser, explorer et interagir avec des données géographiques de la région du *Grand Casablanca*. Le portail est destiné à informer les citoyens et à faciliter l’accès à des données spatiales thématiques à travers une interface intuitive.

---

## 🌍 Fonctionnalités principales

### 🗺️ Carte interactive
- Visualisation de la région du Grand Casablanca avec les couches suivantes :
  - Limites des communes
  - Réseau routier (voirie)
  - Population
  - Hôtels
  - Grandes surfaces
  - Centres de formation supérieurs
  - Fonds de carte multiples (satellite, topographique, rue, etc.)

### 🧰 Outils intégrés
- Navigation (zoom, pan, mesure)
- Changement de fond de carte (`BasemapGallery`)
- Légende (`Legend`)
- Recherche (`Search`)
- Fenêtres contextuelles sur clic des entités

---

## 🎨 Symbologie dynamique

### Couche **Communes**
- Affichage selon :
  - Préfecture
  - Commune/arrondissement
  - Surface (5 classes)

### Couche **Population**
- Affichage selon :
  - Population 2004 (5 classes)
  - Population 1994 (5 classes)
  - Comparaison 1994/2004 via diagrammes dans les pop-ups

---

## 🔍 Requêtes & Filtres

- Recherche d’hôtels par catégorie (1*, 2*, 3*, ...)
- Recherche de grandes surfaces par type (Marjane, Acima, ...)
- Affichage des résultats directement sur la carte avec pop-ups personnalisés

---

## ✍️ Édition et gestion des données

### Module "Gestion des réclamations"
- Ajout d’une couche dynamique de réclamations
- Possibilité d’ajouter des points de réclamation sur la carte (avec formulaire)
- Visualisation des réclamations existantes avec attributs

---

## ⚙️ Technologies utilisées

- **ArcGIS Maps SDK for JavaScript (4.x)**
- **HTML5 / CSS3**
- **ESRI WebMap / FeatureLayers**
- **Widgets ArcGIS (Legend, Search, BasemapGallery, etc.)**
- **JSON / REST Services (ArcGIS Online ou ArcGIS Server)**

---

