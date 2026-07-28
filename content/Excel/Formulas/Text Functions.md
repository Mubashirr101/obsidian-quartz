---
tags: [excel, formulas, text]
created: 2026-07-22
---

# Text Functions

> [!info] Navigation
> Part of [[Excel MOC]]

## Extracting Text
| Function | Purpose | Example |
|---|---|---|
| `LEFT(text,n)` | First n chars | `=LEFT("Mumbai",3)` → `Mum` |
| `RIGHT(text,n)` | Last n chars | `=RIGHT("Mumbai",3)` → `bai` |
| `MID(text,start,n)` | n chars from position | `=MID("Mumbai",2,3)` → `umb` |
| `LEN(text)` | Character count | `=LEN("Mumbai")` → `6` |

## Finding Text
| Function | Case-sensitive | Wildcards |
|---|---|---|
| `FIND(find_text, within_text, [start])` | ✅ | ❌ |
| `SEARCH(find_text, within_text, [start])` | ❌ | ✅ (`*`, `?`) |

Both return the **position** (integer), or `#VALUE!` if not found.

## Combining Text
```
=CONCAT(A1,B1,C1)                      → simple join, no delimiter
=TEXTJOIN(", ", TRUE, A1:A10)          → join with delimiter, ignore_empty
=A1&" "&B1                             → classic ampersand method
```

## Modifying Text
| Function | Purpose |
|---|---|
| `TRIM(text)` | Removes extra spaces (keeps single spaces between words) |
| `CLEAN(text)` | Removes non-printable characters |
| `UPPER(text)` / `LOWER(text)` / `PROPER(text)` | Case conversion |
| `SUBSTITUTE(text,old,new,[instance])` | Replace by matching text |
| `REPLACE(text,start,n,new)` | Replace by position |
| `REPT(text,n)` | Repeat text n times |

## Number ↔ Text Conversion
```
=TEXT(1234.5,"#,##0.00")     → "1,234.50"
=TEXT(TODAY(),"dd-mmm-yyyy") → "22-Jul-2026"
=VALUE("1234")               → 1234 (text to number)
=NUMBERVALUE("1.234,50","," ,".")  → locale-aware conversion
```

### Common TEXT() Format Codes
| Code | Result |
|---|---|
| `0` | Digit, forces zero |
| `#` | Digit, optional |
| `0.00` | 2 decimal places |
| `#,##0` | Thousands separator |
| `0%` | Percentage |
| `dd/mm/yyyy` | Date format |
| `hh:mm:ss` | Time format |
| `₹#,##0.00` | Currency (INR) |

## Splitting Text
- **Text to Columns**: Data ribbon → Text to Columns (delimiter or fixed width)
- Formula approach (365): `=TEXTSPLIT(text, col_delimiter, [row_delimiter])`
- Get first/last word:
```
=LEFT(A1,FIND(" ",A1)-1)                          → first word
=TRIM(RIGHT(SUBSTITUTE(A1," ",REPT(" ",100)),100)) → last word (classic trick)
```

## See Also
- [[Formula Basics]]
- [[Array & Dynamic Array Functions]] for `TEXTSPLIT`, `TEXTBEFORE`, `TEXTAFTER`
