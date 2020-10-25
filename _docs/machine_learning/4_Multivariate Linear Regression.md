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

* Feature scaling는 입력 값들이 rough하게 비슷한 범위의 값들을 가지게 만드는 방법을 뜻한다.

* Feature scaling을 이용하면 gradient descent의 속도를 향상 시킬 수 있다.

* 입력 데이터 $x_i$에 대해, $x_i$의 모든 값들의 평균이 $\mu_i$ 이고, (max-min) 값 또는 표준 편차(standard deviation)값이 $s_i$ 라면, feature scaling 또는 mean normalization의 방법은 다음과 같다.
  $$
  x_i :=\frac{x_i-\mu_i}{s_i}
  $$

  * 물론 $s_i$가 (max-min) 값인지 표준 편차인지에 따라 feature scaling 결과는 다르다.
  * Andrew Ng에 의하면, 입력 데이터 $x_i$에 대한 값의 범위는 $-3 \le x_i\le3$ 또는 $-0.33 \le x_i \le 0.33$ 의 범위를 추천한다고 한다.
  
* z-score

  * $$
    x_i=\frac{x_i-\mu_i}{\sigma_i}
    $$

  * outlier를 잘 처리하지만, 정확히 동일한 척도로 정규화 된 데이터를 생성하지는 않는다.

  * ![img](https://i.loli.net/2020/10/17/3SIZw4aopmRD6JU.png)

### Feature Scaling

* Scaling은 normalization과 다르다.

* min-max

  * $$
    x_i =\frac{x_i-min(X)}{max(X)-min(X)}
    $$

  * $X$는 모든 features($x_i$)들의 집합

  * 모든 feature들의 스케일이 동일하지만, outlier를 잘 처리하지 못한다.

  * ![img](https://i.loli.net/2020/10/17/q86ZcBHiJLeKyt2.png)

## Gradient Descent in Practice II - Learning Rate

* 학습률 $\alpha$를 적절하게 정하는 것이 중요하다. 
  * 적절한 $\alpha$는 반드시 비용 함수 $J(\theta)$ 를 수렴하게 만든다.
  * 일반적으로 매 반복(iteration) 마다 $J(\theta)$ 값이 $10^{-3}$ 이하 만큼 줄어들면 수렴한다고 한다.
* 만약, $\alpha$값이 너무 작다면, 천천히 수렴할 것이다.
* 그렇다고 $\alpha$ 값이 너무 크다면, 학습을 반복할 때 마다, 비용 함수 $J(\theta)$ 값이 줄어들지 않을 수 있다. 즉, 수렴하지 않을 것이다.

## Features and Polynomial Regression

* 어떻게 하면 다항식(polynomial), 즉, 2차 또는 3차 함수를 데이터 맞게 표현할 수 있을까?

  *  만약 입력 값 $x$ 이 평수이고, 출력 값 $y$가 집값인 데이터가 있다고 가정하자.   
    2차 함수를 이용하면 아래와 같은 데이터를 표현하기 힘들다. 왜냐하면 크기가 커지면 당연히 값은 오르기 때문이다.  

    3차 함수 (초록색 박스)를 이용하면 좀 더 잘 표현할 수 있다.

    ![image-20200923232116390](https://i.loli.net/2020/09/23/QlR7Va1OX6vmCtS.png)

  * feature는 size 하나인데, 다항식 $h_\theta(x)=\theta_0+\theta_1x_1+\theta_2x^2_1+\theta_3x^3_1$는 어떻게 표현될 수 있을까? 

    * 하나의 feature를 제곱하는 형식을 이용하자. $(size), (size)^2,(size)^3$ 이렇게...

    * 주의할 점은 이 경우에 feature scaling이 필수적이라는 것이다.   

      > if $x_1$ has range 1 - 1000 then range of $x_1^2$ becomes 1 - 1000000 and that of $x_1^3$ becomes 1 - 1000000000

  * 이런 식의 함수도 가능하다: $h_\theta(x)=\theta_0+\theta_1x_1+\theta_2\sqrt{x_1}$

  