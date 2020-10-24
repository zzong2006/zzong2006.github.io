---
layout: default
title:  "Monte Carlo Methods (MC)"
parent: Reinforcement Learning
nav_order: 3
---

* 몬테 카를로 방법은 **경험(experience)**이 필요하다.
  * 경험이란, 환경과의 상호 작용을 통해 얻어지는 일련의 states, actions 그리고 rewards의 sample을 의미한다.
  * 환경에 대한 dynamics을 알 필요가 없기 때문에 매우 *striking*하다.
    * 반대로 DP는 다음 events에 대한 모든 확률 분포를 알아야된다.
  * 모델을 생성할 필요는 있다. 그렇지만 이것도 가능한 모든 transitions에 대한 확률 분포가 아닌 sample transitions에 의해 생성되기만 하면 된다. (DP랑 대비되는 부분)
* 몬테 카를로 방법은 평균 sample returns값을 이용하여 강화 학습 문제를 해결한다.
  * 그리고, 여기서는 terminal state가 있는 episodic task만 고려한다.

## Monte Carlo Prediction  

* 우선 몬테 카를로 방법으로 주어진 policy에 대한 state-value function을 찾는 것을 생각해보자.
  * state의 값은 expected return $G$값이다 (expected cumulative future discount reward).
  * experience에서 state값을 찾는 방법은 해당 state를 방문 하고나서 측정된 returns들의 평균을 구하는 것이다.
    * 만약 많은 returns들이 관찰된다면, 구해진 평균은 expected value에 수렴할 것이다.

### visit

* 한 episode에서 state $s$를 발견한 경우, 이를 a visit to $s$라고 한다.
  * 물론 $s$는 한 episode에서 여러번 visited 될 수 있다.
  * 한 episode에서 $s$를 처음 발견한 것은 first-visit 라고 한다.
* **first-visit MC** 방법은 처음 visit하는 $s$에 대해서 returns 의 평균값을 취해 $v_\pi(s)$를 계산한다.
  * ![image-20201022142040163](https://i.loli.net/2020/10/22/I6BxH9ePbOQaDkS.png)
* 반면, **every-visit MC** 방법은 어떤 $s$든 visit 할때마다 returns의 평균값을 취해  $v_\pi(s)$를 계산한다.
  * Every-visit MC 방법도 first-visit MC 방법과 큰 차이는 없다. 다만, $S_t$가 해당 에피소드에서 방문했는지 하지 않았는지 검사하지 않는다.

* 두 MC 방법은 모두 $s$에 대해 방문하는 횟수가 무한으로 증가할수록 $v_\pi(s)$가 수렴한다.
  * first-visit의 경우에는 각 return값은 유한한 variance $\sigma^2$를 가지는 $v_\pi(s)$의 추정값에 대해 **독립적**이고, identically distributed하다. 
    * 독립적이고 identically distributed (i.i.d.) 하다는 의미: 어떠한 랜덤 확률변수의 집합이 있을때, 각각의 랜덤 확률변수들은 자기 사건의 발생의 영향이 다른 랜덤 확률변수에게 미치지 않고, 동일한 분포를 가질때를 의미함
      * 예시) binomial distribution (성공 or 실패)를 가지는 동전던지기를 3회 실시한다고 가정하자. 각각의 시행은 이전이나 이후의 시행에 영향을 주지않는 독립시행이며 각각의 시행에서 나오는 동전의 앞,뒤에 대한 결과값의 분포는 동일한 binomial distribution를 따르기 때문에 이는 i.i.d.라고 할수 있다.
  * 큰 수의 법칙에 의해 이러한 추정값은 expected value 로 수렴하게 된다.
    * 큰 수의 법칙: 확률 변수의 무한열 $X_1, X_2, X_3, ...$이 모두 같은 기댓값 $μ$, 분산 $σ^2$을 가지고 서로 상관 관계가 없을 때(임의의 두 확률 변수 사이의 상관 계수가 0), 표본의 평균 ${\displaystyle {\overline {X}}_{n}=(X_{1}+\cdots +X_{n})/n}$ 이 $μ$로 수렴한다는 것


### DP vs MC

