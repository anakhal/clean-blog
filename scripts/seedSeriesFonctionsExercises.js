require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');
const Category = require('../models/Category');
const User = require('../models/User');

const exercises = [
    {
        title: 'Exercice SER 1',
        body: `Soit $\\alpha \\in \\mathbb{R}$. On pose, pour tout $n \\in \\mathbb{N}^*$ et $x \\in [0, 1]$ :
$$u_n(x) = n^\\alpha \\, x^n(1 - x)$$
<ol>
    <li>Déterminer les valeurs de $\\alpha$ pour lesquelles la série de fonctions $\\displaystyle\\sum u_n$ converge simplement sur $[0, 1]$.</li>
    <li>Déterminer les valeurs de $\\alpha$ pour lesquelles la série de fonctions $\\displaystyle\\sum u_n$ converge normalement sur $[0, 1]$.</li>
</ol>`
    },
    {
        title: 'Exercice SER 2',
        body: `On pose, pour tout $n \\in \\mathbb{N}$ et $x \\in \\mathbb{R}$ :
$$f_n(x) = nx^2 e^{-x\\sqrt{n}}$$
<ol>
    <li>Étudier la convergence simple de la série de fonctions $\\displaystyle\\sum f_n$.</li>
    <li>Étudier la convergence uniforme de la suite de fonctions $(f_n)$ et de la série de fonctions $\\displaystyle\\sum f_n$ sur $\\mathbb{R}^+$.</li>
</ol>`
    },
    {
        title: 'Exercice SER 3',
        body: `On pose, pour tout $n \\in \\mathbb{N}^*$ et $x \\in \\mathbb{R}^+$ :
$$u_n(x) = (-1)^n \\ln\\!\\left(1 + \\frac{x}{n(1+x)}\\right)$$
<ol>
    <li>Prouver que la série de fonctions $\\displaystyle\\sum_{n \\ge 1} u_n$ converge simplement sur $\\mathbb{R}^+$.</li>
    <li>Prouver que la série de fonctions $\\displaystyle\\sum_{n \\ge 1} u_n$ converge uniformément sur $\\mathbb{R}^+$.</li>
    <li>Prouver que la série de fonctions $\\displaystyle\\sum_{n \\ge 1} u_n$ ne converge pas normalement sur $\\mathbb{R}^+$.</li>
</ol>`
    },
    {
        title: 'Exercice SER 4',
        body: `<ol>
    <li>Soit $x \\in \\mathbb{R}^+$. Justifier l'existence de :
    $$f(x) = \\sum_{n=1}^{+\\infty} \\left(\\frac{1}{n} - \\frac{1}{x+n}\\right)$$</li>
    <li>Montrer que $f$ est continue sur $\\mathbb{R}^+$.</li>
    <li>Soit $x \\in \\mathbb{R}^+$. Simplifier $f(x+1) - f(x)$.</li>
</ol>`
    },
    {
        title: 'Exercice SER 5',
        body: `Soit $(\\lambda_n)_{n \\in \\mathbb{N}}$ une suite croissante de réels strictement positifs telle que $\\displaystyle\\lim_{n \\to +\\infty} \\lambda_n = +\\infty$.
<br>On pose :
$$f(x) = \\sum_{n=0}^{+\\infty} (-1)^n e^{-\\lambda_n x}, \\quad x \\in \\mathbb{R}$$
<ol>
    <li>Déterminer le domaine de définition de $f$.</li>
    <li>Prouver que $f$ est continue sur $]0, +\\infty[$.</li>
</ol>`
    },
    {
        title: 'Exercice SER 6',
        body: `Soit $u_n(x) = \\dfrac{x}{n(1+nx^2)}$, $n \\in \\mathbb{N}^*$, $x \\in \\mathbb{R}$.
<ol>
    <li>
        <ol type="a">
            <li>Prouver que la série de fonctions $\\displaystyle\\sum u_n$ converge normalement sur $\\mathbb{R}$. On note $f$ sa somme.</li>
            <li>Vérifier que $f$ est impaire et continue sur $\\mathbb{R}$.</li>
        </ol>
    </li>
    <li>Montrer que $f$ est de classe $\\mathcal{C}^1$ sur $]-\\infty, 0[$ et sur $]0, +\\infty[$.</li>
    <li>
        <ol type="a">
            <li>Soit $N \\in \\mathbb{N}^*$. Vérifier que $\\forall x > 0$ :
            $$\\frac{f(x) - f(0)}{x} \\geq \\sum_{n=1}^{N} \\frac{1}{n(1+nx^2)}$$</li>
            <li>En déduire, en raisonnant par l'absurde, que $f$ n'est pas dérivable à droite en $0$.</li>
        </ol>
    </li>
</ol>`
    },
    {
        title: 'Exercice SER 7',
        body: `On considère, pour $x \\in \\mathbb{R}^+$ et $n \\in \\mathbb{N}^*$ :
$$u_n(x) = \\frac{(-1)^n}{x+n}$$
<ol>
    <li>Prouver que la série de fonctions $\\displaystyle\\sum u_n$ converge simplement sur $\\mathbb{R}^+$. On pose :
    $$f(x) = \\sum_{n=1}^{+\\infty} \\frac{(-1)^n}{x+n}, \\quad x \\in \\mathbb{R}^+$$</li>
    <li>Prouver que $f$ est continue sur $\\mathbb{R}^+$.</li>
    <li>Montrer que $f$ est de classe $\\mathcal{C}^1$ sur $\\mathbb{R}^+$ et préciser $f'$.</li>
</ol>`
    },
    {
        title: 'Exercice SER 8',
        body: `<ol>
    <li>Justifier que l'on définit une application $f$ continue sur $[0, +\\infty[$ en posant :
    $$\\forall x \\in \\mathbb{R}^+, \\quad f(x) = \\sum_{n=0}^{+\\infty} \\frac{e^{-nx}}{n^2+1}$$</li>
    <li>Calculer $\\displaystyle\\lim_{x \\to +\\infty} f(x)$.</li>
    <li>Montrer que $f$ est de classe $\\mathcal{C}^1$ sur $]0, +\\infty[$.</li>
    <li>Montrer que $f$ est de classe $\\mathcal{C}^2$ sur $]0, +\\infty[$ et calculer $f''(x) + f(x)$ pour tout $x > 0$.</li>
</ol>`
    },
    {
        title: 'Exercice SER 9',
        body: `On rappelle que pour tout $t \\in \\mathbb{R}$ : $e^t = \\displaystyle\\sum_{n=0}^{+\\infty} \\dfrac{t^n}{n!}$.
<br>Pour tout $x > 0$, on pose :
$$S(x) = \\sum_{n=0}^{+\\infty} \\frac{(-1)^n}{n!(x+n)}$$
<ol>
    <li>Prouver que $S(x)$ existe et que la fonction $S$ est de classe $\\mathcal{C}^1$ sur $]0, +\\infty[$.</li>
    <li>Prouver que $\\forall x > 0$, $S(x+1) = xS(x) - e^{-1}$.</li>
    <li>Prouver que $S(x) \\underset{x \\to 0^+}{\\sim} \\dfrac{1}{x}$ et $S(x) \\underset{x \\to +\\infty}{\\sim} \\dfrac{e^{-1}}{x}$.</li>
</ol>`
    },
    {
        title: 'Exercice SER 10',
        body: `<ol>
    <li>Justifier que l'on définit une application $f$ sur $\\mathbb{R}$ en posant :
    $$\\forall x \\in \\mathbb{R}, \\quad f(x) = \\sum_{n=0}^{+\\infty} \\frac{x^2}{e^{2nx} + e^{-3nx}}$$</li>
    <li>Prouver que $f$ est continue sur $]0, +\\infty[$ et sur $]-\\infty, 0[$.</li>
    <li>Prouver que $f$ est continue en $0$.</li>
</ol>`
    },
    {
        title: 'Exercice SER 11',
        body: `<ol>
    <li>Justifier que l'on définit une application $f$ continue sur $]0, +\\infty[$ en posant :
    $$\\forall x > 0, \\quad f(x) = \\sum_{n=0}^{+\\infty} e^{-x\\sqrt{n}}$$</li>
    <li>À l'aide d'une comparaison série-intégrale, montrer que :
    $$f(x) \\underset{x \\to 0^+}{\\sim} \\frac{2}{x^2}$$</li>
</ol>`
    },
    {
        title: 'Exercice SER 12',
        body: `<ol>
    <li>Vérifier que $\\forall x \\in \\mathbb{R}$ :
    $$\\frac{1}{1 - 2e^{ix}} = -\\sum_{p=1}^{+\\infty} \\frac{e^{-ipx}}{2^p}$$</li>
    <li>Soit $n \\in \\mathbb{Z}$. Calculer $I_n = \\displaystyle\\int_0^{2\\pi} \\frac{e^{inx}}{1 - 2e^{ix}}\\,dx$.</li>
    <li>Soient $z \\in \\mathbb{C}^*$ et $r \\in ]0, |z|[$. Calculer $\\displaystyle\\int_0^{2\\pi} \\frac{dx}{z - re^{ix}}$ en faisant apparaître la somme d'une série géométrique convergente.</li>
</ol>`
    },
    {
        title: 'Exercice SER 13',
        body: `Pour tout $x \\in \\mathbb{R}$, on pose :
$$f(x) = \\sum_{n=1}^{+\\infty} \\frac{2x}{x^2 + n^2}$$
<ol>
    <li>Montrer que $f$ est définie et continue sur $\\mathbb{R}$.</li>
    <li>Soit $x > 0$. Pour tout $t \\in \\mathbb{R}^+$, on pose $f_x(t) = \\dfrac{2x}{x^2 + t^2}$.
        <ol type="a">
            <li>Vérifier que pour tout $n \\in \\mathbb{N}^*$ :
            $$\\int_n^{n+1} f_x(t)\\,dt \\leq \\frac{2x}{x^2+n^2} \\leq \\int_{n-1}^{n} f_x(t)\\,dt$$</li>
            <li>En déduire un encadrement de $f(x)$ et déterminer $\\displaystyle\\lim_{x \\to +\\infty} f(x)$.</li>
        </ol>
    </li>
</ol>`
    },
    {
        title: 'Exercice SER 14',
        body: `Soit $f(x) = \\displaystyle\\sum_{n=2}^{+\\infty} \\frac{x\\,e^{-nx}}{\\ln n}$, $x \\in \\mathbb{R}$.
<ol>
    <li>Déterminer le domaine de définition de $f$.</li>
    <li>Prouver que $f$ est continue sur $\\mathbb{R}^+$.</li>
    <li>Prouver que $f$ est de classe $\\mathcal{C}^1$ sur $\\mathbb{R}^{+*}$.</li>
    <li>Montrer que $f$ n'est pas dérivable en $0$.</li>
</ol>`
    },
    {
        title: 'Exercice SER 15',
        body: `On pose, pour tout $x \\in \\mathbb{R}$ :
$$f(x) = \\sum_{n=0}^{+\\infty} \\frac{\\sin(2^n x)}{2^n}$$
<ol>
    <li>Prouver que $f$ est continue sur $\\mathbb{R}$.</li>
    <li>Calculer $\\displaystyle\\int_0^{\\pi} f(x)\\,dx$.</li>
    <li>
        <ol type="a">
            <li>Soit $x \\in \\mathbb{R}$. Déterminer une égalité simple reliant $f(2x)$, $f(x)$ et $\\sin x$.</li>
            <li>Déduire de 3.a, en raisonnant par l'absurde, que $f$ n'est pas dérivable en $0$.</li>
        </ol>
    </li>
</ol>`
    },
    {
        title: 'Exercice SER 16',
        body: `On note, pour tout $x \\in \\mathbb{R}^+$ :
$$f(x) = \\sum_{n=1}^{+\\infty} \\ln\\!\\left(1 + \\frac{x}{n^2}\\right)$$
<ol>
    <li>Vérifier que $f$ est bien définie sur $\\mathbb{R}^+$.</li>
    <li>Prouver que $f$ est continue sur $\\mathbb{R}^+$.</li>
    <li>Prouver que $f$ est de classe $\\mathcal{C}^1$ sur $\\mathbb{R}^+$.</li>
</ol>`
    },
    {
        title: 'Exercice SER 17',
        body: `Soit $f(x) = \\displaystyle\\sum_{n=1}^{+\\infty} \\frac{1}{n}\\arctan\\!\\left(\\frac{x}{n}\\right)$, $x \\in \\mathbb{R}$.
<ol>
    <li>Déterminer l'ensemble de définition de $f$.</li>
    <li>Montrer que $f$ est de classe $\\mathcal{C}^1$ sur son ensemble de définition.</li>
</ol>`
    },
    {
        title: 'Exercice SER 18',
        body: `Soit $f(x) = \\displaystyle\\sum_{n=1}^{+\\infty} \\frac{1}{1 + n^2 x^2}$, $x \\in \\mathbb{R}$.
<ol>
    <li>Déterminer le domaine de définition de $f$.</li>
    <li>Montrer que $f$ est continue sur $]-\\infty, 0[$ et sur $]0, +\\infty[$.</li>
</ol>`
    },
    {
        title: 'Exercice SER 19',
        body: `Soit $a \\in ]0, 1[$. Soit $f(x) = \\displaystyle\\sum_{n=0}^{+\\infty} \\sin(a^n x)$, $x \\in \\mathbb{R}$.
<ol>
    <li>Vérifier que $D_f = \\mathbb{R}$ et que $f$ est impaire.</li>
    <li>Prouver que $f$ est continue sur $\\mathbb{R}$.</li>
    <li>Prouver que $f$ est lipschitzienne sur $\\mathbb{R}$.</li>
    <li>Prouver que $f$ est de classe $\\mathcal{C}^1$ sur $\\mathbb{R}$ et préciser $f'(0)$.</li>
    <li>Prouver que $f$ est de classe $\\mathcal{C}^\\infty$ sur $\\mathbb{R}$.</li>
</ol>`
    },
    {
        title: 'Exercice SER 20',
        body: `<ol>
    <li>
        <ol type="a">
            <li>Soit $x \\in ]-1, 1[$. Montrer que la série $\\displaystyle\\sum_{n \\ge 1} \\dfrac{x^n}{n}$ converge. On pose :
            $$S(x) = \\sum_{n=1}^{+\\infty} \\frac{x^n}{n}$$</li>
            <li>Prouver, en utilisant le théorème de dérivation terme à terme, que $S$ est de classe $\\mathcal{C}^1$ sur $]-1, 1[$ et préciser $S'(x)$.</li>
            <li>En déduire que $\\forall x \\in ]-1, 1[$, $S(x) = -\\ln(1-x)$.</li>
        </ol>
    </li>
</ol>
<p>Soit $x \\in ]-1, 1[$. On pose $f_x(\\theta) = \\displaystyle\\sum_{n=1}^{+\\infty} \\dfrac{x^n \\cos(n\\theta)}{n}$, $\\theta \\in \\mathbb{R}$.</p>
<ol start="2">
    <li>Montrer que $f_x$ est définie et continue sur $\\mathbb{R}$.</li>
    <li>Justifier que $f_x$ est de classe $\\mathcal{C}^1$ sur $\\mathbb{R}$ et calculer $f_x'(\\theta)$.</li>
    <li>Déduire de ce qui précède que $\\forall \\theta \\in \\mathbb{R}$ :
    $$f_x(\\theta) = -\\frac{1}{2}\\ln(1 + x^2 - 2x\\cos\\theta)$$</li>
    <li>Déduire de ce qui précède la valeur de $\\displaystyle\\int_0^{\\pi} \\ln(1 + x^2 - 2x\\cos\\theta)\\,d\\theta$.</li>
</ol>`
    },
];

async function seedExercises() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        const category = await Category.findOne({ name: 'Suites et séries numériques' });
        if (!category) {
            console.error('❌ Category "Suites et séries numériques" not found');
            process.exit(1);
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
