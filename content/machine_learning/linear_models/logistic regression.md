---
title: "Logistic Regression"
tags:
  - classification
  - machine_learning
aliases: ["로지스틱 회귀", "binary logistic regression"]
---

# A) Logistic Regression

logistic regression model 은 [[classification]] 문제를 해결하는데 사용하는 모델이다.

Logistic 모델 $h_\theta(x)$ 는 linear model 을 다음 식과 같이 non-linear model 로 바꾼 것과 같다.

$$
\begin{aligned}
&h_{\theta}(x)=g\left(\theta^{T} x\right) \\
&z=\theta^{T} x \\
&g(z)=\frac{1}{1+e^{-z}}
\end{aligned}
$$

여기서 $g(z)$ 는 [[sigmoid function]] 이다.

logistic regression 모델이 출력하는 값의 범위 ($0\le h_\theta(x)\le1$) 를 보고 생각해보면, $h_\theta(x)$ 는 입력에 대한 최종 예측이 $1$ 일 확률을 정해주는 것이라고 생각할 수 있다.

예를 들어, 종양을 예측하는 분류 모델에서 $h_\theta(x)=0.7$ 이면, 양성 ($1$) 일 확률이 70% 나 된다는 것이다. 이것을 조건부 확률로 표현하면 다음과 같다.

$$
\begin{align}
h_{\theta}(x)=P(y=1 \mid x ; \theta)=1-P(y=0 \mid x ; \theta) \\
P(y=0 \mid x ; \theta)+P(y=1 \mid x ; \theta)=1
\end{align}
$$

label 이 0 또는 1 인 binary logistic regression 은 같은 내용을 Bernoulli 분포로 한 줄에 쓰기도 한다.

$$
p(y\mid\boldsymbol{x};\boldsymbol{\theta})=\operatorname{Ber}\left(y\mid\sigma\left(\boldsymbol{w}^{\top}\boldsymbol{x}+b\right)\right)
$$

여기서 $\operatorname{Ber}(y\mid p)$ 는 $y=1$ 일 확률이 $p$ 인 Bernoulli 분포, $\sigma$ 는 위의 sigmoid $g$ 와 같은 함수다. $\boldsymbol{w}$ 와 $b$ 는 앞 식의 $\theta$ 를 weight 와 bias 로 나눠 쓴 것으로, $\boldsymbol{\theta}=(b,\boldsymbol{w})$ 이다.

# B) 학습: cross-entropy 를 최소화한다

logistic regression 은 [[cross-entropy|binary cross-entropy]] 를 loss 로 학습한다. 이 선택에는 세 가지 근거가 있다. 확률 모델로서 자연스럽게 나오는 loss 이고, gradient 가 단순하며, 최솟값을 찾기 쉬운 모양이다. 아래 절에서 차례로 보고, 마지막에 같은 모델을 MSE 로 학습하면 무엇이 달라지는지 본다.

## B.1) Bernoulli 가정의 MLE 가 곧 cross-entropy 최소화다

모델은 입력 $x_i$ 마다 $y_i = 1$ 일 확률 $p_i$ 를 내놓는다. 앞 절의 Bernoulli 식대로 보면, 정답이 $y_i$ 로 관측될 확률은 $y_i = 1$ 이면 $p_i$, $y_i = 0$ 이면 $1 - p_i$ 이고, 이 둘을 한 식으로 쓰면 $p_i^{y_i}(1-p_i)^{1-y_i}$ 다. 샘플들이 서로 독립이라고 보면, 학습 데이터 전체가 관측될 확률([[likelihood]])은 이 값들의 곱이다.

$$
L(\boldsymbol{w}, b) = \prod_{i=1}^{N} p_i^{\,y_i}\,(1-p_i)^{1-y_i}, \qquad p_i = \sigma(\boldsymbol{w}^\top \boldsymbol{x}_i + b)
$$

| 기호 | 뜻 |
| --- | --- |
| $\boldsymbol{x}_i$, $y_i$ | $i$ 번째 학습 샘플의 입력과 정답 (0 또는 1) |
| $\boldsymbol{w}$, $b$ | 학습할 weight 와 bias |
| $z_i = \boldsymbol{w}^\top \boldsymbol{x}_i + b$ | sigmoid 에 들어가기 전 값 (logit) |
| $p_i = \sigma(z_i)$ | 모델이 예측한 $y_i = 1$ 일 확률 |
| $N$ | 학습 샘플 수 |

