---
layout: default
title:  "Optimization algorithms"
category: Deep Learning
order: 8
---

# A) Exponentially Weighted (moving) Averages

SGD 보다 좋은 최적화 알고리즘은 Exponentially Weighted Averages (지수 가중치 평균) 개념을 이용한다 (또는 통계에서는 지수이동평균이라 부른다).

가중 이동 평균은 데이터의 이동 평균을 구할 때, 오래된 데이터가 미치는 영향을 지수적으로 감쇠 (exponential decay) 하도록 만드는 평균 계산법이다.

해당 방법을 알아보기 위해 다음과 같은 예시를 살펴보자. 아래 그림은 날짜에 따른 온도 값을 파란색 점으로 나타낸 그래프이다.

![[img-204ef40088.png|image-20201028224524846]]

만약, 이 온도들의 경향 값을 확인하고 싶다면, 지수이동평균을 적용할 수 있는데, 어떤 day $t$ 에 대한 지수 이동 평균 값 $v_t$ 는 다음과 같이 구할 수 있다.

$$
v_t=\beta v_{t-1} + (1-\beta)\theta_t
$$

* 여기서 $\theta_t$ 는 $t$ 의 온도를 의미한다.
* 그리고 $\beta$ 는 지수이동평균의 계수다. 이 값에 따라서 평균값을 구하려는 경향의 정도가 달라진다.

위 그림의 빨간색 선은 $\beta=0.9$ 일 때 계산한 지수이동평균 값이다.

* 일반적으로, 지수이동평균값은 $t$ 가 $\frac{1}{1-\beta}$ 인 범위의 평균을 구한것과 비슷하다.
  * 즉, $\beta=0.9$ 일 경우, $10$ 일의 온도 변화 추정치를 계산한 것과 같다.
  * $\beta=0.98$ 일 때 ($t=20$) 는 아래 그림의 초록색 그래프, $\beta=0.5$ 일 때 ($t=2$) 는 아래 그림의 노란색 그래프로 지수이동평균을 표현할 수 있다.

![[img-b26eeec68e.png|image-20201028225556735]]

## A.1) 지수이동평균을 사용하는 이유

평균을 구하는데, 메모리 효율면에서 우수하기 때문이다.

$t$ 범위 간 평균값을 알기위해서는 단순히 $t$ 범위내에 존재하는 값들을 포함한 리스트의 평균 값을 계산하면 된다.

* 하지만 이러한 접근법은 많은 메모리가 소요된다.

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

# B) Gradient Descent with Momentum

![[img-3867199247.png|image-20201028235419492]]

* $\alpha$ 는 learning rate
* $\beta$ 는 지수이동평균 계수, 일반적으로 0.9 값을 가짐
  * 즉, 최근 10 개의 iteration 의 gradients 평균을 계산하는 것과 비슷하다.
  * $\beta=0$ 일 경우, 일반적인 gradient descent 와 같다 (no momentum).
* $v_{dW} = 0, v_{db} =0$

## B.1) 왜 Momentum 이 먹히는 걸까?

![[img-a3c046ae79.png|image-20201029000002902]]

위와같은 cost function 의 contour 가 있다고 가정하자. red point 까지 가기 위해서는 세로는 짧게, 가로는 길게 움직이고 싶을 것이다.

Momentum 은 최근 gradient 의 경향을 알고있다. 즉, 학습하면 할수록 지수이동평균값은 gradient 값의 가로로 증가하고 세로로 짧아지는 경향을 알고있다는 의미가 된다.

결과적으로, gradient 계산에 추가적인 평균 (경향) 값을 넣어줘서, SGD 보다 더 빠르게 red point 에 접근할 수 있게되어 빠른 optimization 을 가능하게 만든다.

간단히 생각하면, 업데이트 하려는 방향으로 관성 또는 가속도를 넣어주고 있는 것이라 생각하면 된다.

# C) RMS(Root Mean Square)prop

