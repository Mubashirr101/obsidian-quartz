---
tags: [python, advanced, concurrency, threading, multiprocessing, gil]
aliases: [Threading, Multiprocessing, GIL, Global Interpreter Lock]
---

# Multithreading and Multiprocessing

## The GIL (Global Interpreter Lock)

CPython (the standard Python implementation) has a GIL: only ONE thread can execute Python bytecode at any given instant, even on a multi-core machine.

> [!warning] The GIL means threading does NOT speed up CPU-bound work
> Multiple threads doing pure computation (math, loops, string processing) in CPython will run essentially no faster than a single thread, because they're all fighting for the same GIL. Threading only helps for I/O-bound work, where a thread releases the GIL while waiting.

## `threading`: Good for I/O-Bound Concurrency

```python
import threading
import time

def download(name, delay):
    time.sleep(delay)      # simulates I/O wait; GIL is released during this
    print(f"{name} downloaded")

threads = []
for i in range(3):
    t = threading.Thread(target=download, args=(f"file{i}", 1))
    threads.append(t)
    t.start()

for t in threads:
    t.join()      # wait for all threads to finish before continuing

# Total time ~1 second, not 3, because I/O waits overlap
```

## Thread Safety and Race Conditions

```python
import threading

counter = 0

def increment():
    global counter
    for _ in range(100_000):
        counter += 1      # NOT atomic! read-modify-write can be interrupted mid-operation

threads = [threading.Thread(target=increment) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()

print(counter)     # often NOT 400,000, due to a race condition
```

Fix with a `Lock`:

```python
counter = 0
lock = threading.Lock()

def increment():
    global counter
    for _ in range(100_000):
        with lock:              # only one thread can hold the lock at a time
            counter += 1

# now counter reliably ends at 400,000
```

## `multiprocessing`: True Parallelism for CPU-Bound Work

Spawns separate PROCESSES, each with its own Python interpreter and memory space, sidestepping the GIL entirely.

```python
import multiprocessing

def cpu_heavy(n):
    return sum(i * i for i in range(n))

if __name__ == "__main__":         # REQUIRED on Windows, good practice everywhere
    with multiprocessing.Pool(processes=4) as pool:
        results = pool.map(cpu_heavy, [10_000_000, 10_000_000, 10_000_000, 10_000_000])
    print(results)     # actually runs on 4 separate cores in parallel
```

> [!warning] `if __name__ == "__main__":` guard is mandatory for multiprocessing
> Without it, each spawned child process re-imports the script, which can trigger infinite process spawning on some platforms (especially Windows). Always guard multiprocessing entry points.

## `concurrent.futures`: A Simpler Unified Interface

```python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

# For I/O-bound work
with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(download_func, urls))

# For CPU-bound work
with ProcessPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(cpu_heavy_func, data_chunks))
```

```python
# Submitting individual tasks and collecting results as they complete
from concurrent.futures import ThreadPoolExecutor, as_completed

with ThreadPoolExecutor(max_workers=4) as executor:
    futures = [executor.submit(download, f"file{i}", 1) for i in range(5)]
    for future in as_completed(futures):
        result = future.result()      # blocks until THIS specific future is done
```

## Decision Table

| Workload type | Best tool | Why |
|---|---|---|
| CPU-bound (math, image processing, data crunching) | `multiprocessing` | Bypasses the GIL, true parallel execution |
| I/O-bound (network, disk, database) | `asyncio` | Lowest overhead, scales to thousands of concurrent tasks |
| I/O-bound, using non-async libraries | `threading` | Simpler than asyncio, works with blocking libraries |
| Mixed / simple parallel task submission | `concurrent.futures` | Clean, unified API over both threads and processes |

> [!tip] Rule of thumb
> If your code is mostly WAITING (for a network response, a file read, a database query), reach for `asyncio` or `threading`. If your code is mostly CALCULATING (crunching numbers, transforming data), reach for `multiprocessing`.
