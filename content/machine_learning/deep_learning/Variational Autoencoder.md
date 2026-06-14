---
tags: ["deep_learning", "generative_model", "representation_learning"]
aliases: ["VAE", "Variational Autoencoder", "varitional autoencoder"]
---

# A) Variational Autoencoder ?

Variational Autoencoder(VAE)는 [[autoencoder]] 를 확률 모델로 확장한 generative model 이다. 일반 autoencoder 가 입력을 하나의 latent vector 로 압축하고 복원한다면, VAE 는 입력마다 latent distribution 을 추정하고 그 분포에서 sampling 한 $z$ 로 데이터를 복원한다.

이 차이 때문에 VAE 는 단순한 reconstruction 모델이 아니라, 새로운 sample 을 생성할 수 있는 모델로 볼 수 있다.

# B) 동작 흐름

```text
x
 -> encoder
 -> mean μ, variance σ²
 -> z = μ + σ ⊙ ε
 -> decoder
 -> reconstructed x
```

Encoder 는 입력 $x$ 를 latent distribution 의 parameter 인 $\mu$, $\sigma$ 로 바꾼다. 그 다음 $\epsilon \sim \mathcal{N}(0, I)$ 를 뽑고, [[reparametrization trick]] 으로 $z = \mu + \sigma \odot \epsilon$ 를 만든다. Decoder 는 이 $z$ 로부터 원래 입력과 비슷한 데이터를 복원한다.

# C) Objective

VAE 의 학습 목표는 보통 reconstruction term 과 KL term 으로 구성된다.

$$
\mathcal{L}
= \mathbb{E}_{q_\phi(z|x)}[\log p_\theta(x|z)]
- D_{KL}(q_\phi(z|x) \Vert p(z))
$$

첫 번째 항은 decoder 가 입력을 잘 복원하도록 만들고, 두 번째 항은 encoder 가 만든 latent distribution 이 prior $p(z)$, 보통 표준 정규분포와 너무 멀어지지 않게 한다. 이 목적 함수는 [[Evidence Lower Bound|ELBO]] 로 해석할 수 있다.

# D) 왜 Reparameterization Trick 이 필요한가

Sampling 은 그 자체로는 gradient 를 통과시키기 어렵다. VAE 는 randomness 를 $\epsilon$ 쪽으로 분리하고, $\mu$ 와 $\sigma$ 는 미분 가능한 연산 안에 두어서 encoder 를 [[gradient descent]] 로 학습할 수 있게 만든다.

# E) 실무적 감각

VAE 의 latent space 는 부드럽고 interpolation 이 잘 되는 편이다. 하지만 pixel-level reconstruction 을 평균적으로 맞추는 경향 때문에 image generation 에서는 결과가 흐릿해질 수 있다.

추천 시스템에서는 user/item interaction 을 확률적으로 복원하는 방식으로 응용된다. 예를 들어 [[papers/collaborative_filtering/Variational Autoencoders for Collaborative Filtering]] 같은 흐름은 VAE 를 collaborative filtering 에 맞게 해석한다.

