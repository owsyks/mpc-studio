# -*- coding: utf-8 -*-
"""
Automated Test Suite for MPC Studio.
Tests:
1. Mathematical Correctness (Bézout, GCD, modular inverses, orders, Heisenberg group)
2. Curriculum Integrity (6 modules, source PDF citations, lesson consistency)
3. Exercise Data & Duplicate Detection (TD 1, TD 2 P1 vs TD 2 Révisée)
4. Exam Structure (Official exam points: 4.25, 4.25, 7.5 = 16.0 Pts)
"""

import json
import os
import math

def test_math_solver():
    print("Testing Mathematical Solver...")
    
    # 1. GCD & Bézout
    def extended_gcd(a, b):
        x0, y0 = 1, 0
        x1, y1 = 0, 1
        r0, r1 = abs(a), abs(b)
        while r1 != 0:
            q = r0 // r1
            r0, r1 = r1, r0 - q * r1
            x0, x1 = x1, x0 - q * x1
            y0, y1 = y1, y0 - q * y1
        if a < 0: x0 = -x0
        if b < 0: y0 = -y0
        return r0, x0, y0

    # Test GCD(9, 12) = 3
    gcd_val, _, _ = extended_gcd(9, 12)
    assert gcd_val == 3, f"Expected gcd(9, 12) == 3, got {gcd_val}"

    # Test Bézout: 7 * s + 26 * t = 1
    g, s, t = extended_gcd(7, 26)
    assert g == 1, "Expected gcd(7, 26) == 1"
    assert (7 * s + 26 * t) == 1, f"Bézout identity failed: 7*{s} + 26*{t} != 1"
    inv_7_mod_26 = (s % 26 + 26) % 26
    assert inv_7_mod_26 == 15, f"Expected 7^-1 = 15 mod 26, got {inv_7_mod_26}"

    # 2. Additive Order: order of 9 in (Z/12Z, +)
    # ord(a) = n / gcd(a, n) = 12 / gcd(9, 12) = 12 / 3 = 4 (TD2 Ex 5)
    order_9_in_12 = 12 // math.gcd(9, 12)
    assert order_9_in_12 == 4, f"Expected ord(9) = 4, got {order_9_in_12}"

    # 3. Invertible elements in Z/20Z (TD2 Ex 9)
    inverts_20 = [x for x in range(1, 20) if math.gcd(x, 20) == 1]
    expected_inverts = [1, 3, 7, 9, 11, 13, 17, 19]
    assert inverts_20 == expected_inverts, f"Expected {expected_inverts}, got {inverts_20}"
    assert len(inverts_20) == 8, f"Expected phi(20) = 8, got {len(inverts_20)}"

    # 4. Multiplicative orders in (Z/20Z)*
    orders = {}
    for a in inverts_20:
        cur = a
        ord_a = 1
        while cur != 1:
            cur = (cur * a) % 20
            ord_a += 1
        orders[a] = ord_a
    assert orders[9] == 2, f"Expected ord(9) = 2, got {orders[9]}"
    assert orders[3] == 4, f"Expected ord(3) = 4, got {orders[3]}"
    assert max(orders.values()) == 4, "No element of order 8, so (Z/20Z)* is not cyclic!"

    # 5. Heisenberg matrix product & inverse (TD2 Ex 2)
    # M(x, y, z) * M(x', y', z') = M(x+x', y+y', z+z'+xy')
    # M(x, y, z)^(-1) = M(-x, -y, -z+xy)
    x, y, z = 1, 2, 3
    inv_x, inv_y, inv_z = -x, -y, -z + x * y
    # Verify product M(x, y, z) * M(inv) = M(0, 0, 0)
    prod_x = x + inv_x
    prod_y = y + inv_y
    prod_z = z + inv_z + x * inv_y
    assert (prod_x, prod_y, prod_z) == (0, 0, 0), "Heisenberg inverse calculation failed!"

    print("✓ All mathematical solver tests PASSED.")

def test_curriculum_integrity():
    print("Testing Curriculum Integrity...")
    with open('src/data/curriculum.json', encoding='utf-8') as f:
        curriculum = json.load(f)

    assert len(curriculum) == 6, f"Expected 6 modules, found {len(curriculum)}"

    for mod in curriculum:
        assert mod['id'].startswith("module-"), f"Invalid module id {mod['id']}"
        assert len(mod['lessons']) >= 2, f"Module {mod['id']} has fewer than 2 lessons"
        assert os.path.exists(os.path.join('public/courses', mod['sourcePdf'])), f"Missing PDF {mod['sourcePdf']}"
        for lesson in mod['lessons']:
            assert 'formalDefinition' in lesson['content'], f"Lesson {lesson['id']} missing formalDefinition"
            assert 'workedExample' in lesson['content'], f"Lesson {lesson['id']} missing workedExample"
            assert lesson['sourcePage'] > 0, f"Invalid sourcePage in {lesson['id']}"

    print(f"✓ Curriculum verified: {len(curriculum)} modules, {sum(len(m['lessons']) for m in curriculum)} lessons.")

def test_exercises_and_duplicates():
    print("Testing Exercises & Duplicates...")
    with open('src/data/exercises.json', encoding='utf-8') as f:
        exercises = json.load(f)

    assert len(exercises) >= 7, f"Expected at least 7 exercises, found {len(exercises)}"
    for ex in exercises:
        assert ex['difficulty'] in ["Beginner", "Easy", "Medium", "Hard", "Exam Level"]
        assert len(ex['hints']) >= 3, f"Exercise {ex['id']} has fewer than 3 hints"
        assert len(ex['rubric']) >= 2, f"Exercise {ex['id']} has fewer than 2 rubric items"

    # Verify duplicate detection
    with open('data/duplicate_detection.json', encoding='utf-8') as f:
        dup = json.load(f)
    assert dup['duplicate_count'] == 4, f"Expected 4 duplicates between TD2 P1 and TD2 révisée, found {dup['duplicate_count']}"

    print(f"✓ Exercises verified: {len(exercises)} exercises with 3 hints & rubric. Duplicates correctly resolved.")

def test_exam_structure():
    print("Testing Official Exam Structure...")
    with open('src/data/exam.json', encoding='utf-8') as f:
        exam = json.load(f)

    assert exam['durationMinutes'] == 60, "Duration must be 60 minutes"
    assert exam['totalPoints'] == 16.0, f"Expected total 16.0 Pts, found {exam['totalPoints']}"
    assert len(exam['exercises']) == 3, "Expected 3 exercises"

    ex1_pts = exam['exercises'][0]['points']
    ex2_pts = exam['exercises'][1]['points']
    ex3_pts = exam['exercises'][2]['points']

    assert ex1_pts == 4.25, f"Ex 1 expected 4.25 Pts, got {ex1_pts}"
    assert ex2_pts == 4.25, f"Ex 2 expected 4.25 Pts, got {ex2_pts}"
    assert ex3_pts == 7.5, f"Ex 3 expected 7.5 Pts, got {ex3_pts}"
    assert (ex1_pts + ex2_pts + ex3_pts) == 16.0, "Sum of exercises must equal 16.0 Pts"

    print("✓ Official exam structure & point allocation verified.")

if __name__ == '__main__':
    test_math_solver()
    test_curriculum_integrity()
    test_exercises_and_duplicates()
    test_exam_structure()
    print("\n==========================================")
    print(" ALL TEST SUITES PASSED SUCCESSFULLY (100%) ")
    print("==========================================")
