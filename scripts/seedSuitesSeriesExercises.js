require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');
const Category = require('../models/Category');
const User = require('../models/User');

const exercises = [
    {
        title: 'Exercice SSN 1',
        body: `Soit $(a, b, c) \\in \\mathbb{R}^3$ tel que $b^2 - 4ac < 0$. Soient $(u_n)_{n \\in \\mathbb{N}}$ et $(v_n)_{n \\in \\mathbb{N}}$ deux suites réelles telles que :
$$\\lim_{n \\to +\\infty} \\left( au_n^2 + bu_n v_n + cv_n^2 \\right) = 0$$
<p>Prouver que $\\displaystyle\\lim_{n \\to +\\infty} u_n = 0$ et $\\displaystyle\\lim_{n \\to +\\infty} v_n = 0$.</p>`
    },
    {
        title: 'Exercice SSN 2',
        body: `Justifier que $\\forall x \\in \\mathbb{R}^+$ :
$$x - \\frac{x^2}{2} \\leq \\ln(1+x) \\leq x$$
<p>En déduire :</p>
$$\\lim_{n \\to +\\infty} \\prod_{k=1}^{n} \\left(1 + \\frac{k}{n^2}\\right)$$`
    },
    {
        title: 'Exercice SSN 3',
        body: `Calculer la limite des suites de terme général :
<ol>
    <li>$a_n = n\\left(\\sqrt[n]{3} - 1\\right)$</li>
    <li>$b_n = \\left(\\dfrac{3^n + 7^n}{2}\\right)^{\\!\\frac{1}{n}}$</li>
    <li>$c_n = \\dfrac{\\lfloor n\\sqrt{2} \\rfloor}{n}$</li>
    <li>$d_n = \\displaystyle\\sum_{k=1}^{n} \\dfrac{n}{n^2 + k}$</li>
    <li>$e_n = n^2\\left(e^{\\frac{1}{n}} - e^{\\frac{1}{n+1}}\\right)$</li>
</ol>`
    },
    {
        title: 'Exercice SSN 4',
        body: `Déterminer un équivalent simple, quand $n$ tend vers $+\\infty$, de :
<ol>
    <li>$a_n = \\sqrt{n+1} - \\sqrt{n-1}$</li>
    <li>$b_n = \\sqrt[3]{n+1} - \\sqrt[3]{n}$</li>
    <li>$c_n = \\sqrt[n]{n} - 1$</li>
    <li>$d_n = n^2\\left(\\cos\\dfrac{\\pi}{\\sqrt{n}} - 1\\right)\\left(\\ln(1+n^2) - n^2\\right)$</li>
    <li>$e_n = \\left(\\ln\\left(1 + e^{-n^2}\\right)\\right)^{\\!\\frac{1}{n}}$</li>
    <li>$f_n = \\arctan\\left(\\sqrt{3} + n^2\\right) - \\dfrac{\\pi}{3}$</li>
    <li>$g_n = 3^{-\\frac{n+3}{n}}$</li>
</ol>`
    },
    {
        title: 'Exercice SSN 5',
        body: `<strong>[Le nombre $e$]</strong> On pose, pour tout $n \\in \\mathbb{N}^*$ :
$$u_n = \\sum_{k=0}^{n} \\frac{1}{k!} \\qquad \\text{et} \\qquad v_n = \\sum_{k=0}^{n} \\frac{1}{k!} + \\frac{1}{n \\cdot n!}$$
<ol>
    <li>Montrer que ces deux suites sont adjacentes. On note $\\ell$ leur limite commune.</li>
    <li>Soit $q \\in \\mathbb{N}^*$. Vérifier que $0 < q!(\\ell - u_q) < \\dfrac{1}{q}$. En déduire que $\\ell$ est irrationnel.</li>
    <li>Soit $n \\in \\mathbb{N}^*$. Vérifier en utilisant la formule de Taylor avec reste intégral que :
    $$e = u_n + \\int_0^1 \\frac{(1-t)^n}{n!}\\,e^t\\,dt$$
    En déduire que $\\ell = e$.</li>
</ol>`
    },
    {
        title: 'Exercice SSN 6',
        body: `Soit $(u_n)_{n \\in \\mathbb{N}^*}$ une suite croissante telle que :
$$\\forall n \\in \\mathbb{N}^*, \\quad u_{2n} - u_n \\leq \\frac{1}{n}$$
<p>Prouver que la suite $(u_{2^n})_{n \\in \\mathbb{N}}$ converge. En déduire que la suite $(u_n)_{n \\in \\mathbb{N}^*}$ converge.</p>`
    },
    {
        title: 'Exercice SSN 7',
        body: `<strong>[Constante d'Euler]</strong>
<ol>
    <li>Justifier que $\\forall x > 0$ :
    $$\\frac{1}{1+x} \\leq \\ln(1+x) - \\ln(x) \\leq \\frac{1}{x}$$</li>
    <li>On pose, pour tout $n \\in \\mathbb{N}^*$ :
    $$u_n = \\sum_{k=1}^{n} \\frac{1}{k} - \\ln(n) \\qquad \\text{et} \\qquad v_n = \\sum_{k=1}^{n} \\frac{1}{k} - \\ln(n+1)$$
    Prouver que les deux suites $(u_n)$ et $(v_n)$ convergent vers une même limite.
    <br><em>Remarque</em> : la limite de la suite $(u_n)$, notée $\\gamma$, est la «constante d'Euler». En posant $\\varepsilon_n = u_n - \\gamma$, on a donc :
    $$\\sum_{k=1}^{n} \\frac{1}{k} = \\gamma + \\ln(n) + \\varepsilon_n \\quad \\text{avec} \\quad \\lim_{n \\to +\\infty} \\varepsilon_n = 0$$</li>
    <li>Applications.
        <ol type="a">
            <li>Déterminer un équivalent simple quand $n$ tend vers $+\\infty$ de $\\displaystyle\\sum_{k=1}^{n} \\dfrac{1}{\\sqrt{k}}$.</li>
            <li>Calculer $\\displaystyle\\lim_{n \\to +\\infty} \\sum_{k=1}^{n} \\frac{1}{n+k}$. Retrouver cette valeur en utilisant le cours sur les sommes de Riemann.</li>
            <li>Calculer $\\displaystyle\\lim_{n \\to +\\infty} \\sum_{k=n+1}^{3n} \\frac{1}{k}$.</li>
        </ol>
    </li>
</ol>`
    },
    {
        title: 'Exercice SSN 8',
        body: `Soient $(u_n)_{n \\in \\mathbb{N}}$ et $(v_n)_{n \\in \\mathbb{N}}$ les suites réelles définies par $(u_0, v_0) \\in ]0, +\\infty[^2$ et pour tout $n \\in \\mathbb{N}$ :
$$u_{n+1} = \\frac{u_n + v_n}{2}, \\qquad v_{n+1} = \\frac{2u_n v_n}{u_n + v_n}$$
<p>Montrer que $(u_n)_{n \\in \\mathbb{N}}$ et $(v_n)_{n \\in \\mathbb{N}}$ convergent vers une même limite que l'on déterminera.</p>`
    },
    {
        title: 'Exercice SSN 9',
        body: `Soient $a > 0$ et $S_n = \\displaystyle\\sum_{k=0}^{n} \\frac{(-1)^k}{a^k + 1}$, $n \\in \\mathbb{N}$.
<ol>
    <li>Prouver que la suite $(S_n)$ converge. <em>Considérer les deux suites $(S_{2n})$ et $(S_{2n+1})$.</em></li>
    <li>Calculer $\\displaystyle\\lim_{n \\to +\\infty} S_n$. On transformera $S_n$ en remarquant que :
    $$\\frac{1}{a^k + 1} = \\int_0^1 x^{a^k}\\,dx$$</li>
</ol>`
    },
    {
        title: 'Exercice SSN 10',
        body: `Soit $(u_n)_{n \\in \\mathbb{N}}$ une suite convergente, à valeurs dans $\\mathbb{Z}$.
<p>Montrer qu'il existe $N \\in \\mathbb{N}$ tel que $\\forall n \\geq N$, $|u_{n+1} - u_n| \\leq \\dfrac{1}{2}$, et en déduire que $(u_n)_{n \\in \\mathbb{N}}$ est une suite stationnaire.</p>`
    },
    {
        title: 'Exercice SSN 11',
        body: `Soit $(u_n)_{n \\in \\mathbb{N}}$ une suite réelle telle que les suites $(u_{2n})$, $(u_{2n+1})$ et $(u_{7n})$ convergent respectivement vers $\\ell_1$, $\\ell_2$, $\\ell_3$.
<ol>
    <li>En considérant la suite $(u_{14n})$, montrer que $\\ell_1 = \\ell_3$.</li>
    <li>Prouver que $\\ell_2 = \\ell_3$. En déduire que la suite $(u_n)_{n \\in \\mathbb{N}}$ converge.</li>
</ol>`
    },
    {
        title: 'Exercice SSN 12',
        body: `Soit $(u_n)_{n \\in \\mathbb{N}}$ une suite réelle ou complexe telle que les suites $(u_{2n})$, $(u_{2n+1})$ et $(u_{n^2})$ convergent.
<p>Prouver que la suite $(u_n)_{n \\in \\mathbb{N}}$ converge.</p>`
    },
    {
        title: 'Exercice SSN 13',
        body: `Soit $(u_n)_{n \\in \\mathbb{N}}$ une suite réelle non majorée.
<p>Montrer qu'il existe une suite extraite de $(u_n)_{n \\in \\mathbb{N}}$ tendant vers $+\\infty$.</p>`
    },
    {
        title: 'Exercice SSN 14',
        body: `Soit $n \\in \\mathbb{N}^*$. On considère l'équation $(E_n)$ d'inconnue $x \\in ]0, +\\infty[$ :
$$(E_n) : \\quad \\sum_{k=1}^{n} x^k = 1$$
<ol>
    <li>Montrer que $(E_n)$ admet une unique solution, notée $x_n$.</li>
    <li>Montrer que la suite $(x_n)_{n \\in \\mathbb{N}^*}$ est monotone convergente.</li>
    <li>Transformer $\\displaystyle\\sum_{k=1}^{n} x^k$ lorsque $x \\neq 1$. En déduire $\\displaystyle\\lim_{n \\to +\\infty} x_n$.</li>
</ol>`
    },
    {
        title: 'Exercice SSN 15',
        body: `Soit $(u_n)_{n \\in \\mathbb{N}}$ la suite de réels strictement positifs définie par :
$$u_0 = 1 \\qquad \\text{et} \\qquad \\forall n \\in \\mathbb{N}, \\quad u_{n+1} = \\sqrt{\\frac{u_n}{e}}$$
<p>Exprimer $u_n$ en fonction de $n$ et étudier la convergence de cette suite.</p>`
    },
];

async function seedExercises() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Find Category
        const category = await Category.findOne({ name: 'Suites et séries numériques' });
        if (!category) {
            console.error('❌ Category "Suites et séries numériques" not found');
            process.exit(1);
        }

        // Find User
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
                console.log(`⚠️  Exercise "${exercise.title}" already exists. Updating content...`);
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
        console.error('❌ Error seeding exercises:', error);
        process.exit(1);
    }
}

seedExercises();
