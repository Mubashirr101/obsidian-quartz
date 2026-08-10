---
tags: [dsa, techniques, sliding-window]
aliases: [Sliding Window, Sliding Window Technique]
---

# 🪟 Sliding Window Technique

Maintains a "window" (a contiguous subarray/substring) that expands and shrinks as it slides across the data, avoiding recomputation from scratch at every position. Turns many O(n²) or O(n³) brute-force problems into O(n).

## Pattern 1: Fixed-Size Window

```python
def max_sum_subarray(arr, k):
    window_sum = sum(arr[:k])          # compute the FIRST window directly
    max_sum = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]     # slide: add new element, remove the one that fell out
        max_sum = max(max_sum, window_sum)
    return max_sum

max_sum_subarray([2, 1, 5, 1, 3, 2], 3)     # 9, from [5, 1, 3]
```

> [!tip] The core trick: incremental updates instead of recomputation
> Recomputing `sum(arr[i:i+k])` fresh at every position is O(n*k) overall. Sliding the window by subtracting the outgoing element and adding the incoming one keeps each step O(1), for O(n) total.

## Pattern 2: Variable-Size Window (Expand and Shrink)

Used when the window size isn't fixed, it grows while a condition holds and shrinks when it's violated.

```python
def smallest_subarray_with_sum(arr, target):
    left = 0
    current_sum = 0
    min_length = float("inf")

    for right in range(len(arr)):
        current_sum += arr[right]                # expand the window
        while current_sum >= target:
            min_length = min(min_length, right - left + 1)
            current_sum -= arr[left]                # shrink from the left
            left += 1

    return min_length if min_length != float("inf") else 0

smallest_subarray_with_sum([2, 1, 5, 2, 3, 2], 7)     # 2, from [5, 2]
```

## Longest Substring Without Repeating Characters

```python
def longest_unique_substring(s):
    seen = {}
    left = 0
    max_length = 0
    for right, char in enumerate(s):
        if char in seen and seen[char] >= left:
            left = seen[char] + 1          # jump the window start PAST the duplicate
        seen[char] = right
        max_length = max(max_length, right - left + 1)
    return max_length

longest_unique_substring("abcabcbb")     # 3, "abc"
```

Covered in more depth in [[String Algorithms]], included here since it's the canonical variable-window example.

## Minimum Window Substring (Harder Variant)

```python
from collections import Counter

def min_window(s, t):
    if not t or not s:
        return ""

    need = Counter(t)
    missing = len(t)          # total characters still needed
    left = 0
    best_left, best_right = 0, float("inf")

    for right, char in enumerate(s, 1):
        if need[char] > 0:
            missing -= 1
        need[char] -= 1

        while missing == 0:               # window contains everything needed, try to shrink it
            if right - left < best_right - best_left:
                best_left, best_right = left, right
            need[s[left]] += 1
            if need[s[left]] > 0:
                missing += 1
            left += 1

    return s[best_left:best_right] if best_right != float("inf") else ""

min_window("ADOBECODEBANC", "ABC")     # 'BANC'
```

## Maximum Sliding Window (Using a Deque)

Already covered in depth in [[Queues and Deques]], included here as a cross-reference since it's fundamentally a sliding window problem paired with a monotonic deque for O(1) max retrieval per step.

## Sliding Window vs Two Pointers

> [!tip] They're closely related, not identical
> Sliding window specifically deals with CONTIGUOUS subarrays/substrings, tracking a running aggregate (sum, count, frequency map) as the window moves. Two pointers ([[Two Pointers Technique]]) is the more general pattern, pointers don't have to define a contiguous window and don't always move in the same direction. Many sliding window problems ARE a form of two pointers, but not all two-pointer problems involve a window.

## Recognizing Sliding Window Problems

> [!tip] Signals to watch for
> - The problem involves a CONTIGUOUS subarray or substring.
> - Keywords: "longest", "shortest", "maximum sum of size k", "smallest window containing".
> - A brute force would check every possible contiguous range, an obvious O(n²) or worse starting point that a window can usually collapse to O(n).
