---
title: "Deep Q-Network"
aliases: ["DQN"]
tags:
  - reinforcement_learning
  - deep_learning
---

# A) DQN

[[neural network|NN]] 을 활용한 [[Q-learning]] 알고리즘

DQN 은 state $s$ 가 주어졌을 때, action values 로 구성된 vector $Q(s, \cdot ; \boldsymbol{\theta})$ 를 반환하는 다중 레이어 신경망을 의미한다 (여기서 $\boldsymbol{\theta}$ 는 신경망의 parameter).

DQN 은 $n$ 차원 state space 를 $m$ 개의 actions 이 포함된 action space 로 mapping 한다.

**DQN 알고리즘의 중요한 요소 두 가지**

1. target network
2. experience replay

## A.1) Target Network

target 과 online network 를 따로 둔다. target network 는 parameter 를 고정시킨 신경망으로 online network 가 학습하기 위한 target Q-value 를 만들어낸다. 그리고 online network 는 이렇게 만들어낸 target Q-value 와 가까운 추정을 할 수 있도록 [[gradient descent]] 를 통해 parameter 를 업데이트한다.

그럼 target network 의 parameter 업데이트는 언제하는가? 일정 주기 (매 $\tau$ steps) 마다 online network 의 parameter 를 target network 의 parameter $\boldsymbol{\theta}^{-}$ 에 복사해준다: $\boldsymbol{\theta}_{t}^{-}=\boldsymbol{\theta}_{t}$.

target network 가 생성하는 target $Y_{t}^{\mathrm{DQN}}$ 은 다음과 같다.

$$
Y_{t}^{\mathrm{DQN}} \equiv R_{t+1}+\gamma \max _{a} Q\left(S_{t+1}, a ; \boldsymbol{\theta}_{t}^{-}\right)
$$

## A.2) Experience Replay

관찰된 transition 정보를 저장해놨다가 network 를 업데이트 하기위해, 저장된 곳에서 데이터를 uniformly sampled 해서 학습시킨다.

이렇게 하는 이유는 학습 알고리즘으로 사용하는 [[stochastic gradient descent|SGD]] 의 전제 조건이, 학습 데이터가 [[i.i.d.]] 를 만족한다는 가정이 깔려있기 때문이다. 그러나 transition 데이터 (observation sequence) 끼리는 높은 correlation 을 가진다.

## A.3) Loss Function

iteration $i$ 에서 Deep Q-Network $Q(s, a ; \theta)$ 의 loss function 은 다음과 같이 계산된다.

$$
L_{i}\left(\theta_{i}\right)=\mathbb{E}_{s, a, r, s^{\prime}}\left[\left(y_{i}^{D Q N}-Q\left(s, a ; \theta_{i}\right)\right)^{2}\right]
$$

$y_{i}^{D Q N}$ 는 다음과 같다 (target network 활용).

$$
y_{i}^{D Q N}=r+\gamma \max _{a^{\prime}} Q\left(s^{\prime}, a^{\prime} ; \theta^{-}\right)
$$

해당 loss function 에 대한 gradient update 는 다음과 같다.

$$
\nabla_{\theta_{i}} L_{i}\left(\theta_{i}\right)=\mathbb{E}_{s, a, r, s^{\prime}}\left[\left(y_{i}^{D Q N}-Q\left(s, a ; \theta_{i}\right)\right) \nabla_{\theta_{i}} Q\left(s, a ; \theta_{i}\right)\right]
$$

# B) Vs. DDQN

[[Deep Reinforcement Learning with Double Q-Learning|DDQN]] 과 DQN 의 차이점은 target value 를 계산하는 방식이 다르다는 점이다. 나머지는 동일하다. 즉, $y_{i}^{D Q N}$ 이 $y_{i}^{D D Q N}$ 로 대치된다.

$$
y_{i}^{D D Q N}=r+\gamma Q\left(s^{\prime}, \underset{a^{\prime}}{\arg \max } Q\left(s^{\prime}, a^{\prime} ; \theta_{i}\right) ; \theta^{-}\right)
$$

기존 DQN 에서는 target network 기준으로 가장 높은 Q-value 값에 해당하는 action $a'$ 을 취했지만, DDQN 은 online network 기준으로 action 을 정하고 그에 따른 evaluation 은 target network 가 수행하는 방식이다.

# C) References

* [[Dueling network architectures for deep reinforcement learning|dueling DQN]]
