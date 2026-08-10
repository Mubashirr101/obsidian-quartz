---
tags: [dsa, graphs, bfs, dfs]
aliases: [BFS, DFS, Breadth First Search, Depth First Search]
---

# 🧭 Graph Traversal: BFS and DFS

The two fundamental ways to systematically visit every reachable node in a graph. Both are O(V + E) time. The difference is entirely in the ORDER they explore, which comes down to the data structure used: a queue for BFS, a stack (or recursion) for DFS.

## Breadth-First Search (BFS): Explores Level by Level

Uses a queue. Visits all neighbors of the current node before moving further out, guaranteeing the SHORTEST path (in terms of edge count) is found first in an unweighted graph.

```python
from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()      # FIFO: process in the order discovered
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)      # mark visited when ENQUEUED, not when dequeued
                queue.append(neighbor)
    return order
```

> [!warning] Mark visited when adding to the queue, not when processing
> Marking visited only at dequeue time can cause the SAME node to be added to the queue multiple times before it's ever processed, wasting work and, in some graph shapes, causing incorrect behavior. Mark it the moment you enqueue it.

## Depth-First Search (DFS): Explores as Deep as Possible First

Uses a stack (explicit, or implicitly via recursion). Dives down one path fully before backtracking.

```python
def dfs_recursive(graph, node, visited=None, order=None):
    if visited is None:
        visited = set()
        order = []
    visited.add(node)
    order.append(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited, order)
    return order
```

```python
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    order = []
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            order.append(node)
            for neighbor in graph[node]:
                if neighbor not in visited:
                    stack.append(neighbor)
    return order
```

## BFS vs DFS: When to Use Which

| Need | Use |
|---|---|
| Shortest path in an unweighted graph | BFS |
| Just need to visit everything reachable | Either, DFS often simpler with recursion |
| Detecting cycles | Either, DFS is more common |
| Exploring all paths / backtracking-style problems | DFS |
| Level-by-level processing (e.g. tree level order) | BFS |
| Memory is a concern on a very wide, shallow graph | DFS, avoids storing an entire wide "frontier" at once |
| Memory is a concern on a very deep, narrow graph | BFS, avoids deep recursion / call stack depth limits |

## Finding Shortest Path with BFS

```python
def shortest_path(graph, start, target):
    if start == target:
        return [start]
    visited = {start}
    queue = deque([[start]])         # queue of PATHS, not just nodes
    while queue:
        path = queue.popleft()
        node = path[-1]
        for neighbor in graph[node]:
            if neighbor == target:
                return path + [neighbor]
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(path + [neighbor])
    return None     # no path exists
```

## Detecting a Cycle in an Undirected Graph

```python
def has_cycle_undirected(graph):
    visited = set()

    def dfs(node, parent):
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                if dfs(neighbor, node):
                    return True
            elif neighbor != parent:      # visited neighbor that ISN'T where we came from = cycle
                return True
        return False

    for node in graph:
        if node not in visited:
            if dfs(node, None):
                return True
    return False
```

## Detecting a Cycle in a Directed Graph

Requires tracking the current recursion path, not just overall visited status, since revisiting an ALREADY FULLY EXPLORED node (not currently on the path) is fine in a directed graph.

```python
def has_cycle_directed(graph):
    visited = set()
    in_path = set()          # nodes currently on the active recursion stack

    def dfs(node):
        visited.add(node)
        in_path.add(node)
        for neighbor in graph[node]:
            if neighbor in in_path:
                return True                 # back edge to an ancestor = cycle
            if neighbor not in visited:
                if dfs(neighbor):
                    return True
        in_path.remove(node)         # backtrack: no longer on the current path
        return False

    for node in graph:
        if node not in visited:
            if dfs(node):
                return True
    return False
```

## Connected Components

```python
def count_components(graph, nodes):
    visited = set()
    count = 0
    for node in nodes:
        if node not in visited:
            dfs_recursive(graph, node, visited, [])     # reuse dfs, just care about coverage here
            count += 1
    return count
```

See [[Shortest Path Algorithms]] for weighted-graph shortest paths (BFS only handles unweighted), and [[Union Find Disjoint Set]] for an alternative, often faster way to handle connected components.
