# -*- coding: utf-8 -*-
"""
Enrich curriculum.json with comprehensive step-by-step mathematical explanations,
exam protocols, line-by-line proof derivations, and university traps.
"""
import json
import os

with open("src/data/curriculum.json", "r", encoding="utf-8") as f:
    modules = json.load(f)

# Module 1 Enhancements
lesson_enrichments = {
    "lesson-1-1": {
        "detailedTheory": """### Comprendre la structure d'un groupe en profondeur

Un groupe n'est pas seulement une définition abstraite : c'est l'outil mathématique fondamental permettant d'étudier la **symétrie**, l'**inversibilité** et la **réversibilité** des opérations. En cryptographie (RSA, Diffie-Hellman, courbes elliptiques), toute opération de chiffrement repose sur un groupe où chaque action dispose d'une action inverse unique.

#### Les 4 Piliers Fondamentaux (Axiomes) :

1. **La Fermeture (Loi de Composition Interne) :**
   $$\\forall x, y \\in G, \\quad x * y \\in G$$
   Une opération ne peut pas faire "sortir" les éléments de l'ensemble. Si vous additionnez deux entiers relatifs, vous obtenez toujours un entier relatif. En revanche, la division sur $\\mathbb{Z}$ n'est pas une loi interne car $1 / 2 \\notin \\mathbb{Z}$.

2. **L'Associativité :**
   $$\\forall x, y, z \\in G, \\quad (x * y) * z = x * (y * z)$$
   L'associativité garantit que l'on peut effectuer une chaîne d'opérations $x * y * z$ sans ambiguïté et sans parenthèses obligatoires. Elle permet le calcul des puissances $x^n$ par exponentiation rapide, pierre angulaire de la cryptographie moderne.

3. **L'Élément Neutre :**
   $$\\exists e \\in G, \\quad \\forall x \\in G, \\quad x * e = e * x = x$$
   L'élément neutre est l'élément qui n'altère aucun élément du groupe. Deux faits cruciaux démontrés au cours :
   - L'élément neutre est **unique**. Si $e_1$ et $e_2$ sont deux neutres, alors $e_1 = e_1 * e_2 = e_2$.
   - L'élément neutre doit obligatoirement être un élément de $G$ et ne dépendre d'aucun $x$.

4. **Le Symétrique (ou Inverse) :**
   $$\\forall x \\in G, \\quad \\exists x' \\in G, \\quad x * x' = x' * x = e$$
   Chaque élément possède une "annulation" unique. Pour $x \\in G$, son symétrique est noté $x^{-1}$ (ou $-x$ en notation additive).
   - Propriété clé : $(x * y)^{-1} = y^{-1} * x^{-1}$. L'ordre est inversé car $(x * y) * (y^{-1} * x^{-1}) = x * (y * y^{-1}) * x^{-1} = x * e * x^{-1} = x * x^{-1} = e$.

#### Distinction Groupe Abélien (Commutatif)
Un groupe est dit **abélien** si $\\forall x, y \\in G, x * y = y * x$. Attention : la commutativité n'est JAMAIS requise pour être un groupe ! Les groupes de matrices $GL_n(\\mathbb{R})$ ou les permutations $S_n$ sont des groupes non commutatifs fondamentaux.""",
        "stepByStepMethod": [
            {
                "stepNumber": 1,
                "title": "Vérifier la stabilité (Fermeture de la loi)",
                "goal": "Montrer que le résultat de l'opération reste strictement dans l'ensemble $G$",
                "procedure": "Prenez deux éléments quelconques $x, y \\in G$. Calculez $x * y$ et démontrez explicitement que $x * y$ respecte toutes les conditions d'appartenance à $G$ (intervalle, non-nullité, régularité matricielle, etc.).",
                "examTip": "Ne sautez JAMAIS cette étape à l'examen d'Oran 1 ! Les correcteurs retirent systématiquement des points si la fermeture n'est pas traitée en premier.",
                "commonTrap": "Oublier de vérifier qu'aucun dénominateur ne s'annule pour les lois fractionnaires rationnelles."
            },
            {
                "stepNumber": 2,
                "title": "Démontrer l'associativité",
                "goal": "Établir l'égalité $(x * y) * z = x * (y * z)$ pour tous $x, y, z \\in G$",
                "procedure": "Calculez séparément le membre de gauche $A = (x * y) * z$ en remplaçant d'abord $x * y$, puis en appliquant la loi avec $z$. Ensuite, calculez le membre de droite $B = x * (y * z)$. Réduisez les expressions algébriques au même dénominateur ou sous forme développée canonique, puis concluez que $A = B$.",
                "examTip": "Si la loi est déjà connue pour être commutative, mentionnez-le pour alléger les calculs de symétrie.",
                "commonTrap": "Confondre l'associativité avec la commutativité ou tenter de prouver avec un exemple particulier au lieu de variables formelles $x, y, z$."
            },
            {
                "stepNumber": 3,
                "title": "Déterminer l'élément neutre $e$",
                "goal": "Trouver un élément $e \\in G$ tel que $\\forall x \\in G, x * e = e * x = x$",
                "procedure": "1. Poser l'équation $x * e = x$ avec une inconnue $e$.\\n2. Résoudre cette équation pour $e$.\\n3. Vérifier impérativement que la valeur trouvée pour $e$ est une constante indépendante de $x$.\\n4. Vérifier que $e \\in G$.\\n5. Si la loi n'a pas été prouvée commutative, vérifier obligatoirement que $e * x = x$.",
                "examTip": "Indiquez clairement 'Comme la loi est commutative, $e * x = x$ est automatiquement vérifié'.",
                "commonTrap": "Trouver une expression pour $e$ qui dépend encore de $x$ (un neutre NE PEUT PAS dépendre de l'élément évalué !)."
            },
            {
                "stepNumber": 4,
                "title": "Calculer le symétrique $x'$ de chaque élément",
                "goal": "Montrer que pour tout $x \\in G$, il existe $x' \\in G$ tel que $x * x' = e$",
                "procedure": "1. Soit $x \\in G$ fixé. Poser l'équation $x * x' = e$ avec pour inconnue $x'$.\\n2. Isoler $x'$ en fonction de $x$.\\n3. Vérifier que $x'$ est bien défini pour TOUT $x \\in G$ (aucun dénominateur nul dans le domaine $G$).\\n4. Démontrer que $x' \\in G$.\\n5. Vérifier la symétrie à gauche $x' * x = e$ si non commutative.",
                "examTip": "Rédigez toujours 'Soit $x \\in G$ quelconque' pour bien marquer le quantificateur universel.",
                "commonTrap": "Oublier de vérifier que $x'$ appartient effectivement à l'ensemble $G$."
            },
            {
                "stepNumber": 5,
                "title": "Tester la commutativité (si demandé)",
                "goal": "Vérifier si $x * y = y * x$",
                "procedure": "Calculez $x * y$ et $y * x$. Si les deux expressions sont identiques pour tous $x, y \\in G$, concluez que $(G, *)$ est un groupe abélien.",
                "examTip": "Un groupe abélien simplifie souvent la recherche des inverses et des neutres bilatéraux.",
                "commonTrap": "Affirmer qu'un groupe est abélien sans justification formelle."
            }
        ],
        "examPitfalls": [
            "Oublier de justifier la fermeture : $x * y \\in G$. C'est le piège n°1 à l'examen d'Oran 1.",
            "Ne pas vérifier que l'élément neutre trouvé appartient bien à l'ensemble de départ (par exemple, si $e = 0$ mais que l'ensemble est $\\mathbb{R}^*$, alors $e \\notin G$ et ce n'est PAS un groupe !).",
            "Calculer l'inverse sans vérifier qu'il est défini pour tous les éléments (attention aux divisions par zéro).",
            "Écrire $x / y$ au lieu de $x * y^{-1}$ dans un groupe multiplicatif non commutatif."
        ]
    },
    "lesson-1-2": {
        "detailedTheory": """### Théorèmes de Structure et Propriétés Fondamentales

Dans tout groupe $(G, *)$, la structure axiomatique engendre des lois algébriques rigoureuses qui permettent de manipuler les équations exactement comme en algèbre classique, mais avec des précautions fondamentales.

#### 1. Règle de Simplification (Régularité)
Dans un groupe $(G, *)$, tout élément est **régulier** (ou simplifiable) à gauche et à droite :
- Si $a * x = a * y$, alors en composant à gauche par $a^{-1}$ :
  $$a^{-1} * (a * x) = a^{-1} * (a * y) \\implies (a^{-1} * a) * x = (a^{-1} * a) * y \\implies e * x = e * y \\implies x = y$$
- De même, $x * a = y * a \\implies x = y$.

#### 2. Résolution Unique d'Équations
Pour tous éléments $a, b \\in G$, les équations :
$$a * x = b \\quad \\text{et} \\quad y * a = b$$
admettent chacune une solution **unique** dans $G$ :
- Pour $a * x = b$ : en composant à gauche par $a^{-1}$, on obtient $x = a^{-1} * b$.
- Pour $y * a = b$ : en composant à droite par $a^{-1}$, on obtient $y = b * a^{-1}$.
*Remarque cruciale :* Si le groupe n'est pas abélien, $a^{-1} * b \\neq b * a^{-1}$ en général !

#### 3. Table de Cayley d'un Groupe Fini
Pour un groupe fini $G = \\{g_1, g_2, \\dots, g_n\\}$, la table de multiplication présente une propriété remarquable (Sudoku / Carré Latin) :
**Chaque élément de $G$ apparaît exactement une et une seule fois par ligne et par colonne.**
Si un symbole se répète dans une même ligne, la structure ne peut pas être un groupe (violation de la régularité).""",
        "stepByStepMethod": [
            {
                "stepNumber": 1,
                "title": "Résoudre une équation $a * x = b$ dans un groupe",
                "goal": "Isoler l'inconnue $x$ en respectant la non-commutativité éventuelle",
                "procedure": "1. Multiplier à GAUCHE par $a^{-1}$ : $a^{-1} * (a * x) = a^{-1} * b$.\\n2. Utiliser l'associativité : $(a^{-1} * a) * x = a^{-1} * b$.\\n3. Remplacer par le neutre : $e * x = a^{-1} * b$.\\n4. Conclure : $x = a^{-1} * b$.",
                "examTip": "Ne commutez JAMAIS les termes $a^{-1}$ et $b$ sans avoir préalablement prouvé que le groupe est abélien.",
                "commonTrap": "Multiplier à droite par $a^{-1}$ pour une équation $a * x = b$, ce qui donnerait $a * x * a^{-1}$ et n'isole pas $x$ si la loi n'est pas commutative."
            }
        ],
        "examPitfalls": [
            "Affirmer que $(a * b)^{-1} = a^{-1} * b^{-1}$ sans préciser que le groupe est abélien. La règle générale est $(a * b)^{-1} = b^{-1} * a^{-1}$.",
            "Écrire des fractions $\\frac{b}{a}$ dans un groupe matriciel ou général. Utilisez toujours $a^{-1} * b$ ou $b * a^{-1}$."
        ]
    },
    "lesson-1-3": {
        "detailedTheory": """### Sous-Groupes : Définitions et Critères Universels

Un sous-groupe est une partie non vide $H$ d'un groupe $(G, *)$ qui forme elle-même un groupe avec la même loi restreinte à $H$.

#### Le Critère en 3 Points (Critère Standard)
Une partie $H \\subset G$ est un sous-groupe de $(G, *)$ si et seulement si :
1. $H$ est non vide : $e_G \\in H$ (le plus simple pour prouver que $H \\neq \\emptyset$ est de vérifier que le neutre y appartient).
2. $H$ est stable par la loi : $\\forall x, y \\in H, \\quad x * y \\in H$.
3. $H$ est stable par passage au symétrique : $\\forall x \\in H, \\quad x^{-1} \\in H$.

#### Le Critère Équivalent en 1 Seul Point (Le Critère d'Examen d'Oran 1)
Pour aller plus vite et faire une démonstration élégante :
$$H \\text{ est un sous-groupe de } G \\iff H \\neq \\emptyset \\quad \\text{et} \\quad \\forall x, y \\in H, \\quad x * y^{-1} \\in H$$
*(En notation additive, la condition devient : $\\forall x, y \\in H, \\quad x - y \\in H$)*

#### Les Sous-groupes de $(\\mathbb{Z}, +)$
Un théorème fondamental du cours stipule :
**Les sous-groupes de $(\\mathbb{Z}, +)$ sont exactement de la forme $n\\mathbb{Z} = \\{n \\cdot k \\mid k \\in \\mathbb{Z}\\}$, où $n \\in \\mathbb{N}$.**
- Démonstration : Soit $H$ un sous-groupe non nul de $\\mathbb{Z}$. Soit $n$ le plus petit entier strictement positif dans $H$. Par division euclidienne, tout élément $x \\in H$ s'écrit $x = nq + r$ avec $0 \\le r < n$. Comme $x \\in H$ et $nq \\in H$, alors $r = x - nq \\in H$. Par minimalité de $n$, on a nécessairement $r = 0$, d'où $x = nq \\in n\\mathbb{Z}$. Donc $H = n\\mathbb{Z}$.""",
        "stepByStepMethod": [
            {
                "stepNumber": 1,
                "title": "Prouver que $H \\neq \\emptyset$",
                "goal": "Montrer que le sous-ensemble contient au moins un élément, typiquement l'élément neutre $e_G$",
                "procedure": "Évaluez si $e_G$ satisfait la condition d'appartenance à $H$. Écrivez explicitement : 'Comme $e_G$ vérifie la propriété de $H$, on a $e_G \\in H$, donc $H \\neq \\emptyset$'.",
                "examTip": "Montrer que $e_G \\in H$ est la méthode la plus rapide et la plus appréciée par les correcteurs.",
                "commonTrap": "Écrire seulement 'Soit $x \\in H$' sans avoir au préalable prouvé que $H$ n'est pas l'ensemble vide."
            },
            {
                "stepNumber": 2,
                "title": "Appliquer le critère $x * y^{-1} \\in H$",
                "goal": "Démontrer que la combinaison d'un élément avec l'inverse d'un autre reste dans $H$",
                "procedure": "1. Soient deux éléments $x, y \\in H$.\\n2. Exprimez ce que signifie mathématiquement $x \\in H$ et $y \\in H$.\\n3. Calculez l'inverse $y^{-1}$ (ou l'opposé $-y$).\\n4. Formez le produit $z = x * y^{-1}$.\\n5. Démontrez que $z$ vérifie scrupuleusement la propriété caractéristique de $H$.\\n6. Concluez que $x * y^{-1} \\in H$.",
                "examTip": "Utilisez le critère combiné $x * y^{-1} \\in H$ plutôt que les deux critères séparés pour gagner du temps en examen.",
                "commonTrap": "Inverser le mauvais élément ou oublier d'inverser $y$ (calculer $x * y$ au lieu de $x * y^{-1}$)."
            }
        ],
        "examPitfalls": [
            "Oublier de tester si $H \\neq \\emptyset$.",
            "Tester la stabilité avec des exemples numériques au lieu de variables formelles.",
            "Confondre sous-groupe et sous-ensemble quelconque."
        ]
    }
}

