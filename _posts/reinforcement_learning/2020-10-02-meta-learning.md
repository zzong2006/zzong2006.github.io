---
layout: post
title:  "Reinforcement learning: Meta Learning"
date:   2020-10-14 22:55:30 +0900
categories: reinforcementlearning
series: 1
---

* Meta Reinforcement Learning: How teach the agent to learn **unseen tasks** quickly?
  * Example) (1, 2, 3) 순서로 동작하게 학습된 모델을 (3, 2, 1) 순서로 동작하게 학습하도록 유도
  * task 간 공유하는 구조(shared structure)를 활용하는 것이 핵심

* Known Structure and unknown structure

  * Multi-armed bandit (MAB)
    * 각자 다른 보상(payoffs)을 주는 여러개의 슬롯 머신을 이용해서 가장 높은 보상을 얻도록 하는 문제
    * ![image-20201014192324615](https://i.loli.net/2020/10/14/DuJY4RHUpfokjZx.png)
    * K-armed bandit problem 이라고 부름
      * 랜덤 변수 $X_{i,n} \in [0, 1]$ (arm $i$의 $n$번째 보상)이 존재하고, expectation $\mu_i$를 독립적으로 보유
      * *T*번 arm을 당겼을 때, 보상을 최대화(maximize cumulated reward) = 후회를 최소화(minimize expected regret)
      * ![image-20201014193658814](https://i.loli.net/2020/10/14/Sc6FifHoaPEUwKT.png)
    * 

* Exploration vs Exploitation

  * RL agent는 adaptive하게 sample들을 모으는데, 이때 exploration과 exploitation의 trade-off 에 대한 균형을 유지하면서 학습을 진행한다.
  * Exploration : 현재보다 더 좋은 보상을 얻을 가능성이 있는 다른 options(policies/actions)을 시도
  * Exploitation:  현재 가장 최적의 보상을 얻을 수 있는 policies나 actions을 유지함
  * 예) 40년 전통의 설렁탕 집 vs 최근에 생긴 설렁탕 집 (최근에 생긴 설렁탕 집이 더 맛있을 수 있음)

* Optimism in the Face of Uncertainty

  * MAB 문제를 풀 때 사용하는 효율적인 알고리즘: 각 arm들 중 가장 높은 potential을 보유한 arm을 플레이함
    * high potential = high empirical mean($\hat{\mu}_i$) + under-explored($\sqrt{\frac{2log(T)}{N_i(T)}}$)
      * 어떤 시점 $T$에 대하여, $i$번째 arm에 대한 시도 횟수$N_i(T)$가 상대적으로 낮을 경우, 그 값(under-explored)이 증가하도록 설계 

  