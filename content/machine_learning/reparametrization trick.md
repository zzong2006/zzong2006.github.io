---
tags: ["optimization"]
---

# Reparametrization Trick ?

[[variational inference]] 에서 사용하는 sampling $z \sim q_{\phi}(z \mid x)$ 값을 잘 변환 (reparameterization) 해서 미분 가능한 것으로 바꾸는 trick 을 의미한다.

이 trick 에서는 미분 가능한 함수인 변환 함수 $g_{\phi}(\epsilon, x)$ 와 noise variable $\epsilon$ 을 통해서 sampling 값을 표현할 수 있다: $\tilde{z}=g_{\phi}(\epsilon, x)$ with $\epsilon \sim p(\epsilon)$

이제 임의의 함수 $f(z)$ 의 $q_{\phi}(z \mid x)$ 에 대한 [[statistic/Monte Carlo Method|Monte Carlo]] expectation estimate 는 다음과 같다.

$$
\mathbb{E}_{q_{\phi}\left(z \mid x^{(i)}\right)}[f(z)]=\mathbb{E}_{p(\epsilon)}\left[f\left(g_{\phi}\left(\epsilon, x^{(i)}\right)\right)\right]=\frac{1}{L} \sum_{l=1}^{L} f\left(g_{\phi}\left(\epsilon^{(l)}, x^{(i)}\right)\right)
$$

위 수식을 기반으로 [[Evidence Lower Bound]] 는 다음과 같이 바뀔 수 있다.

$$
\tilde{\mathcal{L}}\left(\theta, \phi ; x^{(i)}\right)=-D_{K L}\left(q_{\phi}\left(z \mid x^{(i)}\right) \| p_{\theta}(z)\right)+\frac{1}{L} \sum_{l=1}^{L}\left(\log p_{\theta}\left(x^{(i)} \mid z^{(i, l)}\right)\right)
$$

여기서 $z^{(i, l)}=g_{\phi}\left(\epsilon^{(i, l)}, x^{(i)}\right)$ 이다.

# 왜 Reparameterization Trick 이 필요한가?

ELBO 에서 $\mathbb{E}_{q_{\phi}(z \mid x(i))}\left[\log p_{\theta}\left(x^{(i)} \mid z\right)\right]$ 를 계산할 때, $q$ 로 $z$ 를 sampling 한 뒤에 $\log p_{\theta}\left(x^{(i)} \mid z\right)$ 를 계산한다. 이 계산 방식을 [[neural network|NN]] 에서 푸는 경우 feed-forward 계산에서는 아무 문제가 없지만, [[backpropagation]] 에서는 문제가 있다. 왜냐하면 **sampling 은 미분 가능한 연산이 아니기 때문**이다.

즉, 고정된 parameter 가 있을 때, 같은 입력값에 대해서는 같은 출력값이 나와야 하는데, sampling 과정에서는 모델 자체에 stochasticity 를 넣어버려서 동일한 출력값이 나올 수 없기 때문에 문제가 된다.

하지만 reparameterization trick 을 활용하면 다음과 같이 sampling 을 위해 고른 분포 (e.g. [[Gaussian distribution]]: $\mu, \Sigma$) 의 parameter 에 대해 미분을 수행할 수 있다.

![](https://i.imgur.com/aLV5LPJ.png)

# 예시) VAE

[[machine_learning/deep_learning/Variational Autoencoder|Variational Autoencoder]] 에서 다음과 같은 데이터의 log [[marginal likelihood]] 의 lower-bound(ELBO) 를 계산한다고 생각해보자.

$$
\begin{aligned} \log p\left(\mathbf{x}_{u} ; \theta\right) & \geq \mathbb{E}_{q_{\phi}\left(\mathbf{z}_{u} \mid \mathbf{x}_{u}\right)}\left[\log p_{\theta}\left(\mathbf{x}_{u} \mid \mathbf{z}_{u}\right)\right]-\operatorname{KL}\left(q_{\phi}\left(\mathbf{z}_{u} \mid \mathbf{x}_{u}\right) \| p\left(\mathbf{z}_{u}\right)\right) \\ & \equiv \mathcal{L}\left(\mathbf{x}_{u} ; \theta, \phi\right) \end{aligned}
$$

이 경우, reparametrization trick 을 활용하면 $\mathbf{z}_{u}=\mu_{\phi}\left(\mathbf{x}_{u}\right)+\boldsymbol{\epsilon} \odot \sigma_{\phi}\left(\mathbf{x}_{u}\right)$ 의 형태로 표현할 수 있다 ($\boldsymbol{\epsilon} \sim \mathcal{N}\left(0, \mathbf{I}_{K}\right)$ 는 sampling).

# References
