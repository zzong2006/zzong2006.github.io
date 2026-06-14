---
title: "negative log likelihood"
tags: ["statistic", "machine_learning"]
aliases: ["NLL"]
---

# A) Negative Log Likelihood ?

[[machine learning]] 은 주어진 데이터만으로 미지의 최적 모델에 대한 [[parameter]] $\theta$ 를 찾아야 한다.

[[classification]] 문제에서, 입력값 $X$ 와 parameter $\theta$ 가 주어졌을 때, 정답 $Y$ 가 나타날 확률을 [[likelihood]](우도) 로 표현할 수 있다. likelihood $P(Y\mid X;\theta)$ 를 최대화하는 $\theta$ 가 바로 우리가 찾고 싶은 결과라고 해석가능하다: [[Maximum Likelihood Estimation]]

$$
\boldsymbol{\theta}_{\mathrm{ML}}=\underset{\theta}{\arg\max}P(\boldsymbol{Y}\mid\boldsymbol{X};\boldsymbol{\theta})
$$

여기서 likelihood 를 scale 해도 $\theta$ 의 결과는 동일하므로, likelihood 에 Log scale 을 적용할 수 있다. Log scale 을 사용하는 이유는 (a) it does not suffer from numerical underﬂow, and (b) the differentiation rules will turn out simpler 이기 때문이다.

$$
\displaystyle\boldsymbol{\theta}_{\mathrm{ML}}=\underset{\theta}{\arg\max}\sum_{i=1}^{m}\log P\left(\boldsymbol{y}^{(i)}\mid\boldsymbol{x}^{(i)};\boldsymbol{\theta}\right)
$$

또한, [[loss function]] 의 값을 최적화 한다는 뜻에서, [[likelihood]] 를 최소화 한다는 의미로 바꾸면 좋다. 이를 위해 [[likelihood]] 에 음의 부호를 붙여서 argmax 를 argmin 으로 바꿔준다.

[[regularization]]: adding a penalty term to the NLL

$$
\displaystyle\mathcal{L}(\boldsymbol{\theta};\lambda)=\left[\frac{1}{N}\sum_{n=1}^{N}\ell\left(\boldsymbol{y}_{n},\boldsymbol{\theta};\boldsymbol{x}_{n}\right)\right]+\lambda C(\boldsymbol{\theta})
$$

* $\lambda\ge0$ is the regularization parameter, $C(\boldsymbol{\theta})$ is some form of complexity penalty
* 일반적으로 complexity penalty 는 $C(\boldsymbol{\theta})=-\log p(\boldsymbol{\theta})$ 로 설정하며, 여기서 $p(\boldsymbol{\theta})$ 는 $\boldsymbol{\theta}$ 의 prior 이다.

만약, $\ell$ 값이 log loss 고, $\lambda=1$ 이면, 위 식은 다음과 같이 표현될 수 있다.

$$
\mathcal{L}(\boldsymbol{\theta};\lambda)=-\left[\sum_{n=1}^{N}\log p\left(\boldsymbol{y}_{n}\mid\boldsymbol{x}_{n},\boldsymbol{\theta}\right)+\log p(\boldsymbol{\theta})\right]=-[\log p(\mathcal{D}\mid\boldsymbol{\theta})+\log p(\boldsymbol{\theta})]
$$

해당 식을 최소화 하는 것은 log posterior 를 최대화 하는 것과 같다 [[maximum a posteriori probability|MAP]] 참조

$\hat{\boldsymbol{\theta}}=\underset{\boldsymbol{\theta}}{\operatorname{argmax}}\logp(\boldsymbol{\theta}\mid\mathcal{D})\\=\underset{\boldsymbol{\theta}}{\operatorname{argmax}}[\logp(\mathcal{D}\mid\boldsymbol{\theta})+\logp(\boldsymbol{\theta})-\text{const}]$

# B) Related

# C) References

* [[Probabilistic Machine Learning - An Introduction]], 4.5: [[regularization]]
