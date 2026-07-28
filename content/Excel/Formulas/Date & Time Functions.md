---
tags: [excel, formulas, dates]
created: 2026-07-22
---

# Date & Time Functions

> [!info] Navigation
> Part of [[Excel MOC]]

> [!note] How Excel Stores Dates
> Dates are stored as serial numbers (day count since **1 Jan 1900** = 1). Time is the decimal fraction of a day (`12:00 PM` = `0.5`). This is why dates can be added/subtracted directly.

## Getting Current Date/Time
```
=TODAY()     → current date (volatile, updates on recalculation)
=NOW()       → current date + time
```

## Building & Extracting Dates
```
=DATE(year, month, day)
=YEAR(date)  =MONTH(date)  =DAY(date)
=WEEKDAY(date, [return_type])   → 1=Sun...7=Sat by default
=WEEKNUM(date)
=TEXT(date,"dddd")               → day name, e.g. "Wednesday"
```

## Date Arithmetic
```
=EDATE(start_date, months)        → add/subtract months
=EOMONTH(start_date, months)      → last day of month, n months away
=DATEDIF(start, end, unit)        → difference; units: "Y","M","D","YM","MD","YD"
```

> [!warning]
> `DATEDIF` is undocumented in the UI (no autocomplete/help) but fully functional — very useful for age/tenure calculations.

**Working days:**
```
=NETWORKDAYS(start, end, [holidays])          → count business days
=NETWORKDAYS.INTL(start, end, [weekend], [holidays])  → custom weekend pattern
=WORKDAY(start, days, [holidays])             → date n working days from start
=WORKDAY.INTL(start, days, [weekend], [holidays])
```

## Time Functions
```
=TIME(hour, minute, second)
=HOUR(time)  =MINUTE(time)  =SECOND(time)
=TEXT(time,"hh:mm AM/PM")
```

## Handy Patterns

| Goal | Formula |
|---|---|
| Age in years | `=DATEDIF(DOB, TODAY(), "Y")` |
| Days until deadline | `=DueDate - TODAY()` |
| First day of month | `=DATE(YEAR(A1),MONTH(A1),1)` |
| Last day of month | `=EOMONTH(A1,0)` |
| Quarter number | `=ROUNDUP(MONTH(A1)/3,0)` |
| Is weekend? | `=WEEKDAY(A1,2)>5` |

## Common Date Errors
- Dates stored as **text** (left-aligned instead of right-aligned) break arithmetic — fix with `=DATEVALUE(text)`
- Regional format mismatches (`DD/MM/YYYY` vs `MM/DD/YYYY`) cause silent misreads

## See Also
- [[Text Functions]] for `TEXT()` formatting codes
- [[Common Errors Reference]]
