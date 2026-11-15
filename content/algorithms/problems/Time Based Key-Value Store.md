---
title: "Time Based Key-Value Store"
aliases: ["LeetCode 981"]
tags:
  - algorithm
  - binary_search
  - leetcode
---

# A) 문제

[LeetCode 981. Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store/). 시각별로 값을 저장하고, 과거 시점의 값을 조회하는 `TimeMap` 클래스를 만든다.

- `set(key, value, timestamp)`: 시각 `timestamp` 에 `key` 의 값을 `value` 로 저장한다.
- `get(key, timestamp)`: `timestamp` **이하**의 시각에 저장된 값 중 **가장 최근 것**을 반환한다. 없으면 빈 문자열이다.

`get` 은 시각이 정확히 일치하는 값을 찾는 것이 아니다. "그 시점으로 돌아가서 당시의 값을 조회한다" 에 가깝다.

```
set("foo", "bar", 1)
get("foo", 1)  → "bar"
get("foo", 3)  → "bar"    # 3 에는 저장한 적 없지만 3 이전 최신이 1 의 bar
set("foo", "bar2", 4)
get("foo", 4)  → "bar2"
get("foo", 5)  → "bar2"
get("foo", 0)  → ""       # 0 이전에는 기록이 없다
```

같은 key 에 대한 `set` 의 `timestamp` 는 항상 증가한다고 보장된다.

# B) 저장 구조

key 마다 `(timestamp, value)` 리스트를 둔다. timestamp 가 증가하는 순서로만 들어오므로 `append` 만 해도 리스트는 정렬된 상태를 유지한다.

```
{"foo": [(1, "bar"), (4, "bar2")]}
```

# C) 조회: 마지막 O 대신 첫 번째 X 를 찾는다

정렬된 리스트에서 "t 이하 중 마지막" 을 찾는 문제다. 각 칸에 "t 이하인가?" 를 물으면 정렬돼 있으므로 O 는 전부 왼쪽, X 는 전부 오른쪽에 몰린다.

```
timestamp:  1   2   3   5   10  23  30
24 이하?    O   O   O   O   O   O   X
```

원하는 답은 **마지막 O** 다. 이것을 직접 찾지 않고 **첫 번째 X** 를 찾은 뒤 한 칸 앞으로 물러난다. 마지막 O 와 첫 번째 X 는 항상 붙어 있으므로 결과는 같다.

첫 번째 X 를 찾으면 `mid` 를 볼 때마다 할 일이 확실하게 정해진다.

- **O 를 만나면**: 이 칸은 절대 첫 번째 X 가 아니다. 버린다 → `lo = mid + 1`
- **X 를 만나면**: 이 칸이 첫 번째 X 일 수 있다. 남긴다 → `hi = mid`

```python
class TimeMap:
    def __init__(self):
        self.store = {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.store.setdefault(key, []).append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        items = self.store.get(key, [])
        lo, hi = 0, len(items)            # [lo, hi) 안에 첫 번째 X 가 있다
        while lo < hi:
            mid = (lo + hi) // 2
            if items[mid][0] <= timestamp:
                lo = mid + 1              # O: 첫 번째 X 는 mid 뒤에 있다
            else:
                hi = mid                  # X: mid 가 첫 번째 X 일 수 있다
        return items[lo - 1][1] if lo > 0 else ""
```

## C.1) 따라가 보기

`[1, 2, 3, 5, 10, 23, 30]` 에서 `t = 24` 인 경우다.

| 단계 | 범위 `[lo, hi)` | mid | 값 | 판정 | 동작 |
| --- | --- | --- | --- | --- | --- |
| 1 | `[0, 7)` | 3 | 5 | O | `lo = 4` |
| 2 | `[4, 7)` | 5 | 23 | O | `lo = 6` |
| 3 | `[6, 7)` | 6 | 30 | X | `hi = 6` |
| 끝 | `[6, 6)` | | | | 답은 `lo - 1 = 5`, 즉 23 |

2 단계에서 23 은 O 라서 버려지지만, 끝에서 `lo - 1` 로 다시 답이 된다. 버린다는 것은 "첫 번째 X 후보에서 뺀다" 는 뜻이지 답에서 사라진다는 뜻이 아니다.

같은 리스트로 경계 상황을 보면 다음과 같다.

| t | 첫 번째 X (`lo`) | 답 |
| --- | --- | --- |
| 10 (정확히 있음) | 5 (23) | 10 |
| 0 (전부 X) | 0 | 없음, 빈 문자열 |
| 100 (전부 O) | 7 (리스트 끝) | 30 |

리스트가 비었는지, t 가 첫 timestamp 보다 작은지를 따로 확인할 필요가 없다. 둘 다 끝에서 `lo == 0` 으로 걸러진다.

## C.2) 마지막 O 를 직접 찾으면 생기는 문제

마지막 O 를 직접 찾으려 하면 O 를 만났을 때 "이 칸이 마지막 O 일 수도 있다" 는 이유로 버릴 수 없다. 그래서 `lo = mid` 로 남기게 되는데, 범위가 두 칸 남으면 `mid` 가 내림 때문에 `lo` 와 같아져서 범위가 줄지 않고 무한 루프에 빠진다.

또 `hi` 를 열린 경계 (`len(items)` 에서 시작) 로 잡아 놓고 `hi = mid - 1` 로 줄이면 `mid - 1` 칸까지 범위 밖으로 밀려나 답을 놓칠 수 있다. 경계의 뜻 (닫힌 구간인지 열린 구간인지) 과 갱신 방식이 서로 맞아야 한다.

## C.3) `==` 분기는 필요 없다

`timestamp` 가 정확히 같은 칸을 만나면 그 칸이 답이므로 바로 반환해도 틀리지 않는다. 다만 넣지 않아도 위 틀이 같은 결과를 낸다. 같은 칸은 O 이므로 `lo = mid + 1` 로 넘어가고, 끝에서 `lo - 1` 로 돌아온다. 정확히 일치하지 않는 경우에는 어차피 끝까지 가야 하므로 복잡도도 같다. 분기가 적을수록 경계 처리를 실수할 곳이 줄어든다.

# D) 표준 함수

"t 보다 큰 첫 칸" 의 인덱스는 Python 의 `bisect.bisect_right`, C++ 의 `upper_bound` 가 돌려주는 값과 같다. "t 이상인 첫 칸" 은 `bisect_left`, `lower_bound` 다.

위 `get` 의 `while` 문은 다음 두 줄로 바꿀 수 있다. `key=` 인자는 Python 3.10 부터 있고, 리스트의 각 `(timestamp, value)` 에서 timestamp 만 비교하게 한다.

```python
import bisect
lo = bisect.bisect_right(items, timestamp, key=lambda item: item[0])   # 첫 번째 X
return items[lo - 1][1] if lo > 0 else ""                               # 그 한 칸 앞이 마지막 O
```

같은 틀을 "조건을 만족하는 최솟값" 찾기에 쓰는 예제(LeetCode 875 Koko Eating Bananas, 1011 Capacity To Ship Packages Within D Days)와, 이 노트처럼 "조건을 만족하는 최댓값" 을 첫 거짓의 한 칸 앞으로 찾는 일반적인 방법은 [[binary search]] 노트에 있다.

# E) 복잡도

`set` 은 $O(1)$ 이다. `get` 은 해당 key 의 기록 수를 `m` 이라 할 때 $O(\log m)$ 이다. 공간은 저장한 기록 수에 비례한다.

# References

- [LeetCode 981. Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store/)
- [bisect — Array bisection algorithm (Python 문서)](https://docs.python.org/3/library/bisect.html)
