---
tags: [dsa, queues, deque]
aliases: [Queue, FIFO, Deque, Priority Queue]
---

# 🚶 Queues and Deques

A queue is a First-In-First-Out (FIFO) structure: the first item added is the first removed. Think of a line at a checkout counter.

## Why NOT to Use a Plain List as a Queue

```python
queue = []
queue.append(1)
queue.append(2)
queue.pop(0)     # O(n)! removing from the front of a list shifts every remaining element
```

## `collections.deque`: The Correct Tool

`deque` (double-ended queue) gives O(1) operations at BOTH ends.

```python
from collections import deque

q = deque()
q.append(1)         # add to the right, O(1)
q.append(2)
q.appendleft(0)         # add to the left, O(1)
q.popleft()                 # remove from the left, O(1), classic FIFO dequeue
q.pop()                        # remove from the right, O(1)
q.extend([3, 4])                  # add multiple to the right
q.extendleft([-1, -2])                # add multiple to the left, NOTE: reverses their order
```

## Using `deque` as a Stack Too

```python
stack = deque()
stack.append(1)      # push
stack.pop()             # pop, both O(1), deque works fine as a stack alternative to list
```

## `deque` for Sliding Window Maximum

```python
from collections import deque

def sliding_window_max(nums, k):
    dq = deque()          # stores INDICES, values kept in decreasing order
    result = []
    for i, num in enumerate(nums):
        while dq and nums[dq[-1]] < num:
            dq.pop()                       # remove smaller values, they can never be the max now
        dq.append(i)
        if dq[0] <= i - k:                    # remove index that's fallen out of the window
            dq.popleft()
        if i >= k - 1:
            result.append(nums[dq[0]])           # front of deque is always the current max
    return result

sliding_window_max([1, 3, -1, -3, 5, 3, 6, 7], 3)     # [3, 3, 5, 5, 6, 7]
```

O(n) overall, each element is pushed and popped from the deque at most once. See [[Sliding Window Technique]].

## Using `deque` for BFS

```python
from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()      # O(1), the whole reason deque beats list here
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order
```

See [[Graph Traversal BFS and DFS]].

## Priority Queue with `heapq`

A priority queue serves elements by priority rather than arrival order. Python's `heapq` module implements a min-heap directly on top of a list.

```python
import heapq

pq = []
heapq.heappush(pq, (2, "task B"))       # (priority, item) tuples, LOWER number = higher priority
heapq.heappush(pq, (1, "task A"))
heapq.heappush(pq, (3, "task C"))

heapq.heappop(pq)     # (1, 'task A'), always returns the SMALLEST priority first
```

See [[Heaps and Priority Queues]] for the full heap breakdown, including simulating a max-heap.

## Circular Queue (Fixed-Size Buffer)

```python
class CircularQueue:
    def __init__(self, capacity):
        self.queue = [None] * capacity
        self.capacity = capacity
        self.head = 0
        self.size = 0

    def enqueue(self, value):
        if self.size == self.capacity:
            raise OverflowError("Queue is full")
        tail = (self.head + self.size) % self.capacity
        self.queue[tail] = value
        self.size += 1

    def dequeue(self):
        if self.size == 0:
            raise IndexError("Queue is empty")
        value = self.queue[self.head]
        self.head = (self.head + 1) % self.capacity
        self.size -= 1
        return value
```

> [!tip] Bounded buffers show up in real systems
> Circular queues (ring buffers) are the backbone of producer-consumer pipelines, streaming buffers, and OS-level scheduling, worth understanding conceptually even outside interview contexts.
