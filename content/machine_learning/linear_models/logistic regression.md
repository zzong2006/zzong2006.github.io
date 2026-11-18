---
title: "Logistic Regression"
tags:
  - classification
  - machine_learning
aliases: ["로지스틱 회귀", "binary logistic regression"]
---

# A) 선형 회귀로 분류하면 생기는 문제

logistic regression 은 입력을 보고 두 가지 결과 중 하나(정답 $y$ 가 0 또는 1)를 예측하는 [[classification]] 모델이다. 결과가 1 일 확률을 함께 내놓는다는 점이 특징이다.

이 모델이 왜 필요한지는, 같은 문제를 [[linear regression]] 으로 풀어 보면 드러난다. 종양 크기 $x$ 로 악성($y = 1$)인지 양성($y = 0$)인지를 맞히는 문제를 생각하자. 직선 $\hat y = wx + b$ 를 0 과 1 에 맞춘 뒤, $\hat y \ge 0.5$ 이면 악성이라고 판정하면 될 것 같다.

![[img-be213e509a.png|image-20200929000946847|500]]

그림에서 처음 그은 가파른 직선은 실제로 두 무리를 잘 가른다. 그런데 오른쪽 끝에 동그라미로 표시한 아주 큰 악성 종양 하나가 더해지면, 직선이 그 점까지 맞추려고 완만하게 눕는다. 직선이 0.5 를 지나는 위치가 오른쪽으로 밀리고, 원래 악성으로 맞히던 종양 일부가 양성으로 판정된다.

숫자로 확인해 보면 다음과 같다. 크기 1, 2, 3, 4 인 양성과 6, 7, 8, 9 인 악성으로 학습하고, 두 번째 줄에서는 크기 30 인 악성 하나를 더했다.

| 학습 데이터 | 선형 회귀의 판정 경계 | 선형 회귀가 틀린 샘플 | logistic regression 의 판정 경계 |
| --- | --- | --- | --- |
| 8 개 | 5.0 | 0 개 | 5.0 |
| 8 개 + 크기 30 악성 | 6.16 | 1 개 (크기 6) | 5.0 |

선형 회귀로 분류하면 두 가지 문제가 생긴다.

- **판정과 상관없는 샘플이 경계를 움직인다.** 크기 30 인 종양은 누가 봐도 악성이라 판정에 아무 문제가 없다. 그런데 제곱 오차는 이 샘플의 예측값이 1 에서 멀다는 이유로 직선 전체를 끌어당긴다.
- **출력이 확률로 읽히지 않는다.** 크기 30 을 넣기 전의 직선도 크기 0 에서 $-0.33$, 크기 30 에서 $4.67$ 을 내놓는다. 0 과 1 사이를 벗어나는 값은 "악성일 확률" 로 해석할 수 없다.

logistic regression 은 두 문제를 모두 피한다. 출력을 항상 0 과 1 사이로 눌러 담고, 위 표처럼 이미 확실하게 맞힌 샘플은 경계를 거의 움직이지 않는다. 뒤의 두 절에서 각각 그 방법과 이유를 본다.

# B) 모델: 선형 점수를 확률로 바꾼다

## B.1) 식

logistic regression 은 선형 회귀와 똑같이 입력의 가중합을 먼저 계산한다. 그다음 이 값을 [[sigmoid function]] $\sigma$ 에 넣어 0 과 1 사이의 확률로 바꾼다.

$$
z = \boldsymbol{w}^\top \boldsymbol{x} + b, \qquad
p = \sigma(z) = \frac{1}{1 + e^{-z}}
$$

| 기호 | 뜻 |
| --- | --- |
| $\boldsymbol{x}$ | 입력 feature 벡터 |
| $\boldsymbol{w}$, $b$ | 학습할 가중치(weight)와 절편(bias) |
| $z$ | 가중합. 어떤 실수든 될 수 있다. logit 이라고도 부른다 |
| $p$ | 모델이 예측한 $y = 1$ 일 확률, $P(y = 1 \mid \boldsymbol{x})$ |

sigmoid 는 아무 실수나 받아 0 과 1 사이의 값을 돌려준다.

| $z$ | -4 | -2 | -1 | 0 | 1 | 2 | 4 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| $\sigma(z)$ | 0.018 | 0.119 | 0.269 | 0.5 | 0.731 | 0.881 | 0.982 |

