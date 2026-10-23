---
title: "Mortal Multi-Armed Bandits"
tags:
  - bandit
  - contextual_bandit
  - paper_review
  - y2008
  - NIPS
aliases: [Mortal MAB, Mortal Multi Armed Bandit (2008)]
---

# A) Mortal Multi-Armed Bandits ?

일반적인 [[Multi-Armed Bandit]] 은 arm 이 사라지지 않는다고 가정한다. Mortal MAB 는 arm 마다 수명이 있어서 일정 시점이 지나면 arm 이 죽고 (더 이상 당길 수 없고), 새 arm 이 계속 들어오는 상황을 다룬다. 광고나 뉴스처럼 후보가 계속 바뀌는 추천 문제가 이 설정에 해당한다.

Reward 는 클릭 여부처럼 0 또는 1 인 binary 값으로 본다.

# B) Arm 의 죽음을 모델링하는 방법

| 방식 | arm 이 죽는 시점 |
| --- | --- |
| Budgeted death | arm 을 $k$ 번 당기면 죽는다 |
| Timed death | 처음 등장하고 $k$ 시간이 지나면 죽는다 |

Budgeted death 에서 한 번 당길 때마다 죽을 확률을 $p$ 로 두면, 몇 번 당긴 뒤에 죽는지는 geometric distribution 을 따른다.

# C) Reward 를 모델링하는 방법

arm 의 평균 reward 는 시간이 지나도 바뀌지 않는다 (stationary) 고 가정하고, 각 arm 의 평균 reward 가 뽑혀 나오는 분포는 알고 있다고 가정한다.

* **State-aware**: reward 가 deterministic 하다. arm 을 한 번만 당겨보면 그 arm 의 reward 를 바로 알 수 있다.
* **State-oblivious**: 당길 때마다 reward 가 확률적으로 새로 나온다. 한 번 당겨서는 arm 의 평균 reward 를 알 수 없다.

# D) 논문의 핵심

arm 이 계속 죽고 새로 생기기 때문에, 탐색 (explore) 을 멈추지 않고 새 arm 을 계속 시도해야 한다. 동시에 좋은 arm 을 찾았다면 그 arm 이 죽기 전에 충분히 활용해야 한다.

그래서 논문의 질문은 다음 두 가지로 정리된다.

1. 충분히 좋은 평균 reward $\mu^*$ 를 가진 arm 을 어떻게 찾을 것인가
2. 찾은 뒤에는 그 arm 이 죽을 때까지 당긴다

비교 baseline 으로 UCB1 $K/C$ 가 등장한다.

# E) References

* 논문: [Mortal Multi-Armed Bandits (NIPS 2008)](https://papers.nips.cc/paper/2008/file/788d986905533aba051261497ecffcbb-Paper.pdf)
* 카카오 추천팀 발표: https://www.youtube.com/watch?v=KuAmR8aA1oc&ab_channel=Recotechkakao
