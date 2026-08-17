---
title: Linux Basic Commands & Navigation
tags:
  - linux
  - terminal
  - commands
  - navigation
aliases:
  - Linux Terminal Basics
  - Linux CLI
status: evergreen
---

#  Linux Basic Commands & Navigation

## 🧠 What this note covers

This note walks through the everyday commands you will type constantly while working in a Linux terminal: moving between folders, listing their contents, and creating, copying, moving, and deleting files. These commands form the true muscle memory foundation of working comfortably on the command line, building directly on the structure explained in [[Linux Filesystem Hierarchy]].

## 📍 Finding out where you are: pwd

```bash
pwd   # "print working directory," shows the full absolute path of your current location
```

## 👀 Listing contents: ls

```bash
ls          # lists files and folders in the current directory
ls -l        # "long" format, shows permissions, owner, size, and modification date
ls -a         # shows ALL files, including hidden ones (names starting with a dot)
ls -la          # combines both flags together, extremely commonly typed as one habit
ls -lh            # "human readable" file sizes, showing KB, MB, GB instead of raw byte counts
ls -lt              # sorts by modification time, most recently changed first
ls /home/amit         # lists the contents of a specific folder, instead of the current one
```

> [!tip] Combining single letter flags
> Most Linux commands let you combine several single letter flags together behind one dash, so `ls -l -a -h` and `ls -lah` do exactly the same thing. This shorthand is used constantly in real world scripts and tutorials, so it is worth getting comfortable reading combined flags at a glance.

> [!note] What counts as a hidden file
> In Linux, a file or folder is considered "hidden" simply by having its name start with a dot, such as `.bashrc` or `.gitignore`. There is no separate hidden attribute like on Windows, it is purely a naming convention that `ls` respects by default, hiding such files unless you explicitly ask for them with `-a`.

## 🚶 Moving around: cd

```bash
cd projects        # moves into a folder named "projects," relative to where you are now
cd /var/log           # moves to an absolute path, regardless of where you started
cd ..                   # moves up one level, to the parent directory
cd ~                      # jumps straight to your home directory
cd -                        # jumps back to whichever directory you were in immediately before this one
cd                            # typing cd with nothing after it also takes you home, same as cd ~
```

> [!tip] cd - is a genuinely handy shortcut
> Typing `cd -` toggles you back to your previous location, which is extremely useful when you are bouncing back and forth between two folders repeatedly, such as a project folder and a logs folder, without needing to type the full path each time.

## 📁 Creating folders: mkdir

```bash
mkdir new_folder                  # creates a single new folder
mkdir -p projects/site/assets       # creates nested folders all at once, including any missing parent folders
```

> [!warning] Without -p, nested folder creation fails
> Running `mkdir projects/site/assets` without the `-p` flag will fail with an error if the `projects` folder does not already exist, since by default `mkdir` refuses to guess and create missing parent folders on its own. Adding `-p` tells it explicitly to create the entire chain of folders as needed.

## 📄 Creating empty files: touch

```bash
touch notes.txt   # creates a new, empty file, or if it already exists, just updates its modification timestamp
```

> [!note] touch is often used for more than just creating files
> Beyond creating brand new empty files, `touch` is also frequently used purely to update an existing file's "last modified" timestamp to the current moment, without changing its actual contents at all, which is occasionally useful in build scripts that decide whether to rebuild something based on file modification times.

## 📋 Copying: cp

```bash
cp file.txt backup.txt              # copies a single file, creating a new file named backup.txt
cp file.txt /home/amit/                # copies a file into a different folder, keeping its original name
cp -r project/ project_backup/           # "recursive" copy, required for copying an entire folder and its contents
```

> [!warning] cp silently overwrites by default
> By default, `cp` will silently overwrite a destination file if one already exists with the same name, without asking for confirmation first. Adding the `-i` flag, for "interactive," makes it explicitly ask before overwriting anything, which is a genuinely good habit for anyone still building confidence with the command line.

## 🚚 Moving and renaming: mv

```bash
mv file.txt new_location/       # moves a file into a different folder
mv oldname.txt newname.txt        # renames a file, since renaming is really just "moving" it to a new name in place
mv -i file.txt destination/         # asks for confirmation before overwriting anything at the destination
```

> [!note] Linux has no separate "rename" command
> Unlike some systems that offer a dedicated rename command, Linux treats renaming as conceptually identical to moving, since both operations are really just updating where a filename points. This is why `mv` is used for both purposes interchangeably.

## 🗑️ Deleting: rm and rmdir

```bash
rm file.txt              # deletes a single file
rm -r old_folder/           # "recursive" delete, required for deleting a folder and everything inside it
rm -rf old_folder/            # recursive AND "forced," skips any confirmation prompts entirely
rmdir empty_folder/             # deletes a folder, but ONLY if it is completely empty
```

> [!warning] rm -rf is one of the most dangerous commands in Linux
> There is no trash can or recycle bin involved when you run `rm` in a terminal, deletion is immediate and permanent. The combination `rm -rf`, especially when run as the root user or with a mistyped path such as an accidental extra space in `rm -rf / home/amit/old`, has permanently destroyed entire systems for real people. Always double check the exact path before pressing enter on any `rm -rf` command, and consider typing `ls` on that same path first to confirm exactly what you are about to delete.

## 🔎 Finding files: find and locate

```bash
find /home/amit -name "*.txt"         # searches recursively for files matching a name pattern
find . -type d -name "assets"           # searches only for DIRECTORIES named "assets," starting from here
find . -type f -size +10M                 # finds files larger than 10 megabytes
find . -mtime -7                            # finds files modified within the last 7 days

locate myfile.txt   # a much faster alternative, but relies on a periodically updated background index
```

> [!tip] find versus locate
> `find` searches the live filesystem in real time, so its results are always perfectly up to date, but it can be noticeably slower on a large filesystem since it has to actually walk through every folder. `locate` instead searches a pre-built index that is normally only updated once a day, making it dramatically faster, but its results can be stale if a file was created or deleted very recently and the index has not refreshed yet.

## 🔍 Finding commands themselves: which and man

```bash
which python3   # shows the full path to the actual program that would run when you type this command
man ls            # opens the full manual page for the ls command, with detailed explanations of every flag
ls --help           # shows a quicker, shorter summary of a command's available flags, without the full manual
```

> [!tip] man pages are worth genuinely learning to navigate
> Manual pages, opened with `man`, can feel intimidating at first, but they are the single most authoritative and complete source of information for any command, always installed locally and always accurate for the exact version of the tool on your machine. Inside a man page, press the space bar to scroll down a full page, and press `q` to quit back to your terminal.

## 🔗 Where to go next

With basic file operations covered, continue to [[Linux File Viewing & Editing]] to actually look inside and modify file contents, or move to [[Linux Text Processing (grep sed awk)]] to start searching and transforming text at a much more powerful level.
