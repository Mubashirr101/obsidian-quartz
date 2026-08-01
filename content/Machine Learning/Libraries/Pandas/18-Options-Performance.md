---
title: Options, Settings & Performance
tags: [pandas, python, performance, optimization]
aliases: [pd.options, set_option, performance tips]
---

# Options, Settings & Performance

> [!abstract] Definition
> pandas exposes global display/behavior settings via `pd.options`/`pd.set_option()`, and offers several techniques (dtype optimization, vectorization, chunking, `eval`/`query`) to speed up operations on large DataFrames.

---

## Display Options

```python
pd.set_option("display.max_rows", 100)
pd.set_option("display.max_columns", 50)
pd.set_option("display.width", 120)
pd.set_option("display.float_format", "{:.2f}".format)
pd.set_option("display.max_colwidth", 50)

pd.reset_option("display.max_rows")     # revert a single option
pd.reset_option("all")                    # revert everything

with pd.option_context("display.max_rows", 10):    # temporary, scoped setting
    print(df)
```

---

## Copy-on-Write

```python
pd.set_option("mode.copy_on_write", True)   # default from pandas 3.0 onward
```

> [!info] What CoW changes
> With Copy-on-Write enabled, any operation that looks like it returns a "view" (slicing, filtering) behaves as an independent copy the moment either object is modified — eliminating `SettingWithCopyWarning` and chained-assignment bugs entirely. See [[19-Common-Errors-Gotchas]].

---

## Memory Optimization

```python
df.memory_usage(deep=True)                  # per-column memory (deep=True includes object overhead)
df.info(memory_usage="deep")

df["city"] = df["city"].astype("category")     # big win for low-cardinality strings, see 15-Categorical-Data
df["id"] = df["id"].astype("int32")               # downcast from int64 if values fit
df["flag"] = df["flag"].astype("bool")

pd.to_numeric(df["col"], downcast="integer")         # auto-pick smallest sufficient int type
pd.to_numeric(df["col"], downcast="float")

df = df.convert_dtypes()      # let pandas infer best nullable dtypes automatically
```

---

## Reading Large Files Efficiently

```python
pd.read_csv("big.csv", usecols=["a", "b", "c"])      # skip unneeded columns
pd.read_csv("big.csv", dtype={"id": "int32"})           # specify dtypes up front, skip inference cost
for chunk in pd.read_csv("big.csv", chunksize=100_000):  # process in chunks
    ...

df.to_parquet("out.parquet")     # switch to a columnar, typed format for repeat reads — see 03-IO-Reading-Writing
```

---

## Vectorization Reminders (full detail in [[11-Apply-Map-Vectorization]])

```python
# Fast: vectorized
df["total"] = df["price"] * df["qty"]

# Slow: row-wise apply
df["total"] = df.apply(lambda r: r["price"] * r["qty"], axis=1)

# Slowest: manual loop
for i in range(len(df)):
    df.loc[i, "total"] = df.loc[i, "price"] * df.loc[i, "qty"]
```

---

## `eval()` and `query()` — numexpr-Backed Speed

```python
df.eval("total = price * qty", inplace=True)
df.query("total > 1000 and city == 'Mumbai'")
```

> [!tip] When `eval`/`query` actually help
> They shine on **large DataFrames (100k+ rows)** with multiple arithmetic/boolean operations chained together, because `numexpr` avoids allocating intermediate temporary arrays for each sub-expression. On small DataFrames, the overhead of parsing the expression string can make them *slower* than plain vectorized pandas.

---

## Profiling

```python
%timeit df["col"].sum()             # Jupyter/IPython magic — measure execution time
df.info(memory_usage="deep")          # inspect memory footprint
```

---

## General Performance Checklist

> [!tip] Order of operations to try, roughly fastest-win-first
> 1. Use vectorized arithmetic/string/datetime operations instead of loops or `.apply()`.
> 2. Downcast numeric dtypes; convert low-cardinality strings to `category`.
> 3. Load only needed columns/rows (`usecols`, `nrows`, filters at the SQL/query level).
> 4. Switch large intermediate files to Parquet instead of CSV.
> 5. Use `.query()`/`.eval()` for large, expression-heavy filtering.
> 6. If still slow at scale, consider chunked processing or a distributed engine (Dask, Polars, PySpark) that mirrors pandas' API.

---

## Related
- [[11-Apply-Map-Vectorization]]
- [[15-Categorical-Data]]
- [[03-IO-Reading-Writing]]
- [[19-Common-Errors-Gotchas]]
