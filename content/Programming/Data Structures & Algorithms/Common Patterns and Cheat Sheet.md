---
tags: [dsa, cheat-sheet, patterns]
aliases: [DSA Cheat Sheet, DSA Patterns, Problem Solving Patterns]
---

# 🃏 Common Patterns and Cheat Sheet

A fast-lookup reference for matching a problem's shape to the right technique, without re-reading every individual note.

## Pattern Recognition Table

| If the problem involves... | Reach for... | See |
|---|---|---|
| A sorted array, pair/triplet sums | Two pointers | [[Two Pointers Technique]] |
| A contiguous subarray/substring, "longest/shortest/max sum of size k" | Sliding window | [[Sliding Window Technique]] |
| Exact match lookup, counting, grouping by a key | Hash table | [[Hash Tables and Maps]] |
| "Next greater/smaller element" | Monotonic stack | [[Stacks]] |
| Repeatedly need the min/max, "top k", "kth largest" | Heap | [[Heaps and Priority Queues]] |
| Prefix matching, autocomplete, word validity | Trie | [[Tries]] |
| Shortest path, unweighted graph | BFS | [[Graph Traversal BFS and DFS]] |
| Shortest path, weighted graph, no negatives | Dijkstra | [[Shortest Path Algorithms]] |
| All possible combinations/permutations/arrangements | Backtracking | [[Recursion and Backtracking]] |
| "Minimum/maximum X", overlapping subproblems | Dynamic Programming | [[Dynamic Programming]] |
| A local-best choice provably leads to a global best | Greedy | [[Greedy Algorithms]] |
| "Are these connected?", incremental merging | Union-Find | [[Union Find Disjoint Set]] |
| Powers of 2, unique/missing number, O(1) space tricks | Bit manipulation | [[Bit Manipulation]] |
| Sorted data, "find X" or "boundary where condition flips" | Binary search | [[Searching Algorithms]] |
| Connecting all nodes at minimum total cost | MST (Kruskal/Prim) | [[Minimum Spanning Trees]] |

## Python-Specific Cheat Sheet

```python
# Sorting with custom keys
sorted(data, key=lambda x: x[1], reverse=True)

# Fast membership testing
seen = set()

# Counting frequencies
from collections import Counter
counts = Counter(items)

# Default values without KeyError
from collections import defaultdict
groups = defaultdict(list)

# Efficient queue (O(1) both ends)
from collections import deque
queue = deque()

# Priority queue / heap
import heapq
heapq.heappush(heap, item)
heapq.heappop(heap)

# Memoization
from functools import lru_cache

@lru_cache(maxsize=None)
def solve(state):
    ...

# Binary search on sorted data
import bisect
bisect.bisect_left(arr, target)

# Infinity as a sentinel for min/max initialization
best = float("inf")     # or float("-inf") for maximum-tracking
```

## Complexity Quick Reference

| Complexity | Rough input size it can handle in ~1 second |
|---|---|
| O(log n) | Any size, essentially instant |
| O(n) | Up to ~10⁸ |
| O(n log n) | Up to ~10⁶-10⁷ |
| O(n²) | Up to ~10⁴ |
| O(n³) | Up to ~500 |
| O(2ⁿ) | Up to ~20-25 |
| O(n!) | Up to ~10-11 |

> [!tip] Use constraint sizes to reverse-engineer the intended approach
> If a problem states `n <= 10^5`, an O(n²) solution will likely time out, an O(n log n) approach is probably expected. If `n <= 20`, an exponential bitmask/backtracking solution is probably FINE and even intended. Reading the constraints first is one of the fastest ways to narrow down which pattern applies.

## General Problem-Solving Checklist

> [!tip] Before writing any code
> 1. Restate the problem in your own words, identify inputs, outputs, and constraints.
> 2. Work through a small example by hand.
> 3. Identify the brute-force approach first, even if it's slow, it clarifies correctness.
> 4. Ask: is there repeated work being wasted? -> DP or memoization.
> 5. Ask: is the data sorted, or could it be? -> two pointers or binary search.
> 6. Ask: do I need the min/max repeatedly? -> heap.
> 7. Ask: do I need fast existence/frequency checks? -> hash table.
> 8. Estimate complexity against the given constraints BEFORE fully coding the solution.

## Full Index

See [[DSA in Python]] for the complete list of notes in this folder, organized by category.
