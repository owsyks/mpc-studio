import json
import re

def translate_math_text(text: str) -> str:
    """
    Translates French mathematical descriptions into precise academic English
    while preserving all LaTeX delimiters ($...$ and $$...$$).
    """
    if not text:
        return ""

    # Split by LaTeX math blocks to avoid touching formulas
    parts = re.split(r'(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)', text)

    # Replacement dictionary for French -> English phrasing
    fr_en_phrases = [
        # General & Structural
        ("Soit", "Let"),
        ("soit", "let"),
        ("Soient", "Let"),
        ("soient", "let"),
        ("On dit que", "We say that"),
        ("on dit que", "we say that"),
        ("Démontrer que", "Prove that"),
        ("démontrer que", "prove that"),
        ("Montrer que", "Show that"),
        ("montrer que", "show that"),
        ("Prouver que", "Prove that"),
        ("Vérifier que", "Verify that"),
        ("vérifier que", "verify that"),
        ("Calculer", "Calculate"),
        ("calculer", "calculate"),
        ("Déterminer", "Determine"),
        ("déterminer", "determine"),
        ("si et seulement si", "if and only if"),
        ("ssi", "iff"),
        ("par définition", "by definition"),
        ("Par définition", "By definition"),
        ("d'après le cours", "according to the course"),
        ("D'après le cours", "According to the course notes"),
        ("Comme", "Since"),
        ("comme", "since"),
        ("Puisque", "Since"),
        ("puisque", "since"),
        ("Donc", "Therefore"),
        ("donc", "therefore"),
        ("Ainsi", "Thus"),
        ("ainsi", "thus"),
        ("En effet", "Indeed"),
        ("en effet", "indeed"),
        ("D'où", "Hence"),
        ("d'où", "hence"),
        ("De plus", "Furthermore"),
        ("de plus", "furthermore"),
        ("Par conséquent", "Consequently"),
        ("par conséquent", "consequently"),

        # Algebra concepts
        ("loi de composition interne", "internal binary operation"),
        ("loi interne", "internal binary operation"),
        ("Loi de composition interne", "Internal binary operation"),
        ("Loi interne", "Internal binary operation"),
        ("ensemble non vide", "non-empty set"),
        ("associativité", "associativity"),
        ("Associativité", "Associativity"),
        ("élément neutre", "identity element"),
        ("Élément neutre", "Identity element"),
        ("élément symétrique", "inverse element"),
        ("Élément symétrique", "Inverse element"),
        ("symétrique ou inverse", "symmetric or inverse"),
        ("groupe abélien", "abelian group"),
        ("groupe commutatif", "commutative group"),
        ("sous-groupe distingué", "normal subgroup"),
        ("Sous-groupe distingué", "Normal subgroup"),
        ("sous-groupe normal", "normal subgroup"),
        ("sous-groupes distingués", "normal subgroups"),
        ("Sous-groupes distingués", "Normal subgroups"),
        ("groupe quotient", "quotient group"),
        ("groupes quotients", "quotient groups"),
        ("morphisme de groupes", "group homomorphism"),
        ("morphismes de groupes", "group homomorphisms"),
        ("Morphismes de groupes", "Group homomorphisms"),
        ("noyau", "kernel"),
        ("Noyau", "Kernel"),
        ("image", "image"),
        ("Image", "Image"),
        ("injectif", "injective"),
        ("surjectif", "surjective"),
        ("bijectif", "bijective"),
        ("isomorphisme", "isomorphism"),
        ("isomorphe à", "isomorphic to"),
        ("ordre d'un élément", "order of an element"),
        ("Ordre d'un élément", "Order of an element"),
        ("groupe cyclique", "cyclic group"),
        ("groupes cycliques", "cyclic groups"),
        ("groupe monogène", "monogenic group"),
        ("générateur", "generator"),
        ("générateurs", "generators"),
        ("sous-groupe engendré", "generated subgroup"),
        ("produit direct", "direct product"),
        ("Théorème de Lagrange", "Lagrange's Theorem"),
        ("théorème de Lagrange", "Lagrange's theorem"),
        ("Petit Théorème de Fermat", "Fermat's Little Theorem"),
        ("petit théorème de Fermat", "Fermat's little theorem"),
        ("Théorème d'Euler", "Euler's Theorem"),
        ("théorème d'Euler", "Euler's theorem"),
        ("indicateur d'Euler", "Euler's totient function"),
        ("classes d'équivalence", "equivalence classes"),
        ("classe d'équivalence", "equivalence class"),
        ("relation d'équivalence", "equivalence relation"),
        ("division euclidienne", "Euclidean division"),
        ("algorithme d'Euclide étendu", "extended Euclidean algorithm"),
        ("identité de Bézout", "Bézout's identity"),
        ("inversible", "invertible"),
        ("inversibles", "invertible elements"),
        ("diviseurs de zéro", "zero divisors"),
        ("diviseur de zéro", "zero divisor"),
        ("congruence modulo", "congruence modulo"),
        ("reste de la division", "remainder of the division"),
        ("matrice identité", "identity matrix"),
        ("matrices triangulaires", "triangular matrices"),
        ("cercle unité", "unit circle"),

        # Pedagogical & Exam phrases
        ("Objectif & Démarche :", "Goal & Procedure:"),
        ("Astuce de Rédaction d'Oran 1 :", "Oran 1 Exam Writing Tip:"),
        ("Piège Fréquent à l'Examen :", "Frequent Exam Trap:"),
        ("Explication détaillée :", "Detailed Explanation:"),
        ("Règle d'or :", "Golden rule:"),
        ("Conseil d'examen :", "Exam tip:"),
        ("Erreur fréquente :", "Common mistake:"),
        ("Approche correcte :", "Correct approach:"),
        ("Pourquoi c'est crucial :", "Why it matters:"),
        ("Pourquoi c'est important :", "Why it matters:"),
        ("Étape", "Step"),
        ("étape", "step"),
        ("Étapes", "Steps"),
        ("étapes", "steps"),
        ("Exemple d'application", "Worked application example"),
        ("Exercice d'application", "Worked tutorial exercise"),
        ("Non-vacuité :", "Non-emptiness:"),
        ("Fermeture :", "Closure:"),
        ("Stabilité :", "Stability / Closure:"),
        ("Stabilité par la loi :", "Closure under operation:"),
        ("Stabilité par produit avec l'inverse :", "Closure under product with inverse:"),
        ("Commutativité :", "Commutativity:"),
        ("Injectivité :", "Injectivity:"),
        ("Surjectivité :", "Surjectivity:"),
        ("Inverse d'un élément :", "Inverse element:"),
        ("Calcul du PGCD :", "GCD Computation:"),
        ("Passage modulo", "Taking modulo"),
        ("Réduction positive :", "Positive reduction:"),
        ("Vérification :", "Verification:"),
        ("Conditions d'application :", "Application conditions:"),
        ("Réduction de l'exposant :", "Exponent reduction:"),
        ("Calcul direct final :", "Final direct calculation:"),
        ("Caractère distingué :", "Normality character:"),
        ("Ordre du quotient :", "Quotient order:"),
        ("Classes d'équivalence de", "Equivalence classes of"),
        ("Produit matriciel :", "Matrix product:"),
        ("Formule générale :", "General formula:"),
    ]

    for i in range(len(parts)):
        # If it's not a LaTeX block, perform translation substitutions
        if not (parts[i].startswith("$") and parts[i].endswith("$")):
            out = parts[i]
            for fr, en in fr_en_phrases:
                out = out.replace(fr, en)
            parts[i] = out

    return "".join(parts)

