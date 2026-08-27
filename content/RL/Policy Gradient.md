---
tags: ["reinforcement_learning"]
aliases: ["정책 경사"]
---

# A) Policy Gradient ?

[[action-value function]] 은 action 선택에 더 이상 활용되지 않지만만 policy parameter vector $\boldsymbol{\theta}\in\mathbb{R}^{d^{\prime}}$ 를 학습하는데 사용될수는 있음

$$
\pi(a\mid s,\boldsymbol{\theta})=\operatorname{Pr}\left\{A_{t}=a\midS_{t}=s,\boldsymbol{\theta}_{t}=\boldsymbol{\theta}\right\}
$$

* 시간 $t$ 의 state $s$ 에 위치하는 agent $s$ 가 parameter $\boldsymbol{\theta}$ 를 통해 $a$ 를 선택할 확률을 의미
* $a$ 를 선택할 때, 학습된 value function $\hat{v}(s,\mathbf{w})$ 을 사용한다면, weight vector 는 $\mathbf{w}\in\mathbb{R}^{d}$ 가 됨
* Policy parameter 는 performance $J(\boldsymbol{\theta})$ 를 최대화하는 방향으로 나아간다.
* $\boldsymbol{\theta}_{t+1}=\boldsymbol{\theta}_{t}+\alpha\widehat{\nablaJ\left(\boldsymbol{\theta}_{t}\right)}$
* $\widehat{\nablaJ\left(\boldsymbol{\theta}_{t}\right)}\in\mathbb{R}^{d^{\prime}}$ 는 $\theta_{t}$ 에 대한 gradient of the performance measure
* Policy 와 value 둘 다에 대한 적절한 학습 방법을 actor-critic methods 라 부른다.
* Actor: Learned policy
* Critic: learned value Function (일반적으로 state-value function 을 의미한다.)

# B) Why Policy Gradients?

Deep Q Learning 은 action space 가 크거나 연속일 경우 잘 동작하지 않는다.

예를 들어 자동주행차는 각 상태에서 (거의) 무한한 가짓수의 행동 (바퀴를 15°, 17.2°, 19.4° 회전 …) 을 선택을 할 수 있다. 이 경우에 가능한 행동에 대하여 Q 값을 구해야 된다.

Policy Gradient 는 value 를 통해 action 을 고르는 것이 아니라 action 자체를 선택한다. 그래서 state 에 대해서 정확한 값을 계산할 필요가 없다.

다시 말하면, Policy Network 는 가능한 모든 action 들에 대한 확률 행렬을 반환하기 때문에, 이 확률에 기반하여 action 을 무작위로 선택하거나 greedy 하게 선택 가능하다.

결과적으로 Exploration 과 Exploitation 에 대한 trade-off 균형을 직접 맞출 필요가 없어지므로, perceptual aliasing 문제를 해결할 수 있다.

# C) Disadvantage of Policy Gradients

1. Local optimum
   정책 경사는 많은 상황에서 전역 최적점이 아닌 **지역 최적점에 수렴**합니다.
2. 느린 학습 속도
   항상 최고점에 도달하려는 딥 Q- 러닝과 달리, 정책 경사는 천천히 수렴한다. 따라서 학습하는 데 더 오랜 시간이 걸릴 수 있습니다.

# D) Policy Approximation and Its Advantages

* state-action pair 에 대해 $h(s,a,\boldsymbol{\theta})\in\mathbb{R}$ 로 수치적인 선호도를 나타낼 수 있고, 각 상태에서 가장 높은 선호를 가지는 행동에 가장 높은 선택 확률이 주어진다.
	* $\displaystyle\pi(a\mid s,\boldsymbol{\theta})\doteq\frac{e^{h(s,a,\boldsymbol{\theta})}}{\sum_{b}e^{h(s,b,\boldsymbol{\theta})}}$
	* 이런 종류의 방법을 Softmax in action preferences 라 한다.
	* 이러한 선호도는 임의의 형태로 parameter 화 시킬 수 있는데, 이때 $\boldsymbol{\theta}$ 는 가중치를 포함하는 vector 다.
	* 단순히 선형 함수의 형태로 다음과 같이 표현할 수 있다.
	* $h(s,a,\boldsymbol{\theta})=\boldsymbol{\theta}^{\top}\mathbf{x}(s,a)$
		* 여기서 $\mathbf{x}(s,a)\in\mathbb{R}^{d^{\prime}}$ 는 단순한 feature vector 이다.
	* soft-max 방식을 통해 policy 를 parameterize 할 때의 장점
	* 1. approximate policy 가 점점 더 deterministic policy 에 가까워 진다.
		* 반대로, $\varepsilon$-greedy 방식은 언제나 $\varepsilon$ 의 확률로 임의의 행동을 선택한다.
	* 2. 임의의 확률로 행동을 선택하게 하는 것을 가능하게 한다.
		* optimal 정책이 stochastic 정책일지도 모른다 (가위바위보 게임 처럼)
	* Policy parameterization 사용의 가장 중요한 이유 중 하나는 강화 학습의 optimal policy 형태를 찾기 위해 사전 지식을 제공해줄 수 있다는 점이다.

