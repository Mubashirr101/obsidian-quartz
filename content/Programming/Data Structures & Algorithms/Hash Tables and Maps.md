---
tags: [dsa, hash-tables, hash-maps]
aliases: [Hash Table, Hash Map, Dictionary DSA]
---

# 🗺️ Hash Tables and Maps

A hash table maps keys to values using a hash function to compute an index into an underlying array, giving average O(1) lookup, insert, and delete. Python's `dict` and `set` ARE hash tables under the hood.

## How Hashing Works (Conceptually)

```python
def simple_hash(key, table_size):
    return sum(ord(c) for c in key) % table_size     # toy example, real hash functions are far more robust

simple_hash("apple", 10)     # some index between 0 and 9
```

`hash()` in Python is built in and used automatically by `dict`/`set`:

```python
hash("apple")     # a large integer, consistent within a single process run
hash(42)              # ints hash to themselves for small values
hash((1, 2))              # tuples are hashable if their contents are
hash([1, 2])                 # TypeError! lists are unhashable, mutability breaks the hash guarantee
```

## Collisions

Two different keys can hash to the same slot. Common resolution strategies:

- **Chaining**: each slot holds a list of entries that hashed there.
- **Open addressing**: probe for the next free slot instead of chaining (Python's `dict` uses a variant of open addressing internally).

> [!info] You rarely implement this yourself in Python
> `dict` and `set` are highly optimized C implementations. The main practical skill is RECOGNIZING when a hash table is the right tool, not reimplementing one from scratch, though understanding the internals explains WHY operations are O(1) average but O(n) worst case (with many collisions).

## The Core Pattern: Trading Space for Time

The single most common DSA trick: replace an O(n) linear scan with an O(1) hash lookup by pre-storing seen values.

```python
def two_sum(nums, target):
    seen = {}                        # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:          # O(1) lookup instead of scanning the rest of the array
            return [seen[complement], i]
        seen[num] = i
    return []

two_sum([2, 7, 11, 15], 9)     # [0, 1], since nums[0] + nums[1] == 9
```

O(n) time, O(n) space, a massive improvement over the naive O(n²) nested-loop approach.

## Grouping with a Hash Map

```python
from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)
    for word in words:
        key = "".join(sorted(word))     # anagrams share the same sorted-letter key
        groups[key].append(word)
    return list(groups.values())

group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"])
# [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]
```

## Frequency Counting

```python
from collections import Counter

def most_frequent(nums, k):
    counts = Counter(nums)
    return [num for num, _ in counts.most_common(k)]

most_frequent([1, 1, 1, 2, 2, 3], 2)     # [1, 2]
```

## Checking for Existence: Set vs Dict

```python
seen = set()          # use a set when you only need MEMBERSHIP, not an associated value
seen.add(5)
5 in seen                # O(1)

counts = {}          # use a dict when you need a VALUE tied to each key (count, index, etc)
```

## Designing a Simple Hash Map (Educational, Interview Prep)

```python
class MyHashMap:
    def __init__(self, size=1000):
        self.size = size
        self.buckets = [[] for _ in range(size)]     # chaining for collision resolution

    def _hash(self, key):
        return hash(key) % self.size

    def put(self, key, value):
        bucket = self.buckets[self._hash(key)]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)     # update existing key
                return
        bucket.append((key, value))            # new key

    def get(self, key):
        bucket = self.buckets[self._hash(key)]
        for k, v in bucket:
            if k == key:
                return v
        return -1

    def remove(self, key):
        bucket = self.buckets[self._hash(key)]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                del bucket[i]
                return
```

> [!tip] When a hash table is the wrong tool
> If you need ORDERED traversal by key, or range queries ("all keys between 10 and 50"), a hash table doesn't help, reach for a balanced tree structure instead (see [[Binary Search Trees]]). Hash tables optimize for exact-match lookup only.
