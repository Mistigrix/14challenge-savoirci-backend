# SavoirCI — Quiz interactif

Quiz interactif multi-catégories mêlant culture ivoirienne, technologie, géographie africaine et sciences.

**Challenge 14-14-14 — Jour 4**

## Stack technique

| Technologie | Rôle |
|---|---|
| Vue 3 | Framework frontend |
| Vite 8 | Build tool |
| Vue Router 4 | Navigation SPA |
| Pinia 3 | Gestion d'état |
| Nginx | Serveur de production (Docker) |

## Prérequis

- **Node.js 22+** (un fichier `.nvmrc` est fourni)
- **npm 10+**
- **Docker** (optionnel, pour le déploiement)

## Installation

```bash
nvm use 22
npm install
```

## Scripts disponibles

```bash
npm run dev       # Serveur de développement (http://localhost:5173)
npm run build     # Build de production → dossier dist/
npm run preview   # Prévisualiser le build de production
```

## Déploiement Docker

```bash
docker build -t savoirci .
docker run -p 8080:80 savoirci
```

L'application sera accessible sur `http://localhost:8080`.

## Variables d'environnement

Copier `.env.example` en `.env` pour configurer l'application.

| Variable | Description | Défaut |
|---|---|---|
| `VITE_API_URL` | URL de base de l'API backend | `http://localhost:3000/api` |

## Fonctionnalités

- 4 catégories de quiz : Côte d'Ivoire, Technologie, Afrique, Sciences
- 20 questions au total (5 par catégorie)
- Timer de 15 secondes par question
- Récapitulatif détaillé des réponses avec corrections
- Mode clair / sombre (persisté en localStorage)
- Design responsive (mobile, tablette, desktop)
- Navigation fixe avec menu burger sur mobile

## Architecture du projet

```
src/
├── assets/styles/     # Variables CSS et styles globaux (thème clair/sombre)
├── components/        # Composants réutilisables
│   ├── layout/        #   AppNav, AppFooter
│   ├── quiz/          #   QuizProgress, QuizTimer, QuizOption
│   ├── category/      #   CategoryCard
│   └── ui/            #   ThemeToggle
├── composables/       # Logique réutilisable (useTimer)
├── data/              # Données statiques (categories, questions)
├── router/            # Configuration Vue Router (lazy loading)
├── services/          # Appels API (prêt pour le backend)
├── stores/            # Pinia stores (theme, quiz)
└── views/             # Pages (Home, Categories, Quiz, Score, About)
```

## Équipe

| Nom | Rôle |
|---|---|
| Bath Dorgeles | Chef de projet & Front |
| Oclin Marcel C. | Dev Front-end |
| Rayane Irie | Back-end (Express) |
