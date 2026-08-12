---
title: ⚙️ Linux Process Management
tags: [linux, process, ps, top, kill, jobs]
aliases: [Linux Processes, ps command, kill command]
status: evergreen
---

# ⚙️ Linux Process Management

## 🧠 What this note covers

A process is simply a running instance of a program. Every single command you run, every background service, and even your own shell itself, is a process, each one assigned a unique number called a process ID, or PID. This note covers how to see what processes are currently running, how to control them, and how to manage jobs running directly inside your own terminal session.

## 👀 Viewing running processes: ps

```bash
ps          # shows just the processes running in YOUR current terminal session
ps aux        # shows EVERY process running on the entire system, from every user, in great detail
ps aux | grep "python"   # combines ps with grep, a very common way to find a specific process
```

Breaking down the extremely common `ps aux` output columns:

| Column | Meaning |
|---|---|
| `USER` | Which user owns and is running this process |
| `PID` | The unique process ID number |
| `%CPU` | Percentage of CPU currently being used by this process |
| `%MEM` | Percentage of memory currently being used by this process |
| `STAT` | The process's current status code, such as running, sleeping, or stopped |
| `COMMAND` | The actual command that started this process |

> [!note] What the aux flags actually mean
> The `a` flag shows processes belonging to all users, not just yourself. The `u` flag switches to a more detailed, user oriented display format, adding columns like CPU and memory usage. The `x` flag additionally includes processes that are not attached to a terminal at all, such as background system services. Together, `aux` gives you the fullest possible picture of everything running on the machine.

## 📊 Live monitoring: top and htop

Where `ps` gives you a single snapshot of processes at one moment, `top` shows a continuously updating, live view.

```bash
top   # opens a live, auto refreshing view of running processes, sorted by CPU usage by default
```

Inside `top`, a few useful keys:

| Key | Action |
|---|---|
| `q` | Quit and return to your normal terminal |
| `k` | Kill a process, after being prompted for its PID |
| `M` | Sort the list by memory usage instead of CPU |
| `P` | Sort the list by CPU usage (the default) |

> [!tip] htop as a friendlier alternative
> `htop` is a separately installable, more visual, and generally more beginner friendly alternative to `top`, offering color coded bars, mouse support, and easier scrolling and process control. It is not always installed by default, but is well worth installing yourself using the tools covered in [[Linux Package Management]], since most people who try it end up preferring it permanently.

## 🛑 Stopping processes: kill

`kill` sends a signal to a process, and despite its name, it does not always mean forcefully terminating something, since different signals request different kinds of behavior from the target process.

```bash
kill 1234           # sends the default signal (SIGTERM, a polite request to shut down) to process ID 1234
kill -9 1234           # sends SIGKILL, an immediate, forceful termination with no chance for cleanup
kill -15 1234             # explicitly sends SIGTERM, same as the plain default kill command
killall firefox              # kills every process matching a given NAME, rather than a specific PID
pkill -f "python script.py"     # kills processes matching a pattern found anywhere in their full command line
```

> [!warning] SIGTERM versus SIGKILL, a genuinely important difference
> A plain `kill` sends SIGTERM, which politely asks the target process to shut itself down, giving it a chance to save unsaved data, close open files properly, and clean up after itself before exiting. `kill -9` sends SIGKILL instead, which the operating system enforces immediately and unconditionally, with the process never even getting a chance to run its own shutdown logic at all. Always try a plain `kill` first, and only escalate to `kill -9` if the process genuinely refuses to respond and exit after a reasonable wait.

## 🧑‍💻 Foreground and background jobs

When you run a command normally, it runs in the "foreground," meaning it takes over your terminal and you cannot type anything else until it finishes. You can instead send a command to run in the "background," freeing up your terminal to keep using immediately.

```bash
long_running_script.sh &     # the trailing & starts the command directly in the background
jobs                            # lists all jobs currently running in the background, within this terminal session
```

```bash
# If you forgot to add & when starting something, you can still send it to the background afterward
Ctrl + Z        # pauses ("suspends") the currently running foreground command
bg                # resumes that paused command, but now running in the background
fg                  # brings a background job back into the foreground
fg %2                 # brings a SPECIFIC background job back to the foreground, by its job number
```

> [!tip] Ctrl+Z pauses, it does not stop
> A very common point of confusion is that pressing `Ctrl + Z` does not terminate the running command, it only pauses it, similar to pressing pause on a video rather than stopping it entirely. The paused process is still sitting in memory, simply not actively running, until you explicitly resume it with either `fg` (foreground) or `bg` (background).

## 🚀 Running something that survives after you log out: nohup

By default, background jobs started in a terminal session are tied to that session, and get terminated automatically the moment you log out or close the terminal. `nohup`, short for "no hangup," prevents this.

```bash
nohup long_running_script.sh &
# the process will continue running even after you close this terminal or disconnect entirely
```

> [!note] Where nohup's output goes
> By default, `nohup` redirects any output that would normally have appeared on your screen into a file named `nohup.out`, created in your current directory, since there is no longer an active terminal for that output to be displayed on once you have logged out.

## 🌳 Understanding parent and child processes

Every process, except for the very first one started when the system boots, has a "parent" process that created it, and can itself go on to create "child" processes of its own, forming a tree structure.

```bash
pstree             # displays the entire process tree visually, showing exactly which process spawned which
ps -ef --forest       # a similar tree style view, using standard ps flags instead of the separate pstree tool
```

> [!note] Why this hierarchy matters practically
> Understanding the parent-child relationship matters in practice because killing a parent process, depending on how it and its children were set up, can sometimes also terminate all of its child processes along with it, or alternatively leave them running as newly "orphaned" processes, adopted automatically by the system's very first process. This distinction occasionally explains confusing situations where stopping one script does not actually stop everything you expected it to.

## 🔗 Where to go next

Process management connects directly to running services in the background permanently, covered in [[Linux Systemd & Services]], and to scheduling processes to run automatically, covered in [[Linux Cron & Task Scheduling]]. For a deeper look at overall system health beyond individual processes, continue to [[Linux System Monitoring & Logs]].