$z$ 가 클수록 1 에, 작을수록 0 에 가까워지고, $z = 0$ 에서 정확히 0.5 다. $z$ 가 아무리 커져도 출력은 1 을 넘지 않으므로, 앞 절의 크기 30 종양처럼 극단적인 입력도 확률 범위 안에 들어온다.

$p$ 가 $y = 1$ 일 확률이므로 $y = 0$ 일 확률은 $1 - p$ 다. 두 경우를 한 식으로 쓰면 다음과 같다. $y = 1$ 을 넣으면 $p$, $y = 0$ 을 넣으면 $1 - p$ 가 남는다. 동전 던지기처럼 결과가 둘뿐인 분포를 Bernoulli 분포라고 한다.

$$
P(y \mid \boldsymbol{x}) = p^{\,y}\,(1 - p)^{1 - y}
$$

강의 자료에서는 같은 모델을 $h_\theta(x) = g(\theta^\top x)$ 로 쓰기도 한다. $g$ 는 sigmoid, $\theta$ 는 $b$ 와 $\boldsymbol{w}$ 를 한 벡터로 합친 것이고, $h_\theta(x)$ 가 여기의 $p$ 다. 위 그림의 $h_\theta(x) = \theta^\top x$ 는 sigmoid 를 씌우기 전, 즉 선형 회귀의 직선이다.

## B.2) 예시: 공부 시간으로 합격 확률 예측하기

공부 시간 $x$ (시간)로 시험 합격 여부를 예측하는 모델이 $w = 1.5$, $b = -4$ 로 학습됐다고 하자. 설명을 위해 정한 값이다.

| 공부 시간 $x$ | $z = 1.5x - 4$ | 합격 확률 $p$ | odds $p / (1 - p)$ |
| --- | --- | --- | --- |
| 1 | -2.5 | 0.076 | 0.082 |
| 2 | -1.0 | 0.269 | 0.368 |
| 3 | 0.5 | 0.622 | 1.649 |
| 4 | 2.0 | 0.881 | 7.389 |

공부 시간이 늘수록 합격 확률이 오르지만, 오르는 폭은 일정하지 않다. 1 시간에서 2 시간으로 갈 때는 0.19, 2 시간에서 3 시간으로 갈 때는 0.35, 3 시간에서 4 시간으로 갈 때는 0.26 오른다. 확률이 0 이나 1 에 가까운 쪽에서는 sigmoid 가 납작하기 때문이다. 표의 마지막 열인 odds 는 다음 절에서 쓴다.

## B.3) 가중치는 log-odds 에 더해진다

확률의 증가 폭이 일정하지 않으면, 가중치 $w$ 를 "공부 시간 1 시간당 합격 확률이 얼마 오른다" 로 읽을 수 없다. 대신 일정하게 바뀌는 양이 있는데, 그것이 odds 다.

odds 는 일이 일어날 확률을 일어나지 않을 확률로 나눈 값이다 ([[odds ratio|odds]]). 합격 확률이 0.8 이면 odds 는 $0.8 / 0.2 = 4$ 로, "합격이 불합격보다 4 배 그럴듯하다" 는 뜻이다. sigmoid 식을 $z$ 에 대해 풀면 다음 관계가 나온다.

$$
\log \frac{p}{1 - p} = z = \boldsymbol{w}^\top \boldsymbol{x} + b
$$

즉 logistic regression 은 확률 자체가 아니라 **odds 의 로그(log-odds)를 입력의 선형식으로 표현하는 모델** 이다. 그래서 feature $x_j$ 가 1 늘면 log-odds 가 $w_j$ 만큼 늘고, odds 는 $e^{w_j}$ 배가 된다.

앞의 예시에서 $e^{1.5} \approx 4.48$ 이다. 표의 odds 열을 보면 0.082 → 0.368 → 1.649 → 7.389 로, 공부 시간이 1 시간 늘 때마다 정확히 4.48 배씩 커진다. 확률의 증가 폭은 구간마다 달랐지만 odds 의 배율은 어디서나 같다. 가중치 하나하나를 해석해야 하는 의료·금융 분야에서 logistic regression 을 많이 쓰는 이유가 이 성질이다.

## B.4) 판정 경계는 직선(초평면)이다

확률을 0 또는 1 의 판정으로 바꿀 때는 기준값(threshold)을 정한다. 기준값이 0.5 이면, sigmoid 가 $z = 0$ 에서 0.5 이므로 다음이 성립한다.

