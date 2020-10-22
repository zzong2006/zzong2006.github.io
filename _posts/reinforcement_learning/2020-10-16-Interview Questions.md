---
layout: post
title:  "Reinforcement learning: Interview Questions"
date:   2020-10-14 22:55:30 +0900
categories: deeplearning
series: 99
---

## 1. 지도학습, 비지도 학습과 비교하여 강화학습이 다른 점은 무엇인가? 

### 지도학습 vs 강화학습

* 지도학습
  * 학습 데이터가 적절히 분류된(labeled) 데이터를 제공받는다.
  * 학습된 데이터를 통해 학습함으로써 새로운 입력에 대해서도 적절한 출력을 보이리라 기대한다.
* 강화학습
  * labeled 데이터가 아닌 환경과의 상호 작용을 통해 얻은 reward로부터 학습한다.

### 비지도학습 vs 강화학습

* 비지도학습
  * unlabeled 데이터의 hidden structure를 찾는 것을 목표로 한다.
* 강화학습
  * 보상을 최대화하는 것을 목표로 한다.

### 강화학습 특징 (Exploration vs Exploitation)

* Exploration: 현재보다 더 좋은 보상을 얻을 가능성이 있는 다른 options(policies/actions)을 시도
* Exploitation:  현재 가장 최적의 보상을 얻을 수 있는 policies나 actions을 유지함

## 2.마코프결정문제(MDP)를 정의하시오.

* Markov Decision Process(MDP)는 의사결정 과정을 확률과 그래프를 이용하여 모델링한 확률(stochastic) 모델

* 시간 $t$에서의 상태는 $t−1$에서의 상태에만 영향을 받는다는 Markovian Property를 기반으로 함

  * 이를 First-Order Markov Process라고한다. (만약 $t-2$까지면 Second-Order)

* <State $S$, Action $A$ , transition probability $P$, Reward $R$, discount factor $\gamma$> 라는 tuple로 정의됨
  
  * Transition probability $P$:  현재 상태 $s$에서 $a$라는 행동을 취할 때 $s′$로 이동할 확률($p(s′ \mid s, a)$)을 모아놓은 집합을 의미 
  * Action $A$: 각 상태(state)에서 다른 상태(state)로의 이동시, 수행하는 행위
  * Discount factor $γ$: 현재 보상이 이전 보상보다 더 낫다는 것을 표현, 일반적으로 0과 1사이의 값
  * <img src="https://i.loli.net/2020/10/18/YUcJXKkubpHvw7F.png" alt="image-20201018133111202" style="zoom: 50%;" />
  
