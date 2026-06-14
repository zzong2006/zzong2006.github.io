---
tags: ["math"]
---

# A) Gaussian Integral ?

## A.1) 정의

Euler–Poisson integral (엘룰러 - 푸아송 적분) 이라고 부르기도 하며, 다음과 같은 적분을 의미한다

$$
\displaystyle\int_{-\infty}^{\infty}e^{-x^{2}}dx=\sqrt{\pi}
$$

    - 일반적인 form은 다음과 같다: $\displaystyle\int_{-\infty}^{\infty}e^{-a(x+b)^{2}}dx=\sqrt{\frac{\pi}{a}}$

증명: 극좌표 (polar coordinates) 를 활용한 증명

$$
\displaystyle\left(\int_{-\infty}^{\infty}e^{-x^{2}}dx\right)^{2}=\int_{-\infty}^{\infty}e^{-x^{2}}dx\int_{-\infty}^{\infty}e^{-y^{2}}dy=\int_{-\infty}^{\infty}\int_{-\infty}^{\infty}e^{-\left(x^{2}+y^{2}\right)}dxdy
$$

$e^{-\left(x^{2}+y^{2}\right)}=e^{-r^{2}}$ 를 고려하면, 다음과 같이 전개된다.

$$
\begin{aligned}&\iint_{\mathbb{R}^{2}}e^{-\left(x^{2}+y^{2}\right)}dxdy\\&=\int_{0}^{2\pi}\int_{0}^{\infty}e^{-r^{2}}rdrd\theta\\&=2\pi\int_{0}^{\infty}re^{-r^{2}}dr\\&=2\pi\int_{-\infty}^{0}\frac{1}{2}e^{s}ds\quad s=-r^{2}\\&=\pi\int_{-\infty}^{0}e^{s}ds\\&=\pi\left(e^{0}-e^{-\infty}\right)\\&=\pi\end{aligned}
$$

즉, $\left(\int_{-\infty}^{\infty}e^{-x^{2}}dx\right)^{2}=\pi$ 이므로, $\int_{-\infty}^{\infty}e^{-x^{2}}dx=\sqrt{\pi}$ 이다.

# B) Related

# C) References

https://en.wikipedia.org/wiki/Gaussian_integral
