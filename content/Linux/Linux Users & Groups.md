---
title: 👥 Linux Users & Groups
tags: [linux, users, groups, sudo, root, permissions]
aliases: [Linux sudo, useradd, Linux root user]
status: evergreen
---

# 👥 Linux Users & Groups

## 🧠 What this note covers

Linux was built as a multi user operating system from the very start, meaning every single file, folder, and process on the system is associated with a specific user account, and this identity is exactly what the permission system covered in [[Linux File Permissions & Ownership]] relies on to decide who can do what. This note covers how users and groups work, how the special root account differs from ordinary accounts, and how to safely gain elevated privileges using sudo when you genuinely need to.

## 👤 What is a user account

Every person, and often every automated service, that interacts with a Linux system does so through a user account, each with its own unique numeric user ID, commonly abbreviated as UID.

```bash
whoami        # prints your currently logged in username
id               # shows your UID, your primary group, and every group you belong to, all at once
```

> [!note] The root user is special
> Every Linux system has one particularly powerful account called root, always assigned UID 0, which is exempt from the normal permission checks that apply to everyone else. Root can read, write, or delete literally any file on the system, and can perform any administrative action, completely bypassing the ownership and permission rules covered in [[Linux File Permissions & Ownership]]. This power is exactly why working directly as root, all the time, for every single task, is considered poor and genuinely risky practice.

## 🔐 sudo: temporarily borrowing root's power

Rather than logging in directly as root for everyday work, the standard, safer approach on modern Linux systems is to log in as your own ordinary user account, and use the `sudo` command to run just a single specific command with elevated, root level privileges, only when actually needed.

```bash
sudo apt update            # runs this one specific command with root privileges, then returns to normal
sudo -i                       # opens an actual interactive root shell, staying elevated until you exit it
sudo -u amit whoami             # runs a command as a DIFFERENT specific user, not necessarily root
```

> [!tip] Why sudo is considered safer than logging in directly as root
> Using `sudo` for individual commands, rather than staying logged in as root the entire time, means you are only ever exposed to root's full destructive power for the brief moment a specific command actually needs it, dramatically reducing the chance of an accidental, catastrophic mistake, like an errant `rm -rf` command run in the wrong folder. Additionally, `sudo` usage is typically logged, creating a clear record of exactly which administrative commands were run and by whom, which plain root logins do not provide nearly as clearly.

> [!warning] Not every user can use sudo by default
> A regular new user account cannot use `sudo` at all unless it has specifically been granted permission to, usually by being added to a particular administrative group, most commonly named `sudo` on Debian and Ubuntu based systems, or `wheel` on Fedora and Red Hat based systems.

## ➕ Creating and managing user accounts

Creating and managing other user accounts requires root privileges yourself, since it is a genuinely administrative task.

```bash
sudo useradd -m sara       # creates a new user named "sara," with the -m flag also creating her home folder
sudo passwd sara              # sets or changes the password for the user "sara"
sudo usermod -aG developers sara   # adds "sara" to an additional group called "developers"
sudo userdel sara                    # deletes the user account "sara" (add -r to also delete her home folder)
```

> [!warning] usermod -aG versus usermod -G, a genuinely important difference
> The `-a` flag stands for "append," and is essential when adding a user to an additional group. Leaving it out and running just `usermod -G developers sara` does not add "sara" to the developers group, it instead completely replaces her entire group membership list with only that one group, silently removing her from every other group she previously belonged to. Forgetting the `-a` flag here is a genuinely common and sometimes confusing mistake.

## 🧑‍🤝‍🧑 Groups: organizing users together

A group is simply a named collection of users, used to grant a whole set of people the same permissions at once, rather than configuring access individually for each person.

```bash
groups sara            # lists every group that "sara" belongs to
sudo groupadd designers   # creates a brand new group named "designers"
sudo groupdel designers     # deletes a group
cat /etc/group                # shows every group defined on the system, and which users belong to each one
```

> [!note] Primary group versus supplementary groups
> Every user has exactly one "primary" group, normally used as the default group assigned to any new file that user creates, and can additionally belong to any number of "supplementary" groups on top of that, which grant additional access without changing what group new files default to. This distinction is why `usermod -aG` specifically appends to the supplementary group list, rather than touching the primary group at all.

## 🗂️ Where user account information actually lives

User and group information is stored in a handful of plain, readable configuration files, which is worth knowing since it explains exactly where commands like `useradd` are actually writing their changes to.

```bash
cat /etc/passwd    # lists every user account, along with their UID, home directory, and default shell
cat /etc/group       # lists every group and its members
cat /etc/shadow        # stores encrypted password information, readable only by root, for security reasons
```

> [!warning] /etc/passwd does not actually store passwords, despite the name
> Despite its name, `/etc/passwd` has not actually stored real password information for a very long time, precisely because that file is readable by every user on the system, which would obviously be a serious security problem. Genuine encrypted password data lives instead in `/etc/shadow`, which is deliberately locked down so that only root can read it at all.

## 🧮 Understanding a line from /etc/passwd

```
amit:x:1001:1001:Amit Shaikh:/home/amit:/bin/bash
```

This single line breaks down into seven colon separated fields:

| Field | Value | Meaning |
|---|---|---|
| 1 | `amit` | The username |
| 2 | `x` | A placeholder, indicating the real password is stored in `/etc/shadow` instead |
| 3 | `1001` | The user's UID (user ID) |
| 4 | `1001` | The user's primary GID (group ID) |
| 5 | `Amit Shaikh` | A description field, often the user's full name |
| 6 | `/home/amit` | The user's home directory |
| 7 | `/bin/bash` | The user's default shell, the program that runs when they log in |

## 🔗 Where to go next

User and group concepts tie directly back into [[Linux File Permissions & Ownership]], since ownership is the mechanism that actually applies these identities to files. Continue to [[Linux Package Management]] to see sudo used in a genuinely everyday, practical context, or explore [[Linux Systemd & Services]] to see how services are frequently run under their own dedicated, restricted service accounts rather than as root.
