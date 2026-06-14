---
title: "PCA"
tags: ["machine_learning topic_modeling"]
---

# A) PCA ?

PCA 를 사용한다는 것은 기존의 $n$ 차원 데이터 $\boldsymbol{x}_{n}$ 와 유사한 projections $\tilde{\boldsymbol{x}}_{n}$ 를 찾는 것과 동일한 말이다. 좀 더 구체적으로 얘기해보면, 다음과 같은 식으로 $D$ 차원 데이터 $\boldsymbol{x}_{n}$ 의 저차원 ($M$) 변환을 수행할 수 있다.

$$
\boldsymbol{z}_{n}=\boldsymbol{B}^{\top}\boldsymbol{x}_{n}\in\mathbb{R}^{M}
$$

여기서 $\boldsymbol{B}$ 는 [[projection|projection matrix]] 로, 다음과 같이 표현된다.

$$
\boldsymbol{B}:=\left[\boldsymbol{b}_{1},\ldots,\boldsymbol{b}_{M}\right]\in\mathbb{R}^{D\times M}, M<D
$$

$\boldsymbol{B}$ 을 이루는 열벡터들은 [[orthonormal]] 하다고 가정한다. projection 자체가 scaling 없이 rotation 만 하기 때문에 unit vector 여야 한다.

아래 그림을 통해 전체 과정을 이해할 수 있다.

