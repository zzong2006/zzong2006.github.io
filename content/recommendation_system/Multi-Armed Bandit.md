---
title: "Multi-Armed Bandit"
aliases: [MAB]
tags:
  - MAB
  - reinforcement_learning
---

# A) 정의

Multi-armed Bandit 은 어떤 슬롯머신이 어떤 수익률을 가지는지 모를 때, 탐색 (Exploration) 과 활용 (Exploitation) 을 적절히 사용하여 최적의 수익을 찾아내고자 하는 [[Reinforcement Learning]] 알고리즘을 의미한다.

## A.1) 수학적 정의

time step $t$ 의 state $\theta_t$ 에서, time step $t$ 에서의 각 arm $i$ 의 시행 횟수 $\gamma_i$ 와 총 보상 $\alpha_i$ 가 있다고 가정하자. 이 가정에서 MAB 의 전략은 $\theta_t$ 가 주어졌을 때, $t+1$ 에 선택할 item 을 고르는 함수 $\pi$ (policy) 를 만드는 것

$\pi$ 는 deterministic 하거나 stochastic 한 함수로 정의되며, $\pi$ 에 대한 평가는 $T$ 시행 동안 누적된 보상 (returns) 으로 결정함
또한, 시간 $t$ 에 선택한 arm 에 대한 보상만 알 수 있음 (i.e. 선택하지 않은 arm 의 보상은 알 수 없음)

# B) 추천 시스템에서의 MAB

[[Recommendation System]] 에서는 서로 다른 반응률이 존재하는 여러 콘텐츠가 있고, 정해진 횟수만큼 콘텐츠를 추천 결과에 노출해볼 수 있을 때, 어떤 순서로 콘텐츠를 노출해야 가장 클릭을 많이 받을 수 있을지 찾는 문제로 변환한다.

또한, 사용자 반응을 고려하지 않는 앙상블 기법의 문제를 해결하기 위해 MAB 기술을 사용한다.

# C) General RL vs. MAB

MAB 는 one-step RL 이다. 일반적인 RL 은 multi-step RL 으로, agent 가 offline 에서 충분히 학습하고 online 에 policy 가 배포되는 형식이다. 그러나 MAB 는 online 에서 학습과 배포를 동시에 진행한다.

MAB 는 agent 가 취한 action 이 시스템 (또는 환경) 의 state 에 영향을 끼치지 않는다는 가정을 한다. 그래서 agent 는 state transition, 과거 actions 에 대한 credit reward, 또는 미래의 reward-rich states 에 대한 모델링을 수행하지 않는다.

# D) Related

* [[epsilon-greedy algorithm]]

# E) References
