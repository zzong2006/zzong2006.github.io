---
title: "normalizing constant"
tags: ["math", "statistic"]
aliases: ["normalization coefficient", "정규화 상수"]
---

# Normalizing Constant ?

normalizing constant (정규화 상수) 는 어느 확률 분포를 총 합이 $1$ 인 pdf 로 만들기 위해 사용하는 상수를 의미한다.

# 예시

어느 가우시안 함수 $p(x)=e^{-x^{2}/2},x\in(-\infty,\infty)$ 를 고려해보자.

[가우시안 적분]([[gaussian integral]]) 을 적용하면 $\int_{-\infty}^{\infty}p(x)dx=\int_{-\infty}^{\infty}e^{-x^{2}/2}dx=\sqrt{2\pi}$ 총 합이 $1$ 이 아니다.

다음과 같은 함수는 적분 값이 $1$ 이다: $\varphi(x)=\frac{1}{\sqrt{2\pi}}p(x)=\frac{1}{\sqrt{2\pi}}e^{-x^{2}/2}$

$$
\int_{-\infty}^{\infty}\varphi(x)dx=\int_{-\infty}^{\infty}\frac{1}{\sqrt{2\pi}}e^{-x^{2}/2}dx=1
$$

여기서 $\displaystyle\frac{1}{\sqrt{2\pi}}$ 를 함수 $p(x)$ 의 normalizing constant 라고 한다.

# References

* https://en.wikipedia.org/wiki/Normalizing_constant