$$
p \ge 0.5 \iff z \ge 0 \iff \boldsymbol{w}^\top \boldsymbol{x} + b \ge 0
$$

판정이 바뀌는 경계는 $\boldsymbol{w}^\top \boldsymbol{x} + b = 0$ 이다. feature 가 하나면 점, 둘이면 직선, 셋 이상이면 평면(초평면)이다. 공부 시간 예시에서는 $1.5x - 4 = 0$, 즉 약 2.67 시간이 경계다.

sigmoid 는 확률을 계산할 뿐 경계의 모양은 바꾸지 않으므로, logistic regression 은 선형 분류기다. 곡선 경계가 필요하면 $x^2$ 이나 두 feature 의 곱처럼 새 feature 를 만들어 넣는다. 그러면 원래 입력 공간에서 보면 경계가 휜다. 예시와 그림은 [[Decision boundary]] 노트에 있다.

기준값을 꼭 0.5 로 둘 필요는 없다. 놓치면 큰 비용이 드는 경우(암 진단)에는 기준값을 낮추고, 잘못 경보하면 큰 비용이 드는 경우에는 높인다. positive 가 드문 데이터에서 기준값을 고르는 방법은 [[class imbalance problem]] 노트에 있다.

# C) 학습: cross-entropy 를 최소화한다

logistic regression 은 [[cross-entropy|binary cross-entropy]] 를 loss 로 학습한다. 이 선택에는 세 가지 근거가 있다. 확률 모델에서 자연스럽게 나오는 loss 이고, gradient 가 단순하며, 최솟값을 찾기 쉬운 모양이다. 아래에서 차례로 보고, 마지막에 같은 모델을 MSE(제곱 오차)로 학습하면 무엇이 달라지는지 본다.

## C.1) 정답에 준 확률이 낮을수록 loss 가 커진다

샘플 하나의 binary cross-entropy 는 다음과 같다.

$$
\ell = -\big[\, y \log p + (1 - y) \log(1 - p) \,\big]
$$

$y = 1$ 이면 둘째 항이 사라져 $-\log p$ 가, $y = 0$ 이면 첫째 항이 사라져 $-\log(1 - p)$ 가 남는다. 어느 쪽이든 **모델이 실제 정답에 준 확률의 $-\log$** 다.

| 정답에 준 확률 | 0.9 | 0.6 | 0.1 | 0.01 |
| --- | --- | --- | --- | --- |
| loss | 0.105 | 0.511 | 2.303 | 4.605 |

정답을 확신하고 맞히면 loss 가 0 에 가깝다. 정답에 낮은 확률을 줄수록 loss 가 빠르게 커지고, 정답에 0 을 주면 무한대가 된다. 공부 시간 예시에서 3 시간 공부한 학생($p = 0.622$)이 실제로 합격했으면 loss 는 $-\log 0.622 = 0.474$, 불합격했으면 $-\log 0.378 = 0.974$ 다.

## C.2) 이 loss 는 MLE 에서 나온다

학습 데이터 $N$ 개가 있고, $i$ 번째 샘플의 입력과 정답이 $\boldsymbol{x}_i$, $y_i$, 모델의 예측이 $p_i = \sigma(\boldsymbol{w}^\top \boldsymbol{x}_i + b)$ 라고 하자. 앞에서 본 Bernoulli 식에 따르면, 모델이 맞다고 할 때 정답 $y_i$ 가 관측될 확률은 $p_i^{y_i}(1-p_i)^{1-y_i}$ 다. 샘플들이 서로 독립이면, 학습 데이터 전체가 관측될 확률([[likelihood]])은 이 값들의 곱이다.

$$
L(\boldsymbol{w}, b) = \prod_{i=1}^{N} p_i^{\,y_i}\,(1-p_i)^{1-y_i}
$$

관측된 데이터가 나올 확률을 가장 크게 만드는 $\boldsymbol{w}, b$ 를 고르는 것이 [[Maximum Likelihood Estimation|MLE]] 다. 곱은 다루기 불편하므로 로그를 취해 합으로 바꾸고, 최대화를 최소화 문제로 바꾸려고 부호를 뒤집는다. 이것이 [[negative log likelihood|NLL]] 이다.

$$
-\log L(\boldsymbol{w}, b) = -\sum_{i=1}^{N} \Big[ y_i \log p_i + (1-y_i)\log(1-p_i) \Big]
$$

