---
title: Missing Data
tags: [pandas, python, data-cleaning]
aliases: [NaN, isna, fillna, dropna]
---

# Missing Data

> [!abstract] Definition
> pandas represents missing values as `NaN` (float), `NaT` (datetime), `None`, or the nullable `pd.NA` (used with nullable extension dtypes like `Int64`, `boolean`, `string`). A consistent toolkit exists for detecting, removing, and filling these gaps.

---

## Detecting Missing Values

```python
df.isna()          # element-wise boolean DataFrame (alias: df.isnull())
df.notna()          # inverse (alias: df.notnull())

df.isna().sum()             # count of NaN per column
df.isna().sum().sum()       # total NaN in whole DataFrame
df.isna().mean() * 100      # % missing per column

df["col"].isna().any()      # any missing in a column?
df.isna().any(axis=1)       # rows with at least one NaN
df[df.isna().any(axis=1)]   # view rows containing any NaN
```

---

## Dropping Missing Values

```python
df.dropna()                     # drop rows with ANY NaN
df.dropna(how="all")             # drop rows where ALL values are NaN
df.dropna(axis=1)                 # drop columns with any NaN
df.dropna(subset=["col1", "col2"]) # only consider these columns
df.dropna(thresh=3)               # keep rows with at least 3 non-NaN values
df.dropna(inplace=True)
```

---

## Filling Missing Values

```python
df.fillna(0)                              # fill all NaN with a constant
df.fillna({"age": 0, "city": "Unknown"})   # per-column fill values
df.fillna(method="ffill")                  # forward-fill (propagate last valid value) — use df.ffill()
df.fillna(method="bfill")                  # backward-fill — use df.bfill()
df["age"].fillna(df["age"].mean())         # fill with column mean
df["age"].fillna(df["age"].median())       # fill with median (robust to outliers)
df.ffill(limit=2)                          # limit consecutive fills
```

> [!info] `method="ffill"/"bfill"` deprecated as a `fillna` kwarg
> In modern pandas, prefer the dedicated methods `df.ffill()` and `df.bfill()` directly instead of passing `method=` to `fillna`.

---

## Interpolation

```python
df["value"].interpolate(method="linear")       # linear interpolation between points
df["value"].interpolate(method="time")          # for datetime-indexed data
df["value"].interpolate(method="polynomial", order=2)
df["value"].interpolate(limit_direction="both")
```

---

## Replacing Specific Sentinel Values

```python
df.replace(-999, np.nan)               # treat -999 as missing
df.replace({"N/A": np.nan, "?": np.nan})
pd.read_csv("f.csv", na_values=["N/A", "?", "-999"])   # handle at load time
```

---

## Nullable / Extension dtypes (`pd.NA`)

```python
s = pd.Series([1, 2, None], dtype="Int64")   # nullable integer (capital I)
s = pd.Series(["a", None], dtype="string")   # nullable string
s = pd.Series([True, None], dtype="boolean") # nullable boolean

s.isna()        # works the same way with pd.NA
```

> [!tip] Why nullable dtypes matter
> Standard NumPy `int64` cannot hold `NaN` (forces upcast to `float64`, losing integer-ness). The nullable `Int64` (capital I) dtype preserves integer semantics while still supporting missing values.

---

## Arithmetic & Aggregation with NaN

```python
pd.Series([1, 2, np.nan]).sum()     # 3.0 -> NaN skipped by default
pd.Series([1, 2, np.nan]).sum(skipna=False)  # NaN -> propagates
pd.Series([1, 2, np.nan]).mean()    # NaN automatically excluded from denominator
```

> [!note] Aggregations skip `NaN` by default (`skipna=True`). Comparisons involving `NaN` (e.g. `np.nan == np.nan`) always return `False` — use `.isna()` instead of `== np.nan`.

---

## Combining with Missing-Aware Logic

```python
df["a"].combine_first(df["b"])   # fill a's NaNs with b's values where available
df.update(other_df)               # overwrite matching values in-place, skipping NaN in other_df
```

---

## Related
- [[01-Series]]
- [[04-Indexing-Selection]]
- [[10-DateTime]] (for `NaT`)
- [[19-Common-Errors-Gotchas]]
