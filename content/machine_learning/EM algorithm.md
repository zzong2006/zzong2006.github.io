---
tags: ["statistic", "bayesian_inference", "bayesian"]
aliases: ["EM"]
---

# A) EM Algorithm 으로 풀 수 있는 문제들

* [[mixture gaussian problem]], [[Probabilistic latent Semantic Indexing]], [[K-means]]

# B) 정의

EM algorithm is an iterative method and a [[bound optimization]] algorithm to find (local) [[Maximum Likelihood Estimation|MLE]] or [[maximum a posteriori probability|MAP]] estimates of parameters in statistical models, where the model depends on unobserved [[latent variable]]s.

## B.1) Expectation(E) Step

Estimating the hidden variables (or missing values)

## B.2) Maximization(M) Step

Using the fully observed data to compute the MLE. These parameter-estimates are then used to determine the distribution of the latent variables in the next E step.

# C) EM 알고리즘의 Solution (목적)

EM 알고리즘의 목적은 관측된 데이터에 대한 log likelihood 를 최대화하는 것이다.

$$
\displaystyle LL(\boldsymbol{\theta})=\sum_{n=1}^{N}\log p\left(\boldsymbol{y}_{n}\mid\boldsymbol{\theta}\right)=\sum_{n=1}^{N}\log\left[\sum_{\boldsymbol{z}_{n}}p\left(\boldsymbol{y}_{n},\boldsymbol{z}_{n}\mid\boldsymbol{\theta}\right)\right]
$$

* $\boldsymbol{z}_{n}$ 는 hidden variables, $\boldsymbol{y}_{n}$ 는 visible variables for example $n$. ([[sum rule]] 에 의해서 유도됨)

위 식은 log 가 sum($\Sigma$) 안에 들어가지 있지 않으므로, 최적화가 어렵다.

그래서 EM 은 위 식을 다음과 같이 풀어간다. 우선, 각 hidden variable $\boldsymbol{z}$ 에 대해서, 임의의 분포들에 대한 집합 $q_{n}\left(\boldsymbol{z}_{n}\right)$ 이 있다고 하자. 이렇게 하면, 위 log likelihood 는 다음과 같이 다시 쓸 수 있다.

$$
LL(\boldsymbol{\theta})=\displaystyle\sum_{n=1}^{N}\log\left[\sum_{\boldsymbol{z}_{n}}q_{n}\left(\boldsymbol{z}_{n}\right)\frac{p\left(\boldsymbol{y}_{n},\boldsymbol{z}_{n}\mid\boldsymbol{\theta}\right)}{q_{n}\left(\boldsymbol{z}_{n}\right)}\right]
$$

* $q_{n}(\boldsymbol{z}_{n})$ 는 variational distribution

