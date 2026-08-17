---
title: Arrays Basics (ndarray)
tags: [numpy, python, data-structures]
aliases: [ndarray, np.array]
---

# Arrays Basics — `ndarray`

> [!abstract] Definition
> The **`ndarray`** (N-dimensional array) is NumPy's core data structure: a fixed-size, homogeneously-typed grid of values, indexed by a tuple of non-negative integers. Unlike Python lists, all elements share one `dtype`, which is what enables fast, memory-efficient vectorized operations.

---

## Creating Arrays

```python
np.array([1, 2, 3])                    # from a list -> 1D array
np.array([[1, 2], [3, 4]])                # from nested lists -> 2D array
np.array([1, 2, 3], dtype="float64")        # force a dtype

np.zeros((3, 4))                # array of zeros, shape (3,4)
np.ones((2, 3))                  # array of ones
np.full((2, 2), fill_value=7)      # array filled with a constant
np.empty((2, 3))                     # uninitialized memory (fast, but garbage values)

np.arange(0, 10, 2)             # [0, 2, 4, 6, 8] — like Python range()
np.linspace(0, 1, 5)             # 5 evenly spaced points from 0 to 1 (inclusive)

np.eye(3)                        # 3x3 identity matrix
np.identity(4)                     # equivalent identity matrix constructor

np.zeros_like(arr)               # same shape/dtype as arr, filled with 0
np.ones_like(arr)
np.full_like(arr, fill_value=9)

np.random.default_rng(42).random((2, 3))   # random floats — see 07-Random-Module
```

---

## Key Attributes

| Attribute | Returns |
|---|---|
| `arr.shape` | tuple of dimension sizes, e.g. `(3, 4)` |
| `arr.ndim` | number of dimensions |
| `arr.size` | total element count |
| `arr.dtype` | data type of elements |
| `arr.itemsize` | bytes per element |
| `arr.nbytes` | total bytes (`size * itemsize`) |
| `arr.T` | transposed view |
| `arr.flat` | flat iterator over all elements |

```python
arr = np.array([[1, 2, 3], [4, 5, 6]])
arr.shape     # (2, 3)
arr.ndim       # 2
arr.size        # 6
arr.dtype        # dtype('int64')
```

---

## Common dtypes

| dtype | Description |
|---|---|
| `int8`/`int16`/`int32`/`int64` | signed integers, various widths |
| `uint8`/`uint16`/... | unsigned integers |
| `float16`/`float32`/`float64` | floating point, various precision |
| `bool` | True/False |
| `complex64`/`complex128` | complex numbers |
| `object` | arbitrary Python objects (loses vectorization speed) |
| `str_` / `<U10` | fixed-width unicode strings |

```python
arr.astype("int32")           # cast to a new dtype (returns a new array)
np.array([1, 2, 3], dtype=np.float32)
```

> [!tip] Pick the smallest dtype that fits
> `int64`/`float64` are defaults but often overkill. Using `int32`/`float32` where precision allows halves memory usage — significant for large arrays. See [[11-Performance-Vectorization]].

---

## Array from Existing Data

```python
np.asarray(python_list)          # convert without copying if already an array
np.array(existing_arr, copy=True)  # explicit copy
list(arr)                            # back to a Python list
arr.tolist()                           # nested Python lists (recursively for ND arrays)
```

---

## Multi-Dimensional Basics

```python
arr3d = np.zeros((2, 3, 4))    # 2 "layers" of 3x4 matrices
arr3d.shape                       # (2, 3, 4)

# Building a 2D array row by row
rows = [np.array([1, 2, 3]), np.array([4, 5, 6])]
np.vstack(rows)                    # stack as rows -> shape (2,3)
```

---

## Notes & Gotchas

> [!warning] Arrays are homogeneous
> Mixing types (e.g. `np.array([1, "a", 3.0])`) forces NumPy to upcast everything to a common dtype (often `<U...` string, or `object`), losing fast numeric operations. Keep arrays single-typed.

> [!note] Arrays have a **fixed size** once created
> Unlike Python lists, you can't append to a NumPy array in place efficiently. `np.append()` and `np.concatenate()` always allocate a **new** array — see [[05-Reshaping-Arrays]] for combining arrays properly.

---

## Related
- [[02-Indexing-Slicing]]
- [[03-Broadcasting-Operations]]
- [[11-Performance-Vectorization]]
