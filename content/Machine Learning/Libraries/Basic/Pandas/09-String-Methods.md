---
title: String Methods (.str accessor)
tags: [pandas, python, strings, text-cleaning, regex]
aliases: [.str, string accessor]
---

# String Methods — `.str` Accessor

> [!abstract] Definition
> The **`.str`** accessor exposes vectorized string operations on Series of type `object`/`string`, mirroring Python's built-in string methods but applied element-wise (NaN-safe).

```python
df["name"].str.upper()
```

---

## Case & Whitespace

```python
s.str.upper()
s.str.lower()
s.str.title()             # Capitalize Each Word
s.str.capitalize()         # Capitalize first letter only
s.str.swapcase()
s.str.strip()               # remove leading/trailing whitespace
s.str.lstrip() / s.str.rstrip()
s.str.strip("$%")            # strip specific characters
```

---

## Length & Containment

```python
s.str.len()                       # character count per string
s.str.contains("abc")              # boolean, substring search
s.str.contains("abc", case=False)   # case-insensitive
s.str.contains(r"^\d+$", regex=True) # regex pattern
s.str.startswith("Mr")
s.str.endswith(".csv")
s.str.count("a")                     # occurrences of substring/pattern
```

---

## Splitting & Joining

```python
s.str.split(",")                          # returns lists
s.str.split(",", expand=True)              # returns a DataFrame of split columns
s.str.split(",", n=1)                        # limit number of splits
s.str.rsplit(",", n=1)                        # split from the right
s.str.cat(sep=", ")                             # join all values in Series into one string
s.str.cat(other_series, sep=" - ")               # concat with another Series, aligned
s.str.join("-")                                    # join characters of each string (rarely needed)
s.str.partition(" ")                                 # split into 3 parts: before, sep, after
```

---

## Replacing & Extracting

```python
s.str.replace("old", "new")                        # literal substring by default
s.str.replace(r"\d+", "", regex=True)                # regex replace
s.str.extract(r"(\d+)-(\d+)")                          # regex groups -> DataFrame of columns
s.str.extractall(r"(\d+)")                               # all non-overlapping matches
s.str.findall(r"\d+")                                       # list of all matches per row
```

```python
# Example: extract area code and number from "022-1234567"
s.str.extract(r"(?P<area>\d{2,4})-(?P<number>\d+)")
```

---

## Padding & Slicing

```python
s.str.pad(10, side="left", fillchar="0")
s.str.zfill(5)                        # zero-pad numbers stored as strings, e.g. "007"
s.str.slice(0, 3)                      # like s.str[0:3]
s.str[0:3]                              # shorthand slicing
s.str.center(10, fillchar="*")
```

---

## Testing Content Type

```python
s.str.isalpha()
s.str.isdigit()
s.str.isnumeric()
s.str.isalnum()
s.str.isspace()
s.str.islower() / s.str.isupper()
```

---

## Regex Cheat-Sheet for `.str` Methods

| Pattern | Meaning |
|---|---|
| `\d` | digit |
| `\D` | non-digit |
| `\w` | word character |
| `\s` | whitespace |
| `^` / `$` | start / end of string |
| `+` / `*` / `?` | one-or-more / zero-or-more / optional |
| `(...)` | capture group |
| `(?P<name>...)` | named capture group |
| `\|` | alternation (OR) |

---

## Common Cleaning Recipes

```python
# Trim + lowercase + collapse internal whitespace
df["name"] = df["name"].str.strip().str.lower().str.replace(r"\s+", " ", regex=True)

# Remove non-numeric characters from a "price" column, e.g. "₹1,200" -> "1200"
df["price"] = df["price"].str.replace(r"[^\d.]", "", regex=True).astype(float)

# Standardize phone numbers
df["phone"] = df["phone"].str.replace(r"[-\s()]", "", regex=True)

# Boolean flag from text
df["is_urgent"] = df["subject"].str.contains("urgent", case=False, na=False)
```

> [!warning] `NaN` propagates through `.str` methods
> By default, most `.str` methods return `NaN` for missing values rather than raising an error, but boolean-returning methods like `.str.contains()` will also return `NaN` for missing inputs unless you pass `na=False`.

---

## Related
- [[01-Series]]
- [[05-Missing-Data]]
- [[11-Apply-Map-Vectorization]]