위 식에 [[Jensen's inequality]] 를 사용하면, ([[convex function|concave]] function 에 대해) log 를 [[expectation]] 에 밀어 넣어줌으로써, log likelihood 에 대한 lower bound 를 구할 수 있다

$$
\begin{aligned}LL(\boldsymbol{\theta})&\geq\sum_{n}\sum_{\boldsymbol{z}_{n}}q_{n}\left(\boldsymbol{z}_{n}\right)\log\frac{p\left(\boldsymbol{y}_{n},\boldsymbol{z}_{n}\mid\boldsymbol{\theta}\right)}{q_{n}\left(\boldsymbol{z}_{n}\right)}\\ &= \sum_{n}\underbrace{\mathbb{E}_{q_{n}}\left[\log p\left(\boldsymbol{y}_{n},\boldsymbol{z}_{n}\mid\boldsymbol{\theta}\right)\right]+\mathbb{H}\left(q_{n}\right)}_{\mathcal{E}\left(\boldsymbol{\theta},q_{n}\mid\boldsymbol{y}_{n}\right)}\\&=\sum_{n}\mathcal{E}\left(\boldsymbol{\theta},q_{n}\mid\boldsymbol{y}_{n}\right)\triangleq\mathcal{E}\left(\boldsymbol{\theta},\left\{q_{n}\right\}\mid\mathcal{D}\right)\end{aligned}
$$

* 여기서 $\mathbb{H}(q)$ 는 분포 $q$ 에 대한 [[entropy]] 이고, $\mathcal{E}\left(\boldsymbol{\theta},\left\{q_{n}\right\}\mid\mathcal{D}\right)$ 는 [[Evidence Lower Bound]](ELBO) 라고 부른다.

이후 계산한 bound(ELBO) 에 대해서 optimization 을 수행한다 (c.f. [[variational inference]])

# D) EM Optimization Steps

우선 모든 값을 random 으로 초기화하고, E-step 과 M-step 을 반복한다.

## D.1) E-step

$q$ function 을 optimize 하여 $p$ 와 최대한 비슷하게 맞춤 ($\theta$ 고정)

$$
q^{(t+1)}=\underset{q}{\arg\max}F\left(q,\theta^{(t)}\right)
$$

## D.2) M-step

다시 $p$ 의 $\theta$ 를 업데이트하여 bound 를 최대화

$$
\theta^{(t+1)}=\underset{\theta}{\arg\max}F\left(q^{(t+1)},\theta\right)
$$

이러한 반복에 대해 상세히 알고싶다면: [참고 site (EM for LDA)](https://willwolf.io/2018/11/11/em-for-lda/#fn:2)

# E) Visualization of EM Steps

![|400](https://i.imgur.com/VxXjW3F.png)

# F) Monotonicity of EM Algorithm

E 와 M step 을 반복할수록 log-likelihood 는 증가하는지 증명할 수 있는가? 즉, $l\left(\theta^{t+1}\right)\geq l\left(\theta^{t}\right)$ 을 만족하는가?

$$
\begin{aligned}l\left(\theta^{t+1}\right)&=\max_{\theta}\sum_{i=1}^{m}E_{z^{(j)}\sim Q^{t+1}}\left[\log\frac{p\left(x^{(i)},z^{(j)};\theta\right)}{Q^{t+1}\left(z^{(j)}\right)}\right]\\&\geq\sum_{i=1}^{m}E_{z^{(j)}\sim Q^{t+1}}\left[\log\frac{p\left(x^{(i)},z^{(j)};\theta^{t}\right)}{Q^{t+1}\left(z^{(j)}\right)}\right]\\&\geq\sum_{i=1}^{m}E_{z^{(j)}\sim Q^{t}}\left[\log\frac{p\left(x^{(i)},z^{(j)};\theta^{t}\right)}{Q^{t}\left(z^{(j)}\right)}\right]\\&=l\left(\theta^{t}\right)\end{aligned}
$$

EM algorithm will make the log-likelihood get bigger and bigger as the iterations go on.

![|600](https://i.imgur.com/TuKYblI.png)

E-step 에서 $q^{k+1}$ 를 찾는다면, 이는 반드시 $\mathcal{L}\left(\theta^{k},q^{k+1}\right)=\log p\left(X\mid\theta^{k}\right)$ 를 만족한다 ($\theta^k$ 지점에서).

그리고 M-step 에서 $\theta^{k+1}$ 를 찾는다면, 이는 $\mathcal{L}\left(\theta^{k+1},q^{k+1}\right)\geq\mathcal{L}\left(\theta^{k},q^{k+1}\right)$ 를 만족하는데, 이는 $\log p\left(X\mid\theta^{k+1}\right)\geq\mathcal{L}\left(\theta^{k+1},q^{k+1}\right)$ 도 만족한다.

Debugging point -> EM-step 을 직접 구현했는데 만약 log likelihood 값이 줄어든다면, 잘못 구현한 것이다.

# G) Relation with Local Minimum

EM is not guaranteed to converge to a local minimum.

It is only guaranteed to converge to a point with zero gradient with respect to the parameters. So it can indeed get stuck at saddle points.

# H) EM Algorithm 의 단점

EM 은 MM algorithm 이기 때문에, this iterative procedure will converge to a local maximum of the log likelihood.

The speed of convergence depends on the amount of missing data, which affects the tightness of the bound.

EM 대신, [[Gibbs Sampling]](Griffiths, 2002) 을 대체제로 많이 사용한다.

# I) Related Sites

* [[variational EM algorithm]]
* [wiki](https://en.wikipedia.org/wiki/Expectation%E2%80%93maximization_algorithm)
* https://www.cs.cmu.edu/~epxing/Class/10708-17/notes-17/10708-scribe-lecture8.pdf
	* Probabilistic Graphical Models lecture note
