---
title: Common Errors & Gotchas
tags: [pandas, python, debugging, gotchas]
aliases: [SettingWithCopyWarning, pandas errors]
---

# Common Errors & Gotchas

> [!abstract] Purpose
> A troubleshooting reference for the errors/warnings that come up most often when working with pandas, why they happen, and the fix.

---

## `SettingWithCopyWarning`

```python
# BAD — chained indexing, may silently fail to modify the original
df[df["age"] > 25]["status"] = "adult"

# GOOD — single .loc call
df.loc[df["age"] > 25, "status"] = "adult"
```

> [!warning] Why it happens
> `df[df["age"] > 25]` may return a **copy** rather than a **view**, so `["status"] = ...` on that intermediate result might modify a throwaway object instead of the original DataFrame. pandas can't always tell whether you got a view or a copy, hence the warning.

> [!tip] Best fix
> Enable Copy-on-Write (`pd.set_option("mode.copy_on_write", True)`, default in pandas 3.0+) and/or always use a single `.loc[row_condition, col]` assignment instead of chaining `[...][...]`.

---

## `ValueError: The truth value of a Series is ambiguous`

```python
# BAD
df[df["age"] > 18 and df["city"] == "Mumbai"]

# GOOD — use & / | with parentheses around each condition
df[(df["age"] > 18) & (df["city"] == "Mumbai")]
```

> Python's `and`/`or` expect a single boolean; a Series has many. Use the element-wise bitwise operators `&`, `|`, `~` instead, and parenthesize each condition (operator precedence otherwise breaks the expression).

---

## `KeyError` on Column/Row Access

```python
df["Age"]     # KeyError if the actual column is "age" (case-sensitive!)
```

> [!tip] Debug checklist
> - Check exact spelling/case: `df.columns.tolist()`
> - Check for leading/trailing whitespace in column names: `df.columns = df.columns.str.strip()`
> - For `.loc[]` row KeyErrors, confirm the label actually exists: `label in df.index`

---

## Silent Type Coercion / Mixed dtypes

```python
pd.Series([1, 2, np.nan]).dtype        # float64, not int64 — NaN forces float upcast
pd.Series([1, 2, None], dtype="Int64").dtype  # nullable Int64 avoids this, see 05-Missing-Data
```

> [!warning] Integer columns silently become `float64` the moment any value is missing, because NumPy's plain `int64` can't represent `NaN`. Use the nullable `Int64` (capital I) dtype if integer semantics must be preserved alongside missing values.

---

## `MergeError` / Unexpected Row Explosion

```python
pd.merge(a, b, on="id")   # if "id" isn't unique in either frame, matching rows multiply
```

> [!tip] Always validate merge keys before joining
> ```python
> assert a["id"].is_unique
> pd.merge(a, b, on="id", validate="one_to_one")   # raises if assumption is false
> ```

---

## `.apply()` Returning Unexpected Shape

```python
df.groupby("city").apply(lambda g: g.head(2))   # may or may not add an extra index level
```

> Behavior of `groupby().apply()` when the function returns a DataFrame can vary by pandas version regarding the resulting index structure — always inspect `.index` afterward, or prefer `.head(2)` per group via a documented method where possible.

---

## Comparing Floats for Equality

```python
0.1 + 0.2 == 0.3          # False! floating point precision
np.isclose(0.1 + 0.2, 0.3)  # True — use this instead
```

---

## `inplace=True` Doesn't Always Do What You Expect

```python
df2 = df.dropna(inplace=True)   # df2 is None! inplace ops return None, not the DataFrame
```

> [!warning] Never chain after `inplace=True`
> If you need to keep chaining (`.pipe()`, further methods), don't use `inplace=True` — reassign instead: `df = df.dropna()`.

---

## Index Misalignment in Arithmetic

```python
s1 = pd.Series([1, 2, 3], index=["a", "b", "c"])
s2 = pd.Series([10, 20, 30], index=["b", "c", "d"])
s1 + s2    # produces NaN for "a" and "d" — indices don't fully overlap
```

> Reset or align indices explicitly (`s1.reset_index(drop=True)`, or `.add(s2, fill_value=0)`) if you actually meant positional addition.

---

## Datetime Parsing Silently Wrong

```python
pd.to_datetime("01-02-2026")           # ambiguous: Jan 2 or Feb 1?
pd.to_datetime("01-02-2026", format="%d-%m-%Y")  # explicit — always prefer this
```

---

## Reading CSV — Leading Zeros Lost

```python
pd.read_csv("f.csv")                          # "007" -> 7 (int), leading zero lost
pd.read_csv("f.csv", dtype={"zip_code": str})   # force string dtype to preserve it
```

---

## `df.columns` Duplicated After Merge

```python
merged = pd.merge(a, b, on="id", suffixes=("_left", "_right"))
```

> If both frames have a same-named non-key column and you don't pass `suffixes`, pandas appends default `_x`/`_y` — always set explicit, meaningful suffixes for readability.

---

## Related
- [[04-Indexing-Selection]]
- [[05-Missing-Data]]
- [[07-Merge-Join-Concat]]
- [[18-Options-Performance]]
