---
tags: [dsa, linked-lists]
aliases: [Linked List, Singly Linked List, Doubly Linked List]
---

# 🔗 Linked Lists

A linked list is a chain of nodes, each holding a value and a reference to the next node. Unlike arrays, memory is NOT contiguous, so there is no O(1) random access, but insertion/deletion at a known position is O(1).

## Node Definition

```python
class ListNode:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next
```

## Building a Singly Linked List

```python
head = ListNode(1)
head.next = ListNode(2)
head.next.next = ListNode(3)
# 1 -> 2 -> 3 -> None

def print_list(head):
    current = head
    while current:
        print(current.value, end=" -> ")
        current = current.next
    print("None")
```

## Traversal

```python
def traverse(head):
    values = []
    current = head
    while current:
        values.append(current.value)
        current = current.next
    return values     # O(n) time, O(n) space for the collected list
```

## Inserting a Node

```python
def insert_at_head(head, value):
    new_node = ListNode(value, next=head)
    return new_node          # O(1), the new head

def insert_at_tail(head, value):
    new_node = ListNode(value)
    if head is None:
        return new_node
    current = head
    while current.next:         # O(n), must walk to the end first
        current = current.next
    current.next = new_node
    return head
```

## Deleting a Node

```python
def delete_value(head, value):
    dummy = ListNode(0, next=head)     # dummy node simplifies edge case of deleting the head
    current = dummy
    while current.next:
        if current.next.value == value:
            current.next = current.next.next
            break
        current = current.next
    return dummy.next
```

> [!tip] The dummy node trick
> A dummy/sentinel node before the real head eliminates special-casing "what if we delete the head itself." It is one of the most useful patterns in linked list problems, worth memorizing.

## Reversing a Linked List

```python
def reverse(head):
    prev = None
    current = head
    while current:
        next_node = current.next     # save before overwriting
        current.next = prev             # reverse the pointer
        prev = current                     # advance prev
        current = next_node                   # advance current
    return prev     # new head, O(n) time, O(1) extra space
```

## Detecting a Cycle: Floyd's Tortoise and Hare

```python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next            # moves 1 step
        fast = fast.next.next          # moves 2 steps
        if slow is fast:                  # they will eventually meet if there's a cycle
            return True
    return False     # O(n) time, O(1) space, no extra visited-set needed
```

## Finding the Middle Node

```python
def find_middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow     # when fast reaches the end, slow is at the middle
```

## Merging Two Sorted Linked Lists

```python
def merge_sorted(l1, l2):
    dummy = ListNode(0)
    tail = dummy
    while l1 and l2:
        if l1.value <= l2.value:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
    tail.next = l1 or l2     # attach whichever list has leftovers
    return dummy.next     # O(n + m) time
```

## Doubly Linked List

Each node also points to its previous node, enabling O(1) traversal in both directions and O(1) deletion given a direct node reference (no need to find the predecessor).

```python
class DoublyListNode:
    def __init__(self, value, prev=None, next=None):
        self.value = value
        self.prev = prev
        self.next = next

def delete_node(node):
    if node.prev:
        node.prev.next = node.next
    if node.next:
        node.next.prev = node.prev     # O(1), no traversal needed to find the predecessor
```

## Linked List vs Array

| Operation | Array | Linked List |
|---|---|---|
| Random access | O(1) | O(n) |
| Insert/delete at known position | O(n) (shifting) | O(1) |
| Insert/delete at start | O(n) | O(1) |
| Memory | Contiguous | Scattered, extra pointer overhead |
| Cache performance | Better (locality) | Worse |

> [!tip] When to actually reach for a linked list
> In Python specifically, linked lists are used far less often than in C/Java because Python's `list` already handles append/pop efficiently and `deque` covers both-end operations. Linked lists mainly show up in interview problems and when implementing OTHER structures internally (e.g. hash table collision chains, LRU caches).
