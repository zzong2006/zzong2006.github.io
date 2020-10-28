---
layout: default
title:  "Optimization algorithms"
category: Deep Learning
order: 8
---

## Exponentially Weighted (moving) Averages

SGD보다 좋은 최적화 알고리즘은 Exponentially Weighted Averages (지수 가중치 평균) 개념을 이용한다 (또는 통계에서는 지수이동평균이라 부른다).

가중 이동 평균은 데이터의 이동 평균을 구할 때, 오래된 데이터가 미치는 영향을 지수적으로 감쇠(exponential decay) 하도록 만드는 평균 계산법이다.

해당 방법을 알아보기 위해 다음과 같은 예시를 살펴보자. 아래 그림은 날짜에 따른 온도 값을 파란색 점으로 나타낸 그래프이다.

![image-20201028224524846](https://i.loli.net/2020/10/28/aVAtf9W7wD5Ks6P.png)

만약, 이 온도들의 경향 값을 확인하고 싶다면, 지수이동평균을 적용할 수 있는데, 어떤 day $t$에 대한 지수 이동 평균 값 $v_t$는 다음과 같이 구할 수 있다.

$$
v_t=\beta v_{t-1} + (1-\beta)\theta_t
$$

* 여기서 $\theta_t$는 $t$의 온도를 의미한다.
* 그리고 $\beta$는 지수이동평균의 계수다. 이 값에 따라서 평균값을 구하려는 경향의 정도가 달라진다.

위 그림의 빨간색 선은 $\beta=0.9$일 때 계산한 지수이동평균 값이다.

* 일반적으로, 지수이동평균값은 $t$가 $\frac{1}{1-\beta}$ 인 범위의 평균을 구한것과 비슷하다.
  * 즉, $\beta=0.9$일 경우, $10$ 일의 온도 변화 추정치를 계산한 것과 같다.
  * $\beta=0.98$ 일 때($t=20$)는 아래 그림의 초록색 그래프, $\beta=0.5$일 때($t=2$)는 아래 그림의 노란색 그래프로 지수이동평균을 표현할 수 있다.

![image-20201028225556735](https://i.loli.net/2020/10/28/1yQzOuCE93xDVle.png)

### 지수이동평균을 사용하는 이유

평균을 구하는데, 메모리 효율면에서 우수하기 때문이다. 

$t$ 범위 간 평균값을 알기위해서는 단순히 $t$ 범위내에 존재하는 값들을 포함한 리스트의 평균 값을 계산하면 된다. 

*  하지만 이러한 접근법은 많은 메모리가 소요된다.

지수이동평균은 다음과 같이 계산된다.

$$
\begin{aligned}
v_{0} &=0 \\
v_{1} &=\beta v_{0}+(1-\beta) \theta_{1} \\
v_{2} &=\beta v_{1}+(1-\beta) \theta_{2} \\
v_{3} &=\beta v_{2}+(1-\beta) \theta_{3} \\
\cdots \\
\end{aligned}
$$

이러한 계산을 코드로는 쉽게 계산할 수 있다.

```
v = 0
Repeat {
	Get next theta
	v = beta * v + (1 - beta) * theta
}
```

## Bias correction

bias correction은 지수이동평균을 구할 때, 처음에 평균에 발생한 bias 부분을 고쳐주는 역할을 하는 방법이다.

$\beta=0.98$의 경우, 이전 예제에서의 지수이동평균 값은 아래와 같이 보인다.

![image-20201028231820932](https://i.loli.net/2020/10/28/JQfSBKXRcMq6ujG.png)

* 여기서 보라색은 $\beta=0.98$일 때, bias correction을 적용하지 않은 그래프이고, 초록색은 적용한 그래프이다.

bias correction이 없는 경우를 살펴보자.

$$
\begin{aligned}
v_{t}&=\beta v_{t-1}+(1-\beta) \theta_{t} \\
v_{0}&=0 \\
v_1&=0.02\theta_1\\
v_2&=0.98 v_1 + 0.02\ \theta_2 \\
&=0.98*0.02*\theta_1 +0.02\theta_2 \\
&=0.0196 \theta_1 + 0.02 \theta_2
\end{aligned}
$$

* $v_1$에서 $v_0$는 0이므로 $0.02\theta_1$만 남았다.
* 만약, $v_2$가 앞의 둘째 날의 평균값만 확인한것이라면, 매우 작은 값이 될것이다.

이를 막기위해 bias correction은 다음과 같이 계산된다.

$$
\frac{v_{t}}{1-\beta^{t}} = \beta v_{t-1} + (1-\beta) \theta_t
$$

상기 수식에서 $t=2$일 때의 bias correction 결과는 다음과 같다.

$$
\begin{aligned}
t=2: \quad 1-\beta^{t} =1-(0.98)^{2}=0.0396 \\
\frac{v_{2}}{0.0396}=\frac{0.0196 \theta_1+0.02 \theta_{2}}{0.0396}
\end{aligned}
$$

* 여기서 $v_2$는 이전보다 훨씬 큰 값을 가질것이다.

* 또한, $t$가 증가할수록, $1-\beta^t\approx1$에 가까워지므로, 보통의 지수이동평균과 같게된다 (보라색, 초록색 그래프 일치).

실제로는 optimization 알고리즘에 bias correction을 잘 적용하지 않는데, 그 이유는 그냥 몇 번 더 학습하면 알아서 bias가 사라지기 때문이다.

## Gradient Descent with Momentum

![image-20201028235419492](https://i.loli.net/2020/10/28/zXnBDUVWPCodJqM.png)

* $\alpha$는 learning rate
* $\beta$는 지수이동평균 계수, 일반적으로 0.9 값을 가짐 
  * 즉, 최근 10개의 iteration의 gradients 평균을 계산하는 것과 비슷하다.
  * $\beta=0$ 일 경우, 일반적인 gradient descent와 같다 (no momentum).
* $v_{dW} = 0, v_{db} =0$

### 왜 Momentum이 먹히는 걸까?

![image-20201029000002902](https://i.loli.net/2020/10/28/6J4M78iSqLPWIVN.png)

위와같은 cost function의 contour가 있다고 가정하자. red point 까지 가기 위해서는 세로는 짧게, 가로는 길게 움직이고 싶을 것이다.

Momentum은 최근 gradient의 경향을 알고있다. 즉, 학습하면 할수록 지수이동평균값은 gradient값의 가로로 증가하고 세로로 짧아지는 경향을 알고있다는 의미가 된다.

결과적으로, gradient 계산에 추가적인 평균(경향)값을 넣어줘서, SGD보다 더 빠르게 red point에 접근할 수 있게되어 빠른 optimization을 가능하게 만든다.

간단히 생각하면, 업데이트 하려는 방향으로 관성 또는 가속도를 넣어주고 있는 것이라 생각하면 된다.

## RMS(Root Mean Square)prop

$$
\begin{array}{l}
v_{d w}=\beta \cdot v_{d w}+(1-\beta) \cdot d w^{2} \\
v_{d b}=\beta \cdot v_{d w}+(1-\beta) \cdot d b^{2} \\
W=W-\alpha \cdot \frac{d w}{\sqrt{v_{d w}}+\epsilon} \\
b=b-\alpha \cdot \frac{d b}{\sqrt{v_{d b}}+\epsilon}
\end{array}
$$

* $v_{dw} = 0$, $v_{dw}=0$ 

momentum은 gradient를 통해 학습하려는 방향에 관성값을 추가해주는 역할을 하여 oscillating을 줄이는 반면, RMSprop는 oscillating 자체를 줄이려고 한다.

![image-20201029005419965](https://i.loli.net/2020/10/28/1vQmMJiX2OKPCUa.png)

* 위 그림은 가로는 $w$ 이고, 세로는 $b$일 때의  cost function이라 가정하자.
* red point에 빠르게 접근하기 위해서는 $w$가 업데이트 되는 값을 늘리고, $b$의 업데이트 값을 줄여야한다.
  * 학습을 하다보면 oscillating에 의해 $dw$는 적은 값을 가지고, $db$는 큰 값을 가지는데(상하로 왔다갔다하므로), RMSprop는 이러한 값의 역수를 취해서 적은 gradient는 크게 update, 큰 gradient는 작게 update하게 만든다. 
  * 반대로, 올바르게 잘 학습하고 있다고 생각해보자(초록색 화살표). 그래도 빠르게 수렴하진 않는다. Why? RMSprop 식에 의해서 gradient가 조절되기 때문이다(이제는 가로가 크게 update하므로 이를 조절함).

간단히 생각하면, 브레이크를 계속 밟고 움직이고 있는거라고 생각하면 된다. 즉, 어떻게 학습하든 천천히 학습하게 만들어서, 큰 learning rate를 이용해서 학습을 수행해도 조절해준다.

<img src="https://i.loli.net/2020/10/29/1lSyaGKLZxrHdBV.gif" alt="image" style="zoom: 67%;" />

## Adam

지금까지 배운 모든것을 적용하는 학습 알고리즘이다. 이 학습 알고리즘은 매우 효율적이다.

* 즉, Momentum + RMSprop + Bias correction 이 세개를 다 조합한 알고리즘이다.

![Adam Optimization Algorithm An effective optimization algorithm  Towards Data Science](https://i.loli.net/2020/10/29/Tpi5D9zd3XKFsnq.png)

* 여기서 $m_t$는 momentum, $v_t$는 RMSprop 에 관련된 variable이라는 것을 알 수 있다.
* 일반적으로 $\beta_1$은 0.9, 그리고 $\beta_2$는 0.999, $\epsilon =10^{-8}$ 로 default 값을 가진다.

## Learning rate decay

학습을 수행하면서 epoch가 증가할수록, 학습률 $\alpha$값을 낮추는 방법이 존재한다.

일반적인 방법은 아래와 같다.
$$
\alpha = \frac{1}{1+\gamma * num} \alpha_0
$$

* $\gamma$는 decay rate이고, $num$은 epoch의 개수, 그리고 $\alpha_0$는 초기 학습률을 의미한다.
* 학습을 반복할수록 $\alpha$값이 감소한다.

### Exponential Decay

수동적인 방법이다. 거의 사용하지 않는듯하다.
$$
\alpha=0.95^{num}\cdot\alpha_0
$$
일반적으로 learning rate decay는 거의 마지막에 고려되는 방법이라고 한다.

## Local optima in neural networks

![image-20201029014248130](https://i.loli.net/2020/10/29/bNZdum7yYAH1854.png)

일반적으로 local optima라면 왼쪽 위 그림의 움푹 파인곳을 생각한다. 

그런데 고차원으로 갈 수록, 저런 형태는 많지않다. 오히려 오른쪽 그림과 같은 saddle points(안장점)가 많다고 한다.

특히, 이 안장점의 문제는 plateaus형태의 안장점이 문제가 된다.

*  plateaus란, 고지대 느낌으로, gradient 값이 넓은 공간에서 0인 범위를 의미한다. 이런 곳에 위치한 cost function은 쉽게 빠져나올 수 없다.



![Plateau Formation Types of Plateaus  Major Plateaus of The World  PMF  IAS](https://i.loli.net/2020/10/29/9WNn1y2T8QuAKfO.jpg)