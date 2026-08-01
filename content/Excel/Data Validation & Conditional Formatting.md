---
tags: [excel, data-validation, conditional-formatting, workflows]
created: 2026-07-22
---

# Data Validation & Conditional Formatting

> [!info] Navigation
> Part of [[Excel]]

## Data Validation
**Data → Data Validation**

### Common Rule Types
| Type | Use case |
|---|---|
| Whole number / Decimal | Restrict numeric ranges |
| List | Dropdown menu — source: comma list or cell range |
| Date | Restrict to a date range |
| Text length | Cap character count |
| Custom | Any formula returning TRUE/FALSE |

### Dropdown List Example
Source: `=$E$1:$E$5` (a named range works too, and is more portable)

### Custom Formula Example — prevent duplicate entries
```
=COUNTIF($A$2:$A$100, A2)=1
```

### Dependent (Cascading) Dropdowns
1. Create named ranges matching parent category names (e.g. range named `Mumbai`, `Delhi`)
2. Second dropdown's source: `=INDIRECT($A2)`

> [!warning]
> Named ranges used with `INDIRECT` can't contain spaces or start with numbers — use underscores.

### Input Message & Error Alert
Configure under the same dialog's other tabs — shows a tooltip on selection, and blocks/warns on invalid entry.

## Conditional Formatting
**Home → Conditional Formatting**

### Built-in Rule Types
- Highlight Cells Rules (greater than, between, duplicate values...)
- Top/Bottom Rules (top 10%, above average...)
- Data Bars, Color Scales, Icon Sets

### Custom Formula Rule
Applies formatting when a formula returns TRUE. Formula is evaluated relative to the **top-left cell** of the selected range.

**Highlight entire row based on one column's value:**
```
=$D2="Overdue"
```
(Select the full row range starting at row 2, use `$D2` to lock the column but let the row float.)

**Highlight duplicates across a range:**
```
=COUNTIF($A$2:$A$100,A2)>1
```

**Highlight weekends in a date column:**
```
=WEEKDAY($A2,2)>5
```

### Managing Rules
**Home → Conditional Formatting → Manage Rules** — control rule order/priority, "Stop If True" checkbox to prevent lower-priority rules from also applying.

> [!tip]
> Conditional formatting rules using `INDIRECT`, `OFFSET`, or volatile functions can slow down large sheets — prefer static ranges where possible.

## See Also
- [[Logical Functions]]
- [[Math & Statistical Functions]]
