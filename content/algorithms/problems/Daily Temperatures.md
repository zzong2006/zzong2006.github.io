---
title: "Daily Temperatures"
aliases: ["LeetCode 739", "일일 온도"]
tags:
  - algorithm
  - stack
  - leetcode
---

# A) 문제

[LeetCode 739. Daily Temperatures](https://leetcode.com/problems/daily-temperatures/). 날짜별 온도 배열 `temperatures` 가 주어지면, 각 날짜마다 **더 따뜻한 날이 오기까지 며칠을 기다려야 하는지**를 담은 배열을 반환한다. 더 따뜻한 날이 없으면 0 이다.

```
temperatures = [73,74,75,71,69,72,76,73]
answer       = [ 1, 1, 4, 2, 1, 1, 0, 0]
```

배열 길이 `n` 은 최대 $10^5$ 이다.

# B) 브루트포스와 그 낭비

각 날짜에서 오른쪽으로 훑으며 처음으로 더 높은 온도를 찾으면 된다. 최악의 경우 (온도가 계속 내려가는 입력) $O(n^2)$ 이라 시간 초과가 난다.

낭비가 생기는 곳은 이렇다. `[75, 71, 69, 72]` 에서 75, 71, 69 는 각자 따로 오른쪽을 훑지만, 71 과 69 는 결국 같은 날 (72) 을 기다리고 있다. 같은 구간을 여러 번 다시 보는 것이다.

# C) 풀이: 단조 스택

관점을 뒤집는다. "각 날이 자기 답을 찾으러 간다" 가 아니라 **"오늘 온도가 과거의 어떤 날들에게 답이 되어 준다"** 로 본다. 왼쪽에서 오른쪽으로 한 번만 훑으면서, 아직 답을 못 찾은 날들의 인덱스를 [[stack]] 에 쌓아 둔다.

```python
class Solution:
    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:
        answer = [0] * len(temperatures)
        stack = []  # 아직 더 따뜻한 날을 못 찾은 날의 인덱스
        for today, temp in enumerate(temperatures):
            while stack and temp > temperatures[stack[-1]]:
                prev = stack.pop()
                answer[prev] = today - prev
            stack.append(today)
        return answer
```

- 스택에 온도가 아니라 **인덱스**를 넣는다. 답이 "며칠 뒤" 이므로 인덱스 차이가 필요하고, 온도는 `temperatures[인덱스]` 로 언제든 꺼낼 수 있다.
- `answer` 를 0 으로 채워 시작하면, 끝까지 스택에 남은 날 (더 따뜻한 날이 없는 날) 은 따로 처리하지 않아도 된다.

## C.1) 따라가 보기

| 오늘 | 온도 | 하는 일 | 스택 (인덱스:온도) | 정해진 답 |
| --- | --- | --- | --- | --- |
| 0 | 73 | 스택이 비어 있어 넣는다 | `0:73` | |
| 1 | 74 | 74 > 73, 0 번을 꺼낸다 | `1:74` | `ans[0]=1` |
| 2 | 75 | 75 > 74, 1 번을 꺼낸다 | `2:75` | `ans[1]=1` |
| 3 | 71 | 71 < 75, 넣기만 한다 | `2:75, 3:71` | |
| 4 | 69 | 69 < 71, 넣기만 한다 | `2:75, 3:71, 4:69` | |
| 5 | 72 | 4 번, 3 번을 꺼내고 75 앞에서 멈춘다 | `2:75, 5:72` | `ans[4]=1`, `ans[3]=2` |
| 6 | 76 | 5 번, 2 번을 꺼낸다 | `6:76` | `ans[5]=1`, `ans[2]=4` |
| 7 | 73 | 73 < 76, 넣기만 한다 | `6:76, 7:73` | |

끝까지 남은 6 번과 7 번은 답이 0 이다.

## C.2) 왜 "단조" 스택인가

스택 안의 온도는 아래에서 위로 갈수록 **항상 같거나 낮다**. 더 높은 온도가 들어오면 그보다 낮은 것들이 전부 빠진 뒤에 들어가기 때문이다.

이 성질 덕분에 맨 위만 확인하면 된다. 맨 위가 오늘보다 높거나 같으면, 그 아래는 맨 위와 같거나 더 높으므로 볼 필요가 없다. 그래서 `while` 은 맨 위가 오늘보다 낮은 동안만 돈다.

# D) 시간 복잡도가 $O(n)$ 인 이유

`for` 안에 `while` 이 있어서 $O(n^2)$ 처럼 보이지만 실제로는 $O(n)$ 이다.

`while` 한 번이 도는 횟수만 보면 날마다 제각각이다. 위 표에서 5 일과 6 일에는 두 번씩 돌았고, 다른 날에는 한 번 또는 0 번이었다. 최악의 날 하나만 보면 $O(n)$ 번 돌 수도 있다 (온도가 계속 내려가다 마지막에 가장 높은 온도가 오는 경우).

그런데 **전체를 통틀어** 세면 이야기가 달라진다.

- 각 인덱스는 스택에 **정확히 한 번** 들어간다 (`append` 는 날마다 한 번).
- 각 인덱스는 스택에서 **최대 한 번** 나온다 (한 번 나온 인덱스는 다시 들어오지 않는다).

`while` 이 한 번 돌 때마다 `pop` 이 한 번 일어나므로, `while` 의 전체 반복 횟수는 `pop` 의 전체 횟수와 같고, 그것은 `push` 횟수인 $n$ 을 넘을 수 없다. 따라서 `for` 의 $n$ 번과 `while` 의 총 $n$ 번 이하를 더해 $O(n)$ 이다.

이렇게 연산 하나하나의 최악이 아니라 **연산 전체의 총 비용을 연산 수로 나눠** 따지는 방식이 [[amortized analysis]] 다. 어떤 날에는 비싼 정리를 하지만, 그 비용은 앞에서 쌓아 둔 `push` 들이 미리 치른 것이라고 볼 수 있다.

공간은 스택과 답 배열 모두 최대 $n$ 이라 $O(n)$ 이다.

# E) 같은 틀을 쓰는 문제

"각 원소의 **다음으로 큰 (또는 작은) 원소**" 를 찾는 문제는 거의 전부 이 틀이다.

- [LeetCode 496. Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/)
- [LeetCode 503. Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii/): 배열이 원형이라 두 바퀴 훑는다.
- [LeetCode 84. Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/): 다음으로 **작은** 원소를 찾으므로 스택이 위로 갈수록 높아지는 방향이다.

방향을 정하는 기준은 하나다. 찾는 것이 "다음으로 큰 원소" 면 스택은 위로 갈수록 낮아지고, "다음으로 작은 원소" 면 위로 갈수록 높아진다.

# References

- [LeetCode 739. Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)