$$
\begin{array}{l}
v_{d w}=\beta \cdot v_{d w}+(1-\beta) \cdot d w^{2} \\
v_{d b}=\beta \cdot v_{d w}+(1-\beta) \cdot d b^{2} \\
W=W-\alpha \cdot \frac{d w}{\sqrt{v_{d w}}+\epsilon} \\
b=b-\alpha \cdot \frac{d b}{\sqrt{v_{d b}}+\epsilon}
\end{array}
$$

* $v_{dw} = 0$, $v_{dw}=0$

momentum 은 gradient 를 통해 학습하려는 방향에 관성값을 추가해주는 역할을 하여 oscillating 을 줄이는 반면, RMSprop 는 oscillating 자체를 줄이려고 한다.

![[img-f0d536c5cc.png|image-20201029005419965]]

* 위 그림은 가로는 $w$ 이고, 세로는 $b$ 일 때의 cost function 이라 가정하자.
* red point 에 빠르게 접근하기 위해서는 $w$ 가 업데이트 되는 값을 늘리고, $b$ 의 업데이트 값을 줄여야한다.
  * 학습을 하다보면 oscillating 에 의해 $dw$ 는 적은 값을 가지고, $db$ 는 큰 값을 가지는데 (상하로 왔다갔다하므로), RMSprop 는 이러한 값의 역수를 취해서 적은 gradient 는 크게 update, 큰 gradient 는 작게 update 하게 만든다.
  * 반대로, 올바르게 잘 학습하고 있다고 생각해보자 (초록색 화살표). 그래도 빠르게 수렴하진 않는다. Why? RMSprop 식에 의해서 gradient 가 조절되기 때문이다 (이제는 가로가 크게 update 하므로 이를 조절함).

간단히 생각하면, 브레이크를 계속 밟고 움직이고 있는거라고 생각하면 된다. 즉, 어떻게 학습하든 천천히 학습하게 만들어서, 큰 learning rate 를 이용해서 학습을 수행해도 조절해준다.

<img src="https://i.loli.net/2020/10/29/1lSyaGKLZxrHdBV.gif" alt="image" style="zoom: 67%;" />

# D) Adam

Adam 은 Momentum 과 RMSprop 을 합치고, 학습 초반의 치우침을 [[bias correction]] 으로 바로잡은 알고리즘이다. 파라미터마다 gradient 의 이동평균 두 개를 유지한다.

## D.1) 업데이트 식

step $t$ 에서 gradient $g_t$ 를 계산한 뒤, 파라미터 $\theta$ 를 다음 순서로 고친다.

$$
\begin{aligned}
m_t &= \beta_1 m_{t-1} + (1-\beta_1)\, g_t \\
v_t &= \beta_2 v_{t-1} + (1-\beta_2)\, g_t^2 \\
\hat m_t &= \frac{m_t}{1-\beta_1^t}, \qquad \hat v_t = \frac{v_t}{1-\beta_2^t} \\
\theta_t &= \theta_{t-1} - \alpha\, \frac{\hat m_t}{\sqrt{\hat v_t} + \epsilon}
\end{aligned}
$$

| 기호 | 뜻 |
| --- | --- |
| $g_t$ | step $t$ 의 미니배치로 계산한 gradient. 파라미터마다 따로 계산한다 |
| $m_t$ | 1 차 모멘트. gradient 의 지수이동평균. Momentum 의 $v_{dW}$ 와 같은 역할 |
| $v_t$ | 2 차 모멘트. gradient 제곱의 지수이동평균. RMSprop 의 $v_{dW}$ 와 같은 역할 |
| $\hat m_t$, $\hat v_t$ | bias correction 을 거친 값. $m_0 = v_0 = 0$ 에서 시작해 초반 값이 0 쪽으로 치우친 것을 보정한다 |
| $\alpha$ | learning rate |
| $\beta_1$, $\beta_2$ | 두 이동평균의 계수. 기본값 0.9, 0.999 |
| $\epsilon$ | 0 으로 나누는 것을 막는 작은 값. 기본값 $10^{-8}$ |

## D.2) 1 차 모멘트는 방향, 2 차 모멘트는 크기

두 이동평균은 gradient 에서 서로 다른 정보를 뽑는다.

