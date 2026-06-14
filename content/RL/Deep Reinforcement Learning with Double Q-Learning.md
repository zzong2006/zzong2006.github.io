---
tags: ["reinforcement_learning Google y2016 AAAI"]
aliases: ["DDQN"]
---

# Deep Reinforcement Learning with Double Q-Learning ?

Double [[Q-learning]] 알고리즘을 arbitrary function approximation 으로 일반화하는 Double DQN 알고리즘을 제안한다. 제안된 알고리즘은 기존 DQN 의 [[action-value function|q-value]] 에 대해서 overestimation 함으로써 성능에 안좋은 영향을 미치는 이슈를 해소시킬 수 있다.

# Background

## Q-Learning

policy $\pi$ 가 주어질 때, state $s$ 와 action $a$ 에 대한 true value 는 다음과 같다.  

$$
Q_{\pi}(s, a) \equiv \mathbb{E}\left[R_{1}+\gamma R_{2}+\ldots \mid S_{0}=s, A_{0}=a, \pi\right]
$$

optimal value 는 각 state 마다 가장 큰 valued action 을 선택함으로써 구해진다: $Q_{*}(s, a)=\max _{\pi} Q_{\pi}(s, a)$.

Q-Learning 을 통해 optimal [[action-value function]] 을 추정할 수 있는데, 문제는 action value 를 학습하기에 state 가 너무 많다는 문제점이 존재한다. 그래서 parameter 가 존재하는 value function 을 학습한다: $Q\left(s, a ; \theta_{t}\right)$.

$Q\left(s, a ; \theta_{t}\right)$ 를 사용하는 Q-Learning 에서는 state $S_t$ 에서 action $A_t$ 를 선택했을 때, 즉각적인 보상 $R_{t+1}$ 과 그 다음 state $S_{t+1}$ 이 나오고 아래처럼 parameter 를 업데이트 할 수 있다.  

$$
\boldsymbol{\theta}_{t+1}=\boldsymbol{\theta}_{t}+\alpha\left(Y_{t}^{\mathrm{Q}}-Q\left(S_{t}, A_{t} ; \boldsymbol{\theta}_{t}\right)\right) \nabla_{\boldsymbol{\theta}_{t}} Q\left(S_{t}, A_{t} ; \boldsymbol{\theta}_{t}\right)
$$

여기서 $\alpha$ 는 step size 를 의미하며, target $Y_{t}^{\mathrm{Q}}$ 값은 다음과 같이 정의한다.  

$$
Y_{t}^{\mathrm{Q}} \equiv R_{t+1}+\gamma \max _{a} Q\left(S_{t+1}, a ; \boldsymbol{\theta}_{t}\right)
$$

위와 같은 업데이트 방식은 [[stochastic gradient descent]] 방식과 유사하며, 현재 value $Q\left(S_{t}, A_{t} ; \boldsymbol{\theta}_{t}\right)$ 값을 target value $Y_{t}^{\mathrm{Q}}$ 에 가깝게 하도록 학습하는 것으로 생각할 수 있다.

## Deep Q Networks (DQN)

[[Deep Q-Network|DQN]] 참고

## Double Q-Learning

max operator 를 사용하는 기존 Q-Learning 과 DQN 은 action 을 평가하거나 선택하는데 있어서 동일한 value 값을 사용한다.

Q-Learning 의 target $Y_{t}^{Q}$ 에서 선택과 평가를 나누면 (untangle) 아래와 같다.  

$$
Y_{t}^{\mathrm{Q}}=R_{t+1}+\gamma Q\left(S_{t+1}, \underset{a}{\operatorname{argmax}} Q\left(S_{t+1}, a ; \boldsymbol{\theta}_{t}\right) ; \boldsymbol{\theta}_{t}\right)
$$

여기서 Double Q-Learning 은 다음과 같이 서로 다른 parameter 를 이용한다. 즉, value evaluation 과 action selection 에 서로 다른 policy 를 이용하는 것으로 생각할 수 있다.  

$$
Y_{t}^{\text {DoubleQ }} \equiv R_{t+1}+\gamma Q\left(S_{t+1}, \underset{a}{\operatorname{argmax}} Q\left(S_{t+1}, a ; \boldsymbol{\theta}_{t}\right) ; \boldsymbol{\theta}_{t}^{\prime}\right)
$$

실제 구현시에는 분리된 두 value function 이 상호 대칭적인 방식으로 학습하며, 서로 다른 데이터를 이용한다.

# Related

# References
