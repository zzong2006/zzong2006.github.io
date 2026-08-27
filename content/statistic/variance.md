---
tags: ["statistic", "machine_learning"]
aliases: ["분산"]
---

# A) Variance ?

variance 는 평균에서 얼마나 벗어난 것인지의 정도를 측정한 값이다.

랜덤 변수 $X$ 에 대한 Variance 는 [[expectation]] 을 활용하면 다음과 같이 두가지 방식으로 표현될 수 있다.

$$
\operatorname{Var}(X)=\mathrm{E}\left[(X-\mu)^{2}\right],\mu=\mathrm{E}[X]
$$

또는

$$
\begin{aligned}\operatorname{Var}(X)&=\mathrm{E}\left[(X-\mathrm{E}[X])^{2}\right]\\&=\mathrm{E}\left[X^{2}-2X\mathrm{E}[X]+\mathrm{E}[X]^{2}\right]\\&=\mathrm{E}\left[X^{2}\right]-2\mathrm{E}[X]\mathrm{E}[X]+\mathrm{E}[X]^{2}\\&=\mathrm{E}\left[X^{2}\right]-\mathrm{E}[X]^{2}\end{aligned}
$$

첫번째 식은 기대값을 구하고 분산을 구해야되는 두가지 step 을 거치지만, 두번째 식인 raw-score formula 를 이용하면 단 한번에 계산이 가능하다.

Variance refers to the amount by which $\hat{f}$(estimated function) would change if we estimated it using a different training data set.

# B) Understanding the variance

variance 는 모든 관측 가능한 데이터의 쌍에 대한 pairwise 차의 합으로 생각할 수 있다: it is a sum of pairwise differences between all pairs of observations.

이게 무슨말이냐면, 랜덤 변수 $X$ 에서 얻을 수 있는 sample $x_1,…,x_N$ 에 대해서, 각 샘플 간 거리 제곱의 합을 계산할 수 있다.

$$
\displaystyle\frac{1}{N^{2}}\sum_{i,j=1}^{N}\left(x_{i}-x_{j}\right)^{2}=2\left[\frac{1}{N}\sum_{i=1}^{N}x_{i}^{2}-\left(\frac{1}{N}\sum_{i=1}^{N}x_{i}\right)^{2}\right]
$$

근데 보다시피, 이건 variance(raw-score formula) 에 2 를 곱한 값이다. 즉, 데이터의 중심으로부터 거리와 각 데이터 간 거리가 동일하다고 생각 할 수 있다.

# C) Useful Properties of variance

* $\operatorname{Var}(a+b Y)=b^{2} \operatorname{Var}(Y)$

랜덤 변수 $X,Y$ 에 대하여 states $\boldsymbol{x},\boldsymbol{y}\in\mathbb{R}^{D}$ 가 affine transformation $\boldsymbol{y}=\boldsymbol{A}\boldsymbol{x}+\boldsymbol{b}$ 을 만족할 때, 아래 식이 성립한다.

$$
\mathbb{V}_{Y}[\boldsymbol{y}]=\mathbb{V}_{X}[\boldsymbol{A}\boldsymbol{x}+\boldsymbol{b}]=\mathbb{V}_{X}[\boldsymbol{A}\boldsymbol{x}]=\\\boldsymbol{A}\mathbb{V}_{X}[\boldsymbol{x}]\boldsymbol{A}^{\top}=\boldsymbol{A}\boldsymbol{\Sigma}\boldsymbol{A}^{\top}
$$

$\Sigma$ 는 [[covariance]] matrix (공분산 행렬)

$$
\begin{aligned}\mathrm{V}[\boldsymbol{x}+\boldsymbol{y}]&=\mathrm{V}[\boldsymbol{x}]+\mathrm{V}[\boldsymbol{y}]+\operatorname{Cov}[\boldsymbol{x},\boldsymbol{y}]+\operatorname{Cov}[\boldsymbol{y},\boldsymbol{x}]\\\mathrm{V}[\boldsymbol{x}-\boldsymbol{y}]&=\mathrm{V}[\boldsymbol{x}]+\mathrm{V}[\boldsymbol{y}]-\operatorname{Cov}[\boldsymbol{x},\boldsymbol{y}]-\operatorname{Cov}[\boldsymbol{y},\boldsymbol{x}]\end{aligned}
$$

# D) Variance in Machine Learning

variance 는 데이터 내에 있는 error 나 noise 까지 잘 잡아내는 highly flexible models 에 데이터를 fitting 시킴으로써, 실제 현상과 관계 없는 random 한 것들까지 학습하는 알고리즘의 경향을 의미한다.
여러 모델로 학습을 반복한다고 했을 때, 학습된 각 모델 별로 예측한 값들의 차이를 variance 라고 생각할 수 있다.

# E) High Variance and Low Variance

* overfitting, high variance: 만약, 모델 마다 예측한 값들이 서로 크게 다르다면, 특정 데이터에 대해서만 반복적으로 학습된 것이다. 즉, 학습 데이터에서의 작은 변화가 parameter 추정값에 큰 변화를 만든다는 의미로 해석할 수 있다.
* low variance: 그러나, 모델 마다 예측한 값이 크게 다르지 않다면, 전반적인 데이터에 대한 학습이 잘 되었다고 생각할 수 있다.

High Variance 는 주로 복잡한 모델에서 나타나는데, 모델이 복잡할수록 (more flexible) overfitting 이 발생할 확률이 높다.

# F) Solution for High variance

* More Data
* 모델을 간단하게 만들기
* [[regularization]] / [[dropout]] / Data Augment / Early Stopping
* NN architecture search

# G) References
