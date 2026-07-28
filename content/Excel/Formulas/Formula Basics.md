---
tags: [excel, formulas, basics]
created: 2026-07-22
---

# Formula Basics

> [!info] Navigation
> Part of [[Excel MOC]]

## Anatomy of a Formula
Every formula starts with `=` followed by a combination of operators, values, cell references, and functions.

```
=SUM(A1:A10)*1.18
```

## Operators

### Arithmetic
| Operator | Meaning | Example |
|---|---|---|
| `+` | Addition | `=A1+B1` |
| `-` | Subtraction | `=A1-B1` |
| `*` | Multiplication | `=A1*B1` |
| `/` | Division | `=A1/B1` |
| `^` | Exponent | `=A1^2` |
| `%` | Percent | `=50%` |

### Comparison
| Operator | Meaning |
|---|---|
| `=` | Equal to |
| `<>` | Not equal to |
| `>` `<` | Greater / less than |
| `>=` `<=` | Greater/less than or equal to |

### Text
| Operator | Meaning | Example |
|---|---|---|
| `&` | Concatenate | `=A1&" "&B1` |

## Cell References

> [!tip] Relative vs Absolute vs Mixed
> - **Relative** `A1` — shifts when copied
> - **Absolute** `$A$1` — locked row and column
> - **Mixed** `$A1` or `A$1` — locks only column or only row
> - Press **F4** to cycle through reference types while editing a formula

## Referencing Other Sheets & Workbooks
```
=Sheet2!A1
='Sheet Name With Spaces'!A1
=[Workbook.xlsx]Sheet1!A1
```

## Named Ranges
- Define via **Formulas → Define Name** or `Ctrl+F3`
- Usable directly in formulas: `=SUM(SalesData)`
- Scope can be Workbook or Sheet-level

## Order of Operations (PEMDAS)
1. Parentheses `()`
2. Exponents `^`
3. Multiplication / Division (left to right)
4. Addition / Subtraction (left to right)

## Array vs Regular Formulas
- Legacy array formulas entered with `Ctrl+Shift+Enter` (CSE) — shown as `{=FORMULA}`
- Modern Excel (365) uses **dynamic arrays** natively — see [[Array & Dynamic Array Functions]]

> [!warning] Common Gotcha
> Circular references (a formula that refers to its own cell, directly or indirectly) throw a warning. Enable iterative calculation only if intentional (e.g. goal-seek style models).

## See Also
- [[Common Errors Reference]]
- [[Lookup Functions]]
