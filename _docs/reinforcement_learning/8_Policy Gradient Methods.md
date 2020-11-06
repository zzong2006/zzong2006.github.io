---
layout: default
title:  "Policy Gradient Methods"
category: Reinforcement Learning
order: 8
---

action-value function은 action 선택에 더 이상 활용되지 않음

* 다만 policy parameter vector $\boldsymbol{\theta} \in \mathbb{R}^{d^{\prime}}$를 학습하는데 사용될수는 있음

$$
\pi(a \mid s, \boldsymbol{\theta})=\operatorname{Pr}\left\{A_{t}=a \mid S_{t}=s, \boldsymbol{\theta}_{t}=\boldsymbol{\theta}\right\}
$$

* 시간 $t$ 의 state $s$에 위치하는 agent $s$가 parameter $\boldsymbol{\theta}$ 를 통해 $a$를 선택할 확률을 의미
* $a$를 선택할 때, 학습된 value function $\hat{v}(s, \mathbf{w})$을 사용한다면, weight vector는  $\mathbf{w} \in \mathbb{R}^{d}$ 가 됨

Policy parameter는 performance $J(\boldsymbol{\theta})$ 를 최대화하는 방향으로 나아간다.

$$
\boldsymbol{\theta}_{t+1}=\boldsymbol{\theta}_{t}+\alpha \widehat{\nabla J\left(\boldsymbol{\theta}_{t}\right)}
$$

* $$  \widehat{\nabla J\left(\boldsymbol{\theta}_{t}\right)} \in \mathbb{R}^{d^{\prime}} $$ 는 $\theta_{t}$에 대한 gradient of the performance measure

Policy와 value 둘 다에 대한 적절한 학습 방법을 actor-critic methods라 부른다.

* Actor: Learned policy 
* Critic: learned value Function (일반적으로 state-value function을 의미한다.)



## Why Policy Gradients?

Deep Q Learning은 action space가 크거나 연속일 경우 잘 동작하지 않음

* 예를 들어, 자동주행차는 각 상태에서 (거의) 무한한 가짓수의 행동(바퀴를 15°, 17.2°, 19.4° 회전 ...)을 선택을 할 수 있습니다. 그럼 모든 가능한 행동에 대하여 Q값을 구해야 하게 됩니다! 

Policy Gradient는 action을 선택하는 것이 직접적임

각 state에 대해서 정확한 값을 계산할 필요가 없음

Policy Network는 가능한 모든 action들에 대한 확률 행렬을 반환함

* 확률에 기반하여 action을 무작위로 선택하거나 greedy 하게 선택 가능
* Exploration과 Exploitation에 대한 trade-off 균형을 직접 맞출 필요가 없어짐
  * perceptual aliasing 문제를 해결한다.



## Disadvantage of Policy Gradients

Local optimum

* 정책 경사는 많은 상황에서 전역 최적점이 아닌 **지역 최적점에 수렴**합니다. 

느린 학습 속도

* 항상 최고점에 도달하려는 딥 Q-러닝과 달리, 정책 경사는 **천천히 수렴**합니다. 따라서 학습하는 데 더 오랜 시간이 걸릴 수 있습니다. 



## Policy Approximation and its Advantages  

state-action pair에 대해 $h(s, a, \boldsymbol{\theta}) \in \mathbb{R}$로 수치적인 선호도를 나타낼 수 있고, 각 상태에서 가장 높은 선호를 가지는 행동에 가장 높은 선택 확률이 주어진다.

$$
\pi(a \mid s, \boldsymbol{\theta}) \doteq \frac{e^{h(s, a, \boldsymbol{\theta})}}{\sum_{b} e^{h(s, b, \boldsymbol{\theta})}}
$$

* 이런 종류의 방법을 Softmax in action preferences라 한다.

이러한 선호도는 임의의 형태로 parameter화 시킬 수 있는데, 이때 $ \boldsymbol{\theta}$ 는 가중치를 포함하는 vector다. 

