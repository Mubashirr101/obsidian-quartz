---
tags: [dsa, graphs]
aliases: [Graph Representation, Adjacency List, Adjacency Matrix]
---

# 🕸️ Graphs Representation

A graph is a set of nodes (vertices) connected by edges. Graphs model networks, relationships, maps, dependencies, essentially anything that isn't strictly hierarchical like a tree.

## Directed vs Undirected

```python
# Undirected: edge A-B means you can travel both ways
# Directed: edge A->B means you can only travel from A to B (unless B->A also exists)
```

## Weighted vs Unweighted

```python
# Unweighted: edges just represent connection, e.g. "friends with"
# Weighted: edges carry a cost/distance/capacity, e.g. "road distance between cities"
```

## Adjacency List (Most Common in Practice)

Each node maps to a list of its neighbors. Space efficient for sparse graphs.

```python
graph = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D"],
    "D": ["B", "C"],
}

# Weighted version, using (neighbor, weight) tuples
weighted_graph = {
    "A": [("B", 4), ("C", 1)],
    "B": [("A", 4), ("D", 2)],
    "C": [("A", 1), ("D", 5)],
    "D": [("B", 2), ("C", 5)],
}
```

Building from a list of edges:

```python
from collections import defaultdict

def build_graph(edges, directed=False):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        if not directed:
            graph[v].append(u)
    return graph

build_graph([("A", "B"), ("B", "C"), ("A", "C")])
```

## Adjacency Matrix

A 2D array where `matrix[i][j]` indicates an edge between node `i` and node `j`. Simple and gives O(1) edge lookup, but wastes memory on sparse graphs.

```python
n = 4     # number of nodes
matrix = [[0] * n for _ in range(n)]

def add_edge(matrix, u, v, directed=False):
    matrix[u][v] = 1
    if not directed:
        matrix[v][u] = 1

add_edge(matrix, 0, 1)
add_edge(matrix, 1, 2)
matrix[0][1]     # 1, edge exists
```

## Adjacency List vs Adjacency Matrix

| | Adjacency List | Adjacency Matrix |
|---|---|---|
| Space | O(V + E), good for sparse graphs | O(V²), wasteful if sparse |
| Check if edge (u, v) exists | O(degree of u) | O(1) |
| Iterate all neighbors of a node | O(degree of u), efficient | O(V), scans the whole row |
| Best for | Most real-world graphs (sparse) | Dense graphs, or when O(1) edge lookups matter most |

> [!tip] Default to adjacency list
> Most real-world and interview graphs are sparse (relatively few edges compared to `V²` possible ones). Adjacency lists are the right default unless you specifically need O(1) edge existence checks on a dense graph.

## Object-Oriented Graph Node (Alternative Representation)

```python
class GraphNode:
    def __init__(self, value):
        self.value = value
        self.neighbors = []

a, b, c = GraphNode("A"), GraphNode("B"), GraphNode("C")
a.neighbors = [b, c]
b.neighbors = [a]
c.neighbors = [a]
```

Common in problems that hand you a graph as literal node objects (e.g. "clone this graph") rather than as a dict/list structure.

## Trees Are Just a Special Case of Graphs

> [!info] A tree is a connected, acyclic, undirected graph
> Every tree is a graph, but not every graph is a tree. Graphs can have cycles, disconnected components, and multiple paths between two nodes, none of which are allowed in a tree. This is why graph algorithms need to explicitly track "visited" nodes, something tree traversals usually don't worry about (no cycles to loop on).

See [[Graph Traversal BFS and DFS]] for how to actually walk a graph, and [[Shortest Path Algorithms]] / [[Minimum Spanning Trees]] for weighted graph algorithms built on top of these representations.