* #### Markov Chain

  * State와 transition probability만 있는 확률 모델
  * MDP의 기반이 됨
  * ![Markov-cheese-lettuce-grapes.svg](https://i.loli.net/2020/10/18/q3HkPaWvoghsMRl.png)

### 3. MDP 문제 해결을 위한 방법으로서의 강화학습을 설명하시오. 

* 강화 학습은 MDP에서 optimal policy를 찾기 위한 학습을 의미한다.

* policy $\pi$란, 주어진 states에 대해 가능한 actions들에 대한 확률 분포를 의미한다.

  * $$
    \pi(a|s)= \mathbb{P}[A_t=a|S_t=s]
    $$

* 그리고 optimal policy $\pi^*$란, accumulative reward(return $G_t$)를 최대화 하는 policy를 의미한다.

  * 시점 $t$에서 return $G_t$란, $t$에서 부터 얻을 수 있는 discounted reward의 총합을 의미한다.

    * $$
      G_t=R_{t+1}+\gamma R_{t+2} +\dots=\sum^{\infty}_{k=0}\gamma^k R_{t+k+1}
      $$

* #### Value Function

  * 상태 가치 함수(state value function, $v(s)$)은 상태 $s$에서부터 얻을 수 있는 expected return 값을 의미한다.

  * $$
    v(s) = \mathbb{E}[G_t \mid S_t=s]
    $$

    * 즉, $v(s)$를 찾기 위해서는 $s$ 부터 시작해서 무한히 실행해보고 그것의 expectation을 구해야 한다.
  
  * 위 state-value function $v(s)$에 policy $\pi$ 를 넣어서  $v_{\pi}(s)$를 정의해보자. 

    * $v_{\pi}(s)$는 임의로 행동하는 것이 아니라 주어진 $\pi$를 따르면서 구해진 expected return를 의미한다.
  
* #### Action-Value Function (Q-Value)

  * State에 대한 value function $v_\pi(s)$에 action을 추가한 것이 action-value function $q_\pi(s,a)$다.

  * $v_{\pi}(s)$와 달리 $q_\pi(s,a)$는 현재 상태 $s$ 뿐만 아니라, $s$ 에서 행동 $a$를 한 이후 policy $\pi$를 따를 경우, 얻을 수 있는 expected return 값을 확인할 수 있다. 

    * $$
      q_\pi(s,a)=\mathbb{E}_\pi[G_t \mid S_t=s, A_t=a]
      $$

  *  $q_\pi(s,a)$는 다른 말로 Q-value라고도 부른다.

## 4. 벨만 방적식 (Bellman Equation)

* 현재 state $s$와 다음 state $S_{t+1}$의 value function 사이의 관계를 식으로 나타낸 방정식
  
  * 즉, value function 과 (action-value function 또는 value function)의 관계
  * 아니면, action-value function과 (action-value function 또는 value function)의 관계를 말한다.
  * 강화학습에서는 Bellman equation으로는 학습이 불가능하다
    * Why? 벨만 방정식은 reward function과 state transition probability를 요구하기 때문에

### Bellman Expectation Equation

* Value function $v(s)$은 두가지 파트로 나눌 수 있다.
  
  1. $S_{t+1}$로 이동시 즉시 얻게되는 reward $R_{t+1}$ 
  2. discount factor가 곱해진 $S_{t+1}$의 value function $\gamma(S_{t+1})$
* ![image-20201018143809648](https://i.loli.net/2020/10/18/8Pq3YgRGkJaITz4.png)
  
* 

* 

* policy를 포함한 value function과 action value function도 **벨만 방정식**으로 표현해보자.

  * $$
    \ v_{\pi}(s) = \mathbb{E}_\pi[R_{t+1}+\gamma v_{\pi}(S_{t+1})\mid S_t=s]
    $$

  * $$
    q_\pi(s,a)=\mathbb{E}_\pi[R_{t+1} + \gamma q_{\pi}(S_{t+1}, A_{t+1})|S_t=s, A_t=a]
    $$

---

* 유도된 value function과 action value function에 대한 벨만 방정식은 서로 합칠 수 있다 .
* 아래 그림은 state $s$에서 가능한 action이 두개일 때 나타낸 $v_\pi(s)$와 $q_\pi(s,a)$의 관계를 나타낸 것이다. 
  * <img src="https://i.loli.net/2020/10/18/hLe2sw9IDOPpCq6.png" alt="img" style="zoom:80%;" />
* $v_\pi(s)$는 Expectation return을 구하는 것이므로, $v_\pi(s)$는 $s$에서 action $a$를 할 수 있는 확률에다가 그 $a$를 수행했을 때 얻을 수 있는 expected return $q_\pi(s,a)$곱의 총 합이 된다.
    * 즉, 가치 함수 $v_\pi(s)$는 $q_\pi(s,a)$에 대한 기댓값이다.
* $q_\pi(s,a)$에 의해 변경된 state $s$ 는 $s'$로 표현되며, $v_\pi(s')$와 $q_\pi(s,a)$에 대한 관계를 표현하면 다음과 같다.

  * <img src="https://i.loli.net/2020/10/18/V9cIpTgvGFNk28w.png" alt="img" style="zoom:80%;" />
  * 여기서 $\mathcal{R}^a_s$은 $s$에서 action $a$를 통해 얻어진 reward function을 의미하고, $\mathcal{P}^a_{ss'}$는 $s$에서 $a$를 통해 $a'$로 넘어갈 확률, 즉, state transition probability를 의미한다.
    * $\mathcal{R}^a_s=\mathbb{E}[R_{t+1}|S_t=a, A_t=a]$
    * $\mathcal{P}^a_{ss'}=\mathbb{P}[S_{t+1}=s'|S_t=s, A_t=a]$
  * 위 그림에서 action은 한개인데, state가 다시 두개로 분리되는 이유는 $a$에 의해  $s'$가 아니라, 의도하지 않은 state로 넘어갈 수 있기 때문이다.    
    * 현재 그림에서는 가능한 $a$가 2개 존재하므로, 의도하지 않은 state 하나, 의도한 state 하나 총 두개로 표현할 수 있다.  
  * 그리고 state가 지나갔으므로, discount factor $\gamma$를 붙인다. 
* 위의 두 graph를 합치면 아래와 같이 표현된다.

  * <img src="https://i.loli.net/2020/10/18/iyGKqklmagEO8w9.png" alt="img" style="zoom:80%;" />
  * 위 그림의 수식은 수학적 등호보다 assign의 의미에 더 가깝다. 
    * 그래서 backup이라는 개념이 등장하는데, 오른쪽의 식을 왼쪽 식에 대입하는 것을 의미한다.
  * diagram 또는 방정식을 살펴보면, 미래의 값(next state-value function)들로 현재의 value function을 backup 하여 구한다.
  * 이 backup은 sample backup과 full-width backup이 존재한다.
    * sample backup (reinforcement learning): 실제 경험을 통해서 backup 
    * full-width backup (dynamic programming): 가능한 모든 next state-value function을 사용하여 현재의 value function backup
* 참고를 위해, Q-value에 대해서 반대로 합쳐보자.

  * <img src="https://i.loli.net/2020/10/18/orWYkGaJAfF7sZj.png" alt="img" style="zoom:80%;" />

### Bellman Optimality Equation

* 위의 Bellman Equation은 Bellman Expectation Equation을 의미했다. 이제 Bellman Optimality Equation을 살펴보자.

* Optimal state-value function $v_*(s)$이란, 현재 state $s$에서 가능한 모든 polices 중, 미래에 가장 많은 reward를 받을 수 있는 policy를 따를 경우의 value function을 의미한다.

  * $$
    v_*(s) = \max_\pi v_\pi(s)
    $$

* Optimal action-value function이란,현재 $s$에서 $a$를 선택했을 때 가능한 모든 polices 중,  미래에 가장 많은 reward를 받을 수 있는 policy를 따를 경우의 action-value function을 의미한다.

  * $$
    q_*(s,a) = \max_\pi q_\pi(s, a)
    $$

* 만약 우리가 optimal action-value function을 안다면, 특정 $s$에서 단순히 높은 Q-value를 지닌 $a$를 선택해주면 되므로 optimal policy $\pi_*(a|s)$를 가진 것과 다름 없다. 즉, 강화학습을 진행할 필요가 없다.

* MDP에서 action의 확률은 deterministic하므로(변하지 않음), 최적의 정책 $\pi_*(a|s)$은 greedy policy로, 아래와 같이 표현된다.

  * ![image-20201018155745177](https://i.loli.net/2020/10/18/AyjwbrsZCXcaVBD.png)
  * 쉽게 말하면, 최적의 정책 $\pi_*(a|s)$은 항상 가장 큰 값을 지닌 optimal action-value function $q_*(s,a)$을 고른다는 의미다(다른 action은 고르지 않음. 그래서 확률이 0) 

* **Bellman optimality equations**은 Bellman expectation equation과 비슷하게, optimal value function 사이의 관계를 나타내주는 식이다.

  * Optimal state-value function $v_*(s)$

    * $$
      v_*(s)=\max_a q_*(s,a)
      $$
  
    * <img src="https://i.loli.net/2020/10/18/Epi396HtMIxTRUZ.png" alt="image-20201018160450202" style="zoom:80%;" />

    * 자세히 보면 Expectation 계산 식인데, 확률 $\pi_*(a|s)$ 이 보이지 않는다. 
  
      * 그 이유는 위에서 확인했듯이, $\pi_*(a|s)$는 항상 가장 큰 $q_*(s,a)$를 가진 $a$에 대해서만 확률값이 1이고, 나머지 $a$에 대해서는 0이기 때문이다.
  
  * Optimal action-value function $q_*(s,a)$
  
    * $$
      q_*(s,a)=\mathcal{R}^a_s+\gamma \sum_{s'\in \mathcal{S}} \mathcal{P}^a_{ss'}v_*(s')
      $$
  
    * <img src="https://i.loli.net/2020/10/18/vFVquBhtnOrMkKj.png" alt="image-20201018160617417" style="zoom:80%;" />
  
* 위 두개의 diagram을 합치면 다음과 같다.

  * ![img](https://i.loli.net/2020/10/18/YqutlLkK2g3sQxH.png)
  * <img src="https://i.loli.net/2020/10/21/NnEdrXV9mMBh7Lw.png" alt="image-20201021031208180" style="zoom:80%;" />

---

실제로 Bellman Equation을 활용하여 학습을 진행하는 방법을 살펴보자.

## 5. Dynamic Programming (DP)

* Bellman equation을 통해서 iterative하게 MDP의 문제를 푸는 것을 Dynamic Programming(DP)이라 한다.
* Planning 기법: DP는 수학적으로 잘 정돈된 방법이지만, 환경에 대한 완벽하고 정확한 모델을 요구한다.  

### Planning & Learning

* Planning: 환경의 모델을 이미 인지한 상태에서 agent가 계산을 수행하는 것 (search)
  * Bellman equation 역시 model의 reward 그리고 state transition matrix를 알고 있어서 구성 가능한 식이므로, planning으로 볼 수 있다. 
* Learning: 환경의 모델을 모르는 상태에서 agent가 환경과 interact 하는 것 (강화 학습)

### Approach 1) Policy Iteration

* DP는 두 step: 1) Evaluate 과 2) Improve를 반복한다.

  1. Evaluate: MDP $<S, A, P, R, \gamma>$와 policy $\pi$가 주어졌을 때, value function $v_\pi$를 찾는다. 
     
     * 즉, 주어진 $\pi$가 얼마나 좋은지 알아내는 것이 prediction의 역할이다.
     
  2. Improve: 현재의 value function을 토대로 더 나은 policy를 구한다.

     * $$
       \pi'=greedy(v_{\pi})
       $$

     * 이 방식은 언제나 최적의 policy $\pi^*$에 수렴한다 !

       * <img src="https://i.loli.net/2020/10/21/yFCxZGeLdhzX3at.png" alt="image-20201021034909505" style="zoom:50%;" />

#### Policy Evaluation

* 초기 value function $v_1$에서 시작하여 Bellman Expectation Equation을 사용하여 $v2$를 구하고, 이를 반복하여 결과적으로 $v_\pi$에 수렴하도록 반복한다. ($v_1 \rightarrow v_2 \rightarrow v_3 \rightarrow \cdots \rightarrow v_\pi$)
* Synchronous backups: 매 $k$번째 iteration 마다, 모든 state $s \in S$에 대해, $v_k(s')$로 부터 $v_{k+1}(s)$를 업데이트한다 (여기서 $s'$는 $s$의 successor이다).	
  * Bellman Expectation Equation에 $k$를 대입한 수식은 아래와 같다. 
  * <img src="https://i.loli.net/2020/10/21/exVZ2S3EJ8orfX1.png" alt="image-20201021032941108" style="zoom:80%;" />
    * 마지막 수식은 matrices를 사용한 공식 ($v_{k+1}(s)$가 non-linear라 matrices 곱으로 풀수는 없다.)
  * 예시
    * 상하좌우 확률 $\pi(a|s)=0.25 \  \forall a \in A$ , 그리드 이동 시 state는 안바뀜 ($\mathcal{P}^a_{ss'}=1$), 매 이동 시 reward = -1
    * ![image-20201021033751688](https://i.loli.net/2020/10/21/B6RGJqb9acFgXu8.png)
      * $k=1$에서, (2,2) 위치는 다음과 같이 계산된다.
      * $v_1(s)=4 * (0.25) * (-1 + 0) = -1$  ($v_0(s')=0$)
      * 오른쪽 그림의 grid에 대한 화살표는 해당 grid에서 상하좌우 중 가장 큰 $v_k(s)$가 존재하는 방향

#### Policy Improvement

* 평가한 $v(s)$ 값을 기반으로 policy $\pi$를 improve한다 (Improve된 policy $\pi'$).

* 발전된 정책은 아래와 같이 가장 큰 q value 가지는 action을 선택하는 것으로 생각할 수 있다.

  * $$
    \pi'(s)=\mathbb{argmax}_{a \in A} q_{\pi}(s,a)
    $$

  * Q value는 Bellman Expectation Equation에서 구하면 된다.

    * 

* ![image-20201021181512379](https://i.loli.net/2020/10/21/AzKBiD3XGVguQkZ.png)

### Approach 2) Value Iteration

* Value iteration은 principle of optimality를 활용한다.
  * principle of optimality: policy $\pi(a|s)$는 두 가지 조건을 통해서 $s$에 대한 최적의 optimal value $v_\pi(s)=v_*(s)$를 만족하게 할 수 있다.
    1.  $s$에서 $s'$로 reachable 할 경우
    2. $\pi$가 state $s'$에서 optimal value일 경우 $v_\pi(s')=v_*(s')$
* 



## 6. MC학습(몬테카를로 기반 동적프로그래밍 방식) 방법을 설명하시오. 

*  몬테카를로 기반 방법은 환경에 대한 모델을 요구하지 않고 개념적으로 단순하다.
*  그러나 step-by-step형식으로 점진적 계산에는 어울리지 않는다.
*  Model-Free Control

1. ### TD학습 방법을 기술하고 MC 방법과의 차이를 설명하시오. 

    * Temporal-difference methods(TD) 방식은 모델을 요구하지 않고 완벽히 점진적(fully incremental) 계산 방식을 따른다. 
      * TD 방식은 MC 의 아이디어와 DP를 합친것과 같다.
        * TD는 MC처럼 환경에 대한 model이 필요없이 raw experience로부터 바로 학습할 수 있다.
        * TD는 DP처럼, 최종 결과를 기다리지 않고(에피소드 종료), 다른 추정으로 부터 추정값을 업데이트할 수 있다. 
    * Episode가 끝나지 않더라도 DP 처럼 time step마다 학습할 수 있는 방법
    * 
    * 

2. ### Model based vs. Model free RL의 차이를 설명하시오. 

   * Model based (Learning)
     * 환경에 대한 완전한 정보가 없을 경우
   * Model Free (Planning)
     * 환경에 대한 모델이 존재하는 경우

3. ### 오프라인 vs. 온라인 RL의 차이를 설명하시오. 

   * 

4. ### On-policy vs. Off-policy RL의 차이를 설명하시오. 

   * 



1. ### TD학습, SARSA, Q학습 알고리즘을 설명하고 차이점을 기술하시오

2. ### Policy Gradient에 대해서 설명하라

     * policy gradient는 policy 자체를 parameterize하여 action을 결정한다.

     * $$
       \pi_\theta(s,a)=\mathbb{P}[a|s,\theta]
       $$

     * policy gradient의 장점

       * action이 여러개이거나(high-dimension), continuous action의 경우 효과적임
       * value-based 방식은 하나의 optimal한 action으로 수렴하는데, policy gradient는 **stochastic**한 policy를 배울 수 있다. 
         * Stochastic policy? 확률적인 정책으로, 가위바위보 처럼 모두 1/3 확률로 내는것이 최적인 policy를 의미한다.

     * policy gradient의 단점

       * local optimum에 빠질 확률이 높다.
       * policy를 evaluating 하는 것이 일반적으로 비효율적이고 high variance하다.

3. ### DQN을 설명하라.

     * 기존의 강화 학습의 문제를 해결하기 위해 신경망을 사용한 강화 학습 방법
       * 기존의 강화 학습 문제
         * Agent는 최적의 policy를 찾기 위해 모든 state에 대한 action-value function값을 table형태로 저장하고, 이를 업데이트 시켜나간다.
         * 하지만, state와 action 범위가 커지면 학습이 많이 느려진다.
     * DQN에서는 Neural Network를 이용해 action-value function(Q-value)를 approximate 하는 방법으로 접근한다.
       * Q-value 뿐만 아니라 policy 자체를 approximate 할 수 있는데 이는 Policy Gradient 방식이다.
       * DQN은 단일 계층 네트워크가 아닌 Convolutional Neural Network를 사용해서 DNN으로 확장했음
     * Experience Replay를 구현함
     * 제 2의 target network를 활용하여 업데이트 시 target Q value를 계산
     * 일반적으로 stochastic gradient descent 방식을 이용하여 DNN의 weight와 bias를 update 하게 된다.
     * 

4. ### 알파고가 사용한 딥강화학습 DQN의 핵심 아이디어들을 설명하시오

     * Convolutional Layer 사용
     * 

      * Policy Gradient with Monte-Carlo Tree Search
        * Policy Gradient
        * 
      * A3C와 Monte-Carlo Tree Search 알고리즘을 조합
      * policy network (actor)와 value network (critic)을 따로 학습