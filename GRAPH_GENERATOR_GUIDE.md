# Guide d'utilisation du Générateur de Graphiques

## Vue d'ensemble

Le générateur de graphiques est un outil intégré dans le formulaire "Create Solution" qui vous permet de tracer des fonctions mathématiques avec leurs tangentes en des points spécifiques.

## Comment utiliser

### 1. Ouvrir le générateur

Dans le formulaire "Create Solution" (accessible via le bouton "Write Solution" dans le dashboard), cliquez sur le bouton **"Générer des Graphiques"** (bouton vert avec icône de graphique).

### 2. Saisir les fonctions

#### Fonction principale
- Entrez votre fonction mathématique dans le champ "Fonction 1"
- Exemples de syntaxe valides:
  - `x^2 * exp(x/5)` - Fonction polynomiale avec exponentielle
  - `sin(x)` - Fonction sinusoïdale
  - `x^3 - 2*x^2 + x - 1` - Polynôme
  - `sqrt(x)` - Racine carrée
  - `log(x)` - Logarithme naturel

#### Opérateurs et fonctions supportés
- **Opérateurs arithmétiques**: `+`, `-`, `*`, `/`, `^` (puissance)
- **Fonctions mathématiques**:
  - `exp(x)` - Exponentielle
  - `sin(x)`, `cos(x)`, `tan(x)` - Fonctions trigonométriques
  - `log(x)` - Logarithme naturel
  - `sqrt(x)` - Racine carrée

### 3. Ajouter des tangentes

Dans le champ "Tangentes en x", entrez les points où vous voulez tracer les tangentes, séparés par des virgules.

**Exemple**: `0, 1, -1`

Cela tracera les tangentes à la fonction aux points x=0, x=1, et x=-1.

### 4. Ajouter plusieurs fonctions

Cliquez sur le bouton **"+ Ajouter une fonction"** pour tracer plusieurs fonctions sur le même graphique.

Chaque fonction aura sa propre couleur:
- Fonction 1: Bleu
- Fonction 2: Rouge
- Fonction 3: Vert
- Fonction 4: Violet
- Etc.

### 5. Définir l'intervalle

Spécifiez l'intervalle de tracé:
- **De**: Valeur minimale de x (par défaut: -6)
- **À**: Valeur maximale de x (par défaut: 6)

### 6. Générer l'aperçu

Cliquez sur **"Générer l'aperçu"** pour visualiser le graphique.

Le graphique s'affichera avec:
- Les courbes des fonctions en traits pleins
- Les tangentes en traits pointillés
- Des points marqueurs aux points de tangence

### 7. Valider et insérer

Une fois satisfait de l'aperçu, cliquez sur **"Valider et insérer"** pour insérer le graphique dans votre solution.

Le graphique sera inséré à la position du curseur dans l'éditeur de contenu.

## Exemples d'utilisation

### Exemple 1: Fonction exponentielle avec tangentes

**Fonction**: `x^2 * exp(x/5)`  
**Tangentes**: `0, 1, -1`  
**Intervalle**: De -3 à 3

### Exemple 2: Comparaison de fonctions trigonométriques

**Fonction 1**: `sin(x)`  
**Fonction 2**: `cos(x)`  
**Intervalle**: De -6 à 6

### Exemple 3: Étude d'une fonction polynomiale

**Fonction**: `x^3 - 3*x^2 + 2*x`  
**Tangentes**: `-1, 0, 1, 2`  
**Intervalle**: De -2 à 4

## Conseils

1. **Testez vos fonctions**: Utilisez d'abord l'aperçu pour vérifier que vos fonctions sont correctes
2. **Ajustez l'intervalle**: Si votre graphique semble coupé, ajustez les valeurs min/max
3. **Utilisez des parenthèses**: Pour les expressions complexes, utilisez des parenthèses pour clarifier l'ordre des opérations
4. **Tangentes multiples**: Vous pouvez ajouter autant de tangentes que nécessaire

## Dépannage

### Le graphique ne s'affiche pas
- Vérifiez la syntaxe de votre fonction
- Assurez-vous que l'intervalle est valide (min < max)
- Vérifiez que votre fonction est définie sur l'intervalle choisi

### Les tangentes ne s'affichent pas
- Vérifiez que les points de tangence sont dans l'intervalle
- Assurez-vous que la fonction est dérivable aux points choisis

### Erreur de syntaxe
- Utilisez `^` pour les puissances, pas `**`
- Utilisez `*` pour la multiplication explicite (ex: `2*x`, pas `2x`)
- Vérifiez que toutes les parenthèses sont bien fermées

## Technologies utilisées

- **D3.js**: Bibliothèque de visualisation de données
- **function-plot**: Bibliothèque spécialisée pour le tracé de fonctions mathématiques
- **Bootstrap 5**: Pour l'interface utilisateur du modal

## Support

Pour toute question ou problème, consultez la documentation ou contactez l'équipe de développement.