* one-step transitions을 통해 value를 update하는 DP diagram과 달리, MC는 terminal state까지의 trajectory를 확인하고 value를 estimate한다.
  * <img src="https://i.loli.net/2020/10/22/MDP9BWjQp4cb2Gy.png" alt="image-20201022153605293" style="zoom:50%;" />
* 또한, MC의 state에 대한 측정값은 독립적이다.
  * DP는 다른 어떤 state들을 확용하여 특정 state를 추정하려고 했다 (bootstrap)
  * 그러나, MC는 그렇지 않다.

## Monte Carlo Estimation of Action Values  

* 모델을 활용하는 것이 불가능하다면, state 값 대신, action 값(state와 action의 쌍으로 이루어진 값)을 추정하는 것이 유용하다.
  * DP 처럼 모델이 존재한다면, state value와 transition probability를 알기 때문에, $q$ 값을 이용해 policy를 결정하는것이 충분했다.

* MC의 궁극적인 목적은 $q_*$값을 추정하는 것이다 (policy evaluation for action values).
* policy evaluation for action values는 $q_\pi(s,a)$를 추정하는 것
  * $q_\pi(s,a)$ : $s$에서 $a$를 선택하고, $\pi$를 따랐을 때 얻을 수 있는 expected return 
  * $s,a$  pair의 visit: $s$를 visit하고 action $a$가 $s$에서 취해졌을 때 visit 한다고 말함

* 이러한 접근의 문제점은 대부분의 state-action pair의 값들은 visit되지 않을 수 있다는 것이다 (경우의 수가 너무 많아서).
  * 결과적으로, action 값을 비교해서 policy를 정해야되는데 그러지 못하는 불상사가 생긴다. 

## Monte Carlo Control

* DP와 비슷한 GPI(Generalized policy iteration) 방식으로 MC도 optimal policies를 approximate할 수 있다.

  * <img src="https://i.loli.net/2020/10/22/H8GIRZK3hUoVe9t.png" alt="image-20201022155541265" style="zoom: 67%;" />

  * $$
    \pi_{0} \stackrel{\mathrm{E}}{\longrightarrow} q_{\pi_{0}} \stackrel{\mathrm{I}}{\longrightarrow} \pi_{1} \stackrel{\mathrm{E}}{\longrightarrow} q_{\pi_{1}} \stackrel{\mathrm{I}}{\longrightarrow} \pi_{2} \stackrel{\mathrm{E}}{\longrightarrow} \cdots \stackrel{\mathrm{I}}{\longrightarrow} \pi_{*} \stackrel{\mathrm{E}}{\longrightarrow} q_{*}
    $$

    * $\stackrel{\mathrm{I}}{\longrightarrow}$ 는 complete policy improvement이고, $\stackrel{\mathrm{E}}{\longrightarrow}$ 는 complete policy evaluation이다.

### Policy Evaluation

* policy Evaluation은 first-visit MC prediction과 완전히 동일하게 수행된다.
* Policy Evaluation의 문제는 근사한 action-value를 찾기 위해서는 evaluation를 거의 무한히 반복해야된다는 것이다.
  * DP는 value-iteration 처럼 한번만 평가하고 improvement하던가, single state value를 평가할 때마다 improvement 하는 in-place 형식으로 진행했다 (아니면 policy-iteration에서 처럼 특정 threshold 미만이면 evaluation을 멈추던가).

### Policy improvement  

* action-value function $q_\pi$를 찾았기 때문에, 모든 $s \in \mathcal{S}$에 대해서, 바로 다음과 같은 action을 취하면 된다.

  * $$
    \pi(s) \doteq \arg \max _{a} q(s, a)
    $$

* 즉, $q_{\pi_{k}}$를 통해서 $\pi_{k+1}$을 찾으면 되는데, 이렇게 찾아진 $\pi_{k+1}$와 $\pi_k$의 관계는 모든 $s \in \mathcal{S}$에 대해서 다음과 같다.

  * $$
    \begin{aligned}
    q_{\pi_{k}}\left(s, \pi_{k+1}(s)\right) &=q_{\pi_{k}}\left(s, \underset{a}{\arg \max } q_{\pi_{k}}(s, a)\right) \\
    &=\max _{a} q_{\pi_{k}}(s, a) \\
    & \geq q_{\pi_{k}}\left(s, \pi_{k}(s)\right) \\
    & \geq v_{\pi_{k}}(s)
    \end{aligned}
    $$

