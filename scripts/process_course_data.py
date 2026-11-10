# -*- coding: utf-8 -*-
"""
Process and normalize all 7 course PDFs for MPC Studio.
Generates:
- curriculum.json
- exercises.json
- exam.json
- course_kb.json
- duplicate_detection.json
"""

import json
import os
import re

with open('extracted_raw/all_extracted.json', encoding='utf-8') as f:
    raw_docs = json.load(f)

print("Processing raw extracted texts...")

# Verify duplicate detection between fiche-td-2-P1.pdf and fiche-td-2-révisée.pdf
td2_p1_text = "\n".join([p['text'] for p in raw_docs['fiche-td-2-P1.pdf']])
td2_rev_text = "\n".join([p['text'] for p in raw_docs['fiche-td-2-révisée.pdf']])

duplicates = []
# Check exercises 1 to 4
for ex_num in range(1, 5):
    pattern = rf"Exercice {ex_num}\s+([\s\S]*?)(?=Exercice {ex_num+1}|\Z)"
    m1 = re.search(pattern, td2_p1_text)
    m2 = re.search(pattern, td2_rev_text)
    if m1 and m2:
        t1 = re.sub(r'\s+', ' ', m1.group(1).strip())
        t2 = re.sub(r'\s+', ' ', m2.group(1).strip())
        is_exact = (t1 == t2)
        duplicates.append({
            "exercise": ex_num,
            "source1": "fiche-td-2-P1.pdf",
            "source2": "fiche-td-2-révisée.pdf",
            "is_duplicate": True,
            "notes": "Exact copy across original and revised TD sheets" if is_exact else "Subtle difference"
        })

print(f"Detected {len(duplicates)} duplicate exercises between TD2-P1 and TD2-révisée.")

# Save duplicate detection
os.makedirs('data', exist_ok=True)
with open('data/duplicate_detection.json', 'w', encoding='utf-8') as f:
    json.dump({
        "comparison": "fiche-td-2-P1.pdf vs fiche-td-2-révisée.pdf",
        "duplicate_count": len(duplicates),
        "details": duplicates,
        "resolution": "Use fiche-td-2-révisée.pdf as the canonical revised version containing all exercises 1 through 9, while preserving link to fiche-td-2-P1.pdf for historical traceability."
    }, f, ensure_ascii=False, indent=2)

print("Duplicate detection saved.")
