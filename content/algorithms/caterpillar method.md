---
title: "Caterpillar Method"
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

# D) 무효 조건을 한 문장으로 정하기

"조건을 만족하는 가장 긴 (짧은) 연속 구간" 문제는 거의 같은 뼈대로 풀린다. 문제마다 바뀌는 것은 **"윈도우가 언제 무효인가"** 한 줄뿐이다. 그래서 풀이의 대부분은 이 조건을 한 문장으로 정의하는 일이다.

## D.1) 예제: Longest Repeating Character Replacement

[LeetCode 424](https://leetcode.com/problems/longest-repeating-character-replacement/). 대문자 문자열 `s` 에서 글자를 최대 `k` 번 바꿀 수 있을 때, 같은 글자로만 이뤄진 가장 긴 부분 문자열의 길이를 구한다.

윈도우 안에서 가장 많은 글자를 남기고 나머지를 전부 바꾸는 것이 최선이다. 그래서 무효 조건은 이렇다.

> 윈도우 길이 − 윈도우 안 최다 글자 수 > `k`

글자 종류가 몇 개인지는 상관없다. `"ABC"`, `k = 2` 면 B 와 C 를 바꿔 길이 3 이 된다.

```python
from collections import Counter

class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        count = Counter()
        left = 0
        best = 0
        for right, ch in enumerate(s):
            count[ch] += 1
            while (right - left + 1) - max(count.values()) > k:
                count[s[left]] -= 1
                left += 1
            best = max(best, right - left + 1)
        return best
```

`max(count.values())` 는 대문자 26 개만 보므로 상수 시간이고, 전체는 $O(n)$ 이다.

## D.2) `while` 대신 `if` 로도 되는 이유

이 문제에서는 `while` 을 `if` 로 바꿔도 답이 같다.

```python
if (right - left + 1) - max(count.values()) > k:
    count[s[left]] -= 1
    left += 1
else:
    best = max(best, right - left + 1)
```

`right` 는 한 번에 한 칸만 늘어난다. 윈도우가 무효가 됐을 때 `left` 를 한 칸 당기면 길이가 직전과 같아진다. 그래서 윈도우는 **줄어들지 않고, 유효하면 한 칸 커지고, 무효면 같은 크기로 옆으로 미끄러진다**. 미끄러지는 동안 윈도우가 무효일 수 있지만, 그 길이는 이미 `best` 에 기록된 값이고 찾는 것은 그보다 긴 유효 윈도우뿐이므로 상관없다.

이 요령은 가장 **긴** 구간을 구할 때만 통한다. 가장 **짧은** 구간 ([LeetCode 209](https://leetcode.com/problems/minimum-size-subarray-sum/)) 은 조건을 만족하는 동안 `left` 를 계속 당기며 길이를 갱신해야 하므로 `while` 이 필요하다. 헷갈리면 `while` 로 쓴다. `while` 은 어느 쪽에서든 맞고, 윈도우가 항상 유효 상태라 설명하기도 쉽다.

# E) 크기가 고정된 윈도우

[LeetCode 567. Permutation in String](https://leetcode.com/problems/permutation-in-string/). `s2` 안에 `s1` 의 순열이 연속으로 들어 있는지 묻는다. 순열은 글자 구성이 같다는 뜻이므로, 길이 `len(s1)` 짜리 윈도우를 한 칸씩 밀며 글자 수를 비교한다.

```python
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        m = len(s1)
        if m > len(s2):
            return False
        need, have = [0] * 26, [0] * 26
        for ch in s1:
            need[ord(ch) - ord('a')] += 1
        for right, ch in enumerate(s2):
            have[ord(ch) - ord('a')] += 1
            if right >= m:                                # 윈도우를 넘친 왼쪽 글자를 뺀다
                have[ord(s2[right - m]) - ord('a')] -= 1
            if have == need:
                return True
        return False
```

비교 한 번이 $O(26)$ 이라 전체 $O(n)$ 이다. 비교를 $O(1)$ 로 줄이려면, 개수가 일치하는 글자 종류 수를 변수 하나로 들고 다니며 글자가 들어오고 나갈 때마다 그 값만 갱신한다. [LeetCode 76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) 의 핵심도 이 기법이다.

## E.1) `Counter` 로 비교할 때 남는 0

길이 26 리스트 대신 `Counter` 로 세면, 윈도우에서 빠진 글자가 0 으로 남는다. `{'a': 0, 'b': 1}` 과 `{'b': 1}` 을 비교하게 되는 것이다. Python 3.10 부터는 `Counter` 끼리 비교할 때 없는 키를 0 으로 쳐서 같다고 판정하지만, 3.9 이하에서는 dict 비교라 다르다고 나온다. 버전에 기대지 않으려면 0 이 된 키를 지우거나, 위처럼 리스트로 센다.

# F) 자주 하는 실수

- **재귀 완전 탐색으로 시작하기.** "양끝을 하나씩 줄여 보며 유효한 구간 찾기" 를 재귀로 쓰면 갈래가 매번 둘로 나뉘어 $O(2^n)$ 이다. 같은 `(left, right)` 를 수없이 다시 보므로 메모이제이션을 해도 $O(n^2)$ 이다. 문제에 "연속된 부분 배열 (문자열) 중 가장 긴 (짧은) 것" 이 나오면 슬라이딩 윈도우부터 떠올린다.
- **무효 조건을 좁게 잡기.** 424 를 "글자가 정확히 두 종류이고 적은 쪽이 `k` 이하" 로 정의하면, 세 종류 이상이 섞여도 유효한 경우를 놓친다. 조건을 한 문장으로 정한 뒤 반례 한두 개로 확인한다.
- **이전 루프 변수를 빌려 쓰기.** 고정 윈도우에서 왼쪽 인덱스를 `j - i - 1` 처럼 앞 루프의 `i` 에 기대 계산하면 읽는 사람이 한 번 계산해 봐야 한다. `m = len(s1)` 을 두고 `right - m` 으로 쓴다.
