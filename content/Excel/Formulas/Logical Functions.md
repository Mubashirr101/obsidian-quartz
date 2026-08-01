---
tags: [excel, formulas, logic]
created: 2026-07-22
---

# Logical Functions

> [!info] Navigation
> Part of [[Excel]]

## IF
```
=IF(logical_test, value_if_true, value_if_false)
```

**Nested IF:**
```
=IF(A1>90,"A",IF(A1>75,"B",IF(A1>60,"C","D")))
```

> [!tip] Prefer IFS or lookup tables over deeply nested IFs — they're easier to read and debug.

## IFS (Excel 2016+/365)
Evaluates multiple conditions in order, returns for the first TRUE.
```
=IFS(A1>90,"A", A1>75,"B", A1>60,"C", TRUE,"D")
```
`TRUE` as the final condition acts as a catch-all/default.

## SWITCH
Matches an expression against a list of values.
```
=SWITCH(A1, "Mon","Monday", "Tue","Tuesday", "Unknown Day")
```

## AND / OR / NOT
```
=AND(A1>0, B1>0)      → TRUE only if both conditions true
=OR(A1>0, B1>0)       → TRUE if either is true
=NOT(A1>0)            → inverts TRUE/FALSE
```

Combine with IF:
```
=IF(AND(A1>50,B1="Yes"),"Pass","Fail")
```

## IFERROR / IFNA
```
=IFERROR(formula, value_if_error)
=IFNA(formula, value_if_na)
```
- `IFERROR` catches **any** error (`#N/A`, `#VALUE!`, `#REF!`, etc.)
- `IFNA` catches **only** `#N/A` — safer since it won't hide genuine formula bugs

> [!warning]
> Wrapping everything in `IFERROR` can silently mask real mistakes. Use `IFNA` for lookup functions specifically.

## Boolean Logic in Math
`TRUE` = 1, `FALSE` = 0 when used in arithmetic — useful trick:
```
=SUM((A1:A10>50)*1)      → counts values greater than 50
```

## Common Patterns

| Goal | Formula |
|---|---|
| Flag pass/fail | `=IF(score>=40,"Pass","Fail")` |
| Multiple conditions | `=IFS(...)` or nested `AND`/`OR` inside `IF` |
| Safe division | `=IFERROR(A1/B1,0)` |
| Category bucket | `=SWITCH(TRUE, A1<10,"Low", A1<50,"Mid","High")` *(SWITCH+TRUE trick)* |

## See Also
- [[Lookup Functions]]
- [[Common Errors Reference]]
