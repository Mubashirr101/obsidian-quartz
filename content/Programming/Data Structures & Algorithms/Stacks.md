---
tags: [dsa, stacks]
aliases: [Stack, LIFO]
---

# 📚 Stacks

A stack is a Last-In-First-Out (LIFO) structure: the most recently added item is the first one removed. Think of a stack of plates.

## Implementing a Stack with a Python List

```python
stack = []
stack.append(1)      # push, O(1) amortized
stack.append(2)
stack.append(3)
stack.pop()             # 3, pop from the END, O(1)
stack[-1]                  # 2, peek at the top without removing, O(1)
len(stack) == 0               # check if empty
```

> [!tip] Python's list is already a great stack
> Always use `.append()`/`.pop()` (operating on the END of the list) for a stack, never `.insert(0, x)`/`.pop(0)`, which would be O(n) per operation. See [[Arrays and Lists]].

## Valid Parentheses (Classic Stack Problem)

```python
def is_valid(s):
    stack = []
    pairs = {")": "(", "]": "[", "}": "{"}
    for char in s:
        if char in "([{":
            stack.append(char)
        elif char in ")]}":
            if not stack or stack.pop() != pairs[char]:
                return False
    return not stack     # must be empty, everything matched

is_valid("({[]})")     # True
is_valid("([)]")          # False, wrong nesting order
```

## Undo Functionality (Real-World Use Case)

```python
class UndoStack:
    def __init__(self):
        self.history = []

    def do_action(self, action):
        self.history.append(action)

    def undo(self):
        if self.history:
            return self.history.pop()
        return None
```

## Evaluating Postfix (Reverse Polish) Expressions

```python
def eval_postfix(tokens):
    stack = []
    for token in tokens:
        if token in "+-*/":
            b = stack.pop()
            a = stack.pop()
            if token == "+": stack.append(a + b)
            elif token == "-": stack.append(a - b)
            elif token == "*": stack.append(a * b)
            elif token == "/": stack.append(int(a / b))
        else:
            stack.append(int(token))
    return stack[0]

eval_postfix(["2", "1", "+", "3", "*"])     # (2 + 1) * 3 = 9
```

## Monotonic Stack: Next Greater Element

A monotonic stack keeps its elements in strictly increasing or decreasing order, letting you answer "next greater/smaller" style questions in a single O(n) pass instead of O(n²).

```python
def next_greater_element(nums):
    result = [-1] * len(nums)
    stack = []          # stores INDICES, kept in decreasing value order
    for i, num in enumerate(nums):
        while stack and nums[stack[-1]] < num:
            result[stack.pop()] = num     # found the next greater element for this index
        stack.append(i)
    return result

next_greater_element([2, 1, 2, 4, 3])     # [4, 2, 4, -1, -1]
```

> [!tip] Recognize monotonic stack problems
> Any problem asking for "next greater", "next smaller", "daily temperatures", or "largest rectangle in histogram" is a strong signal to reach for a monotonic stack, turning an O(n²) brute force into O(n).

## Call Stack: How Recursion Uses a Stack Internally

Every function call pushes a frame onto the call stack, popped when the function returns. This is exactly why deep recursion can hit `RecursionError`, see [[Recursion and Backtracking]] and the core Python folder's [[Recursion]] note.

## Using a Stack to Simulate Recursion Iteratively

```python
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    order = []
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            order.append(node)
            for neighbor in reversed(graph[node]):     # reversed to match natural DFS order
                if neighbor not in visited:
                    stack.append(neighbor)
    return order
```

See [[Graph Traversal BFS and DFS]] for the full traversal pattern.
