---
title: "Monte Carlo Method(RL)"
tags: reinforcement_learning 
aliases: []
---

# A) Monte Carlo Method

Monte Carlo Method 방법은 경험 (experience) 이 필요하다. 경험이란 환경과의 상호 작용을 통해 얻어지는 일련의 states, actions 그리고 rewards 의 sample 을 의미한다.

MC 방식은 [[Markov Decision Process|MDP]] 를 알 수 없는 상황에서 [[value function]] 을 추정한다는 관점에서 model-free prediction 방식으로 불린다.

# B) Monte Carlo Prediction

우선 몬테 카를로 방법으로 주어진 policy 에 대한 [[state-value function]] 을 찾는 것을 생각해보자.

state 의 값은 expected return $G$ 값이다 (expected cumulative future discount reward). experience 에서 state 값을 찾는 방법은 해당 state 를 방문 하고나서 측정된 returns 들의 평균을 구하는 것이다. 만약 많은 returns 들이 관찰된다면, 구해진 평균은 expected value 에 수렴할 것이다.

* [[first-visit MC]]
* [[every-visit MC]]

반면, 두 MC 방법은 모두 $s$ 에 대해 방문하는 횟수가 무한으로 증가할수록 $v_\pi(s)$ 가 수렴한다.

* [[큰 수의 법칙]] 에 의해 이러한 추정값은 [[expectation|기댓값]] 으로 수렴하게 된다.

MC 는 평균 sample returns 값을 이용하여 강화 학습 문제를 해결한다. 여기서는 terminal state 가 있는 episodic task 만 고려한다.

# C) DP Vs MC

## C.1) 차이점

MC 는 환경에 대한 [[dynamics]] 을 알 필요가 없다. 반대로 [[RL/DP (Reinforcement Learning)|DP]] 는 다음 events 에 대한 모든 확률 분포를 알아야된다.

MC 도 transition 확률을 알 필요는 있다. 그렇지만 이것도 DP 처럼 가능한 모든 transitions 에 대한 확률 분포가 아닌 sample transitions 에 의해 생성되기만 하면 된다.

one-step transitions 을 통해 value 를 update 하는 DP diagram 과 달리, 몬테카를로 방법은 terminal state 까지의 trajectory 를 확인하고 value 를 estimate 한다.  
이를 도식화 하면 아래와 같다.  
![[img-b8edc653e0.png||300]]

또한 MC 의 state 에 대한 value 추정값은 독립적이다. DP 는 반대로 다른 state 를 활용하여 특정 state 의 value 추정을 시도한다 (bootstrap).

# D) Monte Carlo Estimation of Action Values

모델을 활용하는 것이 불가능하다면, state 값 대신, action 값 (state 와 action 의 쌍으로 이루어진 값) 을 추정하는 것이 유용하다.

[[DP (Reinforcement Learning)|DP]] 처럼 모델이 존재한다면, state value 와 transition probability 를 알기 때문에, $q$ 값을 이용해 policy 를 결정하는것이 충분했다.

MC 의 궁극적인 목적은 $q_*$ 값을 추정하는 것이다 (policy evaluation for action values).

* policy evaluation for action values 는 $q_\pi(s,a)$ 를 추정하는 것
	* $q_\pi(s,a)$ : $s$ 에서 $a$ 를 선택하고, $\pi$ 를 따랐을 때 얻을 수 있는 expected return
	* $s,a$ pair 의 visit: $s$ 를 visit 하고 action $a$ 가 $s$ 에서 취해졌을 때 visit 한다고 말함
* 이러한 접근의 문제점은 대부분의 state-action pair 의 값들은 visit 되지 않을 수 있다는 것이다 (경우의 수가 너무 많아서).
	* 결과적으로, action 값을 비교해서 policy 를 정해야되는데 그러지 못하는 불상사가 생긴다.

Monte Carlo Control

DP 와 비슷한 [[GPI]](Generalized policy iteration) 방식으로 MC 도 optimal policies 를 approximate 할 수 있다.

![[img-a1d183165d.png||240]]

$$
\pi_{0}\stackrel{\mathrm{E}}{\longrightarrow}q_{\pi_{0}}\stackrel{\mathrm{I}}{\longrightarrow}\pi_{1}\stackrel{\mathrm{E}}{\longrightarrow}q_{\pi_{1}}\stackrel{\mathrm{I}}{\longrightarrow}\pi_{2}\stackrel{\mathrm{E}}{\longrightarrow}\cdots\stackrel{\mathrm{I}}{\longrightarrow}\pi_{*}\stackrel{\mathrm{E}}{\longrightarrow}q_{*}
$$

