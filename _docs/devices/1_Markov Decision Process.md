---
layout: default
title:  "Markov Decision Process (MDP)"
category: Reinforcement Learning
order: 1
---

# MDP

![image-20201021193635194](https://i.loli.net/2020/10/21/8yVZe96DBAClqJE.png)

* 구성 요소
  * States : $S_{t} \in \mathcal{S}$
  * Action: $A_{t} \in \mathcal{A}(s)$
  * Reward : $R_{t+1} \in \mathcal{R} \subset \mathbb{R}$
* MDP의 time $t$는 굳이 시간에 대한 개념이 아니라 stages로 생각하면 좋다.
  * states 역시 다양한 형태로 존재할 수 있음

----

## $p$ : dynamics of the MDP

* $$
  p\left(s^{\prime}, r \mid s, a\right) \doteq \operatorname{Pr}\left\{S_{t}=s^{\prime}, R_{t}=r \mid S_{t-1}=s, A_{t-1}=a\right\}
  $$

* $t$ 시간에서 $a$를 통해 $s$에서 $s'$으로 옮겨서 $r$을 받을 확률

* $ \doteq $ 는 definition 이라는 뜻

* 가능한 모든 $p$를 더하면 1이됨

  * $$
    \sum_{s^{\prime} \in \mathcal{S}} \sum_{r \in \mathcal{R}} p\left(s^{\prime}, r \mid s, a\right)=1, \text { for all } s \in \mathcal{S}, a \in \mathcal{A}(s)
    $$

## Markov property

* MDP의 $S_t$와 $A_t$는 무조건 $S_{t-1}$와 $A_{t-1}$에 의해서만 영향을 받음



## state-transition probabilities

* $$
  p\left(s^{\prime} \mid s, a\right) \doteq \operatorname{Pr}\left\{S_{t}=s^{\prime} \mid S_{t-1}=s, A_{t-1}=a\right\}=\sum_{r \in \mathcal{R}} p\left(s^{\prime}, r \mid s, a\right)
  $$

* dynamics of the MDP의 three-arguments 버전 ($s'$에서 받을 수 있는 reward에 대한 확률을 다 합친 것임)



## Expected rewards

* $$
  r(s, a) \doteq \mathbb{E}\left[R_{t} \mid S_{t-1}=s, A_{t-1}=a\right]=\sum_{r \in \mathcal{R}} r \sum_{s^{\prime} \in \mathcal{S}} p\left(s^{\prime}, r \mid s, a\right)
  $$

* $s$에서 $a$를 수행했을 때, 받을 수 있는 reward의 기댓값

* $s$에서 $a$를 수행하여 $s'$로 이동했을 때, 받을 수 있는 reward의 기댓값 $r(s,a,s')$는 다음과 같음

  * $$
    r\left(s, a, s^{\prime}\right) \doteq \mathbb{E}\left[R_{t} \mid S_{t-1}=s, A_{t-1}=a, S_{t}=s^{\prime}\right]=\sum_{r \in \mathcal{R}} r \frac{p\left(s^{\prime}, r \mid s, a\right)}{p\left(s^{\prime} \mid s, a\right)}
    $$

## Expected Return

* agent의 목표는 누적 보상이 최대화 되도록 하는 것

  * 즉, maximize expected return

* 끝이 있는 학습(episode가 존재하는 학습, episodic tasks)에서는 return $G_t$ 다음과 같이 표현될 수 있음

  * $$
    G_{t} \doteq R_{t+1}+R_{t+2}+R_{t+3}+\cdots+R_{T}
    $$


* 만약 끝이 없는 학습 (continuing tasks)에서는 보상값이 무한대로 치솟을 수 있음 

  * 이를 막기 위해 discounting return $G_t$가 등장함
  
  * 
    $$
    G_{t} \doteq R_{t+1}+\gamma R_{t+2}+\gamma^{2} R_{t+3}+\cdots=\sum_{k=0}^{\infty} \gamma^{k} R_{t+k+1}
    $$
    
    * 여기서 $\gamma$는 감가율 discount factor라 부름 ($0 \leq \gamma \leq 1$)
    
  * 좀 더 general 하게 다음과 같이 쓴다.
  
    * $$
      G_{t} \doteq \sum_{k=t+1}^{T} \gamma^{k-t-1} R_{k}
      $$
  
* $G_t$는 다음과 같이 decompose될 수 있음

  * $$
    \begin{aligned}
    G_{t} & \doteq R_{t+1}+\gamma R_{t+2}+\gamma^{2} R_{t+3}+\gamma^{3} R_{t+4}+\cdots \\
    &=R_{t+1}+\gamma\left(R_{t+2}+\gamma R_{t+3}+\gamma^{2} R_{t+4}+\cdots\right) \\
    &=R_{t+1}+\gamma G_{t+1}
    \end{aligned}
    $$

* 만약 보상이 1인 경우, 무한대의 시간이 흐르면?

  * $$
    G_{t}=\sum_{k=0}^{\infty} \gamma^{k}=\frac{1}{1-\gamma}
    $$

## Value function

* state $s$에서 policy $\pi$를 따를 경우의 **state value function**은 $v_{\pi}(s)$다.

  * $$
    v_{\pi}(s) \doteq \mathbb{E}_{\pi}\left[G_{t} \mid S_{t}=s\right]=\mathbb{E}_{\pi}\left[\sum_{k=0}^{\infty} \gamma^{k} R_{t+k+1} \mid S_{t}=s\right], \text { for all } s \in \mathcal{S}
    $$

  * terminal state의 $v_{\pi}(s)$값은 항상 $0$임을 기억하자.

* 비슷하게, $s$에서 $\pi$를 따르는 경우 $a$를 취할 때의 **action value function** $q_{\pi}(s,a)$는 다음과 같이 정의된다.

  * $$
    q_{\pi}(s, a) \doteq \mathbb{E}_{\pi}\left[G_{t} \mid S_{t}=s, A_{t}=a\right]=\mathbb{E}_{\pi}\left[\sum_{k=0}^{\infty} \gamma^{k} R_{t+k+1} \mid S_{t}=s, A_{t}=a\right]
    $$


* 위 둘의 function간 recursive 관계는 매우 중요하다.

  * $$
    \begin{aligned}
    v_{\pi}(s) & \doteq \mathbb{E}_{\pi}\left[G_{t} \mid S_{t}=s\right] \\
    &=\mathbb{E}_{\pi}\left[R_{t+1}+\gamma G_{t+1} \mid S_{t}=s\right] \\
    &=\sum_{a} \pi(a \mid s) \sum_{s^{\prime}} \sum_{r} p\left(s^{\prime}, r \mid s, a\right)\left[r+\gamma \mathbb{E}_{\pi}\left[G_{t+1} \mid S_{t+1}=s^{\prime}\right]\right] \\
    &=\sum_{a} \pi(a \mid s) \sum_{s^{\prime}, r} p\left(s^{\prime}, r \mid s, a\right)\left[r+\gamma v_{\pi}\left(s^{\prime}\right)\right]\\
    &=\mathbb{E}_{\pi}\left[R_{t+1}+\gamma v_{\pi}\left(S_{t+1}\right) \mid S_{t}=s\right], \quad \text { for all } s \in \mathcal{S}
    \end{aligned}
  $$
  
  * 위의 가장 마지막 수식을 **Bellman equation**이라 한다.

  * Expectation을 구하는 것이기 때문에, 발생할 수 있는 모든 경우의 확률을 구하는 것이 필요하다.

    * <img src="https://i.loli.net/2020/10/21/12Ro8XmtY7ibpQ9.png" alt="image-20201021204722687" style="zoom:67%;" />
  * 그래서 위의 그림(backup diagrams)처럼 $a$에 대해서, $s'$에 대해서, $r$에 대해서, 총 3개에 대한 확률을 구할 필요가 있다 ($\pi(a \mid s) p\left(s^{\prime}, r \mid s, a\right)$)
  
    > the value of the start state ($s$) must equal the (discounted) value of the expected next state ($s'$), plus the reward expected along the way.  

* $v_\pi(s)$와 $q_\pi(s,a)$의 의존관계는 다음과 같이 표현될 수 있다.

  * ![image-20201021212620725](https://i.loli.net/2020/10/21/mVIjl64PhtcEwp7.png)
  * <img src="https://i.loli.net/2020/10/21/pJiMYoeW9FVrCbB.png" alt="image-20201021212739572" style="zoom:75%;" />

## Optimal Value function

* optimal state-value function

  * $$
    v_{*}(s) \doteq \max _{\pi} v_{\pi}(s)
    $$

  * 최적의 policy $\pi_*$에 대한 state value function

  * $\pi_\ast$는 모든 policy $\pi$에 대해서 $\pi_\ast \ge \pi $를 만족한다.

    * $\pi \geq \pi^{\prime}$ if and only if $v_{\pi}(s) \geq v_{\pi^{\prime}}(s)$ for all $s \in \mathcal{S}$

* optimal action-value function

  * $$
    q_{*}(s, a) \doteq \max _{\pi} q_{\pi}(s, a)
    $$

## Bellman optimality Equation

* 위 둘의 관계는 다음과 같이 표현된다.

  * $$
    q_{\ast}(s, a)=\mathbb{E}\left[R_{t+1}+\gamma v_{*}\left(S_{t+1}\right) \mid S_{t}=s, A_{t}=a\right]
    $$

  * $s$에서 $a$를 수행한 뒤, optimal policy를 따랐을 때, 얻을 수 있는 expected return

* optimal policy를 따르는 state에서의 value는 반드시 그 state에서 best action을 취했을 때 얻어지는 expected return과 같다.

  * $$
    \begin{aligned}
    v_{*}(s) &=\max _{a \in \mathcal{A}(s)} q_{\pi_{*}}(s, a) \\
    &=\max _{a} \mathbb{E}_{\pi_{*}}\left[G_{t} \mid S_{t}=s, A_{t}=a\right] \\
    &=\max _{a} \mathbb{E}_{\pi_{*}}\left[R_{t+1}+\gamma G_{t+1} \mid S_{t}=s, A_{t}=a\right] \\
    &=\max _{a} \mathbb{E}\left[R_{t+1}+\gamma v_{*}\left(S_{t+1}\right) \mid S_{t}=s, A_{t}=a\right] \\
    &=\max _{a} \sum_{s^{\prime}, r} p\left(s^{\prime}, r \mid s, a\right)\left[r+\gamma v_{*}\left(s^{\prime}\right)\right]
    \end{aligned}
    $$

    * 여기서 $\max_{a} \mathbb{E}_{\pi_{\ast}}[R_{t+1}+\gamma G_{t+1} \mid S_{t}=s, A_{t}=a]$ 이 값은 이전에 수식을 활용하여 유도된다.

      * $$
        \begin{aligned}
        G_{t} & \doteq R_{t+1}+\gamma R_{t+2}+\gamma^{2} R_{t+3}+\gamma^{3} R_{t+4}+\cdots \\
        &=R_{t+1}+\gamma\left(R_{t+2}+\gamma R_{t+3}+\gamma^{2} R_{t+4}+\cdots\right) \\
        &=R_{t+1}+\gamma G_{t+1}
        \end{aligned}
        $$

    * 마지막 두 방정식은 $v_*(s)$에 대한 bellman optimality equation이라 부른다.

* $q_*$에 대한 bellman optimality equation은 다음과 같다.

  * $$
    \begin{aligned}
    q_{*}(s, a) &=\mathbb{E}\left[R_{t+1}+\gamma \max _{a^{\prime}} q_{*}\left(S_{t+1}, a^{\prime}\right) \mid S_{t}=s, A_{t}=a\right] \\
    &=\sum_{s^{\prime}, r} p\left(s^{\prime}, r \mid s, a\right)\left[r+\gamma \max _{a^{\prime}}q_{*}\left(s^{\prime}, a^{\prime}\right)\right]
    \end{aligned}
    $$

* <img src="https://i.loli.net/2020/10/21/ixHBJoLt21Pn9jF.png" alt="image-20201021220255226" style="zoom:80%;" />

* Bellman optimality equation을 푸는 것은 optimal policy를 찾는데 사용할 수 있다.

  * 하지만 실제로는 그렇게 유용하지 못하다. 왜냐하면 다음과 같은 세가지 조건이 만족되야 하기 때문이다.

  1. 환경에 대한 dynamics를 정확히 알아야 한다(확률들).
  2. 계산을 위한 충분한 자원이 있어야 할 것
  3. state가 Markov property를 따를 것

  * 예를 들어 벡가몬 게임의 경우 (1), (3)은 만족하지만 (2)의 경우 $10^{20}$에 대한 경우의 수를 처리해야 한다.
