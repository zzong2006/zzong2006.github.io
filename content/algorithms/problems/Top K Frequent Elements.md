---
title: "Top K Frequent Elements"
aliases: ["상위 K 빈도 원소", "LeetCode 347"]
tags:
  - algorithm
  - heap
  - leetcode
---

# A) 문제

[LeetCode 347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/). 정수 배열 `nums` 와 정수 `k` 가 주어지면 **가장 자주 나온 원소 `k` 개**를 반환한다. 순서는 상관없다.

```
nums = [1,1,1,2,2,3], k = 2  →  [1,2]
```

`k` 는 1 이상이고 고유 원소 수 이하이며, 답은 하나로 정해진다고 보장된다. 문제 끝에 "$O(n \log n)$ 보다 빠르게 풀어 보라" 는 follow-up 이 붙어 있다.

아래에서 `n` 은 배열 길이, `m` 은 고유 원소 수다. 항상 `k ≤ m ≤ n` 이다.

# B) 풀이 1: 세고 정렬하기

가장 먼저 떠오르는 방법이다. 원소별 빈도를 해시맵에 세고, 빈도 내림차순으로 정렬한 뒤 앞에서 `k` 개를 자른다.

```python
from collections import Counter


class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        count = Counter(nums)
        return sorted(count, key=count.get, reverse=True)[:k]
```

## B.1) 시간 복잡도가 $O(n + m \log m)$ 인 이유

단계별로 나누면 다음과 같다.

| 단계 | 하는 일 | 시간 |
| --- | --- | --- |
| `Counter(nums)` | 원소 `n` 개를 한 번씩 훑으며 해시맵에 +1 | $O(n)$ |
| `sorted(...)` | 고유 원소 `m` 개를 빈도 기준으로 정렬 | $O(m \log m)$ |
| `[:k]` | 앞에서 `k` 개 복사 | $O(k)$ |

`n` 은 슬라이스가 아니라 **빈도를 세는 단계**에서 나온다. 슬라이스의 $O(k)$ 는 `k ≤ m` 이라 정렬 항에 묻힌다.

모든 원소가 서로 다르면 `m = n` 이므로 최악은 $O(n \log n)$ 이다. 그래서 그냥 $O(n \log n)$ 이라고 말해도 틀리지 않는다. 다만 두 항으로 나눠 두면 중복이 많은 입력에서 실제로 더 빠르다는 점이 드러난다. [[time complexity]] 표기는 해당 노트 참고.

# C) 풀이 2: 크기 k 짜리 min-heap

풀이 1은 `m` 개를 전부 정렬하지만 필요한 것은 상위 `k` 개뿐이다. [[Heap]] 을 쓰면 전체 정렬 없이 상위 `k` 개만 유지할 수 있다.

```python
import heapq
from collections import Counter


class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        count = Counter(nums)
        heap = []
        for num, freq in count.items():
            heapq.heappush(heap, (freq, num))
            if len(heap) > k:
                heapq.heappop(heap)  # 빈도가 가장 낮은 것을 버린다
        return [num for freq, num in heap]
```

`heapq.nlargest(k, count, key=count.get)` 한 줄로도 같은 결과가 나온다. 내부에서 하는 일이 위 코드와 같다.

## C.1) 큰 값 k 개를 구하는데 왜 min-heap 인가

힙에서 필요한 연산이 "큰 값을 꺼내기" 가 아니라 **"지금 들고 있는 `k` 개 중 가장 작은 값을 찾아서 버리기"** 이기 때문이다.

힙을 "상위 `k` 명 명단" 으로 보면 `heap[0]`(최솟값)은 그 명단의 커트라인이다. 새 값이 들어올 때마다 명단의 꼴찌 하나를 내보낼지만 결정하면 된다. 꼴찌를 $O(1)$ 에 찾고 $O(\log k)$ 에 내보내는 자료구조가 min-heap 이다.

