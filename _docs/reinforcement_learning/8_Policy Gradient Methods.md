---
layout: default
title:  "Policy Gradient Methods"
category: Reinforcement Learning
order: 8
---

## Why Policy Gradients?

Deep Q Learning은 action space가 크거나 연속일 경우 잘 동작하지 않음

* 예를 들어, 자동주행차는 각 상태에서 (거의) 무한한 가짓수의 행동(바퀴를 15°, 17.2°, 19.4° 회전 ...)을 선택을 할 수 있습니다. 그럼 모든 가능한 행동에 대하여 Q값을 구해야 하게 됩니다! 

Policy Gradient는 action을 선택하는 것이 직접적임

각 state에 대해서 정확한 값을 계산할 필요가 없음

Policy Network는 가능한 모든 action들에 대한 확률 행렬을 반환함

* 확률에 기반하여 action을 무작위로 선택하거나 greedy 하게 선택 가능
* Exploration과 Exploitation에 대한 trade-off 균형을 직접 맞출 필요가 없어짐
  * perceptual aliasing 문제를 해결한다.
* 

## Disadvantage of Policy Gradients

Local optimum

* 정책 경사는 많은 상황에서 전역 최적점이 아닌 **지역 최적점에 수렴**합니다. 

느린 학습 속도

* 항상 최고점에 도달하려는 딥 Q-러닝과 달리, 정책 경사는 **천천히 수렴**합니다. 따라서 학습하는 데 더 오랜 시간이 걸릴 수 있습니다. 

## Policy Gradient Method

1. 임의의 policy로 시작
2. 환경에 대해서 몇 action들을 sampling
3. 만약 reward가 expected보다 크다면, 해당 actions들의 확률을 증가시킴
   * 반대로, reward가 낮다면 확률을 낮춤

## Policy Function

Policy Function은 logits이라는 raw numbers를 출력함

그리고 이 값들을 Softmax function을 활용해 0에서 1사이의 확률로 치환함

이 확률을 이용하여 action을 선택

## Policy Gradient Loss function

$$
\mathrm{L}=-\mathrm{Q}_{\mathrm{s}, \mathrm{a}} \log (\pi(\mathrm{a} \mid \mathrm{s}))
$$

* 높은 reward에 대한 action이 선택될 확률을 최대화시켜야 하므로, loss는 - 값이어야 한다.
* log를 사용하는 이유는 raw 확률 값을 계속 곱하게되면 0에 가까워지기 때문에 학습에 문제가 생길 수 있음

## REINFORCE Algorithm

Policy Gradient 알고리즘 중 하나

1. 네트워크를 임의의 weights로 초기화한다.
2. $N$번의 에피소드들을 플레이하고, transition들 $(s,a,r,s')$을 기록한다.
3. $k$ 번째 에피소드의 $t$ step마다, subsequent steps을 계산한다.