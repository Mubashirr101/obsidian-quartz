---
tags: [dsa, arrays, lists]
aliases: [Arrays, Python Lists DSA]
---

# 📦 Arrays and Lists

Python's `list` is a dynamic array: contiguous, resizable memory that supports O(1) index access. Understanding the underlying cost model is the foundation for almost every other data structure.

## Core Operations and Their Cost

```python
arr = [1, 2, 3, 4, 5]

arr[2]                # O(1), direct index access
arr.append(6)             # O(1) amortized, occasional resize costs O(n) but averages out
arr.pop()                    # O(1), removing from the END
arr.pop(0)                      # O(n), removing from the START shifts every remaining element
arr.insert(0, 99)                  # O(n), inserting at the START shifts everything right
arr[1:3]                              # O(k), slicing costs proportional to slice length
99 in arr                                # O(n), linear scan, no shortcut without extra structure
```

> [!warning] `insert(0, x)` and `pop(0)` are O(n), not O(1)
> This is the single most common Big O mistake with Python lists. If you need frequent operations at BOTH ends, use `collections.deque` instead, which gives O(1) at both ends (see [[Queues and Deques]]).

## Two-Dimensional Arrays (Matrices/Grids)

```python
rows, cols = 3, 4
grid = [[0] * cols for _ in range(rows)]     # correct: each row is an INDEPENDENT list

# WRONG version, all rows share the SAME inner list:
grid_wrong = [[0] * cols] * rows       # mutating grid_wrong[0][0] changes every row!

grid[1][2] = 5     # access by [row][col]

for row in grid:
    for cell in row:
        print(cell)
```

## Common Array Techniques

### Reversing In Place

```python
def reverse(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
    return arr
```

### Rotating an Array

```python
def rotate(arr, k):
    k = k % len(arr)
    return arr[-k:] + arr[:-k]     # O(n) time, O(n) space, simple slicing approach

rotate([1, 2, 3, 4, 5], 2)     # [4, 5, 1, 2, 3]
```

### Prefix Sums (Precompute for Fast Range Queries)

```python
def build_prefix_sums(arr):
    prefix = [0] * (len(arr) + 1)
    for i, val in enumerate(arr):
        prefix[i + 1] = prefix[i] + val
    return prefix

def range_sum(prefix, left, right):    # inclusive range [left, right]
    return prefix[right + 1] - prefix[left]

prefix = build_prefix_sums([1, 2, 3, 4, 5])
range_sum(prefix, 1, 3)     # 2+3+4 = 9, computed in O(1) after O(n) preprocessing
```

> [!tip] Prefix sums turn repeated range-sum queries from O(n) each into O(1) each
> Extremely useful whenever a problem asks "sum of elements between index i and j" many times over the same array.

### Kadane's Algorithm (Maximum Subarray Sum)

```python
def max_subarray_sum(arr):
    max_sum = current_sum = arr[0]
    for num in arr[1:]:
        current_sum = max(num, current_sum + num)     # either extend or restart the subarray
        max_sum = max(max_sum, current_sum)
    return max_sum

max_subarray_sum([-2, 1, -3, 4, -1, 2, 1, -5, 4])     # 6, from [4, -1, 2, 1]
```

O(n) time, O(1) space, a classic dynamic-programming-flavored greedy trick.

## Finding Duplicates

```python
def has_duplicate(arr):
    seen = set()
    for x in arr:
        if x in seen:
            return True
        seen.add(x)
    return False     # O(n) time, O(n) space using a set

def has_duplicate_no_extra_space(arr):        # if values fit index range and mutation is OK
    return len(arr) != len(set(arr))            # O(n) time, still O(n) space internally
```

See [[Hash Tables and Maps]] for why the set-based approach beats the naive O(n²) nested loop comparison.
