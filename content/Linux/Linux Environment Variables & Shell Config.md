---
title: " Linux Environment Variables & Shell Config"
tags:
  - linux
  - environment-variables
  - bashrc
  - path
  - aliases
aliases:
  - Linux PATH
  - bashrc
  - Environment Variables
status: evergreen
---

#  Linux Environment Variables & Shell Config

## 🧠 What this note covers

An environment variable is a named value that lives in the shell's memory and is available to every program launched from that shell, used constantly for things like locating installed programs, remembering your preferred text editor, or configuring how a specific tool behaves. This note covers reading and setting environment variables, understanding the crucial PATH variable specifically, and permanently customizing your shell through its configuration files.

## 🔍 Viewing environment variables

```bash
env             # prints every environment variable currently set, and its value
echo $HOME         # prints the value of one specific variable, here your home directory
printenv PATH         # another way to print a single specific variable's value
```

> [!note] The dollar sign is how you read a variable's value
> Throughout bash, a bare variable name like `PATH` refers to the variable itself, while a dollar sign in front of it, `$PATH`, means "give me the actual value currently stored inside this variable." This exact same distinction applies to your own custom variables in [[Linux Shell Scripting]] as well.

## 📝 Setting environment variables

```bash
export MY_VARIABLE="hello"      # creates a new environment variable, available to child processes
echo $MY_VARIABLE                  # "hello"
```

> [!warning] A variable set without export only exists in your current shell
> Simply writing `MY_VARIABLE="hello"` without the `export` keyword does create a variable, but it will only be visible within your current shell itself, not to any other program or script you launch from it. Adding `export` specifically makes the variable part of the environment that gets passed down to any child processes you start, which is almost always what you actually want when configuring something meant to affect other tools.

> [!warning] Variables set this way disappear when you close the terminal
> Running `export` directly at your terminal prompt only affects your current session. The moment you close that terminal window or log out, the variable is gone completely. To make a variable available permanently, every single time you open a new terminal, it needs to be added to one of your shell's configuration files, covered further down in this note.

## 🛣️ PATH: the most important environment variable

`PATH` is a special environment variable containing a list of folders that the shell automatically searches through, in order, whenever you type a command name, looking for a matching executable program.

```bash
echo $PATH
# /usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

> [!note] Why PATH is structured as a colon separated list
> Each folder listed in `PATH` is separated by a colon, and when you type a command such as `ls`, the shell checks each of these folders in order, left to right, stopping at the very first one where it finds a matching program named `ls`. This is exactly why typing a command's name alone, like `python3`, works without needing to type its full path every time, as long as it lives inside one of the folders already listed in `PATH`.

### Adding a new folder to your PATH

```bash
export PATH="$HOME/scripts:$PATH"
# adds a personal scripts folder to the FRONT of your existing PATH
```

> [!tip] Why the existing $PATH is deliberately included at the end
> Notice that this example includes `$PATH` again at the very end of the new value being assigned. This is essential, since it preserves every folder that was already part of your PATH, simply adding your new folder on top of that existing list, rather than completely replacing your entire PATH and suddenly making common commands like `ls` or `grep` unable to be found at all.

## 🗂️ Shell configuration files: making settings permanent

Bash reads certain specific files automatically every time a new terminal session starts, and placing your `export` commands, custom variables, and other preferences inside these files is how you make your setup permanent across every future session.

| File | When it typically runs |
|---|---|
| `~/.bashrc` | Runs for every new interactive terminal session you open |
| `~/.bash_profile` or `~/.profile` | Runs specifically for login sessions, such as logging in via SSH |
| `/etc/environment` | A system wide file, affecting every user on the machine |

```bash
# add this line to the end of your ~/.bashrc file
export PATH="$HOME/scripts:$PATH"
export EDITOR="nano"
```

> [!note] Why there are multiple different config files at all
> The distinction between `.bashrc` and `.bash_profile` traces back to older Unix conventions, where a "login" session, such as physically logging into a text based terminal or connecting over SSH, was considered meaningfully different from simply opening a new terminal window within an already logged in graphical desktop session. In modern everyday desktop use, this distinction often barely matters, and many people simply put everything into `.bashrc`, with `.bash_profile` frequently just containing a line that loads `.bashrc` anyway to keep things consistent regardless of session type.

### Applying changes without restarting your terminal

```bash
source ~/.bashrc
# re-runs the file in your CURRENT shell, applying any new changes immediately
```

> [!tip] source is a general purpose way to run a file in your current shell
> `source`, which can also be shortened to a single dot, as in `. ~/.bashrc`, runs the commands inside a file directly within your current shell session, rather than launching a completely separate new shell process to run it in. This is exactly why it can update your current session's variables and settings live, whereas simply running the file as an ordinary script would not affect your current terminal at all.

## 🏷️ Aliases: creating your own shortcuts

An alias lets you define your own custom shorthand for a longer command, another very common thing to place inside `.bashrc` for it to persist permanently.

```bash
alias ll="ls -la"
alias gs="git status"
alias ..="cd .."
```

With these added to your `.bashrc` and reloaded, typing just `ll` runs the full `ls -la` command instead.

> [!tip] Aliases are one of the highest value, lowest effort customizations
> Setting up a handful of aliases for your own most frequently typed, longer commands is one of the simplest ways to meaningfully speed up your daily command line work, and it is worth periodically reviewing your own command history for repeated long commands that would make good candidates for a new alias.

## 🧾 A few genuinely important built in environment variables

| Variable | Meaning |
|---|---|
| `$HOME` | Your home directory's full path |
| `$USER` | Your current username |
| `$PATH` | The list of folders searched for executable commands |
| `$SHELL` | The full path to your current default shell program |
| `$PWD` | Your current working directory, an alternative to running pwd |
| `$?` | The exit code of the MOST RECENTLY run command, extremely useful in scripts |

> [!tip] $? is worth knowing for debugging your own scripts
> Immediately after running any command, checking `echo $?` tells you whether it succeeded or failed, since by the same convention mentioned in [[Linux Shell Scripting]], a value of `0` means success and any nonzero value means some kind of failure occurred. This is a genuinely handy quick debugging trick whenever a command's actual success or failure is not obvious just from reading its regular output.

## 🔗 Where to go next

Environment variable and shell configuration knowledge feeds directly back into writing more robust automation in [[Linux Shell Scripting]], and connects to permanently running programs and scripts covered in [[Linux Cron & Task Scheduling]] and [[Linux Systemd & Services]].
