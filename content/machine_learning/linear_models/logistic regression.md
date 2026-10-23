---
title: "logistic regression"
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

# B) Loss Function

logistic regression 모델이 확률을 예측하기 때문에, [[likelihood]] 를 사용해서 parameter 를 fitting 할 수 있다.

feature $x_{i}$ 가 주어지고, 이에 따른 binary 관측 class $y_{i}$ 가 주어질 때, $y_i = 1$ 일 확률이 $p$ 이고, $y_i=0$ 일 확률이 $1-p$ 인 경우, likelihood 는 아래와 같다.  

$$
L\left(\beta_{0}, \beta\right)=\prod_{i=1}^{n} p\left(x_{i}\right)^{y_{i}}(1-p\left(x_{i}\right))^{1-y_{i}}
$$

그리고 위 함수를 log-likelihood 로 변환하면 다음과 같다.

$$
\ell\left(\beta_{0}, \beta\right)=\sum_{i=1}^{n} y_{i} \log p\left(x_{i}\right)+\left(1-y_{i}\right) \log 1-p\left(x_{i}\right)
$$

학습 과정에서는 위 함수를 [[negative log likelihood|NLL]] 로 변환하여 최적화한다.

# C) Why We Need Logistic Regression?

[[linear regression]] 으로는 classification 문제들을 풀어내기가 힘들다.

## C.1) Example

아래의 그림의 경우 linear model $h_\theta(x)=\theta^Tx$ 가 magenta 색에서 잘 분리하는 듯 보였지만, outlier 의 등장에 취약한 모습을 보인다.  

![[img-be213e509a.png|image-20200929000946847|500]]

# D) Optimization

최적화 과정은 [[Newton-Raphson method]] 방식이나 [[gradient descent]] 와 같은 iterative 한 방식을 통해 parameter 를 추정할 수 있다.

# E) Related

 * [[Sequential logistic regression]], [[Decision boundary]], [[odds ratio]]
