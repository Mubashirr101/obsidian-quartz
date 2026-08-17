---
title: " Linux Archiving & Compression"
tags:
  - linux
  - tar
  - gzip
  - zip
  - compression
  - archiving
aliases:
  - tar command
  - gzip
  - Linux zip
status: evergreen
---

# Linux Archiving & Compression

## 🧠 What this note covers

Archiving and compression are two genuinely different, though frequently combined, tasks. Archiving bundles many separate files and folders together into a single file, while compression shrinks the size of data. This note covers `tar`, Linux's traditional and most widely used archiving tool, along with `gzip` and `zip`, the two most common compression formats you will encounter.

## 📦 tar: bundling files together

`tar`, short for "tape archive," a name inherited from its original use with magnetic tape backup systems decades ago, combines multiple files and folders into a single archive file, traditionally given a `.tar` extension.

```bash
tar -cvf archive.tar my_folder/     # creates a new archive from a folder
tar -xvf archive.tar                  # extracts the contents of an archive
tar -tvf archive.tar                    # lists the contents of an archive, WITHOUT actually extracting anything
```

Breaking down the core flags used constantly with tar:

| Flag | Meaning |
|---|---|
| `-c` | Create a new archive |
| `-x` | Extract files from an existing archive |
| `-t` | List (test) the contents of an archive, without extracting |
| `-v` | "Verbose," prints each filename as it is processed, useful for watching progress |
| `-f` | Specifies the archive filename, must generally be the LAST flag, directly followed by the filename |

> [!tip] A simple way to remember the core flags
> A genuinely helpful memory trick is the phrase "create, extract, test," matching directly onto `-c`, `-x`, and `-t`, which are the three main things you will ever want to do with an existing or new archive. The `-v` and `-f` flags then just tag along to make the operation verbose and to specify the actual filename.

## 🗜️ Combining tar with compression: gzip

A plain `.tar` file is just a bundle of files stuck together, it is not actually compressed at all. `tar` can be combined directly with a compression method, most commonly gzip, to also shrink the resulting file's size, typically resulting in a file with the extension `.tar.gz`, often informally called a "tarball."

```bash
tar -czvf archive.tar.gz my_folder/     # creates AND compresses in one step (the added z means "gzip compression")
tar -xzvf archive.tar.gz                  # extracts a gzip compressed archive (again, the z tells tar to decompress first)
```

> [!note] Why the z flag matters so much
> The single added `-z` flag is what actually tells `tar` to pass the data through gzip compression on the way in or out. Forgetting it when extracting a `.tar.gz` file will typically cause an error, since `tar` will try to read the still-compressed binary data as if it were an ordinary, uncompressed archive, and fail to make sense of it.

### Other common compression flags for tar

```bash
tar -cjvf archive.tar.bz2 my_folder/    # -j uses bzip2 compression instead, often smaller but noticeably slower
tar -cJvf archive.tar.xz my_folder/       # -J uses xz compression, frequently the best compression ratio of the three
```

> [!tip] Choosing between gzip, bzip2, and xz
> As a general rule of thumb, gzip (`-z`) is the fastest to compress and decompress but produces the largest resulting file among the three. bzip2 (`-j`) usually compresses noticeably smaller but takes meaningfully longer to run. xz (`-J`) typically achieves the smallest file size of all three, at the cost of being the slowest to compress, though decompression speed remains reasonably fast. For most everyday, general purpose use, gzip's balance of speed and reasonable compression remains the most common default choice.

## 📇 Working directly with gzip on a single file

```bash
gzip myfile.txt      # compresses myfile.txt into myfile.txt.gz, and DELETES the original file by default
gunzip myfile.txt.gz    # decompresses it back, restoring the original file and removing the .gz version
gzip -k myfile.txt         # the -k flag "keeps" the original file, rather than replacing it, and creates the compressed copy alongside it
```

> [!warning] gzip replaces the original file by default
> A common surprise for people trying gzip on a single file for the first time is that it does not create a compressed copy alongside the original by default, it actually compresses the file in place and removes the uncompressed original entirely. If you want to keep both, remember to add the `-k` flag explicitly.

## 🤐 zip and unzip: cross platform compatibility

While `tar` combined with gzip is the traditional and most common approach specifically within the Linux and Unix world, the `.zip` format is far more universally recognized and easily opened across Windows, macOS, and Linux alike, without needing any extra software.

```bash
zip archive.zip file1.txt file2.txt      # creates a zip archive from specific files
zip -r archive.zip my_folder/              # -r for recursively zipping an entire folder and its contents
unzip archive.zip                            # extracts a zip archive into the current directory
unzip -l archive.zip                           # lists the contents of a zip archive, without extracting anything
```

> [!tip] When to choose zip over tar.gz
> If you know the resulting archive will need to be opened by someone using Windows or macOS, particularly someone less comfortable with the command line who will likely just double click the file, `.zip` is generally the friendlier, safer choice, since virtually every operating system can open it natively with no additional software required. For purely Linux to Linux transfers, especially involving preserving Linux specific file permissions and ownership information, `tar.gz` remains the more traditional and often more faithful choice.

## 🧮 A quick comparison table

| Format | Typical extension | Compression | Best for |
|---|---|---|---|
| tar (uncompressed) | `.tar` | None | Simple bundling, no size reduction needed |
| tar + gzip | `.tar.gz` or `.tgz` | Fast, moderate | The most common general purpose Linux archive format |
| tar + bzip2 | `.tar.bz2` | Slower, better | When size matters more than speed |
| tar + xz | `.tar.xz` | Slowest, best | When maximum compression matters most |
| zip | `.zip` | Moderate | Cross platform sharing, especially with Windows or macOS users |

## 🔗 Where to go next

Archiving and compression are frequently used together with [[Linux Networking]] for transferring backups to a remote server, and with [[Linux Cron & Task Scheduling]] for automating regular backup routines entirely on their own. Revisit [[Linux Disk & Storage Management]] to check how much space a set of archives is actually taking up once created.