# Module 2 Enhancements (Morphismes, Noyau, Image)
lesson_enrichments.update({
    "lesson-2-1": {
        "detailedTheory": """### Morphismes de Groupes : Structure et Conservation de la Loi

Un morphisme de groupes (ou homomorphisme) est une application entre deux groupes qui "respecte" leurs structures algébriques respectives.

Soient $(G, *)$ et $(G', \\top)$ deux groupes. Une application $f: G \\to G'$ est un **morphisme de groupes** ssi :
$$\\forall x, y \\in G, \\quad f(x * y) = f(x) \\top f(y)$$

#### Vocabulaire Fondamental :
- **Endomorphisme :** Morphisme d'un groupe dans lui-même ($G = G'$).
- **Isomorphisme :** Morphisme **bijectif** entre $G$ et $G'$. Deux groupes isomorphes $G \\simeq G'$ ont exactement la même structure algébrique.
- **Automorphisme :** Endomorphisme bijectif de $G$ dans $G'$.

#### Propriétés Obligatoires Déduites Immédiatement :
1. **Conservation de l'élément neutre :**
   $$f(e_G) = e_{G'}$$
   *Démonstration :* $f(e_G) = f(e_G * e_G) = f(e_G) \\top f(e_G)$. En simplifiant par $f(e_G)$ dans $G'$, on déduit $e_{G'} = f(e_G)$.
2. **Conservation des symétriques :**
   $$\\forall x \\in G, \\quad f(x^{-1}) = (f(x))^{-1}$$
   *Démonstration :* $f(x) \\top f(x^{-1}) = f(x * x^{-1}) = f(e_G) = e_{G'}$. Par unicité de l'inverse, $(f(x))^{-1} = f(x^{-1})$.
3. **Conservation des puissances :**
   $$\\forall n \\in \\mathbb{Z}, \\quad f(x^n) = (f(x))^n$$""",
        "stepByStepMethod": [
            {
                "stepNumber": 1,
                "title": "Écrire la définition avec les deux lois distinctes",
                "goal": "Identifier clairement la loi du groupe de départ et celle du groupe d'arrivée",
                "procedure": "Identifiez $(G, *)$ et $(G', \\top)$. Pour deux éléments $x, y \\in G$, calculez $f(x * y)$ et séparez les termes jusqu'à obtenir $f(x) \\top f(y)$.",
                "examTip": "Attention : si $G$ est additif et $G'$ est multiplicatif (ex: exponentielle de $(\\mathbb{R}, +)$ vers $(\\mathbb{R}^*_+, \\times)$), l'équation s'écrit : $f(x + y) = f(x) \\times f(y)$ !",
                "commonTrap": "Utiliser la même loi des deux côtés de l'égalité quand les groupes ont des lois différentes."
            }
        ],
        "examPitfalls": [
            "Ne pas vérifier au préalable que l'application $f$ est bien définie sur tout $G$.",
            "Écrire $f(x * y) = f(x) * f(y)$ alors que le groupe d'arrivée a une loi différente (ex: $+$ vers $\\times$)."
        ]
    },
    "lesson-2-2": {
        "detailedTheory": """### Noyau et Image d'un Morphisme : Définitions et Théorèmes Clés

Soit $f: (G, *) \\to (G', \\top)$ un morphisme de groupes. Deux sous-ensembles fondamentaux mesurent la fidélité de la transformation :

#### 1. Le Noyau (Kernel) : $\\ker(f)$
$$\\ker(f) = \\{x \\in G \\mid f(x) = e_{G'}\\} = f^{-1}(\\{e_{G'}\\})$$
Le noyau rassemble tous les éléments du groupe de départ qui sont "écrasés" sur le neutre du groupe d'arrivée.
- **Théorème fondamental :** $\\ker(f)$ est un **sous-groupe distingué** de $G$.
- **Critère d'injectivité suprême :**
  $$f \\text{ est injective } \\iff \\ker(f) = \\{e_G\\}$$
  *Démonstration :*
  - Si $f$ est injective, comme $f(e_G) = e_{G'}$, le seul antécédent de $e_{G'}$ est $e_G$, donc $\\ker(f) = \\{e_G\\}$.
  - Réciproquement, si $\\ker(f) = \\{e_G\\}$, soient $x, y \\in G$ tels que $f(x) = f(y)$. Alors $f(x) \\top (f(y))^{-1} = e_{G'} \\implies f(x * y^{-1}) = e_{G'}$. Donc $x * y^{-1} \\in \\ker(f) = \\{e_G\\} \\implies x * y^{-1} = e_G \\implies x = y$. L'application est donc injective !

#### 2. L'Image : $\\mathrm{Im}(f)$
$$\\mathrm{Im}(f) = \\{y \\in G' \\mid \\exists x \\in G, y = f(x)\\} = f(G)$$
- **Théorème :** $\\mathrm{Im}(f)$ est un **sous-groupe** de $G'$.
- **Critère de surjectivité :** $f$ est surjective $\\iff \\mathrm{Im}(f) = G'$.

#### 3. Premier Théorème d'Isomorphisme
$$G / \\ker(f) \\simeq \\mathrm{Im}(f)$$
Le quotient du groupe de départ par le noyau est canoniquement isomorphe à l'image.""",
        "stepByStepMethod": [
            {
                "stepNumber": 1,
                "title": "Calculer le noyau $\\ker(f)$",
                "goal": "Résoudre l'équation $f(x) = e_{G'}$",
                "procedure": "1. Poser l'équation $f(x) = e_{G'}$ pour $x \\in G$.\\n2. Résoudre algébriquement pour trouver la condition sur $x$.\\n3. Exprimer le résultat sous forme d'ensemble : $\\ker(f) = \\{x \\in G \\mid \\dots\\}$.",
                "examTip": "Pour prouver l'injectivité, montrez directement que si $f(x) = e_{G'}$, alors $x = e_G$.",
                "commonTrap": "Confondre le neutre du groupe d'arrivée avec le neutre du groupe de départ lors de la pose de l'équation $f(x) = e_{G'}$."
            }
        ],
        "examPitfalls": [
            "Affirmer qu'un morphisme est injectif sans calculer $\\ker(f)$.",
            "Écrire $\\ker(f) = 0$ au lieu de $\\ker(f) = \\{0\\}$ (le noyau est un ensemble, pas un scalaire !)."
        ]
    }
})

