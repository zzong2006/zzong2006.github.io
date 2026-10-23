---
title: "loss function"
tags:
  - machine_learning
  - optimization
  - loss_function
aliases: [loss, objective loss, cost function, objective function, 비용 함수, 손실 함수]
---

# A) Loss Function

Loss function 은 모델의 예측이 정답과 얼마나 다른지를 숫자로 바꾸는 함수다. 학습은 보통 이 값을 줄이는 방향으로 parameter 를 업데이트하는 과정으로 볼 수 있다.

한 샘플에 대한 오차를 말할 때는 loss 라고 부르고, 전체 training set 또는 mini-batch 에서 loss 를 평균/합산한 값을 cost function 또는 objective function 이라고 부르는 경우가 많다. 실무와 논문에서는 둘을 엄밀히 나누지 않고 섞어 쓰기도 하지만, 수식을 읽을 때는 “개별 샘플의 손실인가, 전체 목적 함수인가”를 먼저 확인하면 헷갈림이 줄어든다.

# B) Cost Function 을 최소화한다는 것

[[linear regression]] 의 cost function $J(\theta_0,\theta_1)$ 로 “cost 를 최소화한다” 는 말이 그림에서 무엇인지 보자. 모델은 직선 $h_\theta(x)=\theta_0+\theta_1x$ 이고, cost 는 모든 training example 에 대한 squared error 의 평균이다.

$$
\underset{\theta_0,\theta_1}{\operatorname{minimize}}\ J(\theta_0,\theta_1)=\frac{1}{2m}\sum^{m}_{i=1}\left(h_\theta(x^{(i)})-y^{(i)}\right)^2
$$

여기서:

* $(x^{(i)},y^{(i)})$: $i$ 번째 training example
* $m$: training example 의 개수
* 앞의 $\frac{1}{2}$: 제곱 항을 미분하면 나오는 $2$ 와 약분되어 [[gradient descent]] 식이 깔끔해지도록 붙인 상수다. 최솟값의 위치는 바뀌지 않는다.

## B.1) Parameter 가 하나일 때

먼저 $\theta_0=0$ 으로 고정해서 $J(\theta_1)$ 하나만 최소화하는 문제로 줄여보자.

$$
J(\theta_1)=\frac{1}{2m}\sum^{m}_{i=1}\left(\theta_1x^{(i)}-y^{(i)}\right)^2
$$

아래 왼쪽 그림은 모델 $h_\theta(x)=\theta_1x$, 오른쪽은 cost $J(\theta_1)$ 이다. 학습 데이터가 $\theta_1=1$ 인 직선 위에 정확히 놓여 있어서, 오른쪽 그래프에서 $(\theta_1,J(\theta_1))=(1,0)$ 이 된다.

![[img-a2b3a6e5a5.png|img]]

$\theta_1$ 을 바꿔가며 $J(\theta_1)$ 을 계속 찍으면 아래로 볼록한 곡선이 나온다.

![[img-8c89b62c00.png|img]]

![[img-3474bc7a81.png|img]]

cost 가 가장 작은 $\theta_1=1$ 을 고르면 되고, 이 점이 [[global minimum]] 이다.

## B.2) Parameter 가 둘일 때

$\theta_0$ 을 다시 살리면 $J(\theta_0,\theta_1)$ 은 두 변수의 함수라서 선 그래프 대신 3차원 곡면이 되고, 이를 위에서 내려다본 등고선 (contour plot) 으로 그린다.

![[img-8ffbc0eed5.png|img]]

모델 $h_\theta(x)$ 가 학습 데이터에 잘 맞을수록 $(\theta_0,\theta_1)$ 은 등고선의 중심에 가까워진다.

![[img-bccd6ee0ec.png|img]]

# C) 손실 함수를 고르는 기준

손실 함수는 모델이 무엇을 잘하게 만들지 정한다. 같은 모델 구조라도 loss 를 바꾸면 학습 신호와 ranking/분류 경계가 달라진다.

| 문제 유형 | 자주 쓰는 loss | 읽는 포인트 |
| --- | --- | --- |
| Regression | [[linear_algebra/L2 Loss]], [[mean squared error]] (MSE) | 큰 오차에 더 큰 penalty 를 줄지 |
| Binary / Multiclass Classification | [[logistic loss]], [[cross-entropy]] | 확률 예측과 decision boundary 를 어떻게 맞출지 |
| Maximum-margin Classification | [[hinge loss]] | 정답만 맞히는 것이 아니라 margin 을 확보할지 |
| Metric Learning / Retrieval | [[retrieval/concepts/Triplet Loss]], [[retrieval/concepts/InfoNCE]] | positive 는 가깝게, negative 는 멀게 만들지 |
| Language Model | next-token [[cross-entropy]] | 다음 token 분포를 얼마나 잘 맞추는지 |

Regression 에서 L1 loss 와 [[L2 Loss]] 의 차이가 이 “큰 오차에 더 큰 penalty 를 줄지” 에 해당한다. 실제 값 $y_i$ 와 예측값 $f(x_i)$ 에 대해 두 loss 는 다음과 같다.

$$
L_1=\sum_{i=1}^{n}\left|y_{i}-f\left(x_{i}\right)\right|,\qquad L_2=\sum_{i=1}^{n}\left(y_{i}-f\left(x_{i}\right)\right)^{2}
$$

L2 는 오차를 제곱하므로 오차가 10 인 샘플 하나가 오차가 1 인 샘플 100 개와 같은 무게를 가진다. 그래서 L2 는 [[outlier]] 에 끌려가고, L1 은 상대적으로 덜 흔들린다. 두 성질을 섞은 것이 [[Huber Loss]] 다.

# D) Loss 와 Metric 은 다르다

Loss 는 학습 중 gradient 를 만들기 위한 함수이고, metric 은 모델을 평가하기 위한 척도다. 예를 들어 추천/검색에서는 [[Normalized Discounted Cumulative Gain|NDCG]], [[Recall]], [[precision]] 을 보고 싶지만, 이들은 그대로 미분하기 어렵기 때문에 학습에서는 cross-entropy, pairwise loss, contrastive loss 같은 surrogate loss 를 쓰는 경우가 많다.

# E) 실무에서 보는 포인트

Loss 가 내려가는데 실제 metric 이 오르지 않으면, 학습 목적과 서비스 평가 기준이 어긋났을 가능성이 있다. 반대로 metric 이 noisy 하면 loss 를 통해 학습이 정상적으로 진행되는지 먼저 확인할 수 있다.

Regularization term 이 붙으면 objective 는 “순수 예측 loss + 복잡도 penalty”가 된다. 이때는 [[regularization]] 때문에 training loss 자체가 조금 커져도 generalization 이 좋아질 수 있다.