* 단순히 선형 함수의 형태로 다음과 같이 표현할 수 있다.

* $$
  h(s, a, \boldsymbol{\theta})=\boldsymbol{\theta}^{\top} \mathbf{x}(s, a)
  $$
	* 여기서 $\mathbf{x}(s, a) \in \mathbb{R}^{d^{\prime}}$ 는 단순한 feature vector이다.

soft-max 방식을 통해 policy를 parameterize할 때의 장점

1. approximate policy가 점점 더 deterministic policy에 가까워 진다.
   * 반대로, $\varepsilon$-greedy 방식은 언제나 $\varepsilon$의 확률로 임의의 행동을 선택한다.

2. 임의의 확률로 행동을 선택하게 하는 것을 가능하게 한다.
   * optimal 정책이 stochastic 정책일지도 모른다 (가위바위보 게임 처럼)

Policy parameterization 사용의 가장 중요한 이유 중 하나는 강화 학습의 optimal policy 형태를 찾기 위해 사전 지식을 제공해줄 수 있다는 점이다.



## The Policy Gradient Theorem  

policy parameterization을 이용하면 action을 선택할 확률이 parameter에 의해 부드럽게 변한다.

* 반면 $\varepsilon$-greedy 선택 방법은 추정하는 action 값의 미약한 변화가 급격한 action 선택 확률의 변동을 만들어낸다.
* 이러한 이유로 action-value 방식보다 policy-gradient가 더 강력한 수렴성을 보장할 수 있다.

Episodic 문제에서 성능 지표(performance measure) $J(\boldsymbol{\theta})$은 다음과 같이 정의된다.

$$
J(\boldsymbol{\theta}) \doteq v_{\pi_{\boldsymbol{\theta}}}\left(s_{0}\right)
$$

* 항상 똑같은 state (non-random) $s_0$에서 시작한다고 가정하였다.
* $v_{\pi_{\boldsymbol{\theta}}}$ 는 $\boldsymbol{\theta}$ 에 따라 결정되는 정책인 $ \pi_{\boldsymbol{\theta}}$ 에 대한 true value function이다.

### policy gradient theorem  

policy parameter에 대한 performance의 gradient는 policy gradient theorem에 의해서 다음과 같이 표현된다.

$$
\nabla J(\boldsymbol{\theta}) \propto \sum_{s} \mu(s) \sum_{a} q_{\pi}(s, a) \nabla \pi(a \mid s, \boldsymbol{\theta})
$$

* 여기서 gradients는 $\boldsymbol{\theta}$의 원소들에 대한 partial derivatives의 column vectors를 나타낸 것이다.
* 또한, $\pi$ 는 $\boldsymbol{\theta}$에 대한 policy를 의미하고, $\propto$ 는 비례한다는 의미이다.
* 분포 $\mu$는 policy $\pi$ 하에서의 on-policy distribution이다. 



## REINFORCE: Monte Carlo Policy Gradient  

REINFORCE 방식은 몬테카를로 방식의 Policy Gradient이다. 즉, 큰 분산(high variance)을 가질 수 있고, 따라서 학습 속도가 느려질 수도 있다. 

policy gradient theorem의 우변은 policy $\pi$ 하에서 얼마나 자주 state들이 발생할 것인지에 따라 가중치를 적용한 합계다. 즉, $\pi$를 따른다면, 가중치(weight)에 해당하는 비율로 각 state를 마주칠(encounter)것이다.

$$
\begin{aligned}
\nabla J(\boldsymbol{\theta}) & \propto \sum_{s} \mu(s) \sum_{a} q_{\pi}(s, a) \nabla \pi(a \mid s, \boldsymbol{\theta}) \\
&=\mathbb{E}_{\pi}\left[\sum_{a} q_{\pi}\left(S_{t}, a\right) \nabla \pi\left(a \mid S_{t}, \boldsymbol{\theta}\right)\right]
\end{aligned}
$$

