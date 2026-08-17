---
title: Linux Filesystem Hierarchy
tags:
  - linux
  - filesystem
  - fhs
  - directory-structure
aliases:
  - FHS
  - Linux Directory Structure
status: evergreen
---

#  Linux Filesystem Hierarchy

## 🧠 What this note covers

Every Linux system organizes its files according to a shared set of conventions called the Filesystem Hierarchy Standard, usually shortened to FHS. Understanding this layout is one of the first things worth learning well, because it tells you where to look for configuration files, where programs actually live, and where your own data belongs, rather than guessing or scattering files randomly.

## 🌳 The single root: everything starts at /

Unlike Windows, which uses separate drive letters like C: and D: for different storage devices, Linux presents everything as one single unified tree, starting from a single root directory written as just a forward slash, `/`. Even a completely separate hard drive or a USB stick gets attached, or "mounted," somewhere inside this same tree, rather than appearing as its own separate root.

```bash
ls /
# bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
```

> [!note] Why this unified structure matters
> Because every piece of storage eventually lives somewhere inside this one tree, a script or program can reference a file using a single consistent path, without needing to know or care whether that file actually lives on your main drive, a second internal drive, or a mounted network share. The complexity of multiple physical devices is hidden behind one simple, unified structure.

## 📁 Key top level directories explained

| Directory | What lives here |
|---|---|
| `/bin` | Essential command binaries needed for basic system use, like `ls` and `cp` |
| `/boot` | Files needed to boot the system, including the kernel itself |
| `/dev` | Device files, representing hardware like disks and terminals as if they were files |
| `/etc` | System wide configuration files, almost always plain text |
| `/home` | Personal folders for each regular user, such as `/home/yourname` |
| `/lib` | Shared library files needed by the programs in `/bin` and `/sbin` |
| `/media` | Mount points for removable media, like USB drives, often created automatically |
| `/mnt` | A conventional, temporary mount point for manually mounting a filesystem |
| `/opt` | Optional, self contained third party software packages |
| `/proc` | A virtual filesystem exposing live information about running processes and the kernel |
| `/root` | The home folder specifically for the root (administrator) user, separate from `/home` |
| `/run` | Runtime data needed since the last boot, such as process ID files |
| `/sbin` | System binaries, generally administrative commands meant for the root user |
| `/srv` | Data for services hosted on this system, such as files served by a web server |
| `/sys` | Another virtual filesystem, exposing kernel and hardware information |
| `/tmp` | Temporary files, which are typically cleared out automatically on reboot |
| `/usr` | The bulk of installed user programs, libraries, and documentation |
| `/var` | Variable data that changes often, such as logs, caches, and mail spools |

> [!warning] /root versus /home, easy to mix up
> The root user's home folder is `/root`, a top level folder of its own, while every regular user's home folder lives inside `/home`, such as `/home/yourname`. These are two genuinely different locations, and confusing them, especially when writing scripts meant to run as different users, is a common source of "file not found" mistakes.

## 🏠 The home directory and the tilde shortcut

Your own personal home directory is where you will spend most of your time, and the shell offers a shortcut symbol, the tilde `~`, to refer to it without typing the full path.

```bash
cd ~          # jumps straight to your home directory, e.g. /home/yourname
cd ~/projects   # jumps to a projects folder inside your home directory
echo $HOME      # prints the full path to your home directory
```

## 🧭 Absolute paths versus relative paths

An absolute path always starts from the root `/` and fully describes a location no matter where you currently are. A relative path instead describes a location starting from wherever you currently happen to be standing in the filesystem.

```bash
cd /home/yourname/projects/website   # an absolute path, works no matter your current location
cd projects/website                    # a relative path, only works if you start from your home directory
cd ../                                   # a relative path meaning "go up one level" from wherever you are
cd ../../                                 # go up two levels
cd .                                        # a single dot means "the current directory," rarely used alone
```

> [!tip] Reading .. and . at a glance
> A single dot `.` always refers to your current directory, and is mostly useful when you need to explicitly reference "here," such as `./myscript.sh` to run a script in the current folder. Two dots `..` always refer to one level up, the parent directory, and can be chained together, such as `../../` to move up two levels at once.

## 🔗 Symbolic links and hard links

A link is a way to have one file accessible from multiple locations, or under multiple names, without actually duplicating the underlying data. Linux supports two different kinds.

```bash
ln -s /path/to/original.txt shortcut.txt   # creates a SYMBOLIC (soft) link
ln /path/to/original.txt hardlink.txt        # creates a HARD link
```

> [!note] Symbolic links versus hard links
> A symbolic link, often just called a "symlink," is essentially a small pointer file containing the path to the original file. If the original file gets deleted or moved, the symlink breaks and points nowhere. A hard link, by contrast, points directly at the same underlying data on disk as the original, meaning the file only truly disappears once every single hard link pointing to it has been removed. Symbolic links are far more common in everyday use, since they can point across different filesystems and clearly show where they lead, while hard links are more limited and largely used for specialized backup or deduplication purposes.

## 🧾 The /proc and /sys virtual filesystems

`/proc` and `/sys` deserve a special mention, since they are not real files stored on disk at all. Instead, they are generated live by the kernel itself, giving you a way to inspect and sometimes even control running processes and hardware simply by reading and writing what look like ordinary text files.

```bash
cat /proc/cpuinfo    # shows live details about your CPU
cat /proc/meminfo      # shows live details about memory usage
ls /proc/1234            # shows information about the specific process with ID 1234
```

> [!tip] /proc is a genuinely useful debugging tool
> Because `/proc` exposes live kernel information as plain readable text, it becomes a surprisingly powerful, dependency free way to inspect system state directly, without needing any special monitoring software installed. Many system monitoring tools covered in [[Linux System Monitoring & Logs]] are actually just reading from `/proc` behind the scenes themselves.

## 🔗 Where to go next

With the overall map of the filesystem in mind, continue to [[Linux File Permissions & Ownership]] to understand who is allowed to read, write, or run each of these files, or move to [[Linux Basic Commands & Navigation]] to start practically moving around and manipulating this structure.
