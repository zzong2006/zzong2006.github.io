---
title: "Permutations"
aliases: ["순열 생성", "LeetCode 46"]
tags:
  - algorithm
  - backtracking
  - leetcode
---

# A) 문제

[LeetCode 46. Permutations](https://leetcode.com/problems/permutations/). 서로 다른 정수가 담긴 배열 `nums` 가 주어지면 가능한 **순열을 모두** 반환한다. 제약은 `1 ≤ len(nums) ≤ 6` 이다.

순열은 원소를 하나씩 모두 써서 한 줄로 늘어놓는 방법 하나하나를 말한다. `nums = [1, 2, 3]` 이면 답은 여섯 개다.

```
[1,2,3]  [1,3,2]  [2,1,3]  [2,3,1]  [3,1,2]  [3,2,1]
```

# B) 풀이: 한 자리씩 채우는 백트래킹

손으로 순열을 쓸 때를 떠올리면 풀이가 나온다. 첫 자리에 1 을 놓고 남은 `[2, 3]` 으로 나머지 자리를 채우고, 다음엔 첫 자리에 2 를 놓고 남은 `[1, 3]` 으로 채운다. "남은 숫자로 나머지 자리를 채우기" 는 원래 문제와 모양이 같고 크기만 작으므로 재귀로 풀 수 있다.

이렇게 선택을 하나 해서 다음 단계로 내려가고, 할 일을 마치면 돌아와서 다른 선택을 해 보는 탐색을 백트래킹(backtracking)이라고 한다. [[Generate Parentheses]] 와 같은 틀이다.

재귀 함수가 들고 다니는 정보는 두 가지다.

- `curr`: 지금까지 채운 순열 (예: `[2]`)
- `is_used`: 각 숫자를 이미 썼는지 표시하는 boolean 배열. 길이는 `nums` 와 같다.

`curr` 의 길이가 `len(nums)` 가 되면 순열 하나가 완성된 것이므로 결과에 넣고 돌아간다.

```python
class Solution:
    def generate(self, nums, is_used, result, curr):
        if len(curr) == len(nums):
            result.append(curr)
            return

        for i in range(len(nums)):
            if not is_used[i]:
                is_used[i] = True
                self.generate(nums, is_used, result, curr + [nums[i]])
                is_used[i] = False

    def permute(self, nums: list[int]) -> list[list[int]]:
        answer = []
        is_used = [False] * len(nums)
        self.generate(nums, is_used, answer, [])
        return answer
```

`[1, 2, 3]` 으로 만든 탐색 트리는 다음과 같다. 깊이가 하나 내려갈 때마다 아직 안 쓴 숫자 중 하나를 붙인다.

```
[]
├─ [1]
│  ├─ [1,2] ─ [1,2,3]
│  └─ [1,3] ─ [1,3,2]
├─ [2]
│  ├─ [2,1] ─ [2,1,3]
│  └─ [2,3] ─ [2,3,1]
└─ [3]
   ├─ [3,1] ─ [3,1,2]
   └─ [3,2] ─ [3,2,1]
```

맨 아래 줄(잎)이 답 여섯 개다. 첫 자리 선택지가 3 개, 둘째 자리가 2 개, 셋째 자리가 1 개라서 잎은 $3 \times 2 \times 1 = 3! = 6$ 개다.

# C) 두 변수의 되돌리기 방식이 다르다

위 코드에서 재귀에서 돌아온 뒤 되돌리는 것은 `is_used[i] = False` 하나뿐이다. `curr` 는 되돌리지 않는다. 두 변수가 재귀 호출 사이에서 다르게 전달되기 때문이다.

## C.1) `curr` 는 호출마다 새 리스트다

`curr + [nums[i]]` 는 기존 `curr` 를 고치지 않고 숫자 하나를 붙인 **새 리스트** 를 만든다. 그래서 각 호출은 자기 몫의 `curr` 를 따로 가진다. 자식 호출이 무엇을 하든 부모의 `curr` 는 그대로이므로 되돌릴 것이 없다.

완성된 `curr` 를 복사 없이 `result.append(curr)` 해도 되는 것도 같은 이유다. 이 리스트를 나중에 고치는 코드가 없으니 결과 안의 값이 바뀌지 않는다.

## C.2) `is_used` 는 모든 호출이 같은 리스트를 쓴다

`is_used` 는 `permute` 에서 한 번 만들어 모든 재귀 호출에 같은 객체로 넘긴다. 어느 호출에서 고쳐도 나머지 모든 호출에 보인다.

그래도 `is_used[i] = False` 가 안쪽 호출을 망가뜨리지 않는 것은, 그 줄이 실행될 때 안쪽 호출이 이미 모두 끝나 있기 때문이다. 함수 호출은 안에서 이어지는 재귀가 전부 return 될 때까지 기다렸다가 다음 줄로 넘어간다.

깊이 0 에서 `1` 을 골랐을 때 `is_used` 가 어떻게 바뀌는지 따라가면 다음과 같다. 깊이는 재귀가 몇 번 중첩됐는지를 뜻한다.

```
깊이 0: 1 고름            [T, F, F]
  깊이 1: 2 고름          [T, T, F]
    깊이 2: 3 고름        [T, T, T]  → 깊이 3 에서 [1,2,3] 완성
    깊이 2: 3 되돌림      [T, T, F]
  깊이 1: 2 되돌림        [T, F, F]
  깊이 1: 3 고름          [T, F, T]  → ... [1,3,2] 완성
  깊이 1: 3 되돌림        [T, F, F]
깊이 0: 1 되돌림          [F, F, F]
깊이 0: 2 고름            [F, T, F]
```

각 호출이 끝날 때 `is_used` 는 그 호출이 시작될 때와 같은 상태로 돌아와 있다. 깊이 1 은 `[T, F, F]` 를 받아 시작했고 끝날 때도 `[T, F, F]` 다. 그래서 깊이 0 이 보기에는 자기가 바꾼 `is_used[0]` 하나만 남아 있고, 그것을 `False` 로 돌리면 원래 상태가 된다.

반대로 `is_used[i] = False` 를 빠뜨리면 다른 가지가 영향을 받는다. 깊이 0 에서 `1` 을 쓰고 돌아와 되돌리지 않으면, 다음 가지에서 `2` 를 첫 자리에 놓았을 때 `1` 이 여전히 사용됨으로 남아 `[2, 1, 3]` 을 만들 수 없다.

| | `curr` | `is_used` |
| --- | --- | --- |
| 전달 방식 | 호출마다 새 리스트 (`curr + [x]`) | 모든 호출이 같은 리스트 |
| 돌아온 뒤 되돌리기 | 필요 없음 | 반드시 필요 |

`curr` 도 `is_used` 처럼 하나의 리스트를 계속 고쳐 쓸 수 있다. 그때는 `curr.append(nums[i])` 로 붙이고 돌아온 뒤 `curr.pop()` 으로 빼야 하며, 결과에 넣을 때는 `curr[:]` 처럼 복사본을 넣어야 한다. 복사하지 않으면 이후의 `pop()` 이 결과 안의 리스트까지 비워서 답이 전부 빈 리스트가 된다.

# D) 처음에 답이 하나만 나온 이유

처음 작성한 코드는 반복문 안에서 재귀 호출을 `return` 하고 있었다.

```python
for i in range(len(nums)):
    if not is_used[i]:
        result.append(nums[i])
        is_used[i] = True
        return self.generate(nums, is_used, result)
```

`return` 을 만나면 함수가 바로 끝나므로 반복문이 다음 `i` 로 넘어가지 못한다. 매 단계에서 아직 안 쓴 숫자 중 첫 번째만 고르게 되어 `[1, 2, 3]` 하나만 만들어졌다. 탐색 트리로 보면 맨 왼쪽 가지 하나만 내려간 것이다.

이 코드에는 문제가 두 가지 더 있었다.

1. 돌아온 뒤 되돌리기가 없었다. `return` 을 지워도 `result` 에 숫자가 계속 쌓이고 `is_used` 가 모두 `True` 로 남는다.
2. 만들고 있는 순열과 완성된 순열 모음을 같은 변수 `result` 하나로 썼다. 반환값은 순열들의 리스트이므로 둘을 나눠야 한다.

# E) 시간 복잡도

순열은 $n!$ 개이고, 순열 하나를 리스트로 만드는 데 길이 $n$ 만큼 걸리므로 전체는 $O(n \cdot n!)$ 이다. 답을 모두 반환해야 하는 문제라서 이보다 빠를 수는 없다. `n ≤ 6` 이면 순열이 720 개라 충분히 빠르다. [[time complexity]] 표기는 해당 노트 참고.

# References

- [LeetCode 46. Permutations](https://leetcode.com/problems/permutations/)
