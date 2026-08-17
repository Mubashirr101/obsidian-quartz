---
title: Reshaping Arrays
tags: [numpy, python, reshape, stacking]
aliases: [reshape, flatten, transpose, concatenate]
---

# Reshaping Arrays

> [!abstract] Definition
> Reshaping tools change an array's **shape** or combine multiple arrays into one, without necessarily changing the underlying data or (in the reshape case) copying it.

---

## `reshape()` — Change Shape, Same Data

```python
arr = np.arange(12)          # [0, 1, ..., 11], shape (12,)
arr.reshape(3, 4)              # shape (3, 4)
arr.reshape(4, 3)                # shape (4, 3)
arr.reshape(2, -1)                 # -1 means "infer this dimension" -> (2, 6)
arr.reshape(-1, 1)                   # column vector, shape (12, 1)
```

> [!tip] `reshape` returns a **view** when possible
> If the data is contiguous in memory, `reshape()` doesn't copy — it just reinterprets the shape. Modifying the reshaped array can modify the original. Use `.reshape(...).copy()` if independence is needed.

---

## `flatten()` vs `ravel()`

```python
arr2d.flatten()      # always returns a COPY, 1D
arr2d.ravel()          # returns a VIEW when possible (faster, but may mutate original)
```

---

## `transpose()` / `.T`

```python
arr2d.T                     # swap axes (rows <-> columns)
arr2d.transpose()             # equivalent
arr3d.transpose(2, 0, 1)        # explicit axis reordering for ND arrays
np.swapaxes(arr3d, 0, 2)          # swap two specific axes
```

---

## Adding/Removing Dimensions

```python
arr = np.array([1, 2, 3])          # shape (3,)
arr[:, np.newaxis]                    # shape (3, 1)
np.expand_dims(arr, axis=0)              # shape (1, 3)
np.expand_dims(arr, axis=1)                # shape (3, 1)

arr2d = np.array([[1, 2, 3]])          # shape (1, 3)
np.squeeze(arr2d)                          # removes size-1 dims -> shape (3,)
```

---

## Concatenation & Stacking

```python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

np.concatenate([a, b])               # [1,2,3,4,5,6] — join along existing axis
np.concatenate([arr2d_a, arr2d_b], axis=0)   # stack rows (vertical)
np.concatenate([arr2d_a, arr2d_b], axis=1)     # stack columns (horizontal)

np.vstack([a, b])          # stack as rows -> shape (2, 3)
np.hstack([a, b])            # stack side by side -> shape (6,)
np.column_stack([a, b])        # stack as columns -> shape (3, 2)
np.stack([a, b], axis=0)         # NEW axis created -> shape (2, 3)
```

| Function | Behavior |
|---|---|
| `concatenate` | joins along an **existing** axis |
| `stack` | joins along a **new** axis (increases dimensionality) |
| `vstack` | shorthand for row-wise concatenation |
| `hstack` | shorthand for column-wise concatenation |

---

## Splitting

```python
np.split(arr, 3)                    # split into 3 equal parts
np.split(arr, [3, 7])                 # split at specific indices -> 3 unequal parts
np.hsplit(arr2d, 2)                     # split horizontally (by columns)
np.vsplit(arr2d, 2)                       # split vertically (by rows)
```

---

## Repeating & Tiling

```python
np.repeat(arr, 3)             # repeat each element 3 times: [1,1,1,2,2,2,3,3,3]
np.tile(arr, 3)                 # repeat the whole array 3 times: [1,2,3,1,2,3,1,2,3]
np.tile(arr2d, (2, 3))            # tile a 2D array 2x vertically, 3x horizontally
```

---

## Resizing (Changes Total Element Count)

```python
np.resize(arr, (3, 4))    # reshape, repeating/truncating data as needed to fit new size
arr.resize((3, 4))           # in-place version (fills with 0 if growing)
```

> [!warning] `resize` vs `reshape`
> `reshape()` requires the new shape to have the **same total element count**; `resize()` allows changing the total count, padding with zeros or repeating/truncating data — a common source of confusion.

---

## Related
- [[01-Arrays-Basics]]
- [[08-Reshaping|Pandas: Reshaping]]
- [[06-Linear-Algebra]]
