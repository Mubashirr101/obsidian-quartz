---
title: IO — Saving & Loading Arrays
tags: [numpy, python, io]
aliases: [np.save, np.load, npy, npz]
---

# IO — Saving & Loading Arrays

> [!abstract] Definition
> NumPy has its own fast, exact binary formats (`.npy` single-array, `.npz` multi-array archive) alongside text-based options (`savetxt`/`genfromtxt`/`loadtxt`) for interoperating with CSV-like files.

---

## Binary Format — `.npy` (Single Array, Recommended for NumPy-to-NumPy)

```python
np.save("array.npy", arr)          # save a single array
loaded = np.load("array.npy")        # load it back — exact dtype/shape preserved
```

> [!tip] Prefer `.npy`/`.npz` over text formats for pure NumPy workflows
> Binary formats preserve dtype and shape exactly, and are dramatically faster to read/write than text-based CSV for large arrays.

---

## `.npz` — Multiple Arrays in One Archive

```python
np.savez("data.npz", features=X, labels=y)          # uncompressed
np.savez_compressed("data.npz", features=X, labels=y) # compressed, smaller file, slower to read/write

loaded = np.load("data.npz")
loaded["features"]           # access by the keyword name used when saving
loaded["labels"]
list(loaded.keys())            # see what arrays are stored
```

---

## Text Formats

```python
np.savetxt("out.csv", arr, delimiter=",", fmt="%.4f", header="col1,col2,col3")

np.loadtxt("out.csv", delimiter=",", skiprows=1)          # simple, fast, but no missing-value handling
np.genfromtxt("out.csv", delimiter=",", skip_header=1, filling_values=np.nan)  # handles missing values
```

| Function | Use case |
|---|---|
| `np.loadtxt` | clean, fully rectangular numeric data, no missing values |
| `np.genfromtxt` | messier data — handles missing values, mixed types, comments |
| `np.savetxt` | write an array to a plain-text delimited file |

> [!info] For anything CSV-heavy with mixed dtypes or missing data, [[03-IO-Reading-Writing|pandas' read_csv]] is almost always the better tool — NumPy's text I/O is best reserved for clean, purely numeric data.

---

## Reading a Structured/Record Array

```python
data = np.genfromtxt(
    "people.csv",
    delimiter=",",
    names=True,           # use header row as field names
    dtype=None,             # infer per-column dtype
    encoding="utf-8"
)
data["age"]                   # access a named field like a dict key
```

---

## Memory-Mapped Files (For Arrays Too Large to Fit in RAM)

```python
mmap_arr = np.memmap("big.dat", dtype="float32", mode="r", shape=(100000, 100))
mmap_arr[0:10]     # reads only the requested slice from disk, not the whole file
```

> [!tip] `memmap` for out-of-core processing
> Useful when working with arrays larger than available RAM — data is read from disk on demand rather than loaded entirely upfront.

---

## Pickle (General Python Objects, Including Arrays)

```python
import pickle
with open("arr.pkl", "wb") as f:
    pickle.dump(arr, f)

with open("arr.pkl", "rb") as f:
    arr = pickle.load(f)
```

> [!warning] Never unpickle files from untrusted sources — pickle can execute arbitrary code.

---

## Related
- [[03-IO-Reading-Writing|Pandas: IO Reading & Writing]]
- [[01-Arrays-Basics]]
- [[11-Performance-Vectorization]]
