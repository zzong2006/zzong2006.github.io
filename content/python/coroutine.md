---
title: "coroutine"
tags: ["python"]
aliases: ["코루틴"]
---

# Coroutine ?

코루틴은 함수의 종류 중 하나로, async/await 문으로 정의되며, asyncio 어플리케이션들을 작성하기 위한 방식이다.

아래 예시는 코루틴을 나타낸다.

```python
import asyncio

async def main():  # hello 출력 후 1초 기다렸다가 world 출력
    print('hello')
    await asyncio.sleep(1)
    print('world')

asyncio.run(main())
```

단순히 코루틴을 호출한다 해서 이것이 실행되도록 스케쥴링 되진 않는다: `main()`. 대신 `asyncio.run()` 함수를 통해서 `main()` 코루틴을 실행시키면 동작하게 된다.

# Awaitables

만약 어떤 객체가 awaitable 하다면, 이는 `await` 표현으로 사용될 수 있는 객체를 의미한다. 많은 asyncio API 들은 awaitable 개념을 적용한 디자인을 사용한다.

awaitable object 는 세 개가 존재한다: coroutines, Tasks, 그리고 Futures.

## Tasks

tasks 는 코루틴을 동시에 스케쥴링하기 위해 사용된다.

## Future

# Related

# References

https://docs.python.org/3.10/library/asyncio-task.html
