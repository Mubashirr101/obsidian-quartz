---
tags: [excel, formulas, finance]
created: 2026-07-22
---

# Financial Functions

> [!info] Navigation
> Part of [[Excel MOC]]

> [!note] Sign Convention
> Cash **outflows** (payments made) are negative; cash **inflows** (money received) are positive. This trips up almost everyone at first.

## Loan / Annuity Functions
```
=PMT(rate, nper, pv, [fv], [type])       → periodic payment
=IPMT(rate, per, nper, pv, [fv], [type]) → interest portion of a payment
=PPMT(rate, per, nper, pv, [fv], [type]) → principal portion of a payment
=NPER(rate, pmt, pv, [fv], [type])       → number of periods
=RATE(nper, pmt, pv, [fv], [type])       → interest rate per period
```

| Arg | Meaning |
|---|---|
| `rate` | Interest rate **per period** (annual rate ÷ periods/year) |
| `nper` | Total number of payment periods |
| `pv` | Present value (loan amount, usually negative if it's what you owe) |
| `fv` | Future value (default 0) |
| `type` | `0` = payment at end of period (default), `1` = start of period |

**Example — monthly EMI on ₹50,00,000 loan, 8% annual, 20 years:**
```
=PMT(8%/12, 20*12, -5000000)
```

## Present / Future Value
```
=PV(rate, nper, pmt, [fv], [type])
=FV(rate, nper, pmt, [pv], [type])
```

## Investment Appraisal
```
=NPV(rate, value1, [value2], ...)   → Net Present Value of a cash flow series
=IRR(values, [guess])                → Internal Rate of Return
=XNPV(rate, values, dates)           → NPV with irregular dates
=XIRR(values, dates, [guess])        → IRR with irregular dates
```

> [!warning]
> `NPV()` assumes cash flows occur at **regular** intervals starting one period from now — it does **not** include an initial investment at time 0. Add that separately: `=NPV(rate, C2:C10) + C1`

## Depreciation
```
=SLN(cost, salvage, life)                  → straight-line
=DB(cost, salvage, life, period)           → declining balance
=SYD(cost, salvage, life, per)             → sum-of-years digits
```

## CAGR (manual formula — no built-in function)
```
=(Ending_Value/Beginning_Value)^(1/Years)-1
```

## Quick Reference Table

| Function | Solves For |
|---|---|
| PMT | Payment amount |
| RATE | Interest rate |
| NPER | Number of periods |
| PV | Present value / loan principal |
| FV | Future value |
| NPV/IRR | Investment worth / return rate |

## See Also
- [[Math & Statistical Functions]]
- [[Date & Time Functions]] for `XNPV`/`XIRR` date handling
