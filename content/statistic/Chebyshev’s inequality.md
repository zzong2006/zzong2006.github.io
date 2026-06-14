---
title: "Chebyshev’s inequality"
tags: ["statistic"]
aliases: ["Chebyshev's theorem"]
---

# I. Chebyshev’s Inequality ?

체비쇼프 부등식은 랜덤 변수에 따른 특정 값이, 그 랜덤 변수의 기댓값에서 벗어날 확률의 bound 를 계산하는 방법이다

a simple bound on the probability that a random variable deviates from its expected value by a certain amount.

# II. Chebyshev’s Inequality

Expectation $\mathbb{E}(X)$ 과 variance $\operatorname{Var}(X)$ 의 값을 가지는 랜덤 변수 $X:S\rightarrow\mathbb{R}$ 가 있다고 가정하자. 그러면 어떤 $a\in\mathbb{R}$ 에 대해서 다음이 성립한다.

$$
\displaystyle \mathbb{P}(|X-\mathbb{E}(X)|\geq a)\leq\frac{\operatorname{Var}(X)}{a^{2}}
$$

## II.A. From Wiki

Wiki 에서는 비슷하지만 다음과 같은 정의로 표현한다.

$$
\displaystyle\operatorname{Pr}(|X-\mu|\geq k\sigma)\leq\frac{1}{k^{2}}
$$

* Expected Value $\mu$, non-zero variance $\sigma^2$
* $k$ 는 $a$ 와 동일한데, $k>0$ 라는 조건이 붙는다.

또는 확률을 뒤집어서 표현할 수 있다.

$$
P(\mu-k \sigma<X<\mu+k \sigma) \geq 1-\frac{1}{k^{2}}
$$

# III. 예제 (From Wiki)

평균 1000, 표준 편차 200 의 단어 수가 적혀있는 저널 기사를 임의로 선택한다고 가정해보자.

기사가 600 자 이상 1400 자 이하의 단어를 포함할 확률은 75% 이다. 왜냐하면 체비쇼프의 부등식에 의하면, 저 범위 밖에 나갈 확률은 최대 $1/k^{2}=\frac{1}{4}(k=2)$ 이기 때문이다.

그런데 여기서 단어 수에 대한 분포가 [[Gaussian distribution|normal distribution]] 임을 추가적으로 알고 있다면, 75% 확률로 단어 수는 770 자 이상 1230 이하를 포함할 것으로 생각할 수 있다 (which is an even tighter bound).

# IV. Related

# V. References

* https://math.mit.edu/~goemans/18310S15/chernoff-notes.pdf
* Wiki: https://en.wikipedia.org/wiki/Chebyshev%27s_inequality
