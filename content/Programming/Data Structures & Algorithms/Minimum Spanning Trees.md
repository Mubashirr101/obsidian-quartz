---
tags: [dsa, graphs, mst, kruskal, prim]
aliases: [MST, Minimum Spanning Tree, Kruskal, Prim]
---

# 🌲 Minimum Spanning Trees

A Minimum Spanning Tree (MST) connects ALL nodes in a weighted, undirected graph using the minimum total edge weight, with no cycles. Think: laying the cheapest possible network of cables to connect every city.

## Kruskal's Algorithm: Edge-Centric, Uses Union-Find

Sort all edges by weight, greedily add each edge unless it would create a cycle.

```python
def kruskal(num_vertices, edges):
    # edges: list of (weight, u, v)
    edges = sorted(edges)          # sort by weight ascending

    parent = list(range(num_vertices))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]     # path compression
            x = parent[x]
        return x

    def union(x, y):
        root_x, root_y = find(x), find(y)
        if root_x == root_y:
            return False          # already connected, adding this edge would form a cycle
        parent[root_x] = root_y
        return True

    mst_weight = 0
    mst_edges = []
    for weight, u, v in edges:
        if union(u, v):              # only add if it connects two SEPARATE components
            mst_weight += weight
            mst_edges.append((u, v, weight))

    return mst_weight, mst_edges

edges = [(1, 0, 1), (4, 0, 2), (2, 1, 2), (5, 1, 3), (3, 2, 3)]
kruskal(4, edges)
```

O(E log E) time, dominated by the initial sort. See [[Union Find Disjoint Set]] for the `find`/`union` mechanics in depth.

## Prim's Algorithm: Node-Centric, Uses a Heap

Grows the MST one node at a time, always adding the cheapest edge that connects a NEW node to the tree being built.

```python
import heapq

def prim(graph, start):
    # graph: {node: [(neighbor, weight), ...]}
    visited = {start}
    edges = [(weight, start, neighbor) for neighbor, weight in graph[start]]
    heapq.heapify(edges)

    mst_weight = 0
    mst_edges = []

    while edges and len(visited) < len(graph):
        weight, u, v = heapq.heappop(edges)
        if v in visited:
            continue                # would create a cycle, skip
        visited.add(v)
        mst_weight += weight
        mst_edges.append((u, v, weight))
        for neighbor, w in graph[v]:
            if neighbor not in visited:
                heapq.heappush(edges, (w, v, neighbor))

    return mst_weight, mst_edges
```

O(E log V) time with a binary heap.

## Kruskal vs Prim

| | Kruskal | Prim |
|---|---|---|
| Approach | Sort ALL edges, add if no cycle | Grow outward from a starting node |
| Data structure | Union-Find | Min-heap |
| Best for | Sparse graphs (fewer edges) | Dense graphs (more edges relative to nodes) |
| Naturally handles disconnected graphs | Yes, produces a minimum spanning FOREST | No, assumes the graph is connected |

> [!tip] Both are greedy and both are provably correct
> It's a genuinely elegant result in graph theory: always taking the locally cheapest safe edge (however you define "safe" and "next") always produces a GLOBALLY minimum spanning tree. Few greedy algorithms come with such a clean correctness guarantee.

## Real-World Applications

> [!example] Where MSTs actually show up
> Network design (minimum cable/pipe to connect all locations), circuit design, clustering algorithms (removing the most expensive edges from an MST naturally separates data into clusters), and approximation algorithms for harder problems like the traveling salesman problem.
