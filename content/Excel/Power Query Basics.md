---
tags: [excel, power-query, workflows]
created: 2026-07-22
---

# Power Query Basics

> [!info] Navigation
> Part of [[Excel MOC]]

## What It's For
ETL (Extract, Transform, Load) tool built into Excel. Clean, reshape, and combine data from multiple sources **without formulas**, with every step recorded and repeatable/refreshable.

## Getting Data In
**Data → Get Data** → choose source:
- From File (Excel, CSV, JSON, XML, PDF, Folder)
- From Database (SQL Server, Access, etc.)
- From Web
- From Other Sources (blank query, ODBC...)

Opens the **Power Query Editor**.

## Core Transformations
| Action | Where |
|---|---|
| Remove/Choose columns | Home → Remove Columns / Choose Columns |
| Change data type | Click the type icon in column header |
| Remove duplicates | Home → Remove Rows → Remove Duplicates |
| Filter rows | Column header dropdown |
| Split column | Transform → Split Column (by delimiter, position, etc.) |
| Merge columns | Transform → Merge Columns |
| Unpivot | Transform → Unpivot Columns (wide → long format) |
| Pivot | Transform → Pivot Column (long → wide format) |
| Group By | Transform → Group By (aggregate like SQL GROUP BY) |
| Fill down/up | Transform → Fill |
| Replace values | Transform → Replace Values |
| Trim/Clean text | Transform → Format → Trim/Clean |

## Combining Queries

### Append (stack rows, like UNION)
**Home → Append Queries** aka combines rows from two+ tables with matching columns.

### Merge (join columns , like SQL JOIN)
**Home → Merge Queries** aka combine on a matching key column.

| Join Type | Behavior |
|---|---|
| Left Outer | All rows from left, matches from right |
| Right Outer | All rows from right, matches from left |
| Full Outer | All rows from both |
| Inner | Only matching rows |
| Left Anti | Left rows with **no** match (opposite of inner) |
| Right Anti | Right rows with no match |

## The Applied Steps Pane
Every transformation is recorded as a step (right panel) —> steps can be reordered, edited, or deleted. This is the query's recorded "recipe," re-run automatically on refresh.

## M Language
Power Query's formula language, visible via **Advanced Editor**. Example:
```
let
    Source = Excel.CurrentWorkbook(){[Name="RawData"]}[Content],
    Filtered = Table.SelectRows(Source, each [Amount] > 0),
    Renamed = Table.RenameColumns(Filtered, {{"Amt", "Amount"}})
in
    Renamed
```

## Loading Results
**Home → Close & Load** or **Close & Load To...** , choose:
- Table (new sheet)
- PivotTable Report
- Connection Only (used as a source for other queries, doesn't clutter the workbook)

## Refreshing
**Data → Refresh All** or right-click the query → Refresh. Automate via **Query Properties → Refresh every N minutes** or refresh on file open.

> [!tip]
> Power Query is ideal for repeatable monthly reports, build the transformation once, then just refresh with new source data each time.

## See Also
- [[Pivot Tables]]
