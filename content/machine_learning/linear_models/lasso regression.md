---
title: "Lasso Regression"
tags:
  - linear_regression
  - machine_learning
aliases: ["L1 regularization"]
---

# A) Lasso Regression ?

[[linear regression]] 의 손실에 계수 절댓값의 합, 즉 L1-[[norm]] 을 벌점으로 더한 모델이다. 같은 자리에 계수 제곱의 합(L2)을 쓰면 [[ridge regression]] 이 된다.

$$
\hat{\beta}^{\text{lasso}} = \arg\min_{\beta} \left\{ \sum_{i=1}^{n}\left(y_i - \beta_0 - \sum_{j=1}^{p} x_{ij}\beta_j\right)^{2} + \lambda \sum_{j=1}^{p} \lvert \beta_j \rvert \right\}
$$

| 기호 | 의미 |
| --- | --- |
| $n$, $p$ | 데이터 개수, 설명변수 개수 |
| $\beta_j$ | $j$ 번째 변수의 계수 |
| $\beta_0$ | 절편. 벌점 항에 넣지 않는다 |
| $\lambda \ge 0$ | 벌점의 세기. 값이 클수록 0 이 되는 계수가 늘어난다 |

두 벌점 모두 계수를 0 쪽으로 당겨 [[overfitting]] 을 줄인다. 차이는 당기는 방식에 있다. L2 는 모든 계수를 고르게 작게 만들고, L1 은 일부 계수를 **정확히 0** 으로 만든다. 계수가 0 인 변수는 예측에 쓰이지 않으므로, lasso 는 학습과 동시에 변수를 고르는 효과를 낸다. 계수 중 0 이 많은 상태를 sparse 하다고 한다.

벌점은 계수의 크기에 걸리므로, 변수마다 단위가 다르면 벌점이 불공평하게 걸린다. 적합 전에 설명변수를 표준화한다.

# B) 계수가 정확히 0 이 되는 이유

## B.1) 벌점이 계수를 미는 힘

학습은 손실을 줄이는 방향으로 계수를 움직인다. 벌점 항을 계수로 미분하면, 벌점이 계수를 0 쪽으로 미는 힘이 나온다.

| 벌점 | 벌점의 미분 | 계수가 0 에 가까워질 때 |
| --- | --- | --- |
| L1: $\lambda \lvert \beta \rvert$ | $\lambda \cdot \operatorname{sign}(\beta)$ | 크기가 $\lambda$ 로 일정하다 |
| L2: $\lambda \beta^2$ | $2\lambda\beta$ | 계수에 비례해 함께 작아진다 |

L2 는 계수가 작아질수록 미는 힘도 약해진다. 0 에 다가갈수록 힘이 0 에 수렴하므로, 계수는 0 근처까지 가도 정확히 0 에 닿지 않는다.

L1 은 계수가 아무리 작아도 같은 크기 $\lambda$ 로 민다. 데이터 쪽 손실이 계수를 0 에서 떼어 놓으려는 힘이 $\lambda$ 보다 약하면, 계수는 0 까지 밀려가서 거기서 멈춘다. $\lvert \beta \rvert$ 는 0 에서 꺾여 있어 미분값이 하나로 정해지지 않는데, 0 에서는 벌점이 $-\lambda$ 와 $+\lambda$ 사이의 어떤 힘으로든 버틸 수 있기 때문이다.

## B.2) 계수 하나로 계산해 보기

설명변수들이 서로 직교하고 표준화돼 있으면, 각 계수의 문제가 따로 떨어진다. 벌점 없이 구한 최소제곱 계수를 $z$ 라고 하면, 계수 하나에 대한 문제는 다음과 같다.

$$
\min_{\beta}\; \tfrac{1}{2}(\beta - z)^2 + \lambda \lvert \beta \rvert
\quad\Longrightarrow\quad
\hat\beta^{\text{lasso}} = \operatorname{sign}(z)\,\max\big(\lvert z \rvert - \lambda,\; 0\big)
$$

