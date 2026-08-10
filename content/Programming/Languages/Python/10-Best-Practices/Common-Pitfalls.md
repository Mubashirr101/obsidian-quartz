---
tags: [python, best-practices, gotchas, common-pitfalls]
aliases: [Python Gotchas, Common Mistakes, Python Pitfalls]
---

# Common Pitfalls

A consolidated list of the most frequent Python traps, most of which are cross-referenced from their dedicated topic notes but collected here for quick review.

## 1. Mutable Default Arguments

```python
def add_item(item, basket=[]):     # DANGER: created ONCE at def time, shared across ALL calls
    basket.append(item)
    return basket

add_item("apple")     # ['apple']
add_item("banana")      # ['apple', 'banana']  -- leaked from the previous call!
```

Fix:

```python
def add_item(item, basket=None):
    if basket is None:
        basket = []
    basket.append(item)
    return basket
```

See [[Functions-Basics]].

## 2. Late-Binding Closures in Loops

```python
funcs = [lambda: i for i in range(3)]
[f() for f in funcs]      # [2, 2, 2], NOT [0, 1, 2]
```

Fix with a default argument to capture the current value immediately:

```python
funcs = [lambda i=i: i for i in range(3)]
```

See [[Scope-and-Closures]].

## 3. Modifying a List While Iterating Over It

```python
nums = [1, 2, 3, 4, 5]
for n in nums:
    if n % 2 == 0:
        nums.remove(n)      # skips elements! the list shrinks while the loop index advances

print(nums)     # [1, 3, 5] happens to work here, but is fragile and WRONG in general
```

Fix: iterate over a copy, or build a new list.

```python
nums = [n for n in nums if n % 2 != 0]     # cleanest fix
# or: for n in nums[:]: ...  (iterate a copy)
```

## 4. Shallow Copy vs Deep Copy

```python
original = [[1, 2], [3, 4]]
copy1 = original.copy()     # shallow: inner lists are still SHARED
copy1[0].append(99)
print(original)                # [[1, 2, 99], [3, 4]]  -- original was affected too!
```

Fix: `import copy; copy.deepcopy(original)`. See [[Lists]].

## 5. Comparing Floats with `==`

```python
0.1 + 0.2 == 0.3     # False! floating point precision error
```

Fix: `math.isclose(0.1 + 0.2, 0.3)`. See [[Numbers]].

## 6. `is` vs `==`

```python
a = [1, 2, 3]
b = [1, 2, 3]
a is b     # False, different objects
a == b       # True, same values
```

Use `==` for value comparison, `is` only for `None`/singleton identity checks. See [[Operators]].

## 7. Variable Scope: `UnboundLocalError`

```python
count = 0

def increment():
    count += 1     # UnboundLocalError, Python treats count as local due to the assignment

increment()
```

Fix: use `global count` inside the function, or better, avoid mutating globals, return a new value instead. See [[Scope-and-Closures]].

## 8. `.sort()` Returns `None`

```python
lst = [3, 1, 2]
lst = lst.sort()     # BUG: lst is now None, sort() mutates in place and returns nothing
```

Fix: use `sorted(lst)` if you need to assign the result to a new variable. See [[Lists]].

## 9. Chained Exceptions Losing Context

```python
try:
    risky()
except ValueError:
    raise RuntimeError("Failed")     # original traceback context is implicitly chained but easy to lose track of
```

Prefer explicit chaining: `raise RuntimeError("Failed") from original_error`. See [[Exceptions]].

## 10. Circular Imports

Two modules importing from each other at the top level causes `ImportError`. See [[Modules-and-Imports]] for fixes.

## 11. Integer Division Confusion

```python
7 / 2      # 3.5, true division, ALWAYS returns float
7 // 2       # 3, floor division
-7 // 2        # -4, NOT -3! floor division rounds toward negative infinity, not toward zero
```

See [[Operators]].

## 12. Truthy String Trap

```python
bool("False")      # True! any non-empty string is truthy, regardless of content
```

See [[Type-Conversion]].

## 13. `except:` Bare Clause Swallowing Everything

```python
try:
    risky()
except:            # catches EVERYTHING including KeyboardInterrupt, hides real bugs
    pass
```

Always catch a specific exception type. See [[Exceptions]].

## 14. Using `+=` on Strings in a Loop (Performance)

```python
result = ""
for word in large_list_of_words:
    result += word + " "     # creates a NEW string object every iteration, O(n^2) overall
```

Fix: accumulate in a list, then join once.

```python
result = " ".join(large_list_of_words)     # O(n), far faster
```

## 15. Forgetting `self` Is Implicit Only Through Instance Calls

```python
class Dog:
    def bark(self):
        return "Woof"

Dog.bark()          # TypeError: missing 1 required positional argument: 'self'
Dog.bark(Dog())        # works, self passed explicitly
Dog().bark()               # works, self passed automatically via instance call
```

See [[Classes-and-Objects]].
