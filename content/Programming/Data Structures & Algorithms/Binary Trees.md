---
tags: [dsa, trees, binary-trees]
aliases: [Binary Tree, Tree Traversal]
---

# 🌳 Binary Trees

A tree where each node has at most two children, conventionally called left and right. Trees model hierarchical relationships and underpin many other structures (BSTs, heaps, tries).

## Node Definition

```python
class TreeNode:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right
```

## Building a Small Tree

```python
#         1
#        / \
#       2   3
#      / \
#     4   5

root = TreeNode(1,
    left=TreeNode(2, left=TreeNode(4), right=TreeNode(5)),
    right=TreeNode(3))
```

## Depth-First Traversals (Recursive)

```python
def preorder(node):        # root -> left -> right
    if node is None:
        return []
    return [node.value] + preorder(node.left) + preorder(node.right)

def inorder(node):           # left -> root -> right
    if node is None:
        return []
    return inorder(node.left) + [node.value] + inorder(node.right)

def postorder(node):           # left -> right -> root
    if node is None:
        return []
    return postorder(node.left) + postorder(node.right) + [node.value]

preorder(root)      # [1, 2, 4, 5, 3]
inorder(root)          # [4, 2, 5, 1, 3]
postorder(root)           # [4, 5, 2, 3, 1]
```

> [!tip] Inorder traversal of a BST visits values in SORTED order
> This is one of the most useful facts in tree problems, see [[Binary Search Trees]].

## Depth-First Traversal, Iterative (Using an Explicit Stack)

```python
def preorder_iterative(root):
    if not root:
        return []
    stack, result = [root], []
    while stack:
        node = stack.pop()
        result.append(node.value)
        if node.right:
            stack.append(node.right)     # push right FIRST so left is processed first (LIFO)
        if node.left:
            stack.append(node.left)
    return result
```

## Breadth-First Traversal (Level Order)

```python
from collections import deque

def level_order(root):
    if not root:
        return []
    queue = deque([root])
    result = []
    while queue:
        level_size = len(queue)
        level = []
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.value)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result

level_order(root)     # [[1], [2, 3], [4, 5]]
```

Level order uses a queue (BFS), while pre/in/postorder use recursion or an explicit stack (DFS). See [[Graph Traversal BFS and DFS]] for the general BFS/DFS distinction.

## Common Tree Problems

### Maximum Depth

```python
def max_depth(node):
    if node is None:
        return 0
    return 1 + max(max_depth(node.left), max_depth(node.right))
```

### Checking if Balanced

```python
def is_balanced(root):
    def check(node):
        if node is None:
            return 0
        left = check(node.left)
        if left == -1:
            return -1
        right = check(node.right)
        if right == -1:
            return -1
        if abs(left - right) > 1:
            return -1     # sentinel: signals "unbalanced" up the call stack
        return 1 + max(left, right)
    return check(root) != -1
```

### Lowest Common Ancestor

```python
def lowest_common_ancestor(root, p, q):
    if root is None or root.value == p or root.value == q:
        return root
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left and right:
        return root                    # p and q found in different subtrees, root is the split point
    return left or right                  # otherwise, whichever side found something
```

### Symmetric Tree Check

```python
def is_symmetric(root):
    def is_mirror(t1, t2):
        if t1 is None and t2 is None:
            return True
        if t1 is None or t2 is None:
            return False
        return (t1.value == t2.value
                and is_mirror(t1.left, t2.right)
                and is_mirror(t1.right, t2.left))
    return is_mirror(root, root)
```

## Complexity Summary

Most tree traversal operations are O(n) time (visiting every node once) and O(h) space for the recursion stack, where `h` is the tree's height, O(log n) for a balanced tree, O(n) for a completely skewed one.

> [!warning] Skewed trees degrade to linked-list performance
> A tree where every node has only one child is really just a linked list in disguise, height O(n) instead of O(log n). This is exactly why BALANCED trees matter, see [[Binary Search Trees]].