def translate_curriculum():
    with open('src/data/curriculum.json', 'r', encoding='utf-8') as f:
        modules = json.load(f)

    module_titles_en = {
        "module-1": "Module 1 — Groups and Subgroups",
        "module-2": "Module 2 — Group Homomorphisms",
        "module-3": "Module 3 — Normal Subgroups and Quotient Groups",
        "module-4": "Module 4 — Monogenic and Cyclic Groups",
        "module-5": "Module 5 — Fundamental Theorems (Lagrange, Euler, Fermat)",
        "module-6": "Module 6 — Congruences and Z/nZ"
    }

    module_descs_en = {
        "module-1": "Internal binary operations, group axioms, elementary properties, and subgroup characterization criteria.",
        "module-2": "Group homomorphisms, endomorphisms, isomorphisms, kernels, images, and injectivity/surjectivity criteria.",
        "module-3": "Normal subgroups, conjugation, equivalence relations, cosets, quotient groups G/H, and isomorphism theorems.",
        "module-4": "Subgroups generated by a subset or element, element order, monogenic and cyclic structures, and Z/nZ isomorphisms.",
        "module-5": "Lagrange's theorem, divisibility of element orders, Euler's totient function, and Fermat's little theorem for cryptography.",
        "module-6": "Congruences modulo n, ring structure of Z/nZ, invertible units, zero divisors, and the extended Euclidean algorithm."
    }

    lesson_titles_en = {
        "lesson-1-1": "Group Concept & Fundamental Axioms",
        "lesson-1-2": "Fundamental Properties & Invertibility",
        "lesson-1-3": "Subgroups & Characterization Criteria",
        "lesson-1-4": "Examples of Groups: Matrices & Affine Functions",
        "lesson-2-1": "Group Homomorphisms: Definition & Basic Properties",
        "lesson-2-2": "Kernel, Image & Injectivity Criterion",
        "lesson-2-3": "Isomorphisms & Applications",
        "lesson-3-1": "Normal (Distinguished) Subgroups",
        "lesson-3-2": "Equivalence Relations, Cosets & Quotient Groups",
        "lesson-3-3": "First Isomorphism Theorem & G/H Structures",
        "lesson-4-1": "Subgroup Generated by an Element & Element Order",
        "lesson-4-2": "Monogenic vs Cyclic Groups",
        "lesson-4-3": "Subgroups and Generators of Cyclic Groups",
        "lesson-5-1": "Lagrange's Theorem and Its Consequences",
        "lesson-5-2": "Euler's Totient and Fermat's Little Theorem",
        "lesson-6-1": "Congruences Modulo n & The Ring Z/nZ",
        "lesson-6-2": "Invertible Elements, Units & Zero Divisors",
        "lesson-6-3": "Linear Congruence Equations & Bézout Algorithm"
    }

    translated_modules = []

    for m in modules:
        mod_copy = dict(m)
        mod_id = m["id"]
        mod_copy["title"] = module_titles_en.get(mod_id, translate_math_text(m["title"]))
        mod_copy["shortDescription"] = module_descs_en.get(mod_id, translate_math_text(m["shortDescription"]))

        trans_lessons = []
        for l in m["lessons"]:
            les_copy = dict(l)
            les_id = l["id"]
            les_copy["title"] = lesson_titles_en.get(les_id, translate_math_text(l["title"]))
            les_copy["objectives"] = [translate_math_text(obj) for obj in l.get("objectives", [])]
            les_copy["prerequisites"] = [translate_math_text(pre) for pre in l.get("prerequisites", [])]

            # Content translation
            content_copy = dict(l["content"])
            if "intuition" in content_copy:
                content_copy["intuition"] = translate_math_text(content_copy["intuition"])
            if "formalDefinition" in content_copy:
                content_copy["formalDefinition"] = translate_math_text(content_copy["formalDefinition"])
            if "detailedTheory" in content_copy:
                content_copy["detailedTheory"] = translate_math_text(content_copy["detailedTheory"])

            # Notation guide
            if "notationGuide" in content_copy:
                content_copy["notationGuide"] = [
                    {
                        "symbol": n.get("symbol", ""),
                        "meaning": translate_math_text(n.get("meaning", ""))
                    }
                    for n in content_copy["notationGuide"]
                ]

            # Step by step method
            if "stepByStepMethod" in content_copy:
                content_copy["stepByStepMethod"] = [
                    {
                        "stepNumber": s.get("stepNumber", i + 1),
                        "title": translate_math_text(s.get("title", "")),
                        "goal": translate_math_text(s.get("goal", "")),
                        "procedure": translate_math_text(s.get("procedure", "")),
                        "examTip": translate_math_text(s.get("examTip", "")),
                        "pitfallToAvoid": translate_math_text(s.get("pitfallToAvoid", ""))
                    }
                    for i, s in enumerate(content_copy["stepByStepMethod"])
                ]

            # Exam pitfalls
            if "examPitfalls" in content_copy:
                content_copy["examPitfalls"] = [
                    translate_math_text(p) if isinstance(p, str) else {
                        "mistake": translate_math_text(p.get("mistake", "")),
                        "correctApproach": translate_math_text(p.get("correctApproach", "")),
                        "whyItMatters": translate_math_text(p.get("whyItMatters", ""))
                    }
                    for p in content_copy["examPitfalls"]
                ]

            # Worked example
            if "workedExample" in content_copy and content_copy["workedExample"]:
                we = content_copy["workedExample"]
                steps_trans = []
                for st in we.get("steps", []):
                    if isinstance(st, str):
                        steps_trans.append(translate_math_text(st))
                    elif isinstance(st, dict):
                        steps_trans.append({
                            "step": translate_math_text(st.get("step", "")),
                            "detail": translate_math_text(st.get("detail", ""))
                        })
                    else:
                        steps_trans.append(st)

                content_copy["workedExample"] = {
                    "statement": translate_math_text(we.get("statement", "")),
                    "steps": steps_trans
                }
                if "title" in we:
                    content_copy["workedExample"]["title"] = translate_math_text(we["title"])

            # Quiz
            if "quiz" in l:
                les_copy["quiz"] = [
                    {
                        "question": translate_math_text(q.get("question", "")),
                        "options": [translate_math_text(opt) for opt in q.get("options", [])],
                        "correctAnswerIndex": q.get("correctAnswerIndex", 0),
                        "explanation": translate_math_text(q.get("explanation", ""))
                    }
                    for q in l["quiz"]
                ]

            les_copy["content"] = content_copy
            trans_lessons.append(les_copy)

        mod_copy["lessons"] = trans_lessons
        translated_modules.append(mod_copy)

    with open('src/data/curriculum-en.json', 'w', encoding='utf-8') as f:
        json.dump(translated_modules, f, ensure_ascii=False, indent=2)
    print("curriculum-en.json generated successfully!")

