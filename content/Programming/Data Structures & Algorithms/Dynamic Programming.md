---
tags: [dsa, dynamic-programming, dp]
aliases: [DP, Dynamic Programming, Memoization]
---

# 💰 Dynamic Programming

Dynamic Programming (DP) solves problems by breaking them into overlapping subproblems, solving each ONCE, and reusing the result instead of recomputing it. It applies when a problem has two properties: **optimal substructure** (the optimal solution can be built from optimal solutions to subproblems) and **overlapping subproblems** (the same subproblem gets solved repeatedly in a naive approach).

## The Problem DP Solves: Naive Recursion Recomputes Everything

```python
def fib_naive(n):
    if n < 2:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)     # O(2^n), recomputes fib(2) many, many times
```

## Top-Down: Memoization (Recursion + Caching)

```python
def fib_memo(n, cache=None):
    if cache is None:
        cache = {}
    if n in cache:
        return cache[n]
    if n < 2:
        return n
    cache[n] = fib_memo(n - 1, cache) + fib_memo(n - 2, cache)
    return cache[n]     # O(n) time, O(n) space
```

Or, more concisely, using the built-in decorator:

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
```

See the core Python folder's [[Decorators]] note for `lru_cache` mechanics in depth.

## Bottom-Up: Tabulation (Iterative, Building from the Base Case Up)

```python
def fib_tabulation(n):
    if n < 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]     # O(n) time, O(n) space
```

Space-optimized (only the last two values are ever needed):

```python
def fib_optimized(n):
    if n < 2:
        return n
    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        prev2, prev1 = prev1, prev2 + prev1
    return prev1     # O(n) time, O(1) space
```

> [!tip] Top-down vs bottom-up
> Top-down (memoization) is usually easier to WRITE, it mirrors the natural recursive definition, you just add a cache. Bottom-up (tabulation) is usually more space-EFFICIENT and avoids recursion depth limits, but requires figuring out the right iteration order upfront.

## The 0/1 Knapsack Problem (Classic 2D DP)

```python
def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(
                    dp[i - 1][w],                                    # don't take item i
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]        # take item i
                )
            else:
                dp[i][w] = dp[i - 1][w]     # can't fit, must skip

    return dp[n][capacity]     # O(n * capacity) time and space

knapsack(weights=[1, 3, 4, 5], values=[1, 4, 5, 7], capacity=7)     # 9
```

## Longest Common Subsequence

```python
def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]

lcs("abcde", "ace")     # 3, "ace"
```

## Coin Change (Minimum Coins to Make an Amount)

```python
def coin_change(coins, amount):
    dp = [float("inf")] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for a in range(coin, amount + 1):
            dp[a] = min(dp[a], dp[a - coin] + 1)
    return dp[amount] if dp[amount] != float("inf") else -1

coin_change([1, 2, 5], 11)     # 3, since 11 = 5 + 5 + 1
```

## How to Recognize a DP Problem

> [!tip] Signals to watch for
> - The problem asks for a MINIMUM, MAXIMUM, LONGEST, SHORTEST, or COUNT of ways to do something.
> - A naive recursive solution would recompute the same subproblem many times.
> - The problem can be broken into smaller versions of ITSELF (optimal substructure).
> - Keywords: "number of ways", "minimum cost", "longest", "can you reach/make", "maximum profit".

## The General DP Approach

> [!tip] A repeatable process
> 1. Define what `dp[i]` (or `dp[i][j]`) actually REPRESENTS in plain English.
> 2. Find the base case(s).
> 3. Find the recurrence relation, how does `dp[i]` relate to smaller/previous states?
> 4. Decide the iteration order (bottom-up) or write the recursive relation with memoization (top-down).
> 5. Identify the final answer's location in the table.

## DP vs Plain Recursion vs Greedy

| Approach | When it applies |
|---|---|
| Plain recursion | No overlapping subproblems, or problem is naturally small |
| Dynamic Programming | Overlapping subproblems + optimal substructure |
| Greedy (see [[Greedy Algorithms]]) | A LOCAL best choice always leads to the GLOBAL best result, no need to consider alternatives |

> [!warning] Greedy looks similar to DP but is NOT interchangeable
> Greedy makes one irreversible choice per step and never reconsiders it. DP explicitly considers ALL relevant subproblem outcomes. Using greedy where the problem actually requires DP produces a solution that looks plausible but is subtly wrong on certain inputs, always verify the greedy-choice property holds before assuming greedy is sufficient.
