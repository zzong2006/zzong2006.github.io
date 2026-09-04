---
title: "Bayesian Optimization"
aliases: ["베이지안 최적화", "BO"]
tags:
  - machine_learning
  - hyperparameter
---

# A) Bayesian Optimization ?

한 번 평가하는 데 비용이 많이 드는 함수의 최댓값(또는 최솟값)을 적은 횟수로 찾는 방법이다. 하이퍼파라미터 탐색이 대표적인 쓰임새인데, 설정 하나를 평가하려면 모델을 처음부터 학습시켜야 해서 한 점을 아는 데 몇 시간이 걸리기 때문이다.

[[Grid Search]] 는 격자를 다 훑고 [[Random search]] 는 무작위로 뽑는다. 둘 다 지금까지의 결과를 다음 시도에 반영하지 않는다. Bayesian optimization 은 지금까지 평가한 점들로 함수의 모양을 추정해 두고, 그 추정을 근거로 다음에 평가할 점을 고른다.

# B) 두 부품

**surrogate model (대리 모델)** — 진짜 목적 함수 대신 쓰는 값싼 확률 모델이다. 보통 Gaussian Process 를 쓰는데, 각 지점에서 값의 예측 평균뿐 아니라 불확실성까지 함께 내놓기 때문이다. 평가한 점 근처는 불확실성이 작고, 멀리 떨어진 곳은 크다.

**acquisition function (획득 함수)** — 대리 모델의 예측을 받아 "다음에 어디를 평가할지" 를 점수로 매기는 함수다. 이 함수는 계산이 싸므로 마음껏 최적화해서 최댓값 지점을 다음 후보로 삼는다.

# C) 탐색과 활용의 절충

acquisition function 이 하는 일은 두 욕구를 하나의 수로 합치는 것이다. 예측 평균이 높은 곳(활용)과 불확실성이 큰 곳(탐색) 중 어디를 볼 것인가.

| acquisition function | 고르는 기준 |
| --- | --- |
| Expected Improvement (EI) | 지금까지의 최고값을 넘어설 기댓값이 가장 큰 지점 |
| Upper Confidence Bound (UCB) | 예측 평균 + $\kappa \times$ 표준편차. $\kappa$ 로 탐색 정도를 조절한다 |
| Probability of Improvement (PI) | 최고값을 넘어설 확률이 가장 높은 지점 |

불확실성이 큰 곳을 한 번 평가하면 그 근처의 불확실성이 줄어들고, 대리 모델이 갱신되어 다음 후보가 다시 계산된다. 이 순환을 예산이 다할 때까지 반복한다.

# D) 실무에서의 흐름

[[Random search]] 로 대략 좋은 범위를 먼저 좁히고, 그 안에서 Bayesian optimization 으로 세밀하게 찾는 순서가 자연스럽다. 초기 관측이 몇 점은 있어야 대리 모델이 의미 있는 추정을 하기 때문이다.

차원이 아주 높거나(수십 개 이상의 하이퍼파라미터) 한 점 평가가 오히려 싼 경우에는 이점이 줄어든다. 대리 모델을 세우고 acquisition 을 최적화하는 비용이 목적 함수 평가 비용에 견줄 만해지기 때문이다.

# E) References
