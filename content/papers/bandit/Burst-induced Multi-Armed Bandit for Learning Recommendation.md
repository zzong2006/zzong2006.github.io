---
title: "Burst-induced Multi-Armed Bandit for Learning Recommendation"
aliases: []
tags:
  - MAB
  - RecSyS
  - bandit
  - paper_review
---

# A) Burst-induced Multi-Armed Bandit for Learning Recommendation ?

# B) Abstract

해결하려는 문제: a [[non-stationary]] and context-free [[Multi-Armed Bandit]] problem, 유저나 아이템에 대한 어떠한 정보가 없는 경우

# C) Introduction

사용자의 행동을 두가지 형태로 나눔: loyal, curious

## C.1) Comparing to prior Work

* context-free: only uses the observed rewards
* context-aware: require user or item features
* reward 분포에 존재하는 audience(user) 들의 curiosity 영향을 고려하지 않음
* 본 논문에서는 추천 환경이 서로 다른 두가지 상태 (loyal, curious) 로 나뉘어 져있다고 가정하고, 이를 두 [[Poisson point process]] 의 mixture 로 모델링함으로써 상태를 표현함
* Related work
	* non-stationary MAB
		* 두 가지 major class 들이 존재: adversarial MAB and piece-wise stationary MAB
			* adversarial MAB:: an adversary(적대자) 가 payoff generation 을 control
			* piece-wise stationary MAB:: 특정 time 구간에서 reward generation 이 stationary 한 경우
* Problem Formulation
	* 두 stochastic point process 들을 mixture
		* homogeneous Poisson process (HPP) with intensity: $\lambda(t)=\lambda_{L}$
			* rolay audience 를 모델링
		* a piece-wise homogeneous Poisson process (PW-HPP) with intensity: $\lambda_{C}(t)$
			* curious audience 를 모델링
			* $m$ 이라는 관찰되지 않은 임의의 특정 timestamps 구간 $m_i,1\lei\len$ 에서 transition 이 발생한다고 가정
			* 또한, $[m_j,m_{j+1}]$ 구간 내에서 $c_j$ 라는 unique intensity 값이 있다고 생각
				* 가장 중요한 가정은 $j$ 값에 따라서 $c_{j}\ll\lambda_{L}$ 와 $c_{j}\gg\lambda_{L}$ 가 번갈아 발생하는 것 (very low and very high intensity)
	* timestamp $t$ 에 해당하는 state 는 binary 로 표현되며, 현재 가장 dominate 되는 audience dyamic 에 따라 정의됨
		* $s(t)=0$: calm, $s(t)=1$: bursty
		* 정확히는 $s(t)\equiv\max\left(i\midm_{i}\leqs(t)\right)\bmod2$
* Burst-induced MAB
	* [[Thompson sampling]]
		* TS 알고리즘은 stationary stochstic MAB 문제에 대한 접근법이다.
		* Remark 1: exploration 이 확률적으로 해결됨
		* Remark 2: 어떤 arm $a$ 에 대한 beta 분포의 parameter 가 $\alpha=\beta=1$ 일 때, $\theta\sim$ Uniform (0, 1) 을 따른다.
	* BMAB (Burst-induced Multi-Armed Bandit) algorithm
		* $K$ 개의 arm 에 대하여 두 states(loyal & curious) 에 대한 beta 분포 (prior & posterior) 를 따로 둠
			* $\alpha_{0}\in\mathbb{R}^{K}\text{and}\beta_{0}\in\mathbb{R}^{K}$, $\alpha_{1}\in\mathbb{R}^{K}\text{and}\beta_{1}\in\mathbb{R}^{K}$
		* ![[img-86a22a014b.png]]
	* A realistic state detector
		* Notation
			* timestamps 집합의 윈도우 크기 $\Delta_{i}=t_{i}-t_{i-\Delta+1}$ (만약, $i<\Delta$ 이라면, $\Delta_{i}=t_{i}$)
			* confidence parameter $\delta\in(0,1)$ 가 포함된 [[Gamma distribution]] 의 [[quantile function]] 을 다음과 같이 정의

: $\mathbb{P}\left(X\leqq_{\delta}(\mu,\rho)\right)=1-\delta$

		* 해당 감마 분포의 $X$는 shape $\mu$ 그리고 scale $\rho$를 따름

		* 실험에서는 $\delta=0.95$로 설정함

* $t_i$ 에 발생한 event 의 state 를 판단하기 위해서는 [[hypothesis test]] 를 수행

: timestamps 집합 $\mathcal{T}_{\Delta,i}=\left\{t_{i-\Delta+1},t_{i-\Delta+2},\cdots,t_{i}\right\}$ 가 intensity $\lambda_L$ 에 의한 uniform Poisson process 에 의해 생성되었는지?

	* 즉, $\Delta_{i}=t_{i}-t_{i-\Delta+1}$ 는 shape 가 $\Delta-1$ 이고 scale이 $\lambda_L$인 [[Gamma distribution]]를 따른다는 의미가 된다.

	* 

* ![[img-c3138c599c.png]]

		* 

## C.2) Burst-induced Multi-Armed Bandit for Learning Recommendation

## C.3) 초록 (ABSTRACT)

본 논문에서 다루는 문제는 [[non-stationary]] 하고 context-free 한 [[Multi-Armed Bandit]] 문제입니다. 이는 유저나 아이템에 대한 어떠한 정보도 없는 상황을 가정합니다.

## C.4) 서론 (Introduction)

### C.4.1) 사용자 행동 유형

