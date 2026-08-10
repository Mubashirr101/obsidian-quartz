---
tags: [dsa, recursion, backtracking]
aliases: [Backtracking, Recursion DSA]
---

# 🪃 Recursion and Backtracking

See the core Python folder's [[Recursion]] note for the language mechanics (base case, recursive case, the call stack). This note focuses on recursion as a PROBLEM-SOLVING tool in DSA, especially backtracking.

## What Backtracking Actually Is

Backtracking is DFS through a decision tree of choices, where you make a choice, recurse, and UNDO the choice ("backtrack") if it doesn't lead to a valid solution, trying the next option instead.

```python
def backtrack_template(state, choices):
    if is_solution(state):
        record(state)
        return
    for choice in choices:
        if is_valid(choice, state):
            state.append(choice)         # make the choice
            backtrack_template(state, choices)     # explore further
            state.pop()                     # undo the choice, try the next one
```

## Generating All Subsets

```python
def subsets(nums):
    result = []

    def backtrack(start, current):
        result.append(current[:])          # every state along the way is a valid subset
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()               # undo, try without this element

    backtrack(0, [])
    return result

subsets([1, 2, 3])
# [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
```

## Generating All Permutations

```python
def permutations(nums):
    result = []

    def backtrack(current, remaining):
        if not remaining:
            result.append(current[:])
            return
        for i in range(len(remaining)):
            current.append(remaining[i])
            backtrack(current, remaining[:i] + remaining[i+1:])
            current.pop()

    backtrack([], nums)
    return result

permutations([1, 2, 3])
# [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

## Combination Sum

```python
def combination_sum(candidates, target):
    result = []

    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(current[:])
            return
        if remaining < 0:
            return          # PRUNING: this path can't work, stop exploring it
        for i in range(start, len(candidates)):
            current.append(candidates[i])
            backtrack(i, current, remaining - candidates[i])     # i, not i+1: allows reusing the same number
            current.pop()

    backtrack(0, [], target)
    return result

combination_sum([2, 3, 6, 7], 7)     # [[2,2,3], [7]]
```

> [!tip] Pruning is what makes backtracking practical
> Without early termination on clearly invalid paths (like `remaining < 0` above), backtracking degenerates into brute-forcing every possible combination, often exponential and impractically slow. Good pruning conditions are the difference between a solution that runs and one that times out.

## N-Queens (Classic Backtracking Problem)

```python
def solve_n_queens(n):
    result = []
    cols = set()
    diagonals = set()          # row - col is constant along a "\" diagonal
    anti_diagonals = set()        # row + col is constant along a "/" diagonal

    def backtrack(row, board):
        if row == n:
            result.append(["".join(r) for r in board])
            return
        for col in range(n):
            if col in cols or (row - col) in diagonals or (row + col) in anti_diagonals:
                continue          # this placement conflicts, skip it (pruning)
            cols.add(col)
            diagonals.add(row - col)
            anti_diagonals.add(row + col)
            board[row][col] = "Q"

            backtrack(row + 1, board)

            cols.remove(col)             # undo, backtrack
            diagonals.remove(row - col)
            anti_diagonals.remove(row + col)
            board[row][col] = "."

    empty_board = [["."] * n for _ in range(n)]
    backtrack(0, empty_board)
    return result
```

## Word Search on a Grid

```python
def exist(board, word):
    rows, cols = len(board), len(board[0])

    def backtrack(r, c, i):
        if i == len(word):
            return True
        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[i]:
            return False

        temp = board[r][c]
        board[r][c] = "#"          # mark visited by mutating in place, avoids extra visited set

        found = (backtrack(r+1, c, i+1) or backtrack(r-1, c, i+1)
                 or backtrack(r, c+1, i+1) or backtrack(r, c-1, i+1))

        board[r][c] = temp             # undo the mark, backtrack

        return found

    for r in range(rows):
        for c in range(cols):
            if backtrack(r, c, 0):
                return True
    return False
```

## Backtracking Complexity

Backtracking is often exponential in the worst case (it's essentially exploring a decision tree), but pruning invalid branches early keeps real-world runtimes far below the theoretical worst case for most practical inputs.

> [!tip] Recognizing backtracking problems
> Words like "all possible", "every combination", "every arrangement", or "find a valid configuration" (Sudoku, N-Queens, maze solving) are strong signals. The shape is always: make a choice, recurse, undo, try the next choice.

See [[Dynamic Programming]] for when overlapping subproblems in a recursive/backtracking approach can be sped up with memoization.
