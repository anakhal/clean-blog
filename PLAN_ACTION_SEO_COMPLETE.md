# 📋 Rapport d'Audit & Guide de Validation SEO - Mathématiques Bac

**Projet :** `mathematiques-bac.org` (Clean-Blog)  
**Infrastructure :** Google Cloud Run + Firestore (API MongoDB Enterprise)  
**Branche principale :** `main` (6 commits de correctifs appliqués)  
**Date :** Novembre 2026  

---

## 🚀 Résumé des Correctifs Appliqués (Phases 1 à 4)

| Phase | Objectif | Fichiers Modifiés | Bénéfice SEO |
|---|---|---|---|
| **Phase 1** | Déblocage Crawl Budget & Cold Starts | `index.js`, `deploy-gcp.sh`, `cloudbuild.yaml`, `views/index.ejs`, `views/layouts/header.ejs` | • Exemption totale de Googlebot du Rate Limiter (0 blocage HTTP 429)<br>• Maintien d'une instance chaude Cloud Run (`--min-instances=1`, TTFB < 600ms)<br>• Pagination par 15 exercices sur l'accueil (DOM réduit de 827 Ko à <80 Ko) |
| **Phase 2** | Éradication du Thin Content & Slugs | `models/BlogPost.js`, `controllers/blogController.js`, `views/post.ejs`, `scripts/generate_slugs.js` | • Fusion exercice et solution détaillée sur la même URL via accordéon interactif `<details>`<br>• Redirection 301 automatique des anciennes URLs de solutions vers l'exercice parent<br>• Slugs sémantiques uniques (`/post/:slug`) et redirection 301 des anciens IDs hexadécimaux<br>• Bloc pédagogique contextualisé (Bac SM, méthodologie) |
| **Phase 3** | Maillage Interne & Navigation | `routes/blog.js`, `controllers/blogController.js`, `views/post.ejs`, `views/layouts/header.ejs` | • Fil d'Ariane visuel et balisage Schema.org `BreadcrumbList` JSON-LD<br>• Boutons de navigation chronologique *Précédent* / *Suivant* (suppression des pages cul-de-sac)<br>• Grille d'exercices similaires dans le même chapitre<br>• Route indexable dédiée `/chapitre/:category` |
| **Phase 4** | Refonte du Sitemap & Données Structurées | `controllers/sitemapController.js`, `views/layouts/header.ejs` | • Sitemap filtré sur `{ type: 'exercise' }` avec slugs sémantiques et dates réelles `updatedAt`<br>• Inclusion des pages piliers `/chapitre/:category` avec priorité `0.8`<br>• Données structurées Schema.org `Quiz` & `LearningResource` (`PracticeProblem`) pour Rich Snippets Google |

---

## 🎯 Procédure Opérationnelle de Déploiement & Validation (Phase 5)

### Étape 1 : Publier le code sur GitHub & Cloud Build
Depuis votre terminal :
```bash
git push origin main
```
*Si vous utilisez Cloud Build connecté à GitHub, le conteneur Docker sera automatiquement compilé et déployé sur Cloud Run avec `--min-instances=1` et `--memory=1Gi`.*

---

### Étape 2 : Peupler les Slugs sur la Base de Données
Pour que tous vos exercices existants bénéficient immédiatement d'un slug sémantique :
```bash
node scripts/generate_slugs.js
```
*(Assurez-vous que votre variable d'environnement `MONGODB_URI` pointe vers votre base Firestore / MongoDB).*

---

### Étape 3 : Actions dans Google Search Console (GSC)

#### A. Inspection d'URL en Direct (Test de Rendu)
1. Rendez-vous sur [Google Search Console](https://search.google.com/search-console).
2. Dans la barre supérieure, inspectez une URL d'exercice (ex. `https://www.mathematiques-bac.org/post/...`).
3. Cliquez sur **"Tester l'URL en direct"** :
   - ✅ **Statut HTTP :** Doit être `200 OK` (aucun statut 429).
   - ✅ **Capture d'écran / Rendu HTML :** Vérifiez que l'énoncé et la balise de solution sont bien visibles.
   - ✅ **Éléments détectés :** Vérifiez la présence des données structurées **Fil d'Ariane (*Breadcrumbs*)** et **Exercices résolus / Quiz**.

#### B. Vérification de la Redirection 301 des Solutions
Inspectez une ancienne URL de solution isolée (ex. `https://www.mathematiques-bac.org/post/<id_solution>`) :
- GSC doit indiquer : *Page avec redirection* (`HTTP 301`) pointant vers l'exercice parent.

#### C. Soumission du Nouveau Sitemap
1. Dans le menu de gauche, allez dans **Indexation > Sitemaps**.
2. Renseignez l'URL : `sitemap.xml` et cliquez sur **Envoyer**.
3. Vérifiez que le nombre de pages découvertes correspond à la somme :
   - Page d'accueil (`/`)
   - Pages de chapitres (`/chapitre/...`)
   - Pages statiques (`about`, `contact`, `privacy`)
   - Exercices actifs uniques (sans les solutions orphelines doublons).

#### D. Lancement de la Validation de Correction
1. Allez dans **Indexation > Pages**.
2. Cliquez sur l'erreur rouge **"Explorée, actuellement non indexée"** (1 279 pages).
3. Cliquez sur le bouton bleu **"Valider la correction"**.
4. Répétez l'opération pour **"Détectée, actuellement non indexée"** (243 pages).

---

## 📈 Calendrier de Réindexation Attendu

```
Jour J (Déploiement) ──► Crawl Googlebot sans blocage 429 (Rate Limiter levé)
Semaine 1 à 2        ──► Traitement du Sitemap + Ré-évaluation du contenu (fin du Thin Content)
Semaine 3 à 4        ──► Bascule progressive des URLs vers "Pages indexées"
Semaine 6+           ──► Restauration du trafic organique et des Rich Snippets
```
