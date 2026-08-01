---
tags: [excel, formulas, math, statistics]
created: 2026-07-22
---

# Math & Statistical Functions

> [!info] Navigation
> Part of [[Excel]]

## Aggregation Basics
| Function | Purpose |
|---|---|
| `SUM(range)` | Total |
| `AVERAGE(range)` | Mean |
| `MEDIAN(range)` | Middle value |
| `MODE.SNGL(range)` | Most frequent value |
| `COUNT(range)` | Counts numeric cells |
| `COUNTA(range)` | Counts non-empty cells |
| `COUNTBLANK(range)` | Counts empty cells |
| `MAX(range)` / `MIN(range)` | Largest/smallest |
| `MAXIFS` / `MINIFS` | Conditional max/min (Excel 2019+) |

## Conditional Aggregation
```
=SUMIF(range, criteria, [sum_range])
=SUMIFS(sum_range, crit_range1, crit1, crit_range2, crit2, ...)
=AVERAGEIF(range, criteria, [avg_range])
=AVERAGEIFS(avg_range, crit_range1, crit1, ...)
=COUNTIF(range, criteria)
=COUNTIFS(crit_range1, crit1, crit_range2, crit2, ...)
```

> [!tip] Criteria syntax
> - Text: `"Mumbai"` or `"<>Mumbai"`
> - Numbers: `">100"`, `"<=50"`
> - Wildcards: `"Mum*"`
> - Cell ref: `">="&A1`

## SUMPRODUCT
Multiplies corresponding array elements and sums the result — extremely versatile for multi-condition sums without helper columns.
```
=SUMPRODUCT((A2:A100="Mumbai")*(B2:B100="Active")*C2:C100)
```

## Rounding
| Function | Behavior |
|---|---|
| `ROUND(num, digits)` | Standard rounding |
| `ROUNDUP(num, digits)` | Always rounds away from zero |
| `ROUNDDOWN(num, digits)` | Always truncates toward zero |
| `MROUND(num, multiple)` | Rounds to nearest multiple |
| `CEILING(num, sig)` / `FLOOR(num, sig)` | Rounds up/down to significance |
| `TRUNC(num, [digits])` | Truncates without rounding |
| `INT(num)` | Rounds down to nearest integer |

## Other Common Math
```
=ABS(num)              → absolute value
=SQRT(num)              → square root
=POWER(num, power)      → exponent
=MOD(num, divisor)      → remainder
=GCD(n1,n2)  / =LCM(n1,n2)
=RAND()                 → random 0–1
=RANDBETWEEN(low, high) → random integer in range
```

## Statistical
```
=STDEV.S(range)   → sample standard deviation
=STDEV.P(range)   → population standard deviation
=VAR.S(range) / VAR.P(range)
=RANK.EQ(num, range, [order])   → rank within a set
=PERCENTILE.INC(range, k)
=QUARTILE.INC(range, quart)
=CORREL(range1, range2)         → correlation coefficient
=TREND(known_y, known_x, new_x) → linear trend prediction
```

## Unique/Distinct Counting
```
=SUMPRODUCT(1/COUNTIF(range, range))     → legacy distinct count
=COUNTA(UNIQUE(range))                    → 365 dynamic array approach
```

## See Also
- [[Array & Dynamic Array Functions]]
- [[Common Errors Reference]]
