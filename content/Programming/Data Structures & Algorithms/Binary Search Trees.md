---
tags: [dsa, trees, bst]
aliases: [BST, Binary Search Tree]
---

# 🔍 Binary Search Trees

A BST is a binary tree with an ordering invariant: for every node, all values in its LEFT subtree are smaller, and all values in its RIGHT subtree are larger. This invariant is what makes search, insert, and delete O(log n) on average.

## Node Definition (Same as a Regular Binary Tree)

```python
class TreeNode:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right
```

## Searching

```python
def search(node, target):
    if node is None or node.value == target:
        return node
    if target < node.value:
        return search(node.left, target)      # go left, target is smaller
    return search(node.right, target)             # go right, target is larger

# O(log n) average on a balanced BST, O(n) worst case on a skewed one
```

## Inserting

```python
def insert(node, value):
    if node is None:
        return TreeNode(value)
    if value < node.value:
        node.left = insert(node.left, value)
    elif value > node.value:
        node.right = insert(node.right, value)
    return node     # duplicates ignored here; adapt if duplicates should be allowed

root = None
for val in [5, 3, 8, 1, 4, 7, 9]:
    root = insert(root, val)
```

## Deleting (The Tricky One)

Three cases: leaf node, one child, or two children.

```python
def delete(node, value):
    if node is None:
        return None
    if value < node.value:
        node.left = delete(node.left, value)
    elif value > node.value:
        node.right = delete(node.right, value)
    else:
        # found the node to delete
        if node.left is None:
            return node.right          # no left child, replace with right subtree (handles leaf too)
        if node.right is None:
            return node.left              # no right child, replace with left subtree
        # two children: find the in-order successor (smallest value in right subtree)
        successor = node.right
        while successor.left:
            successor = successor.left
        node.value = successor.value                    # copy successor's value up
        node.right = delete(node.right, successor.value)   # remove the successor's original node
    return node
```

> [!tip] Why the in-order successor works
> The smallest value in the right subtree is guaranteed to be LARGER than everything in the left subtree and SMALLER than everything else in the right subtree, so swapping it into the deleted node's position preserves the BST invariant perfectly.

## Inorder Traversal Gives Sorted Order

```python
def inorder(node):
    if node is None:
        return []
    return inorder(node.left) + [node.value] + inorder(node.right)

inorder(root)     # [1, 3, 4, 5, 7, 8, 9], always sorted for a valid BST
```

This is arguably the single most useful property of a BST, it doubles as a sorting mechanism and is the basis for the "convert sorted array to BST" and "validate BST" problem families.

## Validating a BST

```python
def is_valid_bst(node, low=float("-inf"), high=float("inf")):
    if node is None:
        return True
    if not (low < node.value < high):
        return False
    return (is_valid_bst(node.left, low, node.value)
            and is_valid_bst(node.right, node.value, high))
```

> [!warning] A common mistake: only checking immediate children
> Just checking `node.left.value < node.value < node.right.value` is NOT sufficient, a deeply nested node could violate the ordering relative to an ANCESTOR several levels up even while satisfying its immediate parent. The bounds must be threaded down through the entire recursion.

## Finding Min and Max

```python
def find_min(node):
    while node.left:
        node = node.left
    return node.value

def find_max(node):
    while node.right:
        node = node.right
    return node.value     # both O(log n) average, O(h) generally
```

## The Balance Problem

A BST built by inserting already-sorted data degenerates into a linked list (height O(n) instead of O(log n)), losing all the performance benefit.

```python
root = None
for val in [1, 2, 3, 4, 5]:      # already sorted input!
    root = insert(root, val)
# resulting tree is a pure right-leaning chain, O(n) search instead of O(log n)
```

> [!tip] Self-balancing variants
> Real-world systems use self-balancing BSTs (AVL trees, Red-Black trees) that automatically rebalance on insert/delete to guarantee O(log n) height regardless of insertion order. Python doesn't include one in the standard library; `sortedcontainers` (third-party) provides `SortedList`/`SortedDict` backed by balanced structures for practical use.

## BST vs Hash Table

| Need | Best fit |
|---|---|
| Exact key lookup only | Hash table, O(1) average |
| Sorted iteration | BST, O(n) via inorder |
| Range queries (all keys between X and Y) | BST |
| Finding closest value / floor / ceiling | BST |

See [[Hash Tables and Maps]] for the comparison from the other side.
