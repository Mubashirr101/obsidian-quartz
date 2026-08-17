---
title: Indexing & Selection
tags: [pandas, python, indexing]
aliases: [loc, iloc, at, iat, boolean indexing]
---

# Indexing & Selection

> [!abstract] Definition
> pandas offers several complementary ways to select data from a `Series`/`DataFrame`: label-based (`.loc`), position-based (`.iloc`), scalar-fast (`.at`/`.iat`), boolean masks, and query strings. Choosing the right one avoids ambiguity and performance pitfalls.

---

## The Big Three

| Indexer | Basis | Endpoint behavior |
|---|---|---|
| `df.loc[]` | **Label** (row/column names) | Inclusive of end label in slices |
| `df.iloc[]` | **Integer position** | Exclusive of end position (like Python slicing) |
| `df[]` | Column selection (or boolean mask on rows) | N/A |

```python
df.loc[row_label, col_label]
df.loc[row_labels_list, col_labels_list]
df.loc[start_label:end_label]          # inclusive on both ends

df.iloc[row_pos, col_pos]
df.iloc[0:3, 0:2]                      # exclusive of end position

df["col"]                # single column -> Series
df[["col1", "col2"]]     # multiple columns -> DataFrame
df[0:3]                  # row slice by position (only for bare df[])
```

---

## `.loc` : Label-Based

```python
df.loc["row_label"]                       # single row -> Series
df.loc[["r1", "r2"]]                      # multiple rows -> DataFrame
df.loc[:, "col"]                          # all rows, one column
df.loc[:, ["col1", "col2"]]               # all rows, multiple columns
df.loc["r1":"r3", "c1":"c2"]              # label slice, both endpoints included
df.loc[df["age"] > 25]                    # boolean mask on rows
df.loc[df["age"] > 25, "name"]            # boolean mask + column selection
df.loc[df["age"] > 25, ["name", "city"]]  # boolean mask + multiple columns
```

---

## `.iloc` : Position-Based

```python
df.iloc[0]                # first row -> Series
df.iloc[-1]                # last row
df.iloc[0:5]                # first 5 rows
df.iloc[:, 0]                 # first column, all rows
df.iloc[0:3, 0:2]               # first 3 rows, first 2 columns
df.iloc[[0, 2, 4]]                 # specific row positions
df.iloc[:, [0, -1]]                   # first and last column
```

---

## `.at` / `.iat` : Fast Scalar Access

```python
df.at["row_label", "col_label"]   # single value, label-based (fast)
df.iat[0, 0]                       # single value, position-based (fast)
```

> [!tip] Use `.at`/`.iat` over `.loc`/`.iloc` when you only need **one scalar value** , they're significantly faster because they skip the extra alignment/broadcasting overhead.

---

## Boolean Indexing

```python
df[df["age"] > 25]
df[(df["age"] > 25) & (df["city"] == "Mumbai")]   # AND — use & with parentheses
df[(df["age"] < 18) | (df["age"] > 65)]           # OR — use |
df[~(df["age"] > 25)]                               # NOT — use ~

df[df["city"].isin(["Mumbai", "Pune", "Delhi"])]
df[df["name"].str.startswith("A")]
df[df["age"].between(20, 40)]
```

> [!warning] Never use Python's `and`/`or`/`not` on Series
> Element-wise comparisons must use `&`, `|`, `~` with parentheses around each condition, because Series don't support ambiguous truthiness (`and`/`or` will raise `ValueError: truth value is ambiguous`).

---

## `.query()` : SQL-like String Filtering

```python
df.query("age > 25 and city == 'Mumbai'")
df.query("age > @threshold")          # reference external Python variable with @
df.query("col1 == col2")              # compare two columns
```

> [!tip] `.query()` is often faster than boolean masking on large DataFrames because it uses `numexpr` under the hood, and it's more readable for complex conditions.

---

## Setting Values

```python
df.loc[0, "age"] = 26
df.loc[df["age"] > 60, "category"] = "senior"
df.iloc[0, 0] = 100
df.at["row1", "col1"] = 5
```

> [!warning] Chained indexing (`df[df.a > 0]["b"] = 1`) is unsafe
> This creates an intermediate copy, so the assignment may silently fail to update the original DataFrame and raises `SettingWithCopyWarning`. Always chain through a single `.loc[...]` call instead: `df.loc[df.a > 0, "b"] = 1`. See [[Machine Learning/Libraries/Basic/Pandas/19-Common-Errors-Gotchas]].

---

## `isin`, `where`, `mask`

```python
df[df["city"].isin(["Mumbai", "Pune"])]     # keep matching rows

df.where(df["age"] > 18)                     # NaN where condition is False
df.where(df["age"] > 18, other="minor")      # replace False positions with a value

df.mask(df["age"] < 18, other="minor")       # inverse of where — replace True positions
```

---

## Selecting by dtype / Column Patterns

```python
df.select_dtypes(include="number")
df.select_dtypes(exclude=["object", "category"])
df.filter(like="score")           # columns containing substring "score"
df.filter(regex="^col_")          # columns matching regex
df.filter(items=["a", "b"])       # exact match subset
```

---

## Index Manipulation

```python
df.set_index("id")
df.reset_index(drop=True)
df.reindex(["r1", "r2", "r3"])        # conform to new index, fill NaN where missing
df.reindex(columns=["a", "b", "c"])
df.sort_index()
df.index.name = "row_id"
```

---

## Related
- [[02-DataFrame-Basics]]
- [[05-Missing-Data]]
- [[14-MultiIndex]]
- [[Machine Learning/Libraries/Basic/Pandas/19-Common-Errors-Gotchas]]
