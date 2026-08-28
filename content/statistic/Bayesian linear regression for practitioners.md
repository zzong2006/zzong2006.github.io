---
title: "Bayesian linear regression for practitioners"
aliases: []
tags:
  - linear_regression
  - tech_blog
  - bayesian_inference
---

# A) 실무자를 위한 Bayesian 선형 회귀

---

### A.1.1) 예측 분포 (Predictive Distribution)

예측 분포 $p(y_i \mid x_i)$는 주어진 입력 특성 $x_i$에 대해 목표값 $y_i$가 따르는 확률 분포를 의미합니다.

---

### A.1.2) 가능도 (Likelihood)

가능도 $p(y_i \mid x_i, \theta_i)$는 현재 모델 파라미터 $\theta_i$와 입력 특성 $x_i$가 주어졌을 때, 관측값 $y_i$가 나타날 확률 분포입니다.
일반적으로 교과서에서는 가우시안(Gaussian)이나 베르누이(Binomial) 분포를 예시로 사용하지만, 실제로는 어떤 모수적(parametric) 분포라도 가능도 함수로 사용할 수 있습니다.

---

### A.1.3) 사전 분포 (Prior Distribution)

사전 분포 $p(\theta_i)$는 모델 파라미터에 대한 사전 신념을 표현합니다. 적절한 사전 분포를 선택하는 것은 중요하며, 이는 모델의 정규화(regularization) 효과를 가져올 수도 있습니다.

특히 **가능도와 결합했을 때 해석이 쉬운 형태**를 얻으려면 **켤레(conjugate) 사전분포**를 사용하는 것이 유리합니다. 켤레 사전을 사용하면 새로운 데이터를 관찰할 때마다 파라미터 갱신을 위한 **해석적(analytical) 공식**을 얻을 수 있습니다.

반대로 가능도와 사전분포가 호환되지 않는 경우에는 [[statistic/MCMC approximation]]이나 [[variational inference]] 같은 근사 기법이 필요합니다. 하지만 이들 방법은 모든 데이터를 한 번에 사용할 수 있는 상황에 적합하며, **스트리밍 데이터 환경에서는 적용하기 어렵습니다**. 따라서 스트리밍 환경에서는 해석적 갱신 공식이 더욱 유용합니다.

---

### A.1.4) 사후 분포 (Posterior Distribution)

사후 분포 $p(\theta_{i+1} \mid \theta_i, x_i, y_i)$는 새로운 데이터 쌍 $(x_i, y_i)$가 관측된 후의 파라미터 $\theta_{i+1}$에 대한 확률 분포입니다.

---

### A.1.5) 베이즈 규칙: 가능도 + 사전분포 = 사후분포

베이즈 추론은 기본적으로 **가능도 + 사전분포 → 사후분포**라는 구조를 가집니다.

1. 먼저 사용할 가능도를 선택합니다.
2. 그다음 해당 가능도의 켤레가 되는 적절한 사전분포를 선택합니다.
3. 이 두 가지를 결합하면 새로운 데이터가 들어올 때 마다 갱신되는 사후분포를 계산할 수 있습니다.

베이즈 정리를 통해 표현하면 다음과 같습니다:

$$
p(\theta_{i+1} \mid \theta_{i}, x_{i}, y_{i})
= \frac{p(y_{i} \mid x_{i}, \theta_{i}) \, p(\theta_{i})}{p(x_{i}, y_{i})}
$$


여기서 $p(x_i, y_i)$는 데이터의 생성 과정을 의미하는데, 실제로는 알 수 없는 값입니다(만약 알았다면 애초에 학습이 필요하지 않겠지요). 따라서 보통은 비례식으로 단순화하여 다음과 같이 씁니다:

$$
p(\theta_{i+1} \mid \theta_{i}, x_{i}, y_{i})
\propto p(y_{i} \mid x_{i}, \theta_{i}) \, p(\theta_{i})
$$


---

출처: [Bayesian Linear Regression for Practitioners](https://maxhalford.github.io/blog/bayesian-linear-regression/)