$\stackrel{\mathrm{I}}{\longrightarrow}$ 는 complete [[policy improvement]] 이고, $\stackrel{\mathrm{E}}{\longrightarrow}$ 는 complete [[policy evaluation]] 이다.

* [[policy evaluation]]
	* [[policy evaluation]] 은 [[first-visit MC]] prediction 과 완전히 동일하게 수행된다.
* [[policy evaluation]] 의 문제는 근사한 action-value 를 찾기 위해서는 evaluation 를 거의 무한히 반복해야된다는 것이다.
	* DP 는 value-iteration 처럼 한번만 평가하고 improvement 하던가, single state value 를 평가할 때마다 improvement 하는 in-place 형식으로 진행했다 (아니면 policy-iteration 에서 처럼 특정 threshold 미만이면 evaluation 을 멈추던가).
* [[policy improvement]]  
* [[action-value function]] $q_\pi$ 를 찾았기 때문에, 모든 $s\in\mathcal{S}$ 에 대해서, 바로 다음과 같은 action 을 취하면 된다.
	* $\displaystyle\pi(s)\doteq\arg\max_{a}q(s,a)$
* 즉, $q_{\pi_{k}}$ 를 통해서 $\pi_{k+1}$ 을 찾으면 되는데, 이렇게 찾아진 $\pi_{k+1}$ 와 $\pi_k$ 의 관계는 모든 $s\in\mathcal{S}$ 에 대해서 다음과 같다.  

$$
\begin{aligned}q_{\pi_{k}}\left(s,\pi_{k+1}(s)\right)&=q_{\pi_{k}}\left(s,\underset{a}{\arg\max}q_{\pi_{k}}(s,a)\right)\\&=\max_{a}q_{\pi_{k}}(s,a)\\&\geqq_{\pi_{k}}\left(s,\pi_{k}(s)\right)\\&\geq v_{\pi_{k}}(s)\end{aligned}
$$

* [[Exploring Starts]]

# E) MC Exploring Starts

MC 는 episode 마다 evaluation 과 improvement 를 번갈아 수행하는 것이 자연스럽다.

각 에피소드마다 관측된 returns 값들은 evaluation 과, 에피소드에서 마주친 모든 $s$ 에 대한 improvement 에 사용된다.

![[img-fecd29aabe.png|image-20201022162002317]]  
	- 여기서 exploring starts 의 가정을 위해, 특정 state $s$ 에서 시작하는 것이 아니라, 임의의 $(s,a)$ pair 에서 시작해서 episode 를 진행한다.  
	- MC ES 는 조금 비 효율적이다. 왜냐면, $G$ 를 저장하는 list 를 계속 보관하면서 평균 ($Q\left(S_{t},A_{t}\right)\leftarrow$ average $\left(\right.$Returns $\left.\left(S_{t},A_{t}\right)\right)$) 을 구하기 때문이다. (이를 조금만 수정하면 좋아질수있다)

* MC ES 는 궁극적으로 최적의 해에 도달하는데, 이를 공식적으로 증명하진 못했다.
	* > If it did, then the value function would eventually converge to the value function for that policy, and that in turn would cause the policy to change.

# F) Monte Carlo Control without Exploring Starts

Exploring starts 는 모든 $(s,a)$ 를 무한히 확인해봐야 한다는 가정이 존재한다. 이러한 가정을 보장하는 방법으로는 on-policy 방법과 off-policy 방법이 존재한다.

