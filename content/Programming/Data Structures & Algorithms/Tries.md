---
tags: [dsa, tries, prefix-tree]
aliases: [Trie, Prefix Tree]
---

# 🔠 Tries

A trie (pronounced "try", from re**trie**val) is a tree specialized for storing strings, where each path from root to a marked node spells out a word. Shared prefixes share the same path, making prefix-based operations extremely efficient.

## Node Structure

```python
class TrieNode:
    def __init__(self):
        self.children = {}         # maps character -> TrieNode
        self.is_end_of_word = False
```

## Building a Trie

```python
class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True     # O(m), where m is the word length

    def search(self, word):
        node = self._find_node(word)
        return node is not None and node.is_end_of_word     # O(m)

    def starts_with(self, prefix):
        return self._find_node(prefix) is not None     # O(m), the whole reason tries exist

    def _find_node(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node
```

```python
trie = Trie()
trie.insert("apple")
trie.insert("app")
trie.insert("application")

trie.search("app")           # True, exact word inserted
trie.search("appl")            # False, not inserted as a complete word
trie.starts_with("appl")          # True, "appl" is a valid prefix of stored words
```

## Why Not Just Use a Set of Strings?

```python
words = {"apple", "app", "application"}
"appl" in words          # False, sets only answer EXACT membership
any(w.startswith("appl") for w in words)     # True, but O(n * m), scans EVERY word
```

A trie answers `starts_with` in O(m) regardless of how many words are stored, where `m` is just the length of the prefix being checked, a massive win at scale.

## Autocomplete: Finding All Words with a Given Prefix

```python
class Trie:
    # ... (insert/search/_find_node as above)

    def words_with_prefix(self, prefix):
        node = self._find_node(prefix)
        if node is None:
            return []
        results = []
        self._collect(node, prefix, results)
        return results

    def _collect(self, node, path, results):
        if node.is_end_of_word:
            results.append(path)
        for char, child in node.children.items():
            self._collect(child, path + char, results)

trie.words_with_prefix("app")     # ['app', 'apple', 'application']
```

## Common Trie Applications

> [!example] Real-world uses
> - Autocomplete and search suggestions (typing "pyt" suggests "python", "pytorch")
> - Spell checkers, quickly verifying if a word exists
> - IP routing tables (longest prefix matching)
> - Word games (Boggle, Scrabble word validation)

## Space and Time Complexity

| Operation | Time | Notes |
|---|---|---|
| Insert | O(m) | m = word length |
| Search | O(m) | m = word length |
| Prefix search | O(p) | p = prefix length |
| Space | O(total characters across all words) | worst case, less if prefixes overlap heavily |

> [!tip] Tries trade memory for prefix speed
> A trie can use more memory than a plain set of strings when words share few prefixes, but the tradeoff pays off massively for prefix-heavy workloads (autocomplete, dictionaries with a shared vocabulary base).