합 안의 각 항이 앞 절의 샘플별 binary cross-entropy 그대로다. 따라서 NLL 은 binary cross-entropy 의 합이고, $N$ 으로 나누면 평균 cross-entropy 가 된다. 상수배는 최솟값의 위치를 바꾸지 않으므로, 평균 cross-entropy 를 최소화하는 것과 MLE 는 같은 $\boldsymbol{w}, b$ 를 고른다.

정답을 0/1 대신 $-1$/$+1$ 로 쓰면 같은 loss 가 $\log(1 + e^{-y_i z_i})$ 꼴이 된다. [[logistic loss]] 노트의 식이 이것이다.

## C.3) gradient 는 "예측 확률 − 정답" 에 입력을 곱한 것이다

샘플 하나의 loss $\ell_i$ 를 $z_i = \boldsymbol{w}^\top \boldsymbol{x}_i + b$ 로 미분한다. chain rule 로 두 단계로 나눈다.

1. loss 를 $p_i$ 로 미분한다.

$$
\frac{\partial \ell_i}{\partial p_i} = -\frac{y_i}{p_i} + \frac{1-y_i}{1-p_i} = \frac{p_i - y_i}{p_i(1-p_i)}
$$

2. sigmoid 의 미분은 $\sigma'(z) = \sigma(z)(1-\sigma(z))$ 이므로 $\partial p_i / \partial z_i = p_i(1-p_i)$ 다.

두 값을 곱하면 분모의 $p_i(1-p_i)$ 가 정확히 지워진다.

$$
\frac{\partial \ell_i}{\partial z_i} = p_i - y_i, \qquad
\frac{\partial \ell_i}{\partial \boldsymbol{w}} = (p_i - y_i)\,\boldsymbol{x}_i, \qquad
\frac{\partial \ell_i}{\partial b} = p_i - y_i
$$

gradient 는 "예측 확률과 정답의 차이" 에 입력을 곱한 것이다. 선형 회귀를 MSE 로 학습할 때의 gradient $(\hat y_i - y_i)\boldsymbol{x}_i$ 와 모양이 같고, 예측값 자리에 $p_i$ 가 들어간 것만 다르다.

공부 시간 예시로 계산해 보면 다음과 같다. [[gradient descent]] 는 gradient 의 반대 방향으로 가중치를 옮긴다.

| 샘플 | $p$ | $p - y$ | $w$ 의 gradient | gradient descent 가 하는 일 |
| --- | --- | --- | --- | --- |
| 3 시간, 불합격 ($y = 0$) | 0.622 | 0.622 | $0.622 \times 3 = 1.87$ | $w$ 를 줄여 3 시간의 합격 확률을 낮춘다 |
| 1 시간, 합격 ($y = 1$) | 0.076 | -0.924 | $-0.924 \times 1 = -0.92$ | $w$ 를 키워 1 시간의 합격 확률을 높인다 |
| 4 시간, 합격 ($y = 1$) | 0.881 | -0.119 | $-0.119 \times 4 = -0.48$ | 이미 잘 맞혀서 조금만 움직인다 |

$p - y$ 는 틀린 정도 그 자체다. 크게 틀린 샘플일수록 가중치를 크게 고치고, 확실히 맞힌 샘플은 $p - y$ 가 0 에 가까워 거의 영향을 주지 않는다. 앞의 종양 예제에서 크기 30 인 악성 종양이 logistic regression 의 경계를 움직이지 못한 이유가 이것이다. 이 샘플의 예측 확률은 거의 1 이라 $p - y \approx 0$ 이다. 선형 회귀에서는 같은 샘플의 오차 $\hat y - y$ 가 컸기 때문에 직선을 끌어당겼다.

## C.4) loss 가 가중치에 대해 convex 하다

앞에서 구한 gradient 를 한 번 더 미분하면 Hessian(2 차 미분을 모은 행렬)이 나온다. 여기서는 $b$ 를 값이 항상 1 인 feature 의 가중치로 보고 $\boldsymbol{w}$ 안에 넣었다. $\partial p_i / \partial \boldsymbol{w} = p_i(1-p_i)\boldsymbol{x}_i$ 이므로 다음과 같다.

$$
\nabla^2_{\boldsymbol{w}} \sum_{i=1}^{N} \ell_i = \sum_{i=1}^{N} p_i(1-p_i)\, \boldsymbol{x}_i \boldsymbol{x}_i^\top
$$