# E) The Policy Gradient Theorem

* policy parameterization 을 이용하면 action 을 선택할 확률이 parameter 에 의해 부드럽게 변한다.
	* 반면 $\varepsilon$-greedy 선택 방법은 추정하는 action 값의 미약한 변화가 급격한 action 선택 확률의 변동을 만들어낸다.
	* 이러한 이유로 action-value 방식보다 policy-gradient 가 더 강력한 수렴성을 보장할 수 있다.
	* Episodic 문제에서 성능 지표 (performance measure) $J(\boldsymbol{\theta})$ 은 다음과 같이 정의된다.
	* $J(\boldsymbol{\theta})\doteqv_{\pi_{\boldsymbol{\theta}}}\left(s_{0}\right)$
	* 항상 똑같은 state (non-random) $s_0$ 에서 시작한다고 가정하였다.
	* $v_{\pi_{\boldsymbol{\theta}}}$ 는 $\boldsymbol{\theta}$ 에 따라 결정되는 정책인 $\pi_{\boldsymbol{\theta}}$ 에 대한 true value function 이다.
	* policy gradient theorem  
	* policy parameter 에 대한 performance 의 gradient 는 policy gradient theorem 에 의해서 다음과 같이 표현된다.
	* $\displaystyle\nablaJ(\boldsymbol{\theta})\propto\sum_{s}\mu(s)\sum_{a}q_{\pi}(s,a)\nabla\pi(a\mids,\boldsymbol{\theta})$
	* 여기서 gradients 는 $\boldsymbol{\theta}$ 의 원소들에 대한 partial derivatives 의 column vectors 를 나타낸 것이다.
	* 또한, $\pi$ 는 $\boldsymbol{\theta}$ 에 대한 policy 를 의미하고, $\propto$ 는 비례한다는 의미이다.
	* 분포 $\mu$ 는 policy $\pi$ 하에서의 on-policy distribution 이다.
* ## [[REINFORCE]]: Monte Carlo Policy Gradient  
* ## [[Actor–Critic Method]] 
* ## Policy Gradient for Continuing Problems  
	* episode boundaries 가 없는 연속 문제에서는 매 time step 마다 보상의 평균 비율에 대한 performance 를 정의할 필요가 있다.
	* $\begin{aligned}\displaystyleJ(\boldsymbol{\theta})\doteqr(\pi)&\doteq\lim_{h\rightarrow\infty}\frac{1}{h}\sum_{t=1}^{h}\mathbb{E}\left[R_{t}\midS_{0},A_{0:t-1}\sim\pi\right]\\&=\lim_{t\rightarrow\infty}\mathbb{E}\left[R_{t}\midS_{0},A_{0:t-1}\sim\pi\right]\\\displaystyle&=\sum_{s}\mu(s)\sum_{a}\pi(a\mids)\sum_{s^{\prime},r}p\left(s^{\prime},r\mids,a\right)r\end{aligned}$
	* ![[img-0c9c72dcb3.png|image-20201107020553440]]
* ## Policy Parameterization for Continuous Actions  
* Continuous actions 에서는 많은 actions 에 대해 선택할 확률보다는 확률 분포에 대한 통계 모델을 학습한다.
* Gaussian 분포의 경우 $\mu$ 와 $\sigma$ 를 찾아내는 parameter 를 두 개 활용한다.
* $\pi(a\mids,\boldsymbol{\theta})\doteq\frac{1}{\sigma(s,\boldsymbol{\theta})\sqrt{2\pi}}\exp\left(-\frac{(a-\mu(s,\boldsymbol{\theta}))^{2}}{2\sigma(s,\boldsymbol{\theta})^{2}}\right)$
* $\mu:\mathcal{S}\times\mathbb{R}^{d^{\prime}}\rightarrow\mathbb{R}$ and $\sigma:\mathcal{S}\times\mathbb{R}^{d^{\prime}}\rightarrow\mathbb{R}^{+}$
* 표준 편차 $\sigma$ 의 경우 항상 양수여야 하므로, 선형 함수의 exponential 을 활용하는 것이 좋다.
* $\mu(s,\boldsymbol{\theta})\doteq\boldsymbol{\theta}_{\mu}^{\top}\mathbf{x}_{\mu}(s)\quad\text{and}\quad\sigma(s,\boldsymbol{\theta})\doteq\exp\left(\boldsymbol{\theta}_{\sigma}^{\top}\mathbf{x}_{\sigma}(s)\right)$

# F) References