이제 위 식을 stochastic gradient-ascent algorithm에 사용할 수 있다.

$$
\boldsymbol{\theta}_{t+1} \doteq \boldsymbol{\theta}_{t}+\alpha \sum \hat{q}\left(S_{t}, a, \mathbf{w}\right) \nabla \pi\left(a \mid S_{t}, \boldsymbol{\theta}\right)
$$

* $\hat{q}$ 은 $q_{\pi}$ 에 대한 학습된 근사값이다.

위 update algorithm은 all-actions method라고 부린다. 왜냐하면 모든 actions에 관련된 update를 진행하기 때문이다. 하지만, 모든 actions에 대한 sample을 전부 모으기는 너무 많은 시간이 소요되므로, 각 state가 아닌 각 action에 대해서 update를 진행할 필요가 있다.

REINFORCE 알고리즘은 $S_t$ 대신, $A_t$에 대한 update를 수행한다. 

* $A_t$는 $t$에 취한 하나의 action을 의미한다.

위의 $\nabla J(\boldsymbol{\theta})$ 식은 expectation 계산에 필요한 $$\pi\left(a \mid S_{t}, \boldsymbol{\theta}\right)$$ 와 같은 가중치를 주지 않았다. 그래서, 위 식과 동일하게 만들도록, $$\pi\left(a \mid S_{t}, \boldsymbol{\theta}\right)$$를 도입하되, $$\pi\left(a \mid S_{t}, \boldsymbol{\theta}\right)$$ 를 다시 나누는 방식으로 equality를 유지한다.

