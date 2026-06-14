---
tags: ["bayesian_inference"]
aliases: ["varitional approximation", "VI", "변분 추론"]
---

# A) Variational Inference ?

변분 추론 (Variational Inference, VI) 은 intractable 한 [[posterior]] 분포 $p(z\mid x)$ 를 다루기 쉬운 분포 $q(z)$ 로 근사하는 방법론을 의미한다. 이때 $x$ 는 관측 가능한 데이터, $z$ 는 [[latent variable]] 을 의미한다.

두 분포는 다음과 같이 divergence 를 통해 근사한 정도가 측정되고, divergence 를 최소화하도록 variational distribution $q$ 의 variational parameter $z$ 를 잘 조정하는 것이 목표이다.

$$
q^{*}=\underset{q\in\mathcal{Q}}{\operatorname{argmin}}D(q,p)
$$

* $\mathcal{Q}$ 는 tractable 한 분포 (e.g. multivariate Gaussian)
* $D$ 는 divergence 를 의미한다. 만약 $D$ 를 [[KL-Divergence]] 로 설정한다면, the log marginal likelihood 에 대한 lower bound 를 이끌어낼 수 있는데, 이 값을 [[Evidence Lower Bound]] 또는 evidence lower bound 라고 부른다. 우리는 ELBO 를 최대화함으로써, posterior approximation 의 quality 를 향상시킬 수 있다.

# B) Mean-field Form of Varitional Inference

[[mean field approximation]] 참조

# C) 특성

## C.1) 장점

본디 posterior 를 estimation 하는 statistical inference 였던 문제를 optimization 문제로 바꿔준다. 이는 [[statistic/MCMC approximation|MCMC]] 를 사용한 posterior estimation 방식보다 optimization 이 훨씬 적용할 수 있는 case 가 많기 때문에 유리하다.

## C.2) 단점

* Although VI is a fast, it can give a biased approximation to the posterior, since it is restricted to a specific function form $q\in\mathcal{Q}$.
* 전통적인 variational inference 방식은 posterior 가 언제나 근사일 뿐이다.
* mean field approximation 의 경우에는 $g$ 가 simple density 들로 factor 되는 녀석들로 나타나야한다.

# D) AutoEncoder 와의 관계

기존의 Varitional Inference 는 일반적으로 likelihood 와 posterior 를 동시에 업데이트하지 않고 한쪽을 고정하고 다른 한쪽을 update 하는 alternative 한 방식을 취했다.

그러나 [[autoencoder]] 를 통해서 동시에 업데이트 하는것이 가능하다. posterior $q(z \mid x)$ 를 encoder 로 보고, likelihood $p(x \mid z)$ 를 decoder 로 생각하면 오토인코더 형태로 모델링할 수 있다. 그리고 [[gradient descent]] 를 통해서 en & de-coder 를 한번에 업데이트 한다. 이러한 개념이 바로 [[machine_learning/deep_learning/Variational Autoencoder|VAE]] 이다.

[[Bayesian inference]] 를 이용해 정확한 posterior 를 찾는다고 생각해보자.

$$
\displaystyle p(w\mid D)=\frac{p(D \mid w)p(w)}{\int p(D \mid w)p(w)dw}
$$

* [[maximum a posteriori probability]] 나 [[Maximum Likelihood Estimation]] (MLE) 는 evidence($p(D)=\int p(D\mid w)p(w)$) 계산이 필요없다.
		- 단순히 최대값을 위한 $w$ 만 구하면 됐기 때문에 상수는 생략하기 때문이다.

	* 그러나 posterior 분포를 정확하게 알기위해서는 evidence 는 꼭 계산해야되는 값이다.
	* 하지만 보통 $w$ 의 차원이 굉장히 높은 편이라 개수가 많기 때문에 적분 연산이 사실상 불가능하다.
		* 또한 posterior 를 구한 이후에, 이 분포를 활용한 기댓값을 계산할 수 있는데, 기댓값 계산식도 적분 계산이 필요하기 때문에 이 역시도 어렵다.
$\displaystyle E[f(w)]=\int f(w)p(w\mid D)dw$

# E) Variational Inference 의 간략한 설명

Variational distribution 은 여러 방법으로 만들 수 있으나, 단순한 분포를 여러개 곱한 분포를 근사 분포로 사용한다 ([[mean field approximation]]).

이 근사 분포 $q(z)$ 가 실제 posterior 분포 $p(z\mid x)$ 와 얼마나 비슷한지 확인하기 위해 [[KL-Divergence]] 를 사용한다.

$$
\begin{aligned}&D_{KL}(q(z)\|p(z\mid x))\\&=\int q(z)\log\frac{q(z)}{p(z\mid x)}dz\\&=\int q(z)\log\frac{q(z)p(x)}{p(x\mid z)p(z)}dz\\&=\int q(z)\log\frac{q(z)}{p(z)}dz+\int q(z)\log p(x)dz-\int q(z)\log p(x\mid z)dz\\&=D_{KL}(q(z)\|p(z))+\log p(x)-E_{z\sim q(z)}[\log p(x\mid z)]\end{aligned}
$$

$\displaystyle \int q(z) \log p(x) d z$ 에서 $\displaystyle\int q(z)dz=1$ 를 만족한다. 그리고 마지막 식 우측의 $E_{z\sim q(z)}[\log p(x\mid z)]$ 는 logarithmic likehood 의 expectation 을 의미한다.

