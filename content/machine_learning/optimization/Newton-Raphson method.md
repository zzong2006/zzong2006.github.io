---
tags: ["machine_learning", "optimization"]
---

# 1. Newton-Raphson Method ?

Newton’s method 라고 불리기도 하며, 실수 함수의 approximate 한 해를 빠르게 찾는 방법이다.  
Newton-Raphson method 는 $f(x)$ 의 해를 찾기 위해 다음을 무한히 반복한다  

$$
\displaystyle x_{n+1}=x_{n}-\frac{f\left(x_{n}\right)}{f^{\prime}\left(x_{n}\right)}
$$

## 1.1. 식 유도

![|500](https://i.imgur.com/3AC7QfW.png)

Newton 방법은 실제로 생각해보면, 해를 구하려는 함수에 대해 접선을 가질 수 있는 해를 구하는것과 같다. 즉, 위 그림에서의 line 은 $y=f^{\prime}\left(x_{n}\right)\left(x-x_{n}\right)+f\left(x_{n}\right)$ 가 되며, $y=0$ 이고 $x=x_{n+1}$ 일 때 식을 풀면 $x_{n+1}=x_{n}-\frac{f\left(x_{n}\right)}{f^{\prime}\left(x_{n}\right)}$ 가 나온다.

이후 $x_{n+1}$ 에 대해서도 동일한 방식 (접선을 가질 수 있는 해를 구하는 과정) 을 계속 반복하다 보면 $f$ 에 대한 근사해를 구할 수 있게된다.

# 2. 예시

$f(x)=x^{2}-4x-7=0$, $f^{\prime}(x)=2x-4$ 의 $x=5$ 근처의 해를 찾아라.

## 2.1. 풀이

$x_{1}=5-\frac{5^{2}-4\times5-7}{2\times5-4}=5-\left(\frac{-2}{6}\right)=\frac{16}{3}\approx5.33333$  
$x_{2}=\frac{16}{3}-\frac{\left(\frac{16}{3}\right)^{2}-4\left(\frac{16}{3}\right)-7}{2\left(\frac{16}{3}\right)-4}=\frac{16}{3}-\frac{\frac{1}{9}}{\frac{20}{3}}=\frac{16}{3}-\frac{1}{60}=\frac{319}{60}\approx5.31667$  
$x_{3}=\frac{319}{60}-\frac{\left(\frac{319}{60}\right)^{2}-4\left(\frac{319}{60}\right)-7}{2\left(\frac{319}{60}\right)-4}=\frac{319}{60}-\frac{\frac{1}{3600}}{\frac{398}{60}}\approx5.31662$  

소수 넷째자리 이전까지는 해의 변화가 없으므로 충분히 가까운 해를 얻었다고 생각할 수 있다 ($5.31662^2-4*5.31662-7\approx-0.0003$).

# 3. As Optimization Algorithms

## 3.1. Gradient Descent 와 비교

gradient descent 는 기울기 정보 즉, 미분을 한 번만 한 값을 사용하는데, 만약 우리가 두 번 미분 (second-order) 한 값을 사용할 수 있다면 훨씬 훨씬 빠른 수렴속도를 보이는 algorithm 을 디자인할 수 있다.

Newton’s method 는 [[gradient descent]] 의 2nd derivative version 으로 훨씬 수렴성이 빠르다는 **장점**을 가지고 있지만, [[Hessian matrix]] 를 계산해야하기 때문에 computation 과 memory 측면에서 expensive 하다는 단점이 있다.

## 3.2. Second-order Method

뉴턴 방식은 second-order method 라고도 불리는데, 이는 [[Taylor Approximation|Taylor series]] 의 2 차 미분까지의 확장을 활용해서 point $\boldsymbol{\theta}_{0}$ 근처의 empirical risk $J(\boldsymbol{\theta})$ 를 근사화하는 방식이기 때문이다.  

$$
J(\boldsymbol{\theta}) \approx J\left(\boldsymbol{\theta}_{0}\right)+\left(\boldsymbol{\theta}-\boldsymbol{\theta}_{0}\right)^{\top} \nabla_{\boldsymbol{\theta}} J\left(\boldsymbol{\theta}_{0}\right)+\frac{1}{2}\left(\boldsymbol{\theta}-\boldsymbol{\theta}_{0}\right)^{\top} \boldsymbol{H}\left(\boldsymbol{\theta}-\boldsymbol{\theta}_{0}\right)
$$

* $\boldsymbol{H}$ 는 $J$ 를 $\boldsymbol{\theta}$ 에 대해 Hessian matrix 을 계산한 후, $\boldsymbol{\theta}_{0}$ 를 대입한 값을 의미한다.
* 이 Newton’s method 는 Hessian matrix $\boldsymbol{H}$ 가 [[positive definite]] 성질이 만족되어야만 사용할 수 있다는 조건이 붙는다.

이제 위 함수에 대한 critical point 를 구한다고 하면, 다음과 같은 parameter update rule 을 얻는다. 이 업데이트 방식을 반복함으로써 locally quadratic function $J$ 는 최소값을 가질 수 있게되는 것이다.

$$
\boldsymbol{\theta}^{*}=\boldsymbol{\theta}_{0}-\boldsymbol{H}^{-1} \nabla_{\boldsymbol{\theta}} J\left(\boldsymbol{\theta}_{0}\right)
$$

 ^e64b16

* $\boldsymbol{H}^{-1}$ 는 [[machine_learning/optimization/gradient]] 로 해석된다.

아래는 Newton’s method 를 적용하는 알고리즘을 나타낸다.  
![](https://i.imgur.com/76JP7sb.png)

## 3.3. For Deep Learning

일반적으로 deep learning 의 objective function 은 non-convex 하다. 즉, saddle point 가 많이 있을 수 있다는 의미도 되는데, 이는 뉴턴 방법이 적용되기 어렵게 만든다. 만약 Hessian 의 [[eigenvalue]] 가 항상 positive 하지 않다면 (e.g. saddle point 근처), 뉴턴 방법은 거의 잘못된 방향으로 업데이트를 진행할 것이다.

위 이슈를 해결하기 위해서 Hessian 에 [[regularization]] term $\alpha$ 을 추가하기도 한다. 이렇게 함으로써 eigenvalue 가 음의 값이 되는 것을 막아준다.  

$$
\boldsymbol{\theta}^{*}=\boldsymbol{\theta}_{0}-\left[H\left(f\left(\boldsymbol{\theta}_{0}\right)\right)+\alpha \boldsymbol{I}\right]^{-1} \nabla_{\boldsymbol{\theta}} f\left(\boldsymbol{\theta}_{0}\right)
$$

하지만 위의 이슈를 해결한다고 하더라도 더 큰 문제가 있다. 바로 계산 비용이 너무 크단는 것이다. Hessian 원소의 개수는 parameter 개수의 제곱인데, 신경망의 parameter 수가 일반적으로 백만정도가 되는 것을 생각해보면, 이를 빠르게 계산하는 것은 거의 불가능함을 알 수 있다.

아래는 이러한 계산 비용을 줄이면서 뉴턴 방식의 장점을 가져가려고 시도한 알고리즘들이다.

* [[conjugate gradients]]
* [[BFGS]]

# 4. Related

 * https://brilliant.org/wiki/newton-raphson-method/
 * http://sanghyukchun.github.io/63/
 * [[deep learning book]] - 8.6.1. Newton’s Method

# 5. References
