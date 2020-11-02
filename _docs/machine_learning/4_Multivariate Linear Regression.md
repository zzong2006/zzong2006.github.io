---
layout: default
title:  "Multivariate Linear Regression"
category: Machine Learning
order: 4
---

* 여러개의 variables을 가지고 Linear regression 하는 것

* $n+1$개의 feature가 존재할 때, 모델 $h_\theta(x)$는 다음과 같이 표현됨


$$
  h_\theta(x)=\theta_0+\theta_1x_1+\theta_2x_2+\theta_3x_3+\cdots+\theta_nx_n
$$

* 그리고 위의 식은 행렬 곱(matrix multiplication)으로 표현될 수 있음


$$
h_{\theta}(x)=\left[\begin{array}{llll}
\theta_{0} & \theta_{1} & \ldots & \theta_{n}
\end{array}\right]\left[\begin{array}{c}
x_{0} \\
x_{1} \\
\vdots \\
x_{n}
\end{array}\right]=\theta^{T} x
$$

  * 위의 식은 한개의 training example ($x^{(i)}$) 에 대한 추론 함수 $h_\theta(x)$의 **vectorization** 이라 부름

## Gradient Descent For Multiple Variables

* 단일 variable 또는 두개의 variable을 가질때의 gradient descent와 비슷하다.
* gradient descent for two parameters: $\theta_1, \theta_2$

$$
\begin{aligned}
&\text { repeat until convergence: } \{\\
&\theta_{0}:=\theta_{0}-\alpha \frac{1}{m} \sum_{i=1}^{m}\left(h_{\theta}\left(x_{i}\right)-y_{i}\right) \\
&\theta_{1}:=\theta_{1}-\alpha \frac{1}{m} \sum_{i=1}^{m}\left(\left(h_{\theta}\left(x_{i}\right)-y_{i}\right) \cdot x_{i}\right) \\
\}
\end{aligned}
$$

* gradient descent for $n+1$ parameters: $\theta_0 $ ~ $\theta_n$

$$
\begin{aligned}
&\text { repeat until convergence: } \{\\
&\theta_{0}:=\theta_{0}-\alpha \frac{1}{m} \sum_{i=1}^{m}\left(h_{\theta}\left(x^{(i)}\right)-y^{(i)}\right) \cdot x_{0}^{(i)}\\
&\theta_{1}:=\theta_{1}-\alpha \frac{1}{m} \sum_{i=1}^{m}\left(h_{\theta}\left(x^{(i)}\right)-y^{(i)}\right) \cdot x_{1}^{(i)}\\
&\theta_{2}:=\theta_{2}-\alpha \frac{1}{m} \sum_{i=1}^{m}\left(h_{\theta}\left(x^{(i)}\right)-y^{(i)}\right) \cdot x_{2}^{(i)} \\
\}
\end{aligned}
$$



* 위를 정리하면 아래와 같다.

$$
\begin{aligned}
&\text { repeat until convergence: }\\
&\theta_{j}:=\theta_{j}-\alpha \frac{1}{m} \sum_{i=1}^{m}\left(h_{\theta}\left(x^{(i)}\right)-y^{(i)}\right) \cdot x_{j}^{(i)}\\
&\text { for } \mathrm{j}:=0 \ldots \mathrm{n}
\end{aligned}
$$

## Gradient Descent in Practice I - Feature Scaling

Feature scaling(또는 normalization)은 입력 데이터의 각 차원 간 값의 범위가 rough하게 비슷하게 만드는 방법을 뜻한다.

Feature scaling을 이용하면 gradient descent의 속도를 향상 시킬 수 있다.

Andrew Ng에 의하면, 입력 데이터 $x_i$에 대한 값의 범위는 $-3 \le x_i\le3$ 또는 $-0.33 \le x_i \le 0.33$ 의 범위를 추천한다고 한다.

### Z-Score Normalization

$$
x_i=\frac{x_i-\mu_i}{\sigma_i}
$$

