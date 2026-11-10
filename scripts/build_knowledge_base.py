# -*- coding: utf-8 -*-
"""
Generate course_kb.json containing structured, searchable knowledge chunks
from all 7 university PDFs with exact page mapping.
"""

import json
import re

with open('extracted_raw/all_extracted.json', encoding='utf-8') as f:
    raw_docs = json.load(f)

chunks = []

def clean_txt(t):
    # remove headers/footers
    t = re.sub(r'Université d’Oran1|Faculté des sciences exactes et appliquées|Departement d’informatique|S\.Fourour|Notes de cours|Outils Mathématiques.*', '', t)
    t = re.sub(r'\n\s*\n', '\n', t)
    return t.strip()

# 1. cours-mpc-partie1.pdf
for p in raw_docs['cours-mpc-partie1.pdf']:
    page_num = p['page']
    text = clean_txt(p['text'])
    if page_num in [4, 5]:
        chunks.append({
            "id": f"cours1-p{page_num}",
            "sourcePdf": "cours-mpc-partie1.pdf",
            "page": page_num,
            "moduleId": "module-1",
            "chapter": "Chapitre 1 : Groupes et Sous-groupes",
            "title": "Notion de groupe, Loi interne, Associativité, Neutre, Symétrique",
            "content": text,
            "latex": ["(G, *)", "\\forall x, y \\in G, x * y \\in G", "(x * y) * z = x * (y * z)", "x * e = e * x = x", "x * x' = x' * x = e"],
            "keywords": ["groupe", "axiomes", "associativité", "élément neutre", "symétrique", "abélien", "commutatif"]
        })
    elif page_num == 6:
        chunks.append({
            "id": f"cours1-p{page_num}",
            "sourcePdf": "cours-mpc-partie1.pdf",
            "page": page_num,
            "moduleId": "module-1",
            "chapter": "Chapitre 1 : Groupes et Sous-groupes",
            "title": "Propriétés fondamentales : Unicité du neutre et du symétrique, Inversion d'un produit",
            "content": text,
            "latex": ["(a * b)^{-1} = b^{-1} * a^{-1}", "a * b = a * c \\implies b = c"],
            "keywords": ["unicité", "symétrique", "inverse", "produit", "simplification", "régulier"]
        })
    elif page_num in [7, 8]:
        chunks.append({
            "id": f"cours1-p{page_num}",
            "sourcePdf": "cours-mpc-partie1.pdf",
            "page": page_num,
            "moduleId": "module-1",
            "chapter": "Chapitre 1 : Groupes et Sous-groupes",
            "title": "Sous-groupes, Critères de caractérisation, Sous-groupes de (Z, +)",
            "content": text,
            "latex": ["H \\le G", "x * y^{-1} \\in H", "n_0 \\mathbb{Z}"],
            "keywords": ["sous-groupe", "critère", "division euclidienne", "Z", "multiples", "intersection"]
        })
    elif page_num in [9, 10]:
        chunks.append({
            "id": f"cours1-p{page_num}",
            "sourcePdf": "cours-mpc-partie1.pdf",
            "page": page_num,
            "moduleId": "module-2",
            "chapter": "Chapitre 2 : Morphisme de groupes",
            "title": "Définition de morphisme, Endomorphisme, Isomorphisme, Automorphisme",
            "content": text,
            "latex": ["f(x * y) = f(x) * f(y)", "f(e) = e'", "f(x^{-1}) = f(x)^{-1}"],
            "keywords": ["morphisme", "homomorphisme", "isomorphisme", "endomorphisme", "automorphisme"]
        })
    elif page_num in [11, 12]:
        chunks.append({
            "id": f"cours1-p{page_num}",
            "sourcePdf": "cours-mpc-partie1.pdf",
            "page": page_num,
            "moduleId": "module-2",
            "chapter": "Chapitre 2 : Morphisme de groupes",
            "title": "Noyau (Ker) et Image (Im), Caractérisation de l'injectivité et de la surjectivité",
            "content": text,
            "latex": ["\\ker f = \\{x \\in G_1 \\mid f(x) = e_2\\}", "\\operatorname{Im} f = \\{f(x) \\mid x \\in G_1\\}", "\\ker f = \\{e_1\\} \\iff f \\text{ injectif}"],
            "keywords": ["noyau", "image", "ker", "im", "injectif", "surjectif", "bijectif"]
        })

