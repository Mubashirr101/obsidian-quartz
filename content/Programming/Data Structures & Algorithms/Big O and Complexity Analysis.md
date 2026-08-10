---
tags: [dsa, complexity, big-o]
aliases: [Big O Notation, Time Complexity, Space Complexity]
---

# ⏱️ Big O and Complexity Analysis

Big O describes how an algorithm's runtime or memory usage grows as input size (`n`) grows. It ignores constants and lower-order terms, focusing on the dominant trend at scale.

## Common Complexities, Best to Worst

| Notation | Name | Example |
|---|---|---|
| O(1) | Constant | Array index access, hash table lookup |
| O(log n) | Logarithmic | Binary search, balanced BST operations |
| O(n) | Linear | Single loop through a list |
| O(n log n) | Linearithmic | Merge sort, quick sort (average) |
| O(n²) | Quadratic | Nested loops, bubble sort |
| O(2ⁿ) | Exponential | Naive recursive Fibonacci, subsets |
| O(n!) | Factorial | Generating all permutations |

```python
def constant_time(arr):
    return arr[0]                    # O(1)

def linear_time(arr):
    for x in arr:                      # O(n)
        print(x)

def quadratic_time(arr):
    for x in arr:                        # O(n²)
        for y in arr:
            print(x, y)

def logarithmic_time(n):
    while n > 1:                           # O(log n)
        n //= 2
```

## How to Analyze Code

> [!tip] Rules of thumb
> - Sequential statements: add complexities, but keep only the dominant term. `O(n) + O(n²)` simplifies to `O(n²)`.
> - Nested loops: multiply. A loop of `n` inside a loop of `m` is `O(n * m)`.
> - Loop that halves the input each time: `O(log n)`.
> - A loop calling a function that itself loops: multiply their individual complexities.
> - Drop constants: `O(2n)` and `O(n/2)` are both just `O(n)`.

```python
def example(arr):
    n = len(arr)
    for i in range(n):        # O(n)
        print(i)
    for i in range(n):        # O(n), SEPARATE loop, not nested
        for j in range(n):      # this inner loop makes it O(n²) total for this block
            print(i, j)
# Overall: O(n) + O(n²) = O(n²), the quadratic term dominates
```

## Best, Average, and Worst Case

```python
def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i        # best case O(1): target is the first element
    return -1                  # worst case O(n): target is last or missing
```

> [!warning] Big O usually refers to worst case unless stated otherwise
> When people say "quicksort is O(n log n)", they typically mean average case. Quicksort's WORST case is actually O(n²) with poor pivot choices. Always clarify which case is being discussed, especially for algorithms with different average vs worst case behavior (see [[Sorting Algorithms]]).

## Space Complexity

Measures extra memory used relative to input size, separate from time complexity.

```python
def sum_list(arr):
    total = 0                # O(1) extra space, just one variable regardless of input size
    for x in arr:
        total += x
    return total

def double_list(arr):
    return [x * 2 for x in arr]     # O(n) extra space, a whole new list proportional to input
```

> [!tip] Recursive calls cost space too
> Every recursive call adds a stack frame. A recursive function with depth `n` uses O(n) space on the call stack, even if it does no other extra allocation, this is easy to forget when only counting explicit data structures. See [[Recursion and Backtracking]].

## Amortized Complexity

Some operations are usually cheap but occasionally expensive, averaging out over many calls.

```python
lst = []
for i in range(1000):
    lst.append(i)     # O(1) amortized: occasionally list resizing costs O(n),
                          # but this happens rarely enough that the AVERAGE cost per append stays O(1)
```

## Why This Matters in Practice

> [!example] The interview and real-world lens
> An O(n²) solution might be perfectly fine for `n = 100` but catastrophic for `n = 1,000,000`. Recognizing the growth curve of your algorithm tells you whether it will actually scale to production data sizes, long before you hit performance problems in the wild.