# Module 3 Enhancements (Sous-groupes distingués, Quotients)
lesson_enrichments.update({
    "lesson-3-1": {
        "detailedTheory": """### Sous-Groupes Distingués (Normaux) et Conjugaison

Soit $(G, *)$ un groupe et $H$ un sous-groupe de $G$.
Dans un groupe abélien, tous les sous-groupes sont automatiquement distingués. Mais dans un groupe non commutatif, cette propriété devient cruciale.

#### Définition Formelle
Un sous-groupe $H$ est dit **distingué** (ou **normal**) dans $G$, noté $H \\triangleleft G$, ssi il est stable par conjugaison par tout élément de $G$ :
$$\\forall g \\in G, \\quad \\forall h \\in H, \\quad g * h * g^{-1} \\in H$$
Ce qui s'écrit de manière globale :
$$\\forall g \\in G, \\quad g * H * g^{-1} = H \\quad \\iff \\quad \\forall g \\in G, \\quad g * H = H * g$$

#### Sens Géométrique et Algébrique
$g * H = H * g$ signifie que la **classe à gauche** engendrée par $g$ coïncide exactement avec la **classe à droite** engendrée par $g$.
L'élément $g$ commute avec le sous-groupe $H$ *en tant qu'ensemble*, même s'il ne commute pas individuellement avec chaque élément $h \\in H$.

#### Exemples Cruciaux du Cours d'Oran 1 :
1. Tout sous-groupe d'un groupe abélien est distingué : $g * h * g^{-1} = g * g^{-1} * h = e * h = h \\in H$.
2. Le noyau de tout morphisme de groupes $\\ker(f)$ est **toujours** un sous-groupe distingué :
   Soit $h \\in \\ker(f)$ et $g \\in G$. On a $f(g * h * g^{-1}) = f(g) * f(h) * (f(g))^{-1} = f(g) * e_{G'} * (f(g))^{-1} = f(g) * (f(g))^{-1} = e_{G'}$. Donc $g * h * g^{-1} \\in \\ker(f)$.
3. Le centre d'un groupe $Z(G) = \\{z \\in G \\mid \\forall x \\in G, z*x = x*z\\}$ est toujours un sous-groupe distingué.""",
        "stepByStepMethod": [
            {
                "stepNumber": 1,
                "title": "Méthode pas-à-pas pour prouver qu'un sous-groupe est distingué",
                "goal": "Montrer que $\\forall g \\in G, \\forall h \\in H, g * h * g^{-1} \\in H$",
                "procedure": "1. Poser un élément quelconque $g \\in G$ et un élément quelconque $h \\in H$.\\n2. Calculer le conjugué $c = g * h * g^{-1}$.\\n3. Simplifier l'expression algébrique de $c$.\\n4. Démontrer que le résultat $c$ vérifie bien la condition définissant le sous-groupe $H$.\\n5. Conclure que $H \\triangleleft G$.",
                "examTip": "Si $H$ a été défini comme le noyau d'un morphisme de groupes $f$, invoquez DIRECTEMENT le théorème du cours : 'En tant que noyau d'un morphisme, $H = \\ker(f)$ est un sous-groupe distingué'. Cela vous fait économiser 10 minutes d'écriture.",
                "commonTrap": "Calculer $g * h$ au lieu de $g * h * g^{-1}$."
            }
        ],
        "examPitfalls": [
            "Vouloir prouver que $g * h = h * g$ élément par élément. C'est faux en général ! La relation est $g * H = H * g$ ensembliste.",
            "Oublier de vérifier au préalable que $H$ est bien un sous-groupe avant de tester sa normalité."
        ]
    },
    "lesson-3-2": {
        "detailedTheory": """### Construction du Groupe Quotient $G/H$

Pourquoi les sous-groupes distingués sont-ils si importants ? Parce qu'ils sont les **seuls** sous-groupes permettant de quotienter un groupe tout en conservant une structure de groupe !

#### Relation d'Équivalence Modulo $H$
Soit $H$ un sous-groupe de $(G, *)$. On définit une relation binaire sur $G$ par :
$$x \\sim y \\iff x^{-1} * y \\in H$$
- Cette relation est une **relation d'équivalence** (réflexive, symétrique, transitive).
- La classe d'équivalence de $x \\in G$ est la classe à gauche :
  $$\\bar{x} = x * H = \\{x * h \\mid h \\in H\\}$$
- L'ensemble de toutes les classes est noté $G/H$.

#### Pourquoi $H$ DOIT être Distingué ? (Compatibilité de la Loi)
On souhaite définir une loi sur l'ensemble quotient $G/H$ par :
$$\\bar{x} \\cdot \\bar{y} = \\overline{x * y}$$
Pour que cette définition ait un sens mathématique, elle doit être **indépendante du choix des représentants** $x$ et $y$ !
Si $x' \\in \\bar{x}$ et $y' \\in \\bar{y}$, on doit avoir $\\overline{x' * y'} = \\overline{x * y}$.
Or, ceci est vrai **SI ET SEULEMENT SI** $H$ est un sous-groupe distingué de $G$ ($H \\triangleleft G$).

#### Cardinal du Quotient (Formule des Indices)
Pour un groupe fini $G$ :
$$|G/H| = [G : H] = \\frac{|G|}{|H|}$$""",
        "stepByStepMethod": [
            {
                "stepNumber": 1,
                "title": "Déterminer les éléments du groupe quotient $G/H$",
                "goal": "Identifier les classes d'équivalence distinctes formant la partition de $G$",
                "procedure": "1. Calculer le sous-groupe $H = \\bar{e}$.\\n2. Choisir un élément $x_1 \\notin H$ et calculer sa classe $\\bar{x}_1 = x_1 * H$.\\n3. Répéter l'opération avec les éléments restants jusqu'à recouvrir entièrement $G$.\\n4. Le quotient est $G/H = \\{\\bar{e}, \\bar{x}_1, \\bar{x}_2, \\dots\\}$.",
                "examTip": "Vérifiez toujours que la somme des cardinaux des classes donne bien le cardinal total $|G|$ (théorème de Lagrange).",
                "commonTrap": "Tenter de quotienter par un sous-groupe qui n'est pas distingué dans un groupe non abélien."
            }
        ],
        "examPitfalls": [
            "Confondre un élément $x \\in G$ avec sa classe d'équivalence $\\bar{x} \\in G/H$.",
            "Oublier que l'élément neutre de $G/H$ est la classe du neutre $\\bar{e} = H$."
        ]
    }
})