### exploring starts

* Exploring starts는 GPI 방식을 진행할 때, $(s)$에서 시작하는 것이 아니라, $(s, a)$ 쌍에서 시작하는 것을 의미한다.
* MC에서 최적의 policy를 찾기 위해서는 모든 $(s,a)$ 를 무한히 visit 해야 한다.
* 결과적으로, exploring starts를 이용한 방법에는 반드시 모든 $(s, a)$가 무한히 visit할 수 있다는 보장이 필요하다.

### MC Exploring Starts

* MC는 episode마다 evaluation과 improvement를 번갈아 수행하는 것이 자연스럽다.

* 각 에피소드마다 관측된 returns값들은 evaluation과, 에피소드에서 마주친 모든 $s$ 에 대한 improvement에 사용된다.

* ![image-20201022162002317](https://i.loli.net/2020/10/22/13uXASDFh9ReZ67.png)

  * 여기서 exploring starts의 가정을 위해, 특정 state $s$에서 시작하는 것이 아니라, 임의의 $(s, a)$ pair에서 시작해서 episode를 진행한다. 
  * MC ES는 조금 비 효율적이다. 왜냐면, $G$ 를 저장하는 list를 계속 보관하면서 평균($Q\left(S_{t}, A_{t}\right) \leftarrow$ average $\left(\right.$Returns $\left.\left(S_{t}, A_{t}\right)\right)$)을 구하기 때문이다. (이를 조금만 수정하면 좋아질수있다) 

* MC ES는 궁극적으로 최적의 해에 도달하는데, 이를 공식적으로 증명하진 못했다.

  > If it did, then the value function would eventually converge to the value function for that policy, and that in turn would cause the policy to change.   

## Monte Carlo Control without Exploring Starts  

* Exploring starts는 모든 $(s, a)$ 를 무한히 확인해봐야 한다는 가정이 존재한다.
* 이러한 가정을 보장하는 방법으로는 on-policy 방법과 off-policy 방법이 존재한다.
  * On-policy 방법은 생성된 sample을 기반으로 policy improvement와 evaluate를 진행한다.
    * MC ES는 on-policy 방법의 example이다.
  * 반대로, off-policy 방법은 생성된 sample과 다른 것을 이용해 policy improvement와 evaluate를 진행한다.

### On-Policy

* On-policy 방법은 soft 성질을 가진다.
  
  * soft 성질이란, 항상 $\pi(a \mid s) > 0 $를 만족하지만, 점점 deterministic optimal policy에 접근하는 것을 의미한다.
* 이를 위한 방법으로 $\varepsilon$-greedy policies가 있다.
  * 대부분 action을 결정할 때, 추정된 action 값 중 최대 값에 해당하는 action을 고르지만, 확률 $\varepsilon$으로 임의의 행동을 선택한다.
  * 이 말은 모든 nongreedy 값에 대한 action은 최소한의 선택 확률이 존재한다는 것이다($\frac{\varepsilon}{\mid\mathcal{A}(s)\mid}$).
    * 즉, soft 성질을 만족한다: $\pi(a \mid s) \geq \frac{\varepsilon}{\mid\mathcal{A}(s)\mid}$

* ![image-20201022165158299](https://i.loli.net/2020/10/22/DnX7EsvSeuzT1io.png)
  * 참고로 $A^{*} \leftarrow \arg \max _{a} Q\left(S_{t}, a\right)$ 에 해당하는 action은 딱 하나로 정해졌기에 다음이 성립한다.

    * $$
      1 \cdot(1-\varepsilon+\varepsilon /\left|\mathcal{A}\left(S_{t}\right)\right|) + (1 -\left|\mathcal{A}\left(S_{t}\right)\right| )\cdot(\varepsilon /\left|\mathcal{A}\left(S_{t}\right)\right|) = 1
      $$

#### Policy improvement theorem of On-policy first-visit MC control   

* DP에서는 가장 큰 action-value에 해당하는 action을 선택하면 항상 최적의 policy로 수렴한다는 것이 보장됬다(policy improvement theorem). 

  * 위와 같은 알고리즘도 보장되는가?

* $\pi'$를 $\varepsilon$-greedy policy라 가정할 경우, 어떤 $s \in \mathcal{S}$에 대해서 policy improvement theorem이 다음과 같이 적용된다.

  * $$
    \begin{aligned}
    q_{\pi}\left(s, \pi^{\prime}(s)\right) &=\sum_{a} \pi^{\prime}(a \mid s) q_{\pi}(s, a) \\
    &=\frac{\varepsilon}{|\mathcal{A}(s)|} \sum_{a} q_{\pi}(s, a)+(1-\varepsilon) \max _{a} q_{\pi}(s, a) \\
    & \geq \frac{\varepsilon}{|\mathcal{A}(s)|} \sum_{a} q_{\pi}(s, a)+(1-\varepsilon) \sum_{a} \frac{\pi(a \mid s)-\frac{\varepsilon}{|\mathcal{A}(s)|}}{1-\varepsilon} q_{\pi}(s, a) \\
    
    &=\frac{\varepsilon}{|\mathcal{A}(s)|} \sum_{a} q_{\pi}(s, a)-\frac{\varepsilon}{|\mathcal{A}(s)|} \sum_{a} q_{\pi}(s, a)+\sum_{a} \pi(a \mid s) q_{\pi}(s, a) \\
    &=v_{\pi}(s)
    
    \end{aligned}
    $$

    *  $\sum_{a} \frac{\pi(a \mid s)-\frac{\varepsilon}{\mid\mathcal{A}(s)\mid}}{1-\varepsilon}$ 은 총합이 1이되는 음이 아닌 가중치를 적용한 평균이고, 이를 모두 더하면 1이 된다.  결과적으로, 최대값에 대한 평균보다는 반드시 작거나 같아야한다.

## Off-policy Prediction via Importance Sampling  

* Off-policy는 두가지 policy를 통한 전체 process를 의미한다. 
  1. target policy: optimal policy를 위해 최적의 행동을 찾아서 수행하는 정책
  2. behavior policy: 탐험적이고 다양한 sample(behavior)을 생성하기 위해 수행하는 정책

### 장/단점

* Off-policy는 서로 다른 정책으로 부터 학습하기 때문에 분산이 크고 수렴 속도가 느리다. 
* 그러나 더 일반적이고 강력하다.
  * 일반적(general): on-policy는 off-policy의 target과 behavior policy가 동일한 경우의 special case다.

### Off-policy prediction

* 두 policy, $\pi$ : target policy, $b$ : behavior policy가 존재
* $b$를 따른 에피소드를 통해 얻어진 samples로 $\pi$에 대한 values를 estimate해보자.
* 올바른 수렴(coverage)의 보장을 위해 $s$에서 수행되는 행동은 적어도 때때로 $b$에서도 행해져야 한다.
  * 즉, $\pi(a \mid s) > 0 $ 가 $b (a \mid s) > 0 $를 의미해야 한다.
* 해당 보장이 만족되면, 학습이 반복될수록, target policy는 a deterministic optimal policy가 되고, behavior policy는 stochastic and more exploratory한 policy가 된다.

### Importance sampling

* 대부분의 off-policy는 importance sampling(중요도 추출법)을 사용한다.

  * 이 방법은 어떤 분포로 얻어진 sample이 주어질때, 그 sample을 이용하여 또 다른 분포에서의 expected value를 추정하는 방법이다.
  * target 과 behavior policy를 통해 얻어지는 trajectory를 이용해 importance-sampling ratio라는 상대적 확률을 계산할 수 있다.
  * 이 확률에 따라 return 값에 가중치를 부여하는 방식으로 importance sampling을 수행할 수 있다.

* $S_t$에서 시작해서, policy $\pi$하에 발생하는 state-action trajectory ($A_{t}, S_{t+1}, A_{t+1}, \ldots, S_{T}$)에 대한 확률은 다음과 같다.

  * $$
    \begin{array}{l}
    \operatorname{Pr}\left\{A_{t}, S_{t+1}, A_{t+1}, \ldots, S_{T} \mid S_{t}, A_{t: T-1} \sim \pi\right\} \\
    \quad=\pi\left(A_{t} \mid S_{t}\right) p\left(S_{t+1} \mid S_{t}, A_{t}\right) \pi\left(A_{t+1} \mid S_{t+1}\right) \cdots p\left(S_{T} \mid S_{T-1}, A_{T-1}\right) \\
    \quad=\prod_{k=t}^{T-1} \pi\left(A_{k} \mid S_{k}\right) p\left(S_{k+1} \mid S_{k}, A_{k}\right)
    \end{array}
    $$
    * $p$는 state-transition probability function이다.

* 위 확률을 이용해서 얻어지는 target과 behavior polices의 relative probability는 다음과 같다.

  * $$
    \rho_{t: T-1} \doteq \frac{\prod_{k=t}^{T-1} \pi\left(A_{k} \mid S_{k}\right) p\left(S_{k+1} \mid S_{k}, A_{k}\right)}{\prod_{k=t}^{T-1} b\left(A_{k} \mid S_{k}\right) p\left(S_{k+1} \mid S_{k}, A_{k}\right)}=\prod_{k=t}^{T-1} \frac{\pi\left(A_{k} \mid S_{k}\right)}{b\left(A_{k} \mid S_{k}\right)}
    $$

  * $p$가 서로 동일하므로 서로 약분하여 사라지고, 결과적으로 importance-sampling ratio는 policy에 따른 결과에만 영향을 받는다.

* 원래는 target policy로 부터 expected returns값을 추정했지만, 이제는 behavior policy에 의한 returns $G_t$값만 있다.

  * 이 값은 $v_b(s)$를 계산할수는 있지만, $v_\pi$를 계산할 수는 없다. 이때, importance sampling을 활용한다.

  * $$
    \mathbb{E}\left[\rho_{t: T-1} G_{t} \mid S_{t}=s\right]=v_{\pi}(s)
    $$

#### Ordinary importance sampling

* $v_\pi(s)$를 추정하기 위해, scaling과 average를 적용한 $V(s)$의 정의는 다음과 같다.

  * $$
    V(s) \doteq \frac{\sum_{t \in \mathcal{T}(s)} \rho_{t: T(t)-1} G_{t}}{|\mathcal{T}(s)|}
    $$

    * $t$는 time step으로, episode에 관계없이 1부터 시작하는 자연수 값이다. 
    * 여기서 $\mathcal{T}(s)$ 는 상태 $s$를 visited한 모든 time steps의 집합을 의미한다.
    * $T(t)$는 $t$ 이후에 나타나는 최초의 termination time을 의미한다.
      *  예를 들어, $t=1$에서 시작해서 $t=100$에 끝난다면, $T(t)=100 \ (1\le t \le 100)$이다.


#### Weighted Importance sampling

* 가중치가 적용된 평균을 구하는 방법이다 (분모쪽이 다름).

  * $$
    V(s) \doteq \frac{\sum_{t \in \mathcal{T}(s)} \rho_{t: T(t)-1} G_{t}}{\sum_{t \in \mathcal{T}(s)} \rho_{t: T(t)-1}}
    $$

    * 분모가 0일 경우, 분자도 0이 된다.

#### First-visit methods for Ordinary vs Weighted

* Ordinary : bias가 없음, variance의 값이 매우 커질 수 있음(unbounded)
* Weighted : bias가 존재함 (하지만 학습하면서 수렴), variance가 작음

#### Every-visit methods for Ordinary vs Weighted

* Ordinary와 Weighted 상관없이 둘 다 편차가 존재함. (하지만 결국 0으로 수렴)

## Incremental Implementation  

* 이제 실제로 importance sampling을 이용해서 off-policy MC 를 구현하는 방법에 대해 알아보자.
* MC는 평균 returns을 활용하는 방법이라는 것을 기억하자.
  * 이러한 점은 평균 rewards를 활용하는 incremental methods와 비슷하다.

### Incremental Methods

* 다음과 같은 rewards의 평균 값 $Q_n$은 incremental method를 통해 효율적으로  구해질 수 있다.

* $$
   Q_{n} \doteq \frac{R_{1}+R_{2}+\cdots+R_{n-1}}{n-1}
  $$
	* $$
    \begin{aligned}
    Q_{n+1} &=\frac{1}{n} \sum_{i=1}^{n} R_{i} \\
    &=\frac{1}{n}\left(R_{n}+\sum_{i=1}^{n-1} R_{i}\right) \\
    &=\frac{1}{n}\left(R_{n}+(n-1) \frac{1}{n-1} \sum_{i=1}^{n-1} R_{i}\right) \\
    &=\frac{1}{n}\left(R_{n}+(n-1) Q_{n}\right) \\
    &=\frac{1}{n}\left(R_{n}+n Q_{n}-Q_{n}\right) \\
    &=Q_{n}+\frac{1}{n}\left[R_{n}-Q_{n}\right]
    \end{aligned}
    $$

* 위의 업데이트 방식은 다음과 같은 구조로 자주 사용되니 기억하도록 하자.

  * $$
    \begin{equation} 
    \text { NewEstimate } \leftarrow \text { OldEstimate }+\text { StepSize }[\text { Target }-\text { OldEstimate }]
    \end{equation}
    $$
    * $\begin{equation}
      [\text { Target }-\text { Old Estimate }]
      \end{equation}$는 추정의 오차로, 학습을 진행할수록 0에 가까워진다.

* 이제 MC 구현으로 돌아가서, 모두 같은 state에서 수행한 일련의 returns값 $G_{1}, G_{2}, \ldots, G_{n-1}$이 존재하고, 임의의 가중치 $W_i$ (e.g. $W_{i}=\rho_{t_{i}: T\left(t_{i}\right)-1}$)가 존재한다고 하자. 

  * 이들을 이용해서 $V_n$을 다음과 같이 추정한다 (weighted 방식).

  * $$
    V_{n} \doteq \frac{\sum_{k=1}^{n-1} W_{k} G_{k}}{\sum_{k=1}^{n-1} W_{k}}, \quad n \geq 2
    $$
  
* 그리고 $V_{n+1}$을 구하는 것은 다음과 같이 계산된다.

   * $$
      V_{n+1} \doteq V_{n}+\frac{W_{n}}{C_{n}}\left[G_{n}-V_{n}\right], \quad n \geq 1
      $$

   * $$
      C_{n+1} \doteq C_{n}+W_{n+1}
      $$

   * $C_n$은 $n$개의 returns에 주어지는 가중치의 누적합을 의미하고, $C_0=0$이다. 

      * (또한 $V_n$은 임의의 값으로 처리해도 무방함)

* ![image-20201022204431508](https://i.loli.net/2020/10/22/z7rgThXm2Hi3Aqy.png)

   * 위 알고리즘은 weighted importance sampling을 이용한 off-policy 방법이지만, target과 behavior policy를 동일하게 만든 on-policy 경우에도 동일하게 먹힌다.
      * 이 경우 $\pi=b$이고, $W$는 항상 1이다.
   * $b$가 $\pi$와 다른 정책을 통해 모든 action이 선택되는 동안 근사 $Q$ 값은 $q_\pi$에 수렴한다.

## Off-policy Monte Carlo Control  

* 근사 $q_\pi$를 찾았다면, 이를 활용하여 policy $\pi$ 를 update하는 control을 살펴보자.
* Control 방법은 behavior policy를 따르고 target policy를 improve한다.
  * behavior policy는 target policy가 선택할 수 있는 모든 actions들을 수행할 확률이 있어야 한다. (soft policy: all actions in all states with nonzero probability)
* ![image-20201022210157822](https://i.loli.net/2020/10/22/XCLWqB38S1iPhmK.png)
  * weighted importance sampling과 GPI 에 기반한 control method  
  * 이전의 policy evaluation과 달리 control은 $W$ update를 위해서 $\frac{\pi\left(A_{t} \mid S_{t}\right)}{b\left(A_{t} \mid S_{t}\right)}$ 대신 $\frac{1}{b\left(A_{t} \mid S_{t}\right)}$ 를 곱한다. 
    * 이래도 올바르게 동작하는 이유는 $W$가 $A_t=\pi(S_t)$의 경우에만 업데이트 될 뿐더러, $\pi$가 deterministic하므로 $\pi(A_t \mid S_t)=1$로 설정해도 $W$ 업데이트에 문제가 없다.
      * $W$가 $A_t=\pi(S_t)$의 경우에만 업데이트되는 이유는 target policy와 behavior policy가 동일한 action을 취하는 경우기 때문에
    * 만약,  $A_t \neq \pi(S_t)$ 조건을 지웠다면 $W$ 업데이트 방식도 이전과 동일해야한다. 
  * 실제 구현을 해보니 이전의 evaluation version이 훨씬 수렴성이 좋다.