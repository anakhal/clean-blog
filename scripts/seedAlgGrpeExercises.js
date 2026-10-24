require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');
const Category = require('../models/Category');
const User = require('../models/User');

const exercises = [
    {
        title: 'Exercice AlgGrpe 1',
        body: `Soit $G$ un groupe. On appelle centre de $G$ l'ensemble $Z(G) = \\{g \\in G | \\forall h \\in G, gh = hg\\}$. Montrer que $Z(G)$ est un sous-groupe de $G$.`
    },
    {
        title: 'Exercice AlgGrpe 2',
        body: `Soit $G$ un groupe dont tous les éléments $\\neq e$ sont d'ordre 2. Montrer que $G$ est commutatif.`
    },
    {
        title: 'Exercice AlgGrpe 3',
        body: `Donner un exemple de groupe infini dont tous les éléments sont d'ordre fini.`
    },
    {
        title: 'Exercice AlgGrpe 4',
        body: `Montrer que l'ensemble des bijections continues de $\\mathbb{R}$ dans $\\mathbb{R}$ est un sous-groupe de $\\text{Bij}(\\mathbb{R})$.`
    },
    {
        title: 'Exercice AlgGrpe 5',
        body: `Les bijections dérivables de $\\mathbb{R}$ dans $\\mathbb{R}$ forment-elles un sous-groupe de $\\text{Bij}(\\mathbb{R})$ ?`
    },
    {
        title: 'Exercice AlgGrpe 6',
        body: `Quels sont les sous-groupes finis de $\\mathbb{C}^*$ ?`
    },
    {
        title: 'Exercice AlgGrpe 7',
        body: `Soit $G$ un groupe et $A$ une partie finie non vide de $G$ stable par produit. Montrer que $A$ est un sous-groupe de $G$. (On pourra considérer la suite $(g^n)_{n \\in \\mathbb{N}}$.)`
    },
    {
        title: 'Exercice AlgGrpe 8',
        body: `Soit $A$ une partie du groupe $G$ et $\\varphi : G \\to G'$ un morphisme de groupes. Montrer que $\\langle \\varphi(A) \\rangle = \\varphi(\\langle A \\rangle)$.`
    },
    {
        title: 'Exercice AlgGrpe 9',
        body: `Caractériser les groupes finis d'ordre premier.`
    },
    {
        title: 'Exercice AlgGrpe 10',
        body: `Soit $s \\in \\mathcal{S}_n$ un cycle. À quelle condition sur $d \\in \\mathbb{Z}$, $s^d$ est-il un cycle ?`
    },
    {
        title: 'Exercice AlgGrpe 11',
        body: `Caractériser les groupes $G$ dont les seuls sous-groupes sont $G$ et $\\{e_G\\}$.`
    },
    {
        title: 'Exercice AlgGrpe 12',
        body: `Le groupe $\\mathbb{Q}$ admet-il une partie génératrice finie ?`
    },
    {
        title: 'Exercice AlgGrpe 13',
        body: `Soit $(G, *)$ un groupe, $H$ un ensemble et $f : G \\to H$ une bijection. Montrer que la loi $\\bullet$ sur $H$ définie par $h_1 \\bullet h_2 = f(f^{-1}(h_1) * f^{-1}(h_2))$ est une loi de groupe sur $H$, et que $f$ est alors un isomorphisme de groupes. Application : Montrer que la loi sur $]-1, 1[$ donnée par $x * y = \\frac{x + y}{1 + xy}$ est une loi de groupe commutative.`
    },
    {
        title: 'Exercice AlgGrpe 14',
        body: `L'ensemble $\\mathbb{D}$ des nombres décimaux est-il un sous-anneau de $\\mathbb{Q}$ ? Un sous-corps de $\\mathbb{Q}$ ?`
    },
    {
        title: 'Exercice AlgGrpe 15',
        body: `Soit $A$ un anneau commutatif intègre et non nul.
<ol type="a">
    <li>Montrer que si $A$ est fini, $A$ est un corps.</li>
    <li>Montrer que si $A$ n'a qu'un nombre fini d'idéaux, $A$ est un corps. (Considérer $x^n A$.)</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 16',
        body: `Soit $A$ un anneau commutatif et $I$ un idéal de $A$. On appelle radical de $I$ le sous-ensemble de $A$ défini par $\\sqrt{I} = \\{x \\in A | \\exists n \\in \\mathbb{N}, x^n \\in I\\}$.
<ol type="a">
    <li>Montrer que $\\sqrt{I}$ est un idéal de $A$.</li>
    <li>Déterminer $\\sqrt{\\sqrt{I}}$.</li>
    <li>Montrer que si $J$ est aussi un idéal de $A$, alors $\\sqrt{I \\cap J} = \\sqrt{I} \\cap \\sqrt{J}$ et $\\sqrt{I + J} \\supset \\sqrt{I} + \\sqrt{J}$.</li>
    <li>Si $A = \\mathbb{Z}$, $I = 720\\mathbb{Z}$, déterminer $\\sqrt{I}$.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 17',
        body: `Quels sont les idéaux de $\\mathbb{Z}/n\\mathbb{Z}$ ?`
    },
    {
        title: 'Exercice AlgGrpe 18',
        body: `Soit $E$ un $\\mathbb{F}_3$-espace vectoriel de dimension 5. Combien y a-t-il de couples $(u, v) \\in E^2$ libres ? Combien y a-t-il de bases d'un plan fixé de $E$ ? Combien l'espace vectoriel $\\mathbb{F}_3^5$ contient-il de plans ?`
    },
    {
        title: 'Exercice AlgGrpe 19',
        body: `Déterminer les polynômes irréductibles de $\\mathbb{Z}/2\\mathbb{Z}[X]$ de degré $\\leqslant 5$.`
    },
    {
        title: 'Exercice AlgGrpe 20',
        body: `Soit $S_p = \\sum_{k=1}^n a_k^p$. Exprimer $S_2$ et $S_3$ en fonction des fonctions symétriques élémentaires en les $a_k$.`
    },
    {
        title: 'Exercice AlgGrpe 21',
        body: `Sous la dynastie des Tang, au 7e siècle en Chine, l'empereur voulut connaitre le nombre exact de ses soldats. Bien qu'il en eût un nombre presque innombrable, il savait qu'il en avait moins d'un million. Il fit alors ranger ses soldats en carrés de 29 personnes de côté. Il en resta 180. Il les fit alors se ranger en carrés de 35 personnes de côté. Il en resta alors 1120. Combien de soldats avait l'armée de l'empereur ?`
    },
    {
        title: 'Exercice AlgGrpe 22',
        body: `<ol>
    <li>Soit $G$ un groupe et $g$ un élément de $G$. Soit $\\varphi_g$ l'application de $G$ dans $G$ définie par $h \\mapsto ghg^{-1}$. Montrer que $\\varphi_g$ est un automorphisme de groupes. Si le groupe $G$ est commutatif, que vaut $\\varphi_g$ ?</li>
    <li>Soit $\\text{Aut}(G)$ l'ensemble des automorphismes de groupes de $G$. Montrer que $\\text{Aut}(G)$ est un groupe pour $\\circ$.</li>
    <li>Soit $\\varphi : G \\to \\text{Aut}(G)$ définie par $\\varphi(g) = \\varphi_g$. Montrer que $\\varphi$ est un morphisme de groupes. À quelle condition sur le centre $Z(G)$ de $G$ est-il injectif ?</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 23',
        body: `Soit $n \\in \\mathbb{N}^*$ et $\\tau \\in \\mathcal{S}_n$. Déterminer les permutations qui commutent à $\\tau$ (c'est le centralisateur de $\\tau$ dans $\\mathcal{S}_n$). En déduire le centre de $\\mathcal{S}_n$.`
    },
    {
        title: 'Exercice AlgGrpe 24',
        body: `À quelle condition les groupes $\\mathbb{Z}^n$ et $\\mathbb{Z}^p$ sont-ils isomorphes ?`
    },
    {
        title: 'Exercice AlgGrpe 25',
        body: `<b>Un théorème de Cayley :</b> Soit $G$ un groupe fini. Pour tout $g \\in G$, on note $L_g : G \\to G$ l'application $h \\mapsto gh$. Soit $L$ l'application $g \\mapsto L_g$.
<ol>
    <li>Montrer que $L$ est un morphisme injectif de groupes de $G$ vers $\\mathcal{S}_G$.</li>
    <li>En déduire que tout groupe fini est isomorphe à un sous-groupe d'un groupe $\\mathcal{S}_n$.</li>
    <li>Montrer que tout groupe fini est isomorphe à un sous-groupe de $O_n(\\mathbb{R})$ (et même $SO_n(\\mathbb{R})$) pour un certain $n \\in \\mathbb{N}^*$.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 26',
        body: `<b>Groupe dérivé :</b> Soit $G$ et $H$ deux groupes et $\\varphi : G \\to H$ un morphisme de groupes. Pour tous $a, b \\in G$, on note $[a, b] = aba^{-1}b^{-1}$, appelé commutateur de $a$ et $b$. Soit $\\mathcal{D}(G)$ l'ensemble des produits de commutateurs d'éléments de $G$.
<ol>
    <li>Montrer que $\\mathcal{D}(G)$ est un sous-groupe de $G$. Montrer que $G$ est commutatif si et seulement si $\\mathcal{D}(G) = \\{e_G\\}$.</li>
    <li>Montrer que $\\ker \\varphi$ contient $\\mathcal{D}(G)$ si et seulement si $\\text{Im} \\,\\varphi$ est commutatif.</li>
    <li>Montrer que $\\mathcal{D}(G)$ est un sous-groupe distingué de $G$, i.e. pour tout $g \\in G$ et tout $x \\in \\mathcal{D}(G)$, $gxg^{-1} \\in \\mathcal{D}(G)$.</li>
    <li>Déterminer le groupe dérivé de $\\mathcal{S}_n$ où $n \\geqslant 3$. (Indication : montrer que $(1\\ 2\\ 3)$ appartient à $\\mathcal{D}(\\mathcal{S}_n)$ et utiliser la question précédente.)</li>
    <li>Déterminer le groupe dérivé de $GL_n(\\mathbb{C})$. (On pourra admettre que $SL_n(\\mathbb{C})$ est engendré par les transvections $T_{i,j}(\\lambda)$.)</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 27',
        body: `Soit $n \\in \\mathbb{N}^*$. On munit $\\mathcal{S}_n$ de la probabilité uniforme et on note $p_n$ la probabilité qu'une permutation ait tous ses cycles de longueur $\\leqslant n/2$ dans la décomposition en produit de cycles à supports disjoints. Calculer $p_n$ et étudier sa limite.`
    },
    {
        title: 'Exercice AlgGrpe 28',
        body: `Montrer que $\\mathbb{Z}$, $\\mathbb{Z}^2$, $\\mathbb{Q}$ et $\\mathbb{Q}^*_+$ ne sont pas isomorphes en tant que groupes.`
    },
    {
        title: 'Exercice AlgGrpe 29',
        body: `<b>Autres générateurs de $\\mathcal{S}_n$ :</b>
<ol>
    <li>Soit $n \\geqslant 2$ et $\\tau_i = (i\\ i+1) \\in \\mathcal{S}_n$ avec $1 \\leqslant i \\leqslant n-1$. Montrer que toute permutation $s \\in \\mathcal{S}_n$ s'écrit comme produit des $\\tau_i$.</li>
    <li>Montrer que $\\mathcal{S}_n$ est engendré par $(1\\ 2)$ et le $n$-cycle $(1\\ 2\\ \\cdots\\ n)$.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 30',
        body: `Soit $n \\geqslant 2$.
<ol>
    <li>Déterminer tous les morphismes de groupes $\\varphi : \\mathcal{S}_n \\to \\mathbb{Z}$.</li>
    <li>Déterminer tous les morphismes de groupes $\\varphi : \\mathcal{S}_n \\to \\mathbb{C}^*$.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 31',
        body: `Le $n$-cycle $(1\\ 2\\ \\cdots\\ n)$ admet-il une racine carrée dans $\\mathcal{S}_n$ ?`
    },
    {
        title: 'Exercice AlgGrpe 32',
        body: `On munit $E = \\mathbb{R}^n$ de son produit scalaire usuel et $G$ un sous-groupe de $GL_n(\\mathbb{R})$. On suppose qu'il existe $k \\in ]0, 2[$ tel que toute matrice $M$ de $G$ vérifie $|||M - I_n||| < k$.
<ol>
    <li>Montrer que toute valeur propre complexe de $M$ est de module 1.</li>
    <li>Montrer qu'il existe un entier $p$ tel que toute matrice $M$ de $G$ vérifie $M^p = I_n$.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 33',
        body: `Soit $G$ un groupe fini de cardinal $n$. Montrer qu'il existe une partie génératrice $S$ de $G$ telle que $\\text{Card}(S) \\leqslant \\log_2(n)$.`
    },
    {
        title: 'Exercice AlgGrpe 34',
        body: `<b>Homographies :</b> Soit $\\mathbb{H} = \\{z \\in \\mathbb{C} \\mid \\text{Im}(z) > 0\\}$. Pour tout $M = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\in SL_2(\\mathbb{R})$, on considère l'application $\\varphi_M$ :
$$ \\begin{cases} \\varphi_M : \\mathbb{H} \\to \\mathbb{H} \\\\ z \\mapsto \\frac{az + b}{cz + d} \\end{cases} $$
Une telle application s'appelle une <i>homographie</i>. On note $G$ l'ensemble des homographies, i.e. $G = \\{\\varphi_M \\mid M \\in SL_2(\\mathbb{R})\\}$.
<ol>
    <li>Soit $M \\in SL_2(\\mathbb{R})$. Montrer que l'application $\\varphi_M$ est bien définie et vérifie $\\varphi(MN) = \\varphi_M \\circ \\varphi_N$ pour tous $M, N \\in SL_2(\\mathbb{R})$.</li>
    <li>En déduire que $G$ est un groupe pour la composition $\\circ$, que $M \\mapsto \\varphi_M$ est un morphisme de groupe. Montrer que $\\varphi_M$ est bijective et donner une expression de sa réciproque.</li>
    <li>Montrer que $G$ est engendré par les fonctions de la forme $z \\mapsto -\\frac{1}{z}$, $z \\mapsto z + t$, $z \\mapsto kz$ où $t \\in \\mathbb{R}$ et $k > 0$.</li>
    <li>Pour $\\theta \\in \\mathbb{R}$, on pose $R_\\theta = \\begin{pmatrix} \\cos \\theta & -\\sin \\theta \\\\ \\sin \\theta & \\cos \\theta \\end{pmatrix}$ et $r_\\theta = \\varphi_{R_\\theta}$. Montrer que l'application $\\varphi : \\mathbb{R} \\to G$ donnée par $\\theta \\mapsto r_\\theta$ est un morphisme de groupes. Déterminer son noyau.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 35',
        body: `Quels sont les deux derniers chiffres décimaux de $7^{7^{7^{7^{7^{7^7}}}}}$ ?`
    },
    {
        title: 'Exercice AlgGrpe 36',
        body: `<b>Théorème de Wilson :</b> Montrer qu'un entier $p \\geqslant 2$ est premier si et seulement si $(p - 1)! + 1 \\equiv 0 \\pmod p$.`
    },
    {
        title: 'Exercice AlgGrpe 37',
        body: `Soient $m, n \\in \\mathbb{N}$. Montrer que $mn(m^{60} - n^{60})$ est divisible par $56786730$.`
    },
    {
        title: 'Exercice AlgGrpe 38',
        body: `<b>Nombres de Fermat, de Mersenne et d'Euclide :</b>
<ol>
    <li>Soit $2^n - 1$ un nombre premier. Montrer que $n$ est premier. (Les nombres premiers de cette forme sont appelés nombres de Mersenne. Quelle est la particularité de leur développement en base 2 ?)</li>
    <li>On appelle nombre d'Euclide $e_n$ les nombres définis par récurrence par $e_1 = 2$ et $e_{n+1} = e_1 e_2 \\cdots e_n + 1$. Montrer que deux nombres d'Euclide distincts sont premiers entre eux. En combien d'étapes l'algorithme d'Euclide appliqué à deux nombres d'Euclide termine-t-il ? En déduire qu'il existe une infinité de nombres premiers.</li>
    <li>Soit $2^n + 1$ un nombre premier. Montrer que $n$ est une puissance de 2. On appelle nombre de Fermat $F_n$ les nombres de la forme $2^{2^n} + 1$. Montrer que deux nombres de Fermat distincts sont premiers entre eux.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 39',
        body: `<b>Critère de primalité de Fermat :</b> Montrer que $n$ est composé si et seulement s'il existe un entier $a$ tel que $1 < a < n$ et $a^{n-1} \\not\\equiv 1 \\pmod n$. (Un tel $a$ s'appelle un <i>témoin de Fermat</i>. Il fournit un certificat de non-primalité pour $n$.)`
    },
    {
        title: 'Exercice AlgGrpe 40',
        body: `Une fonction $f : \\mathbb{N}^* \\to \\mathbb{R}$ est dite <i>multiplicative</i> si pour tout couple $(m, n)$ d'entiers premiers entre eux, $f(mn) = f(m)f(n)$.
<ol>
    <li>Montrer que $f$ est multiplicative si et seulement si $m \\mapsto g(m) = \\sum_{d|m} f(d)$ est multiplicative.</li>
    <li>En déduire que les fonctions $\\varphi$ (indicatrice d'Euler), $S$ (somme des diviseurs) et $\\tau$ (nombre de diviseurs) sont multiplicatives.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 41',
        body: `<b>Nombres parfaits pairs :</b> Pour $n \\in \\mathbb{N}^*$, on note $S(n)$ la somme des diviseurs dans $\\mathbb{N}^*$ de $n$. Un nombre est parfait si $S(n) = 2n$.
<ol>
    <li>Montrer que $S$ est multiplicative, i.e. si $m$ et $n$ sont premiers entre eux, alors $S(mn) = S(m)S(n)$.</li>
    <li>Soit $p \\in \\mathbb{N}$ tel que $2^p - 1$ est premier. Montrer que $2^{p-1}(2^p - 1)$ est parfait (théorème d'Euclide).</li>
    <li>Soit $n$ parfait et pair. Montrer que $n$ s'écrit $n = 2^{p-1}(2^p - 1)$ où $(2^p - 1)$ est premier (théorème d'Euler).</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 42',
        body: `<ol>
    <li>On note $\\mathcal{D}(n)$ l'ensemble des diviseurs (positifs) de l'entier $n$. Soient $a, b \\in \\mathbb{N}^*$ premiers entre eux et $n = ab$. Montrer que l'application $\\mathcal{D}(a) \\times \\mathcal{D}(b) \\to \\mathcal{D}(ab)$ définie par $(k, l) \\mapsto kl$ est une bijection.</li>
    <li>Soit $S(n)$ (resp. $\\tau(n)$) la somme des diviseurs (resp. le nombre de diviseurs) de l'entier $n$. Montrer que si $n$ et $m$ sont premiers entre eux, $S(nm) = S(n)S(m)$ et $\\tau(nm) = \\tau(n)\\tau(m)$.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 43',
        body: `Soient $a, b \\in \\mathbb{Z}$.
<ol>
    <li>À quelle condition nécessaire et suffisante portant sur $a$ et $b$ a-t-on $\\mathbb{Z}/a\\mathbb{Z} \\times \\mathbb{Z}/b\\mathbb{Z}$ cyclique ?</li>
    <li>Déterminer tous les morphismes de $\\mathbb{Z}/a\\mathbb{Z}$ vers $\\mathbb{Z}/b\\mathbb{Z}$.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 44',
        body: `Soit $P \\in \\mathbb{R}[X]$. Montrer l'équivalence entre :
<ol>
    <li>Pour tout $x \\in \\mathbb{R}$, $P(x) \\geqslant 0$ ;</li>
    <li>Il existe $A, B \\in \\mathbb{R}[X]$ tels que $P = A^2 + B^2$.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 45',
        body: `<ol>
    <li>Soit $P \\in \\mathbb{R}[X]$ scindé. Montrer que $P'$ est scindé.</li>
    <li>Soit $P \\in \\mathbb{R}[X]$ scindé. Montrer que pour tout $\\alpha \\in \\mathbb{R}$, $\\alpha P + P'$ est scindé sur $\\mathbb{R}$.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 46',
        body: `<ol>
    <li>Montrer que les automorphismes de la $\\mathbb{K}$-algèbre $\\mathbb{K}[X]$ sont exactement les applications $P \\mapsto P(aX + b)$ où $(a, b) \\in \\mathbb{K}^* \\times \\mathbb{K}$.</li>
    <li>Montrer que les automorphismes de la $\\mathbb{K}$-algèbre $\\mathbb{K}(X)$ sont exactement les applications $F \\mapsto F\\left(\\frac{aX + b}{cX + d}\\right)$ où $a, b, c, d \\in \\mathbb{K}$ avec $ad - bc \\neq 0$.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 47',
        body: `<ol>
    <li>Comment déterminer si un polynôme de $\\mathbb{C}[X]$ admet une racine multiple ? (On ne sait pas déterminer les racines en général.)</li>
    <li>Soit $P \\in \\mathbb{Q}[X]$ irréductible. Montrer que $P$ n'a pas de racine multiple dans $\\mathbb{C}$.</li>
    <li>Soit $P \\in \\mathbb{Q}[X]$ de degré 5 admettant une racine multiple dans $\\mathbb{C}$. Montrer que $P$ admet une racine dans $\\mathbb{Q}$.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 48',
        body: `Soient $P, Q \\in \\mathbb{R}[X]$.
<ol>
    <li>On suppose que $P$ et $Q$ sont scindés à racines simples et que leurs racines sont entrelacées, i.e. entre deux racines de l'un, il y a une racine de l'autre. Montrer que pour tous $\\lambda, \\mu \\in \\mathbb{R}$, le polynôme $\\lambda P + \\mu Q$ est scindé à racines simples.</li>
    <li>Montrer que si pour tous $\\lambda, \\mu \\in \\mathbb{R}$, le polynôme $\\lambda P + \\mu Q$ est scindé à racines simples, alors les racines de $P$ et $Q$ sont entrelacées.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 49',
        body: `<ol>
    <li>Soit $P \\in \\mathbb{C}[X]$. Étudier l'injectivité et la surjectivité de $P : \\mathbb{C} \\to \\mathbb{C}$.</li>
    <li>Soit $F \\in \\mathbb{C}(X)$ non constant. Montrer que $F(\\mathbb{C})$ est soit $\\mathbb{C}$, soit $\\mathbb{C}$ privé d'un point.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 50',
        body: `Soit $n \\in \\mathbb{N}^*$ et $E = \\mathbb{R}_n[X]$.
<ol>
    <li>Soient $h_0, h_1, \\dots, h_n$ des réels distincts. Montrer que la famille $((X+h_i)^n)_{0 \\leqslant i \\leqslant n}$ est une base de $E$. On notera $\\theta_h : P \\mapsto P(X + h)$.</li>
    <li>Soit $\\mathcal{A} = \\{\\varphi \\in \\mathcal{L}(E) \\mid \\forall h \\in \\mathbb{R}, \\forall P \\in E, \\varphi(P(X + h)) = (\\varphi(P))(X + h)\\}$. Montrer que $\\mathcal{A}$ est une sous-algèbre de dimension $n + 1$ de $\\mathcal{L}(E)$.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 51',
        body: `<ol>
    <li>Montrer l'existence et l'unicité d'un $P_n \\in \\mathbb{R}[X]$ tel que pour tout $t \\in \\left]0, \\frac{\\pi}{2}\\right[$ :
    $$P_n(\\cot^2 t) = \\frac{\\sin((2n + 1)t)}{\\sin^{2n+1} t}.$$</li>
    <li>Déterminer les racines de $P_n$, leur multiplicité et leur somme.</li>
    <li>Établir que pour tout $t \\in \\left]0, \\frac{\\pi}{2}\\right[$, $\\sin t \\leqslant t \\leqslant \\tan t$ et $\\cot^2 t \\leqslant \\frac{1}{t^2} \\leqslant 1 + \\cot^2 t$.</li>
    <li>En déduire $\\sum_{k=1}^{+\\infty} \\frac{1}{k^2}$.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 52',
        body: `Soit $E = \\mathbb{R}_n[X]$ et $(P \\mid Q) = \\int_0^1 P(t)Q(t)\\,dt$.
<ol>
    <li>Montrer que $E$ muni de $(\\cdot \\mid \\cdot)$ est un espace euclidien.</li>
    <li>Soit $K = \\mathbb{R}_{n-1}[X]^\\perp$ et $P \\in K \\setminus \\{0\\}$. Quel est le degré de $P$ ?</li>
    <li>Soit $\\Phi : x \\mapsto \\int_0^1 P(t)t^x\\,dt$. Montrer que $\\Phi$ est une fonction rationnelle.</li>
    <li>Trouver $\\Phi$ à une constante multiplicative près.</li>
    <li>En déduire les coefficients de $P$.</li>
    <li>En déduire une base orthogonale de $E$.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 53',
        body: `Soit $M \\in \\mathcal{M}_n(\\mathbb{C})$. On rappelle que $\\mathbb{C}[M]$ désigne l'algèbre des polynômes en $M$.
<ol>
    <li>Caractériser les inversibles de l'anneau $\\mathbb{C}[M]$.</li>
    <li>Caractériser les diviseurs de zéro de $\\mathbb{C}[M]$. (Un diviseur de 0 d'un anneau commutatif $A$ est un élément non nul $a$ pour lequel il existe $b \\in A \\setminus \\{0\\}$ tel que $ab = 0$.)</li>
    <li>Caractériser les éléments nilpotents de $\\mathbb{C}[M]$.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 54',
        body: `Montrer que les algèbres $\\mathcal{C}^0(\\mathbb{R}, \\mathbb{R})$ et $\\mathcal{C}^1(\\mathbb{R}, \\mathbb{R})$ ne sont pas isomorphes.`
    },
    {
        title: 'Exercice AlgGrpe 55',
        body: `Soit $A$ un anneau commutatif.
<ol>
    <li>Soit $I$ un idéal de $A$ et $\\mathcal{R}$ la relation sur $A$ définie par $x \\mathcal{R} y$ si et seulement si $x - y \\in I$. Montrer que $\\mathcal{R}$ est une relation d'équivalence.</li>
    <li>Soit $\\mathcal{R}$ une relation d'équivalence sur $A$ compatible avec la somme et le produit. Montrer que la classe d'équivalence de $0$ est un idéal.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 56',
        body: `Soit $K$ un corps fini commutatif. Montrer que $\\text{Card}(K)$ est de la forme $p^n$ où $p$ est premier et $n \\in \\mathbb{N}^*$. (Indication : montrer que $K$ est un espace vectoriel sur son sous-corps premier.)`
    },
    {
        title: 'Exercice AlgGrpe 57',
        body: `Une algèbre de Boole $A$ est un anneau tel que $x^2 = x$ pour tout $x \\in A$.
<ol>
    <li>Montrer que $(\\mathbb{Z}/2\\mathbb{Z})^n$ est une algèbre de Boole.</li>
    <li>Montrer que tout élément est son propre opposé.</li>
    <li>On suppose que $A$ est une algèbre de Boole intègre. Montrer que $A$ est isomorphe à $\\mathbb{Z}/2\\mathbb{Z}$ en tant qu'algèbre.</li>
    <li>Montrer qu'une algèbre de Boole est naturellement munie d'une structure de $\\mathbb{Z}/2\\mathbb{Z}$-espace vectoriel. En déduire le cardinal d'une algèbre de Boole finie.</li>
    <li>Déterminer le nombre d'idéaux d'une algèbre de Boole finie.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 58',
        body: `Existe-t-il un sous-corps $\\mathbb{K}$ de $\\mathbb{R}$ tel que $\\mathbb{R}$ soit un $\\mathbb{K}$-espace vectoriel de dimension 2 ?`
    },
    {
        title: 'Exercice AlgGrpe 59',
        body: `Montrer que $\\alpha \\in \\mathbb{C}$ est algébrique si et seulement si $\\mathbb{Q}[\\alpha]$ est une $\\mathbb{Q}$-algèbre de dimension finie. Montrer que l'ensemble $\\overline{\\mathbb{Q}}$ des nombres algébriques est un sous-corps de $\\mathbb{C}$.`
    },
    {
        title: 'Exercice AlgGrpe 60',
        body: `Soit $H$ une partie finie non-vide de $GL(n, \\mathbb{R})$ stable par multiplication.
<ol>
    <li>Soit $M \\in H$. Montrer que la suite $k \\mapsto M^k$ n'est pas injective. En déduire que $H$ est un sous-groupe de $GL(n, \\mathbb{R})$.</li>
    <li>Soit $q = \\text{Card}(H)$ et $P = \\frac{1}{q} \\sum_{M \\in H} M$. Montrer que pour tout $M \\in H$, $MP = PM = P$. En déduire que $P^2 = P$.</li>
    <li>Trouver un supplémentaire dans $\\mathbb{R}^n$ de $\\bigcap_{M \\in H} \\ker(M - I_n)$ stable par tous les éléments de $H$.</li>
</ol>`
    },
    {
        title: 'Exercice AlgGrpe 61',
        body: `Soit $M \\in \\mathcal{M}_n(\\mathbb{R})$ à coefficients entiers, avec $[M]_{i,i}$ impair pour tout $i$ et $[M]_{i,j}$ pair pour tous $i \\neq j$. Montrer que $M$ est inversible.`
    }
];

async function seedExercises() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        let prepasParent = await Category.findOne({ name: 'Prépas' });
        if (!prepasParent) {
            prepasParent = await Category.create({ name: 'Prépas' });
            console.log('✅ Created parent category: Prépas');
        }

        let category = await Category.findOne({ name: 'Groupes et algèbres' });
        if (!category) {
            category = await Category.create({ 
                name: 'Groupes et algèbres',
                parent: prepasParent._id 
            });
            console.log('✅ Created category: Groupes et algèbres');
        } else if (!category.parent || category.parent.toString() !== prepasParent._id.toString()) {
            category.parent = prepasParent._id;
            await category.save();
            console.log('✅ Updated category parent for Groupes et algèbres');
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

        console.log('🎉 All Groupes et Algèbres exercises processed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

seedExercises();
