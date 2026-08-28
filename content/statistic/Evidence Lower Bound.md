---
title: "Evidence Lower Bound"
tags: ["bayesian_inference"]
aliases: ["ELBO"]
---

# A) Evidence Lower Bound ?

[[variational inference]] 에서 자주 사용되는 개념으로, 계산하기 원하는 true-distribution $p(x)$ 의 Log-likelihood 에 대한 Lower bound.

어떤 $N$ 개의 데이터 포인트들이 존재하고, 이들에 대한 marginal likelihood $\log p_{\theta}(x)$ 는 각 데이터의 marginal likelihood 들의 합으로 나타낼 수 있다.

$$
\log p_{\theta}\left(x^{(1)}, \cdots, x^{(N)}\right)=\sum_{i=1}^{N} \log p_{\theta}\left(x^{(i)}\right)
$$

이때, 개별 data point 들에 대한 marginal likelihood 는 다음과 같다.

$$
\begin{aligned}\log p_{\theta}\left(x^{(i)}\right)&=D_{K L}\left(q_{\phi}\left(z \mid x^{(i)}\right) \| p_{\theta}\left(z \mid x^{(i)}\right)\right) \ + \\ &  \mathbb{E}_{q_{\phi}(z \mid x)}\left[-\log q_{\phi}(z \mid x)+\log p_{\theta}(x, z)\right]\end{aligned}
$$

$q$ 는 varitional distribution 이고, $p$ 는 추정하려는 intractable distribution. $KL$ 은 [[KL-Divergence]] 를 의미한다.

KLD 는 항상 0 보다 크거나 같은 양수이므로, 두번째 항이 varitional lower bound 가 된다.

$$
\log p_{\theta}\left(x^{(i)}\right) \geq \mathbb{E}_{q_{\phi}(z \mid x)}\left[-\log q_{\phi}(z \mid x)+\log p_{\theta}(x, z)\right]=\mathcal{L}\left(\theta, \phi ; x^{(i)}\right)
$$

위 수식은 아래와 같이 풀어쓸 수 있다.

$$
\mathcal{L}\left(\theta, \phi ; x^{(i)}\right)=-\mathcal{D}_{\mathcal{K} \mathcal{L}}\left(q_{\phi}\left(z \mid x^{(i)}\right) \| p_{\theta}(z)\right)+\mathbb{E}_{q_{\phi}\left(z \mid x^{(i)}\right)}\left[\log p_{\theta}\left(x^{(i)} \mid z\right)\right]
$$

이 lower bound $\mathcal{L}$ 를 최대화 하는 것이, [[Maximum Likelihood Estimation|MLE]] 를 통해 $\theta$ 와 $\phi$ 를 찾는것과 동일하다.

$$
\left(\theta^{*}, \phi^{*}\right)=\arg \max _{\theta, \phi} \mathcal{L}\left(\theta, \phi ; x^{(i)}\right)
$$

# B) Difference Perspective

첫번째 term (expectation) 을 reconstruction error 로 볼 수 있고, 두번째 term (KL divergence) 을 [[regularization]] term 으로 볼 수 있다.

즉, 첫번째 term 을 통해 varitional distribution 이 얼마나 기존의 데이터의 분포 ($p(x | z)$) 를 잘 학습하는지?

그리고 두번째 term 을 통해 varitional distribution 이 얼마나 prior $p(z)$ 에 가깝게 둘 것인지? 의 개념으로 볼 수 있다는 것이다.

# C) References
