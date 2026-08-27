---
tags: ["python"]
---

# A) Python Thread 기본

[[Python]] 에서 스레드를 구현하기 위해서는 일반적으로 `threading` 라이브러리를 사용한다.

`threading.Thread` 함수로 스레드로 실행할 함수와 인자를 넣고, `start` 를 이용해서 스레드를 실행시킨다.

스레드 동작 순서
* 스레드를 호출한 함수가 끝난 이후에 스레드가 종료된다.

```python
import threading
import logging  # 외부 출력으로 print 대신 logging 사용
import time
def helper_function(name, m_log : logging.Logger):
    m_log.info('function {} started'.format(name))
    time.sleep(2)
    m_log.info('function {} finished'.format(name))

# 원래 logging은 WARNING 레벨 까지만 출력이 되는데, 출력 레벨을 바꿔줄 수 있음
logging.basicConfig(level=logging.INFO)
my_logger = logging.getLogger("my")

my_logger.info('Main : Started')

x = threading.Thread(target=helper_function, args=(1, my_logger))
my_logger.info('Main : Call Thread {}'.format(1))
x.start()

my_logger.info('Main : Finished ')
```

```python
INFO:my:Main : Started
INFO:my:Main : Call Thread 1
INFO:my:function 1 started
INFO:my:Main : Finished
```

# B) Daemon Thread

백그라운드에서 동작하는 프로세스를 daemon 이라고 부른다.
* daemon 을 호출한 프로그램이 종료되면 그 즉시 shut down 된다.

`Main` 이 종료된 이후, Thread 도 바로 종료되어서 `INFO:my:function 1 finished` 를 출력하지 못한 모습을 확인할 수 있다.

```python
x = threading.Thread(target=helper_function, args=(1, my_logger),daemon=True)
my_logger.info('Main : Call Thread {}'.format(1))
x.start()

my_logger.info('Main : Finished ')
```

```python
INFO:my:Main : Call Thread 1
INFO:my:function 1 started
INFO:my:Main : Finished
```

# C) join()

`join()` 은 특정 thread 에게 다른 thread 가 종료될 때 까지 기다리라고 말하는 것을 의미한다.

`x.start()` 후, `x.join()` 을 호출하면 `main` 스레드는 `x` 스레드가 끝날 때까지 기다린다.

```python
my_logger.info('Main : Started')

x = threading.Thread(target=helper_function, args=(1, my_logger))
my_logger.info('Main : Call Thread {}'.format(1))
x.start()
my_logger.info('Main : Wait for the thread to finish')
x.join() # x 가 끝날때 까지 Main 스레드에게 기다리라고 하기
my_logger.info('Main : Finished ')
```

```python
INFO:my:Main : Started
INFO:my:Main : Call Thread 1
INFO:my:function 1 started
INFO:my:Main : Wait for the thread to finish
INFO:my:function 1 finished
INFO:my:Main : Finished
```

# D) 다중 스레드 실행

## D.1) For Loop 방식

단순히 for loop 만 사용하는 방법. 하지만 이런 방식에는 다음과 같은 문제점이 있다.
* 실행되는 많은 스레드들은 OS 가 정한 순서에 의해 적절히 동작하므로, 각 스레드가 언제 종료될지 예측하기 힘든 문제가 발생한다.

```python
threads = list()
for i in range(3):
    my_logger.info('Main : create and start thread {}'.format(i + 1))
    x = threading.Thread(target=helper_function, args=(i + 1, my_logger))
    threads.append(x) # threads를 list에 담고 시작
    x.start()

for idx, thread in enumerate(threads):
    logging.info("Main : Before joining Thread {}".format(idx + 1))
    thread.join()
    logging.info("Main : Thread {} done".format(idx + 1))
```

## D.2) ThreadPoolExecutor

`ThreadPoolExecutor` 는 실행할 스레드마다 context manager 역할을 하는 executor 를 만들어 내는 역할을 한다.

executor 는 마지막에 `join()` 을 이용해서 다른 thread 간 실행 간격을 적절히 조절한다.
일반적으로 다중 스레드를 다룰 때 추천되는 방법이다.

```python
import concurrent.futures

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
    for result in executor.map(helper_function, list(range(3)), [my_logger for _ in range(3)]):
        if result is not None:  # 스레드 실행에 문제가 없다면 None 출력
            print(result)       # result 를 출력함으로써 executor의 map 실행 결과를 알 수 있다.
                                # 이렇게 직접 출력하지 않으면, 에러가 발생해도 알려주지 않는다.
```

# E) Race Condition

스레드를 다루다보면, Race Condition 이 발생할 수 있다.
race condition 은 두개 이상의 스레드가 공유된 자원에 동시에 접근하려다 발생하는 문제다.

```python
class FakeDatabase:
    def __init__(self):
        self.value = 0

    def update(self, name):
        """
        객체의 value 의 값을 받아서 1 상승 시킨 후, 0.1초 후에 수정된 값을 입력한다.
        """
        logging.info("Thread %s: starting update", name)
        local_copy = self.value
        local_copy += 1
        time.sleep(0.1)
        self.value = local_copy
        logging.info("Thread %s: finishing update", name)
```

Race condition 발생 예시:

```python
database = FakeDatabase()
my_logger.info("Testing update. Starting value is {}".format(database.value))
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
    for i in range(2):
        executor.submit(database.update, i)
my_logger.info("Testing update. Ending value is {}".format(database.value))
```

