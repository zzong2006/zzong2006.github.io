---
title: "DRN - A Deep Reinforcement Learning Framework for News Recommendation"
tags: ["paper_review", "reinforcement_learning", "WWW"]
aliases: ["DRN"]
---

# A) Abstract

뉴스 추천을 위한 딥러닝 기반의 강화 학습 프레임워크를 제안한다.

news feature 들과 user 의 preferences 의 변동성 (dynamic) 을 설명하는 것은 상당히 어렵다. 기존에도 이를 다루는 방식들이 있었지만 다음과 같은 세 가지 중요 이슈가 있다.

1. 현재 reward(CTR) 에 대해서만 모델링이 가능
2. 대부분 click 또는 no click labels 외 사용자 feedback 을 고려하지 않음
3. 사용자에게 비슷한 뉴스를 계속 추천해서 지루하게 만듦

위와 같은 문제를 해결하기 위해서 [[Deep Q-Network|DQN]] 기반 추천 프레임워크를 제안하여 미래의 보상에 대해 explicitly 하게 모델링한다. 추가적으로 유저 귀환 패턴을 click 과 no click label 에 대한 보충으로 생각하여 user feedback 정보를 더 많이 확보한다. 그리고 효율적인 exploration 전략을 취해서 사용자에게 연관성이 높은 새로운 종류의 뉴스를 제안할 수 있다.

# B) Introduction

논문에서 제안한 DQN 방식과 기존 강화학습을 이용한 방식의 차이점이 있다. [[Multi-Armed Bandit|MAB]] 기반 방식은 미래 보상에 대해서 명시적으로 모델링을 수행하지 않는다. 그리고 [[Markov Decision Process|MDP]] 기반 방식은 state 표현을 위해 discrete 한 유저 로그를 사용하므로 대용량 시스템에 대하여 확장성이 부족하다.

각 유저의 활동성 점수를 유지하기 위해서, 제안한 방식은 user return 신호를 유저 feedback 정보로 활용한다.

exploration 을 위해서 [[Interactively Optimizing Information Retrieval Systems as a Dueling Bandits Problem]] 를 활용한다. 이는 현재 추천 결과의 이웃 아이템을 candidate 로 하여 랜덤 추천을 진행하기 위해서 사용한다. 이런 전략은 exploration 을 위해 전혀 관련없는 아이템을 랜덤하게 추천하는 것을 막기 위해 사용한다.

# C) Deep Reinforcement RS

해당 논문에서 제안한 방식인 딥러닝 기반의 강화학습을 추천시스템에서 활용할때, 그 과정을 간략히 설명한다.

![|500](https://i.imgur.com/eU3KyIZ.png)

* environment: user & news pool
* agent: recommendation algorithm
* state: 사용자의 continuous feature representation
* action: 뉴스의 continuous feature representation

유저 $\mathrm{u}$ 가 뉴스를 요청할때마다 agent $\mathrm{G}$(추천 알고리즘) 이 candidate news pool $l$ 중에서 가장 best actions $L$(top-k list) 을 선택하고, 유저 피드백을 보상으로 받는다. 특히, 보상은 click labels 과 유저 활동성의 추정값 (estimation) 으로 구성되어 있다.

모든 추천 결과와 피드백 로그는 agent 의 메모리에 저장되고, 매 1 시간마다 agent 는 메모리의 로그를 활용해 추천 알고리즘을 업데이트한다.

# D) Method

## D.1) Deep Reinforcement Recommendation

[[action-value function|q-value]] 는 다음과 같이 계산할 수 있다.

$$
y_{\mathrm{s}, \mathrm{a}}=Q(\mathrm{~s}, \mathrm{a})=\mathrm{r}_{\text {immediate }}+\gamma \mathrm{r}_{\text {future}}
$$

여기서 $\mathrm{r}_{i m m e d i a t e}$ 값은 유저가 뉴스를 클릭했는지 여부에 따른 보상을 나타내고, $\mathrm{r}_{\text {future}}$ 는 미래 보상에 대한 agent 의 projection (예측) 을 의미한다. $\gamma$ 은 [[discount factor]] 를 의미한다.

구체적으로 [[Deep Reinforcement Learning with Double Q-Learning|DDQN]] 을 통해서 현재 state $s$ 가 주어졌을 때, timestamp $t$ 에서 $a$ 를 선택할 경우 받게되는 전체 reward 의 예측값은 다음과 같다.

$$
y_{\mathrm{s}, \mathrm{a}, t}=\mathrm{r}_{\mathrm{a}, t+1}+\gamma \mathrm{Q}\left(\mathrm{s}_{\mathrm{a}, t+1}, \arg \max _{\mathrm{a}^{\prime}} \mathrm{Q}\left(\mathrm{s}_{\mathrm{a}, t+1}, \mathrm{a}^{\prime} ; \mathrm{W}_{t}\right) ; \mathrm{W}_{t}^{\prime}\right)
$$

위 수식에서 $\mathrm{W}_{t}$ 와 $\mathrm{W}_{t}^{\prime}$ 은 서로 다른 DQN 의 parameter 집합들을 의미한다.

# E) References

* [paper link](https://www.personal.psu.edu/~gjz5038/paper/www2018_reinforceRec/www2018_reinforceRec.pdf)