# F) Variational Inference with Monte Carlo Sampling

[[statistic/Monte Carlo Method]] 를 KL-Divergence 에 적용할 수 있다. 일반적으로 posterior 분포에 대한 정보가 없을 때 유용하게 사용할 수 있다.

$$
\begin{aligned}&D_{KL}(q(z)\|p(z\mid x))\\&=D_{KL}(q(z)\|p(z))+\log p(x)-E_{z\sim q(z)}[\log p(x\mid z)]\\&=E_{z\sim q(z)}\left[\log\frac{q(z)}{p(z)}\right]+\log p(x)-E_{z\sim q(z)}[\log p(x\mid z)]\\&\approx \frac{1}{K}\sum_{i=0}^{K}\left[\log\frac{q\left(z_{i}\right)}{p\left(z_{i}\right)}\right]_{z_{i}\sim q(z)}+\log p(x)-\frac{1}{K}\sum_{i=0}^{K}\left[\log p\left(x\mid z_{i}\right)\right]_{z_{i}\sim q(z)}\\&=\frac{1}{K}\sum_{i=0}^{K}\left[\log q\left(z_{i}\right)-\log p\left(z_{i}\right)-\log p\left(x\mid z_{i}\right)\right]_{z_{i}\sim q(z)}+\log p(x)\end{aligned}
$$

## F.1) 과정

posterior $p$ 에 대한 정보가 없어서 $q(z)$ 를 [[Gaussian distribution|정규 분포]] 로 정했다고 가정하자. 이 정규분포에서 (training dataset 개수) $K$ 개의 $z$ 들을 sampling 함으로써, KLD 의 근사값을 계산할 수 있다.

정규분포의 parameter 는 평균과 분산이므로, 이들을 조금씩 바꿔가면서 KLD 근사값을 최소로 하는 평균과 분산을 구할 수 있다. 이렇게 구해진 정규분포 $q(z)$ 가 바로 VI 의 결과가 된다.

# G) Variational Inference with SGD

* [참고](https://ratsgo.github.io/generative%20model/2017/12/19/vi/)
* KLD 를 줄이는 쪽으로 parameter 를 gradient descent 를 활용하여 업데이트
* 이를 Stochastic Variational Inference (SVI) 라고 부름

# H) Variational EM Algorithm

실제 문제에서는 prior 와 likelihood 의 parameter 를 알 수 없는 경우가 많다. 그래서 [[machine_learning/optimization/EM algorithm]] 을 통해 posterior $p(z|x)$ 에 근사한 $q(z)$ 의 parameter 를 찾는 것과 동시에, 우도함수 $p(x|z)$ 의 parameter 또한 추정해야 한다.

* $q(z)$ 의 parameter 를 $θ_q$, likelihood function 의 parameter 를 $\theta_l$ 라고 둘 때 EM algorithm 은 다음과 같은 과정을 수렴할 때까지 반복한다.
	* Expectation: $D_{KL}(q(z)\|p(z\mid x))$ 를 줄이는 $θ_q$ 를 찾는다.
		* Monte Carlo method 을 활용한 VI 또는 SVI 등 적용
	* Maximization : E-step 에서 찾은 $θ_q$ 를 고정한 상태에서 $\log⁡p(x)$ 의 하한 (lower bound, ELBO) 을 최대화하는 $p(x|z)$ 의 파라메터 $θ_l$ 를 찾는다.
* ELBO:: Evidence Lower Bound
	* KLD 식에서 evidence $p(x)$(정확히는 $\log p(x)$) 에 대한 하한을 계산할 수 있다.
	* $D_{KL}(q(z)\|p(z\mid x))=D_{KL}(q(z)\|p(z))+\log p(x)-E_{z\sim q(z)}[\log p(x\mid z)]$
		* 위 식을 $\log p(x)$ 에 대해 정리하면 $\log p(x)=\\E_{z\sim q(z)}[\log p(x\mid z)]-D_{KL}(q(z)\|p(z))+D_{KL}(q(z)\|p(z\mid x))$ 와 같다.
	* 이때 KLD 는 항상 양수이므로, $D_{KL}(q(z)\|p(z\mid x))\geq0$ 를 만족하니까, 다음과 같이 ELBO 를 보일 수 있다.
		* $\log p(x)\geq E_{z\sim q(z)}[\log p(x\mid z)]-D_{KL}(q(z)\|p(z))$
			* 위 식의 우변을 ELBO 라고 한다.
	* ELBO 가 줄어들면 $\log p(x)$ 도 줄어들고, 결과적으로 KLD 를 줄일 수 있다.
* 특징
	* Variational inference tends to scale better than alternative samplingbased approaches, like Monte Carlo Markov chain sampling (대용량 데이터에서 scalable 함)

# I) Related

[[Laplace approximation]], [[Latent Dirichlet Allocation]], [[approximate posterior inference]], [[Stochastic Variational Inference]]

# J) References

* [The Variational Approximation for Bayesian Inference](cs.uoi.gr/~arly/papers/SPM08.pdf)
* https://greeksharifa.github.io/bayesian_statistics/2020/07/14/Variational-Inference/
* https://hyeongminlee.github.io/post/bnn003_vi/
* https://ratsgo.github.io/generative%20model/2017/12/19/vi/
* https://zhiyzuo.github.io/VI/
