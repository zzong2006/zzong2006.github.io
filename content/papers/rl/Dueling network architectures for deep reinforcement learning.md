---
title: "Dueling network architectures for deep reinforcement learning"
tags: reinforcement_learning paper_review ICML y2016
aliases: ["dueling DQN"]
---

# A) 한줄 요약

[[Deep Q-Network|DQN]] 의 출력부를 둘로 갈라, 상태의 가치 $V(s)$ 와 행동별 이점 $A(s,a)$ 를 따로 추정한 뒤 합쳐서 $Q(s,a)$ 를 만든다. 학습 알고리즘은 그대로 두고 신경망 구조만 바꾼 제안이다. Wang et al., ICML 2016.

# B) 문제의식

DQN 은 상태-행동 쌍마다 $Q(s,a)$ 를 따로 추정한다. 그런데 많은 상태에서는 **어떤 행동을 고르든 결과가 비슷하다.** 운전 게임에서 앞에 차가 없는 구간이라면 좌우 조작이 결과를 거의 바꾸지 않는다.

이런 상태에서 DQN 은 행동 수만큼의 값을 각각 학습해야 한다. 한 번의 갱신은 실제로 취한 행동 하나의 $Q$ 값만 건드리므로, "이 상태 자체가 좋다" 는 정보를 모든 행동에 퍼뜨리려면 행동마다 따로 겪어야 한다.

# C) 구조

합성곱 층까지는 공유하고, 그 뒤를 두 갈래로 나눈다.

```
        ┌── V(s)      : 스칼라 하나
공유 층 ┤
        └── A(s,a)    : 행동 수만큼
```

$V(s)$ 는 그 상태에 있는 것이 얼마나 좋은지, $A(s,a)$ 는 그 상태에서 행동 $a$ 가 평균보다 얼마나 나은지를 나타낸다.

합칠 때 그냥 $Q = V + A$ 로 두면 문제가 생긴다. $V$ 에 상수를 더하고 $A$ 에서 같은 상수를 빼도 $Q$ 가 같아서, 두 갈래가 무엇을 담당하는지 결정되지 않는다(identifiability 문제). 그래서 $A$ 의 평균을 빼준다.

$$
Q(s,a) = V(s) + \left(A(s,a) - \frac{1}{|\mathcal{A}|}\sum_{a'} A(s,a')\right)
$$

이렇게 두면 $A$ 의 평균이 0 으로 고정되어 분해가 하나로 정해진다. 논문은 최댓값을 빼는 방식도 검토했지만 평균 쪽이 학습이 안정적이었다고 보고한다.

# D) 왜 효과가 있나

$V$ 갈래는 어떤 행동을 취했든 매 갱신마다 학습된다. 한 번의 경험이 그 상태의 가치 추정 전체에 반영되므로, 행동 수가 많을수록 이득이 커진다.

Atari 벤치마크에서 특히 행동 가짓수가 많은 게임의 개선폭이 컸다. 학습 알고리즘을 바꾸지 않고 구조만 바꾼 것이라 [[Deep Reinforcement Learning with Double Q-Learning|Double DQN]], prioritized replay 같은 다른 개선과 그대로 겹쳐 쓸 수 있고, 이후 Rainbow 가 이 조합을 정리했다.

# E) References

* [\[1511.06581\] Dueling Network Architectures for Deep Reinforcement Learning](https://arxiv.org/abs/1511.06581)
