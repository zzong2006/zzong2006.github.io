---
title: "Generalized Linear Model"
tags:
  - linear_regression
  - machine_learning
aliases: ["GLM"]
---

# A) Generalized Linear Model ?

feature vector $x\in\mathbb{R}^{d}$ 가 주어졌을 때 observation $Y$ 는 평균이 $\mu\left(x^{\top}\theta\right)$ 인 [[exponential family]] 분포를 따른다.

* $\mu$ 는 [[mean function]] 그리고 $\theta\in\mathbb{R}^{d}$ 가 모델 parameters.
* 여기서 $\mu$ 는 [[sigmoid function]] 인 경우 logistic regression 으로 해석할 수 있다.

## A.1) Likelihood

* $\mathcal{D}=\left\{\left(x_{\ell},y_{\ell}\right)\right\}_{\ell=1}^{n}$ 가 $n$ 개의 observation 들의 집합이라고 하자.
	* $x_{\ell}\in\mathbb{R}^{d} \text{and}y_{\ell}\in\mathbb{R}$
* model parameter $\theta$ 에 대한 $D$ 의 negative log likelihood 는 다음과 같다.

$$
\displaystyle L(\mathcal{D};\theta)=\sum_{\ell=1}^{|\mathcal{D}|}b\left(x_{\ell}^{\top}\theta\right)-y_{\ell}x_{\ell}^{\top}\theta-c\left(y_{\ell}\right)
$$

* $c$ 는 real function
* $b$ 는 이차 연속 미분이 가능하고, 미분한 결과가 mean function($\dot{b}=\mu$) 인 함수

1. gradient of $L(\mathcal{D};\theta)$ with respect to $\theta$

$$
\displaystyle \nabla L(\mathcal{D};\theta)=\sum_{\ell=1}^{|\mathcal{D}|}\left(\mu\left(x_{\ell}^{\top}\theta\right)-y_{\ell}\right)x_{\ell}
$$

1. [[Hessian matrix|Hessian]] of $L(\mathcal{D};\theta)$ with respect to $\theta$

$$
\displaystyle\nabla^{2}L(\mathcal{D};\theta)=\sum_{\ell=1}^{|\mathcal{D}|}\dot{\mu}\left(x_{\ell}^{\top}\theta\right)x_{\ell}x_{\ell}^{\top}
$$

$\dot{\mu}$ 는 $\mu$ 의 미분이고, $\mu$ 는 increasing 하므로 $\dot{\mu}$ 의 값은 항상 양수다.

* [[Maximum Likelihood Estimation]] of model parameters 는 $\nabla L(\mathcal{D};\theta)=\mathbf{0}$ 를 만족하는 vector $\theta\in\mathbb{R}^{d}$ 를 찾는 것이다.

# B) Related Algorithms

## B.1) GLM-TSL

* a variant of [[Thompson sampling]] where the posterior of $\theta_{*}$ is approximated by its [[Laplace approximation]].
* 임의의 parameter vector 는 Laplace approximation 에서 샘플링된다.
	* $\displaystyle\tilde{\theta}_{t}\sim\mathcal{N}\left(\bar{\theta}_{t},a^{2}H_{t}^{-1}\right)$
		* $a>0$ 는 tunable parameter
		* $\displaystyle\bar{\theta}_{t}=\underset{\theta\in\mathbb{R}^{d}}{\arg\min}L\left(\left\{\left(X_{\ell},Y_{\ell}\right)\right\}_{\ell=1}^{t-1};\theta\right)$

$$
\displaystyle H_{t}=\sum_{\ell=1}^{t-1}\dot{\mu}\left(X_{\ell}^{\top}\bar{\theta}_{t}\right)X_{\ell}X_{\ell}^{\top}
$$

* GLM-FPL(__follow-the-perturbed-leader__)
	* 임의의 parameter vector 는 Gaussian noise 가 추가된 $t-1$ 까지의 reward 들로 부터 MLE 를 수행한 결과다.
		* $\tilde{\theta}_{t}=\underset{\theta\in\mathbb{R}^{d}}{\arg\min}L\left(\left\{\left(X_{\ell},Y_{\ell}+Z_{\ell}\right)\right\}_{\ell=1}^{t-1};\theta\right)$
			* $Z_{\ell}\sim\mathcal{N}\left(0,a^{2}\right)$ 는 normal random variables
(매 round 마다 resampling 됨)
				* $a>0$ 는 tunable parameter
* Computationally-Efficient Implementations
* 위의 식에서 사용되는 MLE 는 [[Newton-Raphson method]] 를 사용하는 [[Iteratively Reweighted Least Squares]] (IRLS) 를 통해 계산될 수 있다.
* Roughly speaking, each step of IRLS multiplies the inverse of $\nabla L(\mathcal{D};\theta)$ and $\nabla^2L(\mathcal{D};\theta)$.
* 즉, $\nabla L(\mathcal{D};\theta)$ 의 경우는 $\sum_{x\in\mathcal{X}}\left(N_{x}\mu\left(x^{T}\theta\right)-Y_{x}\right)x$ 로 계산하고, $\nabla^2L(\mathcal{D};\theta)$ 의 경우는 $\sum_{x\in\mathcal{X}}N_{x}\dot{\mu}\left(x^{T}\theta\right)xx^{T}$ 형태로 계산할 수 있다고 한다.
	* $N_{x}$ 는 $x$ 가 history $D$ 에서 발생한 횟수고, $Y_{x}$ 는 보상이라고 하는데, 이 둘은 incrementally update 될 수 있다.
* 잘 모르겠는 부분
	* $\nabla L(\mathcal{D};\theta)$ 는 $d$ 차원 벡터인데, 어떻게 inverse 계산을 할 수 있을까?

# C) Related

* [[PASS-GLM]]

# D) References

 * [Randomized Exploration in Generalized Linear Bandits](http://proceedings.mlr.press/v108/kveton20a/kveton20a.pdf)
* [[Probabilistic Machine Learning - An Introduction]] - chapter 12.