likelihood 를 가장 크게 만드는 $\boldsymbol{w}, b$ 를 고르는 것이 [[Maximum Likelihood Estimation|MLE]] 다. 곱은 다루기 불편하므로 로그를 취해 합으로 바꾸고, 최대화를 최소화로 바꾸려고 부호를 뒤집는다. 이것이 [[negative log likelihood|NLL]] 이다.

$$
-\log L(\boldsymbol{w}, b) = -\sum_{i=1}^{N} \Big[ y_i \log p_i + (1-y_i)\log(1-p_i) \Big]
$$

괄호 안은 정답 분포 $(y_i, 1-y_i)$ 와 예측 분포 $(p_i, 1-p_i)$ 사이의 binary cross-entropy 그대로다. 따라서 NLL 은 binary cross-entropy 의 합이고, 샘플 수 $N$ 으로 나누면 평균 cross-entropy 가 된다. 상수배는 최솟값의 위치를 바꾸지 않으므로, cross-entropy 를 최소화하는 것과 MLE 는 같은 $\boldsymbol{w}, b$ 를 고른다.

label 을 0/1 대신 $-1$/$+1$ 로 쓰면 같은 loss 가 $\log(1 + e^{-y_i z_i})$ 꼴이 된다. [[logistic loss]] 노트의 식이 이것이다.

## B.2) gradient 가 $(p_i - y_i)$ 로 정리된다

샘플 하나의 loss 를 $\ell_i = -[y_i \log p_i + (1-y_i)\log(1-p_i)]$ 라고 하자. chain rule 로 $z_i$ 에 대한 미분을 두 단계로 구한다.

1. loss 를 $p_i$ 로 미분한다.

$$
\frac{\partial \ell_i}{\partial p_i} = -\frac{y_i}{p_i} + \frac{1-y_i}{1-p_i} = \frac{p_i - y_i}{p_i(1-p_i)}
$$

2. sigmoid 를 $z_i$ 로 미분하면 $\sigma'(z) = \sigma(z)(1-\sigma(z))$ 이므로 $\partial p_i / \partial z_i = p_i(1-p_i)$ 다.

두 값을 곱하면 분모의 $p_i(1-p_i)$ 가 정확히 지워진다.

$$
\frac{\partial \ell_i}{\partial z_i} = p_i - y_i, \qquad \nabla_{\boldsymbol{w}} \ell_i = (p_i - y_i)\,\boldsymbol{x}_i, \qquad \frac{\partial \ell_i}{\partial b} = p_i - y_i
$$

gradient 는 "예측 확률과 정답의 차이 × 입력" 이다. [[linear regression]] 을 MSE 로 학습할 때의 gradient $(\hat y_i - y_i)\boldsymbol{x}_i$ 와 모양이 같고, 예측값이 $\hat y_i$ 대신 $p_i$ 인 것만 다르다. 정답이 1 인데 $p_i$ 가 0 에 가까우면 gradient 가 $-\boldsymbol{x}_i$ 에 가까워, 크게 틀린 샘플일수록 가중치가 크게 고쳐진다.

## B.3) $\boldsymbol{w}$ 에 대해 convex 하다

B.2 의 gradient 를 한 번 더 미분하면 Hessian(2 차 미분을 모은 행렬)이 나온다. $\partial p_i / \partial \boldsymbol{w} = p_i(1-p_i)\boldsymbol{x}_i$ 이므로 다음과 같다. 여기서는 bias $b$ 를 상수 1 인 feature 의 weight 로 보고 $\boldsymbol{w}$ 안에 넣었다.

$$
\nabla^2_{\boldsymbol{w}} \sum_{i=1}^{N} \ell_i = \sum_{i=1}^{N} p_i(1-p_i)\, \boldsymbol{x}_i \boldsymbol{x}_i^\top
$$

$p_i(1-p_i)$ 는 항상 0 보다 크고, $\boldsymbol{x}_i \boldsymbol{x}_i^\top$ 은 어떤 벡터 $\boldsymbol{v}$ 에 대해서도 $\boldsymbol{v}^\top \boldsymbol{x}_i \boldsymbol{x}_i^\top \boldsymbol{v} = (\boldsymbol{x}_i^\top \boldsymbol{v})^2 \ge 0$ 이다. 그래서 Hessian 은 positive semi-definite 이고, loss 는 $\boldsymbol{w}$ 에 대해 convex 하다.

convex 함수에는 전역 최솟값이 아닌 국소 최솟값이 없다. 그래서 [[gradient descent]] 나 Newton 법으로 내려가다 멈춘 곳이 곧 전체에서 가장 낮은 곳이고, 초기값을 어떻게 잡아도 같은 최솟값에 도달한다.

