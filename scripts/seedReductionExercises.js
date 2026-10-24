require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');
const Category = require('../models/Category');
const User = require('../models/User');

const exercises = [
    {
        title: 'Exercice RED 1',
        body: `Diagonaliser les matrices suivantes :
$$A = \\begin{pmatrix} 1 & 0 & 1 \\\\ 0 & 2 & 0 \\\\ 2 & 0 & 0 \\end{pmatrix} \\quad B = \\begin{pmatrix} 1 & 2 & 2 \\\\ 2 & 1 & 2 \\\\ 2 & 2 & 1 \\end{pmatrix} \\quad C = \\begin{pmatrix} 1 & 0 & 1 \\\\ 4 & -3 & 4 \\\\ 2 & -2 & 3 \\end{pmatrix}$$`
    },
    {
        title: 'Exercice RED 2',
        body: `On pose $A = \\begin{pmatrix} 0 & 1 & 0 \\\\ 1 & 0 & 1 \\\\ 0 & 1 & 0 \\end{pmatrix}$. Déterminer son polynôme caractéristique, montrer que $A$ est diagonalisable, calculer $A^k$ pour $k \\in \\mathbb{N}$ et évaluer $\\exp(A)$.`
    },
    {
        title: 'Exercice RED 3',
        body: `Soit $A = \\begin{pmatrix} 1 & j & j^2 \\\\ j & j^2 & 1 \\\\ j^2 & 1 & j \\end{pmatrix}$. Étudier la diagonalisabilité de $A$, déterminer son polynôme caractéristique, calculer $\\exp(A)$. Proposer une généralisation en dimension $n$.`
    },
    {
        title: 'Exercice RED 4',
        body: `Soit $A = \\begin{pmatrix} 2 & -1 & -1 \\\\ 2 & 1 & -2 \\\\ 3 & -1 & -2 \\end{pmatrix}$
<ol type="a">
    <li>Calculer le polynôme caractéristique de $A$.</li>
    <li>Trigonaliser la matrice $A$.</li>
</ol>`
    },
    {
        title: 'Exercice RED 5',
        body: `Soit $A = \\begin{pmatrix} 0 & 1 & 1 \\\\ -1 & 1 & 1 \\\\ -1 & 1 & 2 \\end{pmatrix}$
<ol type="a">
    <li>Calculer le polynôme caractéristique de $A$.</li>
    <li>Trigonaliser la matrice $A$.</li>
</ol>`
    },
    {
        title: 'Exercice RED 6',
        body: `Valeurs propres de la matrice de $\\mathcal{M}_n(\\mathbb{R})$
$$ \\begin{pmatrix} 1 & 1 & \\cdots & 1 \\\\ 1 & 1 & & (0) \\\\ \\vdots & & \\ddots & \\\\ 1 & (0) & & 1 \\end{pmatrix} $$`
    },
    {
        title: 'Exercice RED 7',
        body: `Diagonaliser la matrice de taille $n$ : $A = (a_{ij})$ avec $\\begin{cases} a_{ij} = 1 \\text{ si } |i - j| = 1 \\\\ a_{ij} = 0 \\text{ sinon} \\end{cases}$`
    },
    {
        title: 'Exercice RED 8',
        body: `Déterminer les valeurs propres et les sous-espaces propres de la matrice de taille $n$ :
$$ A = \\begin{pmatrix} J & (0) \\\\ (0) & (0) \\end{pmatrix} $$
avec $J \\in \\mathcal{M}_{p,q}(\\mathbb{R})$ la matrice dont tous les termes valent 1.
$A$ est-elle diagonalisable ?`
    },
    {
        title: 'Exercice RED 9',
        body: `Soit $\\Phi : \\begin{cases} \\mathbb{R}[X] \\longrightarrow \\mathbb{R}[X] \\\\ P \\longmapsto (1 - X^2)P' + nXP \\end{cases}$
<ol type="a">
    <li>Montrer que $\\mathbb{R}_n[X]$ est stable par $\\Phi$. (On note $\\Phi_n$ l'endomorphisme induit.)</li>
    <li>Déterminer les valeurs propres et les sous-espaces propres de $\\Phi_n$.</li>
    <li>$\\Phi_n$ est-il diagonalisable ? et $\\Phi$ ?</li>
</ol>`
    },
    {
        title: 'Exercice RED 10',
        body: `On note $E = \\mathcal{C}([0, 1], \\mathbb{R})$ et on définit l'application $T$ de $E$ dans $E$ par :
$$ \\forall f \\in E \\begin{cases} T(f)(0) = f(0) \\\\ \\forall x \\in ]0, 1] \\quad T(f)(x) = \\frac{1}{x} \\int_0^x f(t)\\,dt \\end{cases} $$
<ol type="a">
    <li>Justifier que $T$ est un endomorphisme de $E$.</li>
    <li>Étudier les valeurs propres et les sous-espaces propres de $T$.</li>
</ol>`
    },
    {
        title: 'Exercice RED 11',
        body: `$AB$ et $BA$ ont même polynôme caractéristique<br>
Soient $A, B \\in \\mathcal{M}_n(\\mathbb{K})$.
<ol type="a">
    <li>Montrer que $AB$ et $BA$ ont les mêmes valeurs propres.</li>
    <li>Montrer que si $A$ ou $B$ est inversible, alors $AB$ et $BA$ ont même polynôme caractéristique.</li>
    <li>Dans le cas général, on note $M = \\begin{pmatrix} BA & -B \\\\ 0 & 0 \\end{pmatrix}$, $N = \\begin{pmatrix} 0 & -B \\\\ 0 & AB \\end{pmatrix}$, $P = \\begin{pmatrix} I_n & 0 \\\\ A & I_n \\end{pmatrix}$ ($M, N, P \\in \\mathcal{M}_{2n}(\\mathbb{K})$).<br>
    Vérifier que $MP = PN$, montrer que $P$ est inversible, et conclure.</li>
</ol>`
    },
    {
        title: 'Exercice RED 12',
        body: `Soit $f$ un endomorphisme d'un $\\mathbb{C}$-espace vectoriel $E$ de dimension $n$. On suppose que $f$ possède une unique valeur propre $\\lambda$.
<ol type="a">
    <li>A quelle condition l'endomorphisme est-il diagonalisable ?</li>
    <li>Calculer le polynôme caractéristique de $f$.</li>
    <li>Justifier que l'endomorphisme $f - \\lambda\\mathrm{Id}$ est nilpotent.</li>
</ol>`
    },
    {
        title: 'Exercice RED 13',
        body: `Soit $f$ un endomorphisme d'un $\\mathbb{K}$-espace vectoriel de dimension $n$.
On suppose qu'il existe $x_0 \\in E$ et $p \\in \\mathbb{N}$ tels que $(x_0, f(x_0), \\dots, f^{p-1}(x_0))$ soit une famille génératrice de $E$.
<ol type="a">
    <li>Montrer que la famille $(x_0, f(x_0), \\dots, f^{n-1}(x_0))$ est une base de $E$.</li>
    <li>Préciser la forme de la matrice de $f$ dans cette base. Calculer alors son polynôme caractéristique.</li>
</ol>`
    },
    {
        title: 'Exercice RED 14',
        body: `Soit $f$ et $g$ deux endomorphismes diagonalisables qui commutent, montrer qu'il existe une base commune de diagonalisation (on dit que $f$ et $g$ sont simultanément diagonalisables).`
    },
    {
        title: 'Exercice RED 15',
        body: `Montrer que pour tout $A \\in \\mathcal{M}_n(\\mathbb{C})$, $\\det(\\exp(A)) = \\exp(\\mathrm{tr}(A))$.
(indication : utiliser la trigonalisation)`
    },
    {
        title: 'Exercice RED 16',
        body: `Déterminer les valeurs propres de la matrice
$$ \\begin{pmatrix} 0 & \\cdots & 0 & 1 \\\\ \\vdots & & \\vdots & \\vdots \\\\ 0 & \\cdots & 0 & 1 \\\\ 1 & \\cdots & 1 & 1 \\end{pmatrix} \\in \\mathcal{M}_n(\\mathbb{R}) $$`
    },
    {
        title: 'Exercice RED 17',
        body: `Soient $n \\ge 3$ et
$$ A = \\begin{pmatrix} 0 & & (0) & 1 \\\\ 1 & \\ddots & & \\vdots \\\\ \\vdots & & \\ddots & 1 \\\\ 1 & (0) & & 0 \\end{pmatrix} \\in \\mathcal{M}_n(\\mathbb{R}) $$
<ol type="a">
    <li>Soit $f$ l'endomorphisme de $\\mathbb{R}^n$ canoniquement représenté par la matrice $A$.
    Montrer que $\\ker f \\oplus \\mathrm{Im} f = \\mathbb{R}^n$, en déduire que la matrice $A$ est semblable à une matrice de la forme
    $$ \\begin{pmatrix} 0 & & & (0) \\\\ & \\ddots & & \\\\ & & 0 & \\\\ (0) & & & B \\end{pmatrix} $$
    avec $B \\in \\mathrm{GL}_2(\\mathbb{R})$.</li>
    <li>Calculer $\\mathrm{tr}(B)$ et $\\mathrm{tr}(B^2)$.
    En déduire les valeurs propres de $B$ puis celles de $A$.</li>
    <li>La matrice $A$ est-elle diagonalisable ?</li>
</ol>`
    },
    {
        title: 'Exercice RED 18',
        body: `Soit $f$ et $g$ deux endomorphismes diagonalisables qui commutent, montrer qu'il existe une base commune de diagonalisation (on dit que $f$ et $g$ sont simultanément diagonalisables.)`
    },
    {
        title: 'Exercice RED 19',
        body: `Soit $f$ un endomorphisme d'un $\\mathbb{C}$-espace vectoriel $E$ de dimension $n$. On suppose que $f$ possède une unique valeur propre $\\lambda$.
<ol type="a">
    <li>A quelle condition l'endomorphisme est-il diagonalisable ?</li>
    <li>Calculer le polynôme caractéristique de $f$.</li>
    <li>Justifier que l'endomorphisme $f - \\lambda\\mathrm{Id}$ est nilpotent.</li>
</ol>`
    }
];

