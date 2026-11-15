---
title: "LRU"
tags:
  - algorithm
  - OS
  - cache
aliases: [Least Recently Used, LRU Cache, LeetCode 146]
---

# A) LRU

LRU(Least Recently Used)는 가장 오래 사용되지 않은 항목을 먼저 제거하는 replacement policy다. [[OS/cache|cache]]와 [[algorithms/페이지 교체 알고리즘|페이지 교체 알고리즘]]에서 자주 등장한다.

# B) 핵심 아이디어

최근에 접근한 데이터는 가까운 미래에도 다시 접근될 가능성이 높다는 locality 가정에 기대고 있다. 그래서 접근 시점을 계속 갱신하고, 공간이 부족해지면 마지막 접근 시점이 가장 오래된 항목을 내보낸다.

# C) 모든 연산을 O(1) 로 구현하기

[LeetCode 146. LRU Cache](https://leetcode.com/problems/lru-cache/) 는 LRU cache 를 직접 구현하는 문제다. 용량 `capacity` 를 받아 만들고, 두 연산을 평균 $O(1)$ 에 처리해야 한다.

- `get(key)`: key 가 있으면 값을 돌려주고, 없으면 `-1` 을 돌려준다.
- `put(key, value)`: key 가 있으면 값을 바꾸고, 없으면 새로 넣는다. 넣은 뒤 항목 수가 용량을 넘으면 가장 오래 사용되지 않은 항목을 지운다.

`get` 과 `put` 모두 그 key 를 "방금 사용한" 것으로 친다.

## C.1) 자료구조 두 개를 함께 쓰는 이유

LRU cache 가 빠르게 해야 하는 일은 세 가지다.

1. key 로 항목을 찾는다.
2. 찾은 항목을 사용 순서의 맨 앞(가장 최근)으로 옮긴다. 항목이 순서의 어디에 있든 옮길 수 있어야 한다.
3. 용량이 넘치면 사용 순서의 맨 뒤(가장 오래됨)에 있는 항목을 꺼낸다.

어느 자료구조 하나로는 셋을 모두 $O(1)$ 에 할 수 없다.

| 자료구조 | key 로 찾기 | 중간 항목을 맨 앞으로 | 맨 뒤 꺼내기 |
| --- | --- | --- | --- |
| dict | $O(1)$ | 순서가 없다 | 순서가 없다 |
| 배열 | $O(n)$ | $O(n)$, 뒤 원소를 한 칸씩 밀어야 한다 | $O(1)$ |
| 이중 연결 리스트 | $O(n)$, 앞에서부터 따라가야 한다 | 노드를 알면 $O(1)$ | $O(1)$ |

이중 연결 리스트(doubly linked list)는 각 노드가 앞 노드(`prev`)와 뒤 노드(`next`)를 함께 가리키는 리스트다. 노드 하나만 손에 쥐고 있으면 앞뒤 연결을 바꿔서 그 노드를 리스트에서 떼어낼 수 있다. 뒤 노드만 가리키는 단일 연결 리스트에서는 떼어낼 노드의 앞 노드를 찾으려고 처음부터 따라가야 해서 $O(n)$ 이 된다.

이중 연결 리스트에 없는 것은 "key 로 노드를 바로 찾는" 능력 하나다. 그래서 dict 가 key 에서 노드로 가는 지름길을 맡는다. dict 의 값을 숫자가 아니라 **리스트의 노드 객체** 로 두면, key 로 노드를 찾고(dict) 그 노드를 떼어내 맨 앞에 붙이는(리스트) 일이 모두 $O(1)$ 이 된다.

```
dict:   1 ──┐        3 ──┐          2 ──┐
            ▼            ▼              ▼
head ⇄ [key=1, 10] ⇄ [key=3, 30] ⇄ [key=2, 20] ⇄ tail
       가장 최근                     가장 오래됨
```

리스트는 앞쪽(`head` 쪽)이 최근에 쓴 항목, 뒤쪽(`tail` 쪽)이 오래된 항목이 되도록 유지한다. 용량이 넘치면 `tail` 바로 앞 노드를 지운다.

## C.2) 더미 head 와 tail

`head` 와 `tail` 은 실제 데이터가 없는 빈 노드다. 이런 노드를 더미 노드(dummy node) 또는 sentinel 이라고 한다. 둘은 처음부터 끝까지 리스트 양 끝에 있고, 실제 항목은 언제나 그 사이에 들어간다.

더미 노드가 없으면 노드를 떼어내거나 붙일 때마다 경계 상황을 따로 처리해야 한다. 떼어낼 노드가 맨 앞이면 리스트의 시작을 바꿔야 하고, 맨 뒤면 끝을 바꿔야 하며, 리스트가 비어 있으면 앞뒤가 모두 `None` 이다. 더미 노드를 두면 실제 노드의 `prev` 와 `next` 는 항상 어떤 노드를 가리킨다. 그래서 떼어내기와 붙이기가 조건문 없이 각각 두 줄, 네 줄로 끝난다.

## C.3) 노드에 key 도 저장하는 이유

노드에 값만 넣어도 `get` 과 `put` 의 갱신은 동작한다. 문제는 용량이 넘쳐 항목을 지울 때다.

지울 노드는 `tail.prev` 로 바로 찾을 수 있다. 하지만 리스트에서 떼어내는 것만으로는 끝나지 않고, dict 에서도 그 항목을 지워야 한다. dict 에서 지우려면 key 가 필요한데, 노드에 key 가 없으면 dict 전체를 훑어 "값이 이 노드인 key" 를 찾아야 해서 $O(n)$ 이 된다.

dict 는 key 에서 노드로 가는 방향만 빠르다. 노드에서 key 로 돌아가는 방향은 노드가 key 를 들고 있어야 빨라진다. 용량 초과로 지우는 경우가 리스트 쪽에서 시작해 dict 쪽으로 가는 유일한 연산이라서 여기서 필요해진다.

## C.4) 코드

```python
class Node:
    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None


class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}                  # key → Node
        self.head = Node()               # 더미. head.next 가 가장 최근 항목
        self.tail = Node()               # 더미. tail.prev 가 가장 오래된 항목
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_front(self, node):
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._remove(node)
        self._add_front(node)
        return node.value

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            node = self.cache[key]
            node.value = value
            self._remove(node)
            self._add_front(node)
            return

        if len(self.cache) == self.capacity:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]      # 노드에 key 가 있어야 하는 자리

        node = Node(key, value)
        self.cache[key] = node
        self._add_front(node)
```

`_add_front` 에서 네 줄의 순서는 바꿀 수 있지만, `self.head.next` 를 마지막에 바꿔야 한다. 먼저 바꾸면 원래 맨 앞에 있던 노드를 가리키는 수단이 사라져서 `node.next` 를 연결할 수 없다.

`put` 에서 이미 있는 key 를 갱신할 때는 용량 검사를 건너뛴다. 항목 수가 늘지 않기 때문이다. 용량 검사를 먼저 하면, 꽉 찬 cache 에 이미 있는 key 를 갱신할 때 다른 항목을 쓸데없이 지운다.

## C.5) 따라가 보기

용량 2 로 만들고 LeetCode 예제의 연산을 차례로 실행하면 리스트가 다음처럼 바뀐다. 리스트는 앞쪽이 가장 최근이다.

| 연산 | 반환 | 실행 뒤 리스트 (key) | 설명 |
| --- | --- | --- | --- |
| `put(1, 1)` | | 1 | |
| `put(2, 2)` | | 2, 1 | |
| `get(1)` | 1 | 1, 2 | 1 을 맨 앞으로 옮긴다 |
| `put(3, 3)` | | 3, 1 | 용량 초과. 맨 뒤의 2 를 지운다 |
| `get(2)` | -1 | 3, 1 | |
| `put(4, 4)` | | 4, 3 | 용량 초과. 맨 뒤의 1 을 지운다 |
| `get(1)` | -1 | 4, 3 | |
| `get(3)` | 3 | 3, 4 | |
| `get(4)` | 4 | 4, 3 | |

`put(3, 3)` 에서 지워지는 것이 먼저 들어온 1 이 아니라 2 다. 바로 앞의 `get(1)` 이 1 을 최근 항목으로 만들었기 때문이다. 들어온 순서로 지우는 [[First In First Out|FIFO]] 와 다른 점이 여기서 드러난다.

## C.6) Python 의 OrderedDict

Python 의 `collections.OrderedDict` 는 내부가 dict 와 이중 연결 리스트로 되어 있다. `move_to_end(key)` 가 노드를 끝으로 옮기고, `popitem(last=False)` 가 반대쪽 끝을 꺼낸다. 그래서 위 구현과 같은 일을 몇 줄로 할 수 있다. 이 구현에서는 끝(`last`) 쪽이 가장 최근 항목이다.

```python
from collections import OrderedDict


class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
```

# D) 실무에서 볼 점

정확한 LRU는 접근 순서를 매번 갱신해야 하므로 구현 비용이 든다. 그래서 운영체제나 대규모 cache에서는 clock algorithm처럼 LRU를 근사하는 방식도 많이 쓴다.
