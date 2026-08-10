---
tags: [dsa, searching, binary-search]
aliases: [Binary Search, Linear Search, Searching Algorithms]
---

# 🎯 Searching Algorithms

## Linear Search

Checks every element one by one. Works on unsorted data, O(n) time.

```python
def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1
```

## Binary Search: Requires Sorted Data

Repeatedly halves the search space by comparing against the middle element. O(log n) time.

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1          # target is in the RIGHT half
        else:
            right = mid - 1            # target is in the LEFT half
    return -1

binary_search([1, 3, 5, 7, 9, 11], 7)     # 3
```

> [!warning] Binary search REQUIRES sorted input
> Running binary search on unsorted data gives meaningless, silently wrong results, it will not raise an error, it will just return incorrect answers. Always confirm sortedness before reaching for binary search.

## Recursive Binary Search

```python
def binary_search_recursive(arr, target, left=0, right=None):
    if right is None:
        right = len(arr) - 1
    if left > right:
        return -1
    mid = (left + right) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)
```

## Python's Built-in `bisect` Module

Provides fast binary search operations without writing the loop yourself.

```python
import bisect

arr = [1, 3, 5, 7, 9]
bisect.bisect_left(arr, 5)      # 2, leftmost position where 5 could be inserted to keep it sorted
bisect.bisect_right(arr, 5)        # 3, rightmost such position
bisect.insort(arr, 6)                 # inserts 6 in the correct sorted position, O(n) due to the shift
```

> [!tip] `bisect` for "find insertion point" problems
> Any problem asking "where would this value fit in a sorted list" or "find the first element >= X" maps directly onto `bisect_left`/`bisect_right`, no need to hand-write binary search for these.

## Binary Search on the ANSWER (A Powerful Pattern)

Binary search doesn't require an explicit sorted array, it works on ANY monotonic condition (a "yes/no" that flips exactly once as a parameter increases). This turns many optimization problems into O(log n) searches.

```python
def min_days_to_ship(weights, capacity_candidate):
    days, current_load = 1, 0
    for w in weights:
        if current_load + w > capacity_candidate:
            days += 1
            current_load = 0
        current_load += w
    return days

def find_min_capacity(weights, max_days):
    left, right = max(weights), sum(weights)
    while left < right:
        mid = (left + right) // 2
        if min_days_to_ship(weights, mid) <= max_days:
            right = mid          # mid works, try to do even better (smaller capacity)
        else:
            left = mid + 1          # mid doesn't work, need more capacity
    return left
```

> [!tip] Recognizing "binary search the answer" problems
> Look for phrases like "minimum capacity such that...", "smallest value such that a condition holds", or "find the boundary where behavior switches." If increasing a candidate answer monotonically flips a yes/no condition, binary search applies even without a literal sorted array.

## Finding the First/Last Occurrence (Duplicates in Sorted Array)

```python
def find_first(arr, target):
    left, right, result = 0, len(arr) - 1, -1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            result = mid
            right = mid - 1          # keep searching LEFT for an even earlier occurrence
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return result
```

## Search Complexity Summary

| Method | Requires sorted? | Time |
|---|---|---|
| Linear search | No | O(n) |
| Binary search | Yes | O(log n) |
| Hash table lookup | No (uses hashing, not order) | O(1) average |

> [!tip] Choosing between binary search and a hash table
> If you only need EXACT match lookup and can afford O(n) space, a hash table's O(1) average beats binary search's O(log n). Binary search wins when you need range queries, closest-value lookups, or the "boundary" pattern above, none of which a hash table supports.
