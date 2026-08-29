---
title: "partial derivatives"
tags:
  - differentitation
  - calculus
aliases: []
---

# 1. Partial Derivatives ?

특정 차원에 해당하는 변수 $x$ 의 작은 입력값 변화 $\partial x$ 에 따른 함수의 작은 출력값의 변화 $\partial f$ 를 의미: $\displaystyle \frac{\partial f}{\partial x}$

## 1.1. 2 차원에서의 정의

limit definition of a partial derivative  

$$
\frac{\partial f}{\partial x}(a, b)=\lim _{h \rightarrow 0} \frac{f(a+h, b)-f(a, b)}{h}
$$

$$
\frac{\partial f}{\partial y}(a, b)=\lim _{h \rightarrow 0} \frac{f(a, b+h)-f(a, b)}{h}
$$

# 2. Symmetry of Second Partial Derivatives

다변수 함수에 대한 이차 미분을 계산할 경우, 순서는 상관없이 동일한 결과를 얻을 수 있다. 즉, 다음과 같다.  

$$
\frac{\partial^{2} f}{\partial x \partial{y}}=\frac{\partial^{2} f}{\partial y \partial{x}}
$$

# 3. Graph 로 해석하는 Partial Derivatives

2 차원 point $(2, 0)$ 을 예시로 보면 다음과 같다. 만약 우리가 $\displaystyle \frac{\partial f}{\partial x}$ 가 궁금한 경우 $y$ 는 상수라고 생각하기 때문에, 함수 $f$ 와 $y=0$ 인 평면이 만나는 선에 대한 기울기를 partial derivative 라 생각할 수 있다.

![](https://i.imgur.com/uKP0dBW.png)

# 4. Related

# 5. References
