---
tags: ["recommendation_system"]
---

# A) Anti-Monotone Property ?

이것은 어떤 itemset 이 frequent 하지 않으면, 해당 itemset 을 포함하는 모든 superset(초집합) 도 frequent 하지 않다 (infrequent) 는 특성을 의미한다.

예를 들어 {사과, 바나나}같은 itemset 이 frequent 하지 않다고 가정하면, {사과, 바나나, 수박}과 같은 패턴 역시 frequent 하지 않다.

# B) Why?

$I$ 에 존재하는 $n$ 개의 item 들에 대한 frequent itemset 을 찾는 것은 $2^n-1$ 개의 경우의 수를 고려해야 한다 (empty set 제외).

frequent itemset 을 찾는 것 = 최소 [[support]] 값 이상을 가지는 transaction 을 찾는 것

* 이러한 많은 경우의 수를 효율적으로 고려하기 위해서 [[support]] 값의 downward-closure 속성을 활용한다.
	* downward-closure 속성은 [[Anti-Monotone property]] 라고 부른다.

# C) Related

# D) References
