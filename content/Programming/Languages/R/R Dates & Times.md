---
title: 📅 R Dates & Times
tags: [r, programming, dates, time, lubridate]
aliases: [R Date Handling, lubridate]
status: evergreen
---

# 📅 R Dates & Times

## 🧠 What this note covers

Dates and times feel simple on the surface but tend to hide a surprising amount of complexity, from time zones to leap years to varying month lengths. This note covers R's base Date and POSIXct classes for handling calendar dates and precise timestamps, and then introduces the lubridate package, which makes almost all of this dramatically easier and less error prone.

## 📆 The Date class

R's built in `Date` class represents a calendar date, with no time of day attached at all, internally stored as the number of days since January 1st, 1970.

```r
today <- Sys.Date()
print(today)
class(today)   # "Date"

my_date <- as.Date("2026-08-10")   # converts text into a real Date object
```

> [!warning] Date parsing depends on the format matching
> `as.Date()` expects the text to be in "YYYY-MM-DD" format by default. If your date is formatted differently, such as "10/08/2026," you must explicitly tell R the format it should expect, otherwise the conversion will either fail outright or, worse, silently produce a wrong date.

```r
as.Date("10/08/2026", format = "%d/%m/%Y")
# correctly interpreted as the 10th of August, 2026
```

### Common format codes

| Code | Meaning | Example |
|---|---|---|
| `%Y` | 4 digit year | 2026 |
| `%y` | 2 digit year | 26 |
| `%m` | 2 digit month | 08 |
| `%d` | 2 digit day | 10 |
| `%B` | Full month name | August |
| `%b` | Abbreviated month name | Aug |
| `%A` | Full weekday name | Monday |
| `%H` | Hour, 24 hour format | 14 |
| `%M` | Minute | 30 |
| `%S` | Second | 00 |

> [!tip] Reading format codes is like matching a template to the text
> A helpful way to think about the format string is that you are drawing a template over your actual date text, marking which part is which. If your text is "10-Aug-2026," your format string needs to be `"%d-%b-%Y"`, matching piece for piece in the exact same order and using the exact same separator characters.

## ⏱️ The POSIXct class for date and time together

When you need both a date and a specific time of day, R uses the `POSIXct` class instead, which also carries time zone information.

```r
now <- Sys.time()
print(now)
class(now)   # "POSIXct" "POSIXt"

my_datetime <- as.POSIXct("2026-08-10 14:30:00", tz = "Asia/Kolkata")
```

> [!note] Why time zones matter even if you never leave home
> Even if you always work with data from a single location, servers, cloud storage, and many APIs frequently store or return timestamps in UTC (Coordinated Universal Time) by default. Explicitly setting the `tz` argument whenever you parse a timestamp is a good habit that avoids subtle, hours-long offset bugs that are notoriously hard to trace later.

## 🧮 Date arithmetic

One of the genuinely convenient features of R's date classes is that basic arithmetic just works correctly, automatically accounting for things like different month lengths and leap years.

```r
as.Date("2026-08-10") + 30      # correctly adds 30 days, rolling over into September
as.Date("2026-08-10") - as.Date("2026-01-01")   # returns a "difftime" object, "221 days"

as.numeric(as.Date("2026-08-10") - as.Date("2026-01-01"))   # converts that difference into a plain number
```

## 🧩 Extracting parts of a date

```r
d <- as.Date("2026-08-10")

format(d, "%Y")     # "2026", extracts just the year, as text
format(d, "%B")      # "August", the full month name
weekdays(d)           # "Monday", the day of the week
```

## 📦 lubridate: making date handling far easier

The lubridate package, another core tidyverse tool, offers much friendlier functions for the exact same tasks, and is what most modern R code actually uses in practice.

```r
library(lubridate)

ymd("2026-08-10")           # parses a year-month-day formatted string automatically
dmy("10-08-2026")            # parses a day-month-year formatted string automatically
mdy("08-10-2026")             # parses a month-day-year formatted string automatically

ymd_hms("2026-08-10 14:30:00")   # parses a full date and time together
```

> [!tip] Why lubridate's naming is so intuitive
> The function names in lubridate directly spell out the order of the components in your text, so `dmy()` means "the text I am giving you is arranged as day, then month, then year." This removes the need to remember format code symbols like `%d` and `%m` for the vast majority of everyday parsing tasks.

### Extracting and modifying components with lubridate

```r
d <- ymd("2026-08-10")

year(d)      # 2026
month(d)      # 8
day(d)         # 10
wday(d, label = TRUE)   # "Mon", the weekday as a readable label

year(d) <- 2027   # you can directly reassign a component, updating the date in place
```

### Convenient duration helpers

```r
d <- ymd("2026-08-10")

d + days(10)     # adds exactly 10 days
d + months(2)      # adds 2 calendar months, correctly handling different month lengths
d + years(1)         # adds 1 year, correctly handling leap years

interval(ymd("2026-01-01"), ymd("2026-08-10")) / days(1)   # counts the number of days between two dates
```

> [!warning] months() versus a fixed number of days
> Adding `months(1)` to a date is not the same thing as blindly adding 30 days, since lubridate correctly understands that months have varying lengths. Adding one month to January 31st, for example, correctly rolls into a valid date rather than accidentally landing on a nonexistent day like "February 31st."

## 🔗 Where to go next

Dates frequently need to be extracted from messier text first, so pairing this note with [[R String Manipulation & Regex]] is common in real projects. Once your data has clean dates attached, [[R dplyr & Tidyverse]] and [[R ggplot2 Visualization]] make it easy to summarize and plot trends over time.
