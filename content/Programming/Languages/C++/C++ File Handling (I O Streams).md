---
title: C++ File Handling (I O Streams)
tags: [cpp, programming, file-io, fstream, streams]
aliases: [C++ fstream, C++ File I O]
status: evergreen
---

# C++ File Handling (I O Streams)

## 🧠 What this note covers

C++ handles input and output, including reading and writing files, through a family of "stream" objects, sharing a genuinely common, consistent design with the `std::cin` and `std::cout` streams already introduced in [[C++ Basics & Syntax]]. This note covers reading from and writing to files, and a few genuinely important practices around properly checking for errors along the way.

## 📝 Writing to a file with ofstream

`std::ofstream`, short for "output file stream," is used specifically for writing text data out to a file.

```cpp
#include <fstream>

int main() {
    std::ofstream outFile("notes.txt");

    if (outFile.is_open()) {
        outFile << "Hello, file" << std::endl;
        outFile << "This is a second line" << std::endl;
        outFile.close();
    } else {
        std::cout << "Failed to open the file for writing" << std::endl;
    }

    return 0;
}
```

> [!note] Why the << operator works identically here, exactly as it does with std::cout
> `std::ofstream` genuinely shares the exact same underlying stream interface already used by `std::cout`, which is precisely, exactly why the same familiar `<<` insertion operator, already covered in [[C++ Basics & Syntax]], works here in exactly, identically the same intuitive, natural way. This consistent, shared, unified design across every different kind of stream is a genuinely deliberate, thoughtful piece of the language's overall design.

## 📖 Reading from a file with ifstream

`std::ifstream`, short for "input file stream," is used specifically for reading data directly in from a file.

```cpp
#include <fstream>
#include <string>

int main() {
    std::ifstream inFile("notes.txt");
    std::string line;

    if (inFile.is_open()) {
        while (std::getline(inFile, line)) {
            std::cout << line << std::endl;
        }
        inFile.close();
    } else {
        std::cout << "Failed to open the file for reading" << std::endl;
    }

    return 0;
}
```

> [!tip] std::getline reads an entire line at once, including any genuine spaces within it
> The plain `>>` extraction operator, already covered in [[C++ Basics & Syntax]], reads input only up to, but never actually including, the very next whitespace character, meaning it would genuinely stop partway through, right at the very first space, if used directly on a line of text containing multiple words. `std::getline` instead reads an entire full line at once, correctly, faithfully preserving every space genuinely contained within it, right up until it reaches the very next newline character in the file, making it the correct, appropriate tool specifically for reading genuine, ordinary sentences or full lines of text.

## ➕ Appending to an existing file

By default, opening a file for writing with `std::ofstream` completely, entirely overwrites its existing content, if the file genuinely already exists. To instead append new content onto the genuine end of an existing file, you explicitly pass an additional mode flag.

```cpp
std::ofstream outFile("notes.txt", std::ios::app);
outFile << "This gets genuinely added onto the end" << std::endl;
```

> [!warning] Forgetting the append flag silently erases the entire existing file
> Opening an already existing file in the ordinary, default writing mode, without explicitly specifying `std::ios::app`, immediately, silently truncates the file entirely, completely erasing every bit of its existing prior content, the very instant the file is actually opened, with no warning or confirmation of any kind given whatsoever. This is a genuinely easy, common mistake to accidentally make, and is well worth being deliberately, carefully aware of before working with any file that genuinely already contains data you actually still care about, and cannot afford to lose.

## 🔀 Reading and writing with the same stream: fstream

`std::fstream` combines both reading and writing capability together into a single, unified stream object, and requires you to explicitly specify the exact mode, or combination of modes, you genuinely intend to use it in.

```cpp
#include <fstream>

std::fstream file("notes.txt", std::ios::in | std::ios::out);
```

Common file mode flags, which can genuinely be combined together directly using the bitwise OR operator `|`, already covered in [[C++ Operators & Expressions]]:

| Flag | Meaning |
|---|---|
| `std::ios::in` | Open specifically for reading |
| `std::ios::out` | Open specifically for writing |
| `std::ios::app` | Append new content onto the genuine end, rather than overwriting |
| `std::ios::trunc` | Truncate (completely erase) any existing content, the ordinary default for output |
| `std::ios::binary` | Open specifically in binary mode, rather than as ordinary, genuine text |

## ⚠️ Checking for genuine errors

> [!tip] Always genuinely check whether a file actually opened successfully before using it
> Attempting to read from, or write to, a file stream that never genuinely, successfully opened correctly in the first place does not typically produce a genuine crash outright, but it also, importantly, will not genuinely do anything meaningful or useful either, and can silently, quietly fail in ways that are notably easy to entirely miss if you never actually bother to explicitly check for it first. Always genuinely verify `.is_open()` returns true, exactly as shown in the earlier examples above, before actually proceeding any further to genuinely read from or write to a file stream.

```cpp
std::ifstream inFile("does_not_exist.txt");

if (!inFile) {   // an alternative, equally valid, and very commonly used way to genuinely check the exact same thing
    std::cout << "The file could not genuinely be opened" << std::endl;
}
```

> [!note] Why a stream object can genuinely be directly checked like a plain boolean, all on its own
> Stream objects in C++ conveniently overload their own conversion to `bool` directly, exactly the same underlying mechanism already covered in [[C++ Operator Overloading]], which is precisely, exactly why writing `if (!inFile)` or simply `if (inFile)` genuinely, correctly works as a natural, quick, and perfectly valid way to check the stream's own current, actual state, entirely without needing to explicitly, separately call `.is_open()` or `.fail()` yourself every single time.

## 🧹 Closing files: manual versus automatic

While explicitly calling `.close()` yourself remains entirely good, genuinely valid practice, `std::ofstream` and `std::ifstream` objects will also automatically, reliably close their own underlying file the moment they themselves genuinely go out of scope, following exactly, precisely the same RAII pattern already covered in depth in [[C++ Memory Management]] and [[C++ Constructors & Destructors]].

```cpp
void writeToFile() {
    std::ofstream outFile("notes.txt");
    outFile << "Some content here" << std::endl;
}   // outFile's own destructor automatically, reliably closes the file right here, entirely on its own
```

> [!tip] Why explicitly calling close() still remains a genuinely good habit regardless
> Even though the file will genuinely still be closed correctly and reliably on its own regardless, explicitly calling `.close()` yourself the moment you are genuinely finished with a file makes your own actual intent immediately, unambiguously clear to any reader, and it also conveniently gives you a clean, natural, deliberate opportunity to directly, explicitly check for any potential closing related errors right at exactly that specific point, rather than relying entirely, silently on the automatic cleanup alone.

## 🔗 Where to go next

File handling connects naturally and directly to the exception handling concepts covered in [[C++ Exception Handling]], since real world file operations genuinely, very often fail in practice for a whole range of entirely valid, ordinary reasons, such as missing permissions or a genuinely full disk. Continue to [[C++ Namespaces & Preprocessor Directives]] to see how larger, real world C++ programs are actually organized across multiple, genuinely separate files altogether.
