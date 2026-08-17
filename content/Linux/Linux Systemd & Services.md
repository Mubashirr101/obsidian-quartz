---
title: " Linux Systemd & Services"
tags:
  - linux
  - systemd
  - systemctl
  - services
  - daemons
aliases:
  - systemctl
  - Linux Services
  - systemd
status: evergreen
---

# Linux Systemd & Services

## 🧠 What this note covers

Most modern Linux distributions use a system and service manager called systemd, which is responsible for starting up the operating system itself, and for managing background services, often called "daemons," that need to run continuously, such as a web server or a database. This note covers using `systemctl`, the primary command for controlling systemd, and reading the logs it produces.

## 🧰 What is a service (daemon)

A service, sometimes called a daemon, is a program designed to run continuously in the background, without any direct user interaction, typically started automatically when the system boots and kept running indefinitely, restarting itself automatically if it happens to crash. Common real world examples include a web server like nginx, a database like PostgreSQL, or the SSH server that allows remote logins in the first place, covered in [[Linux Networking]].

## 🎛️ systemctl: the main tool for controlling services

```bash
sudo systemctl start nginx        # starts a service right now
sudo systemctl stop nginx           # stops a running service
sudo systemctl restart nginx          # stops and then immediately starts a service again
sudo systemctl reload nginx             # asks a service to reload its configuration WITHOUT fully restarting
sudo systemctl status nginx               # shows whether a service is running, and recent relevant log output
```

> [!tip] restart versus reload, a genuinely useful distinction
> A full `restart` completely stops the service and starts it fresh, which briefly interrupts anything currently relying on it, such as active connections to a web server. A `reload`, when a service supports it, instead asks the already-running service to simply re-read its configuration file and apply any changes, without actually shutting down or interrupting existing connections at all. For a busy production web server, `reload` is very often the gentler, less disruptive choice whenever it is actually supported.

### Controlling whether a service starts automatically at boot

```bash
sudo systemctl enable nginx      # configures the service to start AUTOMATICALLY every time the system boots
sudo systemctl disable nginx       # removes it from starting automatically at boot
sudo systemctl is-enabled nginx      # checks whether a service is currently set to start automatically or not
```

> [!warning] enable and start are two genuinely separate actions
> A very common point of confusion for newcomers is assuming that `enable` also immediately starts the service, or that `start` also configures it to launch automatically at the next boot. Neither assumption is correct. `enable` only configures future automatic startup behavior, without affecting whether the service is running right now, and `start` only affects whether it is running right now, without changing anything about future boots. It is extremely common, and usually correct, to run both `enable` and `start` together when setting up a new service you want running both immediately and permanently going forward.

## 📋 Listing services

```bash
systemctl list-units --type=service            # lists every service currently loaded and known to systemd
systemctl list-units --type=service --state=running   # filters that list down to only currently running services
systemctl --failed                                       # shows any services that have failed to start correctly
```

> [!tip] --failed is a genuinely useful quick health check
> Running `systemctl --failed` is a fast, useful way to get an immediate overview of whether anything on the system is currently in a broken state, without needing to check every single service individually one by one.

## 📜 Viewing service logs: journalctl

Systemd keeps its own centralized log of everything happening across the system and its services, accessed through a companion tool called `journalctl`, related conceptually to the more general log files covered in [[Linux System Monitoring & Logs]].

```bash
journalctl -u nginx           # shows all logged output specifically for the nginx service
journalctl -u nginx -f           # "follows" the log live, showing new entries as they happen, similar to tail -f
journalctl -u nginx --since "1 hour ago"   # filters to only recent log entries, within a specific time window
journalctl -p err                 # shows only log entries at ERROR priority or higher, across every service
```

> [!tip] journalctl -u is one of the most common troubleshooting commands
> When a service fails to start or is behaving unexpectedly, `journalctl -u <servicename>` is very often the very first place to look, since it shows exactly what that service itself reported about what went wrong, frequently including a specific, actionable error message that directly explains the underlying problem.

## 📝 Writing your own basic systemd service

For any long running script or program you have written yourself, you can register it as a genuine systemd service, gaining all the same benefits of automatic startup, restart on crash, and centralized logging that built in services enjoy.

```ini
# saved as /etc/systemd/system/myapp.service
[Unit]
Description=My Custom Application
After=network.target

[Service]
ExecStart=/home/amit/scripts/myapp.sh
Restart=always
User=amit

[Install]
WantedBy=multi-user.target
```

After creating this file, a few commands are needed to actually activate it.

```bash
sudo systemctl daemon-reload    # tells systemd to re-scan for new or changed service files
sudo systemctl enable myapp        # configures it to start automatically at boot
sudo systemctl start myapp           # starts it immediately, right now
```

> [!note] Breaking down the key fields in a service file
> The `[Unit]` section describes the service and what it depends on, here specifying it should only start `After` basic networking is already available. The `[Service]` section describes how to actually run it, including the exact command in `ExecStart`, whether it should automatically restart itself if it crashes via `Restart=always`, and which user account it should run under. The `[Install]` section describes how the service integrates into the overall boot process, with `multi-user.target` representing the normal, standard multi user running state most servers operate in.

> [!warning] Do not forget daemon-reload after creating or editing a service file
> Systemd only reads service files from disk at specific moments, not continuously and automatically. After creating a brand new service file, or editing an existing one, you must run `sudo systemctl daemon-reload` before your changes will actually take effect, otherwise systemd will continue operating using its old, cached understanding of that service's configuration.

## 🔗 Where to go next

Services connect directly to the process concepts covered in [[Linux Process Management]], since every running service is, underneath it all, just an ordinary process being supervised by systemd. Continue to [[Linux System Monitoring & Logs]] for a broader look at overall system health beyond individual services, or to [[Linux Cron & Task Scheduling]] for running one-off or repeating tasks that do not need to run continuously the way a true service does.
