# Graph Generator - Documentation Technique

## Vue d'ensemble

Le générateur de graphiques est une fonctionnalité intégrée dans le formulaire "Create Solution" permettant de tracer des fonctions mathématiques avec leurs tangentes.

## Architecture

### Fichiers modifiés

- `views/create.ejs` - Formulaire principal avec le modal du générateur de graphiques

### Composants principaux

#### 1. Bouton d'ouverture
```html
<button type="button" class="btn btn-success btn-lg px-5 me-3" id="openGraphGeneratorBtn">
    <i class="fas fa-chart-line me-2"></i>
    Générer des Graphiques
</button>
```

#### 2. Modal Bootstrap
- Modal Bootstrap 5 de taille XL (`modal-xl`)
- Contient trois sections principales:
  - Saisie des fonctions
  - Configuration de l'intervalle
  - Aperçu du graphique

#### 3. Gestion dynamique des fonctions
- Ajout/suppression de fonctions multiples
- Chaque fonction a son propre champ de saisie et champ de tangentes
- Compteur de fonctions pour générer des IDs uniques

#### 4. Moteur de rendu
- Utilise **function-plot** (basé sur D3.js)
- Conversion automatique des expressions mathématiques
- Calcul numérique des dérivées pour les tangentes

## Bibliothèques externes

### D3.js v7
```html
<script src="https://d3js.org/d3.v7.min.js"></script>
```
Bibliothèque de visualisation de données utilisée par function-plot.

### function-plot v1.23.3
```html
<script src="https://unpkg.com/function-plot@1.23.3/dist/function-plot.js"></script>
```
Bibliothèque spécialisée pour le tracé de fonctions mathématiques.

## Fonctionnalités JavaScript

### 1. Conversion d'expressions mathématiques

```javascript
function convertExpression(expr) {
    // Convertit la syntaxe mathématique standard en syntaxe JavaScript
    // Exemples:
    // x^2 → pow(x, 2)
    // exp(x) → Math.exp(x)
    // sin(x) → Math.sin(x)
}
```

### 2. Évaluation de fonctions

```javascript
function evaluateFunction(expr, xValue) {
    // Évalue une fonction à un point donné
    // Utilise eval() avec précautions
}
```

### 3. Calcul de dérivées

```javascript
function derivative(expr, xValue, h = 0.0001) {
    // Calcul numérique de la dérivée par différences finies
    // f'(x) ≈ (f(x+h) - f(x-h)) / (2h)
}
```

### 4. Génération de tangentes

```javascript
function getTangentLine(expr, x0) {
    // Calcule l'équation de la tangente en un point
    // y = f'(x0) * (x - x0) + f(x0)
}
```

## Structure des données

### Configuration du graphique

```javascript
{
    target: '#graphContainer',
    width: 800,
    height: 500,
    xAxis: { domain: [xMin, xMax] },
    yAxis: { domain: [-10, 10] },
    grid: true,
    data: [
        {
            fn: 'Math.sin(x)',
            color: '#2563eb',
            graphType: 'polyline'
        },
        {
            fn: '2 * (x - 1) + 0.841',  // Tangente
            color: '#2563eb',
            graphType: 'polyline',
            attr: {
                'stroke-dasharray': '5,5',
                'stroke-width': 2
            }
        },
        {
            points: [[1, 0.841]],  // Point de tangence
            fnType: 'points',
            color: '#2563eb',
            graphType: 'scatter'
        }
    ]
}
```

## Palette de couleurs

Les fonctions utilisent une palette de 6 couleurs qui se répète:

1. `#2563eb` - Bleu
2. `#dc2626` - Rouge
3. `#16a34a` - Vert
4. `#9333ea` - Violet
5. `#ea580c` - Orange
6. `#0891b2` - Cyan

## Workflow utilisateur

1. **Ouverture du modal** → Clic sur "Générer des Graphiques"
2. **Saisie des fonctions** → Entrée des expressions mathématiques
3. **Configuration** → Définition de l'intervalle et des points de tangence
4. **Génération** → Clic sur "Générer l'aperçu"
5. **Validation** → Clic sur "Valider et insérer"
6. **Insertion** → Le HTML du graphique est inséré dans l'éditeur

