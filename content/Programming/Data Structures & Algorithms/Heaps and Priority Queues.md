---
tags: [dsa, heaps, priority-queue, heapq]
aliases: [Heap, Min Heap, Max Heap, heapq]
---

# ⛰️ Heaps and Priority Queues

A heap is a complete binary tree stored in an array, satisfying the heap property: in a MIN-heap, every parent is smaller than or equal to its children (the opposite for a MAX-heap). This guarantees O(1) access to the smallest (or largest) element and O(log n) insert/remove.

## Python's `heapq`: Min-Heap Only

```python
import heapq

heap = []
heapq.heappush(heap, 5)      # O(log n)
heapq.heappush(heap, 2)
heapq.heappush(heap, 8)
heapq.heappush(heap, 1)

heap[0]              # 1, the smallest element is ALWAYS at index 0, O(1) peek
heapq.heappop(heap)     # 1, removes and returns the smallest, O(log n)
```

> [!warning] `heapq` only provides a MIN-heap
> There is no built-in max-heap in Python. The standard workaround is negating values on the way in and out.

```python
max_heap = []
for val in [5, 2, 8, 1]:
    heapq.heappush(max_heap, -val)     # negate on insert

-heapq.heappop(max_heap)     # 8, negate again on removal to get the true max
```

## Building a Heap from an Existing List

```python
nums = [5, 2, 8, 1, 9, 3]
heapq.heapify(nums)     # O(n), reorders IN PLACE into valid heap structure, faster than n pushes
nums[0]                    # 1, the minimum, immediately accessible
```

> [!tip] `heapify` is O(n), not O(n log n)
> Pushing `n` elements one at a time costs O(n log n) total. Calling `heapq.heapify()` on an existing list restructures it in O(n), a genuinely different (and better) complexity class, worth using whenever you have all the data upfront.

## Finding the K Largest/Smallest Elements

```python
heapq.nlargest(3, [5, 2, 8, 1, 9, 3])       # [9, 8, 5]
heapq.nsmallest(3, [5, 2, 8, 1, 9, 3])         # [1, 2, 3]

heapq.nlargest(2, people, key=lambda p: p["age"])     # supports a key function, like sorted()
```

## Priority Queue with Custom Priority

Pair each item with a priority value in a tuple; `heapq` compares tuples element by element.

```python
import heapq

tasks = []
heapq.heappush(tasks, (3, "low priority task"))
heapq.heappush(tasks, (1, "high priority task"))
heapq.heappush(tasks, (2, "medium priority task"))

heapq.heappop(tasks)     # (1, 'high priority task'), lowest number = served first
```

> [!warning] Tuple comparison falls through to the second element on ties
> If two tasks share the same priority, Python tries to compare the SECOND tuple element (the task description) to break the tie, this can crash with a `TypeError` if that second element isn't directly comparable (e.g. comparing two dicts). Fix by adding a unique tiebreaker, commonly an insertion counter.

```python
import itertools

counter = itertools.count()      # unique, ever-increasing tiebreaker
heapq.heappush(tasks, (2, next(counter), {"task": "data"}))     # safe even with unorderable payloads
```

## Classic Heap Problems

### Kth Largest Element in a Stream

```python
class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.heap = nums
        heapq.heapify(self.heap)
        while len(self.heap) > k:
            heapq.heappop(self.heap)     # keep only the k largest, smallest at the top

    def add(self, val):
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]     # top of a size-k min-heap is the kth largest overall
```

### Merging K Sorted Lists

```python
def merge_k_sorted(lists):
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))     # (value, list_index, element_index)

    result = []
    while heap:
        val, list_idx, elem_idx = heapq.heappop(heap)
        result.append(val)
        if elem_idx + 1 < len(lists[list_idx]):
            next_val = lists[list_idx][elem_idx + 1]
            heapq.heappush(heap, (next_val, list_idx, elem_idx + 1))
    return result     # O(n log k), where n is total elements and k is number of lists
```

## Heap vs Sorted List vs BST

| Need | Best fit |
|---|---|
| Repeatedly grab the min/max, order otherwise doesn't matter | Heap, O(log n) push/pop |
| Full sorted order needed at any time | Sorted structure (BST or `sortedcontainers`) |
| One-time full sort | `sorted()`, O(n log n), simplest |

> [!tip] Recognizing heap problems
> "Top k", "kth largest/smallest", "merge k sorted things", and "find the median of a stream" are strong signals to reach for a heap, they all revolve around repeatedly needing the extreme value from a changing collection.