On-policy 방법은 생성된 sample 을 기반으로 policy improvement 와 evaluate 를 진행한다.  
			- MC ES 는 on-policy 방법의 example 이다.  
		- 반대로, off-policy 방법은 생성된 sample 과 다른 것을 이용해 policy improvement 와 evaluate 를 진행한다.  
	- On-Policy  
		- On-policy 방법은 soft 성질을 가진다.  
			- soft 성질이란, 항상 $\pi(a\mids)>0$ 를 만족하지만, 점점 deterministic optimal policy 에 접근하는 것을 의미한다.  
		- 이를 위한 방법으로 $\varepsilon$-greedy policies 가 있다.  
			- 대부분 action 을 결정할 때, 추정된 action 값 중 최대 값에 해당하는 action 을 고르지만, 확률 $\varepsilon$ 으로 임의의 행동을 선택한다.  
			- 이 말은 모든 nongreedy 값에 대한 action 은 최소한의 선택 확률이 존재한다는 것이다 ($\displaystyle\frac{\varepsilon}{\mid\mathcal{A}(s)\mid}$).  
				- 즉, soft 성질을 만족한다: $\displaystyle\pi(a\mids)\geq\frac{\varepsilon}{\mid\mathcal{A}(s)\mid}$  
		- ![[img-ccde18b166.png|image-20201022165158299]]  
			- 참고로 $A^{*}\leftarrow\arg\max_{a}Q\left(S_{t},a\right)$ 에 해당하는 action 은 딱 하나로 정해졌기에 다음이 성립한다.  
				- $1\cdot(1-\varepsilon+\varepsilon/\left|\mathcal{A}\left(S_{t}\right)\right|)+(1-\left|\mathcal{A}\left(S_{t}\right)\right|)\cdot(\varepsilon/\left|\mathcal{A}\left(S_{t}\right)\right|)=1$  
		- Policy improvement theorem of On-policy first-visit MC control  
		- DP 에서는 가장 큰 action-value 에 해당하는 action 을 선택하면 항상 최적의 policy 로 수렴한다는 것이 보장됬다 (policy improvement theorem).  
			- 위와 같은 알고리즘도 보장되는가?  
		- $\pi'$ 를 $\varepsilon$-greedy policy 라 가정할 경우, 어떤 $s\in\mathcal{S}$ 에 대해서 policy improvement theorem 이 다음과 같이 적용된다.  
			- $\begin{aligned}q_{\pi}\left(s,\pi^{\prime}(s)\right)&=\sum_{a}\pi^{\prime}(a\mids)q_{\pi}(s,a)\\&=\frac{\varepsilon}{|\mathcal{A}(s)|}\sum_{a}q_{\pi}(s,a)+(1-\varepsilon)\max_{a}q_{\pi}(s,a)\\&\geq\frac{\varepsilon}{|\mathcal{A}(s)|}\sum_{a}q_{\pi}(s,a)+(1-\varepsilon)\sum_{a}\frac{\pi(a\mids)-\frac{\varepsilon}{|\mathcal{A}(s)|}}{1-\varepsilon}q_{\pi}(s,a)\\&=\frac{\varepsilon}{|\mathcal{A}(s)|}\sum_{a}q_{\pi}(s,a)-\frac{\varepsilon}{|\mathcal{A}(s)|}\sum_{a}q_{\pi}(s,a)+\sum_{a}\pi(a\mids)q_{\pi}(s,a)\\&=v_{\pi}(s)\end{aligned}$  
				- $\displaystyle\sum_{a}\frac{\pi(a\mids)-\frac{\varepsilon}{\mid\mathcal{A}(s)\mid}}{1-\varepsilon}$ 은 총합이 1 이되는 음이 아닌 가중치를 적용한 평균이고, 이를 모두 더하면 1 이 된다. 결과적으로, 최대값에 대한 평균보다는 반드시 작거나 같아야한다.

