---
layout: default
title:  "Dynamic Programming (DP)"
category: Reinforcement Learning
order: 2
---

* DP는 MDP와 같은 환경에 대한 완벽한 모델이 주어졌을 때 사용하는 알고리즘의 총칭
* 모든 강화학습 방법은 DP를 얼마나 효율적으로 수행하는지에 대한 접근이라고 봐도 좋음
  * with less computation and without assuming a perfect model of the environment

## Policy Evaluation (Prediction)

* 우선 임의의 policy $\pi$에 대해서 어떻게 state-value function $v_\pi$를 계산할지 생각해보자.

  * 이러한 계산을 **policy evaluation**이라 부른다.

* 우선, state value function을 생각해보자 (for all $s \in \mathcal{S}$).

  * $$
    \begin{aligned}
    v_{\pi}(s) & \doteq \mathbb{E}_{\pi}\left[G_{t} \mid S_{t}=s\right] \\
    &=\mathbb{E}_{\pi}\left[R_{t+1}+\gamma G_{t+1} \mid S_{t}=s\right] \\
    &=\mathbb{E}_{\pi}\left[R_{t+1}+\gamma v_{\pi}\left(S_{t+1}\right) \mid S_{t}=s\right] \\
    &=\sum_{a} \pi(a \mid s) \sum_{s^{\prime}, r} p\left(s^{\prime}, r \mid s, a\right)\left[r+\gamma v_{\pi}\left(s^{\prime}\right)\right]
    \end{aligned}
    $$

  * $\gamma <1$를 만족하거나 terminate state 가 존재할 경우 반드시 $v_\pi$의 값과 uniqueness는 존재한다.

* 반복적인 솔루션(iterative policy evaluation)을 통해 state value function을 찾아낼 수 있다. 

  * 즉 $v_0(s)$를 통해 $v_1(s)$를 찾고, $v_1(s)$를 통해 $v_2(s)$ 를 찾고 ... 

  * $$
    \begin{aligned}
    v_{k+1}(s) & \doteq \mathbb{E}_{\pi}\left[R_{t+1}+\gamma v_{k}\left(S_{t+1}\right) \mid S_{t}=s\right] \\
    &=\sum_{a} \pi(a \mid s) \sum_{s^{\prime}, r} p\left(s^{\prime}, r \mid s, a\right)\left[r+\gamma v_{k}\left(s^{\prime}\right)\right]
    \end{aligned}
    $$

  * 여기서 $k=0$일 경우는 임의의 값으로 정한다(일반적으로 $v_0(s)=0$이다.)

