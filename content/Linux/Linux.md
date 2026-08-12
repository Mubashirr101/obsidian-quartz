---
title: 🐧 Linux
tags: [linux, sysadmin, moc, index]
aliases: [Linux Notes, GNU/Linux]
status: evergreen
---

# 🐧 Linux

## 👋 Introduction

Linux is a free and open source operating system kernel, originally created by Linus Torvalds in 1991 as a personal project while he was a student in Finland. Today, the word "Linux" is used loosely to describe not just the kernel itself but the entire family of operating systems built around it, usually paired with tools from the GNU project, which is why some people prefer the more technically correct name GNU/Linux. Distributions, often shortened to "distros," package the Linux kernel together with a set of software, a package manager, and configuration defaults. Examples include Ubuntu, Debian, Fedora, Arch Linux, and many more, each with its own philosophy and target audience.

What makes Linux worth learning deeply is that it sits underneath an enormous amount of the modern computing world. Nearly every web server, cloud instance, and container you will ever deploy code to is running some flavor of Linux. Every Android phone runs a modified Linux kernel. Most of the tools that developers rely on daily, from Git to Docker to Python itself, were designed with a Linux environment in mind first. Understanding Linux is understanding the environment your code actually runs in, not just the language it is written in.

This folder focuses heavily on the command line, since that is genuinely the primary and most powerful way to interact with Linux, especially on servers that have no graphical interface at all. Learning to be comfortable typing commands instead of clicking through menus is one of the most valuable technical habits you can build.

> [!note] The shell is your main interface
> Throughout this folder you will see the word "shell" a lot. A shell is simply a program that reads the commands you type and asks the operating system to carry them out. The most common shell by far is called bash, short for "Bourne Again SHell," and it is the default on most Linux distributions, so unless otherwise noted, every command shown across this folder assumes you are typing into a bash shell.

## 🧭 How this folder is organized

This folder starts with the conceptual foundation of how Linux organizes files and permissions, then moves into the practical commands you will type constantly, before working up to more system level topics like process management, networking, and automation. Every note stands on its own with full explanations, though wikilinks connect related ideas throughout.

## 📚 Map of Content

### Foundations
- [[Linux Filesystem Hierarchy]] - how Linux organizes folders and files, and what lives where
- [[Linux File Permissions & Ownership]] - the permission system that controls who can do what to a file

### Everyday commands
- [[Linux Basic Commands & Navigation]] - moving around, creating, copying, and deleting files and folders
- [[Linux File Viewing & Editing]] - reading file contents and editing text directly in the terminal
- [[Linux Text Processing (grep sed awk)]] - searching, transforming, and extracting text from files
- [[Linux Piping & Redirection]] - chaining commands together and controlling where input and output go

### Managing the system
- [[Linux Process Management]] - seeing what is running and controlling it
- [[Linux Package Management]] - installing, updating, and removing software
- [[Linux Users & Groups]] - managing who has access to the system and what they can do
- [[Linux Disk & Storage Management]] - checking space, mounting drives, and managing partitions
- [[Linux Systemd & Services]] - starting, stopping, and managing background services
- [[Linux System Monitoring & Logs]] - keeping an eye on system health and reading log files

### Automation and networking
- [[Linux Shell Scripting]] - writing your own reusable scripts
- [[Linux Environment Variables & Shell Config]] - customizing your shell and understanding PATH
- [[Linux Cron & Task Scheduling]] - running commands automatically on a schedule
- [[Linux Networking]] - checking connectivity, transferring files, and connecting to remote machines
- [[Linux Archiving & Compression]] - bundling and compressing files for storage or transfer

## 🚀 Quick reference: a first taste of the terminal

Before diving into the individual notes, here is a small sequence of commands that touches several ideas covered across this folder, just to see how they fit together in practice.

```bash
# Find out where you currently are in the filesystem
pwd

# List the files in the current folder, with details
ls -la

# Move into a folder called projects
cd projects

# Search for the word "error" inside every .log file here
grep "error" *.log

# Check how much disk space is being used
df -h
```

> [!tip] The terminal rewards muscle memory
> Unlike a graphical interface where you can usually explore visually to find what you need, the command line rewards genuinely memorizing commands and their common flags. It feels slow at first, but the payoff is that the exact same commands work identically whether you are on your own laptop, a cloud server halfway across the world, or a tiny embedded device, which is a level of consistency graphical tools rarely offer.

## 🔗 Related folders in the vault

As this LORE vault grows, this Linux folder will naturally connect to folders covering Git, Docker, cloud infrastructure, and general programming, since Linux forms the practical foundation underneath almost all of that work.