* ## Off-policy Prediction via Importance Sampling  
	* Off-policy 는 두가지 policy 를 통한 전체 process 를 의미한다.
		1. target policy: optimal policy 를 위해 최적의 행동을 찾아서 수행하는 정책
		2. behavior policy: 탐험적이고 다양한 sample(behavior) 을 생성하기 위해 수행하는 정책
	* 장/단점
		* Off-policy 는 서로 다른 정책으로부터 학습하기 때문에 [[variance]] 가 크고 수렴 속도가 느리다.
		* 그러나 더 일반적이고 강력하다.
			* 일반적 (general): on-policy 는 off-policy 의 target 과 behavior policy 가 동일한 경우의 special case 다.
	* Off-policy prediction
		* 두 policy, $\pi$ : target policy, $b$ : behavior policy 가 존재
		* $b$ 를 따른 에피소드를 통해 얻어진 samples 로 $\pi$ 에 대한 values 를 estimate 해보자.
		* 올바른 수렴 (coverage) 의 보장을 위해 $s$ 에서 수행되는 행동은 적어도 때때로 $b$ 에서도 행해져야 한다.
			* 즉, $\pi(a\mids)>0$ 가 $b(a\mids)>0$ 를 의미해야 한다.
		* 해당 보장이 만족되면, 학습이 반복될수록, target policy 는 a deterministic optimal policy 가 되고, behavior policy 는 stochastic and more exploratory 한 policy 가 된다.
	* [[importance sampling]]
		* 대부분의 off-policy 는 importance sampling(중요도 추출법) 을 사용한다.
		* 이 방법은 어떤 분포로 얻어진 sample 이 주어질때, 그 sample 을 이용하여 다른 분포에서 얻을 수 있는 expected value 를 추정하는 방법이다.
		* importance-sampling ratio
			* target 과 behavior policy 를 통해 얻어지는 trajectory 를 이용해 importance-sampling ratio 라는 상대적 확률을 계산할 수 있다.
				* 이 확률에 따라 return 값에 가중치를 부여하는 방식으로 importance sampling 을 수행할 수 있다.
			* $S_t$ 에서 시작해서, policy $\pi$ 하에 발생하는 state-action trajectory ($A_{t},S_{t+1},A_{t+1},\ldots,S_{T}$) 에 대한 확률은 다음과 같다: $\begin{aligned}&\operatorname{Pr}\left\{A_{t},S_{t+1},A_{t+1},\ldots,S_{T}\midS_{t},A_{t:T-1}\sim\pi\right\}\\&=\pi\left(A_{t}\midS_{t}\right)p\left(S_{t+1}\midS_{t},A_{t}\right)\pi\left(A_{t+1}\midS_{t+1}\right)\cdotsp\left(S_{T}\midS_{T-1},A_{T-1}\right)\\&=\prod_{k=t}^{T-1}\pi\left(A_{k}\midS_{k}\right)p\left(S_{k+1}\midS_{k},A_{k}\right)\end{aligned}$
				* $p$ 는 state-transition probability function 이다.
			* 위 확률을 이용해서 얻어지는 target 과 behavior polices 의 relative probability 는 다음과 같다: $\displaystyle\rho_{t:T-1}\\\doteq\frac{\prod_{k=t}^{T-1}\pi\left(A_{k}\midS_{k}\right)p\left(S_{k+1}\midS_{k},A_{k}\right)}{\prod_{k=t}^{T-1}b\left(A_{k}\midS_{k}\right)p\left(S_{k+1}\midS_{k},A_{k}\right)}=\prod_{k=t}^{T-1}\frac{\pi\left(A_{k}\midS_{k}\right)}{b\left(A_{k}\midS_{k}\right)}$
* $p$ 가 서로 동일하므로 서로 약분하여 사라지고, 결과적으로 importance-sampling ratio 는 policy 에 따른 결과에만 영향을 받는다.
* 원래는 target policy 로 부터 expected returns 값을 추정했지만, 이제는 behavior policy 에 의한 returns $G_t$ 값만 있다.
* 이 값은 $v_b(s)$ 를 계산할수는 있지만, $v_\pi$ 를 계산할 수는 없다. 이때, importance sampling 을 활용한다.
* $\mathbb{E}\left[\rho_{t:T-1}G_{t}\midS_{t}=s\right]=v_{\pi}(s)$
* Ordinary importance sampling
* $v_\pi(s)$ 를 추정하기 위해, scaling 과 average 를 적용한 $V(s)$ 의 정의는 다음과 같다.
	* $\displaystyleV(s)\doteq\frac{\sum_{t\in\mathcal{T}(s)}\rho_{t:T(t)-1}G_{t}}{|\mathcal{T}(s)|}$
		* $t$ 는 time step 으로, episode 에 관계없이 1 부터 시작하는 자연수 값이다.
		* 여기서 $\mathcal{T}(s)$ 는 상태 $s$ 를 visited 한 모든 time steps 의 집합을 의미한다.
		* $T(t)$ 는 $t$ 이후에 나타나는 최초의 termination time 을 의미한다.
			* 예를 들어, $t=1$ 에서 시작해서 $t=100$ 에 끝난다면, $T(t)=100\(1\let\le100)$ 이다.
* Weighted Importance sampling
	* 가중치가 적용된 평균을 구하는 방법이다 (분모쪽이 다름).
		* $\displaystyleV(s)\doteq\frac{\sum_{t\in\mathcal{T}(s)}\rho_{t:T(t)-1}G_{t}}{\sum_{t\in\mathcal{T}(s)}\rho_{t:T(t)-1}}$
			* 분모가 0 일 경우, 분자도 0 이 된다.
	* First-visit methods for Ordinary vs Weighted
	* Ordinary : bias 가 없음, variance 의 값이 매우 커질 수 있음 (unbounded)
	* Weighted : bias 가 존재함 (하지만 학습하면서 수렴), variance 가 작음
	* Every-visit methods for Ordinary vs Weighted
	* Ordinary 와 Weighted 상관없이 둘 다 편차가 존재함. (하지만 결국 0 으로 수렴)
