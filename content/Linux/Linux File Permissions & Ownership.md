---
title: 🔐 Linux File Permissions & Ownership
tags: [linux, permissions, chmod, chown, security]
aliases: [chmod, chown, Linux Permissions]
status: evergreen
---

# 🔐 Linux File Permissions & Ownership

## 🧠 What this note covers

Linux was designed from the beginning as a multi user system, meaning several different people, or several different automated processes, might all be using the same machine at once. Because of this, every single file and folder carries a set of permissions controlling exactly who is allowed to read it, modify it, or run it. This note covers how to read, understand, and change these permissions, along with the related concept of file ownership.

## 👀 Reading permissions with ls -l

Running `ls -l` shows a detailed listing of files, including a permission string at the very start of each line that looks cryptic at first but is actually a compact, structured code.

```bash
ls -l
# -rwxr-xr-- 1 amit developers 4096 Aug 10 10:00 deploy.sh
```

Breaking down that permission string, `-rwxr-xr--`, piece by piece:

```
-   rwx      r-x      r--
|   |         |         |
|   owner    group    others
|
file type (- means regular file, d means directory, l means symbolic link)
```

Each group of three characters represents read, write, and execute permission, in that fixed order, for a specific category of user: the owner of the file, the group associated with the file, and everyone else on the system, referred to as "others."

| Symbol | Meaning for a file | Meaning for a directory |
|---|---|---|
| `r` | Can view the file's contents | Can list the contents of the directory |
| `w` | Can modify the file's contents | Can create or delete files inside the directory |
| `x` | Can execute the file as a program or script | Can enter the directory (needed to cd into it) |
| `-` | That specific permission is not granted | That specific permission is not granted |

> [!note] Why execute permission matters for directories too
> It surprises a lot of newcomers that the execute permission applies to directories at all, since you cannot "run" a folder the way you run a program. For a directory, execute permission actually controls whether you are allowed to enter it and access the things inside, which is why a directory with read but no execute permission lets you see file names inside it but not actually open or examine any of them.

## 🧮 Permissions as numbers: the octal notation

Beyond the letter based `rwx` notation, permissions are very often written and set using a three digit numeric shorthand, where each digit represents one of the three permission categories, and is calculated by adding up values: read is worth 4, write is worth 2, and execute is worth 1.

| Permission combination | Number |
|---|---|
| `rwx` (read, write, execute) | 4 + 2 + 1 = 7 |
| `rw-` (read, write only) | 4 + 2 = 6 |
| `r-x` (read, execute only) | 4 + 1 = 5 |
| `r--` (read only) | 4 |
| `---` (nothing) | 0 |

So a permission string like `rwxr-xr--` translates directly to the number `754`, read as: the owner gets 7 (full access), the group gets 5 (read and execute), and others get 4 (read only).

> [!tip] A few extremely common permission numbers worth memorizing
> `755` is one of the most common settings, giving the owner full control while everyone else can only read and execute, frequently used for scripts and program files that need to be run by others but not modified. `644` is another extremely common one, giving the owner read and write access while everyone else gets read only, typical for ordinary documents and configuration files that should not be executed at all.

## 🛠️ chmod: changing permissions

`chmod`, short for "change mode," is the command used to modify a file's permissions, and it accepts either the numeric shorthand or a more descriptive symbolic syntax.

```bash
chmod 755 deploy.sh        # numeric style: owner gets full access, others get read and execute
chmod u+x deploy.sh          # symbolic style: adds execute permission for the user (owner) only
chmod g-w shared_file.txt      # symbolic style: removes write permission from the group
chmod o=r public_notice.txt      # symbolic style: sets others' permission to exactly read only
chmod a+r readme.txt                # symbolic style: adds read permission for everyone (all categories)
```

> [!tip] Symbolic mode letters to remember
> The symbolic syntax uses `u` for user (the owner), `g` for group, `o` for others, and `a` for all three categories at once, combined with `+` to add a permission, `-` to remove one, and `=` to set it to exactly that value, clearing anything else. Symbolic mode is often preferred when you only want to tweak one specific permission without needing to recalculate the entire numeric value from scratch.

### Applying changes recursively

```bash
chmod -R 755 project_folder/
# applies the permission change to the folder itself AND everything inside it, all at once
```

> [!warning] Be careful with recursive permission changes
> Using `-R` to recursively apply a single permission setting across an entire folder tree can cause real problems, since files and directories often legitimately need different permissions from one another, for instance directories generally need execute permission to be enterable while plain text files usually should not. Applying one blanket setting everywhere can accidentally make scripts unexecutable or, worse, make sensitive files executable when they should not be.

## 👤 chown and chgrp: changing ownership

Every file has both an owner (a specific user) and an associated group. `chown` changes the owner, and `chgrp` changes the group, though `chown` can actually do both at once.

```bash
chown amit deploy.sh              # changes just the owner to the user "amit"
chgrp developers deploy.sh          # changes just the group to "developers"
chown amit:developers deploy.sh       # changes both the owner AND the group in a single command
chown -R amit:developers project/       # applies the ownership change recursively through a folder
```

> [!warning] Changing ownership usually requires elevated privileges
> Unlike `chmod`, which the file's owner can normally use freely on their own files, `chown` typically requires root or administrator privileges, since it involves handing control of a file over to a different user entirely. You will usually need to prefix the command with `sudo`, covered further in [[Linux Users & Groups]].

## 🎭 Special permission bits

Beyond the standard read, write, and execute permissions, Linux has three additional special bits that control more unusual, specific behaviors.

```bash
chmod u+s program        # sets the SUID bit: the program runs with the FILE OWNER's permissions, not the runner's
chmod g+s shared_folder/   # sets the SGID bit: new files created inside inherit the FOLDER's group automatically
chmod +t shared_folder/     # sets the STICKY bit: only the file's own owner can delete it, even in a shared folder
```

> [!note] A practical example of the sticky bit
> The sticky bit is exactly why the shared, world writable `/tmp` directory does not turn into chaos, despite every single user on the system being able to create files there. Because `/tmp` has the sticky bit set, users can freely create their own files inside it, but they cannot delete or rename files that belong to somebody else, even though the folder itself is writable by everyone.

## 🎯 umask: setting default permissions

Whenever a brand new file or folder is created, Linux applies a default set of permissions, which is controlled by a setting called the umask. The umask works by subtracting permissions from a theoretical maximum, rather than adding permissions on directly.

```bash
umask         # shows the current umask value, commonly 022 by default
umask 027       # sets a new, typically stricter, umask value
```

> [!tip] Why umask feels backward at first
> A umask of `022` might look like it is granting permission `022` when you first glance at it, but it is actually doing the opposite, it is subtracting those bits from the maximum default (usually 666 for files and 777 for directories). A umask of `022` on a new file typically results in permissions of `644`, since the `022` gets subtracted away from group and others' write permission. This subtractive logic is genuinely one of the more confusing corners of Linux permissions, so it is worth just remembering the common defaults rather than mentally recalculating the subtraction every time.

## 🔗 Where to go next

Permissions become far more meaningful once you understand who the actual users and groups on a system are, covered in [[Linux Users & Groups]]. From here, continue to [[Linux Basic Commands & Navigation]] to start applying these ideas hands on while creating and managing real files.
