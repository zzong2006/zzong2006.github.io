---
title: "iterator"
tags: ["python"]
aliases: ["반복자"]
---

# D) Iterator ?

이터레이터([[iterator]])란 반복 가능한(iterable) 객체의 값을 순차적으로 꺼낼 수 있는 객체를 의미합니다.
객체가 반복 가능한지 확인하는 방법은 해당 객체에 `__iter__` 메서드가 존재하는지 살펴보면 됩니다.

이터레이터 프로토콜(iterator protocol)은 `__iter__`와 `__next__` 메서드를 갖춘 객체를 뜻합니다.
이터레이터를 얻으려면 해당 객체의 `__iter__` 메서드를 호출하면 됩니다.
```python
>>> [1, 2, 3].__iter__()
<list_iterator object at 0x03616630>
```

이터레이터는 `__next__` 메서드를 통해 값을 차례대로 반환하며, 마지막 값까지 출력한 후에는 `StopIteration` 예외를 발생시킵니다.
```python
>>> it = [1, 2, 3].__iter__()
>>> it.__next__()
1
>>> it.__next__()
2
>>> it.__next__()
3
>>> it.__next__()
Traceback (most recent call last):
  File "<pyshell#48>", line 1, in <module>
    it.__next__()
StopIteration
```

또한, `__iter__`와 `__next__` 대신 `__getitem__`만 구현해도 이터레이터를 만들 수 있습니다.
아래 예시는 인덱스를 받아 특정 숫자까지 반복하는 클래스입니다.
```python
class Counter:
    def __init__(self, stop):
        self.stop = stop  # 반복을 종료할 숫자

    def __getitem__(self, index):  # 인덱스를 인자로 받음
        if index < self.stop:      # 인덱스가 종료값보다 작으면
            return index           # 인덱스 값을 반환
        else:                      # 인덱스가 종료값 이상이면
            raise IndexError       # 예외 발생
```
