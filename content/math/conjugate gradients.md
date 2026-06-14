---
title: "conjugate gradients"
tags: ["optimization", "numerical_method"]
---

# Conjugate Gradients ?

conjugate gardients 는 [[Newton-Raphson method]] 방식에서 파생된 [[Hessian matrix]] 의 inverse 계산을 효율적으로 피하기 위해 고안된 방법으로, conjugate directions 을 반복적으로 줄이는 (descending) 방식으로 진행한다.

$$
\boldsymbol{d}_{t}=\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta})+\beta_{t} \boldsymbol{d}_{t-1}
$$

![|600](https://i.imgur.com/donecPI.png)

# Nonlinear Conjugate Gradients

# Related

# References

* [[deep learning book]] - 8.6.2 Conjugate Gradients
* https://en.wikipedia.org/wiki/Conjugate_gradient_method
