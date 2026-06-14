---
title: "interpolation"
tags: ["math"]
aliases: ["보간법"]
---

# A) Interpolation ?

Interpolation(인터폴레이션, 보간) 이란 알려진 지점의 값 사이 (중간) 에 위치한 값을 알려진 값으로부터 추정하는 것을 말한다.

예를 들어, 어떤 사람이 20 살일때 키와 40 살에서의 키를 보고 30 살에서의 키를 추측하는 것이다.

![|500](https://i.imgur.com/lTUkb6V.png)

# B) 1D Linear Interpolation

두 지점을 보간하는 방법은 polynomial 보간, spline 보간 등 여러 가지가 있으나 그 중 선형 보간법 (linear interpolation) 은 두 지점 사이의 값을 추정할 때 그 값을 두 지점과의 직선 거리에 따라 선형적으로 결정하는 방법이다.

두 지점 $x_1$, $x_2$ 에서의 데이터 값이 각각 $f(x_1)$, $f(x_2)$ 일 때, $x_1$, $x_2$ 사이의 임의의 지점 $x$ ($x_1≤x≤x_2$) 에서의 데이터 값 $f(x)$ 는 선형보간법을 사용할 경우 다음과 같이 계산된다.

$$
f(x)=\frac{d_{2}}{d_{1}+d_{2}} f\left(x_{1}\right)+\frac{d_{1}}{d_{1}+d_{2}} f\left(x_{2}\right)
$$

여기서 $d_1$ 은 $x$ 에서 $x_1$ 까지의 거리, $d_2$ 는 $x$ 에서 $x_2$ 까지의 거리를 의미한다.

![|300](https://i.imgur.com/bkT1TjD.png)

# C) Related

# D) References

* https://darkpgmr.tistory.com/117 (선형 보간법)
