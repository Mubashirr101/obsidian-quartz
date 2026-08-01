---
title: Indexing & Slicing
tags: [numpy, python, indexing]
aliases: [fancy indexing, boolean indexing, views]
---

# Indexing & Slicing

> [!abstract] Definition
> NumPy supports several indexing styles: **basic slicing** (returns a view), **fancy indexing** (integer arrays, returns a copy), and **boolean indexing** (masks, returns a copy). Knowing which returns a view vs a copy is essential to avoid unexpected mutation bugs.

---

## Basic Indexing & Slicing

```python
arr = np.array([10, 20, 30, 40, 50])

arr[0]            # 10 — single element
arr[-1]            # 50 — last element
arr[1:4]            # [20, 30, 40] — slice, exclusive of end
arr[::2]             # [10, 30, 50] — every 2nd element
arr[::-1]              # [50, 40, 30, 20, 10] — reversed
```

### 2D Indexing

```python
arr2d = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

arr2d[0, 1]           # 2 — row 0, col 1
arr2d[1]                # [4, 5, 6] — entire row 1
arr2d[:, 1]               # [2, 5, 8] — entire column 1
arr2d[0:2, 1:3]             # sub-matrix, rows 0-1, cols 1-2
arr2d[:, ::-1]                # reverse column order
```

---

## Views vs Copies

```python
sub = arr2d[0:2, 0:2]      # a VIEW — shares memory with arr2d
sub[0, 0] = 999              # modifies arr2d too!

sub_copy = arr2d[0:2, 0:2].copy()   # explicit COPY — independent
```

> [!warning] Basic slicing returns a **view**, not a copy
> Modifying a sliced view modifies the original array. Use `.copy()` explicitly whenever you need an independent array. Fancy indexing and boolean indexing, by contrast, **always** return copies.

---

## Fancy Indexing (Integer Arrays)

```python
arr = np.array([10, 20, 30, 40, 50])
arr[[0, 2, 4]]              # [10, 30, 50] — select specific positions
arr[[0, 0, 1]]                # [10, 10, 20] — repeats allowed

arr2d[[0, 2]]                    # select rows 0 and 2
arr2d[[0, 1], [1, 2]]              # elements at (0,1) and (1,2) — paired coordinates -> [2, 6]
arr2d[:, [0, 2]]                     # select columns 0 and 2
```

> [!tip] Fancy indexing with paired arrays selects **coordinates**, not a sub-grid
> `arr2d[[0,1],[1,2]]` picks `(0,1)` and `(1,2)` specifically — not the 2x2 block. Use `np.ix_()` if you want the cross-product (sub-grid) instead: `arr2d[np.ix_([0,1],[1,2])]`.

---

## Boolean Indexing (Masking)

```python
arr = np.array([1, -2, 3, -4, 5])
mask = arr > 0
arr[mask]                     # [1, 3, 5] — keep only positive values
arr[arr > 0] = 0                # set all positive values to 0 (in-place)

arr2d[arr2d > 5]                  # flattens result to 1D — matches only

# Combining conditions — must use & | ~ with parentheses (not and/or/not)
arr[(arr > 0) & (arr < 4)]
```

> [!info] See [[08-Boolean-Masking-Where]] for `np.where`, `np.select`, and further conditional-logic patterns.

---

## Ellipsis (`...`) and `np.newaxis`

```python
arr4d = np.zeros((2, 3, 4, 5))
arr4d[0, ..., 0]          # equivalent to arr4d[0, :, :, 0] — "..." fills remaining dims

arr = np.array([1, 2, 3])
arr[:, np.newaxis]          # shape (3,) -> (3, 1), adds a new axis
arr[np.newaxis, :]            # shape (3,) -> (1, 3)
```

---

## Setting Values via Indexing

```python
arr[0] = 100
arr[1:3] = [200, 300]
arr2d[:, 0] = 0                # set entire column to 0
arr[arr < 0] = 0                 # clip negatives to 0 via boolean mask
```

---

## `np.take` and `np.put`

```python
np.take(arr, [0, 2, 4])       # equivalent to fancy indexing, but works with axis= for ND arrays
np.put(arr, [0, 1], [99, 98])   # equivalent to arr[[0,1]] = [99, 98], modifies in place
```

---

## Related
- [[01-Arrays-Basics]]
- [[08-Boolean-Masking-Where]]
- [[12-Common-Errors-Gotchas]]
