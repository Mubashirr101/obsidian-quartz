---
title: 📈 Linux System Monitoring & Logs
tags: [linux, monitoring, logs, dmesg, var-log, system-health]
aliases: [Linux Logs, var log, dmesg]
status: evergreen
---

# 📈 Linux System Monitoring & Logs

## 🧠 What this note covers

Keeping an eye on a Linux system's overall health, from memory and CPU usage to reading through log files when something goes wrong, is a core everyday skill for anyone managing a server or troubleshooting a machine. This note covers the essential monitoring commands beyond the process specific ones already covered in [[Linux Process Management]], along with where log files actually live and how to read them effectively.

## 🧠 Checking memory usage: free

```bash
free -h   # shows total, used, and available memory, in human readable form
```

Example output, broken down:

```
              total        used        free      shared  buff/cache   available
Mem:           16Gi       6.2Gi       2.1Gi       412Mi       7.7Gi        9.1Gi
Swap:         4.0Gi          0B       4.0Gi
```

> [!note] Why "used" memory often looks alarmingly high at first glance
> Linux is deliberately designed to use otherwise idle memory for disk caching, shown in the `buff/cache` column, since unused memory sitting around doing nothing is genuinely wasted potential performance. This cached memory is not permanently locked away, it gets instantly and automatically freed up the moment an actual running program needs it. This is exactly why the `available` column is the more meaningful, realistic number to actually pay attention to, rather than the raw `used` figure, which can look deceptively high even on a perfectly healthy system.

> [!note] What swap actually is
> Swap is a portion of disk space set aside to act as an overflow area for memory, used when the system's genuine physical memory (RAM) becomes completely full. Because disk access is dramatically slower than RAM, a system that is actively and heavily using swap is usually a sign of memory pressure and will typically feel noticeably sluggish, making swap usage worth watching as an early warning sign of a memory shortage.

## 💻 Checking CPU and overall load: uptime and top

```bash
uptime   # shows how long the system has been running, plus the current "load average"
```

Example output:

```
14:32:01 up 12 days,  3:14,  2 users,  load average: 0.52, 0.61, 0.58
```

> [!note] Understanding the three load average numbers
> These three numbers represent the average system load over the last 1 minute, 5 minutes, and 15 minutes respectively, giving you a quick sense of whether load has been rising, falling, or staying steady recently. A load average value roughly equal to the number of CPU cores available generally represents a fully but reasonably utilized system, while a value significantly higher than the core count suggests processes are genuinely queuing up and waiting for CPU time, a sign of real strain.

```bash
nproc   # shows how many CPU cores are available, useful context for interpreting the load average numbers above
```

For a genuinely live, continuously updating view of both CPU and memory together, `top` and `htop`, already covered in [[Linux Process Management]], remain the primary go-to tools.

## 🗂️ Where log files actually live: /var/log

Most system and application logs on Linux are stored as plain text files inside the `/var/log` directory, directly connecting back to the filesystem structure explained in [[Linux Filesystem Hierarchy]].

```bash
ls /var/log        # lists available log files and folders
cat /var/log/syslog   # views the main general system log (on Debian and Ubuntu based systems)
cat /var/log/auth.log   # views authentication related events, such as login attempts and sudo usage
```

> [!note] Log file names vary somewhat between distributions
> While `/var/log` itself is a near universal convention, the exact names of specific log files can differ meaningfully between distribution families. Debian and Ubuntu based systems traditionally use `/var/log/syslog` as their main general log, while Red Hat, Fedora, and CentOS based systems traditionally use `/var/log/messages` for the equivalent role. On modern systemd based systems, the centralized `journalctl` command, covered in [[Linux Systemd & Services]], has increasingly become the more consistent, distribution independent way to access equivalent log information regardless of these older, differing file naming conventions.

## 🥾 Viewing kernel and boot messages: dmesg

`dmesg` shows messages produced directly by the Linux kernel itself, particularly useful for diagnosing hardware related issues, such as a USB device not being detected properly or a disk reporting errors.

```bash
dmesg          # shows the full kernel message buffer, often quite long
dmesg | tail     # shows just the most recent kernel messages, usually more immediately useful
dmesg -T           # adds actual human readable timestamps to each message, instead of raw system uptime seconds
dmesg | grep -i "usb"   # filters kernel messages down to ones specifically mentioning USB, using grep from Linux Text Processing
```

> [!tip] dmesg is often the first place to check for hardware problems
> Whenever a piece of physical hardware, such as a newly connected external drive or a network card, is not behaving as expected, `dmesg` is frequently the very first and most useful place to look, since the kernel itself directly reports on hardware detection, driver loading, and low level errors here, often revealing the exact underlying reason a device is not working correctly.

## 📊 A broader system overview: vmstat and iostat

For a genuinely comprehensive, all-in-one snapshot of memory, CPU, and disk activity together, a couple of additional tools go beyond what `top` alone shows.

```bash
vmstat 2      # shows a continuously updating summary of memory, CPU, and process activity, refreshing every 2 seconds
iostat -x 2      # shows detailed disk input and output statistics, refreshing every 2 seconds, useful for disk bottlenecks
```

> [!note] iostat may need to be installed separately
> Unlike `free`, `uptime`, and `top`, which are typically available on virtually every Linux system by default, `iostat` is often part of a separate package, commonly named `sysstat`, that may need to be installed first using the tools covered in [[Linux Package Management]] before it becomes available to use.

## 🧾 rotating logs: logrotate

Left completely unchecked, log files can grow indefinitely over time, eventually consuming a genuinely significant, even problematic, amount of disk space. `logrotate` is a standard, typically pre-installed utility that automatically archives, compresses, and eventually deletes old log entries on a defined schedule, based on configuration files usually found in `/etc/logrotate.d/`.

```bash
cat /etc/logrotate.d/nginx   # views the logrotate configuration specifically for the nginx service, if installed
```

> [!tip] You generally do not need to configure logrotate yourself for standard software
> Most properly packaged software that produces meaningful log output, when installed through your distribution's own package manager as covered in [[Linux Package Management]], already ships with a sensible, working logrotate configuration of its own, automatically included as part of the installation. You typically only need to think about writing your own custom logrotate configuration for logs produced by your own custom scripts or applications, ones without any existing packaged configuration already looking after them.

## 🔗 Where to go next

System monitoring connects directly back to [[Linux Process Management]] for investigating exactly which specific process is responsible for high resource usage, and to [[Linux Systemd & Services]] for the modern, centralized `journalctl` approach to logs. For automating regular health checks entirely on their own, revisit [[Linux Cron & Task Scheduling]].