- $m_t$ 는 gradient 를 부호째 평균한다. 부호가 번갈아 바뀌면 서로 지워져 0 에 가까워지고, 같은 방향이 이어지면 그 방향으로 쌓인다. 그래서 **어느 방향으로 꾸준히 가고 있는지** 를 나타낸다.
- $v_t$ 는 gradient 를 제곱해서 평균하므로 부호가 사라진다. 그래서 **gradient 가 평소 얼마나 큰지** 만 나타낸다.

업데이트 크기를 정하는 $\hat m_t / \sqrt{\hat v_t}$ 는 "꾸준한 방향" 을 "평소 크기" 로 나눈 값이다. 같은 gradient 를 100 step 동안 넣고 $\beta_1 = 0.9$, $\beta_2 = 0.999$ 로 계산하면 다음과 같다.

| gradient 흐름 | $\hat m$ | $\sqrt{\hat v}$ | $\hat m / \sqrt{\hat v}$ |
| --- | --- | --- | --- |
| $+1, -1, +1, -1, \dots$ (진동) | -0.05 | 1 | -0.05 |
| $0.01, 0.01, \dots$ (작지만 일정) | 0.01 | 0.01 | 1 |
| $1, 1, \dots$ | 1 | 1 | 1 |
| $100, 100, \dots$ | 100 | 100 | 1 |

방향이 일정하면 gradient 가 0.01 이든 100 이든 한 step 에 약 $\alpha$ 만큼 움직인다. 방향이 갈팡질팡하면 거의 움직이지 않는다. 파라미터마다 gradient 의 크기가 달라도 보폭이 자동으로 비슷하게 맞춰지므로, 이를 파라미터별 적응형(adaptive) learning rate 라고 부른다.

Adam 이 보폭을 줄이기만 하는 것은 아니다. gradient 가 늘 작은 파라미터는 $\sqrt{\hat v}$ 로 나누면서 보폭이 커진다. 위 표에서 0.01 짜리 gradient 가 100 짜리와 같은 보폭을 받는 것이 그 예다.

# E) AdamW: weight decay 를 gradient 와 분리한다

[[weight decay]] 는 매 step 가중치를 일정 비율로 줄여 가중치가 커지지 않게 하는 정규화다. SGD 에서는 loss 에 L2 벌점 $\frac{\lambda}{2}\lVert\theta\rVert^2$ 를 더하는 것과 weight decay 가 같은 업데이트를 만든다. Adam 에서는 둘이 달라진다.

- **Adam + L2 벌점**: 벌점의 gradient $\lambda\theta$ 가 $g_t$ 에 더해진 채 $m_t$, $v_t$ 에 들어가고, 마지막에 $\sqrt{\hat v_t}$ 로 나뉜다. gradient 가 평소 큰 파라미터는 큰 값으로 나뉘어 줄어드는 힘이 약하고, gradient 가 작은 파라미터는 작은 값으로 나뉘어 세게 줄어든다. 정규화 강도가 파라미터마다 제각각이 된다.
- **AdamW**: 줄이는 항을 이 나눗셈 밖으로 빼서, 모든 파라미터를 같은 비율로 줄인다 (decoupled weight decay, Loshchilov & Hutter, 2019).

$$
\theta_t = \theta_{t-1} - \alpha \left( \frac{\hat m_t}{\sqrt{\hat v_t} + \epsilon} + \lambda\, \theta_{t-1} \right)
$$

여기서 $\lambda$ 는 weight decay 계수이고, $m_t$, $v_t$ 는 벌점이 섞이지 않은 원래 gradient $g_t$ 로 계산한다. 두 방식이 실제로 얼마나 다른지는 weight decay 노트에서 계산해 보인다.

Transformer 계열 모델의 학습과 파인튜닝에서는 AdamW 가 사실상 기본값이다.

# F) SGD 와 Adam 중 무엇을 쓰나

Adam 은 learning rate 를 덜 신경 써도 빨리 수렴해서 기본값처럼 쓰인다. 그런데 ResNet 같은 CNN 이미지 분류에서는 [[Momentum]] 을 쓴 SGD 가 test 성능이 더 좋다는 보고가 많다 (Wilson et al., 2017). 이론으로 완전히 정리된 주제는 아니고, 아래는 실험 결과를 바탕으로 한 설명이다.

