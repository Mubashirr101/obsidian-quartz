---
title: DateTime & Time Series
tags: [pandas, python, datetime, time-series, resample]
aliases: [.dt, Timestamp, resample, date_range]
---

# DateTime & Time Series

> [!abstract] Definition
> pandas has first-class support for time series via the `Timestamp`/`DatetimeIndex` types and the **`.dt`** accessor (the datetime analog of `.str`), plus resampling and rolling-window tools for time-based aggregation.

---

## Creating Datetime Data

```python
pd.to_datetime("2026-08-01")
pd.to_datetime(["2026-08-01", "2026-08-02"])
pd.to_datetime(df["date_col"])
pd.to_datetime(df["date_col"], format="%d-%m-%Y")   # explicit format = faster + safer
pd.to_datetime(df["date_col"], errors="coerce")       # invalid parses -> NaT instead of error

pd.date_range(start="2026-01-01", end="2026-01-10", freq="D")
pd.date_range(start="2026-01-01", periods=12, freq="M")   # 12 month-end dates
pd.Timestamp("2026-08-01 14:30:00")
pd.Timestamp.now()
```

### Common `freq` codes

| Code | Meaning |
|---|---|
| `D` | calendar day |
| `B` | business day |
| `W` | weekly |
| `M` | month end |
| `MS` | month start |
| `Q` | quarter end |
| `A` / `Y` | year end |
| `H` | hourly |
| `T` / `min` | minute |
| `S` | second |

---

## The `.dt` Accessor

```python
df["date"].dt.year
df["date"].dt.month
df["date"].dt.day
df["date"].dt.day_name()      # 'Monday', 'Tuesday', ...
df["date"].dt.month_name()
df["date"].dt.quarter
df["date"].dt.dayofweek        # Monday=0 ... Sunday=6
df["date"].dt.dayofyear
df["date"].dt.is_month_end
df["date"].dt.is_leap_year
df["date"].dt.days_in_month
df["date"].dt.date              # drop time component -> datetime.date
df["date"].dt.time               # drop date component
df["date"].dt.strftime("%d-%b-%Y")  # format as string
```

---

## Setting a DatetimeIndex & Slicing by Date

```python
df = df.set_index("date")

df["2026"]                       # all rows in year 2026
df["2026-08"]                     # all rows in August 2026
df["2026-01-01":"2026-03-31"]      # inclusive date range slice
df.between_time("09:00", "17:00")   # time-of-day filter (needs DatetimeIndex)
df.at_time("09:30")
```

---

## `.resample()` — Time-Based GroupBy

```python
df.resample("D").sum()          # daily totals
df.resample("M").mean()          # monthly average
df.resample("W-MON").last()        # weekly, weeks ending Monday, last value
df.resample("Q").agg({"sales": "sum", "customers": "nunique"})

df.resample("M").ffill()          # forward-fill when upsampling to higher frequency
```

> [!tip] `resample` vs `groupby`
> `resample()` is `groupby()` specialized for time: it understands calendar-aware bucket boundaries (month-end, business day, etc.) that a plain `groupby()` on a manually truncated date column would need to reconstruct manually.

---

## Shifting & Differencing (Lag/Lead)

```python
df["sales"].shift(1)              # lag by 1 period (previous row's value)
df["sales"].shift(-1)              # lead by 1 period
df["sales"].diff()                  # difference from previous period
df["sales"].diff(periods=7)          # week-over-week difference (daily data)
df["sales"].pct_change()               # percent change from previous period
```

---

## Time Deltas & Arithmetic

```python
pd.Timedelta(days=5)
pd.Timedelta("2 days 3 hours")
df["date"] + pd.Timedelta(days=7)
df["end"] - df["start"]                  # -> Timedelta Series
(df["end"] - df["start"]).dt.days          # extract days as integer
```

---

## Timezones

```python
df["date"].dt.tz_localize("UTC")                  # assign a timezone to naive datetimes
df["date"].dt.tz_convert("Asia/Kolkata")            # convert between timezones
df["date"].dt.tz_localize(None)                       # drop timezone info
```

---

## Rolling / Window with Time

```python
df.rolling("7D").mean()      # 7-calendar-day rolling window (requires DatetimeIndex)
```

> [!info] See [[16-Window-Rolling-Expanding]] for full rolling/expanding/ewm reference.

---

## Business Day / Calendar Utilities

```python
pd.bdate_range("2026-01-01", "2026-01-31")        # business days only
pd.offsets.BDay(5)                                   # add/subtract 5 business days
df["date"] + pd.offsets.MonthEnd(0)                    # snap to month end
```

---

## Notes & Gotchas

> [!warning] `NaT` is the datetime equivalent of `NaN`
> Invalid or missing datetime values become `NaT` (Not a Time). Handle with the same tools as [[05-Missing-Data]] (`isna()`, `dropna()`, `fillna()`).

> [!tip] Always pass `format=` to `pd.to_datetime()` when the format is known
> Explicit formats avoid ambiguous parsing (e.g. `01-02-2026` as Jan 2 vs Feb 1) and are dramatically faster on large datasets.

---

## Related
- [[06-GroupBy]]
- [[16-Window-Rolling-Expanding]]
- [[05-Missing-Data]]