* ## Incremental Implementation  
* 이제 실제로 importance sampling 을 이용해서 off-policy MC 를 구현하는 방법에 대해 알아보자.
* MC 는 평균 returns 을 활용하는 방법이라는 것을 기억하자.
	* 이러한 점은 평균 rewards 를 활용하는 incremental methods 와 비슷하다.
* [[Incremental Implementation]]
* 다음과 같은 rewards 의 평균 값 $Q_n$ 은 incremental method 를 통해 효율적으로 구해질 수 있다.
	* $\displaystyleQ_{n}\doteq\frac{R_{1}+R_{2}+\cdots+R_{n-1}}{n-1}$
* 이제 MC 구현으로 돌아가서, 모두 같은 state 에서 수행한 일련의 returns 값 $G_{1},G_{2},\ldots,G_{n-1}$ 이 존재하고, 임의의 가중치 $W_i$ (e.g. $W_{i}=\rho_{t_{i}:T\left(t_{i}\right)-1}$) 가 존재한다고 하자.
	* 이들을 이용해서 $V_n$ 을 다음과 같이 추정한다 (weighted 방식).
	* $V_{n}\doteq\frac{\sum_{k=1}^{n-1}W_{k}G_{k}}{\sum_{k=1}^{n-1}W_{k}},\quadn\geq2$
* 그리고 $V_{n+1}$ 을 구하는 것은 다음과 같이 계산된다.
	* $V_{n+1}\doteq V_{n}+\frac{W_{n}}{C_{n}}\left[G_{n}-V_{n}\right],\quadn\geq1$
	* $C_{n+1}\doteq C_{n}+W_{n+1}$
	* $C_n$ 은 $n$ 개의 returns 에 주어지는 가중치의 누적합을 의미하고, $C_0=0$ 이다.
		* (또한 $V_n$ 은 임의의 값으로 처리해도 무방함)  
![[img-54727d8fc7.png|image-20201022204431508]]
	* 위 알고리즘은 weighted importance sampling 을 이용한 off-policy 방법이지만, target 과 behavior policy 를 동일하게 만든 on-policy 경우에도 동일하게 먹힌다.
		* 이 경우 $\pi=b$ 이고, $W$ 는 항상 1 이다.
	* $b$ 가 $\pi$ 와 다른 정책을 통해 모든 action 이 선택되는 동안 근사 $Q$ 값은 $q_\pi$ 에 수렴한다.
* Off-policy Monte Carlo Control  
	* 근사 $q_\pi$ 를 찾았다면, 이를 활용하여 policy $\pi$ 를 update 하는 control 을 살펴보자.
	* Control 방법은 behavior policy 를 따르고 target policy 를 improve 한다.
		* behavior policy 는 target policy 가 선택할 수 있는 모든 actions 들을 수행할 확률이 있어야 한다. (soft policy: all actions in all states with nonzero probability)  
![[img-b9bc47b73b.png|image-20201022210157822]]
		* weighted importance sampling 과 GPI 에 기반한 control method  
		* 이전의 policy evaluation 과 달리 control 은 $W$ update 를 위해서 $\frac{\pi\left(A_{t}\midS_{t}\right)}{b\left(A_{t}\midS_{t}\right)}$ 대신 $\frac{1}{b\left(A_{t}\midS_{t}\right)}$ 를 곱한다.
			* 이래도 올바르게 동작하는 이유는 $W$ 가 $A_t=\pi(S_t)$ 의 경우에만 업데이트 될 뿐더러, $\pi$ 가 deterministic 하므로 $\pi(A_t\midS_t)=1$ 로 설정해도 $W$ 업데이트에 문제가 없다.
				* $W$ 가 $A_t=\pi(S_t)$ 의 경우에만 업데이트되는 이유는 target policy 와 behavior policy 가 동일한 action 을 취하는 경우기 때문에
			* 만약, $A_t\neq\pi(S_t)$ 조건을 지웠다면 $W$ 업데이트 방식도 이전과 동일해야한다.
		* 실제 구현을 해보니 이전의 evaluation version 이 훨씬 수렴성이 좋다.

# G) References