* $\mu_i$는 $i$ 번째 차원 데이터 값의 평균, 그리고 $\sigma_i$는 $i$번째 차원 데이터 값의 표준 편차
  * 표준 편차 구하는 법: $\sigma=\sqrt{\frac{1}{N-1} \sum_{i=1}^{N}(x_{i}-\mu_i)^{2}}$ ($N$은 sample 개수)

장점 및 단점: outlier를 잘 처리하지만, 모든 차원 간 데이터 값의 간격이 동일하지는 않다.

<img src="https://i.loli.net/2020/10/17/3SIZw4aopmRD6JU.png" alt="img" style="zoom:67%;" />

### Min-max normalization

$$
x_i =\frac{x_i-min(X)}{max(X)-min(X)}
$$

* $X$는 모든 features($x_i$)들의 집합

장점 및 단점: 모든 feature들의 스케일이 동일하지만, outlier를 잘 처리하지 못한다.

<img src="https://i.loli.net/2020/10/17/q86ZcBHiJLeKyt2.png" alt="img" style="zoom:67%;" />

### 왜 Feature Scaling 또는 Normalization을 할까?

모델의​ 학습 속도가 빨라지기 때문이다.

다음과 같은 Loss Function의 경우, 2차원으로 contour map을 간단히 표현할 수 있다.

$$
J(w, b)=\frac{1}{m} \sum_{i=1}^{m} \mathcal{L}\left(\hat{y}^{(i)}, y^{(i)}\right)
$$

![image-20201028212048707](https://i.loli.net/2020/10/28/GxXcpEnhYSJuBAU.png)

* 그림에서 보다시피, normalization이 수행되지 않은 경우는 loss function의 값이 특정 feature에 따라 큰 영향을 받을 수 있기 때문에, gradient descent 중에 loss 값이 oscillating 할 가능성이 높다. 즉, 학습 시간이 오래 걸린다.



## Gradient Descent in Practice II - Learning Rate

학습률 $\alpha$를 적절하게 정하는 것이 중요하다. 
* 적절한 $\alpha$는 반드시 비용 함수 $J(\theta)$ 를 수렴하게 만든다.
* 일반적으로 매 반복(iteration) 마다 $J(\theta)$ 값이 $10^{-3}$ 이하 만큼 줄어들면 수렴한다고 한다.

만약, $\alpha$값이 너무 작다면, 천천히 수렴할 것이다.

그렇다고 $\alpha$ 값이 너무 크다면, 학습을 반복할 때 마다, 비용 함수 $J(\theta)$ 값이 줄어들지 않을 수 있다. 즉, 수렴하지 않을 것이다.

## Features and Polynomial Regression

어떻게 하면 다항식(polynomial), 즉, 2차 또는 3차 함수를 데이터 맞게 표현할 수 있을까?

*  만약 입력 값 $x$ 이 평수이고, 출력 값 $y$가 집값인 데이터가 있다고 가정하자.   
  2차 함수를 이용하면 아래와 같은 데이터를 표현하기 힘들다. 왜냐하면 크기가 커지면 당연히 값은 오르기 때문이다.  

  3차 함수 (초록색 박스)를 이용하면 좀 더 잘 표현할 수 있다.

  ![image-20200923232116390](https://i.loli.net/2020/09/23/QlR7Va1OX6vmCtS.png)


feature는 size 하나인데, 다항식 $h_\theta(x)=\theta_0+\theta_1x_1+\theta_2x^2_1+\theta_3x^3_1$는 어떻게 표현될 수 있을까? 

* 하나의 feature를 제곱하는 형식을 이용하자. $(size), (size)^2,(size)^3$ 이렇게...

* 주의할 점은 이 경우에 feature scaling이 필수적이라는 것이다.   

  > if $x_1$ has range 1 - 1000 then range of $x_1^2$ becomes 1 - 1000000 and that of $x_1^3$ becomes 1 - 1000000000

이런 식의 함수도 가능하다: $h_\theta(x)=\theta_0+\theta_1x_1+\theta_2\sqrt{x_1}$

