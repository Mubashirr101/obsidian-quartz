---
title: 📜 Linux Shell Scripting
tags: [linux, bash, shell-scripting, automation]
aliases: [Bash Scripting, Linux Bash Scripts]
status: evergreen
---

# 📜 Linux Shell Scripting

## 🧠 What this note covers

A shell script is simply a text file containing a sequence of commands, saved so they can be run together as a single unit, rather than typed out individually every single time. This note covers writing basic bash scripts, including variables, conditionals, loops, and functions, tying together nearly everything else covered across this Linux folder into fully reusable, automated tools.

## 📄 Writing and running your first script

```bash
#!/bin/bash
echo "Hello, world"
```

Save this into a file named, for example, `hello.sh`, and then make it executable and run it.

```bash
chmod +x hello.sh   # grants execute permission, covered fully in Linux File Permissions & Ownership
./hello.sh              # runs the script (the ./ tells the shell to look in the current directory)
```

> [!note] The shebang line explained
> The very first line, `#!/bin/bash`, is called a "shebang," and it tells the operating system exactly which program should be used to interpret and run the rest of the file, in this case the bash shell specifically. Even though it starts with a `#`, which normally marks a comment in bash, this specific line at the very top of a file is treated specially by the system and is not just an ordinary comment. Leaving it out usually still lets the script run if you explicitly type `bash hello.sh`, but including it is what allows the script to be run directly as `./hello.sh` on its own.

## 📦 Variables

```bash
name="Amit"
age=30

echo "My name is $name and I am $age years old"
```

> [!warning] No spaces allowed around the equals sign
> Unlike most programming languages, bash is strict about this: writing `name = "Amit"` with spaces around the equals sign causes an error, since bash instead interprets it as trying to run a command literally named `name` with arguments. Assignment must be written with absolutely no spaces on either side of the equals sign.

### Reading input from the user

```bash
read -p "Enter your name: " name
echo "Hello, $name"
```

### Command substitution: capturing a command's output into a variable

```bash
current_date=$(date)
echo "Today is $current_date"

file_count=$(ls | wc -l)
echo "There are $file_count files here"
```

> [!tip] Prefer $() over the older backtick syntax
> Command substitution can also be written using backticks, like `` `date` ``, an older syntax you will still see in existing scripts. The modern `$( )` syntax is generally preferred, since it is easier to read, and unlike backticks, it can be cleanly nested inside another command substitution without becoming confusing or ambiguous.

## ❓ Conditionals: if statements

```bash
age=20

if [ "$age" -ge 18 ]; then
    echo "You are an adult"
elif [ "$age" -ge 13 ]; then
    echo "You are a teenager"
else
    echo "You are a child"
fi
```

> [!warning] Quoting your variables inside conditions is a genuinely important habit
> Writing `[ "$age" -ge 18 ]` with quotes around `$age` protects against errors if the variable happens to be empty or contains spaces, since an unquoted empty variable can cause the entire condition to fail with a confusing syntax error instead of behaving as expected. It is a very strong habit to always quote variables inside test conditions like this.

### Common comparison operators inside [ ]

| Operator | Meaning | Used for |
|---|---|---|
| `-eq` | Equal to | Numbers |
| `-ne` | Not equal to | Numbers |
| `-gt` | Greater than | Numbers |
| `-lt` | Less than | Numbers |
| `-ge` | Greater than or equal to | Numbers |
| `-le` | Less than or equal to | Numbers |
| `==` | Equal to | Text (strings) |
| `!=` | Not equal to | Text (strings) |
| `-z` | Is the string empty | Text (strings) |
| `-f` | Does this file exist, and is it a regular file | Files |
| `-d` | Does this directory exist | Files |

> [!note] Numbers and text use genuinely different comparison operators
> This is a common early source of confusion, since bash uses `-eq` for comparing numbers but `==` for comparing text, unlike languages such as Python where a single operator handles both. Using `==` to compare two numbers often still technically works, but using `-eq` on non-numeric text will produce an outright error, so it is worth being deliberate about which type of comparison you actually intend.

## 🔁 Loops

### for loops

```bash
for i in 1 2 3 4 5; do
    echo "Number: $i"
done

for file in *.txt; do
    echo "Found file: $file"
done

for i in $(seq 1 10); do
    echo "Counting: $i"
done
```

### while loops

```bash
count=1
while [ "$count" -le 5 ]; do
    echo "Count is $count"
    count=$((count + 1))
done
```

> [!tip] $(( )) for arithmetic
> Bash uses a distinct syntax, `$(( ))`, specifically for doing arithmetic calculations, since ordinary variables in bash are treated as text by default. Writing `count=$((count + 1))` correctly increments the number, while forgetting the double parentheses would instead just try, and fail, to treat "count + 1" as a literal piece of text.

## 🧩 Functions

```bash
greet() {
    echo "Hello, $1"
}

greet "Amit"   # prints "Hello, Amit"
```

> [!note] Bash function arguments use positional variables, not named parameters
> Inside a bash function, `$1` refers to the first argument passed in, `$2` refers to the second, and so on, rather than named parameters like you would see in a language such as Python or R. `$@` refers to all of the arguments together, and `$#` gives you a count of how many arguments were passed in total, both of which are useful when writing a function that needs to handle a variable, unknown number of inputs.

```bash
sum() {
    local total=0
    for num in "$@"; do
        total=$((total + num))
    done
    echo "$total"
}

result=$(sum 1 2 3 4 5)
echo "Sum is: $result"
```

> [!tip] Use local for variables inside a function
> Without the `local` keyword, a variable created inside a bash function is actually still a global variable by default, and could accidentally overwrite a variable of the same name being used elsewhere in the script. Explicitly marking a variable as `local` keeps it properly scoped to just that function, following the same protective principle covered for R functions in the R vault folder.

## 🧮 A complete practical example

```bash
#!/bin/bash
# A script that backs up a folder, only if it actually exists

source_folder="$1"
backup_name="backup_$(date +%Y%m%d).tar.gz"

if [ ! -d "$source_folder" ]; then
    echo "Error: folder $source_folder does not exist"
    exit 1
fi

tar -czf "$backup_name" "$source_folder"
echo "Backup created: $backup_name"
```

> [!tip] exit codes communicate success or failure to whatever calls your script
> Ending a script with `exit 1` signals to anything that called it, whether that is another script, a scheduled cron job covered in [[Linux Cron & Task Scheduling]], or just you checking manually, that something went wrong. By strong convention across all of Linux, an exit code of `0` means success, and any nonzero value means some kind of failure occurred, a convention worth following consistently in your own scripts as well.

## 🔗 Where to go next

Shell scripting draws together nearly everything covered elsewhere in this folder, from [[Linux Text Processing (grep sed awk)]] to [[Linux Piping & Redirection]]. Continue to [[Linux Environment Variables & Shell Config]] to see how to customize your shell's own behavior and permanently set variables, or to [[Linux Cron & Task Scheduling]] to see how a finished script gets run automatically on a schedule.