$$
\min_{\beta}\; \tfrac{1}{2}(\beta - z)^2 + \lambda \beta^2
\quad\Longrightarrow\quad
\hat\beta^{\text{ridge}} = \frac{z}{1 + 2\lambda}
$$

| 기호 | 의미 |
| --- | --- |
| $z$ | 벌점 없이 구한 최소제곱 계수 |
| $\hat\beta$ | 벌점을 넣고 구한 계수 |
| $\operatorname{sign}(z)$ | $z$ 의 부호 ($+1$ 또는 $-1$) |

lasso 는 모든 계수의 크기에서 $\lambda$ 를 똑같이 빼고, 그 결과가 음수가 되면 0 으로 자른다. 이를 soft thresholding 이라고 한다. ridge 는 모든 계수를 같은 비율로 줄인다. $\lambda = 1$ 로 두고 계산하면 다음과 같다.

| $z$ | lasso | ridge |
| --- | --- | --- |
| 3 | 2 | 1 |
| 1.5 | 0.5 | 0.5 |
| 0.8 | 0 | 0.267 |
| 0.5 | 0 | 0.167 |
| -2 | -1 | -0.667 |

$\lvert z \rvert \le \lambda$ 인 계수는 lasso 에서 모두 0 이 되고, ridge 에서는 하나도 0 이 되지 않는다. 반대로 큰 계수는 lasso 가 덜 줄인다. lasso 는 $\lambda$ 만큼만 빼지만, ridge 는 크기에 비례해 줄이기 때문이다.

같은 차이를 제약 영역의 모양으로 설명할 수도 있다. L1 제약 영역은 축 위에 꼭짓점이 있는 마름모라서 손실의 등고선이 꼭짓점에 먼저 닿기 쉽다. 이 설명은 ridge regression 노트의 "Lasso 와의 차이" 절에 있다.

# C) 서로 상관된 변수가 있을 때

## C.1) L1 은 하나만 남기고, 어느 것을 남길지는 우연이다

완전히 똑같은 변수 두 개가 있고, 예측에 필요한 계수의 합이 1 이라고 하자. $(1, 0)$, $(0.5, 0.5)$, $(0.3, 0.7)$ 중 무엇을 골라도 예측값이 같으므로 데이터 쪽 손실은 같다. 차이는 벌점뿐이다.

| 계수 $(\beta_1, \beta_2)$ | L1 벌점 $\lvert\beta_1\rvert + \lvert\beta_2\rvert$ | L2 벌점 $\beta_1^2 + \beta_2^2$ |
| --- | --- | --- |
| (1, 0) | 1 | 1 |
| (0.5, 0.5) | 1 | 0.5 |
| (0.3, 0.7) | 1 | 0.58 |

- **L2** 는 고르게 나눌수록 벌점이 작아진다. 그래서 상관된 변수들이 계수를 나눠 갖는다.
- **L1** 은 어떻게 나눠도 벌점이 같아서 나눌 이유가 없다. 데이터의 작은 잡음이나 최적화 순서 때문에 한쪽이 먼저 0 에 닿으면 그대로 0 에 머문다. 그래서 하나만 남는데, 어느 쪽이 남을지는 표본에 따라 바뀐다.

## C.2) 표본을 바꿔 가며 확인하기

상관계수가 약 0.99 인 두 변수 $x_1$, $x_2$ 로 $y = x_1 + x_2 + \varepsilon$ ($\varepsilon$ 은 표준편차 1 인 잡음)을 만들고, 샘플 100 개짜리 학습 데이터를 200 번 새로 뽑아 lasso($\lambda = 0.1$)와 ridge($\lambda = 10$)를 각각 맞췄다. 변수는 표준화했고 scikit-learn 의 `Lasso`, `Ridge` 를 썼다.

| 모델 | $\beta_1$ 평균 | $\beta_2$ 평균 | 계수의 표준편차 | 한쪽 계수가 0 이 된 비율 |
| --- | --- | --- | --- | --- |
| lasso | 1.01 | 0.89 | 약 0.70 | 35.5% ($x_1$ 만 남음 18.5%, $x_2$ 만 남음 17.0%) |
| ridge | 0.96 | 0.95 | 약 0.10 | 0% |

