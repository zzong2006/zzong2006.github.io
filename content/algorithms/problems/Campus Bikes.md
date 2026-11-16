---
title: "Campus Bikes"
aliases: ["LeetCode 1057"]
tags:
  - algorithm
  - greedy
  - sorting
  - leetcode
---

# A) 문제

[LeetCode 1057. Campus Bikes](https://leetcode.com/problems/campus-bikes/). 2 차원 격자 위에 작업자 n 명과 자전거 m 대가 있다 (n ≤ m). 아직 짝이 없는 작업자와 자전거 중 거리가 가장 가까운 쌍을 골라 짝짓는다. 모든 작업자가 자전거를 받을 때까지 이를 반복한다. 거리가 같으면 작업자 번호가 작은 쌍을, 그것도 같으면 자전거 번호가 작은 쌍을 먼저 짝짓는다. 작업자 i 가 받은 자전거 번호를 `answer[i]` 에 담아 반환한다.

거리는 맨해튼 거리 |x1 − x2| + |y1 − y2| 다. 격자 위를 가로·세로로만 움직일 때의 거리다.

```
workers = [[0,0],[2,1]],  bikes = [[1,2],[3,3]]   →  [1,0]
workers = [[0,0],[1,1],[2,0]],  bikes = [[1,0],[2,2],[2,1]]   →  [0,2,1]
```

구직자와 가게, 승객과 택시처럼 이름만 바꿔 같은 규칙으로 나오기도 한다.

# B) 작업자 순서대로 고르면 틀린다

처음 떠오르는 방법은 작업자 0 부터 차례로 가장 가까운 자전거를 주는 것이다. 첫 예시의 거리는 다음과 같다.

| | 자전거 0 | 자전거 1 |
| --- | --- | --- |
| 작업자 0 | 3 | 6 |
| 작업자 1 | 2 | 3 |

- 작업자 순서대로 고르면 작업자 0 이 자전거 0 (거리 3) 을 먼저 가져간다. 작업자 1 은 남은 자전거 1 을 받아 답이 `[0, 1]` 이 된다.
- 문제의 규칙은 전체에서 가장 가까운 쌍부터 짝짓는 것이다. 가장 가까운 쌍은 작업자 1 과 자전거 0 (거리 2) 이다. 이 쌍을 먼저 짝지으면 작업자 0 에게는 자전거 1 만 남아 답이 `[1, 0]` 이다.

**작업자 한 명에게 가장 가까운 자전거가 아니라, 남은 쌍 전체에서 가장 가까운 쌍을 고른다.**

# C) 모든 쌍을 정렬하고 위에서부터 짝짓기

모든 (작업자, 자전거) 쌍의 거리를 구해 한 줄로 세우고, 가까운 쌍부터 내려가며 짝짓는다. 둘 중 하나라도 이미 짝이 있으면 건너뛴다.

첫 예시를 거리순으로 세우면 다음과 같다.

| 거리 | 쌍 | 처리 |
| --- | --- | --- |
| 2 | 작업자 1 · 자전거 0 | 짝짓는다 |
| 3 | 작업자 0 · 자전거 0 | 건너뛴다. 자전거 0 은 이미 짝이 있다 |
| 3 | 작업자 1 · 자전거 1 | 건너뛴다. 작업자 1 은 이미 짝이 있다 |
| 6 | 작업자 0 · 자전거 1 | 짝짓는다 |

**거리가 같을 때의 규칙은 정렬 기준에 그대로 넣는다.**

- (거리, 작업자 번호, 자전거 번호) 튜플로 정렬하면 거리가 같은 쌍은 작업자 번호순, 그다음 자전거 번호순으로 놓인다.
- 그래서 거리가 같은 쌍을 따로 묶어 처리할 필요가 없다. 정렬된 순서대로 한 쌍씩 보면 된다.
- 위 표의 거리 3 인 두 쌍이 그렇다. 순서대로 보면 앞에서 이미 짝이 정해져 둘 다 건너뛴다.

```python
class Solution:
    def assignBikes(self, workers: list[list[int]], bikes: list[list[int]]) -> list[int]:
        pairs = sorted(
            (abs(wx - bx) + abs(wy - by), i, j)
            for i, (wx, wy) in enumerate(workers)
            for j, (bx, by) in enumerate(bikes)
        )
        answer = [-1] * len(workers)
        used = set()            # 이미 짝이 있는 자전거
        assigned = 0
        for _, i, j in pairs:
            if answer[i] == -1 and j not in used:
                answer[i] = j
                used.add(j)
                assigned += 1
                if assigned == len(workers):
                    break
        return answer
```

작업자에게 짝이 있는지는 `answer[i] == -1` 로, 자전거는 `used` 로 확인한다. 쌍이 n × m 개라 정렬에 O(nm log nm) 이 든다.

# D) 정렬 없이 거리별로 담기

LeetCode 의 제약에서는 좌표가 0 이상 1000 미만이라 거리가 최대 1998 이다. 거리가 이렇게 작은 정수면 정렬하지 않고 거리마다 바구니를 두어 쌍을 담을 수 있다 (bucket sort).

- 작업자 번호, 자전거 번호 순서로 이중 루프를 돌며 담으면 바구니 안의 쌍은 이미 (작업자 번호, 자전거 번호) 순서다.
- 그래서 거리 0 바구니부터 차례로 꺼내기만 하면 튜플로 정렬한 것과 같은 순서가 된다.

```python
class Solution:
    def assignBikes(self, workers: list[list[int]], bikes: list[list[int]]) -> list[int]:
        buckets = [[] for _ in range(1999)]
        for i, (wx, wy) in enumerate(workers):
            for j, (bx, by) in enumerate(bikes):
                buckets[abs(wx - bx) + abs(wy - by)].append((i, j))
        answer = [-1] * len(workers)
        used = set()
        for bucket in buckets:
            for i, j in bucket:
                if answer[i] == -1 and j not in used:
                    answer[i] = j
                    used.add(j)
        return answer
```

최대 거리를 D 라 하면 시간은 O(nm + D) 다.

# E) 거리 합을 최소화하는 문제와의 차이

이 문제의 답은 거리 합이 가장 작은 배정이 아니다.

- 첫 예시에서 규칙대로 짝지은 `[1, 0]` 은 거리 합이 2 + 6 = 8 이다.
- 작업자 순서대로 고른 `[0, 1]` 은 3 + 3 = 6 으로 더 작다.

**가까운 쌍부터 짝짓는다는 규칙이 곧 답의 정의다. 전체 거리 합을 줄이는 방법이 아니다.**

- 문제가 절차를 정해 주므로 최적성을 따지지 않고 규칙을 그대로 구현하면 된다 ([[greedy algorithm]]).
- 거리 합을 최소화하라는 [LeetCode 1066. Campus Bikes II](https://leetcode.com/problems/campus-bikes-ii/) 는 greedy 로 풀리지 않는다. 작업자와 자전거가 10 개 이하라서, 어떤 자전거를 이미 썼는지를 비트마스크로 기억하는 동적 계획법으로 푼다.

# References

- [LeetCode 1057. Campus Bikes](https://leetcode.com/problems/campus-bikes/)
- [LeetCode 1066. Campus Bikes II](https://leetcode.com/problems/campus-bikes-ii/)