async function seedExercises() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Check if "Prépas" parent exists, if not create it just in case
        let prepasParent = await Category.findOne({ name: 'Prépas' });
        if (!prepasParent) {
            prepasParent = await Category.create({ name: 'Prépas' });
            console.log('✅ Created parent category: Prépas');
        }

        let category = await Category.findOne({ name: 'Réduction des endomorphismes' });
        if (!category) {
            // Check if the user's specific case "réduction des endomorphisme" exists
            category = await Category.findOne({ name: /r[eé]duction des endomorphismes?/i });
            if (!category) {
                category = await Category.create({ 
                    name: 'Réduction des endomorphismes',
                    parent: prepasParent._id 
                });
                console.log('✅ Created category: Réduction des endomorphismes');
            }
        }
        
        // Ensure parent is correctly set
        if (!category.parent || category.parent.toString() !== prepasParent._id.toString()) {
            category.parent = prepasParent._id;
            await category.save();
        }

        const user = await User.findOne({ username: 'nakhal69' });
        if (!user) {
            console.error('❌ User "nakhal69" not found');
            process.exit(1);
        }

        console.log(`✅ Found category: ${category.name}`);
        console.log(`✅ Found user: ${user.username}`);

        for (const exercise of exercises) {
            const existing = await BlogPost.findOne({ title: exercise.title });
            if (existing) {
                console.log(`⚠️  "${exercise.title}" already exists. Updating...`);
                existing.body = exercise.body;
                existing.category = category._id;
                existing.author = user._id;
                existing.type = 'exercise';
                await existing.save();
                console.log(`🔄 Updated: "${exercise.title}"`);
            } else {
                await BlogPost.create({
                    title: exercise.title,
                    body: exercise.body,
                    author: user._id,
                    category: category._id,
                    type: 'exercise',
                    isDeleted: false
                });
                console.log(`✅ Created: "${exercise.title}"`);
            }
        }

        console.log('🎉 All exercises processed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

seedExercises();
