---
tags: [excel, formulas, arrays, dynamic-arrays]
created: 2026-07-22
---

# Array & Dynamic Array Functions

> [!info] Navigation
> Part of [[Excel]] · Requires Excel 365 / Excel 2021+ unless noted

## What Changed
Modern Excel formulas that return multiple values automatically **spill** into neighboring cells — no more `Ctrl+Shift+Enter`. The spill range is marked with a light blue border, and referencing the whole thing uses the `#` operator: `=A1#`.

## FILTER
Returns rows matching a condition.
```
=FILTER(array, include, [if_empty])
=FILTER(A2:C100, B2:B100="Mumbai", "No matches")
```
Multiple conditions:
```
=FILTER(A2:C100, (B2:B100="Mumbai")*(C2:C100>50))
```

## SORT / SORTBY
```
=SORT(array, [sort_index], [sort_order], [by_col])
=SORTBY(array, by_array1, [order1], by_array2, [order2])
```
`sort_order`: `1` ascending (default), `-1` descending

## UNIQUE
```
=UNIQUE(array, [by_col], [exactly_once])
```
`exactly_once = TRUE` returns only values that appear **exactly once** (true distinct, not just deduped).

## SEQUENCE
Generates a list of numbers.
```
=SEQUENCE(rows, [columns], [start], [step])
=SEQUENCE(12,1,1,1)    → 1 through 12 vertically (e.g. month numbers)
```

## Combining FILTER + SORT + UNIQUE
```
=SORT(UNIQUE(FILTER(A2:A100, B2:B100="Active")))
```

## TEXTSPLIT / TEXTBEFORE / TEXTAFTER (365)
```
=TEXTSPLIT(text, col_delim, [row_delim])
=TEXTBEFORE(text, delimiter)
=TEXTAFTER(text, delimiter)
```

## TRANSPOSE
Flips rows ↔ columns.
```
=TRANSPOSE(A1:D10)
```

## LET — Naming Values Inside a Formula
Improves readability and performance by avoiding repeated sub-calculations.
```
=LET(
  price, B2,
  qty, C2,
  discount, 0.1,
  price*qty*(1-discount)
)
```

## LAMBDA — Custom Reusable Functions (365)
```
=LAMBDA(x, y, x^2+y^2)(3,4)   → 25
```
Save via Name Manager to reuse like a built-in function across the workbook.

## Legacy CSE Array Formulas
Pre-365 Excel required manual array entry with `Ctrl+Shift+Enter`:
```
{=SUM(IF(A1:A10>50, A1:A10))}
```
Still works in modern Excel but is superseded by native dynamic arrays.

> [!tip]
> If a formula returns `#SPILL!`, it means the spill range is blocked by existing data — clear the cells in the way.

## See Also
- [[Lookup Functions]]
- [[Common Errors Reference]]
