---
title: "mean function"
tags: statistic 
aliases: []
---

# A) Mean Function ?

The mean function $\mu_{X}(t)$ of a random process $\{X(t)\}$ is a function that specifies the expected value at each time $t$

$$
\mu_{X}(t)\stackrel{\text{def}}{=}E[X(t)]
$$

# B) 예시

$$
X(t)=A\cos(2\pi f t)
$$

* $A$ 는 [[Binomial Distribution]] 을 따르고 $(n=5,p=0.5)$, $f=1$ 인 랜덤 변수 $X(t)$ 가 존재한다고 가정

모든 time step $t$ 의 expectation $E[X(t)]$ 은 함수 (mean function) 로 표현될 수 있다

$$
\begin{aligned}\mu_{X}(t)=E[X(t)]&=E[A\cos(2\pi f t)]\\&=E[A]\cos(2\pi f t)\\&=2.5\cos(2\pi f t)\end{aligned}
$$

mean function 을 그림으로 표현하자면 아래의 빨간 선과 같다.

![[img-cf0abcdcff.png|500]]

여러 파란선이 보이는 이유는 $A$ 가 binomial 분포를 따르기 때문이다.

# C) References

* https://dlsun.github.io/probability/mean-function.html
