# Tri Chronologique et Filtre par Catégorie

## Branche
`feature/alphabetical-sorting-and-category-filter`

## Changements Implémentés

### 1. Tri Chronologique des Exercices

Les exercices sont maintenant affichés par ordre chronologique (du premier créé au dernier créé) dans :
- **Homepage** (`/`) : Tous les exercices sont triés par date de création (ordre croissant)
- **Dashboard Admin** (`/admin/dashboard`) : Les 10 exercices récents sont triés par date de création
- **Gestion des Posts** (`/admin/posts`) : Tous les exercices sont triés par date de création

### 2. Filtre par Catégorie dans le Dashboard

Ajout d'un sélecteur de catégorie dans :
- **Dashboard Admin** : Dropdown pour filtrer les exercices par catégorie
- **Gestion des Posts** : Dropdown pour filtrer tous les posts par catégorie

Le filtre permet de voir uniquement les exercices d'une catégorie spécifique (Arithmétique, Algèbre, Probabilités, etc.)

## Fichiers Modifiés

### Controllers
- `controllers/blogController.js` : Changement du tri de `createdAt: -1` à `createdAt: 1` (chronologique)
- `controllers/adminController.js` : 
  - Ajout du filtre par catégorie dans `dashboard()`
  - Ajout du filtre par catégorie dans `managePosts()`
  - Changement du tri de `createdAt: -1` à `createdAt: 1` (chronologique)

### Vues
- `views/admin/dashboard.ejs` : 
  - Ajout d'un dropdown de sélection de catégorie
  - Ajout d'une fonction JavaScript `filterByCategory()`
- `views/admin/posts.ejs` :
  - Ajout d'un dropdown de sélection de catégorie
  - Ajout d'une fonction JavaScript `filterByCategory()`
  - Affichage de la catégorie sélectionnée dans le titre

## Fonctionnalités

### Homepage
- ✅ Exercices triés chronologiquement (du premier au dernier créé)
- ✅ Filtre par catégorie existant (déjà implémenté)

### Dashboard Admin
- ✅ Exercices triés chronologiquement (du premier au dernier créé)
- ✅ Nouveau filtre par catégorie
- ✅ Affichage des 10 premiers exercices (chronologiquement)

### Gestion des Posts
- ✅ Tous les exercices triés chronologiquement (du premier au dernier créé)
- ✅ Nouveau filtre par catégorie
- ✅ Indication de la catégorie active dans le titre

## Utilisation

### Filtrer par Catégorie dans le Dashboard
1. Aller sur `/admin/dashboard`
2. Sélectionner une catégorie dans le dropdown en haut à droite
3. Les exercices sont automatiquement filtrés et triés alphabétiquement

### Filtrer par Catégorie dans Gestion des Posts
1. Aller sur `/admin/posts`
2. Sélectionner une catégorie dans le dropdown
3. Tous les posts de cette catégorie sont affichés, triés alphabétiquement

## Tests Recommandés

1. Vérifier que les exercices sur la homepage sont triés chronologiquement (du plus ancien au plus récent)
2. Vérifier que le filtre par catégorie fonctionne dans le dashboard
3. Vérifier que le filtre par catégorie fonctionne dans la gestion des posts
4. Vérifier que le tri chronologique est maintenu après le filtrage
5. Vérifier que "All Categories" affiche tous les exercices

## Commits
```
1. Tri alphabétique des exercices et filtre par catégorie dans le dashboard
   - Tri alphabétique par titre dans la homepage (blogController.js)
   - Tri alphabétique par titre dans le dashboard (adminController.js)
   - Ajout du filtre par catégorie dans le dashboard (dashboard.ejs)
   - Ajout du filtre par catégorie dans la page de gestion des posts (posts.ejs)

2. Changement du tri: chronologique au lieu d'alphabétique
   - Homepage: tri par date de création (du premier au dernier créé)
   - Dashboard: tri par date de création (du premier au dernier créé)
   - Gestion des posts: tri par date de création (du premier au dernier créé)
   - Le filtre par catégorie reste fonctionnel
```