$p_i(1-p_i)$ 는 항상 0 보다 크다. $\boldsymbol{x}_i \boldsymbol{x}_i^\top$ 은 어떤 벡터 $\boldsymbol{v}$ 에 대해서도 $\boldsymbol{v}^\top \boldsymbol{x}_i \boldsymbol{x}_i^\top \boldsymbol{v} = (\boldsymbol{x}_i^\top \boldsymbol{v})^2 \ge 0$ 이다. 이런 행렬을 더한 Hessian 은 positive semi-definite 이고, 따라서 loss 는 $\boldsymbol{w}$ 에 대해 convex 하다. 그래프로 그리면 어느 방향으로 잘라 봐도 아래로 볼록한 그릇 모양이다.

convex 함수에는 전체 최솟값이 아닌 국소 최솟값이 없다. gradient descent 나 Newton 법으로 내려가다 멈춘 곳이 곧 전체에서 가장 낮은 곳이고, 초기값을 어떻게 잡아도 같은 답에 도달한다.

조건이 하나 있다. 학습 데이터가 어떤 초평면으로 완벽히 갈라지면(linearly separable), $\boldsymbol{w}$ 를 그 방향으로 키울수록 모든 $p_i$ 가 정답 쪽 끝으로 다가가 loss 가 계속 줄어든다. 이때는 최솟값에 도달하는 유한한 $\boldsymbol{w}$ 가 없고 가중치가 끝없이 커진다. L2 [[regularization]] 을 더하면 $\boldsymbol{w}$ 가 커질수록 벌점도 커지므로 가중치가 유한한 값에서 멈춘다. 앞의 종양 데이터도 크기 5 를 기준으로 완벽히 갈라지는 데이터인데, scikit-learn 의 `LogisticRegression` 이 기본으로 L2 벌점을 넣기 때문에 경계가 5.0 으로 정해졌다.

## C.5) MSE 로 학습하면 생기는 문제

같은 모델을 제곱 오차 $(p_i - y_i)^2$ 로 학습한다고 해 보자. gradient 를 구할 때와 같은 방식으로 미분하면, loss 를 $p_i$ 로 미분한 값 $2(p_i - y_i)$ 에 sigmoid 의 미분 $p_i(1-p_i)$ 가 곱해진 채 남는다.

$$
\frac{\partial}{\partial z_i}(p_i - y_i)^2 = 2\,(p_i - y_i)\; p_i(1-p_i)
$$

cross-entropy 에서는 loss 쪽 미분의 분모가 이 $p_i(1-p_i)$ 를 지워 주었지만, MSE 에는 지워 줄 분모가 없다. 그래서 두 가지 문제가 생긴다.

**크게 틀린 샘플에서 gradient 가 사라진다.** $p_i(1-p_i)$ 는 $p_i$ 가 0 이나 1 에 가까우면 0 에 가깝다. 정답이 1 인데 $p_i$ 가 0 에 가까운, 가장 크게 틀린 샘플에서 gradient 가 거의 0 이 되어 학습이 이 샘플을 고치지 못한다.

**convex 하지 않다.** 샘플 하나($x = 1$, $y = 1$, bias 없음)로 $p = \sigma(w)$ 인 경우를 계산하면, MSE 의 2 차 미분은 $-2p(1-p)^2(1-3p)$ 다. $p < 1/3$, 즉 $w < -\ln 2 \approx -0.69$ 에서 음수라서, 이 구간의 loss 곡선은 위로 볼록하다. 같은 경우 cross-entropy 의 2 차 미분은 $p(1-p)$ 로 항상 양수다.

이 샘플 하나로 $w$ 를 바꿔 가며 두 loss 를 비교하면 다음과 같다.

| $w$ | $p = \sigma(w)$ | CE loss | CE gradient | MSE loss | MSE gradient |
| --- | --- | --- | --- | --- | --- |
| -5 | 0.007 | 5.01 | -0.993 | 0.987 | -0.013 |
| -2 | 0.119 | 2.13 | -0.881 | 0.776 | -0.185 |
| -0.69 | 0.333 | 1.10 | -0.667 | 0.444 | -0.296 |
| 0 | 0.500 | 0.69 | -0.500 | 0.250 | -0.250 |
| 2 | 0.881 | 0.13 | -0.119 | 0.014 | -0.025 |

