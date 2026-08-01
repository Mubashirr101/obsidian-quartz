---
title: Categorical Data
tags: [pandas, python, categorical, memory-optimization]
aliases: [Categorical, category dtype]
---

# Categorical Data

> [!abstract] Definition
> The **`category`** dtype stores a column as a fixed set of distinct values (categories) plus an integer code per row, rather than repeating full string values. This saves memory and can speed up groupby/sort operations, and it supports meaningful **ordering** for non-alphabetic sort logic (e.g. "Low" < "Medium" < "High").

---

## Creating Categorical Data

```python
df["grade"] = df["grade"].astype("category")

s = pd.Categorical(["Low", "High", "Medium", "Low"])

s = pd.Categorical(
    ["Low", "High", "Medium"],
    categories=["Low", "Medium", "High"],
    ordered=True
)

# Via dtype directly on a column
cat_type = pd.CategoricalDtype(categories=["Low", "Medium", "High"], ordered=True)
df["priority"] = df["priority"].astype(cat_type)
```

---

## Why Use It — Memory Comparison

```python
df["city"].memory_usage(deep=True)                    # as object dtype
df["city"].astype("category").memory_usage(deep=True)   # as category dtype — usually much smaller
```

> [!tip] Best use case
> Categorical shines on columns with **many repeated values and relatively few unique ones** (e.g. `city`, `status`, `product_category`). It's wasted on high-cardinality columns like unique IDs or free text.

---

## Inspecting Categories

```python
s.cat.categories             # the distinct category values
s.cat.ordered                 # True/False
s.cat.codes                    # underlying integer codes (-1 for NaN)
```

---

## Modifying Categories

```python
s.cat.add_categories(["Critical"])            # add a new category
s.cat.remove_categories(["Low"])                # remove (values become NaN)
s.cat.remove_unused_categories()                  # drop categories no rows actually use
s.cat.rename_categories({"Low": "L", "High": "H"})  # rename
s.cat.reorder_categories(["High", "Medium", "Low"], ordered=True)  # change display/sort order
s.cat.set_categories(["Low", "Medium", "High", "Critical"])  # replace the category set entirely
```

---

## Ordered Categories — Comparisons & Sorting

```python
s.sort_values()                # respects defined category order, not alphabetical
df[df["priority"] > "Low"]      # works because ordered=True enables comparison operators
df.sort_values("priority")
```

> [!warning] Comparisons on unordered categoricals raise `TypeError`
> `>`, `<`, `>=`, `<=` are only valid on categories created with `ordered=True`.

---

## `pd.cut()` and `pd.qcut()` — Binning Numeric Data into Categories

```python
pd.cut(df["age"], bins=[0, 18, 35, 60, 100], labels=["child", "young_adult", "adult", "senior"])
pd.cut(df["age"], bins=5)                          # 5 equal-width bins, auto labels
pd.qcut(df["score"], q=4, labels=["Q1", "Q2", "Q3", "Q4"])   # equal-FREQUENCY bins (quartiles)
```

| Function | Bin width strategy |
|---|---|
| `pd.cut` | equal-**width** bins (or explicit edges) |
| `pd.qcut` | equal-**frequency** bins (quantile-based) |

---

## GroupBy with Categorical Keys

```python
df.groupby("priority", observed=True)["value"].sum()
```

> [!info] `observed=True` (recommended, becomes default in future pandas)
> By default, `groupby()` on a categorical column includes **all** defined categories in the result — even ones with zero rows — producing extra rows filled with `0`/`NaN`. Pass `observed=True` to only show categories actually present in the data.

---

## Related
- [[13-Sorting-Filtering]]
- [[06-GroupBy]]
- [[18-Options-Performance]]
