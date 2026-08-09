---
tags: [python, data-structures, sets]
aliases: [Python Sets, set]
---

# Sets

Sets are unordered collections of unique, hashable elements. They are optimized for membership testing and eliminating duplicates.

## Creating Sets

```python
empty = set()          # NOT {}, that creates an empty dict!
s = {1, 2, 3}
s2 = set([1, 2, 2, 3])    # {1, 2, 3}, duplicates removed automatically
s3 = set("hello")           # {'h', 'e', 'l', 'o'}, unique characters
```

> [!warning] `{}` is an empty dict, not an empty set
> Python reserves `{}` for dictionaries. Always use `set()` to create an empty set.

## Adding and Removing

```python
s = {1, 2, 3}
s.add(4)                # {1, 2, 3, 4}
s.remove(2)                # raises KeyError if 2 is not present
s.discard(99)                 # does nothing if 99 is not present, no error
s.pop()                          # removes and returns an ARBITRARY element (sets are unordered)
s.clear()                           # empties the set
```

> [!tip] `remove()` vs `discard()`
> Use `discard()` when you are not sure the element exists and do not want an exception. Use `remove()` when the element's presence is guaranteed by your logic and a missing element indicates a bug.

## Set Operations (Math-Style)

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

a | b        # {1,2,3,4,5,6}  union
a.union(b)     # same as above

a & b            # {3, 4}  intersection
a.intersection(b)  # same

a - b               # {1, 2}  difference (in a but not b)
a.difference(b)       # same

a ^ b                   # {1,2,5,6}  symmetric difference (in one but not both)
a.symmetric_difference(b)  # same
```

## Set Relationships

```python
a = {1, 2}
b = {1, 2, 3}

a.issubset(b)         # True, all elements of a are in b
b.issuperset(a)          # True, b contains all elements of a
a.isdisjoint({5, 6})       # True, no overlap
```

## Membership Testing (The Main Reason to Use a Set)

```python
big_list = list(range(1_000_000))
big_set = set(big_list)

99999 in big_list     # slow, O(n) linear scan
99999 in big_set        # fast, O(1) average case hash lookup
```

> [!tip] Performance rule of thumb
> If you find yourself repeatedly checking `x in some_list` inside a loop, convert `some_list` to a `set` first. This alone can turn an O(n^2) algorithm into O(n).

## Removing Duplicates from a List

```python
lst = [3, 1, 2, 3, 1, 4]
unique = list(set(lst))     # order NOT guaranteed to be preserved
unique_ordered = list(dict.fromkeys(lst))   # order preserved, use this if order matters
```

## Set Comprehensions

```python
squares = {x**2 for x in range(10)}
evens = {x for x in range(20) if x % 2 == 0}
```

## `frozenset` (Immutable Set)

```python
fs = frozenset([1, 2, 3])
fs.add(4)        # AttributeError, frozensets have no mutating methods

# Frozensets are hashable, so they can be dict keys or set members
cache = {frozenset({1, 2}): "result_a"}
```

## Limitation: Elements Must Be Hashable

```python
s = {[1, 2], [3, 4]}    # TypeError: unhashable type: 'list'
s = {(1, 2), (3, 4)}     # fine, tuples are hashable
```
