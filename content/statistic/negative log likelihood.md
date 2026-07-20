---
title: negative log likelihood
tags:
  - statistic
  - machine_learning
aliases:
  - NLL
  - log-likelihood
---

# A) 한줄 요약

Negative Log Likelihood(NLL)는 **"모델이 정답에 부여한 확률이 낮을수록 커지는 벌점"**이다. 모델이 정답을 확률 1로 맞히면 벌점 0, 정답에 확률을 거의 안 줬으면 벌점이 무한대로 치솟는다.

$$
\mathrm{NLL}=-\log P(\text{정답}\mid \text{입력};\theta)
$$

정체는 단순하다. "데이터를 가장 그럴듯하게 보는 파라미터를 찾자"는 [[Maximum Likelihood Estimation|MLE]]에 (1) log를 씌우고 (2) 부호를 뒤집은 것. 최대화 문제를 딥러닝 프레임워크가 좋아하는 **최소화 문제(loss)**로 바꾼 포장이라, 분류 학습에서 쓰는 [[cross-entropy]] loss가 바로 이 NLL이다.

# B) 유도 — MLE에서 NLL까지

[[machine learning]]은 주어진 데이터만으로 미지의 최적 모델 [[parameter]] $\theta$를 찾아야 한다.

[[classification]] 문제에서, 입력값 $X$와 parameter $\theta$가 주어졌을 때 정답 $Y$가 나타날 확률을 [[likelihood]](우도) $P(Y\mid X;\theta)$로 표현할 수 있다. 이 likelihood를 최대화하는 $\theta$가 우리가 찾고 싶은 결과다: [[Maximum Likelihood Estimation]]

$$
\boldsymbol{\theta}_{\mathrm{ML}}=\underset{\theta}{\arg\max}\,P(\boldsymbol{Y}\mid\boldsymbol{X};\boldsymbol{\theta})
$$

**1단계 — log를 씌운다.** log는 단조증가 함수라 argmax의 결과가 바뀌지 않는다. 그런데도 굳이 씌우는 이유는:

- 샘플별 확률의 **곱이 합으로** 바뀐다 — 확률 수백만 개를 곱하면 float 표현 범위 아래로 떨어지는 numerical underflow가 생기는데, 합은 안전하다
- 곱의 미분보다 합의 미분이 훨씬 단순해서 gradient 계산이 깔끔하다

$$
\displaystyle\boldsymbol{\theta}_{\mathrm{ML}}=\underset{\theta}{\arg\max}\sum_{i=1}^{m}\log P\left(\boldsymbol{y}^{(i)}\mid\boldsymbol{x}^{(i)};\boldsymbol{\theta}\right)
$$

**2단계 — 부호를 뒤집는다.** 학습 프레임워크는 [[loss function]]을 "최소화"하는 관례를 따르므로, 음의 부호를 붙여 argmax를 argmin으로 바꾼다. 이렇게 얻은 것이 NLL loss다.

$$
\displaystyle\boldsymbol{\theta}_{\mathrm{ML}}=\underset{\theta}{\arg\min}\left[-\sum_{i=1}^{m}\log P\left(\boldsymbol{y}^{(i)}\mid\boldsymbol{x}^{(i)};\boldsymbol{\theta}\right)\right]
$$

# C) Cross-entropy·KL과의 관계

분류에서 정답이 one-hot이면 NLL은 [[cross-entropy]]와 정확히 같은 식이 된다 — 정답 클래스의 $-\log p$만 남기 때문이다. PyTorch의 `CrossEntropyLoss`가 내부적으로 `LogSoftmax + NLLLoss`인 이유다.

한 걸음 더 가면, NLL 최소화 = cross-entropy 최소화 = 데이터 분포에 대한 forward KL 최소화로 전부 같은 문제다. 유도는 [[KL-Divergence]] 노트의 D섹션 참조. LLM의 next-token prediction 사전학습도 결국 토큰 단위 NLL이다.

# D) Regularization과 MAP

NLL에 penalty 항을 더하면 [[regularization]]이 된다.

$$
\displaystyle\mathcal{L}(\boldsymbol{\theta};\lambda)=\left[\frac{1}{N}\sum_{n=1}^{N}\ell\left(\boldsymbol{y}_{n},\boldsymbol{\theta};\boldsymbol{x}_{n}\right)\right]+\lambda C(\boldsymbol{\theta})
$$

- $\lambda\ge0$는 regularization parameter, $C(\boldsymbol{\theta})$는 모델 복잡도에 대한 penalty다
- 일반적으로 complexity penalty는 $C(\boldsymbol{\theta})=-\log p(\boldsymbol{\theta})$로 설정하며, 여기서 $p(\boldsymbol{\theta})$는 $\boldsymbol{\theta}$의 prior다

만약 $\ell$이 log loss고 $\lambda=1$이면, 위 식은 다음과 같이 쓸 수 있다.

$$
\mathcal{L}(\boldsymbol{\theta};\lambda)=-\left[\sum_{n=1}^{N}\log p\left(\boldsymbol{y}_{n}\mid\boldsymbol{x}_{n},\boldsymbol{\theta}\right)+\log p(\boldsymbol{\theta})\right]=-[\log p(\mathcal{D}\mid\boldsymbol{\theta})+\log p(\boldsymbol{\theta})]
$$

이 식을 최소화하는 것은 log posterior를 최대화하는 것과 같다. 즉 **"NLL + prior penalty" = MAP 추정**이다 — [[maximum a posteriori probability|MAP]] 참조.

$$
\hat{\boldsymbol{\theta}}=\underset{\boldsymbol{\theta}}{\operatorname{argmax}}\,\log p(\boldsymbol{\theta}\mid\mathcal{D})=\underset{\boldsymbol{\theta}}{\operatorname{argmax}}\,[\log p(\mathcal{D}\mid\boldsymbol{\theta})+\log p(\boldsymbol{\theta})-\text{const}]
$$

거꾸로 말하면 L2 regularization은 Gaussian prior, L1은 Laplace prior를 가정한 MAP과 같다.

# E) References

- [[Probabilistic Machine Learning - An Introduction]], 4.5: [[regularization]]
