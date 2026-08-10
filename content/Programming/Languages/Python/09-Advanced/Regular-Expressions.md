---
tags: [python, advanced, regex, re-module]
aliases: [Regex, Regular Expressions, re module]
---

# Regular Expressions

Python's `re` module provides regex pattern matching for text search, validation, and extraction.

## Basic Matching

```python
import re

re.search(r"\d+", "I have 42 apples")      # Match object at position 7-9, or None if no match
re.match(r"\d+", "42 apples")                 # matches only at the START of the string
re.fullmatch(r"\d+", "42")                       # matches the ENTIRE string, nothing more/less

match = re.search(r"\d+", "I have 42 apples")
if match:
    match.group()      # '42', the matched text
    match.start()          # 7, starting index
    match.end()               # 9, ending index
```

> [!tip] `search` vs `match` vs `fullmatch`
> `match()` only checks the BEGINNING of the string, `search()` scans the whole string for the first match anywhere, `fullmatch()` requires the ENTIRE string to match. `search()` is the one people usually want.

## Common Pattern Syntax

| Pattern | Meaning |
|---|---|
| `.` | Any character except newline |
| `\d` | Any digit `[0-9]` |
| `\D` | Any non-digit |
| `\w` | Word character (letters, digits, underscore) |
| `\W` | Non-word character |
| `\s` | Whitespace |
| `\S` | Non-whitespace |
| `^` | Start of string (or line, with `re.MULTILINE`) |
| `$` | End of string (or line, with `re.MULTILINE`) |
| `*` | 0 or more of preceding |
| `+` | 1 or more of preceding |
| `?` | 0 or 1 of preceding (optional) |
| `{n}` | Exactly n repetitions |
| `{n,m}` | Between n and m repetitions |
| `[abc]` | Any one of a, b, c |
| `[^abc]` | Any character EXCEPT a, b, c |
| `(...)` | Capturing group |
| `(?:...)` | Non-capturing group |
| `\|` | Alternation (OR) |

## Finding All Matches

```python
re.findall(r"\d+", "I have 42 apples and 13 oranges")     # ['42', '13']

for match in re.finditer(r"\d+", "I have 42 apples and 13 oranges"):
    print(match.group(), match.start())     # gives Match objects, richer than findall
```

## Groups: Extracting Structured Parts

```python
text = "2026-08-09"
match = re.search(r"(\d{4})-(\d{2})-(\d{2})", text)
match.group(0)       # '2026-08-09', the full match
match.group(1)          # '2026', year
match.group(2)             # '08', month
match.groups()                # ('2026', '08', '09'), all groups as a tuple
```

### Named Groups (More Readable)

```python
match = re.search(r"(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})", "2026-08-09")
match.group("year")     # '2026'
match.groupdict()          # {'year': '2026', 'month': '08', 'day': '09'}
```

## Substitution

```python
re.sub(r"\d+", "#", "I have 42 apples and 13 oranges")     # 'I have # apples and # oranges'
re.sub(r"(\w+)@(\w+)", r"\2@\1", "user@domain")                # swap using backreferences -> 'domain@user'

def double(match):
    return str(int(match.group()) * 2)

re.sub(r"\d+", double, "I have 42 apples")     # 'I have 84 apples'
```

## Splitting on a Pattern

```python
re.split(r"[,;]\s*", "a, b; c,d")     # ['a', 'b', 'c', 'd']
```

## Compiling Patterns for Reuse

```python
pattern = re.compile(r"\d+")     # compile once if reusing the same pattern many times

pattern.search("42 apples")
pattern.findall("42 apples, 13 oranges")
```

> [!tip] `re.compile` for hot loops
> If the same pattern is matched against many strings (inside a loop or called frequently), compile it once outside the loop rather than passing the raw pattern string to `re.search()` repeatedly, saving repeated internal compilation overhead.

## Flags

```python
re.search(r"hello", "HELLO WORLD", re.IGNORECASE)     # case-insensitive matching
re.findall(r"^\d+", "1 apple\n2 oranges", re.MULTILINE)    # ^ and $ match at each LINE, not just string start/end
re.search(r"a.b", "a\nb", re.DOTALL)                          # makes '.' also match newlines
```

## Practical Examples

```python
# Validate an email (simplified, not RFC-complete)
bool(re.fullmatch(r"[\w.+-]+@[\w-]+\.[\w.-]+", "user@example.com"))     # True

# Extract all hashtags from text
re.findall(r"#\w+", "Loving #python and #obsidian today")     # ['#python', '#obsidian']

# Remove all non-alphanumeric characters
re.sub(r"[^a-zA-Z0-9]", "", "Hello, World! 123")     # 'HelloWorld123'
```

> [!warning] Regex has real limits
> Regex is good at flat, pattern-based text matching. It struggles badly with nested/recursive structures (matching balanced parentheses, parsing HTML/JSON reliably). For those, use a proper parser (`json` module, `html.parser`, or a dedicated parsing library) instead of trying to force it through regex.
