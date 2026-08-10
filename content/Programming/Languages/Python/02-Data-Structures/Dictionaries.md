---
tags: [python, data-structures, dictionaries]
aliases: [Python Dictionaries, dict]
---

# Dictionaries

Dictionaries store key-value pairs. Since Python 3.7, insertion order is guaranteed and preserved.

## Creating Dictionaries

```python
empty = {}
d = {"name": "Zeltrax", "city": "Mumbai"}
d2 = dict(name="Zeltrax", city="Mumbai")
d3 = dict([("a", 1), ("b", 2)])
d4 = {k: v for k, v in [("a", 1), ("b", 2)]}   # dict comprehension
```

## Accessing Values

```python
d = {"name": "Bob", "age": 25}
d["name"]              # 'Bob'
d["missing"]              # KeyError!
d.get("missing")            # None, safe access, no exception
d.get("missing", "N/A")       # 'N/A', custom default
```

> [!tip] Always prefer `.get()` for optional keys
> Direct bracket access `d[key]` should only be used when you are certain the key exists (or you want the exception as a signal). Otherwise use `.get(key, default)`.

## Adding and Updating

```python
d = {"name": "Bob"}
d["age"] = 25                # add new key
d["name"] = "Robert"           # update existing key
d.update({"age": 26, "city": "Mumbai"})   # merge multiple keys at once
d |= {"active": True}            # merge operator (Python 3.9+), same as update
```

## Removing Keys

```python
d = {"a": 1, "b": 2, "c": 3}
del d["a"]                    # removes key, KeyError if missing
d.pop("b")                      # removes and returns value, KeyError if missing
d.pop("z", None)                  # safe pop with default
d.popitem()                         # removes and returns the LAST inserted (key, value) pair
d.clear()                             # empties the dict
```

## Checking Membership

```python
d = {"name": "Bob"}
"name" in d           # True, checks KEYS by default
"Bob" in d.values()      # True, checks values explicitly
```

## Iterating

```python
d = {"a": 1, "b": 2, "c": 3}

for key in d:                    # iterates keys by default
    print(key)

for key in d.keys():
    print(key)

for value in d.values():
    print(value)

for key, value in d.items():
    print(key, value)
```

> [!warning] Never mutate a dict while iterating over it
> Adding or removing keys during iteration raises `RuntimeError: dictionary changed size during iteration`. Iterate over `list(d.keys())` or `list(d.items())` if you need to modify the dict inside the loop.

## `defaultdict` (from `collections`)

Automatically supplies a default value for missing keys, eliminating manual existence checks.

```python
from collections import defaultdict

word_count = defaultdict(int)
for word in ["a", "b", "a", "c", "a"]:
    word_count[word] += 1    # no need to check if key exists first
# defaultdict(<class 'int'>, {'a': 3, 'b': 1, 'c': 1})

groups = defaultdict(list)
for name, category in [("apple", "fruit"), ("carrot", "veg"), ("banana", "fruit")]:
    groups[category].append(name)
# {'fruit': ['apple', 'banana'], 'veg': ['carrot']}
```

## `Counter` (from `collections`)

Purpose-built for counting hashable objects.

```python
from collections import Counter

Counter("mississippi")
# Counter({'i': 4, 's': 4, 'p': 2, 'm': 1})

c = Counter(["a", "b", "a", "c", "a"])
c.most_common(2)     # [('a', 3), ('b', 1)]
```

## Merging Dictionaries

```python
d1 = {"a": 1, "b": 2}
d2 = {"b": 3, "c": 4}

merged = {**d1, **d2}       # {'a': 1, 'b': 3, 'c': 4}, d2 wins on conflicts
merged = d1 | d2               # same result (Python 3.9+)
```

## Dictionary Comprehensions

```python
squares = {x: x**2 for x in range(5)}     # {0:0, 1:1, 2:4, 3:9, 4:16}
filtered = {k: v for k, v in d.items() if v > 1}
inverted = {v: k for k, v in d.items()}      # swap keys and values
```

## Nested Dictionaries

```python
users = {
    "u1": {"name": "Bob", "roles": ["admin"]},
    "u2": {"name": "Amy", "roles": ["editor", "viewer"]},
}
users["u1"]["name"]        # 'Bob'
users["u2"]["roles"].append("admin")
```

## Sorting a Dictionary

Dictionaries themselves cannot be sorted in place (they are unordered logically, though insertion order preserving). Sort into a new dict or list of tuples.

```python
d = {"banana": 3, "apple": 5, "cherry": 1}
sorted(d.items(), key=lambda kv: kv[1])          # sort by value -> list of tuples
dict(sorted(d.items(), key=lambda kv: kv[1]))     # sort by value -> new dict
dict(sorted(d.items()))                             # sort by key
```

## Dict Methods Quick Reference

| Method | Effect |
|---|---|
| `get(k, default)` | Safe access |
| `setdefault(k, default)` | Get value, or set and return default if missing |
| `update(other)` | Merge another dict/iterable of pairs |
| `pop(k, default)` | Remove and return value |
| `popitem()` | Remove and return last inserted pair |
| `keys()`, `values()`, `items()` | Views over the dict |
| `fromkeys(iterable, value)` | Build dict from an iterable of keys |

```python
d = {}
d.setdefault("visits", 0)
d["visits"] += 1     # useful one-liner init-and-increment pattern
```
