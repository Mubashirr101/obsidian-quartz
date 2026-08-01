---
title: Aggregation & Statistics
tags: [pandas, python, statistics, describe]
aliases: [describe, value_counts, corr, agg]
---

# Aggregation & Statistics

> [!abstract] Definition
> pandas has a rich set of built-in statistical and aggregation methods available directly on `Series`/`DataFrame`, applicable whole, or scoped via [[06-GroupBy|groupby]].

---

## Descriptive Summary

```python
df.describe()                        # count, mean, std, min, 25/50/75%, max — numeric cols
df.describe(include="all")            # includes object/categorical columns too
df.describe(percentiles=[.1, .5, .9])  # custom percentiles
s.describe()                            # single-Series summary
```

---

## Core Aggregation Functions

| Method | Description |
|---|---|
| `.sum()` | sum of values |
| `.mean()` | arithmetic mean |
| `.median()` | median |
| `.mode()` | most frequent value(s) |
| `.std()` | standard deviation (sample, `ddof=1` by default) |
| `.var()` | variance |
| `.min()` / `.max()` | minimum / maximum |
| `.count()` | non-null count |
| `.nunique()` | count of distinct values |
| `.sem()` | standard error of the mean |
| `.skew()` | skewness |
| `.kurt()` | kurtosis |
| `.quantile(q)` | value at quantile `q` (0-1) |
| `.prod()` | product of values |

```python
df["age"].mean()
df[["age", "salary"]].sum()
df.mean(numeric_only=True)         # across all numeric columns
df.quantile([0.25, 0.5, 0.75])
```

---

## `.agg()` — Multiple Functions at Once

```python
df["age"].agg(["mean", "std", "min", "max"])
df.agg({"age": "mean", "salary": ["min", "max"], "name": "count"})
df.agg(lambda x: x.max() - x.min())
```

---

## `value_counts()` — Frequency Table

```python
df["city"].value_counts()                        # counts, sorted descending
df["city"].value_counts(normalize=True)             # proportions (sum to 1)
df["city"].value_counts(dropna=False)                 # include NaN as a category
df["city"].value_counts(bins=5)                          # for numeric data — binned counts

df[["city", "gender"]].value_counts()             # combo frequency (multi-column)
```

---

## Correlation & Covariance

```python
df.corr()                    # pairwise Pearson correlation matrix (numeric cols)
df.corr(method="spearman")     # rank-based correlation
df.corr(method="kendall")
df["a"].corr(df["b"])            # correlation between two specific Series
df.cov()                           # covariance matrix
```

---

## Ranking

```python
df["score"].rank()                       # average rank for ties (default)
df["score"].rank(method="min")             # ties get lowest rank
df["score"].rank(method="dense")             # like min, but no rank gaps
df["score"].rank(ascending=False)              # highest value = rank 1
df["score"].rank(pct=True)                       # rank as a percentile (0-1)
```

---

## Cumulative Statistics

```python
df["sales"].cumsum()      # running total
df["sales"].cumprod()      # running product
df["sales"].cummax()        # running max
df["sales"].cummin()         # running min
```

---

## `nlargest` / `nsmallest`

```python
df.nlargest(5, "salary")               # top 5 rows by column
df.nsmallest(5, "salary")               # bottom 5 rows
df["salary"].nlargest(5)                 # top 5 values from a Series
df.nlargest(5, ["salary", "age"])          # tie-break with a second column
```

---

## Crosstab / Grouped Stats
See [[08-Reshaping]] for `pd.crosstab()` and `pivot_table` aggregation, and [[06-GroupBy]] for `.groupby().agg()`.

---

## Unique Values & Duplicates

```python
df["city"].unique()             # array of unique values
df["city"].nunique()             # count of unique values
df.duplicated()                    # boolean mask of duplicate rows
df.duplicated(subset=["city"])       # duplicates based on specific columns
df.drop_duplicates()                   # remove duplicate rows
df.drop_duplicates(subset=["email"], keep="first")   # keep='first'|'last'|False
```

---

## Related
- [[06-GroupBy]]
- [[13-Sorting-Filtering]]
- [[16-Window-Rolling-Expanding]]
