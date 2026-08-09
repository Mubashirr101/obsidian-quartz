---
tags: [python, advanced, async, asyncio, concurrency]
aliases: [async await, asyncio, Coroutines]
---

# Async and Await

`asyncio` enables concurrency for I/O-bound tasks (network calls, file I/O, database queries) using a single-threaded event loop, without the overhead of threads or processes.

## The Core Idea

Regular (synchronous) code blocks entirely while waiting on I/O. Async code can pause a task that's waiting on I/O and let OTHER tasks run in the meantime, all on one thread.

```python
import asyncio
import time

def sync_task(name, delay):
    time.sleep(delay)             # BLOCKS the entire program
    print(f"{name} done")

# Three sequential sync tasks of 1s each take ~3 seconds total
```

```python
async def async_task(name, delay):
    await asyncio.sleep(delay)      # yields control, does NOT block other tasks
    print(f"{name} done")

async def main():
    await asyncio.gather(
        async_task("A", 1),
        async_task("B", 1),
        async_task("C", 1),
    )

asyncio.run(main())     # all three run "concurrently", total time is ~1 second, not 3
```

## `async def` and `await`

```python
async def fetch_data():        # defines a COROUTINE function
    await asyncio.sleep(1)        # pauses THIS coroutine, lets others run
    return "data"

async def main():
    result = await fetch_data()     # 'await' can only be used inside an 'async def' function
    print(result)

asyncio.run(main())      # entry point: starts the event loop and runs main()
```

> [!warning] Calling a coroutine function does NOT run it
> ```python
> fetch_data()     # returns a coroutine OBJECT, does nothing yet, likely triggers a RuntimeWarning
> await fetch_data()   # actually runs it
> asyncio.run(fetch_data())   # also actually runs it, as the entry point
> ```

## Running Multiple Coroutines Concurrently

```python
async def main():
    # Sequential: total time = sum of all delays
    await async_task("A", 1)
    await async_task("B", 1)

    # Concurrent: total time = the LONGEST single delay
    await asyncio.gather(
        async_task("A", 1),
        async_task("B", 1),
    )
```

## `asyncio.create_task`: Fire-and-Manage

```python
async def main():
    task1 = asyncio.create_task(async_task("A", 2))     # starts running immediately in background
    task2 = asyncio.create_task(async_task("B", 1))

    print("Tasks started, doing other work...")
    await task1        # wait for it to finish
    await task2
```

## Async Context Managers and Iterators

```python
class AsyncResource:
    async def __aenter__(self):
        print("Acquiring resource")
        return self

    async def __aexit__(self, exc_type, exc_value, traceback):
        print("Releasing resource")

async def main():
    async with AsyncResource() as res:
        print("Using resource")

class AsyncCounter:
    def __init__(self, limit):
        self.limit = limit
        self.current = 0

    def __aiter__(self):
        return self

    async def __anext__(self):
        if self.current >= self.limit:
            raise StopAsyncIteration
        await asyncio.sleep(0.1)
        self.current += 1
        return self.current

async def main():
    async for n in AsyncCounter(3):
        print(n)
```

## When to Use `asyncio` vs Threads vs Multiprocessing

> [!tip] Matching the tool to the bottleneck
> - **I/O-bound** (waiting on network requests, disk, database): `asyncio` is usually the best fit, lowest overhead, scales to thousands of concurrent operations.
> - **I/O-bound but working with libraries that don't support async**: threads (see [[Multithreading-and-Multiprocessing]]) are a reasonable fallback.
> - **CPU-bound** (heavy computation, number crunching): neither `asyncio` nor threads help due to the GIL, use multiprocessing instead.

## Common Pitfall: Blocking Calls Inside Async Code

```python
async def bad_task():
    time.sleep(2)      # WRONG: this blocks the ENTIRE event loop, defeating the purpose

async def good_task():
    await asyncio.sleep(2)     # correct: yields control to other tasks
```

> [!warning] Never call blocking synchronous functions directly inside async code
> Any regular blocking call (`time.sleep`, a synchronous `requests.get`, heavy synchronous computation) inside an `async def` freezes the ENTIRE event loop, stalling every other concurrent task, not just the current one. Use async-native libraries (`aiohttp` instead of `requests`) or run blocking work in a thread pool via `asyncio.to_thread()`.

```python
async def main():
    result = await asyncio.to_thread(blocking_function, arg1, arg2)
```
