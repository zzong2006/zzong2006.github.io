---
title: "mean reciprocal rank"
tags: ["learning_to_rank", "metrics", "recommendation_system"]
aliases: ["MRR"]
---

# A) Mean Reciprocal Rank ?

MRR 은 가장 관련있는 첫 번째 아이템의 순위를 고려하는 성능 측정 방법

전체 사용자 집합 $U$ 에 대한 MRR 는 다음과 같이 계산됨

$$
\displaystyle\operatorname{MRR}(O,U)=\frac{1}{|U|}\sum_{u\in U}\frac{1}{k_{u}}
$$

주어진 query(User, $u$) 에 대해서 추천 결과를 생성하고, 관련있는 첫번째 추천 결과의 순위 $k_u$ 를 찾음 (순위는 1 부터 시작)

* Reciprocal Rank 는 $1/k_u$

# B) MRR 계산 예시

![|450](https://i.imgur.com/QO19V17.png)

# C) 장점 및 단점

## C.1) 장점

* 계산 및 해석이 간단함
* first relevant element 를 활용하는 측정 방식이므로, best item for query 와 같은 추천 방식에 가장 어울림

## C.2) 단점

* 하나의 관련있는 아이템만 활용하고 나머지 관련있는 아이템들은 무시함

# D) References
