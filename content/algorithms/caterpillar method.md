---
title: "caterpillar method"
aliases: ["two pointers", "투 포인터", "sliding window"]
tags:
  - algorithm
---

# A) Caterpillar Method ?

배열이나 문자열 위에서 구간의 왼쪽 끝과 오른쪽 끝을 가리키는 포인터 두 개를 두고, 두 포인터를 각각 한 방향으로만 움직여 답을 찾는 방식이다. 구간이 늘었다 줄었다 하며 앞으로 나아가는 모습이 애벌레를 닮아서 붙은 이름이고, two pointers 나 sliding window 라고도 부른다.

# B) 왜 빠른가

길이 $n$ 배열에서 조건을 만족하는 구간을 찾을 때, 시작점과 끝점을 모두 시도하면 구간이 $O(n^2)$ 개다. 애벌레 방식은 두 포인터가 각각 배열을 한 번씩만 지나가므로 전체 이동 횟수가 $2n$ 을 넘지 않아 [[time complexity]] 가 $O(n)$ 이 된다.

이게 성립하려면 **오른쪽 끝을 늘렸을 때와 왼쪽 끝을 줄였을 때 구간의 성질이 한 방향으로만 변해야** 한다. 예를 들어 값이 모두 양수인 배열에서 구간 합은 오른쪽을 늘리면 항상 커지고 왼쪽을 줄이면 항상 작아진다. 그래서 "합이 목표보다 작으면 오른쪽을 늘리고, 크면 왼쪽을 당긴다" 는 규칙만으로 되돌아갈 필요 없이 전부 훑을 수 있다.

음수가 섞이면 이 단조성이 깨져서 애벌레 방식이 통하지 않고, 누적 합과 해시맵을 쓰는 다른 접근이 필요하다.

# C) 뼈대

```python
left = 0
total = 0
answer = 0
for right in range(n):
    total += arr[right]
    while total > target:      # 조건을 넘으면 왼쪽을 당긴다
        total -= arr[left]
        left += 1
    answer = max(answer, right - left + 1)
```

`left` 는 절대 뒤로 가지 않는다. 안쪽 `while` 이 있어도 `left` 의 총 이동량이 $n$ 이하이므로 전체가 $O(n)$ 이다.

# D) References