`k = 2` 이고 빈도가 5, 1, 3, 8 순서로 들어오는 경우를 따라가 보면 다음과 같다.

| 들어온 빈도 | push 직후 힙 | 크기가 k 를 넘으면 pop | 남은 힙 |
| --- | --- | --- | --- |
| 5 | `[5]` | - | `[5]` |
| 1 | `[1, 5]` | - | `[1, 5]` |
| 3 | `[1, 5, 3]` | 1 을 버린다 | `[3, 5]` |
| 8 | `[3, 5, 8]` | 3 을 버린다 | `[5, 8]` |

끝나고 남은 `[5, 8]` 이 상위 2 개다.

max-heap 으로도 풀 수는 있다. 전부 넣은 뒤 큰 것부터 `k` 번 꺼내면 된다. 이 경우 힙에 `m` 개가 모두 들어가므로 시간은 $O(m + k \log m)$, 힙 메모리는 $O(m)$ 이다. min-heap 방식은 힙 크기가 `k` 를 넘지 않아서 입력이 끝없이 들어오는 스트림에서도 쓸 수 있다.

정리하면 방향이 반대다.

- 큰 값 `k` 개 → 크기 `k` 의 **min**-heap
- 작은 값 `k` 개 → 크기 `k` 의 **max**-heap

## C.2) 시간 복잡도가 $O(n + m \log k)$ 인 이유

| 단계 | 하는 일 | 시간 |
| --- | --- | --- |
| `Counter(nums)` | 빈도 세기 | $O(n)$ |
| 반복문 | 고유 원소 `m` 개를 하나씩 push, 필요하면 pop | `m` 번 × $O(\log k)$ |

push 와 pop 은 트리 높이만큼 걸린다. 힙 크기를 `k` 로 유지하므로 높이가 $\log k$ 다. 풀이 1과 비교하면 $m \log m$ 이 $m \log k$ 로 바뀐 것이다. `m` 이 100만이고 `k` 가 10이면 $\log m \approx 20$, $\log k \approx 3$ 이다. `k` 가 `m` 에 가까우면 차이가 없다.

공간은 힙이 $O(k)$ 이고 `Counter` 가 $O(m)$ 이라서 전체로는 $O(m)$ 이다. 힙만 보고 $O(k)$ 라고 하면 `Counter` 를 빠뜨린 것이다.

# D) heapq 는 리스트를 힙으로 다룬다

Python 의 `heapq` 에는 힙 클래스가 따로 없다. **평범한 리스트가 곧 힙**이고, `heapq` 의 함수들은 그 리스트가 힙 규칙을 지키도록 원소를 옮겨 준다.

## D.1) 리스트 하나로 트리를 표현하는 방법

힙은 완전 [[Binary Tree]] 다. 완전 이진 트리는 위에서부터 빈칸 없이 채워지므로 배열 하나에 그대로 담을 수 있다. 인덱스 `i` 의 자식은 `2i + 1` 과 `2i + 2` 이고, 부모는 `(i - 1) // 2` 다.

```
리스트: [1, 3, 2, 7, 5]

        1          인덱스 0
      /   \
     3     2       인덱스 1, 2
    / \
   7   5           인덱스 3, 4
```

힙 규칙은 "부모 ≤ 자식" 하나뿐이다. 리스트가 정렬돼 있는 것은 아니고, 보장되는 것은 `heap[0]` 이 최솟값이라는 것뿐이다. 앞의 표에서 push 직후 힙이 `[1, 5, 3]` 처럼 정렬되지 않은 모양으로 나온 것도 이 때문이다.

## D.2) 자주 쓰는 함수

| 함수 | 하는 일 | 시간 |
| --- | --- | --- |
| `heappush(h, x)` | 맨 뒤에 붙인 뒤 부모보다 작으면 위로 올린다 | $O(\log n)$ |
| `heappop(h)` | `h[0]` 을 꺼내고 맨 뒤 원소를 루트에 올린 뒤 아래로 내린다 | $O(\log n)$ |
| `h[0]` | 최솟값 조회 | $O(1)$ |
| `heapify(h)` | 아무 리스트나 힙으로 정리한다 | $O(n)$ |
| `nlargest(k, it, key=...)` | 크기 `k` 힙으로 상위 `k` 개를 뽑는다 | $O(n \log k)$ |

