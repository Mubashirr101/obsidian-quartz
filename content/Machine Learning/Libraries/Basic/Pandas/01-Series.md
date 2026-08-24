---
title: Series
tags: [pandas, python, data-structures]
aliases: [pd.Series, Pandas Series]
---

# Series

> [!abstract] Definition
> A **`Series`** is a one-dimensional, labeled array capable of holding any data type (integers, strings, floats, Python objects, etc.). It is the building block of a [[02-DataFrame-Basics|DataFrame]] , think of a DataFrame as a dict of Series sharing the same index.

Every Series has two components:
- **`values`** : a NumPy array (or Extension Array) holding the data
- **`index`** : the axis labels for the data

---

## Syntax

```python
pd.Series(data=None, index=None, dtype=None, name=None, copy=None)
```

| Parameter | Description |
|---|---|
| `data` | array-like, dict, scalar, or iterable |
| `index` | array-like of labels; defaults to `RangeIndex(0, n)` |
| `dtype` | force a specific dtype |
| `name` | name of the Series (becomes column name if put into a DataFrame) |
| `copy` | copy input data (default `False` for array-like) |

---

## Creating a Series

```python
# From a list
s = pd.Series([10, 20, 30, 40])

# With a custom index
s = pd.Series([10, 20, 30], index=["a", "b", "c"])

# From a dict (keys become index)
s = pd.Series({"a": 1, "b": 2, "c": 3})

# From a scalar (broadcast across index)
s = pd.Series(5.0, index=["a", "b", "c"])

# With a name
s = pd.Series([1, 2, 3], name="scores")
```

---

## Key Attributes

| Attribute | Returns |
|---|---|
| `s.values` | underlying NumPy/Extension array |
| `s.index` | the Index object |
| `s.dtype` | data type of elements |
| `s.shape` | tuple `(n,)` |
| `s.size` | number of elements |
| `s.name` | name of the Series |
| `s.empty` | `True` if length is 0 |
| `s.nbytes` | memory usage in bytes |
| `s.is_unique` | `True` if all values distinct |
| `s.hasnans` | `True` if any `NaN` present |

---

## Indexing & Access

```python
s["a"]            # label-based access
s.iloc[0]          # position-based access
s.loc["a":"c"]     # label slice (inclusive of endpoint!)
s.iloc[0:2]        # position slice (exclusive of endpoint)
s[["a", "c"]]      # fancy indexing, multiple labels
s[s > 10]          # boolean filtering
```

> [!warning] Slicing endpoints differ
> `.loc` slices are **inclusive** on both ends; `.iloc` slices behave like standard Python slicing (**exclusive** end).

---

## Core Operations

```python
s.sum(); s.mean(); s.median(); s.std(); s.var()
s.min(); s.max(); s.idxmin(); s.idxmax()
s.cumsum(); s.cumprod(); s.cummax(); s.cummin()
s.sort_values(ascending=True)
s.sort_index()
s.rank()
s.unique()          # array of unique values
s.nunique()         # count of unique values
s.value_counts()    # frequency table, sorted descending
s.astype("float64") # cast dtype
s.round(2)
s.apply(lambda x: x * 2)
s.map({1: "one", 2: "two"})   # element-wise mapping
```

---

## Vectorized Arithmetic (auto-aligned by index)

```python
s1 = pd.Series([1, 2, 3], index=["a", "b", "c"])
s2 = pd.Series([10, 20, 30], index=["b", "c", "d"])

s1 + s2
# a     NaN   (no match)
# b    12.0
# c    32.0
# d     NaN   (no match)
```

> [!tip] Fill missing alignment
> Use `s1.add(s2, fill_value=0)` to treat unmatched labels as `0` instead of producing `NaN`.

---

## Boolean & Membership

```python
s.isin([10, 20])          # element-wise membership test
s.between(10, 30)         # inclusive range test
s.isna() / s.notna()      # null checks
s.all() / s.any()         # for boolean series
```

---

## Converting

```python
s.to_list()
s.to_dict()
s.to_frame(name="col")    # convert Series -> single-column DataFrame
s.to_numpy()
pd.to_numeric(s, errors="coerce")
```

---

## Notes & Gotchas

> [!warning] Series is index-aware, not position-aware by default
> Arithmetic and comparisons align on the **index**, not position. Mismatched indices silently produce `NaN` , always check `.index` when combining Series from different sources.

> [!note] `dtype=object` is a catch-all
> If a Series mixes types (e.g., strings and numbers), pandas falls back to `object` dtype, which is slower and loses vectorized numeric operations. Use `pd.to_numeric(s, errors="coerce")` to clean it up.

---

## Related
- [[02-DataFrame-Basics]]
- [[05-Missing-Data]]
- [[11-Apply-Map-Vectorization]]
- [[12-Aggregation-Statistics]]
