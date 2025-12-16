# Guide de Test - Tri Chronologique et Filtre par Catégorie

## 🚀 Démarrage du Serveur

### Option 1 : Démarrage Normal
```bash
cd clean-blog
node index.js
```

### Option 2 : Avec nodemon (si installé)
```bash
npm run dev
```

Le serveur devrait démarrer sur `http://localhost:3000`

---

## ✅ Tests à Effectuer

### **Test 1 : Tri Chronologique sur la Homepage**

1. Ouvrez votre navigateur sur : `http://localhost:4000`
2. **Vérifier** : Les exercices sont affichés par ordre chronologique (du premier créé au dernier créé)
   - Le premier exercice créé apparaît en haut
   - Le dernier exercice créé apparaît en bas
3. ✅ **Résultat attendu** : Les exercices sont triés par date de création (ordre croissant)

---

### **Test 2 : Filtre par Catégorie sur la Homepage**

1. Sur `http://localhost:4000`
2. Cliquez sur les boutons de catégorie (Arithmétique, Algèbre, etc.)
3. **Vérifier** : 
   - Seuls les exercices de la catégorie sélectionnée s'affichent
   - Les exercices restent triés chronologiquement
   - Le bouton de la catégorie active est en bleu foncé
4. ✅ **Résultat attendu** : Filtrage fonctionnel + tri chronologique maintenu

---

### **Test 3 : Dashboard Admin - Tri Chronologique**

1. Connectez-vous en tant qu'admin : `http://localhost:4000/auth/login`
2. Allez sur le dashboard : `http://localhost:4000/admin/dashboard`
3. **Vérifier** dans la section "Recent Exercises" :
   - Les 10 premiers exercices sont triés par date de création (ordre croissant)
   - Le premier exercice créé apparaît en premier
4. ✅ **Résultat attendu** : Tri chronologique des exercices dans le dashboard

---

### **Test 4 : Dashboard Admin - Filtre par Catégorie**

1. Sur `http://localhost:4000/admin/dashboard`
2. En haut à droite de la section "Recent Exercises", trouvez le dropdown
3. **Vérifier** :
   - Sélectionner "All Categories" → tous les exercices s'affichent
   - Sélectionner "Arithmétique" → seuls les exercices d'arithmétique
   - Sélectionner "Algèbre" → seuls les exercices d'algèbre
   - etc.
4. **Vérifier** que l'URL change : `?category=Arithmétique`
5. **Vérifier** que le tri chronologique est maintenu après le filtrage
6. ✅ **Résultat attendu** : Filtre fonctionnel + tri chronologique

---

### **Test 5 : Gestion des Posts - Tri Chronologique**

1. Allez sur : `http://localhost:4000/admin/posts`
2. **Vérifier** :
   - Tous les exercices sont affichés
   - Triés par date de création (du premier au dernier créé)
3. ✅ **Résultat attendu** : Liste complète triée chronologiquement

---

### **Test 6 : Gestion des Posts - Filtre par Catégorie**

1. Sur `http://localhost:4000/admin/posts`
2. Utilisez le dropdown en haut pour filtrer par catégorie
3. **Vérifier** :
   - Le titre change pour afficher "All Posts (X) - Arithmétique"
   - Seuls les posts de la catégorie sélectionnée s'affichent
   - Le tri chronologique est maintenu
   - Le dropdown garde la sélection active
4. **Vérifier** que l'URL change : `?category=Probabilités`
5. ✅ **Résultat attendu** : Filtre + tri fonctionnent ensemble

---

### **Test 7 : Persistance du Filtre**

1. Sélectionnez une catégorie dans le dashboard
2. Rafraîchissez la page (F5)
3. **Vérifier** : La catégorie sélectionnée reste active
4. ✅ **Résultat attendu** : Le filtre persiste après rafraîchissement

---

### **Test 8 : Retour à "Toutes les Catégories"**

1. Après avoir filtré par une catégorie
2. Sélectionnez "All Categories"
3. **Vérifier** : 
   - Tous les exercices réapparaissent
   - Le tri alphabétique est maintenu
   - L'URL n'a plus le paramètre `?category=`
4. ✅ **Résultat attendu** : Retour à la vue complète

---

## 🐛 Points à Vérifier (Bugs Potentiels)

- [ ] Les exercices sans date de création ne causent pas d'erreur
- [ ] Le filtre fonctionne avec des catégories contenant des accents
- [ ] Pas d'erreur console dans le navigateur (F12 → Console)
- [ ] Le tri chronologique fonctionne correctement
- [ ] Le filtre fonctionne si une catégorie n'a aucun exercice

---

## 📸 Captures d'Écran Recommandées

Pour documenter les tests, prenez des captures d'écran de :

1. Homepage avec tri chronologique
2. Homepage avec filtre par catégorie actif
3. Dashboard avec dropdown de catégories
4. Dashboard filtré par une catégorie
5. Page de gestion des posts avec filtre actif

---

## 🔄 Comparaison Avant/Après

### **AVANT (branche main)**
- Exercices triés par date de création (plus récent en premier / ordre décroissant)
- Pas de filtre par catégorie dans le dashboard
- Pas de filtre par catégorie dans la gestion des posts

### **APRÈS (branche feature/alphabetical-sorting-and-category-filter)**
- ✅ Exercices triés chronologiquement (du premier au dernier créé / ordre croissant)
- ✅ Filtre par catégorie dans le dashboard
- ✅ Filtre par catégorie dans la gestion des posts
- ✅ Tri + filtre fonctionnent ensemble

---

## 🔧 En Cas de Problème

### Le serveur ne démarre pas
```bash
# Vérifier que MongoDB est en cours d'exécution
# Vérifier les variables d'environnement dans .env
# Vérifier les logs d'erreur dans la console
```

### Les exercices ne s'affichent pas
```bash
# Vérifier qu'il y a des exercices dans la base de données
# Vérifier la console du navigateur pour les erreurs JavaScript
# Vérifier les logs du serveur
```

### Le filtre ne fonctionne pas
```bash
# Ouvrir la console du navigateur (F12)
# Vérifier qu'il n'y a pas d'erreur JavaScript
# Vérifier que les catégories existent dans la base de données
```

---

## ✅ Checklist Finale

Avant de considérer les tests terminés :

- [ ] Tri chronologique fonctionne sur la homepage
- [ ] Tri chronologique fonctionne dans le dashboard
- [ ] Tri chronologique fonctionne dans la gestion des posts
- [ ] Filtre par catégorie fonctionne dans le dashboard
- [ ] Filtre par catégorie fonctionne dans la gestion des posts
- [ ] Le filtre persiste après rafraîchissement de page
- [ ] Aucune erreur dans la console du navigateur
- [ ] Aucune erreur dans les logs du serveur
- [ ] Le bouton "All Categories" fonctionne correctement
- [ ] L'URL est correctement mise à jour avec `?category=`

---

## 🎉 Validation Finale

Si tous les tests passent :
1. La branche est prête à être mergée dans `main`
2. Vous pouvez merger avec : `git checkout main && git merge feature/alphabetical-sorting-and-category-filter`

Si des bugs sont trouvés :
1. Notez-les dans un fichier
2. Signalez-les pour correction
3. Retestez après les corrections