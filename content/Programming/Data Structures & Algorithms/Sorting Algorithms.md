---
tags: [dsa, sorting]
aliases: [Sorting Algorithms, Merge Sort, Quick Sort, Bubble Sort]
---

# 🔀 Sorting Algorithms

Python's built-in `sorted()` and `.sort()` use Timsort, a highly optimized hybrid of merge sort and insertion sort, O(n log n) worst case. Understanding classic sorting algorithms is still essential for grasping complexity tradeoffs and for problems that need a specific property (stability, in-place, etc).

## Complexity Comparison

| Algorithm | Best | Average | Worst | Space | Stable? |
|---|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| Timsort (Python's built-in) | O(n) | O(n log n) | O(n log n) | O(n) | Yes |

> [!info] "Stable" means equal elements keep their original relative order
> Matters when sorting by one field but wanting ties broken by original order (e.g. sorting people by age, wanting same-age people to stay in their original list order).

## Bubble Sort

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break     # already sorted, early exit saves time on nearly-sorted input
    return arr
```

## Selection Sort

```python
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr
```

## Insertion Sort

```python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr
```

> [!tip] Insertion sort is genuinely useful for small or nearly-sorted arrays
> It's O(n) on already-sorted data and has very low constant-factor overhead, which is exactly why Timsort falls back to it for small sub-arrays internally.

## Merge Sort: Divide and Conquer

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:      # <= keeps it STABLE, preferring left on ties
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

Guaranteed O(n log n) even in the worst case, but O(n) extra space for the merging.

## Quick Sort

```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
```

In-place version (more space efficient, the version usually meant in interviews):

```python
def quick_sort_inplace(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        pivot_idx = partition(arr, low, high)
        quick_sort_inplace(arr, low, pivot_idx - 1)
        quick_sort_inplace(arr, pivot_idx + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
```

> [!warning] Quick sort's worst case is O(n²)
> A poorly chosen pivot (e.g. always picking the first or last element on already-sorted or reverse-sorted input) degrades into O(n²). Real implementations use random pivot selection or median-of-three to avoid this in practice.

## Heap Sort

```python
import heapq

def heap_sort(arr):
    heapq.heapify(arr)
    return [heapq.heappop(arr) for _ in range(len(arr))]     # O(n log n), O(1) extra space besides output
```

See [[Heaps and Priority Queues]] for the underlying heap mechanics.

## When to Actually Implement Your Own Sort

> [!tip] Almost never, in real code
> `sorted()` and `.sort()` are highly optimized C implementations, faster than anything you'd hand-roll in Python. The value of learning bubble/selection/merge/quick sort is understanding complexity analysis, divide-and-conquer thinking, and in-place vs extra-space tradeoffs, all patterns that reappear constantly elsewhere in DSA.

```python
sorted([3, 1, 4, 1, 5])                          # O(n log n), returns new list
sorted(people, key=lambda p: p["age"])              # sort by custom key
sorted(words, key=len, reverse=True)                   # sort descending by length
```
