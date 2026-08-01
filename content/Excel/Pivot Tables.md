---
tags: [excel, pivot-tables, workflows]
created: 2026-07-22
---

# Pivot Tables

> [!info] Navigation
> Part of [[Excel]]

## What They're For
Summarize, aggregate, and explore large datasets without writing formulas — group, count, sum, and cross-tabulate interactively.

## Creating One
1. Click inside your data range (or select it)
2. **Insert → PivotTable**
3. Choose destination (New Worksheet recommended)
4. Drag fields into the four zones:

| Zone | Purpose |
|---|---|
| **Filters** | Page-level filter, doesn't affect layout |
| **Rows** | Groups data vertically |
| **Columns** | Groups data horizontally |
| **Values** | The actual aggregated numbers |

## Value Field Settings
Right-click a value field → **Value Field Settings** to change aggregation:
- Sum, Count, Average, Max, Min, Product, StdDev, Var

**Show Values As** (in the same dialog):
- `% of Grand Total`
- `% of Column Total` / `% of Row Total`
- `Difference From` (compare to previous period/item)
- `Running Total In`
- `Rank Largest to Smallest`

## Grouping
- Right-click a row/column field → **Group**
- Dates: group by Days/Months/Quarters/Years
- Numbers: group into bins (e.g. 0-10, 10-20...)

## Calculated Fields
**PivotTable Analyze → Fields, Items & Sets → Calculated Field**
```
Formula: = Revenue - Cost
```
Creates a new virtual column computed from existing pivot fields.

## Slicers & Timelines
- **Insert → Slicer** — visual filter buttons, can connect to multiple pivot tables
- **Insert → Timeline** — date-range filter widget

## Refreshing Data
- `Alt+F5` refreshes the active pivot table
- **PivotTable Analyze → Refresh All** refreshes everything
- **Options → Data → Refresh on file open** for auto-refresh

## GETPIVOTDATA
Auto-generated when you reference a pivot table cell from outside it — pulls a specific summarized value.
```
=GETPIVOTDATA("Sum of Revenue", A3, "Region", "West")
```

> [!tip]
> If your source data changes shape (new rows), make sure the pivot's source range is a **Table** (`Ctrl+T`) so it auto-expands — otherwise you must manually update the range via **Change Data Source**.

## See Also
- [[Power Query Basics]] for prepping messy data before pivoting
- [[Math & Statistical Functions]]
