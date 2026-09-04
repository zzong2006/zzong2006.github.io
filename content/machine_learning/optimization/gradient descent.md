---
title: "gradient descent"
tags:
  - optimization
  - machine_learning
  - deep_learning
aliases: ["GD"]
---

# A) Gradient Descent ?

ML 모델 $h$ 에 대한 적합한 ($\theta_i$ 와 같은) [[parameter]] 를 찾기 위한 방법

# B) Visualization of Gradient Descent

아래는 parameter $\theta_0$ 와 $\theta_1$ 에 대한 [[cost function|loss function]] $J$ 의 등고선 그래프이다. 이 그래프의 사용 목적은 비용 함수 $J(\theta_0,\theta_1)$ 가 등고면 바닥에 닿을 수 있는 parameter 를 찾기 위함이다. 즉, 두 parameter 의 적절한 값을 찾기 위해 비용 함수를 미분하여 어느 방향으로 parameter 값을 조정해야 하는지 확인 해야한다.

![[img-66d87320fe.png|img]]

* 위의 십자가 모양의 표시는 parameters $(\theta_0,\theta_1)$ 가 변화한 순간들을 포착한 것이다.
* 변화한 순간의 간격이 일정한 듯 보이는데, 이러한 간격 (size of each step) 을 결정하는 것은 $\alpha$ 라는 학습률 ([[Learning rate]]) 이 결정한다.
* 또한 $(\theta_0,\theta_1)$ 의 값이 어디서 시작하냐에 따라서 (그림에서의 두 빨간 동그라미들), parameter 가 수렴하는 값이 달라진다.

# C) Gradient Descent for 2 Dim

gradient descent 알고리즘은 다음과 같은 수식으로 표현된다.

$$
\displaystyle\theta_j:=\theta_j-\alpha\frac{\partial}{\partial\theta_j} J(\theta_0,\theta_1)\ \text{where} \ j=0,1
$$

중요한 점은 각 parameter 에 대하여 업데이트 할 값 ($\displaystyle\frac{\partial}{\partial\theta_j}$) 을 먼저 모두 구하고, parameter 의 값들을 update 해야 한다는 점이다.

아래 그림은 올바른 또는 올바르지 않은 update 방식을 나타낸다.

	![[img-ed29cf33b4.png|img]]

* $:=$ 는 assign 의 의미가 있으며, $=$ 는 assert 의 의미가 있다. 즉, $a:=b$ 는 $b$ 의 값을 $a$ 에 부여하고, $a=b$ 는 $a$ 와 $b$ 의 값이 일치하는지 확인하는 것이다.

# D) Gradient Descents 의 직관적 이해

비용 함수 $J(\theta_1)$ 에서, parameter $\theta_1$ 을 찾기 위해, 다음과 같은 gradient descent 를 반복한다고 가정하자.

$$
\displaystyle\theta_1:=\theta_1-\alpha\frac{\partial}{\partial\theta_1}J(\theta_1)
$$

위의 식은 $\theta_1$ 의 값은 점점 $\displaystyle\frac{\partial}{\partial\theta_1}$ 이 $0$ 에 수렴하는 방향으로 update 될 것이다.

그 이유는 아래 그림을 참조하자.  
![[img-5b1a18a65b.png||600]]

여기서 의문이 생길 수 있다: learning rate $\alpha$ 값이 크다면 step size 가 커져서 $\theta_1$ 가 수렴하지 못할 텐데, $\theta_1$ 이 수렴하는 과정에서 $\alpha$ 값도 점점 줄여줘야 하는 것인가?

답: 적절한 $\alpha$ 값만 설정한다면, 그럴 필요 없다. 왜냐하면 $\theta_1$ 값이 수렴할수록, $\displaystyle\frac{\partial}{\partial\theta_1}$ 값도 0 에 가까워지므로 step size 가 감소한다.

![[img-85aeb131f5.png|img]]

# E) 예시

## E.1) Gradient Descent For Linear Regression

$h_\theta(x_i)=\theta_0+\theta_1x_i$ 의 비용 함수 $J(\theta_0,\theta_1)$ 을 이용하여 gradient descent 를 진행해보자. [[mean squared error|MSE]] 를 고려한 비용 함수 $J(\theta_0,\theta_1)$ 는 다음과 같다.

$$
\displaystyle J(\theta_0,\theta_1)=\frac{1}{2m}\sum^{m}_{i=1}(h_\theta(x_i)-y_i)^2
$$

그리고 $J(\theta_0,\theta_1)$ 에 적용되는 Gradient Descent 는 다음과 같다.

$$
\displaystyle\theta_j:=\theta_j-\alpha\frac{\partial}{\partial\theta_j}J(\theta_0,\theta_1)
$$

여기서 $\displaystyle J(\theta_0,\theta_1)=\frac{1}{2m}\sum^{m}_{i=1}(h_\theta(x_i)-y_i)^2$ 를 의미한다.

위 식을 풀어 쓰면 다음과 같다.
- $\displaystyle\theta_{0}:=\theta_{0}-\alpha\frac{1}{m}\sum_{i=1}^{m}\left(h_{\theta}\left(x_{i}\right)-y_{i}\right)$
- $\displaystyle\theta_{1}:=\theta_{1}-\alpha\frac{1}{m}\sum_{i=1}^{m}\left(\left(h_{\theta}\left(x_{i}\right)-y_{i}\right)\cdot x_{i}\right)$

# SGD

전체 데이터에 대한 gradient를 한번에 계산(i.e. batch GD)하지 않고 일부 example만 batch로 샘플링하여 계산하는 방식을 [[stochastic gradient descent]]라 한다.

이때 batch size $b=1$ 이면, 이를 online 또는 incremental learning이라고 부른다. 그리고 $m > b > 1$ 을 만족하는 경우는 mini-batch GD 라고 불리는데, 그냥 SGD로 혼용되어 불리기도 하는 것 같다.
## Mini-batch GD

Use $b$ examples in each iteration where $b<m$ is the mini-batch size (e.g. $b=10$ and $m=100$).

![[img-84bf335039.png||500]]

## Choosing Your Mini-batch Size
- 학습 데이터 개수가 작을 경우 (약 2000 이하), batch gradient descent를 사용
- 일반적인 mini-batch sizes: 64, 128, 256, 512, (가끔 1024)
- 추가로, 모든 mini-batch 사이즈가 CPU 또는 GPU 메모리에 들어가도록 할 것
# Related
[[Newton-Raphson method]]
[[Batch Gradient Descent]]
# References