# Module 4 Enhancements (Cycliques, Ordre)
lesson_enrichments.update({
    "lesson-4-1": {
        "detailedTheory": """### Ordre d'un Élément et Groupes Monogènes / Cycliques

La théorie des groupes cycliques est le cœur battant de la cryptographie à clé publique (chiffrement ElGamal, échange de clés Diffie-Hellman, signatures DSA/ECDSA).

#### 1. Ordre d'un Élément
Soit $(G, *)$ un groupe et $a \\in G$.
- **Définition :** L'ordre de $a$, noté $o(a)$, est le plus petit entier $k \\in \\mathbb{N}^*$ tel que :
  $$a^k = e$$
  *(En notation additive, $k \\cdot a = 0$)*.
- Si un tel entier n'existe pas, l'élément $a$ est dit d'**ordre infini**.

#### 2. Propriétés Majeures de l'Ordre :
- Pour tout $m \\in \\mathbb{Z}$, $a^m = e \\iff o(a) \\mid m$.
- Les puissances $a^0, a^1, a^2, \\dots, a^{o(a)-1}$ sont toutes deux à deux distinctes.
- Le sous-groupe engendré par $a$ est $\\langle a \\rangle = \\{a^k \\mid k \\in \\mathbb{Z}\\}$. Son cardinal est exactement égal à l'ordre de $a$ :
  $$|\\langle a \\rangle| = o(a)$$

#### 3. Définitions : Monogène vs Cyclique
- Un groupe $G$ est **monogène** s'il existe un élément $a \\in G$ tel que $G = \\langle a \\rangle$.
- Un groupe est **cyclique** s'il est monogène ET **fini**.
- Tout groupe cyclique d'ordre $n$ est isomorphe à $(\\mathbb{Z}/n\\mathbb{Z}, +)$.""",
        "stepByStepMethod": [
            {
                "stepNumber": 1,
                "title": "Calcul méthodique de l'ordre d'un élément dans un groupe fini",
                "goal": "Déterminer $o(a)$ sans calcul superflu",
                "procedure": "1. Identifier la notation (additive ou multiplicative) et l'élément neutre $e$.\\n2. Calculer les puissances successives : $a^1, a^2, a^3, \\dots$ (ou $1\\cdot a, 2\\cdot a, 3\\cdot a, \\dots$).\\n3. Arrêter dès que le résultat vaut $e$.\\n4. Le premier exposant $k \\ge 1$ obtenu est l'ordre $o(a)$.\\n5. Vérifier que $o(a)$ divise bien le cardinal du groupe $|G|$ (Lagrange).",
                "examTip": "Dans $\\mathbb{Z}/n\\mathbb{Z}$, l'ordre de $\\bar{k}$ pour l'addition se calcule instantanément avec la formule : $o(\\bar{k}) = \\frac{n}{\\gcd(n, k)}$.",
                "commonTrap": "Prendre $k=0$ car $a^0 = e$. L'ordre doit être STRICTEMENT positif ($k \\ge 1$)."
            }
        ],
        "examPitfalls": [
            "Affirmer qu'un groupe est cyclique sans exhiber au moins un générateur explicite.",
            "Oublier que dans $\\mathbb{Z}/n\\mathbb{Z}$, le nombre de générateurs est donné par la fonction indicatrice d'Euler $\\varphi(n)$."
        ]
    }
})

