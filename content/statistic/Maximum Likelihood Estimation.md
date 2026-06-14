---
title: "Maximum Likelihood Estimation"
aliases: ["MLE"]
---

# A) MLE ?

모수적인 데이터 밀도 추정 방법으로써, 파라미터 $\theta=\left(\theta_{1},\cdots,\theta_{m}\right)$ 으로 구성된 어떤 확률밀도함수 $P(x\mid\theta)$ 에서 관측된 표본 데이터 집합을 $x=\left(x_{1},x_{2},\cdots,x_{n}\right)$ 이라 할 때, 이 표본들에서 파라미터 $\theta=\left(\theta_{1},\cdots,\theta_{m}\right)$ 를 추정하는 방법이다.

여기서 [[likelihood]] (가능도) 란, 지금 얻은 데이터 $x$ 가 $\theta$ 라는 parameter 로 구성된 분포로부터 나왔을 확률 $p(\theta \mid x)$ 을 의미한다.  
![](https://i.imgur.com/WvkXgxb.png)

수치적으로 [[likelihood]] 를 계산하기 위해서는 **각 데이터 샘플에서 후보 분포에 대한 높이 (즉, likelihood 기여도) 를 계산해서 다 곱한 것**을 이용할 수 있을 것이다.

# B) Computation of MLE

확률 분포마다 MLE 구하는 방식이 다르지만, 일반적인 절차는 다음과 같다.

1. 확률 분포를 theta 에 대한 함수로 표현: 일반적으로 각 확률 ([[likelihood]]) 이 [[i.i.d.]] 하다는 가정하에 모두 곱해줌  

$$
\displaystyle P(x\mid\theta)=\prod_{k=1}^{n}P\left(x_{k}\mid\theta\right)
$$

1. 모두 곱한 값에, 다루기 쉬우려고 자연 로그를 붙임  

$$
\displaystyle L(\theta\mid x)=\log P(x\mid\theta)=\sum_{i=1}^{n}\log P\left(x_{i}\mid\theta\right)
$$

1. 이후 parameter $\theta$ 에 대해서 미분하고 $0$ 이되는 $\theta$ 값을 찾으면, 해당 값이 MLE solution 이 된다.

# C) Application

* Uniform Distribution: [[Indicator function]] 이 사용되서 이해하기 어려웠음
* Exponential Distribution: 쉬운것 같은데 의미를 모르겠음

# D) MLE for Linear Regression

[[linear regression]] model 은 다음과 같은 [[Gaussian distribution]] 를 모델링하는데 표현될 수 있다  

$$
p(y\mid\boldsymbol{x};\boldsymbol{\theta})=\mathcal{N}\left(y\mid\boldsymbol{w}^{\top}\boldsymbol{x},\sigma^{2}\right)
$$

* 여기서 $\boldsymbol{\theta}=\left(\boldsymbol{w},\sigma^{2}\right)$ 는 모델의 모든 parameter 를 의미한다. 통계학에서는 일반적으로 $\boldsymbol{w}$ 를 $\boldsymbol{\beta}$ 로 표현한다.

$\sigma^2$ 는 고정되어 있다 가정하고, $\boldsymbol{w}$ 를 찾는데 집중해보자. 해당 모델의 [[negative log likelihood]] 값은 다음과 같다.  

$$
\displaystyle\operatorname{NLL}(\boldsymbol{w})=-\sum_{n=1}^{N}\log\left[\left(\frac{1}{2\pi\sigma^{2}}\right)^{\frac{1}{2}}\exp\left(-\frac{1}{2\sigma^{2}}\left(y_{n}-\boldsymbol{w}^{\top}\boldsymbol{x}_{n}\right)^{2}\right)\right]
$$

위 식에서 필요없는 additive 한 상수들을 제거하고 나면, [[residual sum of squares]] 값이 나온다  

$$
\displaystyle\operatorname{RSS}(\boldsymbol{w})\triangleq\sum_{n=1}^{N}\left(y_{n}-\boldsymbol{w}^{\top}\boldsymbol{x}_{n}\right)^{2}=\sum_{n=1}^{N}r_{n}^{2}
$$

* $r_n$ 은 $n$ 번째 잔차를 의미한다.

또한, [[residual sum of squares|RSS]] 를 example 개수 $N$ 으로 나누게 된다면 [[machine_learning/mean squared error]] 가 된다.  

$$
\displaystyle\operatorname{MSE}(\boldsymbol{w})=\frac{1}{N}\operatorname{RSS}(\boldsymbol{w})=\frac{1}{N}\sum_{n=1}^{N}\left(y_{n}-\boldsymbol{w}^{\top}\boldsymbol{x}_{n}\right)^{2}
$$

* 추가로 MSE 에 루트를 씌우면 RMSE 가 된다

즉, MLE 를 수행함으로써 NLL, RSS, MSE 또는 RMSE 를 최소화하는 것이나 다름없다. 모든 결과는 동일하다.

RSS 를 $\boldsymbol{w}$ 에 대해 미분하여 $0$ 이 되는 값 ($\nabla_{\boldsymbol{w}}\operatorname{RSS}(\boldsymbol{w})=\mathbf{0}$) 을 찾으면, [[ordinary least squares]] 의 결과를 얻을 수 있다.  

$$
\hat{\boldsymbol{w}}_{\mathrm{mle}}\triangleq\underset{\boldsymbol{w}}{\operatorname{argmin}}\operatorname{RSS}(\boldsymbol{w})=\left(\mathbf{X}^{\top}\mathbf{X}\right)^{-1}\mathbf{X}^{\top}\boldsymbol{y}
$$

## D.1) The variance of the MLE

# E) Related

[[Bayes theorem]]

# F) References

* [[Probabilistic Machine Learning - An Introduction]] 4.2.7
