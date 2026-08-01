---
title: IO — Reading & Writing Data
tags: [pandas, python, io]
aliases: [pandas io, read_csv, to_csv]
---

# IO : Reading & Writing Data

> [!abstract] Definition
> pandas provides a unified family of `pd.read_*()` / `df.to_*()` functions for moving data between external formats (CSV, Excel, JSON, SQL, Parquet, HTML, clipboard) and DataFrames.

---

## CSV

```python
pd.read_csv(
    filepath_or_buffer,
    sep=",",              # delimiter
    header=0,              # row to use as column names
    names=None,             # explicit column names (use with header=None)
    index_col=None,         # column(s) to use as index
    usecols=None,           # subset of columns to load
    dtype=None,              # force dtypes, e.g. {"id": str}
    parse_dates=False,       # list of columns to parse as datetime
    na_values=None,           # additional strings to treat as NaN
    skiprows=None,             # rows to skip
    nrows=None,                 # limit number of rows read
    encoding="utf-8",
    chunksize=None              # return an iterator of chunks for large files
)

df.to_csv(
    "out.csv",
    index=False,           # don't write row index
    columns=None,           # subset of columns
    sep=",",
    encoding="utf-8",
    mode="w"                # "a" to append
)
```

```python
# Reading large files in chunks
for chunk in pd.read_csv("big.csv", chunksize=100_000):
    process(chunk)
```

---

## Excel

```python
pd.read_excel(
    "file.xlsx",
    sheet_name=0,         # name, index, or list; None = all sheets (returns dict)
    header=0,
    usecols="A:D",         # Excel-style column ranges also work
    dtype=None,
    engine="openpyxl"       # required for .xlsx
)

df.to_excel(
    "out.xlsx",
    sheet_name="Sheet1",
    index=False,
    engine="openpyxl"
)

# Writing multiple sheets
with pd.ExcelWriter("out.xlsx") as writer:
    df1.to_excel(writer, sheet_name="Data")
    df2.to_excel(writer, sheet_name="Summary")
```

> [!tip] Requires `openpyxl` (write/read `.xlsx`) or `xlrd` (legacy `.xls`). Install with `pip install openpyxl`.

---

## JSON

```python
pd.read_json("file.json", orient="records", lines=False)

df.to_json(
    "out.json",
    orient="records",     # 'split' | 'records' | 'index' | 'columns' | 'values' | 'table'
    lines=False,            # True for JSON Lines (.jsonl)
    date_format="iso",
    indent=2
)

# From/to a JSON string directly
df = pd.read_json(json_string)
json_str = df.to_json()

pd.json_normalize(nested_dict_or_list)   # flatten nested JSON into a DataFrame
```

---

## SQL

```python
import sqlalchemy
engine = sqlalchemy.create_engine("sqlite:///mydb.db")

pd.read_sql("SELECT * FROM users", engine)
pd.read_sql_table("users", engine)
pd.read_sql_query("SELECT * FROM users WHERE age > 25", engine)

df.to_sql(
    "table_name",
    engine,
    if_exists="replace",   # 'fail' | 'replace' | 'append'
    index=False
)
```

---

## Parquet / Feather (columnar, fast, typed)

```python
df.to_parquet("out.parquet", engine="pyarrow", compression="snappy")
pd.read_parquet("out.parquet", engine="pyarrow", columns=["a", "b"])

df.to_feather("out.feather")
pd.read_feather("out.feather")
```

> [!tip] Prefer Parquet over CSV for large intermediate datasets
> Parquet preserves dtypes exactly, compresses better, and reads/writes significantly faster than CSV for large data. Requires `pyarrow` or `fastparquet`.

---

## HTML

```python
tables = pd.read_html("https://example.com/page.html")  # returns list of DataFrames
df.to_html("out.html", index=False)
```

---

## Clipboard (quick interactive use)

```python
df = pd.read_clipboard()     # read whatever is copied (e.g. from Excel)
df.to_clipboard(index=False) # copy DataFrame to clipboard
```

---

## Pickle (Python-native, preserves all dtypes)

```python
df.to_pickle("out.pkl")
df = pd.read_pickle("out.pkl")
```

> [!warning] Never unpickle files from untrusted sources : pickle can execute arbitrary code.

---

## Common `read_*` Parameter Patterns

| Need | Parameter |
|---|---|
| Skip bad/malformed lines | `on_bad_lines="skip"` (CSV) |
| Treat specific strings as NaN | `na_values=["NA", "—", "N/A"]` |
| Parse dates on load | `parse_dates=["date_col"]` |
| Force a column to string (avoid losing leading zeros) | `dtype={"zip": str}` |
| Use first column as index | `index_col=0` |
| Read only some columns | `usecols=["a", "b"]` |
| Handle huge files | `chunksize=...` or switch to Parquet |

---

## Related
- [[02-DataFrame-Basics]]
- [[18-Options-Performance]]
- [[19-Common-Errors-Gotchas]]
