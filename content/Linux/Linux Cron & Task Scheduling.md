---
title: Linux Cron & Task Scheduling
tags:
  - linux
  - cron
  - crontab
  - task-scheduling
  - automation
aliases:
  - crontab
  - Linux cron jobs
  - at command
status: evergreen
---

#  Linux Cron & Task Scheduling

## 🧠 What this note covers

Cron is Linux's traditional, built in tool for running commands or scripts automatically, on a recurring schedule, without any manual intervention needed each time. This note covers writing and managing cron jobs, understanding cron's sometimes intimidating scheduling syntax, and a lighter weight alternative called `at` for one time, rather than recurring, scheduled tasks.

## 📅 What is a cron job

A cron job is simply a scheduled task, defined by pairing a specific timing pattern with a specific command to run, stored in a special file called a crontab, short for "cron table." A background service, the cron daemon, continuously checks these entries and automatically triggers each command at its scheduled time.

## 🛠️ Editing your crontab

```bash
crontab -e     # opens your personal crontab in your default text editor, for adding or editing scheduled jobs
crontab -l        # lists your current scheduled jobs, without opening an editor
crontab -r          # removes your ENTIRE crontab, deleting every scheduled job at once
```

> [!warning] crontab -r has no confirmation prompt
> Running `crontab -r` immediately deletes your entire crontab, wiping out every single scheduled job you have set up, with no confirmation step and no undo. It is worth being deliberate and careful before running this specific command, and considering `crontab -l` first to review, or even save a backup copy of, your existing jobs before removing them.

## 🧮 Understanding the cron timing syntax

Each line in a crontab follows a specific five field pattern, describing exactly when the job should run, followed by the actual command to execute.

```
* * * * * command_to_run
│ │ │ │ │
│ │ │ │ └── day of week (0 - 6, where 0 is Sunday)
│ │ │ └──── month (1 - 12)
│ │ └────── day of month (1 - 31)
│ └──────── hour (0 - 23)
└────────── minute (0 - 59)
```

> [!tip] A genuinely helpful memory device for the field order
> A common way to remember the order of these five fields is the phrase "minute, hour, day, month, weekday," moving from the smallest, most frequent unit of time on the left, all the way up to the least frequent on the right, before finally arriving at the actual command itself.

### Practical examples

```bash
# Runs every single minute
* * * * * /home/amit/scripts/check.sh

# Runs at 2:30 AM, every single day
30 2 * * * /home/amit/scripts/backup.sh

# Runs at 9:00 AM, but ONLY on weekdays (Monday through Friday)
0 9 * * 1-5 /home/amit/scripts/report.sh

# Runs at midnight, on the 1st day of every month
0 0 1 * * /home/amit/scripts/monthly_cleanup.sh

# Runs every 15 minutes, all day, every day
*/15 * * * * /home/amit/scripts/monitor.sh
```

> [!note] What the asterisk and the slash mean
> An asterisk `*` in any field means "every possible value," essentially meaning "do not restrict this field at all." A forward slash, as in `*/15`, means "every N units," so `*/15` in the minute field specifically means "run this job every 15 minutes," rather than only at one specific minute mark. A range, such as `1-5` in the weekday field, means "any value from 1 through 5 inclusive," here representing Monday through Friday.

## ⚠️ A few common cron pitfalls worth knowing in advance

> [!warning] Cron jobs run with a minimal, stripped down environment
> Unlike running a script directly from your normal interactive terminal, cron runs your job in a much more minimal environment, often without the same `PATH` variable, aliases, or other shell customizations you are used to, which are all covered in [[Linux Environment Variables & Shell Config]]. This is exactly why a script that works perfectly when you run it manually can mysteriously fail, or behave differently, when triggered automatically by cron. A reliable fix is to always use full, absolute paths inside your cron scripts, both for the script itself and for any commands or files it references internally, rather than relying on cron correctly finding things through a shortened relative path.

> [!warning] Cron jobs run silently by default, with no visible output
> Since there is no active terminal for a cron job's output to actually display on, any output it produces normally just gets silently discarded, or in some configurations gets emailed to the local user account, depending on how the system is configured. It is generally good practice to redirect a cron job's output into a dedicated log file yourself, so that you have a reliable, permanent record to check later if something unexpectedly fails.

```bash
0 2 * * * /home/amit/scripts/backup.sh >> /home/amit/logs/backup.log 2>&1
# redirects both normal output AND error output into a log file, using the redirection concepts from
# Linux Piping & Redirection, so you have a record even though nobody is watching it run live
```

## 🕐 at: scheduling a one time task instead of a recurring one

While cron is specifically built for recurring, repeating schedules, `at` is designed for scheduling a task to run just once, at some specific point in the future, and is often a more natural fit for a genuinely one-off need.

```bash
at 3:00 PM
at> /home/amit/scripts/reminder.sh
at> Ctrl+D
# schedules the script to run once, later today at 3:00 PM

echo "/home/amit/scripts/reminder.sh" | at now + 2 hours
# schedules a script to run once, exactly two hours from right now

atq       # lists currently pending, scheduled "at" jobs
atrm 3      # cancels a specific pending job, by its ID number as shown in atq
```

> [!tip] Choosing between cron and at
> As a simple general rule, reach for `cron` whenever a task genuinely needs to repeat on some kind of ongoing schedule, such as a nightly backup or an hourly health check. Reach for `at` instead when you specifically need something to happen exactly once, at some particular future moment, such as scheduling a single reminder or a one-time maintenance task, without needing to remember to manually cancel a recurring cron entry afterward.

## 🌍 A note on system wide cron jobs

Beyond a personal crontab managed with `crontab -e`, which only affects your own individual user account, Linux also supports system wide scheduled jobs, typically placed directly into `/etc/cron.d/`, or into convenience folders like `/etc/cron.daily/`, `/etc/cron.weekly/`, and `/etc/cron.monthly/`, where any executable script placed inside automatically runs on that folder's implied schedule.

> [!note] When system wide locations make more sense than a personal crontab
> System wide cron locations are generally the more appropriate choice for administrative tasks that genuinely belong to the system itself, rather than to any one particular user, such as routine log rotation or system cleanup tasks, and are also easier for other administrators to discover later, since they live in a clearly documented, standard, predictable location rather than being tucked away inside one specific person's individual crontab.

## 🔗 Where to go next

Scheduled automation connects naturally back to [[Linux Shell Scripting]] for writing the actual scripts being scheduled, and to [[Linux Systemd & Services]], since systemd also offers its own separate, increasingly popular scheduling mechanism called systemd timers, worth exploring as a modern alternative to cron for anyone already comfortable working with systemd.
