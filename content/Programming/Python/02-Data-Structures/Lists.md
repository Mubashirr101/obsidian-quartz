---
tags: [python, data-structures, lists]
aliases: [Python Lists, list]
---

# Lists

Lists are ordered, mutable, and allow duplicate elements. They are Python's default general purpose container.

## Creating Lists

```python
empty = []
nums = [1, 2, 3]
mixed = [1, "two", 3.0, [4, 5]]     # can hold different types, even nested lists
from_range = list(range(5))          # [0, 1, 2, 3, 4]
repeated = [0] * 5                    # [0, 0, 0, 0, 0]
```

> [!warning] Repeating nested mutable objects
> `[[0] * 3] * 3` creates a list of 3 references to the SAME inner list, not 3 independent lists. Mutating one row mutates all of them. Use a list comprehension instead: `[[0] * 3 for _ in range(3)]`.

## Indexing and Slicing

```python
lst = [10, 20, 30, 40, 50]
lst[0]          # 10
lst[-1]          # 50
lst[1:3]          # [20, 30]
lst[:2]            # [10, 20]
lst[::-1]           # [50, 40, 30, 20, 10], reversed copy
lst[::2]             # [10, 30, 50]
```

## Adding Elements

```python
lst = [1, 2, 3]
lst.append(4)          # [1, 2, 3, 4], adds single item to end
lst.extend([5, 6])       # [1, 2, 3, 4, 5, 6], adds each item from iterable
lst.insert(0, 0)          # [0, 1, 2, 3, 4, 5, 6], insert at index
lst += [7]                  # same effect as extend
```

> [!warning] `append` vs `extend`
> `lst.append([5, 6])` adds the WHOLE list as a single nested element: `[1, 2, 3, [5, 6]]`. Use `extend()` when you want to add each item individually.

## Removing Elements

```python
lst = [1, 2, 3, 2, 1]
lst.remove(2)         # removes FIRST occurrence of value 2 -> [1, 3, 2, 1]
lst.pop()               # removes and returns last item -> 1
lst.pop(0)                # removes and returns item at index 0
del lst[0]                  # removes item at index, no return value
lst.clear()                  # empties the list entirely
```

> [!tip] `pop()` vs `remove()`
> `pop(index)` operates by position and returns the removed value, useful for stack/queue style logic. `remove(value)` operates by value and raises `ValueError` if not found.

## Searching and Counting

```python
lst = [10, 20, 30, 20]
20 in lst              # True
lst.index(20)            # 1, index of first occurrence
lst.count(20)              # 2, number of occurrences
```

## Sorting

```python
lst = [3, 1, 4, 1, 5]
lst.sort()                          # sorts in place, returns None
lst.sort(reverse=True)                # descending
sorted(lst)                            # returns a NEW sorted list, original unchanged

words = ["banana", "apple", "cherry"]
words.sort(key=len)                     # sort by custom key function
words.sort(key=lambda w: w[-1])          # sort by last letter

people = [{"name": "Bob", "age": 25}, {"name": "Amy", "age": 30}]
people.sort(key=lambda p: p["age"])       # sort list of dicts by a field
```

> [!warning] `.sort()` returns `None`
> `lst = lst.sort()` sets `lst` to `None`, a classic bug. `.sort()` mutates in place and returns nothing. Use `sorted(lst)` if you need a new list assigned to a variable.

## Reversing

```python
lst = [1, 2, 3]
lst.reverse()          # reverses in place
list(reversed(lst))      # returns a reversed iterator, wrap in list()
```

## Copying Lists (Shallow vs Deep)

```python
original = [1, 2, [3, 4]]
shallow = original.copy()      # or list(original) or original[:]
shallow[0] = 99                  # does not affect original
shallow[2].append(5)               # DOES affect original! nested list is shared

import copy
deep = copy.deepcopy(original)      # fully independent copy, including nested objects
```

> [!warning] Shallow copy pitfall
> `.copy()`, `list()`, and `[:]` all create shallow copies. Nested mutable objects (lists inside lists, dicts inside lists) are still shared references. Use `copy.deepcopy()` when the list contains nested mutable structures you need fully independent.

## List Methods Quick Reference

| Method | Effect |
|---|---|
| `append(x)` | Add single item to end |
| `extend(iterable)` | Add each item from iterable |
| `insert(i, x)` | Insert item at index |
| `remove(x)` | Remove first occurrence of value |
| `pop(i=-1)` | Remove and return item at index |
| `clear()` | Remove all items |
| `index(x)` | Return index of first occurrence |
| `count(x)` | Count occurrences |
| `sort(key=, reverse=)` | Sort in place |
| `reverse()` | Reverse in place |
| `copy()` | Shallow copy |

## Common Patterns

```python
# Flatten a list of lists (one level)
nested = [[1, 2], [3, 4], [5]]
flat = [item for sub in nested for item in sub]   # [1, 2, 3, 4, 5]

# Remove duplicates while preserving order (Python 3.7+ dict preserves insertion order)
lst = [3, 1, 2, 3, 1]
unique = list(dict.fromkeys(lst))    # [3, 1, 2]

# Chunk a list into groups of n
def chunk(lst, n):
    return [lst[i:i + n] for i in range(0, len(lst), n)]

chunk([1, 2, 3, 4, 5], 2)     # [[1, 2], [3, 4], [5]]
```

See [[Comprehensions]] for list comprehension syntax in depth, and [[Tuples]] for the immutable counterpart.
