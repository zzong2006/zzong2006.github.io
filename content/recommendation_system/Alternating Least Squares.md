---
tags: ["machine_learning", "matrix_factorization", "recommendation_system"]
aliases: ["ALS", "WRMF", "WMF"]
---

[[collaborative filtering]] 의 [[matrix factorization|MF]] 기법은 [[gradient descent]] update 를 이용하여 user 와 item 의 latent vector 를 찾아내는데, 이러한 최적화 과정은 너무 느리고 많은 반복이 필요하다.

동시에 user 와 item 의 latent vector 를 찾아가는 MF 기법과 달리, ALS (Alternative Least Square) 는 user 와 item 의 latent factor 를 한번씩 번갈아 가면서 학습시킨다.

즉, Also 는 둘 중 하나의 latent factor 를 상수로 놓고, 다른 하나를 학습시키는 알고리즘이다.

# A) Also 의 Cost Function

$$
\displaystyle\min_{x_{\star},y_{\star}}\sum_{u,i}c_{ui}\left(p_{ui}-x_{u}^{T}y_{i}\right)^{2}+\lambda\left(\sum_{u}\left\|x_{u}\right\|^{2}+\sum_{i}\left\|y_{i}\right\|^{2}\right)
$$

$x_{u}\in\mathbb{R}^{f}$ 는 각 사용자 $u$ 에 대한 latent vector, 그리고 $y_{i}\in\mathbb{R}^{f}$ 는 각 아이템 $i$ 에 대한 latent vector 를 의미한다.

$p_{ui}$ 는 binary variables 로, 사용자 $u$ 가 아이템 $i$ 에 대한 선호 지표를 나타낸다. 즉, $u$ 가 $i$ 를 이용한 경우 ($r_{ui}>0$), $u$ 는 $i$ 를 선호한 것으로 판단한다 ($p_{ui}=1$). 반대로, 한 번도 $i$ 를 이용한적 없다면 ($r_{ui}=0$), $u$ 는 $i$ 를 선호하지 않은 것으로 판단한다 ($p_{ui}=0$)

