---
title: "posterior predictive distribution"
tags: ["probability_distribution", "statistic"]
aliases: ["PPD"]
---

# 1. Posterior Predictive Distribution ?

사후 예측 분포 (posterior predictive distribution) 는 관측된 데이터를 조건으로 했을 때 관측될 가능성이 있지만 관측되지 않은 데이터에 대한 분포를 의미한다  

$$
p\left(x_{new}\mid\mathbf{x}\right)=\int_{\Theta}p\left(x_{new}\mid\theta,\mathbf{x}\right)p(\theta\mid\mathbf{x})\mathrm{d}\theta=\int_{\Theta}p\left(x_{new}\mid\theta\right)p(\theta\mid\mathbf{x})\mathrm{d}\theta
$$

$p(\theta\mid\mathbf{x})$ 는 관측된 데이터에 대한 [[posterior]]

끝의 식에서 $\mathbf{x}$ 가 사라진 이유는, 관측되지 않은 데이터와 기존 데이터는 독립이라는 가정이 있기 때문이다.  
첫번째 식에서 두번째 식으로 유도되는 이유는 [[sum rule]] 과 [[product rule]] 을 활용했기 때문

# 2. 예시

[from stackoverflow](https://math.stackexchange.com/questions/873523/conditional-probability-about-sum-and-product-rule/873893)  

$$
\begin{aligned}p(x\mid\mathcal{D})&\stackrel{(a)}{=}\int_{0}^{1}p(x,\mu\mid\mathcal{D})d\mu\\&\stackrel{(b)}{=}\int_{0}^{1}p(x\mid\mu,\mathcal{D})p(\mu\mid\mathcal{D})d\mu\\&\stackrel{(c)}{=}\int_{0}^{1}p(x\mid\mu)p(\mu\mid\mathcal{D})d\mu\end{aligned}
$$

(a) 는 sum rule, (b) 는 product rule 을 활용함  

사후 예측 분포의 다른 표현들  

$$
p(\boldsymbol{y}\mid\boldsymbol{x},\mathcal{D})=\int p(\boldsymbol{y}\mid\boldsymbol{x},\boldsymbol{\theta})p(\boldsymbol{\theta}\mid\mathcal{D})d\boldsymbol{\theta}
$$  

the observed data: $\mathcal{D}=\left\{\left(\boldsymbol{x}_{n},\boldsymbol{y}_{n}\right):n=1:N\right\}$

* plug-in approximation
	* posterior predictive distribution 의 계산 비용이 비싸기 때문에, [[statistic/Maximum Likelihood Estimation|MLE]] 같이 하나의 best model $\hat{\boldsymbol{\theta}}$ 이 존재한다고 가정하는 방식  
$p(\boldsymbol{y}\mid\boldsymbol{x},\mathcal{D})=\int p(\boldsymbol{y}\mid\boldsymbol{x},\boldsymbol{\theta})p(\boldsymbol{\theta}\mid\mathcal{D})d\boldsymbol{\theta}\approx\intp(\boldsymbol{y}\mid\boldsymbol{x},\boldsymbol{\theta})\delta(\boldsymbol{\theta}-\hat{\boldsymbol{\theta}})d\boldsymbol{\theta}=p(\boldsymbol{y}\mid\boldsymbol{x},\hat{\boldsymbol{\theta}})$
		* $p(\boldsymbol{\theta}\mid\mathcal{D})=\delta(\boldsymbol{\theta}-\hat{\boldsymbol{\theta}})$, $\delta$ 는 Dirac delta function
	* 단점: overfitting and overconfidence
*

# 3. Related

* [[prior predictive distribution]]

# 4. References