사용자의 행동은 크게 두 가지 형태로 구분할 수 있습니다: loyal(충성적인) 과 curious(호기심 많은) 유형입니다.

### C.4.2) 기존 연구와의 비교

* **context-free** 방식은 관측된 보상만을 활용합니다.
* **context-aware** 방식은 유저 또는 아이템의 특성을 필요로 합니다.
* 기존 연구들은 보상의 분포에 영향을 미치는 audience(user) 의 curiosity 를 고려하지 않았습니다.
* 본 논문에서는 추천 환경이 서로 다른 두 가지 상태 (loyal, curious) 로 나뉘어 있다고 가정하며, 이를 두 개의 [[Poisson point process]] mixture 로 모델링하여 상태를 표현합니다.

#### C.4.2.1) 관련 연구 (Related Work)

* **non-stationary MAB**
	* 대표적인 두 가지 클래스가 존재합니다: adversarial MAB 와 piece-wise stationary MAB
		* *adversarial MAB*: 적대자가 payoff 생성을 제어하는 경우
		* *piece-wise stationary MAB*: 특정 시간 구간 내에서 reward 생성이 stationary 인 경우

#### C.4.2.2) 문제 정의 (Problem Formulation)

* 두 개의 stochastic point process 를 혼합하여 모델링합니다.
	* **homogeneous Poisson process (HPP)**: intensity $\lambda(t)=\lambda_{L}$
		→ loyal audience 를 모델링
	* **piece-wise homogeneous Poisson process (PW-HPP)**: intensity $\lambda_{C}(t)$
		→ curious audience 를 모델링
		$m$ 개의 관찰되지 않은 임의 타임스탬프 $m_i, 1\leq i \leq n$ 에서 transition 이 발생한다고 가정합니다.
		각 $[m_j, m_{j+1}]$ 구간 내에는 고유한 intensity $c_j$ 가 존재합니다.
		중요한 가정은, $j$ 값에 따라 $c_j \ll \lambda_L$ 또는 $c_j \gg \lambda_L$ 인 상태가 번갈아 나타난다는 것입니다 (즉, 매우 낮거나 매우 높은 intensity).
* 각 타임스탬프 $t$ 에서 해당 상태는 binary 로 구분되며, 현재 가장 dominant 한 audience dynamic 에 의해 결정됩니다.
	* $s(t)=0$: calm
	* $s(t)=1$: bursty
	* 보다 정확하게는, $s(t)\equiv\max\left(i\mid m_i\leq t\right)\bmod2$

### C.4.3) Burst-induced MAB

#### C.4.3.1) [[Thompson sampling]]

* TS 알고리즘은 stationary stochastic MAB 문제에서 널리 사용되는 방법입니다.
	* Remark 1: 탐색 (exploration) 을 확률적으로 해결합니다.
	* Remark 2: arm $a$ 에 대한 beta 분포 파라미터가 $\alpha=\beta=1$ 일 때, $\theta\sim Uniform(0, 1)$ 분포를 따릅니다.

#### C.4.3.2) BMAB (Burst-induced Multi-Armed Bandit) 알고리즘

* 각 arm($K$ 개) 에 대해 두 개의 상태 (loyal & curious) 에 각각 beta 분포 (prior & posterior) 를 따로 유지합니다.
	* $\alpha_0,\ \beta_0 \in \mathbb{R}^K$, $\alpha_1,\ \beta_1 \in \mathbb{R}^K$
* ![[img-86a22a014b.png]]

#### C.4.3.3) 현실적인 상태 판별 (state detector)

##### C.4.3.3.1) Notation

* 타임스탬프 집합의 윈도우 크기:
  $\Delta_i = t_i - t_{i-\Delta+1}$
  ($i<\Delta$ 라면, $\Delta_i = t_i$)
* 신뢰도 파라미터 (confidence parameter) $\delta\in(0,1)$ 을 사용하는 [[Gamma distribution]] 의 [[quantile function]] 정의:

  $$



\mathbb{P}\left(X \leq q_\delta(\mu,\rho)\right) = 1-\delta

$$
   여기서 Gamma 분포 $X$는 shape이 $\mu$, scale이 $\rho$
   실험에서는 $\delta=0.95$로 설정함.

##### C.4.3.3.2) 이벤트 State 판별을 위한 [[hypothesis test]]
특정 시점($t_i$)에 발생한 이벤트가 어떤 state인지 판단하기 위해서는 다음과 같은 검정을 수행합니다:

타임스탬프 집합  
$\mathcal{T}_{\Delta,i} = \left\{t_{i-\Delta+1}, t_{i-\Delta+2}, ..., t_i\right\}$  
이 intensity $\lambda_L$인 uniform Poisson process에 의해 생성됐는지 판단.

즉,
$\Delta_i = t_i-t_{i-\Delta+1}$ 값이 shape $(\Delta-1)$ 및 scale $(\lambda_L)$인 [[Gamma distribution]]을 따른다는 것을 검증하게 됩니다.

![[img-c3138c599c.png]]

위와 같이 본 논문에서는 추천 시스템 환경 내 다양한 사용자 행동 패턴(loyal/curious)에 기반하여 발생하는 burst 현상을 수학적으로 모델링하고 이를 활용해 더욱 적응적인 Multi-Armed Bandit 전략(BMAB)을 제안하였습니다. 또한 현실적인 상황에서도 적용 가능한 상태 판별 기법으로 실용성을 높였습니다.n(0,1)$을 사용하는 [[Gamma distribution]]의 [[quant서 해당 상태는 binary로 구ationary M