$$
p_{ui}=\left\{\begin{array}{ll}1&r_{ui}>0\\0&r_{ui}=0\end{array}\right.
$$

하지만 생각해보면, 사용자가 아이템을 한번도 이용하지 않았다고 해서 그것을 선호하지 않는 것은 아닐 것이다. 반대로, 사용자가 아이템을 이용했다고 해서, 그것을 선호한다고 절대적으로 말할 순 없다.

Also 는 $p_{ui}$ 의 문제점을 보완하기 위해 $c_{ui}$ 를 cost function 에 사용한다. 이 값은 $p_{ui}$ 에 대한 신뢰도 지수 (confidence level) 을 나타내는 것으로, 사용자가 아이템을 선호한다는 확신이 있을수록 높은 값을 나타낸다.

$$
c_{ui}=1+\alpha r_{ui}
$$

* $r_{ui}$ 는 사용자 $u$ 가 아이템 $i$ 에 대한 직접적인 선호도를 표시한다.

  implicit feedback datasets 에서 *observations*을 나타낸다. 예를 들어, TV 프로그램 추천의 경우에는 $r_{ui}$ 값은 사용자 $u$ 가 해당 채널 $i$ 를 시청한 횟수를 나타낼 수 있다. 또는, $r_{ui}=0.7$ 과 같이, $u$ 에 대한 그 채널 $i$ 의 시청 횟수 지분이 70% 를 차지한다고 표현할 수 있다.

  반대로 explicit feedback datasets 에서의 $r_{ui}$ 는 *ratings*을 나타낸다. 그러나, 모든 사용자가 모든 아이템에 대해 평가할 수 없다. 그래서 이 경우 rating 된 $r_{ui}$ 에 대해서만 학습을 진행한다. 반대로, implicit 의 경우 사용자가 아이템에 대해서 평가하지 않아도 되므로, 모든 $r_{ui}$ 값은 매우 자연스럽다.

* $\alpha$ 는 hyper-parameter 로, $r_{ui}$ 에 따른 $c_{ui}$ 의 상승량을 조절하기 위해 필요한 상수다. ALS 을 소개한 논문의 실험에서는 `40` 으로 설정했다고 한다.

# B) Optimization Process

이제 cost function 에 대한 설명을 마쳤으니, 이 cost function 을 최적화 하는 방법에 대해 알아보자.

MF 에서는 cost function 을 최적화하기 위해서 SGD 를 사용했다. 하지만, implicit feedback datasets 은 사용자 $m$ 명, 아이템 $n$ 개 에 대한 계산을 필요로 하므로, 매우 느리다.

하지만 위 cost function 에서 사용자 또는 아이템에 대한 latent vector 를 상수로 고정시킨다면, cost function 은 quadratic 이 되므로 global minimum 을 찾기가 상대적으로 쉬워진다. 그래서 한쪽을 고정시키고 다른 한쪽을 최적화 한다음, 다시 반대로 최적화를 반복하면서 cost function 의 값을 낮춘다

이런 방법을 Alternating Least Squares 라고 부른다.

## B.1) Alternating Least Squares

첫 째로, cost function 을 최적화하는 사용자 $u$ 의 latent vector $x_u$ 를 찾는 것부터 시작한다.

하지만 그 전에, 미리 계산해놓고 정의해놓을 것들이 몇 개 있다.

* $Y$: 모든 item 의 latent factors 를 대변하는 $n\times f$ 크기의 행렬

  $Y$ 를 이용해 $f\times f$ 크기의 행렬 $Y^TY$ 를 $O(f^2n)$ 의 시간 복잡도로 계산

* $C^u$: 각 사용자 $u$ 에 대한, $n\times n$ 크기의 대각 행렬 $C^u$ (where $C_{ii}^{u}=c_{ui}$).
* $p(u)\in\mathbb{R}^{n}$: 사용자 $u$ 에 대한 모든 선호도 ($p_{ui}$ 값) 를 포함한 벡터

이제, cost function 을 $x_u$ 에 대해서 미분함으로써, $x_u$ 의 closed form 을 찾으면 다음과 같다.

$$
x_{u}=\left(Y^{T}C^{u}Y+\lambda I\right)^{-1}Y^{T}C^{u}p(u)
$$

위 식에서 $Y^{T}C^{u}Y$ 의 계산은 각 $m$ 명의 사용자 당 $O(f^2n)$ 의 시간 복잡도가 요구된다. 이를 효율적으로 계산하는 방법은 다음과 같이 계산하는 것이다.

$$
Y^{T}C^{u}Y=Y^{T}Y+Y^{T}\left(C^{u}-I\right)Y
$$

$Y^{T}Y$ 는 $u$ 에 대해서 독립이므로 미리 계산할 수 있다. 또한, $C^{u}-I$ 는 $r_{ui}>0$ 인 아이템의 개수인 $n_{u}$ 개의 non-zero 원소를 가지고, 일반적으로 $n_{u}\ll n$ 이므로 $O\left(f^{2}n_{u}+f^{3}\right)$ 에 계산이 가능하다.

* $c_{ui}=1+\alpha r_{ui}$ 이므로 $1$ 을 빼면 $r_{ui}$ 만 남음
* $f$ 는 일반적으로 작은 값이므로, 계산 비용과 큰 관련은 없음

두번째로, cost function 을 최적화하는 아이템 $i$ 의 latent vector $y_i$ 를 찾는 식은 다음과 같다.

$$
y_{i}=\left(X^{T}C^{i}X+\lambda I\right)^{-1}X^{T}C^{i}p(i)
$$

# C) Related

* [[Probabilistic Matrix Factorization]]
* [[Collaborative Filtering for Implicit Feedback Datasets]]

# D) References

[[One Side Least Square]]