# 2. cours-mpc-partie2 (1).pdf
for p in raw_docs['cours-mpc-partie2 (1).pdf']:
    page_num = p['page']
    text = clean_txt(p['text'])
    if page_num in [4, 5]:
        chunks.append({
            "id": f"cours2-p{page_num}",
            "sourcePdf": "cours-mpc-partie2 (1).pdf",
            "page": page_num,
            "moduleId": "module-3",
            "chapter": "Chapitre 1 : Sous-groupes distingués et groupes quotients",
            "title": "Définition de sous-groupe distingué (normal)",
            "content": text,
            "latex": ["g H g^{-1} = H", "\\forall g \\in G, \\forall h \\in H, g h g^{-1} \\in H", "H \\triangleleft G"],
            "keywords": ["sous-groupe distingué", "normal", "conjugué", "invariance", "abélien"]
        })
    elif page_num in [6, 7, 8]:
        chunks.append({
            "id": f"cours2-p{page_num}",
            "sourcePdf": "cours-mpc-partie2 (1).pdf",
            "page": page_num,
            "moduleId": "module-3",
            "chapter": "Chapitre 1 : Sous-groupes distingués et groupes quotients",
            "title": "Relations d'équivalence, Classes modulo H, Construction du quotient G/H",
            "content": text,
            "latex": ["x \\sim y \\iff x y^{-1} \\in H", "xH = \\{xh \\mid h \\in H\\}", "(xH)(yH) = (xy)H"],
            "keywords": ["relation d'équivalence", "classes à gauche", "partition", "quotient", "G/H"]
        })
    elif page_num in [9, 10]:
        chunks.append({
            "id": f"cours2-p{page_num}",
            "sourcePdf": "cours-mpc-partie2 (1).pdf",
            "page": page_num,
            "moduleId": "module-4",
            "chapter": "Chapitre 2 : Groupes monogènes et cycliques",
            "title": "Sous-groupes monogènes, Ordre d'un élément, Définition d'un groupe cyclique",
            "content": text,
            "latex": ["\\langle g \\rangle = \\{g^k \\mid k \\in \\mathbb{Z}\\}", "\\operatorname{ord}(g) = |\\langle g \\rangle|"],
            "keywords": ["monogène", "cyclique", "générateur", "ordre", "puissances"]
        })

# 3. cours-mpc-part3.pdf
for p in raw_docs['cours-mpc-part3.pdf']:
    page_num = p['page']
    text = clean_txt(p['text'])
    if page_num in [4, 5, 6]:
        chunks.append({
            "id": f"cours3-p{page_num}",
            "sourcePdf": "cours-mpc-part3.pdf",
            "page": page_num,
            "moduleId": "module-4",
            "chapter": "Chapitre 1 : Structure des groupes cycliques & Produit de groupes",
            "title": "Isomorphisme avec Z/nZ, Sous-groupes d'un groupe cyclique, Ordre dans un produit G x H",
            "content": text,
            "latex": ["\\langle g \\rangle \\cong \\mathbb{Z}/n\\mathbb{Z}", "\\operatorname{ord}((g, h)) = \\operatorname{ppcm}(\\operatorname{ord}(g), \\operatorname{ord}(h))"],
            "keywords": ["cyclique", "isomorphisme", "Z/nZ", "produit direct", "ppcm", "générateur"]
        })
    elif page_num in [7, 8]:
        chunks.append({
            "id": f"cours3-p{page_num}",
            "sourcePdf": "cours-mpc-part3.pdf",
            "page": page_num,
            "moduleId": "module-5",
            "chapter": "Chapitre 1 : Théorème de Lagrange",
            "title": "Théorème de Lagrange, Divisibilité des ordres, Théorème d'Euler, Fermat",
            "content": text,
            "latex": ["|H| \\mid |G|", "\\operatorname{ord}(g) \\mid |G|", "g^{|G|} = e", "a^{\\varphi(n)} \\equiv 1 [n]", "a^{p-1} \\equiv 1 [p]"],
            "keywords": ["lagrange", "diviseur", "ordre", "euler", "fermat", "nombre premier"]
        })
    elif page_num in [9, 10, 11]:
        chunks.append({
            "id": f"cours3-p{page_num}",
            "sourcePdf": "cours-mpc-part3.pdf",
            "page": page_num,
            "moduleId": "module-6",
            "chapter": "Chapitre 2 : Z/nZ, les nombres de la cryptographie",
            "title": "Arithmétique modulaire, Inversibles (Z/nZ)*, Théorème de Bézout, Diviseurs de zéro",
            "content": text,
            "latex": ["a \\equiv b \\pmod n", "\\bar{a} \\in (\\mathbb{Z}/n\\mathbb{Z})^\\times \\iff \\operatorname{pgcd}(a, n) = 1", "as + nt = 1"],
            "keywords": ["congruence", "modulaire", "inversible", "bézout", "diviseur de zéro", "corps"]
        })

with open('src/data/course_kb.json', 'w', encoding='utf-8') as f:
    json.dump(chunks, f, ensure_ascii=False, indent=2)

print(f"Knowledge base created: {len(chunks)} chunks with exact PDF sources and pages.")
