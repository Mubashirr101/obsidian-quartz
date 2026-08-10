---
tags: [dsa, bit-manipulation, bitwise]
aliases: [Bit Manipulation, Bitwise Tricks]
---

# 🧮 Bit Manipulation

Working directly with the binary representation of numbers. Often turns problems requiring extra space or loops into O(1) constant-time operations using clever bit tricks.

## The Core Bitwise Operators (Recap)

```python
5 & 3    # 1   AND: bit is 1 only if BOTH bits are 1
5 | 3    # 7   OR: bit is 1 if EITHER bit is 1
5 ^ 3    # 6   XOR: bit is 1 if bits DIFFER
~5       # -6  NOT: inverts every bit
5 << 1   # 10  left shift: multiply by 2 per shift
5 >> 1   # 2   right shift: divide by 2 per shift (floor)
```

See the core Python folder's [[Operators]] note for the base syntax.

## Checking, Setting, and Clearing Bits

```python
def get_bit(num, i):
    return (num >> i) & 1        # shift the target bit to position 0, mask everything else off

def set_bit(num, i):
    return num | (1 << i)          # OR with a mask that has only bit i set

def clear_bit(num, i):
    return num & ~(1 << i)           # AND with a mask that has every bit set EXCEPT bit i

def toggle_bit(num, i):
    return num ^ (1 << i)              # XOR flips exactly the target bit

get_bit(5, 0)      # 1, since 5 is 101 in binary
set_bit(5, 1)         # 7, sets bit 1: 101 -> 111
clear_bit(5, 0)          # 4, clears bit 0: 101 -> 100
```

## Counting Set Bits

```python
def count_bits(n):
    count = 0
    while n:
        count += n & 1
        n >>= 1
    return count

bin(13)              # '0b1101'
count_bits(13)           # 3

bin(13).count("1")          # 3, simpler built-in approach for everyday use
```

### Brian Kernighan's Trick (Faster: Skips Straight to Each Set Bit)

```python
def count_bits_fast(n):
    count = 0
    while n:
        n &= (n - 1)     # clears the LOWEST set bit each iteration
        count += 1
    return count
```

> [!tip] Why `n & (n - 1)` clears the lowest set bit
> Subtracting 1 flips all bits from the lowest set bit downward. ANDing with the original number keeps everything above that bit unchanged while zeroing out that lowest set bit and everything below it. This makes the loop run only as many times as there are SET bits, not the total bit width.

## XOR Tricks

```python
5 ^ 5     # 0, a number XORed with itself is always 0
5 ^ 0        # 5, a number XORed with 0 is unchanged
```

### Finding the Single Number Among Duplicates

```python
def single_number(nums):
    result = 0
    for num in nums:
        result ^= num     # every PAIR of duplicates cancels out to 0, leaving only the unpaired value
    return result

single_number([4, 1, 2, 1, 2])     # 4
```

O(n) time, O(1) space, dramatically simpler than the equivalent hash-set-counting approach.

### Swapping Without a Temp Variable

```python
a, b = 5, 3
a ^= b
b ^= a
a ^= b
# a=3, b=5, no temp variable needed (though Python's a, b = b, a is simpler and preferred in practice)
```

## Checking If a Number Is a Power of 2

```python
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0

is_power_of_two(16)     # True, 16 is 10000, 15 is 01111, AND is 0
is_power_of_two(18)        # False
```

> [!tip] Why this works
> A power of 2 has EXACTLY one set bit. Subtracting 1 flips that bit off and every bit below it on. ANDing the two together always yields 0 for a true power of 2, and something nonzero otherwise.

## Reversing Bits

```python
def reverse_bits(n, bit_length=32):
    result = 0
    for i in range(bit_length):
        bit = (n >> i) & 1
        result |= (bit << (bit_length - 1 - i))
    return result
```

## Bitmasking for Subsets

Any subset of a set of `n` elements can be represented as an `n`-bit number, where bit `i` indicates whether element `i` is included. This gives a clean way to iterate over ALL 2ⁿ subsets.

```python
def all_subsets(nums):
    n = len(nums)
    subsets = []
    for mask in range(1 << n):          # 1 << n = 2^n, all possible bitmasks
        subset = [nums[i] for i in range(n) if mask & (1 << i)]
        subsets.append(subset)
    return subsets

all_subsets([1, 2, 3])
# [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
```

> [!tip] Bitmask DP
> This same idea extends into "bitmask dynamic programming," used for problems like the Traveling Salesman Problem on small inputs, where `dp[mask][i]` represents the best result having visited exactly the set of nodes in `mask`, ending at node `i`.

## Recognizing Bit Manipulation Problems

> [!tip] Signals to watch for
> - Anything involving powers of 2, binary representations, or "using O(1) extra space."
> - Finding a unique/missing/duplicate number among otherwise-paired values (XOR tricks).
> - Small input sizes (`n <= 20` or so) hinting at a bitmask-based subset enumeration or DP.
> - Explicit mentions of AND/OR/XOR/shift operations in the problem statement itself.