# Module 5 & 6 Enhancements (Lagrange, Euler, Fermat, Congruences)
lesson_enrichments.update({
    "lesson-5-1": {
        "detailedTheory": """### Le Théorème de Lagrange et ses Puissantes Conséquences

Le Théorème de Joseph-Louis Lagrange est sans doute le résultat le plus fondamental de la théorie des groupes finis.

#### Énoncé du Théorème de Lagrange
Soit $G$ un groupe fini et $H$ un sous-groupe de $G$. Alors :
**L'ordre de $H$ divise l'ordre de $G$.**
$$|G| = [G : H] \\cdot |H| \\implies |H| \\mid |G|$$
où $[G : H]$ est l'indice de $H$ dans $G$ (le nombre de classes à gauche disjointes).

#### Démonstration Complète Pas à Pas :
1. Considérons les classes à gauche modulo $H$ : $xH = \\{x * h \\mid h \\in H\\}$.
2. Ces classes forment une **partition** de $G$ : elles sont deux à deux disjointes et leur union est $G$ tout entier.
3. Pour chaque $x \\in G$, l'application $\\psi_x: H \\to xH, h \\mapsto x * h$ est une **bijection** (inversible par $y \\mapsto x^{-1} * y$).
4. Par conséquent, toutes les classes à gauche ont exactement le même nombre d'éléments : $|xH| = |H|$.
5. Si $k = [G:H]$ est le nombre de classes disjointes, alors $|G| = k \\cdot |H|$, ce qui prouve que $|H|$ divise $|G|$.

#### Les 3 Conséquences Majeures pour l'Examen :
1. **L'ordre d'un élément divise l'ordre du groupe :**
   Pour tout $x \\in G$, comme $\\langle x \\rangle$ est un sous-groupe de $G$, alors $o(x) = |\\langle x \\rangle| \\mid |G|$.
2. **La puissance d'ordre $|G|$ donne toujours le neutre :**
   $$\\forall x \\in G, \\quad x^{|G|} = e$$
3. **Tout groupe de cardinal premier $p$ est cyclique :**
   Si $|G| = p$ premier, alors ses seuls sous-groupes ont pour ordre $1$ ou $p$. Donc tout élément $x \\neq e$ engendre $G$ tout entier, et $G \\simeq \\mathbb{Z}/p\\mathbb{Z}$.""",
        "stepByStepMethod": [
            {
                "stepNumber": 1,
                "title": "Exploiter Lagrange pour trouver les ordres possibles d'éléments",
                "goal": "Restreindre drastiquement la recherche des ordres d'éléments dans un groupe fini",
                "procedure": "1. Calculer le cardinal du groupe $N = |G|$.\\n2. Dresser la liste exhaustive des diviseurs positifs de $N$.\\n3. Tout élément du groupe aura nécessairement pour ordre l'un de ces diviseurs.\\n4. Si le problème demande de prouver qu'il n'existe pas d'élément d'ordre $k$, montrez simplement que $k$ ne divise pas $N$.",
                "examTip": "Si un groupe a pour cardinal 15, les ordres d'éléments possibles sont SEULEMENT 1, 3, 5 et 15. Il est impossible d'avoir un élément d'ordre 2, 4, 6, etc.",
                "commonTrap": "Penser que la réciproque du théorème de Lagrange est toujours vraie (si $d \\mid |G|$, il n'existe pas toujours un sous-groupe d'ordre $d$ dans un groupe non abélien, ex: groupe alterné $A_4$ d'ordre 12 sans sous-groupe d'ordre 6)."
            }
        ],
        "examPitfalls": [
            "Appliquer Lagrange à un groupe infini (Lagrange n'est valable QUE pour les groupes FINIS).",
            "Confondre l'ordre du sous-groupe $|H|$ et l'indice $[G:H]$."
        ]
    },
    "lesson-6-1": {
        "detailedTheory": """### Congruences, $\\mathbb{Z}/n\\mathbb{Z}$ et Éléments Inversibles

L'anneau $(\\mathbb{Z}/n\\mathbb{Z}, +, \\times)$ est le terrain d'exécution de la quasi-totalité des cryptosystèmes classiques et modernes.

#### 1. Définition et Structure
Deux entiers $a$ et $b$ sont dits congrus modulo $n$ ssi $n \\mid (a - b)$, noté $a \\equiv b \\pmod n$.
L'ensemble quotient $\\mathbb{Z}/n\\mathbb{Z}$ comprend exactement $n$ classes : $\\{\\bar{0}, \\bar{1}, \\bar{2}, \\dots, \\overline{n-1}\\}$.

#### 2. Groupe des Unités Inversibles $(\\mathbb{Z}/n\\mathbb{Z})^\\times$
La classe $\\bar{a}$ est inversible pour la multiplication dans $\\mathbb{Z}/n\\mathbb{Z}$ si et seulement si $a$ et $n$ sont **premiers entre eux** :
$$\\bar{a} \\in (\\mathbb{Z}/n\\mathbb{Z})^\\times \\iff \\gcd(a, n) = 1$$
- Le cardinal de ce groupe multiplicatif est donné par l'**indicatrice d'Euler** $\\varphi(n)$.
- Si $p$ est premier, alors $\\mathbb{Z}/p\\mathbb{Z}$ est un **corps**, et $(\\mathbb{Z}/p\\mathbb{Z})^* = \\{\\bar{1}, \\bar{2}, \\dots, \\overline{p-1}\\}$ est un groupe multiplicatif cyclique d'ordre $p-1$.

#### 3. Calcul de l'Inverse par l'Algorithme d'Euclide Étendu
L'égalité de Bézout assure l'existence de $u, v \\in \\mathbb{Z}$ tels que :
$$a \\cdot u + n \\cdot v = 1 \\implies a \\cdot u \\equiv 1 \\pmod n$$
L'entier $u \\pmod n$ est donc l'inverse multiplicatif $a^{-1}$ cherché !""",
        "stepByStepMethod": [
            {
                "stepNumber": 1,
                "title": "Algorithme d'Euclide Étendu pas à pas pour trouver un inverse",
                "goal": "Calculer $a^{-1} \\pmod n$ lorsque $\\gcd(a, n) = 1$",
                "procedure": "1. Effectuer les divisions euclidiennes successives jusqu'à obtenir un reste de 1.\\n2. Remonter les égalités de bas en haut pour exprimer 1 comme combinaison linéaire de $a$ et $n$ : $1 = a \\cdot u + n \\cdot v$.\\n3. Réduire le coefficient $u$ modulo $n$ pour obtenir un représentant dans $\\{1, \\dots, n-1\\}$.\\n4. L'inverse est $\\bar{a}^{-1} = \\bar{u}$.",
                "examTip": "Vérifiez toujours votre résultat en calculant $(a \\times u) \\pmod n$. Vous devez obligatoirement trouver 1 !",
                "commonTrap": "Oublier de réduire $u$ modulo $n$ si $u$ est négatif (ex: si $u = -3$ dans $\\mathbb{Z}/20\\mathbb{Z}$, l'inverse est $20 - 3 = 17$)."
            }
        ],
        "examPitfalls": [
            "Tenter d'inverser un élément dont le PGCD avec $n$ est strictement supérieur à 1 (un diviseur de zéro n'est JAMAIS inversible).",
            "Confondre l'inverse additif (l'opposé $-a = n-a$) avec l'inverse multiplicatif $a^{-1}$."
        ]
    }
})

