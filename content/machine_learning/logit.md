---
tags: ["machine_learning", "statistic"]
aliases: ["로짓"]
---

# A) Logit ?

[[odds ratio]] 에 log 를 취한 값을 [[logit]] 이라고 부른다.

logit 은 [[logistic regression]] 에 의해 유도될 수 있다.

다음과 같은 [[logistic regression]] 모델 $h_\theta(x)$ 가 있다고 가정하자.

$$
\displaystyle h_\theta(x)=\frac{1}{1+e^{-\theta^Tx}}
$$

식의 오른쪽을 선형 형태로 만들면 logit 을 찾을 수 있다.

$$
\displaystyle log(\frac{h_\theta(x)}{1-h_\theta(x)})=\theta^Tx
$$

* $h_\theta(x)$ 는 데이터 $x$ 가 positive 일 확률
* $1-h_\theta(x)$ 는 데이터 $x$ 가 negative 일 확률

# B) Logit 의 수학적 의미

* [[logit]] 은 `[0, 1]` 범위를 가진 확률을 `[-inf, inf]` 범위를 가지도록 바꿀 수 있다.
* 만약 확률이 0.5 라면, [[logit]] 값은 0($=log(1)$) 이다.
* 음의 logit 값이면, 이에 해당하는 확률은 0.5 보다 낮은 것이다.
* 양의 logit 값이면, 이에 해당하는 확률은 0.5 보다 높은 것이다.

# C) Machine Learning 에서 사용처

* 주로 logit 은 [[machine_learning/Normalization]] 을 위해 [[softmax function]] 의 입력값으로 사용된다.

# D) Related

# E) References
