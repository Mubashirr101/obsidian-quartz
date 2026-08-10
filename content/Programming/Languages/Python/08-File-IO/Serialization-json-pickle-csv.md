---
tags: [python, file-io, serialization, json, csv, pickle]
aliases: [JSON, CSV, Pickle, Serialization]
---

# Serialization: json, csv, pickle

Serialization converts Python objects into a storable/transmittable format, and deserialization reverses it.

## `json`: Human-Readable, Cross-Language

```python
import json

data = {"name": "Bob", "age": 25, "active": True, "tags": ["a", "b"]}

# Object -> string
json_str = json.dumps(data)                       # compact string
json_str_pretty = json.dumps(data, indent=2)        # pretty-printed, human readable
json_str_sorted = json.dumps(data, sort_keys=True)     # keys alphabetically ordered

# string -> Object
parsed = json.loads(json_str)

# Object -> file
with open("data.json", "w") as f:
    json.dump(data, f, indent=2)

# file -> Object
with open("data.json") as f:
    loaded = json.load(f)
```

### Type Mapping

| Python | JSON |
|---|---|
| `dict` | object |
| `list`, `tuple` | array |
| `str` | string |
| `int`, `float` | number |
| `True`/`False` | true/false |
| `None` | null |

> [!warning] JSON cannot represent all Python types natively
> Tuples become JSON arrays and come back as lists (the tuple-ness is lost on round-trip). Custom objects, `datetime`, `set`, and `Decimal` all need custom handling via `default=` in `json.dumps()` or a custom decoder.

```python
from datetime import datetime

def default_serializer(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

json.dumps({"created": datetime.now()}, default=default_serializer)
```

## `csv`: Tabular Data

```python
import csv

# Writing
with open("output.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "age"])          # header row
    writer.writerow(["Bob", 25])
    writer.writerows([["Amy", 30], ["Tom", 22]])   # multiple rows at once

# Reading
with open("output.csv", encoding="utf-8") as f:
    reader = csv.reader(f)
    header = next(reader)          # consume the header row separately
    for row in reader:
        print(row)                    # each row is a list of strings
```

> [!warning] Always pass `newline=""` when opening a CSV file for writing
> Without it, Windows systems can introduce extra blank lines between rows, because both Python's text mode and the `csv` module try to handle newline translation.

### `DictReader` / `DictWriter` (Preferred for Named Columns)

```python
with open("output.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["age"])     # access by column name, not position

with open("output.csv", "w", newline="", encoding="utf-8") as f:
    fieldnames = ["name", "age"]
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerow({"name": "Bob", "age": 25})
```

> [!tip] For anything beyond quick scripts, consider pandas
> `csv.DictReader` is great for simple line-by-line processing. For actual data analysis (filtering, grouping, joining, statistics), `pandas.read_csv()` is far more capable, see the dedicated Pandas folder.

## `pickle`: Python-Specific Binary Serialization

Can serialize almost any Python object (including custom classes), but is NOT human readable, NOT cross-language, and NOT safe to load from untrusted sources.

```python
import pickle

data = {"name": "Bob", "scores": [1, 2, 3]}

# Object -> bytes
with open("data.pkl", "wb") as f:
    pickle.dump(data, f)

# bytes -> Object
with open("data.pkl", "rb") as f:
    loaded = pickle.load(f)
```

> [!warning] Never unpickle data from an untrusted source
> Unlike `json.loads()`, `pickle.load()` can execute arbitrary code during deserialization. Only unpickle files you created yourself or that come from a fully trusted source. This is a genuine, well-documented security vulnerability, not a theoretical concern.

## Choosing the Right Format

| Need | Use |
|---|---|
| Human-readable, cross-language, web APIs | `json` |
| Simple tabular/spreadsheet-like data | `csv` (or pandas for analysis) |
| Full-fidelity Python objects, same-trust-boundary only | `pickle` |
| Structured tabular analytics on large data | Parquet (via pandas/pyarrow), not covered here |
