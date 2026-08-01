---
title: Sorting & Filtering
tags: [pandas, python, sorting]
aliases: [sort_values, sort_index, nlargest]
---

# Sorting & Filtering

> [!abstract] Definition
> pandas provides label-based (`sort_index`) and value-based (`sort_values`) sorting, plus filtering helpers (`nlargest`/`nsmallest`, `.query()`, boolean masks covered in [[04-Indexing-Selection]]).

---

## `sort_values()`

```python
df.sort_values("age")                              # ascending by default
df.sort_values("age", ascending=False)               # descending
df.sort_values(["city", "age"])                       # multi-column sort
df.sort_values(["city", "age"], ascending=[True, False])  # mixed directions per column
df.sort_values("age", na_position="first")               # control NaN placement
df.sort_values("age", key=lambda col: col.str.lower())     # transform before sorting (Series -> Series)

s.sort_values()          # works on a Series too
```

---

## `sort_index()`

```python
df.sort_index()                     # sort by row labels
df.sort_index(ascending=False)
df.sort_index(axis=1)                  # sort COLUMNS alphabetically
df.sort_index(level=0)                   # for MultiIndex, sort by a specific level
```

---

## `nlargest()` / `nsmallest()`

```python
df.nlargest(10, "revenue")            # top 10 rows by revenue — faster than sort_values().head()
df.nsmallest(10, "revenue")
df.nlargest(10, "revenue", keep="all")  # include all ties
```

> [!tip] `nlargest`/`nsmallest` vs `sort_values().head()`
> `nlargest(n, col)` is optimized (partial sort) and generally faster than `df.sort_values(col, ascending=False).head(n)` for large DataFrames.

---

## Filtering Recap (full detail in [[04-Indexing-Selection]])

```python
df[df["age"] > 25]
df.query("age > 25 and city == 'Mumbai'")
df[df["city"].isin(["Mumbai", "Pune"])]
df.filter(like="score")          # column name contains substring
df.filter(regex="^2026")           # column name matches regex
```

---

## Rank-Based Filtering

```python
df[df["score"].rank(ascending=False) <= 3]   # top-3 by score, ties included
df.groupby("team").apply(lambda g: g.nlargest(3, "score"))   # top-3 per group
```

---

## Sorting by Custom / Categorical Order

```python
order = pd.CategoricalDtype(categories=["Low", "Medium", "High"], ordered=True)
df["priority"] = df["priority"].astype(order)
df.sort_values("priority")     # respects Low < Medium < High, not alphabetical
```

> [!info] See [[15-Categorical-Data]] for full ordered-category reference.

---

## Related
- [[04-Indexing-Selection]]
- [[12-Aggregation-Statistics]]
- [[15-Categorical-Data]]