* ![image-20201021230717161](https://i.loli.net/2020/10/21/a2IZTniG8OmtyWv.png)

  * 위 알고리즘에 대한 구현에는 $v_k(s)$ 그리고 $v_{k+1}(s)$를 위한 두 가지 array를 사용한다.
  * 그런데, 하나의 array를 사용해서 즉석으로 바꾸는 방법도 있다. 이런 경우 가끔 더 빠르게 converge 한다.

## Policy Improvement  

* policy에 대한 value function을 계산하는 것은 더욱 나은 polices를 찾기 위함이다.

* Evaluation을 통해 $v_\pi$를 찾았다고 가정해보자. policy를 바꾸는 것이 좋은 것인가? 아니면 냅두는 것이 좋은가? 

  * $v_\pi(s)$는 $s$에 대해서 $\pi$를 따르는게 좋은것인지 아닌지를 나타낸다. 

* 가장 일반적인 방법은 $s$에 대해서 최적의 $a$를 고르고, $\pi$를 따른다. 이러한 경우의 value는 다음과 같이 계산된다.

  * $$
    \begin{aligned}
    q_{\pi}(s, a) & \doteq \mathbb{E}\left[R_{t+1}+\gamma v_{\pi}\left(S_{t+1}\right) \mid S_{t}=s, A_{t}=a\right] \\
    &=\sum_{s^{\prime}, r} p\left(s^{\prime}, r \mid s, a\right)\left[r+\gamma v_{\pi}\left(s^{\prime}\right)\right]
    \end{aligned}
    $$

* 문제는 이런 방법을 통해 얻어진 $v_\pi'(s)$가 기존의 $v_\pi(s)$ ($a$를 고르지 않고 그냥 $\pi$를 따르는 방법의 value)보다 큰지 작은지 알아야 된다는 것이다.

#### Policy improvement theorem

* 만약 어떤 두 policy $\pi$와 $\pi'$가 존재하고, 모든 $s \in \mathcal{S}$에 대해서 다음을 만족한다고 하자.

  * $$
    q_{\pi}\left(s, \pi^{\prime}(s)\right) \geq v_{\pi}(s)
    $$

* 그렇다면 $\pi'$는 $\pi$보다 반드시 모든 $s \in \mathcal{S}$에 대해서 better or 같은 policy다.

  * $$
    v_{\pi^{\prime}}(s) \geq v_{\pi}(s)
    $$

* 두 policy의 차이는 $s$에 대해서만 존재한다. 즉, $\pi^{\prime}(s)=a \neq \pi(s)$ 를 제외하고 나머지는 같다.

  * 그러므로, $q_{\pi}(s, a)>v_{\pi}(s)$ 를 만족한다면 당연히 $\pi'$는 $\pi$ 보다 좋은 policy이다.

* 증명은 다음과 같다. $ q_{\pi}\left(s, \pi^{\prime}(s)\right) \geq v_{\pi}(s)$ 의 성질을 이용하여 계속 확장해 나가면서 $v_\pi'(s)$로 수렴할때 까지 계산하면 된다.

  * $$
    \begin{aligned}
    v_{\pi}(s) & \leq q_{\pi}\left(s, \pi^{\prime}(s)\right) \\
    &=\mathbb{E}\left[R_{t+1}+\gamma v_{\pi}\left(S_{t+1}\right) \mid S_{t}=s, A_{t}=\pi^{\prime}(s)\right] \\
    &=\mathbb{E}_{\pi^{\prime}}\left[R_{t+1}+\gamma v_{\pi}\left(S_{t+1}\right) \mid S_{t}=s\right] \\
    & \leq \mathbb{E}_{\pi^{\prime}}\left[R_{t+1}+\gamma q_{\pi}\left(S_{t+1}, \pi^{\prime}\left(S_{t+1}\right)\right) \mid S_{t}=s\right] \\
    &=\mathbb{E}_{\pi^{\prime}}\left[R_{t+1}+\gamma \mathbb{E}\left[R_{t+2}+\gamma v_{\pi}\left(S_{t+2}\right) \mid S_{t+1}, A_{t+1}=\pi^{\prime}\left(S_{t+1}\right)\right] \mid S_{t}=s\right] \\
    &=\mathbb{E}_{\pi^{\prime}}\left[R_{t+1}+\gamma R_{t+2}+\gamma^{2} v_{\pi}\left(S_{t+2}\right) \mid S_{t}=s\right] \\
    & \leq \mathbb{E}_{\pi^{\prime}}\left[R_{t+1}+\gamma R_{t+2}+\gamma^{2} R_{t+3}+\gamma^{3} v_{\pi}\left(S_{t+3}\right) \mid S_{t}=s\right] \\
    \vdots & \\
    & \leq \mathbb{E}_{\pi^{\prime}}\left[R_{t+1}+\gamma R_{t+2}+\gamma^{2} R_{t+3}+\gamma^{3} R_{t+4}+\cdots \mid S_{t}=s\right] \\
    &=v_{\pi^{\prime}}(s)
    \end{aligned}
    $$

* 위 증명을 통해서 알 수 있는 것은 가장 큰  $q_\pi(s,a)$를 만족하는 $a$를 선택하기만 해도 $\pi'$를 찾아낼 수 있다는 것이다 (다시 강조하지만, $q_{\pi}\left(s, \pi^{\prime}(s)\right) \geq v_{\pi}(s)$ 의 가정에서 시작했으니까 그렇다는 것이다.).

* 이러한 결론은 다음과 같은 greedy policy $\pi'$의 전략으로 귀결된다.

  * $$
    \begin{aligned}
    \pi^{\prime}(s) & \doteq \underset{a}{\arg \max } \ q_{\pi}(s, a) \\
    &=\underset{a}{\arg \max } \ \mathbb{E}\left[R_{t+1}+\gamma v_{\pi}\left(S_{t+1}\right) \mid S_{t}=s, A_{t}=a\right] \\
    &=\underset{a}{\arg \max } \sum_{s^{\prime}, r} p\left(s^{\prime}, r \mid s, a\right)\left[r+\gamma v_{\pi}\left(s^{\prime}\right)\right]
    \end{aligned}
    $$

    * $\mathbb{argmax}_{a}$는 가장 큰 값을 가지는 $a$의 값을 의미한다(동일한 경우 임의로 선택).
    * 다수의 action이 허용되는 stochastic case에서는 하나만 선택하지 않고, 동일한  $q$ value값을 가지는 모든 $a$에 대해 비율을 나눠준다. (예를 들어 grid의 경우 동서남북 중, 남북이 같다면 0.5, 0.5 비율로)

* 이렇게 기존의 policy에 대한 value function을 이용하여 greedy하게 action을 선택하는 방법을 **policy improvement** 라고 한다. 

* $\pi$와 $\pi'$이 서로 같다고 해보자. 즉, $v_{\pi}=v_{\pi^{\prime}}$ 인 경우, 모든 $s \in \mathcal{S}$ 에 대해서 다음을 만족한다.

  * $$
    \begin{aligned}
    v_{\pi^{\prime}}(s) &=\max _{a} \mathbb{E}\left[R_{t+1}+\gamma v_{\pi^{\prime}}\left(S_{t+1}\right) \mid S_{t}=s, A_{t}=a\right] \\
    &=\max _{a} \sum_{s^{\prime}, r} p\left(s^{\prime}, r \mid s, a\right)\left[r+\gamma v_{\pi^{\prime}}\left(s^{\prime}\right)\right]
    \end{aligned}
    $$

  * 그런데, 위의 식은 그냥 Bellman optimality equation이다. 즉, $v_\pi'$ 는 반드시 $v_*$가 된다.

## Policy Iteration

$$
\pi_{0} \stackrel{\mathrm{E}}{\longrightarrow} v_{\pi_{0}} \stackrel{\mathrm{I}}{\longrightarrow} \pi_{1} \stackrel{\mathrm{E}}{\longrightarrow} v_{\pi_{1}} \stackrel{\mathrm{I}}{\longrightarrow} \pi_{2} \stackrel{\mathrm{E}}{\longrightarrow} \cdots \stackrel{\mathrm{I}}{\longrightarrow} \pi_{*} \stackrel{\mathrm{E}}{\longrightarrow} v_{*}
$$

* 위와 같은 방식으로 optimal policy를 찾아나가는 것이 policy iteration이다.
  * $\mathrm{E}$는 evaluation 그리고 $\mathrm{I}$ 은 improvement다.
* ![image-20201022003841657](https://i.loli.net/2020/10/21/1KLVos9kdpv7iDl.png)

## Value Iteration

* policy iteration의 단점은 매 iteration마다 policy evaluation이 포함된다는 것

* policy evaluation을 한번만 수행(one sweep)하고 중단하는 것을 value iteration이라고 부른다.

* value iteration은 모든 $s \in \mathcal{S}$에 대하여 다음과 같이 수행된다.

  * $$
    \begin{aligned}
    v_{k+1}(s) & \doteq \max _{a} \mathbb{E}\left[R_{t+1}+\gamma v_{k}\left(S_{t+1}\right) \mid S_{t}=s, A_{t}=a\right] \\
    &=\max _{a} \sum_{s^{\prime}, r} p\left(s^{\prime}, r \mid s, a\right)\left[r+\gamma v_{k}\left(s^{\prime}\right)\right]
    \end{aligned}
    $$

  * 위 식은 bellman optimality equation과 거의 동일하다는 점이다.

  * $$
    \begin{aligned}
    v_{*}(s) 
    &=\max _{a} \sum_{s^{\prime}, r} p\left(s^{\prime}, r \mid s, a\right)\left[r+\gamma v_{*}\left(s^{\prime}\right)\right]
    \end{aligned}
    $$

  * 게다가 policy evaluation에서 argmax 부분을 제외하면 매우 동일하다.

  * $$
    \begin{aligned}
    \pi^{\prime}(s) \doteq 
    
    \underset{a}{\arg \max } \sum_{s^{\prime}, r} p\left(s^{\prime}, r \mid s, a\right)\left[r+\gamma v_{\pi}\left(s^{\prime}\right)\right]
    \end{aligned}
    $$

* policy iteration과 마찬가지로 value iteration도 정확히 $v_*$로 수렴하기 위해서 형식적으로는 무한번의 반복이 필요하다. 하지만 실제로는 거의 한번 정도의 수행으로 멈춘다.

* ![image-20201022004354693](https://i.loli.net/2020/10/21/PXHEnV8h3mTviOR.png)

## Asynchronous Dynamic Programming  

* 지금까지 살펴본 것은 synchronous DP (동기 DP)였음
* 이러한 DP 방법들의 단점은 state set 전체에 대한 sweeps이 필요하다는 것임 (policy evaluation)
* Asynchronous(비동기) DP는 state의 value 값의 갱신 여부에 관계없이 다른 state의 value가 available 할 경우, 바로 사용함

### Bootstrapping

* value 값 $v$를 업데이트 하기 위해서는 이전 상태에 대한 값의 추정을 통해 진행했다.
* 이렇게 이전의 추정을 활용하여 추정 값을 계산하는 과정을 bootstrapping 이라 한다. 
* 많은 강화학습 방법은 DP에 요구되는 완전하고 정확한 환경 모델없이도 bootstrap을 수행한다.