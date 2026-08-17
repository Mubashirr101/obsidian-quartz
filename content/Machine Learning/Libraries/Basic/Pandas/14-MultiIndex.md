---
title: MultiIndex (Hierarchical Indexing)
tags: [pandas, python, multiindex, hierarchical]
aliases: [MultiIndex, hierarchical index]
---

# MultiIndex — Hierarchical Indexing

> [!abstract] Definition
> A **`MultiIndex`** lets a `Series`/`DataFrame` axis have multiple levels of labels — useful for representing higher-dimensional data (e.g. year + month, or region + product) in a 2D structure.

---

## Creating a MultiIndex

```python
# From groupby with multiple keys (most common origin)
s = df.groupby(["region", "quarter"])["sales"].sum()   # s.index is a MultiIndex

# Explicitly, from tuples
index = pd.MultiIndex.from_tuples(
    [("Mumbai", 2025), ("Mumbai", 2026), ("Pune", 2025)],
    names=["city", "year"]
)
df2 = pd.DataFrame({"sales": [100, 120, 90]}, index=index)

# From the cartesian product of levels
index = pd.MultiIndex.from_product(
    [["Mumbai", "Pune"], [2025, 2026]],
    names=["city", "year"]
)

# From arrays
index = pd.MultiIndex.from_arrays(
    [["Mumbai", "Mumbai", "Pune"], [2025, 2026, 2025]],
    names=["city", "year"]
)

# By set_index on multiple columns
df.set_index(["city", "year"])
```

---

## Inspecting Levels

```python
df.index.names            # names of each level
df.index.levels            # unique values per level
df.index.get_level_values("city")   # values of one level as an array
df.index.nlevels             # number of levels
```

---

## Selecting Data

```python
df.loc["Mumbai"]                          # all rows for outer level "Mumbai"
df.loc[("Mumbai", 2025)]                    # specific (outer, inner) combination
df.loc[("Mumbai", 2025), "sales"]             # + column selection
df.loc[["Mumbai", "Pune"]]                      # multiple outer-level values

df.xs("Mumbai", level="city")                     # cross-section: fix one level, keep rest
df.xs(2025, level="year")                            # fix the inner level instead
df.xs(("Mumbai", 2025), level=["city", "year"])        # fix multiple levels at once
```

> [!tip] `.xs()` for level-agnostic selection
> `.xs()` is especially useful for selecting on an **inner** level without needing to specify the outer level(s) — something plain `.loc[]` can't do directly.

---

## Reordering & Sorting Levels

```python
df.swaplevel("city", "year")           # swap two levels (order changes, values unchanged)
df.sort_index(level="year")              # sort by a specific level
df.sort_index()                            # sort by all levels, outer to inner
df.reorder_levels(["year", "city"])          # arbitrary reorder
```

---

## Flattening a MultiIndex

```python
df.reset_index()                                     # levels become regular columns
df.columns = ["_".join(map(str, c)) for c in df.columns]   # flatten MultiIndex COLUMNS to single strings
```

> [!note] `groupby().agg()` with multiple functions often produces a MultiIndex on the **columns** too — flattening with a list comprehension like above is the standard fix.

---

## Stack / Unstack with MultiIndex
See [[08-Reshaping]] — `stack()`/`unstack()` move a level between the row index and the columns.

```python
s.unstack()                # move innermost row-index level to columns
s.unstack(level="year")     # move a specific named level
```

---

## MultiIndex on Columns

```python
df.columns = pd.MultiIndex.from_tuples([
    ("sales", "2025"), ("sales", "2026"), ("profit", "2025")
])
df["sales"]                  # select the whole "sales" top-level group
df[("sales", "2025")]         # select a specific leaf column
```

---

## Notes & Gotchas

> [!warning] Performance: sort the index for fast slicing
> Slicing operations (`df.loc["Mumbai":"Pune"]`) on an unsorted MultiIndex can raise `UnsortedIndexError` or silently be slow. Call `df.sort_index()` after building a MultiIndex if you plan to slice it.

---

## Related
- [[06-GroupBy]]
- [[08-Reshaping]]
- [[04-Indexing-Selection]]