cross-entropy 의 gradient 는 많이 틀릴수록($w$ 가 작을수록) 커진다. MSE 의 gradient 는 $w = -0.69$ 에서 가장 크고, 그보다 더 틀린 쪽으로 갈수록 오히려 작아진다. $w = -5$ 에서는 cross-entropy 의 약 75 분의 1 이다. loss 곡선이 왼쪽에서 거의 평평해지므로, 초기값이 이 구간에 있으면 gradient descent 가 거의 움직이지 않는다.

샘플이 여럿이면 이런 평평한 구간과 굽은 구간이 샘플마다 다른 위치에 생기고, 이들을 더한 loss 에는 국소 최솟값이 여러 개 생길 수 있다. Auer, Herbster, Warmuth (1995) 는 sigmoid 뉴런 하나를 제곱 오차로 학습할 때 국소 최솟값의 수가 입력 차원에 대해 지수적으로 늘어날 수 있음을 보였다.

# D) 최적화 방법

선형 회귀는 loss 를 가장 작게 만드는 가중치를 식 하나(정규 방정식)로 바로 구할 수 있다. logistic regression 은 $p_i$ 가 가중치에 대해 비선형이라 그런 식이 없다. 대신 loss 가 convex 하므로, 조금씩 내려가는 반복 방법으로 전체 최솟값을 찾는다.

- **gradient descent**: 앞에서 구한 샘플별 gradient 를 모든 샘플에 대해 더해, learning rate $\alpha$ 만큼 반대 방향으로 옮긴다.

$$
\boldsymbol{w} \leftarrow \boldsymbol{w} - \alpha \sum_{i=1}^{N} (p_i - y_i)\,\boldsymbol{x}_i, \qquad
b \leftarrow b - \alpha \sum_{i=1}^{N} (p_i - y_i)
$$

- **Newton 법**: gradient 와 함께 convex 성을 확인할 때 쓴 Hessian 을 써서, 곡률까지 고려한 보폭으로 한 번에 크게 이동한다 ([[Newton-Raphson method]]). 보통 열 번 안팎의 반복으로 수렴한다. 반복 한 번이 가중치 $p_i(1-p_i)$ 를 단 최소제곱 문제를 푸는 것과 같아서 IRLS(iteratively reweighted least squares)라고도 부른다. 다만 feature 가 $d$ 개면 $d \times d$ Hessian 을 풀어야 해서, feature 가 많으면 느리다.

feature 가 많으면 Hessian 을 근사해서 쓰는 L-BFGS 나, 미니배치로 gradient 를 추정하는 SGD 를 쓴다. scikit-learn 의 `LogisticRegression` 은 기본으로 L-BFGS 와 L2 벌점(`C=1.0`, $C$ 는 벌점 세기의 역수)을 쓴다.

# E) 확장

- **클래스가 셋 이상이면**: 클래스 $k$ 마다 점수 $z_k = \boldsymbol{w}_k^\top \boldsymbol{x} + b_k$ 를 두고, softmax $p_k = e^{z_k} / \sum_j e^{z_j}$ 로 확률을 만든다. multinomial logistic regression 이라고 부른다. 클래스가 둘이면 $p_1 = \sigma(z_1 - z_0)$ 이 되어 이 노트의 모델과 같아진다. 클래스마다 "이 클래스인가 아닌가" 를 따로 학습하는 one-vs-rest 방식도 있다.
- **데이터가 계속 들어오면**: 가중치를 하나의 값이 아니라 확률분포로 두고, 새 데이터가 올 때마다 그 분포를 갱신하는 베이지안 방식이 있다. 광고 클릭 예측에서 쓰는 [[Sequential logistic regression]] 이 그 예다.
- **예측 확률을 그대로 쓰면**: logistic regression 은 확률의 정확도를 보는 loss 로 학습하므로, 학습 데이터와 같은 분포에서는 예측 확률이 실제 비율과 비교적 잘 맞는다. 다만 negative 를 버리거나 class weight 를 주어 학습하면 확률이 부풀려지므로 되돌려야 한다 ([[class imbalance problem]], [[probability calibration]]).

# References

- Trevor Hastie, Robert Tibshirani, Jerome Friedman, *The Elements of Statistical Learning*, 2nd ed., Springer, 2009. 4.4 절 Logistic Regression.
- Christopher M. Bishop, *Pattern Recognition and Machine Learning*, Springer, 2006. 4.3.2 절 Logistic regression, 4.3.3 절 Iterative reweighted least squares.
- Peter Auer, Mark Herbster, Manfred K. Warmuth, "Exponentially many local minima for single neurons", NeurIPS 1995.