평균으로 보면 둘 다 계수를 비슷하게 나눴다. 하지만 표본 하나로 학습한 lasso 의 계수는 표준편차가 0.70 으로, ridge 의 7 배다. 세 번 중 한 번꼴로는 두 변수 중 하나를 아예 버렸고, 어느 쪽을 버렸는지는 거의 반반이었다.

그래서 상관된 변수가 많은 데이터에서 lasso 로 고른 변수 목록은 "이 변수가 중요하다" 는 근거로 쓰기 어렵다. 데이터를 조금만 바꿔도 다른 변수가 뽑힌다. 계수가 안정적이어야 하면 ridge 를 쓰고, 변수 선택 효과도 원하면 L1 과 L2 를 섞은 [[elastic net]] 을 쓴다. L2 항이 상관된 변수들을 함께 남기도록 만든다.

lasso 에는 변수 수 $p$ 가 데이터 수 $n$ 보다 많을 때 0 이 아닌 계수를 최대 $n$ 개까지만 남긴다는 한계도 있다. elastic net 은 이 두 한계를 보완하려고 제안됐다 (Zou & Hastie, 2005).

# D) 확률로 보면: 계수에 대한 사전 분포

벌점을 더한 손실을 최소화하는 것은, 계수에 사전 분포(prior)를 두고 사후 확률이 가장 큰 계수를 찾는 MAP(maximum a posteriori) 추정과 같다. 잡음이 정규분포라면 오차 제곱합은 $-\log(\text{likelihood})$ 에 해당하고, 벌점은 $-\log(\text{prior})$ 에 해당한다.

| 벌점 | 대응하는 prior | $-\log p(\beta_j)$ (상수 제외) |
| --- | --- | --- |
| L2 ($\lambda \beta_j^2$) | 평균 0 인 정규분포 | $\beta_j^2 / (2\tau^2)$ |
| L1 ($\lambda \lvert\beta_j\rvert$) | 평균 0 인 Laplace 분포 | $\lvert\beta_j\rvert / b$ |

$\tau$ 와 $b$ 는 각 분포의 폭을 정하는 값이고, 폭이 좁을수록 $\lambda$ 가 커진다. Laplace 분포는 0 에서 뾰족하게 솟아 있어서, "대부분의 계수는 정확히 0 이고 소수만 크다" 는 믿음을 나타낸다. 정규분포는 0 근처가 둥글어서 "계수들이 모두 작다" 는 믿음에 가깝다. 두 벌점이 만드는 결과의 차이가 이 모양 차이와 같다.

# E) 변수 선택에 쓰기

예측식 $f(\boldsymbol{x}) = \sum_{d=1}^{D} w_d x_d$ 에서 lasso 가 $w_d = 0$ 으로 만든 변수 $x_d$ 는 예측에 쓰이지 않는다. 그래서 변수가 많고 그중 일부만 의미 있다고 볼 때, lasso 로 학습해 0 이 아닌 계수의 변수만 남기는 방식으로 [[feature selection]] 을 한다. $\lambda$ 를 키울수록 남는 변수가 줄어들고, $\lambda$ 는 교차검증으로 정한다.

앞 절처럼 상관된 변수가 섞여 있으면 남는 변수가 표본마다 달라지므로, 선택 결과를 해석하기 전에 표본을 바꿔 가며 같은 변수가 뽑히는지 확인한다.

# References

- Robert Tibshirani, "Regression Shrinkage and Selection via the Lasso", *Journal of the Royal Statistical Society B*, 1996.
- Hui Zou, Trevor Hastie, "Regularization and Variable Selection via the Elastic Net", *Journal of the Royal Statistical Society B*, 2005.
- Trevor Hastie, Robert Tibshirani, Jerome Friedman, *The Elements of Statistical Learning*, 2nd ed., 2009. 3.4 절 Shrinkage Methods.
