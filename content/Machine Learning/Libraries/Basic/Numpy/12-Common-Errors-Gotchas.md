---
title: Common Errors & Gotchas
tags: [numpy, python, debugging, gotchas]
aliases: [ValueError shapes, broadcast error]
---

# Common Errors & Gotchas

> [!abstract] Purpose
> A troubleshooting reference for the errors that come up most often when working with NumPy, why they happen, and the fix.

---

## `ValueError: operands could not be broadcast together`

```python
a = np.array([1, 2, 3])          # shape (3,)
b = np.array([1, 2])                # shape (2,)
a + b                                  # ERROR — shapes incompatible
```

> [!tip] Debug checklist
> Print `.shape` for both arrays. Broadcasting requires shapes to match or be `1` when compared from the **right**. Use `arr[:, np.newaxis]` or `np.expand_dims()` to explicitly align dimensions if needed.

---

## View vs Copy Confusion (Silent Mutation)

```python
sub = arr2d[0:2, 0:2]     # a VIEW, not independent
sub[0, 0] = 999              # also modifies arr2d!
```

> [!warning] Basic slicing returns a view; fancy/boolean indexing returns a copy
> This asymmetry is the single most common source of "why did my original array change?" bugs. Use `.copy()` explicitly whenever independence is required. See [[02-Indexing-Slicing]].

---

## Integer Division Surprise

```python
np.array([1, 2, 3]) / np.array([2, 2, 2])     # [0.5, 1.0, 1.5] — true division, returns float64
np.array([1, 2, 3]) // np.array([2, 2, 2])       # [0, 1, 1] — floor division
```

> In Python 3 / modern NumPy, `/` always performs true (float) division even between integer arrays — no need to cast to float first as in old Python 2 code.

---

## dtype Upcasting Producing Unexpected Results

```python
arr = np.array([1, 2, 3], dtype="int8")
arr + 200          # overflow — int8 max is 127, wraps around silently in some cases
```

> [!warning] Fixed-width integer types can silently overflow
> Unlike Python's arbitrary-precision `int`, NumPy's `int8`/`int16`/`int32` wrap around on overflow without raising an error by default. Check value ranges before choosing a narrow dtype, or use `np.errstate` to catch it: `with np.errstate(over="raise"): ...`.

---

## `NaN` Comparisons Always False

```python
np.nan == np.nan          # False!
arr == np.nan                # never matches, even where NaN exists
np.isnan(arr)                  # correct way to check for NaN
```

---

## Mixing `and`/`or` with Arrays

```python
# BAD
if arr1 > 0 and arr2 > 0:
    ...
# ValueError: truth value of an array is ambiguous

# GOOD
if np.all((arr1 > 0) & (arr2 > 0)):
    ...
```

> Python's `and`/`or`/`if` expect a single boolean; use `&`/`|` for element-wise combination, and reduce with `.any()`/`.all()` before an `if` statement.

---

## Reshape Errors — Element Count Mismatch

```python
arr = np.arange(10)
arr.reshape(3, 4)      # ValueError: cannot reshape array of size 10 into shape (3,4)
```

> New shape's total element count must exactly match the original (`3*4=12 ≠ 10`). Use `reshape(-1, n)` to let NumPy infer one dimension automatically, or `np.resize()` if changing the total count is intentional.

---

## Axis Confusion in Aggregations

```python
arr2d.sum(axis=0)     # per-COLUMN sums (collapses rows)
arr2d.sum(axis=1)       # per-ROW sums (collapses columns)
```

> [!tip] If the result shape is the opposite of what you expected, you likely have `axis=0`/`axis=1` swapped. See [[04-Math-Statistical-Functions]] for the mental model.

---

## Comparing Floats for Exact Equality

```python
0.1 + 0.2 == 0.3            # False — floating-point precision
np.isclose(0.1 + 0.2, 0.3)    # True — use this instead
np.allclose(arr1, arr2)         # array-wide tolerance-based comparison
```

---

## `object` dtype Sneaking In

```python
np.array([1, 2, "three"])     # dtype becomes '<U21' (unicode string) — all elements coerced!
np.array([1, [2, 3], "x"])       # dtype becomes 'object' — loses vectorization entirely
```

> Check `.dtype` after creating arrays from mixed or nested-irregular data — an unexpected `object` or string dtype silently disables fast vectorized math.

---

## Related
- [[01-Arrays-Basics]]
- [[02-Indexing-Slicing]]
- [[03-Broadcasting-Operations]]
- [[DBMS/PostgreSql/19-Common-Errors-Gotchas|Pandas: Common Errors & Gotchas]]