## D.3) 쓸 때 주의할 점

- min-heap 만 지원한다. max-heap 이 필요하면 값에 `-` 를 붙여 넣고 꺼낼 때 다시 `-` 를 붙인다.
- 튜플을 넣으면 첫 원소부터 비교한다. 그래서 `(우선순위, 값)` 꼴로 넣는다. 위 풀이의 `(freq, num)` 이 이 형태다.
- 리스트 그대로라서 규칙을 깨는 것도 막아 주지 않는다. 힙으로 쓰는 리스트에 `append` 를 직접 하면 `h[0]` 이 최솟값이라는 보장이 사라진다. 넣고 빼는 것은 `heappush` 와 `heappop` 으로만 한다.
- `h[-1]` 이 최댓값이라는 보장은 없다. 인덱스로 볼 수 있는 것은 `h[0]` 뿐이다.

# E) 풀이 3: 버킷 정렬

follow-up 의 가장 빠른 답이다. 빈도는 1 이상 `n` 이하의 정수다. 그래서 **인덱스가 빈도인 배열**을 만들어 원소를 넣고, 뒤에서부터 `k` 개를 모으면 비교 정렬 없이 끝난다.

```python
from collections import Counter


class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        count = Counter(nums)
        buckets = [[] for _ in range(len(nums) + 1)]
        for num, freq in count.items():
            buckets[freq].append(num)

        result = []
        for freq in range(len(buckets) - 1, 0, -1):
            result.extend(buckets[freq])
            if len(result) >= k:
                return result[:k]
```

`nums = [1,1,1,2,2,3]` 이면 `buckets[3] = [1]`, `buckets[2] = [2]`, `buckets[1] = [3]` 이 되고, 뒤에서부터 훑어 `[1, 2]` 를 얻는다.

빈도 세기 $O(n)$, 버킷 채우기 $O(m)$, 버킷 훑기 $O(n)$ 이라서 전체 $O(n)$ 이다. 버킷 배열 때문에 공간도 $O(n)$ 이다.

# F) 세 풀이 비교

| 풀이 | 방식 | 시간 | 공간 |
| --- | --- | --- | --- |
| 정렬 | 고유 원소 전체를 빈도순으로 정렬 | $O(n + m \log m)$ | $O(m)$ |
| min-heap | 상위 `k` 개만 힙에 유지 | $O(n + m \log k)$ | $O(m)$ |
| 버킷 정렬 | 빈도를 인덱스로 쓰는 배열 | $O(n)$ | $O(n)$ |

면접에서는 정렬 풀이를 먼저 말하고 복잡도를 짚은 뒤, "`k` 가 작으면 힙으로 $m \log k$ 까지 줄일 수 있다" 로 넘어가는 순서가 자연스럽다. `Counter.most_common(k)` 한 줄로 끝내면 직접 구현해 보라는 요청이 따라올 수 있으므로 힙 버전은 손으로 쓸 수 있어야 한다.

힙 풀이는 입력이 스트림이거나 `k` 가 작을 때 유리하고, 버킷 풀이는 빈도처럼 값의 범위가 `n` 이하로 묶여 있을 때만 쓸 수 있다. 정렬 전반은 [[sorting]] 참고.

같은 "크기 `k` 힙" 틀을 쓰는 문제로 LeetCode 973 (K Closest Points to Origin) 이 있다. 가까운 점, 즉 **작은** 값 `k` 개를 구하므로 거리에 `-` 를 붙인 max-heap 을 쓴다.

# References

- [LeetCode 347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)
- [heapq — Heap queue algorithm (Python 문서)](https://docs.python.org/3/library/heapq.html)
