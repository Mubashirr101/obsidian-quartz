---
tags: [excel, errors, troubleshooting, reference]
created: 2026-07-22
---

# Common Errors Reference

> [!info] Navigation
> Part of [[Excel]]

## Error Types

| Error | Meaning | Typical Cause | Fix |
|---|---|---|---|
| `#DIV/0!` | Division by zero | Denominator is 0 or blank | `=IFERROR(A1/B1,0)` or check `B1<>0` first |
| `#N/A` | Value not available | Lookup found no match | Verify lookup value exists; use `IFNA()`; check for trailing spaces |
| `#NAME?` | Unrecognized name/text | Misspelled function, missing quotes, missing named range | Check spelling; ensure text is quoted |
| `#NULL!` | Invalid range intersection | Wrong operator (space) between two ranges that don't intersect | Use `,` instead of space to union ranges |
| `#NUM!` | Invalid numeric value | Formula produces a number too large/small, or invalid argument (e.g. negative sqrt) | Check function arguments and result magnitude |
| `#REF!` | Invalid cell reference | Referenced cells were deleted | Rebuild the reference; undo (`Ctrl+Z`) immediately if just happened |
| `#VALUE!` | Wrong data type | Text where a number is expected | Check for text-formatted numbers; use `VALUE()` |
| `#SPILL!` | Dynamic array blocked | Cells in the spill range aren't empty | Clear blocking cells |
| `#CALC!` | Calculation engine error | Empty array, unsupported operation | Simplify/check the formula |
| `##### ` | Column too narrow | Column width insufficient for date/number | Widen the column |

## Debugging Tools

### Trace Precedents / Dependents
**Formulas → Trace Precedents** (`Ctrl+[`) shows which cells feed into the active formula. **Trace Dependents** shows which cells depend on it.

### Evaluate Formula
**Formulas → Evaluate Formula** — steps through a formula's calculation piece by piece, useful for nested formulas.

### Error Checking
**Formulas → Error Checking** — scans the sheet for common mistakes (inconsistent formulas, text-as-number, etc.)

### Watch Window
**Formulas → Watch Window** — monitor specific cell values while working elsewhere in a large workbook.

## Silent (Non-Error) Pitfalls

> [!warning] These don't throw errors but cause wrong results
> - **Numbers stored as text** — left-aligned, break math/SUM silently (fix: multiply by 1, or Text to Columns)
> - **Trailing/leading spaces** in lookup values — causes false `#N/A` (fix: wrap with `TRIM()`)
> - **Mixed date formats** — regional settings (DD/MM vs MM/DD) misparse dates
> - **Floating point rounding** — `0.1+0.2 <> 0.3` exactly, due to binary floating point; use `ROUND()` when comparing
> - **Merged cells** — break sorting, filtering, and many formulas; avoid in data tables

## Quick Diagnostic Checklist
1. Is the error consistent across similar cells, or isolated?
2. Click the cell → does the formula bar show what you expect?
3. Use `Ctrl+`` `` to toggle formula view and visually scan for typos
4. Check referenced cells for correct data type (`ISTEXT()`, `ISNUMBER()`)

## See Also
- [[Logical Functions]] for `IFERROR`/`IFNA`
- [[Formula Basics]]
