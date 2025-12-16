# Tri Alphabétique et Filtre par Catégorie

## Branche
`feature/alphabetical-sorting-and-category-filter`

## Changements Implémentés

### 1. Tri Alphabétique des Exercices

Les exercices sont maintenant affichés par ordre alphabétique du titre dans :
- **Homepage** (`/`) : Tous les exercices sont triés alphabétiquement (A1, A2, B1, B2, etc.)
- **Dashboard Admin** (`/admin/dashboard`) : Les 10 exercices récents sont triés alphabétiquement
- **Gestion des Posts** (`/admin/posts`) : Tous les exercices sont triés alphabétiquement

### 2. Filtre par Catégorie dans le Dashboard

Ajout d'un sélecteur de catégorie dans :
- **Dashboard Admin** : Dropdown pour filtrer les exercices par catégorie
- **Gestion des Posts** : Dropdown pour filtrer tous les posts par catégorie

Le filtre permet de voir uniquement les exercices d'une catégorie spécifique (Arithmétique, Algèbre, Probabilités, etc.)

## Fichiers Modifiés

### Controllers
- `controllers/blogController.js` : Changement du tri de `createdAt: -1` à `title: 1`
- `controllers/adminController.js` : 
  - Ajout du filtre par catégorie dans `dashboard()`
  - Ajout du filtre par catégorie dans `managePosts()`
  - Changement du tri de `createdAt: -1` à `title: 1`

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
- ✅ Exercices triés alphabétiquement par titre
- ✅ Filtre par catégorie existant (déjà implémenté)

### Dashboard Admin
- ✅ Exercices triés alphabétiquement par titre
- ✅ Nouveau filtre par catégorie
- ✅ Affichage des 10 premiers exercices (alphabétiquement)

### Gestion des Posts
- ✅ Tous les exercices triés alphabétiquement par titre
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

1. Vérifier que les exercices sur la homepage sont triés alphabétiquement
2. Vérifier que le filtre par catégorie fonctionne dans le dashboard
3. Vérifier que le filtre par catégorie fonctionne dans la gestion des posts
4. Vérifier que le tri alphabétique est maintenu après le filtrage
5. Vérifier que "All Categories" affiche tous les exercices

## Commit
```
Tri alphabétique des exercices et filtre par catégorie dans le dashboard

- Tri alphabétique par titre dans la homepage (blogController.js)
- Tri alphabétique par titre dans le dashboard (adminController.js)
- Ajout du filtre par catégorie dans le dashboard (dashboard.ejs)
- Ajout du filtre par catégorie dans la page de gestion des posts (posts.ejs)
- Les exercices sont maintenant affichés dans l'ordre : Exercice A1, A2, etc.
```