조건이 하나 있다. 학습 데이터가 어떤 초평면으로 완벽히 갈라지면(linearly separable), $\boldsymbol{w}$ 를 그 방향으로 키울수록 모든 $p_i$ 가 정답 쪽 끝으로 다가가 loss 가 계속 줄어든다. 이때는 최솟값에 도달하는 유한한 $\boldsymbol{w}$ 가 없고 가중치가 끝없이 커진다. L2 [[regularization]] 을 더하면 $\boldsymbol{w}$ 가 커질수록 벌점도 커지므로, 가중치가 유한한 값에서 멈춘다.

## B.4) MSE 로 학습하면 생기는 문제

같은 모델을 $(p_i - y_i)^2$ 로 학습한다고 해 보자. B.2 와 같은 방식으로 미분하면, loss 를 $p_i$ 로 미분한 값 $2(p_i - y_i)$ 에 sigmoid 의 미분 $p_i(1-p_i)$ 가 곱해진 채 남는다.

$$
\frac{\partial}{\partial z_i}(p_i - y_i)^2 = 2\,(p_i - y_i)\; p_i(1-p_i)
$$

cross-entropy 에서는 loss 쪽 미분의 분모가 이 $p_i(1-p_i)$ 를 지워 주었지만, MSE 에는 지워 줄 분모가 없다. 그래서 두 가지 문제가 생긴다.

**gradient 가 소실된다.** $p_i(1-p_i)$ 는 $p_i$ 가 0 이나 1 에 가까우면 0 에 가깝다. 정답이 1 인데 $p_i$ 가 0 에 가까운, 가장 크게 틀린 샘플에서 gradient 가 거의 0 이 되어 학습이 고쳐 주지 않는다.

**convex 하지 않다.** 샘플 하나($x = 1$, $y = 1$, bias 없음)로 $p = \sigma(w)$ 인 경우를 계산하면, MSE 의 2 차 미분은 $-2p(1-p)^2(1-3p)$ 다. $p < 1/3$, 즉 $w < -\ln 2 \approx -0.69$ 에서 음수라서 이 구간의 loss 곡선은 위로 볼록하다. 같은 경우 cross-entropy 의 2 차 미분은 $p(1-p)$ 로 항상 양수다.

이 샘플 하나로 $w$ 를 바꿔 가며 두 loss 를 비교하면 다음과 같다.

| $w$ | $p = \sigma(w)$ | CE loss | CE gradient | MSE loss | MSE gradient |
| --- | --- | --- | --- | --- | --- |
| -5 | 0.007 | 5.01 | -0.993 | 0.987 | -0.013 |
| -2 | 0.119 | 2.13 | -0.881 | 0.776 | -0.185 |
| -0.69 | 0.333 | 1.10 | -0.667 | 0.444 | -0.296 |
| 0 | 0.500 | 0.69 | -0.500 | 0.250 | -0.250 |
| 2 | 0.881 | 0.13 | -0.119 | 0.014 | -0.025 |

cross-entropy 의 gradient 는 틀릴수록($w$ 가 작을수록) 커진다. MSE 의 gradient 는 $w = -0.69$ 에서 가장 크고, 그보다 더 틀린 쪽으로 갈수록 오히려 작아진다. $w = -5$ 에서는 cross-entropy 의 약 75 분의 1 이다. loss 곡선이 왼쪽에서 거의 평평해지므로, 초기값이 이 구간에 있으면 gradient descent 가 거의 움직이지 않는다.

샘플이 여럿이면 이런 평평한 구간과 굽은 구간이 샘플마다 다른 위치에 생기고, 이들을 더한 loss 에는 국소 최솟값이 여러 개 생길 수 있다. Auer, Herbster, Warmuth (NeurIPS 1995, "Exponentially many local minima for single neurons") 는 sigmoid 뉴런 하나를 제곱 오차로 학습할 때 국소 최솟값의 수가 입력 차원에 대해 지수적으로 늘어날 수 있음을 보였다.

# C) Why We Need Logistic Regression?

[[linear regression]] 으로는 classification 문제들을 풀어내기가 힘들다.

## C.1) Example

아래의 그림의 경우 linear model $h_\theta(x)=\theta^Tx$ 가 magenta 색에서 잘 분리하는 듯 보였지만, outlier 의 등장에 취약한 모습을 보인다.  

![[img-be213e509a.png|image-20200929000946847|500]]

# D) Optimization

최적화 과정은 [[Newton-Raphson method]] 방식이나 [[gradient descent]] 와 같은 iterative 한 방식을 통해 parameter 를 추정할 수 있다.

# E) Related

 * [[Sequential logistic regression]], [[Decision boundary]], [[odds ratio]]