- **SGD 의 잡음이 넓은 최솟값으로 이끈다.** SGD 는 미니배치에서 추정한 gradient 를 그대로 쓰므로 잡음이 섞여 있다. 이 잡음 때문에 좁고 뾰족한 골짜기에는 머물기 어렵고, 넓고 평평한 골짜기(flat minimum)에 머물게 된다는 설명이 널리 쓰인다. 평평한 최솟값은 파라미터가 조금 달라져도 loss 가 크게 변하지 않아 새 데이터에서도 잘 맞는 경향이 있다. 자세한 내용은 [[stochastic gradient descent]] 노트에 있다.
- **층마다 gradient 크기가 고르면 적응형 보폭의 이득이 작다.** CNN 에 [[Batch Normalization]] 을 쓰면 층마다 gradient 크기가 비교적 고르다. 반대로 Transformer 는 임베딩, attention, 층마다 gradient 크기 차이가 크고, 가끔만 업데이트되는 파라미터(드물게 나오는 토큰의 임베딩)도 많다. 이런 모델은 모든 파라미터에 같은 learning rate 를 쓰는 SGD 로는 학습이 잘 되지 않아 Adam 계열을 쓴다.
- **예전 비교의 일부는 L2 처리 때문이었다.** 앞 절처럼 Adam 에 L2 벌점을 넣으면 정규화가 고르게 걸리지 않는다. AdamW 가 이 차이의 상당 부분을 줄였다.

| 모델 계열 | 흔히 쓰는 optimizer |
| --- | --- |
| CNN 이미지 분류 (ResNet 등) | SGD + Momentum, learning rate schedule |
| Transformer (언어 모델, ViT 등) | AdamW, warmup + learning rate schedule |

# G) Learning Rate Decay

학습을 수행하면서 epoch 가 증가할수록, 학습률 $\alpha$ 값을 낮추는 방법이 존재한다.

일반적인 방법은 아래와 같다.

$$
\alpha = \frac{1}{1+\gamma * num} \alpha_0
$$

* $\gamma$ 는 decay rate 이고, $num$ 은 epoch 의 개수, 그리고 $\alpha_0$ 는 초기 학습률을 의미한다.
* 학습을 반복할수록 $\alpha$ 값이 감소한다.

## G.1) Exponential Decay

수동적인 방법이다. 거의 사용하지 않는듯하다.

$$
\alpha=0.95^{num}\cdot\alpha_0
$$

일반적으로 learning rate decay 는 거의 마지막에 고려되는 방법이라고 한다.

# H) Local Optima in Neural Networks

![[img-9981d3b099.png|image-20201029014248130]]

일반적으로 local optima 라면 왼쪽 위 그림의 움푹 파인곳을 생각한다.

그런데 고차원으로 갈 수록, 저런 형태는 많지않다. 오히려 오른쪽 그림과 같은 saddle points(안장점) 가 많다고 한다.

특히, 이 안장점의 문제는 plateaus 형태의 안장점이 문제가 된다.

* plateaus 란, 고지대 느낌으로, gradient 값이 넓은 공간에서 0 인 범위를 의미한다. 이런 곳에 위치한 cost function 은 쉽게 빠져나올 수 없다.

![[img-d93f2fdf9a.jpg|Plateau Formation Types of Plateaus Major Plateaus of The World PMF IAS]]

# References

- Diederik P. Kingma, Jimmy Ba, "[Adam: A Method for Stochastic Optimization](https://arxiv.org/abs/1412.6980)", ICLR 2015.
- Ilya Loshchilov, Frank Hutter, "[Decoupled Weight Decay Regularization](https://arxiv.org/abs/1711.05101)", ICLR 2019.
- Ashia C. Wilson, Rebecca Roelofs, Mitchell Stern, Nathan Srebro, Benjamin Recht, "[The Marginal Value of Adaptive Gradient Methods in Machine Learning](https://arxiv.org/abs/1705.08292)", NeurIPS 2017.