## Format d'insertion

Le graphique est inséré sous forme de HTML avec un script inline:

```html
<div class="graph-container" style="margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">
    <h4>Graphique des fonctions</h4>
    <div id="graph-[timestamp]" style="width: 100%; height: 400px;"></div>
    <script>
        (function() {
            const data = [...];
            functionPlot({
                target: '#graph-[timestamp]',
                width: 800,
                height: 400,
                xAxis: { domain: [-6, 6] },
                yAxis: { domain: [-10, 10] },
                grid: true,
                data: data
            });
        })();
    </script>
</div>
```

## Gestion des erreurs

### Validation des entrées
- Vérification de l'intervalle (min < max)
- Vérification qu'au moins une fonction est saisie
- Gestion des erreurs d'évaluation de fonction

### Messages d'erreur
- "Veuillez entrer un intervalle valide (min < max)"
- "Veuillez entrer au moins une fonction"
- "Erreur lors du rendu du graphique. Vérifiez vos fonctions."

## Améliorations futures possibles

1. **Export d'images** - Permettre l'export du graphique en PNG/SVG
2. **Zoom et pan** - Ajouter des contrôles interactifs
3. **Légende automatique** - Afficher une légende avec les noms des fonctions
4. **Sauvegarde de presets** - Sauvegarder des configurations fréquentes
5. **Calcul symbolique** - Utiliser une bibliothèque comme math.js pour les dérivées symboliques
6. **Points d'intérêt** - Marquer automatiquement les extrema, points d'inflexion, etc.
7. **Asymptotes** - Détecter et afficher les asymptotes
8. **Intégration** - Ajouter la possibilité de calculer et afficher des intégrales

## Sécurité

⚠️ **Note importante**: Le code utilise `eval()` pour évaluer les expressions mathématiques. Bien que cela soit acceptable dans ce contexte (éditeur de contenu pour utilisateurs authentifiés), il faut être conscient des risques:

- Les expressions sont converties avant évaluation
- Seules les fonctions mathématiques standard sont supportées
- Le code s'exécute côté client uniquement

Pour une version production, considérer l'utilisation de bibliothèques comme **math.js** qui offrent une évaluation sécurisée des expressions.

## Tests recommandés

1. **Test de fonctions simples** - `x`, `x^2`, `x^3`
2. **Test de fonctions trigonométriques** - `sin(x)`, `cos(x)`, `tan(x)`
3. **Test de fonctions exponentielles** - `exp(x)`, `log(x)`
4. **Test de compositions** - `sin(x^2)`, `exp(sin(x))`
5. **Test de tangentes multiples** - Plusieurs points sur une même fonction
6. **Test de fonctions multiples** - 2-3 fonctions simultanées
7. **Test d'intervalles variés** - Négatifs, positifs, grands, petits
8. **Test de cas limites** - Divisions par zéro, logarithmes de négatifs, etc.

## Support navigateur

Compatible avec tous les navigateurs modernes supportant:
- ES6+ JavaScript
- SVG
- Bootstrap 5
- D3.js v7

Testé sur:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Maintenance

### Mise à jour des bibliothèques

Pour mettre à jour function-plot:
```html
<script src="https://unpkg.com/function-plot@[VERSION]/dist/function-plot.js"></script>
```

Pour mettre à jour D3.js:
```html
<script src="https://d3js.org/d3.v[VERSION].min.js"></script>
```

### Debugging

Activer les logs de console pour voir:
- Erreurs d'évaluation de fonction
- Erreurs de rendu
- Données du graphique

## Contribution

Pour contribuer à cette fonctionnalité:

1. Créer une branche feature
2. Modifier `views/create.ejs`
3. Tester avec différentes fonctions
4. Mettre à jour cette documentation
5. Créer une pull request

## Licence

Ce code fait partie du projet clean-blog et suit la même licence.
