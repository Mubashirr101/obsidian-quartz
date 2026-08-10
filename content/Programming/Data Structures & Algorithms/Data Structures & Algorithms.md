---
tags: [dsa, python, lore, algorithms, data-structures]
aliases: [DSA, Data Structures and Algorithms]
created: 2026-08-09
---

# 🧠 DSA in Python

This is the home note for Data Structures and Algorithms in Python. Every note below lives flat in this same folder, no sub-folders, so everything is one click away from the Obsidian search bar.

> [!info] How to use this folder
> Start with complexity analysis if you need a refresher on Big O, then move into data structures before tackling algorithm families like sorting, searching, and dynamic programming. Technique notes (two pointers, sliding window) are where a lot of interview-style problems actually get solved fast.

## Foundations
- [[Big O and Complexity Analysis]]

## Linear Data Structures
- [[Arrays and Lists]]
- [[String Algorithms]]
- [[Linked Lists]]
- [[Stacks]]
- [[Queues and Deques]]

## Hash-Based and Tree Structures
- [[Hash Tables and Maps]]
- [[Binary Trees]]
- [[Binary Search Trees]]
- [[Heaps and Priority Queues]]
- [[Tries]]

## Graphs
- [[Graphs Representation]]
- [[Graph Traversal BFS and DFS]]
- [[Shortest Path Algorithms]]
- [[Minimum Spanning Trees]]

## Core Algorithms
- [[Sorting Algorithms]]
- [[Searching Algorithms]]
- [[Recursion and Backtracking]]
- [[Dynamic Programming]]
- [[Greedy Algorithms]]

## Problem-Solving Techniques
- [[Two Pointers Technique]]
- [[Sliding Window Technique]]
- [[Union Find Disjoint Set]]
- [[Bit Manipulation]]

## Reference
- [[Common Patterns and Cheat Sheet]]

---

## Quick Complexity Cheat Sheet

| Structure / Algorithm | Access | Search | Insert | Delete |
|---|---|---|---|---|
| Array / List | O(1) | O(n) | O(n) | O(n) |
| Linked List | O(n) | O(n) | O(1)* | O(1)* |
| Hash Table | N/A | O(1) avg | O(1) avg | O(1) avg |
| BST (balanced) | O(log n) | O(log n) | O(log n) | O(log n) |
| Heap | O(1) top | O(n) | O(log n) | O(log n) |

*O(1) at a known node/position, O(n) if you must search for it first.

> [!tip] Related Folders
> The core `Python` folder covers language mechanics (loops, functions, OOP). This folder assumes that foundation and focuses purely on problem-solving structures and algorithms built on top of it.
