---
tags: ["calculus", "differentitation"]
aliases: ["그래디언트"]
---

# A) Gradient ?

임의의 함수에 대한 gradient 는 그 함수의 [[partial derivatives]] 함수들을 element 로 가지는 vector 를 의미한다.

즉, 어떤 함수 $f$ 에 대한 gradient 는 $\nabla f$ 로 표현하며, 이 nabla($\nabla$) 기호는 편미분 계수 (함수) 들을 포함하는 벡터라고 생각해도 된다는 것이다.

# B) 예시

$f(x, y) = x^2 \sin (y)$ 의 gradient 를 계산하면 다음과 같다.  

$$
\nabla f(x, y)=\left[\begin{array}{l}2 x \sin (y) \\ x^{2} \cos (y)\end{array}\right]
$$

# C) Geometric Interpretation of the Gradient

어떤 함수의 gradient 란, 그 함수에서 가장 가파르게 올라갈 수 있는 방향 (steepest ascent) 을 의미한다.

이를 벡터장으로 확인할 수 있는데, 벡터장의 각 벡터마다 그래프 꼭대기로 가장 빨리가는 방향을 알려주고 있는 것을 볼 수 있다.  
예시로, $f(x, y)=-\left(\cos ^{2} x+\cos ^{2} y\right)^{2}$ 에 대한 vector field 는 다음과 같다.

![|400](https://i.imgur.com/YrPneKP.png)  
(화살표가 짧을수록 경사가 완만하다는 의미다.)

## C.1) Gradient with Contour Maps

gradient 는 등고선에 항상 수직하다. 왜냐하면 어떤 등고선에서 그 다음 등고선까지 가기위해서 가장 가까운 방향은 그 등고선 사이를 직선으로 잇는 방향일 것이고, 그 방향은 gradient 이며 이는 곧 수직을 의미하기 때문이다.

# D) Cheat Sheet of Gradients

## D.1) Functions that Map Vectors to Scalars

$f:\mathbb{R}^{n}\rightarrow\mathbb{R}$ 인 경우에 대한 gradients

* $\displaystyle\frac{\partial\left(\boldsymbol{a}^{\top}\boldsymbol{x}\right)}{\partial\boldsymbol{x}}=\boldsymbol{a}$
* $\displaystyle\frac{\partial\left(\boldsymbol{b}^{\top}\mathbf{A}\boldsymbol{x}\right)}{\partial\boldsymbol{x}}=\mathbf{A}^{\top}\boldsymbol{b}$
* $\displaystyle\frac{\partial\left(\boldsymbol{x}^{\top}\mathbf{A}\boldsymbol{x}\right)}{\partial\boldsymbol{x}}=\left(\mathbf{A}+\mathbf{A}^{\top}\right)\boldsymbol{x}$

## D.2) Functions that Map Matrices to Scalars

$\displaystyle\frac{\partial\boldsymbol{a}^{\top}\boldsymbol{X}^{-1}\boldsymbol{b}}{\partial\boldsymbol{X}}=-\left(\boldsymbol{X}^{-1}\right)^{\top}\boldsymbol{a}\boldsymbol{b}^{\top}\left(\boldsymbol{X}^{-1}\right)^{\top}$

# E) References

* [[mathematics machine learning]]
* [[Probabilistic Machine Learning - An Introduction]] - 7.8.7
