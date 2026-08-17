---
title: DataFrame Basics
tags: [pandas, python, data-structures]
aliases: [pd.DataFrame, DataFrame]
---

# DataFrame Basics

> [!abstract] Definition
> A **`DataFrame`** is a 2-dimensional, size-mutable, labeled data structure with columns of potentially different types , conceptually a spreadsheet, SQL table, or dict of [[01-Series|Series]] objects sharing an index.

---

## Syntax

```python
pd.DataFrame(data=None, index=None, columns=None, dtype=None, copy=None)
```

---

## Creating a DataFrame

```python
# From a dict of lists (columns)
df = pd.DataFrame({
    "name": ["Alice", "Bob", "Charlie"],
    "age": [25, 30, 35],
    "city": ["Mumbai", "Delhi", "Pune"]
})

# From a list of dicts (rows)
df = pd.DataFrame([
    {"name": "Alice", "age": 25},
    {"name": "Bob", "age": 30}
])

# From a NumPy array
df = pd.DataFrame(np.random.randn(4, 3), columns=["A", "B", "C"])

# From a list of lists with explicit columns
df = pd.DataFrame([[1, 2], [3, 4]], columns=["x", "y"])

# Empty DataFrame
df = pd.DataFrame(columns=["a", "b", "c"])
```

---

## Inspecting a DataFrame

```python
df.head(n=5)          # first n rows
df.tail(n=5)           # last n rows
df.sample(n=5)         # random n rows
df.shape               # (rows, cols)
df.info()              # dtypes, non-null counts, memory usage
df.describe()          # summary stats for numeric columns
df.describe(include="all")  # include object/categorical columns too
df.dtypes              # dtype per column
df.columns             # Index of column labels
df.index                # row index
df.values               # underlying NumPy array (2D)
df.memory_usage(deep=True)  # per-column memory, deep=True includes objects
df.axes                 # [index, columns]
df.ndim                 # 2
df.size                 # rows * cols
```

---

## Column Operations

```python
df["age"]                      # select column -> Series
df[["name", "age"]]            # select multiple columns -> DataFrame
df.age                         # attribute access (only if valid identifier)

df["is_adult"] = df["age"] >= 18       # add new column
df["age_group"] = df["age"] // 10 * 10 # derived column

df.rename(columns={"name": "full_name"}, inplace=True)
df.drop(columns=["city"], inplace=True)
df.drop("city", axis=1)               # equivalent

# drop all the cols except some / keep some and drop the rest
cols_to_keep = ["name", "age"]
# Safe selection: only keeps columns that actually exist in df
existing_cols = [col for col in cols_to_keep if col in df.columns] 
df = df[existing_cols]


# Keep only the columns in your list (using filter)
df = df.filter(items=cols_to_keep)
# Drops all columns that are NOT in your list
df = df.drop(columns=df.columns.difference(cols_to_keep))

df.insert(loc=1, column="id", value=range(len(df)))  # insert at position

df.columns = ["a", "b", "c"]          # rename all at once
df = df.add_prefix("col_")
df = df.add_suffix("_v1")



```

---

## Row Operations

```python
df.drop(index=[0, 1])          # drop rows by label
df.drop(df[df.age < 18].index) # drop rows matching condition

df.reset_index(drop=True, inplace=True)  # renumber index
df.set_index("name", inplace=True)       # use a column as index

pd.concat([df1, df2], ignore_index=True) # append rows (preferred over deprecated .append())
```

---

## Basic Filtering & Selection Preview

```python
df[df["age"] > 25]                       # boolean mask
df.loc[df["city"] == "Mumbai", "name"]   # label based, condition + column
df.query("age > 25 and city == 'Pune'")  # query-string syntax
```

> [!info] See [[04-Indexing-Selection]] for the complete `.loc` / `.iloc` reference.

---

## Modifying Values

```python
df.loc[0, "age"] = 26                 # set single cell
df.loc[df["age"] > 30, "senior"] = True
df.replace({"Mumbai": "Bombay"})
df.where(df > 0, other=0)             # keep where True, else replace
df.mask(df < 0, other=0)              # inverse of where
```

---

## dtypes & Casting

```python
df.astype({"age": "int32", "name": "string"})
df["age"] = pd.to_numeric(df["age"], errors="coerce")
df.convert_dtypes()          # infer best nullable dtypes automatically
df.select_dtypes(include=["number"])   # filter columns by dtype
df.select_dtypes(exclude=["object"])
```

---

## Copy vs View

> [!warning] Copy-on-Write (pandas ≥ 2.0)
> With CoW enabled (default in pandas 3.0), operations like `df2 = df1[...]` never silently mutate `df1`. Before CoW, chained assignments (`df[df.a > 0]["b"] = 1`) could trigger `SettingWithCopyWarning` and fail silently. See [[Machine Learning/Libraries/Basic/Pandas/19-Common-Errors-Gotchas]].

```python
pd.set_option("mode.copy_on_write", True)   # explicit opt-in on older versions
df_copy = df.copy(deep=True)                # explicit, safe copy
```

---

## Iterating (avoid when possible)

```python
for idx, row in df.iterrows():     # slow, row is a Series (mixed dtype)
    ...

for row in df.itertuples():        # faster, row is a namedtuple
    ...

for col in df:                     # iterates column names
    ...

for col_name, series in df.items():  # iterate columns
    ...
```

> [!warning] Avoid `.iterrows()` / `.apply(axis=1)` for performance
> These are 10-100x slower than vectorized operations. Always ask: "can this be done with a vectorized expression, `.map()`, or NumPy broadcasting instead?" See [[18-Options-Performance]].

---

## Combining / Transforming Preview
- [[07-Merge-Join-Concat]] : merge, join, concat
- [[08-Reshaping]] : pivot, melt, stack
- [[06-GroupBy]] : split-apply-combine

## Related
- [[01-Series]]
- [[04-Indexing-Selection]]
- [[Machine Learning/Libraries/Basic/Pandas/19-Common-Errors-Gotchas]]
