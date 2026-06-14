---
aliases: ["GMM"]
---

# A) GMM?

GMM 이란, 여러 [[Gaussian distribution]] 이 혼합된 모델을 의미한다.

![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2Fh3EYTta4xx.png?alt=media&token=2e05b453-3149-4111-9b29-6942216938ff)

# B) GMM

주어진 데이터 $x$ 가 GMM 에서 발생할 확률

$$
\displaystyle p(x)=\sum_{k=1}^{K}\pi_{k}N\left(x\mid\mu_{k},\Sigma_{k}\right)
$$

 $\pi_{k}$ 는 mixing coefficients 라고 부르며, 일종의 weight 역할을 한다. 즉, 어떤 가우시안 분포에 포함되는지 soft clustering 같은 의미 부여 역할을 한다.

* $\sum_{k=1}^{K}\pi_{k}=1,0\leq\pi_{k}\leq1$
* $\pi_k$ 도 확률 분포의 특성을 가지므로, [[multinomial distribution]] 을 따른다.

$k$ 개의 가우시안 분포에서 $x$ 가 발생할 확률을 전부 더한다고 생각하고, 특정 분포가 선택된 것을 표기할때 $z$ 로 둔다고 하면 다음과 같이 표현이 가능하다.

$k$ 개의 가우시안 분포에서 $x$ 가 발생할 확률을 전부 더한다고 생각하고, 특정 분포가 선택된 것을 표기할때 $z$ 로 둔다고 하면 다음과 같이 표현이 가능하다.

$$
p(x)=\sum_{k=1}^{K}P\left(z_{k}\right)P(x\mid z)=\sum_{k=1}^{K}\pi_{k}N\left(x\mid\mu_{k},\Sigma_{k}\right)
$$

$k$ 개의 가우시안 분포에서 $x$ 가 발생할 확률을 전부 더한다고 생각하고, 특정 분포가 선택된 것을 표기할때 $z$ 로 둔다고 하면 다음과 같이 표현이 가능하다.

* selection variable $z_{k}$ 는 다음과 같은 특성을 갖는다

: $z_{k}\in\{0,1\},\sum_{k}z_{k}=1,P\left(z_{k}=1\right)=\pi_{k}$

* Log likelihood of the dataset
	* $\ln P(X\mid\pi,\mu,\Sigma)=\sum_{n=1}^{N}\ln\left\{\sum_{k=1}^{K}\pi_{k}N\left(x_n\mid\mu_{k},\Sigma_{k}\right)\right\}$
* Classification of GMM
	* $x_n$ 이 주어졌을 때, $k$ 번째 가우시안 분포에 포함될 확률을 계산
		* 이 확률을 responsibility $\gamma\left(z_{nk}\right)$ 라고 표현한다.

$$
\gamma\left(z_{nk}\right) \equiv p\left(z_{k}=1\mid x_{n}\right) \\=\frac{P\left(z_{k}=1\right)P\left(x\mid z_{k}=1\right)}{\sum_{j=1}^{K}P\left(z_{j}=1\right)P\left(x\mid z_{j}=1\right)}=\frac{\pi_{k}N\left(x\mid\mu_{k},\Sigma_{k}\right)}{\sum_{j=1}^{K}\pi_{j}N\left(x\mid\mu_{j},\Sigma_{j}\right)}
$$

* 분수 형태로 바뀐 이유는 [[Bayes theorem]] 을 적용했기 때문

# C) Training GMM: [[machine_learning/optimization/EM algorithm]]

## C.1) Expectation Step: the Assignment Probability

Given the parameters and the data point, calculate the likelihood

$x,\pi,\mu,\Sigma$ 가 주어졌을 때, $\gamma\left(z_{nk}\right)$ 를 계산한다. 즉, 각각의 데이터 포인트가 어떤 가우시안 분포에 속하는지의 확률을 계산한다.

## C.2) Maximization step

Update the parameters given $\gamma\left(z_{nk}\right)$

총 3 개의 변수들에 대해서 likelihood 를 각각 미분한 후, 0 이 되는 값을 찾음

$$
\displaystyle \frac{d}{d\mu_{k}}\ln P(X\mid\pi,\mu,\Sigma)
$$

$$
\displaystyle\frac{d}{d\Sigma_{k}}\ln P(X\mid\pi,\mu,\Sigma)
$$

$$
\displaystyle\frac{d}{d\pi_{k}}\ln P(X\mid \pi,\mu,\Sigma)+\lambda\left(\sum_{k=1}^{K}\pi_{k}-1\right)
$$

mixing coefficient $\pi_k$ 는 constraint 이 존재하므로 [[Lagrange multiplier method]] 를 적용하였다.

각 parameter 는 $\gamma\left(z_{nk}\right)$ 를 활용하여 다음과 같이 계산될 수 있음

* $\displaystyle\mu_{k}=\frac{\sum_{n=1}^{N}\gamma\left(z_{nk}\right)x_{n}}{\sum_{n=1}^{N}\gamma\left(z_{nk}\right)}$
* $\displaystyle\Sigma_{k}=\frac{\sum_{n=1}^{N}\gamma\left(z_{nk}\right)\left(x_{n}-\mu_{k}\right)\left(x_{n}-\mu_{k}\right)^{T}}{\sum_{n=1}^{N}\gamma\left(z_{nk}\right)}$
* $\displaystyle\pi_{k}=\frac{1}{N}\sum_{n=1}^{N}\gamma\left(z_{nk}\right)$
* 모든 parameter 를 계산하면, 다시 E-step 으로 돌아가서 $\gamma\left(z_{nk}\right)$ 를 재 계산한다. 이를 수렴할때까지 반복한다.

## C.3) Why not Use Gradient Descent Method?

[[stochastic gradient descent]] 를 이용해서 학습할 수 있지만, 두 가지 이유로 EM 보다는 비 효율적이다.

1. GMM 에서의 가우시안 분포들의 covariance matrix $\Sigma_k$ 는 [positive semi-definite]([[positive definite]]) 여야 한다는 조건이 붙는다. 하지만 SGD 로는 이러한 제약조건을 명시하면서 학습할 수 없다.
2. EM 방식은 주어진 문제의 structure 를 활용할 수 있다. 즉, SGD 보다 EM 이 더욱 적은 iteration 만으로도 optimal 한 결과에 다다를 수 있다 (더 낮은 loss 또는 높은 likelihood 포함).

# D) Expression of GMM by [[Bayesian network]]

![|200](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2F7sX1oOjYVZ.png?alt=media&token=0ed31d9b-378c-455e-8b0f-7d2a923a3712)

* 파란색 원은 parameters, 갈색 원은 observations, $N$ 은 데이터셋 개수를 의미
