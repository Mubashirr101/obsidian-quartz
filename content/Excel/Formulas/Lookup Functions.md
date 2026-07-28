---
tags: [excel, formulas, lookup]
created: 2026-07-22
---

# Lookup Functions

> [!info] Navigation
> Part of [[Excel MOC]] · See also [[Array & Dynamic Array Functions]]

## VLOOKUP
Looks up a value in the **first column** of a range and returns a value in the same row from a specified column.

```
=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
```

| Arg | Notes |
|---|---|
| `range_lookup` | `FALSE`/`0` = exact match, `TRUE`/`1` = approximate (default, needs sorted data) |

> [!warning] Limitation
> VLOOKUP can only look **rightward**. Column index breaks if columns are inserted/deleted. Prefer [[#XLOOKUP]] or [[#INDEX + MATCH]] where available.

## HLOOKUP
Same as VLOOKUP but searches the **first row** and returns from a specified row number.

```
=HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])
```

## INDEX + MATCH
The classic, flexible combo — looks up in any direction.

```
=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))
```

- `MATCH` finds the **position** of a value: `=MATCH(lookup_value, lookup_array, [match_type])`
  - `match_type`: `0` = exact, `1` = less than (ascending sorted), `-1` = greater than (descending sorted)
- `INDEX` returns the value at that position: `=INDEX(array, row_num, [col_num])`

**2D lookup (row + column):**
```
=INDEX(data_range, MATCH(row_val, row_headers, 0), MATCH(col_val, col_headers, 0))
```

## XLOOKUP (Excel 365 / 2021+)
Modern replacement for VLOOKUP/HLOOKUP/INDEX-MATCH.

```
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])
```

| Arg | Notes |
|---|---|
| `if_not_found` | Custom text/value instead of `#N/A` |
| `match_mode` | `0` exact (default), `-1` exact or next smaller, `1` exact or next larger, `2` wildcard |
| `search_mode` | `1` first→last, `-1` last→first, `2`/`-2` binary search (sorted data) |

> [!tip]
> XLOOKUP can look leftward, returns a whole row/column array, and doesn't break when columns shift.

## XMATCH
Companion to XLOOKUP — returns position only.
```
=XMATCH(lookup_value, lookup_array, [match_mode], [search_mode])
```

## LOOKUP (legacy, vector form)
```
=LOOKUP(lookup_value, lookup_vector, [result_vector])
```
Requires sorted ascending data; mostly superseded by XLOOKUP.

## Quick Comparison

| Function | Direction | Exact match default | Handles inserted columns |
|---|---|---|---|
| VLOOKUP | Right only | ❌ (approx) | ❌ |
| HLOOKUP | Down only | ❌ (approx) | ❌ |
| INDEX+MATCH | Any | ✅ (set manually) | ✅ |
| XLOOKUP | Any | ✅ | ✅ |

## See Also
- [[Common Errors Reference]] for `#N/A` handling
- [[Logical Functions]] for wrapping with `IFERROR`
