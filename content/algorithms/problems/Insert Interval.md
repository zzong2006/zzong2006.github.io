---
title: "Insert Interval"
aliases: ["LeetCode 57"]
tags:
  - algorithm
  - interval
  - leetcode
---

# A) 문제

[LeetCode 57. Insert Interval](https://leetcode.com/problems/insert-interval/). 시작점 기준으로 정렬돼 있고 서로 겹치지 않는 구간 목록 `intervals` 에 새 구간 `newInterval` 을 넣는다. 넣은 뒤에도 정렬돼 있고 겹치지 않도록 필요한 구간을 합쳐서 반환한다.

```
intervals = [[1,3],[6,9]],  newInterval = [2,5]   →  [[1,5],[6,9]]
intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]],  newInterval = [4,8]   →  [[1,2],[3,10],[12,16]]
```

# B) 세 갈래로 나누기

목록이 이미 정렬돼 있으므로 다시 정렬하지 않고 한 번만 훑는다. 각 구간은 새 구간을 기준으로 셋 중 하나다.

1. **새 구간보다 완전히 앞**: 끝점이 새 구간의 시작점보다 작다. 그대로 넣는다.
2. **새 구간과 겹침**: 새 구간에 합친다. 시작점은 더 작은 쪽, 끝점은 더 큰 쪽으로 넓힌다.
3. **새 구간보다 완전히 뒤**: 시작점이 (넓혀진) 새 구간의 끝점보다 크다. 새 구간을 넣은 뒤 나머지를 그대로 붙인다.

```python
class Solution:
    def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
        result = []
        i, n = 0, len(intervals)
        start, end = newInterval

        while i < n and intervals[i][1] < start:      # 1. 완전히 앞
            result.append(intervals[i])
            i += 1

        while i < n and intervals[i][0] <= end:       # 2. 겹침: 새 구간을 넓힌다
            start = min(start, intervals[i][0])
            end = max(end, intervals[i][1])
            i += 1
        result.append([start, end])

        result.extend(intervals[i:])                  # 3. 완전히 뒤
        return result
```

새 구간이 여러 구간을 한꺼번에 삼키는 경우는 2 번 루프가 `start`, `end` 를 계속 넓히며 처리한다. `intervals` 가 비어 있거나 새 구간이 맨 앞이나 맨 뒤에 들어가는 경우도 따로 처리할 필요가 없다.

구간 수를 $n$ 이라 하면 시간은 $O(n)$ 이다.

# C) 맞닿은 구간

`[1, 2]` 와 `[2, 3]` 처럼 끝점이 맞닿은 구간을 겹친다고 볼지는 문제마다 다르다. 이 문제에서는 겹친다고 보고 합친다. 위 코드는 1 번 조건을 `intervals[i][1] < start` (등호 없음), 2 번 조건을 `intervals[i][0] <= end` (등호 있음) 로 써서 맞닿으면 2 번으로 간다.

```
intervals = [[1,2],[3,5]],  newInterval = [2,3]   →  [[1,5]]
```

경계 조건이 명시돼 있지 않으면 코드를 쓰기 전에 먼저 확인한다.

# D) 자주 하는 실수

- **튜플과 리스트를 섞어 반환하기.** 새 구간은 `(start, end)` 튜플로, 기존 구간은 리스트로 넣으면 결과에 두 타입이 섞인다. LeetCode 는 출력을 변환해 통과시키지만, 직접 테스트를 쓰면 `[(1, 5)] == [[1, 5]]` 가 `False` 라서 맞는 답을 틀렸다고 판정한다. 반환 타입 `list[list[int]]` 에 맞춰 리스트로 넣는다.
- **플래그 하나로 세 갈래를 처리하기.** "새 구간을 넣었나" 플래그를 두고 한 루프에서 세 경우를 모두 처리해도 정답이 나오지만, 분기가 얽혀 읽기 어렵다. 위처럼 루프를 셋으로 나누면 각 루프가 한 가지 일만 한다.

# E) 관련 문제

- [LeetCode 56. Merge Intervals](https://leetcode.com/problems/merge-intervals/): 정렬되지 않은 구간 목록을 합친다. 시작점으로 정렬한 뒤 같은 방식으로 훑는다.

# References

- [LeetCode 57. Insert Interval](https://leetcode.com/problems/insert-interval/)
