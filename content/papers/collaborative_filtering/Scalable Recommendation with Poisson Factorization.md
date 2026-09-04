---
title: "Scalable Recommendation with Poisson Factorization"
aliases: []
tags:
  - collaborative_filtering
  - paper_review
  - probability_distribution
  - recommendation_system
---

# Abstract

본 논문은 hierarchical Poisson matrix factorization(HPF) 모델을 제안.

**HDF?**

HDF 는 sparse user & item matrix 를 학습하는데 목적을 두었다. 또한, HDF 는 explicit 그리고 implicit feedback 을 모두 다룰 수 있다.

또한 대용량 데이터에서 posterior inference 를 approximate 할 수 잇는 a variational algorithm 을 제안했다.

실험에서 [[non-negative matrix factorization]] 이나 [[Probabilistic Matrix Factorization|PMF]] 그리고 [[topic modeling]] 대상으로 모두 성능상 우위를 보인다고 한다.

# Introduction

Poisson factorization is a probabilistic model of users and items.

## Related Work

Poisson factorization 는 [[non-negative matrix factorization]] 에서 파생되었음

[[GaP - a factor model for discrete data]]

# Poisson Recommendation

* 유저 $u$ 의 아이템 $i$ 에 대한 상호작용 $y_{ui}$ 은 [[implicit feedback]] 으로 가정 (1 값은 클릭, 0 은 무시)
* 그리고 $y_{ui}$ 는 Poisson 으로 모델링: $y_{ui}\sim\operatorname{Poisson}\left(\theta_{u}^{\top}\beta_{i}\right)$
	* 각 아이템 $i$ 는 $K$ 차원의 latent vector $\beta_{i}$(item attributes) 로 표현되고, 각 사용자 $u$ 는 $K$ 차원의 latent vector $\theta_u$(user preferences) 로 표현됨
	* 위 식은 [[Probabilistic Matrix Factorization]] 의 variants 로, 각 user 와 Item 의 weight 가 양수고, Gaussian 이 Poisson 으로 바뀐것으로 생각할 수 있음
* Gamma prior 를 계층적으로 설계하여, 사용자들의 diversity 를 확인할 수 있도록 했음
	* Gamma priors on the latent attributes and latent preferences
* the generative process of the hierarchical Poisson factorization model (HPF) is as follows:
	* For each user $u$:
		* Sample activity $\xi_{u}\sim\operatorname{Gamma}\left(a^{\prime},a^{\prime}/b^{\prime}\right)$
		* For each component $k$, sample preference $\theta_{uk}\sim\operatorname{Gamma}\left(a,\xi_{u}\right)$
	* For each item $i$:
		* Sample popularity $\eta_{i}\sim\operatorname{Gamma}\left(c^{\prime},c^{\prime}/d^{\prime}\right)$
		* $\beta_{ik}\sim\operatorname{Gamma}\left(c,\eta_{i}\right)$
	* 각 사용자 $u$ 와 아이템 $i$ 에 대해, rating 을 sampling 한다: $y_{ui}\sim\operatorname{Poisson}\left(\theta_{u}^{\top}\beta_{i}\right)$
* 유저 당 latent 그리고 아이템 당 structure 에 대한 조건부 분포 $p\left(\theta_{1:N}\beta_{1:M}\mid y\right)$ 를 추정하기 위해, variational methods 를 이용하여 posterior inference 를 수행한다.
* posterior 를 구한 이후, HPF 를 통한 prediction 은 다음과 같이 계산된다: $\operatorname{score}_{ui}=\mathrm{E}\left[\theta_{u}^{\top}\beta_{i}\mid y\right]$
* ## Properties of HPF
	* HPF captures sparse factors
	* HPF models the long-tail of users and items
		* posterior predictive check(PPC)
			* a technique for model assessment from the Bayesian statistics literature
	* HPF downweights the effect of zeros
		* Classical MF is based on Gaussian likelihoods (i.e., squared loss), which gives equal weight to consumed and unconsumed items
	* Fast inference with sparse matrices
		* $p\left(y_{ui}\mid\theta_{u},\beta_{i}\right)=\left(\theta_{u}^{\top}\beta_{i}\right)^{y}\exp\left\{-\theta_{u}^{\top}\beta_{i}\right\}/y_{ui}!$

				- $0!=1$

