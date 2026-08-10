---
tags: [dsa, greedy]
aliases: [Greedy Algorithms, Greedy Choice]
---

# 🌟 Greedy Algorithms

A greedy algorithm builds a solution step by step, always making the choice that looks best RIGHT NOW, never reconsidering past choices. It works only when the problem has the **greedy-choice property**: a series of locally optimal choices actually produces a globally optimal result.

## Greedy vs Dynamic Programming

> [!warning] Greedy is not always correct, always verify first
> Greedy is faster and simpler than DP when it applies, but using it on a problem that doesn't actually have the greedy-choice property produces a plausible-looking but WRONG answer. See [[Dynamic Programming]] for the comparison. When in doubt, try to construct a counterexample before trusting a greedy approach.

## Coin Change (Greedy Version, Only Works for Certain Coin Systems)

```python
def coin_change_greedy(coins, amount):
    coins = sorted(coins, reverse=True)
    count = 0
    for coin in coins:
        count += amount // coin
        amount %= coin
    return count if amount == 0 else -1

coin_change_greedy([25, 10, 5, 1], 63)     # 6 (2 quarters, 1 dime, 3 pennies), correct for US coins
coin_change_greedy([1, 3, 4], 6)              # 3 (4+1+1), but OPTIMAL is 2 (3+3)! greedy fails here
```

> [!warning] This example proves greedy needs the right coin system
> With coins `[1, 3, 4]` targeting `6`, greedy picks `4` first (locally best) then is stuck needing `1+1`, three coins total. The true optimum is `3+3`, two coins. This is exactly why [[Dynamic Programming]] exists: it's the general solution that works for ANY coin system, not just well-behaved ones like US currency.

## Activity Selection: Maximum Non-Overlapping Intervals

```python
def max_activities(activities):
    # activities: list of (start, end) tuples
    activities = sorted(activities, key=lambda x: x[1])     # sort by END time
    count = 0
    last_end = float("-inf")
    for start, end in activities:
        if start >= last_end:
            count += 1
            last_end = end
    return count

max_activities([(1, 3), (2, 4), (3, 5), (0, 6), (5, 7), (8, 9)])     # 4
```

> [!tip] Why sort by END time, not start time
> Choosing the activity that FINISHES earliest always leaves the most room for future activities. This is the classic proof-by-exchange-argument example: sorting by start time does NOT guarantee optimality, sorting by end time does.

## Fractional Knapsack (Greedy Works Here, Unlike 0/1 Knapsack)

```python
def fractional_knapsack(items, capacity):
    # items: list of (value, weight)
    items = sorted(items, key=lambda x: x[0] / x[1], reverse=True)     # sort by value-per-weight ratio
    total_value = 0
    for value, weight in items:
        if capacity >= weight:
            total_value += value
            capacity -= weight
        else:
            total_value += value * (capacity / weight)     # take a FRACTION of the remaining item
            break
    return total_value

fractional_knapsack([(60, 10), (100, 20), (120, 30)], capacity=50)     # 240.0
```

> [!tip] Fractional vs 0/1 knapsack
> Because items can be split, greedy (always take the highest value-per-weight ratio first) provably works. The 0/1 version (must take a whole item or none, see [[Dynamic Programming]]) loses this property and needs full DP.

## Jump Game: Can You Reach the End?

```python
def can_jump(nums):
    max_reach = 0
    for i, num in enumerate(nums):
        if i > max_reach:
            return False              # this index is unreachable, dead end
        max_reach = max(max_reach, i + num)
    return True

can_jump([2, 3, 1, 1, 4])     # True
can_jump([3, 2, 1, 0, 4])        # False, stuck at index 3
```

## Gas Station: Circular Route Feasibility

```python
def can_complete_circuit(gas, cost):
    total_surplus = 0
    current_surplus = 0
    start = 0
    for i in range(len(gas)):
        diff = gas[i] - cost[i]
        total_surplus += diff
        current_surplus += diff
        if current_surplus < 0:
            start = i + 1               # can't start from anywhere before here either
            current_surplus = 0
    return start if total_surplus >= 0 else -1
```

## Recognizing When Greedy Applies

> [!tip] Checklist before committing to a greedy approach
> - Can you prove (or at least strongly convince yourself) that a locally optimal choice never rules out a globally optimal solution?
> - Does sorting by some criterion (end time, ratio, size) naturally suggest an obvious "always pick this" rule?
> - If you can construct even one counterexample where the greedy choice leads to a worse overall result, greedy does not apply, fall back to DP or exhaustive search.

## Common Greedy Problem Families

> [!example] Where greedy typically shows up
> Interval scheduling, minimum spanning trees ([[Minimum Spanning Trees]], both Kruskal and Prim are greedy), Huffman coding, fractional knapsack, and single-source shortest paths with Dijkstra ([[Shortest Path Algorithms]], also fundamentally greedy).
