---
title: Linux File Viewing & Editing
tags:
  - linux
  - terminal
  - vim
  - nano
  - cat
  - less
aliases:
  - Linux Text Editors
  - Vim Basics
  - Nano Basics
status: evergreen
---

#  Linux File Viewing & Editing

## 🧠 What this note covers

Once you know how to navigate the filesystem, the next essential skill is actually reading and editing the contents of files directly from the terminal, without needing a graphical text editor. This note covers the common tools for viewing file contents, the basics of two of the most widely used terminal text editors, nano and vim, and a few related utilities.

## 📄 Viewing an entire file: cat

```bash
cat notes.txt          # prints the entire file's contents directly to the terminal
cat file1.txt file2.txt   # prints both files, one after another, concatenated together (hence the name "cat")
cat -n notes.txt            # prints the file with line numbers added on the left
```

> [!warning] cat is a poor choice for large files
> Because `cat` dumps the entire file content at once with no scrolling control, using it on a large file, such as a multi-thousand-line log file, floods your terminal and scrolls past faster than you can read. For anything longer than a screen's worth of text, `less` is almost always the better choice.

## 📜 Viewing a file page by page: less

```bash
less notes.txt
```

Once inside `less`, you can navigate interactively using these keys:

| Key | Action |
|---|---|
| Space bar | Move forward one full page |
| `b` | Move backward one full page |
| `/searchterm` | Search forward for text matching "searchterm" |
| `n` | Jump to the next match after a search |
| `N` | Jump to the previous match after a search |
| `g` | Jump to the very beginning of the file |
| `G` | Jump to the very end of the file |
| `q` | Quit and return to your normal terminal prompt |

> [!tip] less is also great for command output, not just files
> `less` is frequently piped in alongside other commands whenever their output is too long to read comfortably in one go, such as `ls -la /usr/bin | less`, letting you scroll through a long directory listing at your own pace instead of it all scrolling past at once. This pairs directly with the piping concepts covered in [[Linux Piping & Redirection]].

## 👀 Viewing just the beginning or end: head and tail

```bash
head notes.txt          # shows just the first 10 lines by default
head -n 20 notes.txt       # shows a custom number of lines from the start, here 20
tail notes.txt                # shows just the last 10 lines by default
tail -n 20 notes.txt             # shows a custom number of lines from the end
tail -f app.log                    # "follow" mode, continuously shows new lines as they get appended live
```

> [!tip] tail -f is essential for watching live logs
> The `-f` flag on `tail` is one of the most commonly used tricks for anyone doing server or application work, since it lets you watch a log file update in real time as a program runs, immediately showing new error messages or activity the instant they get written, rather than needing to repeatedly reopen the file to check for new content.

## ✏️ Editing with nano: the beginner friendly editor

Nano is a simple, approachable terminal text editor, and it is a great starting point since it displays its most important keyboard shortcuts directly at the bottom of the screen at all times.

```bash
nano notes.txt   # opens the file for editing, or creates it if it does not already exist
```

Common nano keyboard shortcuts, where the caret symbol `^` represents holding the Control key:

| Shortcut | Action |
|---|---|
| `Ctrl + O` | Save the file (nano calls this "Write Out") |
| `Ctrl + X` | Exit nano |
| `Ctrl + K` | Cut the current line |
| `Ctrl + U` | Paste the previously cut line |
| `Ctrl + W` | Search for text within the file |
| `Ctrl + G` | Open nano's built in help screen |

> [!note] Why nano is a good default starting point
> Nano behaves much closer to a familiar, ordinary text editor than vim does, since you can simply start typing to insert text immediately, with no special "modes" to learn first. For quick edits, especially early on, nano is genuinely the more approachable and forgiving choice, and there is no shame at all in continuing to use it long term.

## ⚡ Editing with vim: the powerful, modal editor

Vim is a far more powerful, and far more famous, terminal text editor, but it works very differently from what most people expect, since it is a "modal" editor. This means the exact same key can do completely different things depending on which mode you are currently in.

```bash
vim notes.txt   # opens the file in vim
```

### The three core modes

- **Normal mode**: the mode vim opens in by default, where keys act as commands for navigating and manipulating text, rather than typing letters directly.
- **Insert mode**: where typing keys actually inserts text into the file, much like an ordinary text editor.
- **Command mode**: where you type instructions starting with a colon `:`, such as saving or quitting.

```
i     # from Normal mode, switches into Insert mode, so you can start typing text
Esc     # from Insert mode, switches back to Normal mode
:w        # from Normal mode, saves ("writes") the file
:q          # from Normal mode, quits vim
:wq           # saves AND quits, in a single combined command
:q!             # quits WITHOUT saving, discarding any changes, forcefully
```

> [!warning] The most famous beginner trap in all of computing
> An enormous number of people have accidentally opened vim, typically without realizing it, and then found themselves completely unable to figure out how to exit. The fix is simple once you know it: press the `Esc` key first to make absolutely certain you are in Normal mode, and then type `:q` followed by Enter to quit, or `:wq` followed by Enter if you want to save your changes first.

### A few essential Normal mode movement and editing commands

```
h  j  k  l   # move left, down, up, right, the traditional vim arrow key alternative
dd             # deletes ("cuts") the entire current line
yy               # "yanks" (copies) the entire current line
p                  # "pastes" whatever was most recently deleted or yanked
u                    # undoes the last change
Ctrl + r               # redoes a change that was just undone
/searchterm              # searches forward for text matching "searchterm," just like in less
```

> [!tip] Why so many people eventually grow to love vim
> Despite its steep initial learning curve, vim's core appeal is that every single action, from deleting a line to jumping to a specific word, can be done without ever lifting your hands off the keyboard's home row to reach for a mouse or arrow keys. For people who edit text constantly, especially over slow or unreliable remote connections where a graphical editor is not even an option, this efficiency compounds enormously over time.

## 📝 A quick word on comparing files: diff

```bash
diff file1.txt file2.txt   # shows the specific lines that differ between two files
diff -u file1.txt file2.txt  # shows the differences in "unified" format, the same style used by Git
```

> [!note] diff underpins version control
> The general approach `diff` uses, showing only the lines that changed rather than displaying two entire files side by side, is exactly the same underlying idea that powers version control systems like Git when showing you what changed in a commit.

## 🔗 Where to go next

With reading and editing files covered, continue to [[Linux Text Processing (grep sed awk)]] to learn far more powerful ways to search and transform text automatically, or move to [[Linux Piping & Redirection]] to learn how to connect these viewing tools together with other commands.
