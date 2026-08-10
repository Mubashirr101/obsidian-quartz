---
tags: [dsa, union-find, disjoint-set]
aliases: [Union Find, Disjoint Set Union, DSU]
---

# 🧩 Union Find (Disjoint Set)

Union-Find (also called Disjoint Set Union, DSU) efficiently tracks a collection of elements partitioned into non-overlapping groups, answering "are these two elements in the same group?" and "merge these two groups" both in nearly O(1) time.

## Basic Implementation

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))     # each element starts as its own group's representative
        self.rank = [0] * n                 # tracks approximate tree height, for union by rank

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])     # path compression: flatten the tree as we go
        return self.parent[x]

    def union(self, x, y):
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False          # already in the same group

        if self.rank[root_x] < self.rank[root_y]:           # union by rank: attach smaller tree under bigger
            root_x, root_y = root_y, root_x
        self.parent[root_y] = root_x
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        return True

    def connected(self, x, y):
        return self.find(x) == self.find(y)
```

## Why Path Compression and Union by Rank Matter

> [!tip] Two optimizations that make Union-Find nearly O(1)
> - **Path compression**: every time `find()` is called, it re-points nodes directly to the root, flattening future lookups.
> - **Union by rank**: always attaches the SHORTER tree under the taller one, preventing the structure from becoming a long, inefficient chain.
> Combined, both operations run in O(α(n)) amortized time, where α is the inverse Ackermann function, effectively constant for any input size that could ever exist in practice.

## Connected Components in a Graph

```python
def count_components(n, edges):
    uf = UnionFind(n)
    components = n
    for u, v in edges:
        if uf.union(u, v):
            components -= 1          # successful merge means two groups became one
    return components

count_components(5, [(0, 1), (1, 2), (3, 4)])     # 2, groups {0,1,2} and {3,4}
```

Compare with the DFS-based approach in [[Graph Traversal BFS and DFS]], Union-Find is often simpler and faster for problems that ONLY care about connectivity, not the actual path or shape of components.

## Cycle Detection in an Undirected Graph (Alternative to DFS)

```python
def has_cycle(n, edges):
    uf = UnionFind(n)
    for u, v in edges:
        if not uf.union(u, v):     # union() returns False if u and v were ALREADY connected
            return True               # adding this edge would create a cycle
    return False
```

## Kruskal's MST Algorithm (Already Covered, Cross-Referenced)

Union-Find is the core data structure behind Kruskal's algorithm, see [[Minimum Spanning Trees]] for the full implementation. The pattern is identical: sort edges, try to union each pair, skip if already connected.

## Number of Islands (Grid-Based Union-Find)

```python
def num_islands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    uf = UnionFind(rows * cols)
    water_count = 0

    def index(r, c):
        return r * cols + c

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "0":
                water_count += 1
                continue
            for dr, dc in [(0, 1), (1, 0)]:      # only check right and down, avoids double-processing
                nr, nc = r + dr, c + dc
                if nr < rows and nc < cols and grid[nr][nc] == "1":
                    uf.union(index(r, c), index(nr, nc))

    land_roots = {uf.find(index(r, c)) for r in range(rows) for c in range(cols) if grid[r][c] == "1"}
    return len(land_roots)
```

> [!tip] Union-Find vs BFS/DFS for grid connectivity problems
> Both work for "number of islands" style problems. BFS/DFS is usually simpler to write for a ONE-TIME connectivity check. Union-Find shines when connections are added INCREMENTALLY over time (e.g. "process these edges/unions in order, report connectivity after each one"), since re-running BFS/DFS from scratch after every update would be far more expensive.

## Complexity Summary

| Operation | Time (amortized) |
|---|---|
| `find(x)` | O(α(n)), effectively O(1) |
| `union(x, y)` | O(α(n)), effectively O(1) |
| Building from n elements | O(n) |

## Recognizing Union-Find Problems

> [!tip] Signals to watch for
> - "Are these two things connected/in the same group?"
> - Incrementally merging groups over a sequence of operations.
> - Detecting cycles while building a graph edge by edge.
> - Grouping accounts, friends, or entities based on shared properties (classic "accounts merge" style problems).
