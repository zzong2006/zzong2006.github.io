---
title: "global interpreter lock"
tags: ["python"]
aliases: ["GIL"]
---

# 1. GIL ?

Global Interpreter Lock 의 준말로, python interpreter 가 오직 하나의 [[thread]] 를 control 할 수 있게 하는 lock 방식이다. 즉, 오직 특정 시간에 하나의 thread 만 수행가능한 상태로 놓여진다는 것을 의미한다. 어떤 파이썬 바이트코드라도 실행하기 위해서는 interpreter lock (GIL) 이 필요하다.

오직 하나의 lock 이 존재하므로 이는 multi-threaded 코드에서 [[deadlock]] 현상을 방지한다. 그러나 performance bottleneck 이 발생할 수 있다. 즉, 많은 CPU 코어와 multi-threaded 구조를 지닌 상태더라도 GIL 은 오직 하나의 thread 만 실행하도록 허용한다.

# 2. GIL 은 왜 필요한 것인가?

아래와 같은 코드를 확인해보자.

```python
import sys
a = []
b = a
sys.getrefcount(a) # 3
```

어떤 객체의 reference count 가 0 에 도달하게 되면, [[garbage collector]] 는 해당 객체를 메모리에서 해제시킨다. 만약 thread 가 여러개고, lock 존재하지 않다면, 쓰레드에 의해 reference count 가 동시에 여러번 깎일 수 있다 (또는 여러번 증가할 수 있다.)

전자의 경우 reference count 가 -1 에 도달할 수 있고, 영원히 메모리에서 객체가 해제되지 않는 ‘ 메모리 누수 ’ 현상이 발생할 것이다.

이러한 현상을 완화하기 위해서, 여러 쓰레드가 동시에 공유되는 데이터 구조를 건드리지 못하도록 lock 을 건다. 하지만, lock 을 획득하고 해제하는 과정에서의 performance 저하나, deadlock 현상이 발생할 수 있다.

# 3. GIL 을 대체할 방법은 없는가?

Multi-threading 대신, multi-processing 을 수행한다.

각 python process 는 python interpreter 와 memory 공간을 개별적으로 가지게 될 것이고 GIL 이 lock 을 거는일은 없을 것이다. 그 대신 멀티프로세스를 사용하게 되면, 자원 공유가 어려워지고 프로세스 spawn 과정에서 시간이 조금 더 지연될 수 있다.

# 4. Related

# 5. References
