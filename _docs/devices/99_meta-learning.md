---
layout: default
title:  "Meta Learning"
parent: Reinforcement Learning
nav_order: 20
---

* Meta Reinforcement Learning: How teach the agent to learn **unseen tasks** quickly?
  * Example) (1, 2, 3) 순서로 동작하게 학습된 모델을 (3, 2, 1) 순서로 동작하게 학습하도록 유도
  * learn quickly = reduce learning cost
  * task 간 공유하는 구조(shared structure)를 활용하는 것이 핵심

* Known Structure and unknown structure
  * Multi-armed bandit (MAB)
    * 각자 다른 보상(payoffs)을 주는 여러개의 슬롯 머신을 이용해서 가장 높은 보상을 얻도록 하는 문제
    * ![image-20201014192324615](https://i.loli.net/2020/10/14/DuJY4RHUpfokjZx.png)
    * K-armed bandit problem 이라고 부름
      * 랜덤 변수 $X_{i,n} \in [0, 1]$ (arm $i$의 $n$번째 보상)이 존재하고, expectation $\mu_i$를 독립적으로 보유
      * *T*번 arm을 당겼을 때, 보상을 최대화(maximize cumulated reward) = 후회를 최소화(minimize expected regret)
      * ![image-20201014193658814](https://i.loli.net/2020/10/14/Sc6FifHoaPEUwKT.png)
      * Regret lower bound 
        * ![image-20201014195456107](https://i.loli.net/2020/10/14/Zh8Ryw35v4EgVq6.png)
        * Arm의 개수(K)가 많아지면 많아질수록 Regret(T)의 lower bound는 증가함
        * K라는 개념은 현실에서는 무한에 가까움 (자동 주행에서의 steering wheel: K is in the continuous space)
  * Optimism in the Face of Uncertainty
    * MAB 문제를 풀 때 사용하는 효율적인 알고리즘: 각 arm들 중 가장 높은 potential을 보유한 arm을 플레이함
      * high potential = high empirical mean($\hat{\mu}_i$) + under-explored($\sqrt{\frac{2log(T)}{N_i(T)}}$)
        * 어떤 시점 $T$에 대하여, $i$번째 arm에 대한 시도 횟수$N_i(T)$가 상대적으로 낮을 경우, 그 값(under-explored)이 증가하도록 설계 
* Exploration vs Exploitation
  * RL agent는 adaptive하게 sample들을 모으는데, 이때 exploration과 exploitation의 trade-off 에 대한 균형을 유지하면서 학습을 진행한다.
  * Exploration : 현재보다 더 좋은 보상을 얻을 가능성이 있는 다른 options(policies/actions)을 시도
  * Exploitation:  현재 가장 최적의 보상을 얻을 수 있는 policies나 actions을 유지함
  * 예) 40년 전통의 설렁탕 집 vs 최근에 생긴 설렁탕 집 (최근에 생긴 설렁탕 집이 더 맛있을 수 있음)
* Exploration with Structure
  * 사전 지식이나 어떤 구조를 이용하면 exploration cost를 감소시킬 수 있다.
    * 두 개의 레스토랑 체인(A, B)가 있다고 가정
    * ![image-20201014200626745](https://i.loli.net/2020/10/14/cWJ1NltEGjYv6U8.png)
    * Pohang에 위치한 A의 Rating은 4.x 정도, Pohang에 위치한 B의 Rating은 2.x 로 유추할 수 있음 

* Structured Bandit
  * MAB 문제에서, structure($\phi$)가 주어져 있을 때, 얼마만큼 expected regret 을 줄일 수 있을까?
    * K개의 arm에 대한 mean reward가 vector $\mathbf{\mu}$로 주어졌다고 하자 
    * Structured MAB 는 structure  $\mu \in \phi$를 아래와 같이 정의한다. 
    * ![image-20201014202357136](https://i.loli.net/2020/10/14/mH7TaiY6MF4ROse.png)
      * 위의 레스토랑 예제의 경우, 같은 체인일 때 $d(i, j)=0$, 다른 체인일 때 $d(i,j)=1$
*   ....?