![image-20201106233720325](https://i.loli.net/2020/11/06/hc8KlB37garM5xP.png)

* $G_{t}$ 는 return을 의미한다.

이제 이 식을 이용해서 stochastic gradient ascent algorithm을 수행한다. 이 방식을 REINFORCE update라 한다.

$$
\boldsymbol{\theta}_{t+1} \doteq \boldsymbol{\theta}_{t}+\alpha G_{t} \frac{\nabla \pi\left(A_{t} \mid S_{t}, \boldsymbol{\theta}_{t}\right)}{\pi\left(A_{t} \mid S_{t}, \boldsymbol{\theta}_{t}\right)}
$$

* 벡터 $$  \frac{\nabla \pi\left(A_{t} \mid S_{t}, \boldsymbol{\theta}_{t}\right)}{\pi\left(A_{t} \mid S_{t}, \boldsymbol{\theta}_{t}\right)} $$ 의 방향은 미래에서 $S_t$를 마주쳤을 때, 행동 $A_t$를 취할 행동 확률을 가장 많이 증가시키는 방향이다.
  * 그리고, 이 방향이 업데이트 되는 정도 $G_{t}$ 는 보상을 많이 받을수록 커지고, 적게 받을 수록 줄어든다.
* 결과적으로, 이득(return)을 가장 많이 산출하는 행동을 선호하는 방향으로 parameter가 이동할 것이다.

REINEFORCE는 시간 $t$부터 계산되는 완전한 return을 사용한다. 즉, 에피소드가 끝날 때 까지의 미래 보상들을 전부 더한 값을 이용하므로, REINEFORCE는 몬테카를로(MC) 알고리즘이고, episodic case의 경우에 대해서만 잘 사용될 수 있다.

![image-20201106235456105](https://i.loli.net/2020/11/06/EFRrLl15qaAnk7u.png)

* 마지막 줄 $$\boldsymbol{\theta} \leftarrow \boldsymbol{\theta}+\alpha \gamma^{t} G \nabla \ln \pi\left(A_{t} \mid S_{t}, \boldsymbol{\theta}\right)$$ 은 update 방식과 다르게 보이는데, 이는 벡터 $$   \frac{\nabla \pi\left(A_{t} \mid S_{t}, \boldsymbol{\theta}_{t}\right)}{\pi\left(A_{t} \mid S_{t}, \boldsymbol{\theta}_{t}\right)}  $$ 에 대해서 압축적 표현으로 $$\nabla \ln \pi\left(A_{t} \mid S_{t}, \boldsymbol{\theta}\right)$$ 를 사용한다는 것이다. ($$\nabla \ln x=\frac{\nabla x}{x}$$)

* 또한 update 방식에는 사용되지 않은 discount factor가 $\gamma^{t}$ 적용되었는데, update 방식이 $\gamma=1$인 경우에 대한 식이기 때문이다.



## REINFORCE with Baseline  

어떤 상태에서는 모든 행동이 높은 가치를 가지기 때문에 가치가 더 높은 행동을 가치가 낮은 행동과 구별하기 위해서는 높은 기준값이 필요하다. 반대로, 어떤 상태에서는 모든 행동이 낮은 가치를 가질 것이고, 이 경우에는 낮은 기준값이 적절하다.

즉, policy gradient theorem에 기준값 (baseline) $b(s)$을 추가함으로써 REINFORCE의 분산을 크게 감소시킬 수 있다.

$$
\nabla J(\boldsymbol{\theta}) \propto \sum_{s} \mu(s) \sum_{a}\left(q_{\pi}(s, a)-b(s)\right) \nabla \pi(a \mid s, \boldsymbol{\theta})
$$

* $b(s)$는 function 또는 random variable등 이 될 수 있다.

기준값을 추가해도 policy gradient theorem이 equality를 유지할 수 있는 이유는, baseline에 따라 행동 $a$이 변하지 않으면 되기 때문이다.

$$
\sum_{a} b(s) \nabla \pi(a \mid s, \boldsymbol{\theta})=b(s) \nabla \sum_{a} \pi(a \mid s, \boldsymbol{\theta})=b(s) \nabla 1=0
$$

Baseline을 추가한 새로운 update 방식은 다음과 같다.

$$
\boldsymbol{\theta}_{t+1} \doteq \boldsymbol{\theta}_{t}+\alpha\left(G_{t}-b\left(S_{t}\right)\right) \frac{\nabla \pi\left(A_{t} \mid S_{t}, \boldsymbol{\theta}_{t}\right)}{\pi\left(A_{t} \mid S_{t}, \boldsymbol{\theta}_{t}\right)}
$$

기준값을 선택하는 자연스러운 방법 중 하나는 state value $\hat{v}\left(S_{t}, \mathbf{w}\right)$ 의 추정값을 기준값으로 선택하는 것이다.

* $\mathbf{w} \in \mathbb{R}^{d}$ 는 weight vector다. ($\boldsymbol{\theta}$ 와 다른 추가적인 weight vector)

이렇게 두개의 parameter $\mathbf{w}$, $\boldsymbol{\theta}$를 사용하면, 둘 다 동시에 몬테카를로 방법으로 학습하면 된다.

![image-20201107001619998](https://i.loli.net/2020/11/06/gbM4jRu7ZHOt85F.png)



## Actor–Critic Methods  

baseline을 사용한 REINEFORCE 방법이 policy와 state value 모두 학습하지만, state value가 baseline으로만 사용되고 critic으로 사용되지 않으므로, 이를 actor-critic이라고 말하지는 않는다.

* 즉, baseline은 bootstrap을 위해 사용되고 있지 않다.
  * bootstrap: 어떤 상태의 value 추정값을 그 상태 이후에 나올 상태들의 state value 추정값을 이용하여 갱신하는 방법

baseline이 있는 REINFORCE는 bias를 가지지 않으며 local optima에 점근적으로 수렴하짐만, 몬테카를로 방법의 한계로 학습 속도가 느릴 뿐더러 온라인 문제나 연속적인 문제(episode가 없는 문제)에 적용하기 불편한 측면이 있다.  

이러한 문제를 완화하기 위해서 TD 방법을 적용한다. One-step actor-critic 방법은 REINFORCE 방식에서 full return 대신 one-step return을 사용한 것과 같다.

$$
\begin{aligned}
\boldsymbol{\theta}_{t+1} & \doteq \boldsymbol{\theta}_{t}+\alpha\left(G_{t: t+1}-\hat{v}\left(S_{t}, \mathbf{w}\right)\right) \frac{\nabla \pi\left(A_{t} \mid S_{t}, \boldsymbol{\theta}_{t}\right)}{\pi\left(A_{t} \mid S_{t}, \boldsymbol{\theta}_{t}\right)} \\
&=\boldsymbol{\theta}_{t}+\alpha\left(R_{t+1}+\gamma \hat{v}\left(S_{t+1}, \mathbf{w}\right)-\hat{v}\left(S_{t}, \mathbf{w}\right)\right) \frac{\nabla \pi\left(A_{t} \mid S_{t}, \boldsymbol{\theta}_{t}\right)}{\pi\left(A_{t} \mid S_{t}, \boldsymbol{\theta}_{t}\right)} \\
&=\boldsymbol{\theta}_{t}+\alpha \delta_{t} \frac{\nabla \pi\left(A_{t} \mid S_{t}, \boldsymbol{\theta}_{t}\right)}{\pi\left(A_{t} \mid S_{t}, \boldsymbol{\theta}_{t}\right)}
\end{aligned}
$$

![image-20201107010652280](https://i.loli.net/2020/11/07/46s8biEarjHPOTl.png)



## Policy Gradient for Continuing Problems  

episode boundaries가 없는 연속 문제에서는 매 time step마다 보상의 평균 비율에 대한 performance를 정의할 필요가 있다.ㅎ

$$
\begin{aligned}
J(\boldsymbol{\theta}) \doteq r(\pi) & \doteq \lim _{h \rightarrow \infty} \frac{1}{h} \sum_{t=1}^{h} \mathbb{E}\left[R_{t} \mid S_{0}, A_{0: t-1} \sim \pi\right] \\
&=\lim _{t \rightarrow \infty} \mathbb{E}\left[R_{t} \mid S_{0}, A_{0: t-1} \sim \pi\right] \\
&=\sum_{s} \mu(s) \sum_{a} \pi(a \mid s) \sum_{s^{\prime}, r} p\left(s^{\prime}, r \mid s, a\right) r
\end{aligned}
$$

![image-20201107020553440](https://i.loli.net/2020/11/07/sKFSgkCroa7qRcd.png)



## Policy Parameterization for Continuous Actions  

Continuous actions 에서는 많은 actions에 대해 선택할 확률보다는 확률 분포에 대한 통계 모델을 학습한다.

Gaussian 분포의 경우 $\mu$와 $\sigma$를 찾아내는 parameter를 두 개 활용한다.


$$
\pi(a \mid s, \boldsymbol{\theta}) \doteq \frac{1}{\sigma(s, \boldsymbol{\theta}) \sqrt{2 \pi}} \exp \left(-\frac{(a-\mu(s, \boldsymbol{\theta}))^{2}}{2 \sigma(s, \boldsymbol{\theta})^{2}}\right)
$$

* $$\mu: \mathcal{S} \times \mathbb{R}^{d^{\prime}} \rightarrow \mathbb{R}$$ and $$\sigma: \mathcal{S} \times \mathbb{R}^{d^{\prime}} \rightarrow \mathbb{R}^{+}$$

표준 편차 $\sigma$의 경우 항상 양수여야 하므로, 선형 함수의 exponential을 활용하는 것이 좋다.


$$
\mu(s, \boldsymbol{\theta}) \doteq \boldsymbol{\theta}_{\mu}^{\top} \mathbf{x}_{\mu}(s) \quad \text { and } \quad \sigma(s, \boldsymbol{\theta}) \doteq \exp \left(\boldsymbol{\theta}_{\sigma}^{\top} \mathbf{x}_{\sigma}(s)\right)
$$