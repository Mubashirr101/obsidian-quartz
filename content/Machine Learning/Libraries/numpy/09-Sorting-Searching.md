---
title: Sorting & Searching
tags: [numpy, python, sorting, searching]
aliases: [np.sort, argsort, argmax, searchsorted]
---

# Sorting & Searching

> [!abstract] Definition
> NumPy provides vectorized sorting (`sort`, `argsort`) and searching (`searchsorted`, `argmax`/`argmin`, `where`) functions that operate efficiently across entire arrays or along a specific axis.

---

## Sorting

```python
arr = np.array([3, 1, 4, 1, 5, 9, 2])

np.sort(arr)             # returns a NEW sorted array, original untouched
arr.sort()                  # sorts IN PLACE, modifies arr directly

np.sort(arr)[::-1]            # descending order (sort ascending, then reverse)

arr2d = np.array([[3, 1], [2, 4]])
np.sort(arr2d, axis=0)          # sort each column independently
np.sort(arr2d, axis=1)            # sort each row independently
np.sort(arr2d, axis=None)           # flatten then sort entirely
```

---

## `argsort()` — Indices That Would Sort the Array

```python
arr = np.array([30, 10, 20])
order = np.argsort(arr)         # [1, 2, 0] — indices in sorted order
arr[order]                        # [10, 20, 30] — apply the order

# Sort one array based on the order of another (common pattern)
names = np.array(["Charlie", "Alice", "Bob"])
scores = np.array([70, 95, 82])
order = np.argsort(scores)[::-1]   # descending order of scores
names[order]                          # ['Alice', 'Bob', 'Charlie'] — names reordered to match
```

> [!tip] `argsort` for "sort by a related array"
> This is the standard NumPy idiom for sorting one array by the values of another — get the index order from `argsort`, then apply it to both arrays.

---

## `argmax()` / `argmin()`

```python
arr.argmax()           # index of the maximum value
arr.argmin()             # index of the minimum value
arr2d.argmax(axis=0)       # index of max in each column
arr2d.argmax(axis=1)         # index of max in each row
np.unravel_index(arr2d.argmax(), arr2d.shape)  # convert flat index back to (row, col)
```

---

## Partial Sort — `np.partition` / `np.argpartition`

```python
np.partition(arr, 3)          # 3 smallest elements are in the first 3 positions (unordered among themselves), rest after
np.argpartition(arr, 3)[:3]     # indices of the 3 smallest values — faster than full argsort for "top-k" queries
```

> [!tip] Use `partition`/`argpartition` for top-k queries on large arrays
> Full `sort()`/`argsort()` is O(n log n); `partition` is O(n) — much faster when you only need the k smallest/largest values, not a fully ordered array.

---

## `searchsorted()` — Binary Search Insertion Point

```python
sorted_arr = np.array([1, 3, 5, 7, 9])
np.searchsorted(sorted_arr, 4)          # 2 — index where 4 would be inserted to keep sorted order
np.searchsorted(sorted_arr, [2, 6])       # works with an array of query values too
np.searchsorted(sorted_arr, 5, side="left")   # control tie-breaking side
```

> [!info] Common use: binning
> `searchsorted` is the core mechanism behind binning values into pre-defined ranges — conceptually similar to pandas' `pd.cut()`.

---

## `unique()` with Extras

```python
np.unique(arr)                                        # sorted unique values
values, counts = np.unique(arr, return_counts=True)      # + frequency counts
values, idx = np.unique(arr, return_index=True)             # + first-occurrence indices
values, inverse = np.unique(arr, return_inverse=True)          # + indices to reconstruct original array
```

---

## `np.where()` as a Search Tool

```python
np.where(arr == target)          # indices where condition is True — see 08-Boolean-Masking-Where
```

---

## Related
- [[04-Math-Statistical-Functions]]
- [[08-Boolean-Masking-Where]]
- [[13-Sorting-Filtering|Pandas: Sorting & Filtering]]