![](https://i.imgur.com/zJ7SNpK.png)

# B) PCA Derivation

$N$ 개의 [[i.i.d.]] 를 만족하는 데이터 포인트들 $\mathbf{X}=\left[\mathbf{x}_{1},\ldots,\mathbf{x}_{N}\right]^{T}$ 이 존재하고, 각 $\mathbf{x}$ 는 $D$ 차원 벡터라고 하자. 이때 PCA 는 [[projection matrix]] $\mathbf{P}=\left[\mathbf{p}_{1},\ldots,\mathbf{p}_{D^{\prime}}\right]^{T}$ 를 찾는 방법이다 ($D^{\prime}\leq D$).

$\mathbf{p}$ 는 $\mathbf{X}$ 의 variance 를 최대화 하는 방향으로 각 데이터를 저차원으로 mapping 시키는데, 여기서는 예시로 $\mathbf{p_1}$ 을 어떻게 유도하는지 살펴보자.

* [[covariance]] matrix $\mathbf{C}$ 는 다음과 같이 계산된다

: $\displaystyle\mathbf{C}=\frac{1}{N}\sum_{n=1}^{N}\left(\mathbf{x}_{n}-\mu\right)\left(\mathbf{x}_{n}-\mu\right)^{T}$

	- $\mu=\frac{1}{N}\sum_{n=1}^{N}\mathbf{x}_{n}$ 는 mean

* 데이터 point 를 $\mathbf{p_1}$ 에 project 하고난 결과의 variance 를 계산하면, 다음과 같다

$$
\displaystyle v^{\prime}=\frac{1}{N}\sum_{n=1}^{N}\left(\mathbf{p}_{1}^{T}\mathbf{x}_{n}-\mathbf{p}_{1}^{T}\mu\right)^{2}=\mathbf{p}_{1}^{T}\mathbf{C}\mathbf{p}_{1}
$$

* $v'$ 는 scalar 이다.
* PCA 는 $v'$ 값을 최대화할수 있는 unit vector $\mathbf{p_1}$ 를 찾는 것이 목적이므로, [[Lagrange multiplier method]] 를 활용하여 아래와 같이 식을 세울 수 있다

$$
\displaystyle\mathbf{p}_{1}\leftarrow\max F=\mathbf{p}_{1}^{T}\mathbf{C}\mathbf{p}_{1}+\lambda_{1}\left(1-\mathbf{p}_{1}^{T}\mathbf{p}_{1}\right)
$$

	- data compression을 통해 가장 많은 정보를 남긴다는 의미는 저차원 데이터에서 가장 큰 variance 값을 찾아내는 것과 동일하다.

위 식에서 $F$ 를 $\mathbf{p_1}$ 에 대해서 미분하여 0 으로 설정하면 다음과 같은 조건을 찾을 수 있다

$$
\displaystyle\frac{dF}{d\mathbf{p}_{1}}=0\Rightarrow\mathbf{C}\mathbf{p}_{1}=\lambda_{1}\mathbf{p}_{1}
$$

위 식은 $\mathbf{C}$ 의 [[eigen-decomposition]] 식을 푸는것과 동일하다

: $\mathbf{p}_{1}$ 가 eigenvector 그리고 $\lambda_1$ 은 eigenvalue

즉, $\operatorname{det}\left(\mathbf{C}-\lambda_{1}\mathbf{I}\right)=0$ 를 푸는 것과 동일하다.

* 나머지 projection column vector $\mathbf{p}_{2},\ldots,\mathbf{p}_{D^{\prime}}$ 에 대해서도 풀면, $\mathbf{C}$ 은 [[eigen-decomposition]] 에 의해 다음과 같이 표현할 수 있다: $\mathbf{C}=\mathbf{P}{\Lambda}\mathbf{P}^{T}$
	* $\Lambda$ 는 [[diagonal matrix]] with elements $\left\{\lambda_{1},\lambda_{2},\ldots,\lambda_{D}\right\}$ and $\lambda_{1}\geq\lambda_{2}\geq\ldots\geq\lambda_D$

# C) Relation with Singular Value Decomposition

* [[machine_learning/Singular Value Decomposition|SVD]] 와 PCA 는 동일한 방법이지만 좀 더 유연한 방법이다.
* 왜 동일한지 설명하기 위해, 모든 데이터가 zero mean 으로 전처리 되었다 ($\mathbf{x}_{n}-\mu$) 는 가정 하에 얘기하자면 다음과 같다.

covariance matrix $\mathbf{C}=\frac{1}{n-1}\mathbf{XX}^{\top}$ 은 [[symmetric matrix]] 이고 [diagonalizable]([[diagonal matrix]]) 하므로, 다음과 같이 eigenvector 들은 normalized 될 수 있다.

$$
\frac{1}{n-1}\mathbf{XX}^{\top}=\frac{1}{n-1}\mathbf{WDW}^{\top}
$$

데이터 $\mathbf{X}$ 에 대해 [[linear_algebra/Singular Value Decomposition]] 를 적용한다면, 다음과 같다

$$
\displaystyle\frac{1}{n-1}\mathbf{XX}^{\top}=\frac{1}{n-1}\left(\mathbf{U}\mathbf{\Sigma}\mathbf{V}^{\top}\right)\left(\mathbf{U}\mathbf{\Sigma}\mathbf{V}^{\top}\right)^{\top}=\frac{1}{n-1}\mathbf{U}\mathbf{\Sigma}^{2}\mathbf{U}^{\top}
$$

즉, $\frac{1}{n-1}\mathbf{WDW}^{\top}=\frac{1}{n-1}\mathbf{U}\mathbf{\Sigma}^{2}\mathbf{U}^{\top}$ 이므로, $\mathbf{X}\mathbf{X}^{\top}$ 의 [[eigenvalue]] 들의 square root 를 씌운것이 $\mathbf{X}$ 의 singular value 와 동일함을 알 수 있다.

Further reading

* Chapter 4.1.4–4.1.6 in Chris Bishop’s book on PRML covers LDA

# D) Related

[[Probabilistic PCA]]

# E) References

* [A Tutorial on Principal Component Analysis](https://arxiv.org/pdf/1404.1100.pdf)
* http://www.cs.cmu.edu/~tom/10601_fall2012/slides/pca.pdf
* [StackExchange: intuitive relationship between SVD and PCA](https://math.stackexchange.com/questions/3869/what-is-the-intuitive-relationship-between-svd-and-pca)
