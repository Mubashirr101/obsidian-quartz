---
tags: [dsa, strings]
aliases: [String Algorithms, String Manipulation DSA]
---

# 🔤 String Algorithms

Strings in Python are immutable sequences, which shapes how algorithms on them are written (see [[Strings]] in the core Python folder for the language mechanics).

## Reversing a String

```python
s = "hello"
s[::-1]     # 'olleh', O(n) time, O(n) space (new string, since strings are immutable)
```

## Palindrome Check

```python
def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True     # O(n) time, O(1) extra space
```

See [[Two Pointers Technique]], this is the canonical two-pointer pattern.

## Anagram Check

```python
def is_anagram(s1, s2):
    if len(s1) != len(s2):
        return False
    return sorted(s1) == sorted(s2)          # O(n log n), simple

from collections import Counter
def is_anagram_fast(s1, s2):
    return Counter(s1) == Counter(s2)          # O(n), faster for large strings
```

## Substring Search

```python
"needle" in "haystack with needle inside"     # O(n*m) worst case, built-in, good enough for most uses

s = "haystack with needle inside"
s.find("needle")        # 15, index of first occurrence, -1 if not found
```

### Sliding Window: Longest Substring Without Repeating Characters

```python
def longest_unique_substring(s):
    seen = {}
    start = 0
    max_length = 0
    for end, char in enumerate(s):
        if char in seen and seen[char] >= start:
            start = seen[char] + 1       # shrink window past the previous occurrence
        seen[char] = end
        max_length = max(max_length, end - start + 1)
    return max_length

longest_unique_substring("abcabcbb")     # 3, "abc"
```

O(n) time using the sliding window technique, see [[Sliding Window Technique]].

## String Building Efficiently

```python
# Inefficient: O(n²) overall, each += creates a new string
result = ""
for word in words:
    result += word

# Efficient: O(n) overall
result = "".join(words)
```

See [[Common-Pitfalls]] in the core Python folder for why `+=` in a loop is a trap.

## Longest Common Prefix

```python
def longest_common_prefix(strs):
    if not strs:
        return ""
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix

longest_common_prefix(["flower", "flow", "flight"])     # 'fl'
```

## Character Frequency Counting

```python
from collections import Counter

def first_unique_char(s):
    counts = Counter(s)
    for i, char in enumerate(s):
        if counts[char] == 1:
            return i
    return -1

first_unique_char("leetcode")     # 0, 'l' appears only once
```

## String Matching: Two-Pointer Comparison with Wildcards (Conceptual)

```python
def is_match_simple(s, pattern):
    # simplified example: '.' matches any single character, no '*' handling
    if len(s) != len(pattern):
        return False
    return all(p == '.' or p == c for c, p in zip(s, pattern))
```

> [!tip] Full wildcard/regex matching is a dynamic programming problem
> Real wildcard matching (`*` and `?`) is typically solved with DP, not simple iteration, see [[Dynamic Programming]]. Python's `re` module (see the core Python folder's [[Regular-Expressions]] note) already handles this robustly for real-world use.
