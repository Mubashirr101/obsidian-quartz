---
title: Linux Disk & Storage Management
tags:
  - linux
  - disk
  - storage
  - mount
  - partitions
  - df
  - du
aliases:
  - Linux Mounting
  - Linux df du
  - Linux Partitions
status: evergreen
---

#  Linux Disk & Storage Management

## 🧠 What this note covers

Understanding how Linux sees and organizes physical storage, from checking how much space is left to attaching, or "mounting," an entire additional drive into the filesystem, is an essential system administration skill. This note covers checking disk and folder usage, understanding partitions, and the concept of mounting, which connects directly back to the unified filesystem tree explained in [[Linux Filesystem Hierarchy]].

## 📊 Checking overall disk space: df

`df`, short for "disk free," shows how much space is used and available across your mounted filesystems.

```bash
df           # shows disk usage, in raw byte counts, across every mounted filesystem
df -h          # "human readable" sizes, showing GB and MB instead of raw byte counts, almost always preferred
```

Example output, broken down:

```
Filesystem      Size  Used  Avail  Use%  Mounted on
/dev/sda1        50G   30G    18G   63%  /
/dev/sdb1       100G   45G    50G   47%  /home
```

> [!note] Reading the "Mounted on" column
> The final column tells you exactly which folder in the filesystem tree a given physical device is actually attached to. In this example, one entire separate disk, `/dev/sdb1`, is mounted specifically at `/home`, meaning everything stored under `/home` actually physically lives on a completely different underlying drive than the rest of the system, even though it appears as one single, seamless folder structure to you.

## 📁 Checking folder specific usage: du

Where `df` shows overall space across entire drives, `du`, short for "disk usage," shows exactly how much space specific folders and files are actually taking up.

```bash
du -h myfolder/          # shows the size of every file and subfolder inside, recursively, in human readable form
du -sh myfolder/            # "summarize," shows just ONE total size for the whole folder, rather than every subfolder
du -sh *                       # shows the total size of every item in the current folder, one line per item
```

> [!tip] A genuinely useful pattern for finding what is eating your disk space
> Combining `du -sh *` with a sort is one of the most practically useful disk investigation commands to memorize: `du -sh * | sort -rh` lists every item in the current folder sorted from largest to smallest, making it immediately obvious which specific folder or file is responsible for using the most space, rather than needing to check each one individually.

## 🧱 Understanding partitions

A physical disk is typically divided into one or more partitions, each of which can be formatted with its own filesystem and mounted independently. This is why a single physical hard drive can appear in the system as several separate entries, such as `/dev/sda1` and `/dev/sda2`.

```bash
lsblk           # "list block devices," shows every disk and partition, in a clear tree structure
fdisk -l           # shows more detailed partition information, typically requires sudo
```

Example `lsblk` output:

```
NAME   SIZE  TYPE  MOUNTPOINT
sda    120G  disk
├─sda1  50G  part  /
└─sda2  70G  part  /home
```

> [!note] Naming convention for disks and partitions
> Traditional disk device names follow a pattern where `sda` represents the entire first physical disk detected, and `sda1`, `sda2`, and so on represent individual partitions carved out of that disk. A second physical disk would typically appear as `sdb`, a third as `sdc`, and so forth. Newer NVMe solid state drives instead commonly use a naming pattern like `nvme0n1`, with partitions numbered as `nvme0n1p1`.

## 🔗 Mounting and unmounting

Mounting is the process of attaching a filesystem, whether that is a partition, a USB drive, or a network share, to a specific folder within the existing filesystem tree, making its contents accessible at that location.

```bash
sudo mount /dev/sdb1 /mnt/usb_drive       # mounts a device at a specific folder (which must already exist)
sudo umount /mnt/usb_drive                   # unmounts it, safely detaching the device
```

> [!warning] Always unmount before physically removing external storage
> Unmounting a drive before physically disconnecting it, such as pulling out a USB stick, is genuinely important, not just a formality. Linux frequently buffers writes to disk for performance reasons, meaning data you believe has already been saved to the drive may still only exist in memory, waiting to actually be written. Removing the device before unmounting can cause real, permanent data corruption or loss.

### Making a mount permanent: /etc/fstab

A manual `mount` command only lasts until the next reboot. To have a device or partition automatically mounted every single time the system starts, its details need to be added to a system configuration file called `/etc/fstab`, short for "filesystem table."

```bash
cat /etc/fstab
# /dev/sda1  /       ext4  defaults  0  1
# /dev/sda2  /home   ext4  defaults  0  2
```

> [!warning] A mistake in /etc/fstab can prevent your system from booting
> Because `/etc/fstab` is read very early during the boot process to decide which filesystems to mount automatically, an incorrect entry here, such as referencing a device that no longer exists or has been renamed, can genuinely prevent the entire system from booting normally. It is always worth double and triple checking any edit to this specific file before rebooting, and many experienced administrators test a new entry with a manual `mount` command first before trusting it inside `/etc/fstab`.

## 🧮 Checking filesystem types

```bash
lsblk -f          # shows the filesystem type (such as ext4, xfs, or ntfs) alongside each partition
```

> [!note] Common filesystem types you will encounter
> `ext4` is the most common general purpose filesystem on Linux distributions today, valued for its stability and maturity. `xfs` is another common choice, particularly favored on some enterprise distributions for its strong performance with very large files. `ntfs` is the filesystem used by Windows, which Linux can read from and, with proper driver support, also write to, relevant if you are dealing with a dual boot system or an external drive that is also used with Windows machines.

## 🔗 Where to go next

Disk and storage concepts tie directly into the overall structure explained in [[Linux Filesystem Hierarchy]], and into keeping an eye on space usage as part of broader system health, covered in [[Linux System Monitoring & Logs]]. For automating routine disk cleanup or backup tasks, continue to [[Linux Cron & Task Scheduling]].
