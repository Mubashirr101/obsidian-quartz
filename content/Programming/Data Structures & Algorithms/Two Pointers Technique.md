---
tags: [dsa, techniques, two-pointers]
aliases: [Two Pointers, Two Pointer Technique]
---

# 👉 Two Pointers Technique

Uses two index variables moving through a structure (usually a sorted array or string) to avoid nested loops, often reducing an O(n²) brute force to O(n).

## Pattern 1: Opposite Ends, Moving Inward

Common for sorted arrays and palindrome checks.

```python
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1          # need a bigger sum, move left pointer up
        else:
            right -= 1            # need a smaller sum, move right pointer down
    return []

two_sum_sorted([1, 3, 5, 7, 9, 11], 12)     # [1, 4] -> 3 + 9 = 12
```

```python
def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True
```

## Container With Most Water

```python
def max_area(heights):
    left, right = 0, len(heights) - 1
    max_water = 0
    while left < right:
        width = right - left
        height = min(heights[left], heights[right])
        max_water = max(max_water, width * height)
        if heights[left] < heights[right]:
            left += 1        # the shorter side is the bottleneck, moving it is the only way to potentially improve
        else:
            right -= 1
    return max_water

max_area([1, 8, 6, 2, 5, 4, 8, 3, 7])     # 49
```

## Pattern 2: Same Direction, Different Speeds (Fast/Slow)

Used to detect cycles or find positions relative to the end of a structure without knowing its length upfront.

```python
def remove_duplicates(sorted_arr):        # in-place dedup of a sorted array
    if not sorted_arr:
        return 0
    slow = 0
    for fast in range(1, len(sorted_arr)):
        if sorted_arr[fast] != sorted_arr[slow]:
            slow += 1
            sorted_arr[slow] = sorted_arr[fast]
    return slow + 1     # new length after removing duplicates

arr = [1, 1, 2, 2, 3]
new_len = remove_duplicates(arr)     # 3, arr now starts with [1, 2, 3, ...]
```

See [[Linked Lists]] for the fast/slow pointer cycle-detection application (Floyd's algorithm).

## Pattern 3: Merging Two Sorted Sequences

```python
def merge_sorted_arrays(a, b):
    result = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i])
            i += 1
        else:
            result.append(b[j])
            j += 1
    result.extend(a[i:])
    result.extend(b[j:])
    return result     # O(n + m), the merge step from merge sort itself
```

## 3Sum: Extending Two Pointers with an Outer Loop

```python
def three_sum(nums):
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue          # skip duplicate anchors to avoid duplicate triplets
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                while left < right and nums[left] == nums[left - 1]:
                    left += 1          # skip duplicates
                while left < right and nums[right] == nums[right + 1]:
                    right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1
    return result

three_sum([-1, 0, 1, 2, -1, -4])     # [[-1, -1, 2], [-1, 0, 1]]
```

O(n²) overall, better than the naive O(n³) triple-nested-loop approach.

## Recognizing Two-Pointer Problems

> [!tip] Signals to watch for
> - The array/string is SORTED, or sorting it wouldn't break the problem.
> - You're looking for a PAIR or triplet satisfying some sum/difference condition.
> - You need to compare elements from OPPOSITE ends (palindromes, reversing).
> - A naive solution uses nested loops that could collapse into one pass with two markers.
