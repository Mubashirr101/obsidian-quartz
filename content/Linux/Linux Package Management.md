---
title: " Linux Package Management"
tags:
  - linux
  - apt
  - dnf
  - pacman
  - snap
  - package-manager
aliases:
  - apt
  - dnf
  - yum
  - pacman
  - apt-get
status: evergreen
---

#  Linux Package Management

## 🧠 What this note covers

A package manager is the tool a Linux distribution provides for installing, updating, and removing software in a consistent, reliable way, automatically handling dependencies, which are other pieces of software a given program needs in order to work. This note covers the major package managers you will encounter across different distributions, since, unlike most commands covered elsewhere in this folder, package management genuinely differs quite a bit depending on which distribution you are using.

## 🤔 Why package managers matter so much

Before package managers became standard, installing software on Linux often meant manually downloading source code, compiling it yourself, and hoping you had already separately installed every single other library it happened to depend on. A package manager solves this entirely, maintaining a curated repository of pre-built software, tracking exactly which packages depend on which others, and letting you install, update, or cleanly remove anything with a single short command.

> [!note] Different distributions, different package managers
> Unlike core commands such as `ls` or `grep`, which behave identically across virtually every Linux distribution, the package manager you use depends entirely on which distribution family you are running. This is one of the more noticeable ways that Linux distributions genuinely diverge from one another in daily use, and it is worth knowing your own distribution's family so you reach for the right tool.

## 🟠 APT: Debian, Ubuntu, and their derivatives

APT, short for "Advanced Package Tool," is used by Debian, Ubuntu, Linux Mint, and many other related distributions.

```bash
sudo apt update                  # refreshes the local list of available packages and their latest versions
sudo apt upgrade                   # actually installs the newer versions of any already installed packages
sudo apt install htop                # installs a new package, here "htop"
sudo apt remove htop                   # removes a package, but leaves its configuration files behind
sudo apt purge htop                      # removes a package AND its configuration files entirely
sudo apt autoremove                        # cleans up leftover dependency packages no longer needed by anything
apt search "text editor"                     # searches for packages matching a description or name
apt show htop                                  # shows detailed information about a specific package
```

> [!warning] apt update does not install anything by itself
> A very common point of confusion is thinking `sudo apt update` actually upgrades your installed software. It does not. It only refreshes APT's local knowledge of what versions are currently available in the repositories. You still need to run `sudo apt upgrade` afterward to actually install those newer versions. The two commands are almost always run back to back, but they do genuinely different things.

## 🔴 DNF and YUM: Fedora, RHEL, and CentOS

DNF, and its older predecessor YUM, are used on Fedora, Red Hat Enterprise Linux (often shortened to RHEL), CentOS, and Rocky Linux.

```bash
sudo dnf check-update      # checks for available updates, roughly equivalent to apt update
sudo dnf upgrade             # installs available updates, roughly equivalent to apt upgrade
sudo dnf install htop           # installs a package
sudo dnf remove htop               # removes a package
dnf search "text editor"             # searches for packages
dnf info htop                          # shows detailed information about a package
```

> [!note] YUM still shows up in older systems and documentation
> DNF is the modern successor to YUM, and on most current Fedora based systems, `yum` is actually just an alias that quietly redirects to `dnf` behind the scenes for backward compatibility. You will still frequently see `yum` referenced in older tutorials, documentation, and scripts, and it is worth recognizing it as functioning essentially the same way.

## 🔵 Pacman: Arch Linux and its derivatives

Pacman is used by Arch Linux, Manjaro, and other Arch based distributions, and is known for its notably terse, compact flag style compared to APT or DNF.

```bash
sudo pacman -Syu            # synchronizes package lists AND upgrades everything, all in a single command
sudo pacman -S htop            # installs a package (the -S stands for "sync")
sudo pacman -R htop               # removes a package
sudo pacman -Rs htop                 # removes a package AND its no longer needed dependencies
pacman -Ss "text editor"               # searches for packages
pacman -Qi htop                          # shows detailed information about an already installed package
```

> [!tip] Remembering pacman's flag style
> Pacman's flags are all a single capital letter representing an operation, such as `-S` for sync/install and `-R` for remove, which can then be combined with additional lowercase modifier letters, such as adding `s` for "including dependencies." This is a genuinely different style from APT and DNF's more descriptive, spelled out subcommands, and takes a little getting used to if you are switching between distribution families.

## 📱 Universal package formats: Snap and Flatpak

Beyond each distribution's own native package manager, two newer, more universal formats have become popular specifically because they work identically across many different distributions at once, bundling all of a program's dependencies together inside the package itself.

```bash
sudo snap install spotify        # installs a Snap package, works the same way regardless of your underlying distro
sudo snap list                     # lists installed Snap packages
sudo snap remove spotify             # removes a Snap package

flatpak install flathub org.gimp.GIMP   # installs a Flatpak package from the Flathub repository
flatpak list                              # lists installed Flatpak packages
```

> [!note] Why these universal formats exist at all
> Snap, developed by Canonical (the company behind Ubuntu), and Flatpak, developed independently, both solve the same fundamental problem: a native package built specifically for Ubuntu will not necessarily install cleanly on Fedora, since their dependency versions and file layouts can differ. By bundling every dependency directly inside the package itself, Snap and Flatpak packages can run consistently across many different distributions without needing separate native versions built for each one. The tradeoff is generally a larger download size and slightly slower startup time compared to a natively packaged equivalent.

## 🧮 A quick comparison table

| Distribution family | Package manager | Install command | Remove command |
|---|---|---|---|
| Debian, Ubuntu, Mint | APT | `sudo apt install <name>` | `sudo apt remove <name>` |
| Fedora, RHEL, CentOS, Rocky | DNF (or older YUM) | `sudo dnf install <name>` | `sudo dnf remove <name>` |
| Arch, Manjaro | Pacman | `sudo pacman -S <name>` | `sudo pacman -R <name>` |
| Any (universal) | Snap | `sudo snap install <name>` | `sudo snap remove <name>` |
| Any (universal) | Flatpak | `flatpak install <name>` | `flatpak uninstall <name>` |

> [!tip] Knowing your distribution family instantly tells you your package manager
> A genuinely useful habit is to simply remember which broad family your distribution belongs to, since that single fact instantly tells you which package manager syntax applies to almost every software installation task you will ever need to perform on that machine.

## 🔗 Where to go next

Package management is often one of the very first things you configure on a fresh system, alongside setting up user accounts, covered in [[Linux Users & Groups]]. From here, [[Linux Systemd & Services]] covers how many installed packages, particularly server software, get started and managed as ongoing background services after installation.
