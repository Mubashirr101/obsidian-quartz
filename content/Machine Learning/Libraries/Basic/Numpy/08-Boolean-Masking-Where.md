---
title: Boolean Masking & Where
tags: [numpy, python, boolean, conditional]
aliases: [np.where, np.select, boolean masking]
---

# Boolean Masking & `np.where`

> [!abstract] Definition
> Boolean masking filters or conditionally modifies array data using arrays of `True`/`False` values. `np.where()` and `np.select()` extend this to conditional value assignment — NumPy's vectorized equivalent of an if/else or CASE-WHEN expression.

---

## Boolean Masks (Recap from Indexing)

```python
arr = np.array([1, -2, 3, -4, 5])
mask = arr > 0            # array([True, False, True, False, True])

arr[mask]                    # [1, 3, 5] — filter
arr[mask].sum()                # sum of only positive values
mask.sum()                       # count of True values (True=1, False=0)
np.count_nonzero(mask)             # equivalent, often faster
```

---

## Combining Conditions

```python
(arr > 0) & (arr < 4)          # AND — parentheses required due to operator precedence
(arr > 3) | (arr < -3)           # OR
~(arr > 0)                         # NOT
np.logical_and(arr > 0, arr < 4)     # explicit function form
np.logical_or(a, b)
np.logical_not(a)
np.logical_xor(a, b)
```

---

## `np.where()` — Conditional Value Selection

```python
np.where(condition, value_if_true, value_if_false)
```

```python
arr = np.array([1, -2, 3, -4, 5])
np.where(arr > 0, arr, 0)              # replace negatives with 0: [1, 0, 3, 0, 5]
np.where(arr > 0, "positive", "negative")  # string labeling

# np.where with a single argument returns matching INDICES (like np.nonzero)
indices = np.where(arr > 0)             # (array([0, 2, 4]),)
arr[np.where(arr > 0)]                     # equivalent to arr[arr > 0]
```

---

## `np.select()` — Multiple Conditions (Vectorized if/elif/elif/else)

```python
scores = np.array([95, 82, 67, 45, 78])

conditions = [scores >= 90, scores >= 75, scores >= 60]
choices = ["A", "B", "C"]

np.select(conditions, choices, default="F")
# ['A', 'B', 'C', 'F', 'B']
```

> [!tip] `np.select` for multi-branch logic
> Cleaner and faster than chaining multiple nested `np.where()` calls when there are 3+ conditions.

---

## `np.any()` / `np.all()`

```python
np.any(arr > 100)          # True if AT LEAST ONE element satisfies the condition
np.all(arr > 0)              # True if ALL elements satisfy the condition

np.any(arr2d > 5, axis=0)      # per-column: any value > 5?
np.all(arr2d > 0, axis=1)        # per-row: all values > 0?
```

---

## `np.nonzero()` and `np.flatnonzero()`

```python
np.nonzero(arr)             # tuple of index arrays where condition/value is nonzero/True
np.flatnonzero(arr > 0)       # flat array of indices (1D shortcut)
```

---

## Clipping and Conditional Capping

```python
np.clip(arr, a_min=0, a_max=100)          # cap values into [0, 100]
np.clip(arr, 0, None)                        # only enforce a floor (no ceiling)
```

---

## Masked Arrays (For Explicit "Missing" Semantics)

```python
import numpy.ma as ma
masked = ma.masked_array(arr, mask=[True, False, False, True, False])
masked.mean()          # automatically excludes masked (True) entries from computation
```

> [!info] `numpy.ma` vs plain boolean filtering
> `numpy.ma.masked_array` is useful when you need to **remember** which values are invalid across many downstream operations without repeatedly re-filtering — pandas' `NaN` handling ([[05-Missing-Data|Pandas: Missing Data]]) solves the same problem at a higher level for tabular data.

---

## Related
- [[02-Indexing-Slicing]]
- [[03-Broadcasting-Operations]]
- [[11-Apply-Map-Vectorization|Pandas: Apply, Map & Vectorization]]
