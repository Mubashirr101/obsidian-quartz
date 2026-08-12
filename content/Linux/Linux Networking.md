---
title: 🌐 Linux Networking
tags: [linux, networking, ssh, curl, wget, ip, ping]
aliases: [Linux SSH, Linux curl, Linux ip command]
status: evergreen
---

# 🌐 Linux Networking

## 🧠 What this note covers

Linux runs a huge share of the world's servers, and being comfortable diagnosing network connectivity, transferring files, and connecting to remote machines over SSH is an essential practical skill. This note covers checking your own network configuration, testing connectivity to other machines, transferring data over HTTP, and securely connecting to and from remote servers.

## 🧭 Checking your own network configuration: ip

The modern tool for viewing and configuring network interfaces on Linux is called `ip`, which has largely replaced an older, now deprecated tool called `ifconfig` that you may still see referenced in older tutorials.

```bash
ip addr show          # shows every network interface and its assigned IP address, often shortened to "ip a"
ip route show            # shows the system's routing table, controlling where outgoing traffic gets sent
ip link show                # shows network interfaces and their basic status, such as up or down
```

> [!note] ifconfig still shows up everywhere in older material
> `ifconfig` was the traditional tool for this exact purpose for decades, and you will still very commonly encounter it in older tutorials, forum posts, and scripts. It has been officially deprecated in favor of `ip`, and may not even be installed by default on some newer distributions, but it is worth recognizing on sight even if `ip` is the modern, recommended tool to actually use going forward.

## 📡 Testing connectivity: ping

```bash
ping google.com          # sends continuous test packets to a target, showing whether it responds and how quickly
ping -c 4 google.com        # sends exactly 4 test packets and then stops automatically, rather than running forever
```

> [!tip] ping is often the very first diagnostic step
> When something network related is not working, `ping` is usually the fastest first check to run, since it immediately tells you whether basic connectivity to a target exists at all. If `ping` fails entirely, the problem is likely fundamental, such as no internet connection or a DNS issue, whereas if `ping` succeeds but a specific application still fails, the problem is more likely with that specific service or a specific port, rather than basic connectivity itself.

## 🔌 Checking open ports and connections: ss

`ss`, short for "socket statistics," shows active network connections and which ports are currently listening for incoming connections, and has largely replaced an older tool called `netstat` in the same way `ip` replaced `ifconfig`.

```bash
ss -tuln    # shows listening TCP and UDP ports, in numeric form, without resolving hostnames
```

> [!note] Breaking down the ss -tuln flags
> `-t` includes TCP connections, `-u` includes UDP connections, `-l` shows only connections that are actively "listening" for new incoming connections rather than every single active connection, and `-n` shows raw numeric addresses and port numbers instead of trying to resolve them into hostnames, which is both faster and often clearer for diagnostic purposes.

## 🌍 Making HTTP requests: curl and wget

Both `curl` and `wget` let you make HTTP requests directly from the command line, useful for downloading files, testing an API, or checking whether a web service is responding.

```bash
curl https://example.com                  # fetches a URL and prints its content directly to the terminal
curl -O https://example.com/file.zip         # downloads a file, saving it with its original filename
curl -I https://example.com                    # fetches only the HTTP HEADERS, not the full body, useful for a quick check
curl -X POST -d "name=amit" https://api.example.com/users   # sends a POST request with data attached

wget https://example.com/file.zip            # downloads a file, wget's more traditional primary purpose
wget -c https://example.com/largefile.zip       # resumes a partially completed download instead of starting over
```

> [!tip] curl versus wget, choosing between them
> Both tools can download files, but they were built with different primary purposes in mind. `curl` is generally the better choice when you need fine grained control over HTTP requests themselves, such as setting custom headers, sending POST data, or working with an API, and its output is designed to be easily used inside scripts and pipelines. `wget` is generally the better choice for straightforward, reliable file downloading, particularly because of its strong built in support for resuming interrupted downloads and recursively downloading entire websites.

## 🔑 SSH: securely connecting to remote machines

SSH, short for "Secure Shell," is the standard way to log into a remote Linux machine over the network and get a full command line session, with all traffic encrypted along the way.

```bash
ssh amit@192.168.1.10           # connects to a remote machine at this address, logging in as the user "amit"
ssh -p 2222 amit@192.168.1.10      # connects using a custom port instead of SSH's default port, 22
```

### SSH key based authentication

While SSH supports logging in with a password, the far more common and secure approach in professional settings uses cryptographic key pairs instead, consisting of a private key that stays only on your own machine, and a public key that gets placed on the server.

```bash
ssh-keygen -t ed25519          # generates a brand new key pair, using the modern, recommended ed25519 algorithm
ssh-copy-id amit@192.168.1.10     # copies your public key to a remote server, enabling passwordless login from then on
```

> [!warning] Never share your private key file, ever
> Your private key, typically stored at a path like `~/.ssh/id_ed25519`, should never be shared, emailed, or committed into a Git repository under any circumstances, since anyone who obtains it can impersonate you and log in anywhere your matching public key has been installed. Only the public key file, typically ending in `.pub`, is meant to be shared and distributed freely.

### Copying files securely over SSH: scp and rsync

```bash
scp local_file.txt amit@192.168.1.10:/home/amit/          # copies a local file TO a remote server
scp amit@192.168.1.10:/home/amit/remote_file.txt .           # copies a file FROM a remote server, to your current folder
scp -r local_folder/ amit@192.168.1.10:/home/amit/             # -r for recursively copying an entire folder

rsync -avz local_folder/ amit@192.168.1.10:/home/amit/backup/    # a more efficient alternative, especially for repeated syncs
```

> [!tip] Why rsync is often preferred over scp for repeated transfers
> `rsync` is specifically designed to intelligently compare the source and destination first, and only actually transfer the parts of files that have genuinely changed since the last sync, rather than re-copying everything from scratch every single time. For repeated backups or keeping two folders in sync over time, this makes `rsync` dramatically faster than repeatedly running `scp` on the same large folder.

## 🧾 A note on the SSH config file

For servers you connect to often, manually typing out a full address, custom port, and username every single time gets tedious quickly. SSH lets you define convenient shortcuts inside a personal configuration file.

```bash
# inside ~/.ssh/config
Host myserver
    HostName 192.168.1.10
    User amit
    Port 2222
```

With this configuration saved, connecting becomes as simple as:

```bash
ssh myserver
```

> [!tip] The SSH config file is worth setting up early
> Setting up this config file properly for any server you connect to regularly saves a genuinely significant amount of repetitive typing over time, and it also serves as a handy, self documenting record of exactly which servers you regularly work with and how to reach each one.

## 🔗 Where to go next

Networking connects naturally to [[Linux Package Management]] for installing networking tools that are not present by default, and to [[Linux Systemd & Services]] for managing network-facing services like web servers running on a machine. For automating repeated networking tasks, such as scheduled backups over rsync, continue to [[Linux Cron & Task Scheduling]].