$\begin{aligned}\log p(y\mid\theta,\beta)=&\left(\sum_{\left\{y_{ui}>0\right\}}y_{ui}\log\left(\theta_{u}^{\top}\beta_{i}\right)-\log y_{ui}!\right)-\left(\sum_{u}\theta_{u}\right)^{\top}\left(\sum_{i}\beta_{i}\right)\end{aligned}$

* ## Inference with variational method
* As for many Bayesian models, the exact posterior is computationally intractable.
* We show how to efficiently approximate the posterior with mean-field [[variational inference]]
* Variational inference for Poisson factorization
* 모든 사용자와 아이템에 대해서, user parameters $\gamma_{u},\kappa_{u}^{\text{rte}}$ 그리고 item parameters $\lambda_{i},\tau_{i}^{\text{rte}}$ 는 prior 로 사용하기 위해 초기화
* user activity 그리고 item popularity shape parameters 는 다음과 같이 설정: $\kappa_{u}^{\mathrm{shp}}=a^{\prime}+Ka;\quad\tau_{i}^{\mathrm{shp}}=c^{\prime}+Kc$
	* $a^{\prime},a,c,c^{\prime}$ 은 모두 0.3 으로 설정
* 이후 수렴될때까지 아래의 과정을 반복
	* $y_{ui}>0$ 를 만족하는 각 사용자/아이템에 대하여,다음의 [[multinomial distribution|multinomial]] 을 업데이트

: $\phi_{ui}\propto\exp\left\{\Psi\left(\gamma_{uk}^{\mathrm{shp}}\right)-\log\gamma_{uk}^{\mathrm{rte}}+\Psi\left(\lambda_{ik}^{\mathrm{shp}}\right)-\log\lambda_{ik}^{\mathrm{rte}}\right\}$

	* 각 사용자에 대해, user weight 와 activity parameters를 업데이트

		* $\gamma_{uk}^{\mathrm{shp}}=a+\sum_{i}y_{ui}\phi_{uik}$

		* $\displaystyle\gamma_{uk}^{\mathrm{rte}}=\frac{\kappa_{u}^{\mathrm{shp}}}{\kappa_{u}^{\mathrm{rte}}}+\sum_{i}\lambda_{ik}^{\mathrm{shp}}/\lambda_{ik}^{\mathrm{rte}}$

		* $\displaystyle\kappa_{u}^{\mathrm{rte}}=\frac{a^{\prime}}{b^{\prime}}+\sum_{k}\frac{\gamma_{uk}^{\mathrm{shp}}}{\gamma_{uk}^{\mathrm{rte}}}$

			* $b^{\prime}=1$로 설정

	* 각 아이템에 대해, item weight와 popularity parameter들을 업데이트

		* $\lambda_{ik}^{\mathrm{shp}}=c+\sum_{u}y_{ui}\phi_{uik}$

		* $\displaystyle\lambda_{ik}^{\mathrm{rte}}=\frac{\tau_{i}^{\mathrm{shp}}}{\tau_{i}^{\mathrm{rte}}}+\sum_{u}\gamma_{uk}^{\mathrm{shp}}/\gamma_{uk}^{\mathrm{rte}}$

		* $\displaystyle\tau_{i}^{\mathrm{rte}}=\frac{c^{\prime}}{d^{\prime}}+\sum_{k}\frac{\lambda_{ik}^{\mathrm{shp}}}{\lambda_{ik}^{\mathrm{rte}}}$

			* $d^{\prime}=1$로 설정

	* 수렴 여부는 validation set에 대한 예측 precision으로 확인

		* 구체적으로는 validation ratings에 대한 predictive log likelihood의 평균을 계산하고, 이전 iteration의 log likelihood와 비교했을 때 변화가 0.0001% 미만이면 종료

# References

* [paper link](https://arxiv.org/pdf/1311.1704.pdf)
