---
tags: [dsa, graphs, shortest-path, dijkstra]
aliases: [Dijkstra, Shortest Path, Bellman-Ford]
---

# 🛣️ Shortest Path Algorithms

BFS finds shortest paths in UNWEIGHTED graphs (see [[Graph Traversal BFS and DFS]]). When edges have different costs/weights, dedicated algorithms are needed.

## Dijkstra's Algorithm: Non-Negative Weights

Greedily always expands the closest unvisited node next, using a min-heap (see [[Heaps and Priority Queues]]) to efficiently find that closest node each step.

```python
import heapq

def dijkstra(graph, start):
    # graph: {node: [(neighbor, weight), ...]}
    distances = {node: float("inf") for node in graph}
    distances[start] = 0
    pq = [(0, start)]          # (distance, node)

    while pq:
        current_dist, node = heapq.heappop(pq)
        if current_dist > distances[node]:
            continue              # stale entry, a shorter path was already found and processed
        for neighbor, weight in graph[node]:
            distance = current_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))

    return distances

graph = {
    "A": [("B", 4), ("C", 1)],
    "B": [("A", 4), ("D", 1)],
    "C": [("A", 1), ("D", 5), ("B", 2)],
    "D": [("B", 1), ("C", 5)],
}
dijkstra(graph, "A")     # {'A': 0, 'B': 3, 'C': 1, 'D': 4}
```

Time complexity: O((V + E) log V) with a binary heap.

> [!warning] Dijkstra breaks with negative edge weights
> The greedy "always expand the closest node" assumption relies on distances only ever increasing as you go further. A negative edge can make a longer-looking path actually shorter, and Dijkstra has no mechanism to revisit and correct an already-finalized node. Use Bellman-Ford instead when negative weights are possible.

## Bellman-Ford: Handles Negative Weights

Relaxes every edge, `V - 1` times. Slower than Dijkstra but tolerates negative weights and can DETECT negative cycles.

```python
def bellman_ford(edges, num_vertices, start):
    # edges: list of (u, v, weight)
    distances = [float("inf")] * num_vertices
    distances[start] = 0

    for _ in range(num_vertices - 1):
        for u, v, weight in edges:
            if distances[u] != float("inf") and distances[u] + weight < distances[v]:
                distances[v] = distances[u] + weight

    # one extra pass: if anything STILL improves, there's a negative cycle
    for u, v, weight in edges:
        if distances[u] != float("inf") and distances[u] + weight < distances[v]:
            raise ValueError("Graph contains a negative weight cycle")

    return distances
```

Time complexity: O(V * E), notably worse than Dijkstra, but the tradeoff buys correctness with negative weights.

## Floyd-Warshall: All-Pairs Shortest Paths

Finds the shortest path between EVERY pair of nodes at once, using dynamic programming over intermediate nodes.

```python
def floyd_warshall(num_vertices, edges):
    INF = float("inf")
    dist = [[INF] * num_vertices for _ in range(num_vertices)]
    for i in range(num_vertices):
        dist[i][i] = 0
    for u, v, weight in edges:
        dist[u][v] = weight

    for k in range(num_vertices):              # try each node as an intermediate stop
        for i in range(num_vertices):
            for j in range(num_vertices):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]

    return dist     # O(V³) time, but computes ALL pairs at once
```

## Choosing the Right Algorithm

| Situation | Algorithm | Complexity |
|---|---|---|
| Unweighted graph | BFS | O(V + E) |
| Weighted, non-negative | Dijkstra | O((V + E) log V) |
| Weighted, negative edges allowed | Bellman-Ford | O(V * E) |
| Need shortest path between ALL pairs | Floyd-Warshall | O(V³) |
| DAG (directed acyclic graph) | Topological sort + relax edges in order | O(V + E), fastest option when applicable |

## Shortest Path on a DAG (Fast Special Case)

```python
def shortest_path_dag(graph, start, topo_order):
    distances = {node: float("inf") for node in graph}
    distances[start] = 0
    for node in topo_order:                # process nodes in topological order
        if distances[node] != float("inf"):
            for neighbor, weight in graph[node]:
                if distances[node] + weight < distances[neighbor]:
                    distances[neighbor] = distances[node] + weight
    return distances
```

> [!tip] Recognize the graph shape before picking an algorithm
> The single biggest efficiency win in shortest-path problems is noticing when the graph is unweighted (use BFS, don't overcomplicate with Dijkstra) or a DAG (use topological sort, don't reach for Dijkstra or Bellman-Ford at all).