```python
INFO:my:Testing update. Starting value is 0
INFO:root:Thread 0: starting update
INFO:root:Thread 1: starting update
INFO:root:Thread 0: finishing update
INFO:root:Thread 1: finishing update
INFO:my:Testing update. Ending value is 1
```

원래라면 값이 2 가 되어야 한다 (thread 0 이 +1, thread 1 이 +1 해서 총 0+1+1=2).

왜 이런 현상이 발생하는가?
* `time.sleep` 에 의해 첫번째로 실행된 thread 는 멈추게되고, 두번째 thread 를 실행시키게 허락한다.
* 이후 첫번째 스레드가 업데이트된 값을 다시 넣기 전에, 두번째 스레드가 업데이트되기 전의 값을 가져간다.
* 즉, 동일한 값 0 을 각 스레드에서 가져가고 그 값을 서로 업데이트 한다 (0 -> 1).

# F) Lock 을 이용한 동기화

[[mutex]] 개념을 가진 `lock` 을 활용하면, race condition 을 해결할 수 있다.
* mutex: 공유된 자원을 오직 하나의 스레드만 접근 가능하도록 제한
* [[semaphore]]: 공유된 자원을 정의된 개수만큼의 스레드만 접근 가능하도록 제한 (변수 개념)

스레드는 `threading.Lock()` 의 `acquire` 함수를 실행시켜서 `lock` 을 획득하고, 작업을 마친 후 `release` 를 통해 `lock` 을 해제한다.
* 물론 `lock` 이 해제되지 않는다면, 기다리는 스레드는 무한히 기다려야 할것이다.

```python
class FakeDatabaseREV1:
    def __init__(self):
        self.value = 0
        self._lock = threading.Lock() # mutex

    def update(self, name):
        logging.info("Thread %s: starting update", name)
        logging.debug("Thread %s: about to lock", name)
        with self._lock:            # acquire 과 release를 with statement로 해결함
            logging.debug("Thread %s has lock", name)
            local_copy = self.value
            local_copy += 1
            time.sleep(0.1)
            self.value = local_copy
            logging.debug("Thread %s about to release lock", name)
        logging.debug("Thread %s after release", name)
        logging.info("Thread %s: finishing update", name)
```

`with` statement 참고:
```python
# 아래 두 코드는 동일하다
some_lock.acquire()
try:
    # do something...
finally:
    some_lock.release()

with some_lock:
    # do something...
```

이 방법의 가장 큰 문제는 [[deadlock]] 이 발생할 수 있다는 점이다.
deadlock 은 종종 개발자가 `.release()` 를 호출하는 것을 까먹어서 생기는 경우가 많다.
일반적으로 context manager (`executor`) 를 사용하면 이러한 문제를 자동으로 처리해준다.

# G) threading.Semaphore

세마포어는 mutex 와 비슷하게 동작한다. 즉, 스레드는 lock 을 걸고, lock 이 해제되지 않는 한 다른 스레드는 공통된 자원에 접근하지 못한다.

하지만, 세마포어는 공용 자원에 접근할 수 있는 스레드의 개수를 한 개 이상으로 설정할수 있다.

세마포어는 변수의 개념을 가진다. 만약 세마포어가 `n` 이고, 누군가 세마포어 (lock) 를 획득 (`acquire`) 한다면, 세마포어 크기는 `n-1` 이 된다. 이 값이 0 이 될때까지 세마포어는 공용 자원에 스레드들이 접근하는 것을 허락한다.

또한, 작업을 마친 스레드가 세마포어를 포기 (`release`) 한다면, 세마포어 값이 1 증가한다.

```python
from threading import Semaphore

class FooSemaphore:
    def __init__(self):
        self.gates = Semaphore(0)

    def first(self):
        logging.info('first')
        self.gates.release()

    def second(self):
        with self.gates:
            logging.info('second')

foo = FooSemaphore()
y = threading.Thread(target=foo.second)
y.start()
x = threading.Thread(target=foo.first)
x.start()
```

비록 두번째 thread 가 먼저 실행되었다 할지라도, 세마포어에 의해 첫번째 스레드가 실행되기를 기다린다.
이후, 첫번째 스레드가 `release` 를 통해 세마포어를 증가 (0->1) 시키면, 두번째 스레드가 동작 (`acquire`) 한다.

# H) threading.Barrier

Barrier 는 고정된 스레드가 동시에 실행될 수 있도록 도와주는 객체다.

`threading.Barrier(parties, action=None, timeout=None)` 를 통해 초기화되고, 모든 스레드는 `wait()` 함수를 통해 `parties + 1` 만큼의 스레드가 모이길 기다린다.

```python
from threading import Barrier

class Foo:
    def __init__(self):
        self.first_barrier = Barrier(1, timeout=5)

    def first(self, printFirst):
        printFirst()
        self.first_barrier.wait()   # 먼저 barrier 앞에서 기다림

    def second(self, printSecond):
        self.first_barrier.wait()   # 그다음 스레드도 barrier 에서 기다림 (2개가 모였으므로 barrier 해제)
        printSecond()

foo = Foo()
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        for idx, func in enumerate([foo.first, foo.second]):
            executor.submit(func, print(idx))
```

첫번째 스레드는 자신의 인자로 주어진 함수를 실행시킨 후, 다른 스레드도 barrier 앞에서 기다리길 원한다. 두번째 스레드가 최종적으로 `wait` 을 실행하면, 그제서야 barrier 는 해제되며, 두번째 스레드는 `printSecond()` 를 실행한다.