def translate_exercises():
    with open('src/data/exercises.json', 'r', encoding='utf-8') as f:
        exercises = json.load(f)

    ex_titles_en = {
        "td1-ex1": "Affine Group on R* x R",
        "td1-ex2": "Relativistic Velocity Group on (-1, 1)",
        "td1-ex3": "Affine Functions Group under Composition",
        "td1-ex6": "Subgroup Criteria: Classical Examples",
        "td1-ex8": "Group Homomorphism Identification",
        "td2-ex1": "Normal Subgroups and Homomorphism Properties",
        "td2-ex2": "Heisenberg Matrix Group and its Center",
        "td2-ex5": "Order of 9 in (Z/12Z, +)",
        "td2-ex8": "Groups of Exponent 2 (Klein 4-group)",
        "td2-ex9": "Invertible Elements Group Structure (Z/20Z)*"
    }

    translated_ex = []
    for ex in exercises:
        ex_copy = dict(ex)
        eid = ex["id"]
        ex_copy["title"] = ex_titles_en.get(eid, translate_math_text(ex["title"]))
        ex_copy["statement"] = translate_math_text(ex["statement"])
        ex_copy["hints"] = [translate_math_text(h) for h in ex.get("hints", [])]

        if "solution" in ex:
            sol_copy = dict(ex["solution"])
            if "steps" in sol_copy:
                sol_copy["steps"] = [translate_math_text(st) for st in sol_copy["steps"]]
            ex_copy["solution"] = sol_copy

        if "rubric" in ex:
            ex_copy["rubric"] = [
                {
                    "criterion": translate_math_text(r.get("criterion", "")),
                    "points": r.get("points", 0)
                }
                for r in ex["rubric"]
            ]

        translated_ex.append(ex_copy)

    with open('src/data/exercises-en.json', 'w', encoding='utf-8') as f:
        json.dump(translated_ex, f, ensure_ascii=False, indent=2)
    print("exercises-en.json generated successfully!")

if __name__ == '__main__':
    translate_curriculum()
    translate_exercises()