# Apply enrichments to all lessons in curriculum
updated_count = 0
for mod in modules:
    for lesson in mod["lessons"]:
        lid = lesson["id"]
        if lid in lesson_enrichments:
            lesson["content"].update(lesson_enrichments[lid])
            updated_count += 1
        else:
            # Provide generic rich step-by-step method and pitfalls if not specialized
            if "stepByStepMethod" not in lesson["content"]:
                lesson["content"]["stepByStepMethod"] = [
                    {
                        "stepNumber": 1,
                        "title": "Analyser les hypothèses et poser les notations",
                        "goal": f"Comprendre le cadre mathématique de {lesson['title']}",
                        "procedure": "Écrivez clairement les ensembles en jeu, la nature des éléments et les opérations concernées.",
                        "examTip": "Définir vos variables au début d'une copie rapporte toujours des points de clarté.",
                        "commonTrap": "Démarrer des calculs sans préciser où vivent les variables."
                    },
                    {
                        "stepNumber": 2,
                        "title": "Appliquer la définition ou le théorème du cours",
                        "goal": "Traduire la question en une condition algébrique formelle",
                        "procedure": f"Citez la définition officielle issue de {lesson['sourcePdf']} (p. {lesson['sourcePage']}) et appliquez-la rigoureusement.",
                        "examTip": "Nommez explicitement le théorème utilisé (ex: Théorème de Lagrange, Critère de sous-groupe).",
                        "commonTrap": "Invoquer un résultat sans vérifier que toutes ses hypothèses sont réunies."
                    }
                ]
            if "examPitfalls" not in lesson["content"]:
                lesson["content"]["examPitfalls"] = [
                    "Sauter les étapes de justification intermédiaire.",
                    "Ne pas respecter les notations strictes du cours de l'Université d'Oran 1."
                ]

with open("src/data/curriculum.json", "w", encoding="utf-8") as f:
    json.dump(modules, f, indent=2, ensure_ascii=False)

print(f"Successfully enriched curriculum.json with {updated_count} specialized lessons and full step-by-step methods across all 18 lessons.")
