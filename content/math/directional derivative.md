---
title: "directional derivative"
tags:
  - calculus
  - differentitation
aliases: ["방향도함수"]
---

# Directional Derivative ?

미분 가능한 다변수 함수에 대한 directional derivative 는 어떤 point 에서 vector 에 대해 계산할 수 있다. 즉, point $\mathbf{x}$ 에서 vector $\mathbf{v}$ 에 대한 directional derivative 는 다음과 같다.  

$$
\nabla_{\mathbf{v}} f(\mathbf{x})=\mathbf{v} \cdot \nabla f(\mathbf{x})=\mathbf{v} \cdot \frac{\partial f(\mathbf{x})}{\partial \mathbf{x}}
$$

쉽게 생각하면 이런 의미를 가진다: input point $\mathbf{x}$ 에서 vector $\mathbf{v}$ 의 방향으로 아주 조금 움직였다고 한다면, 함수 $f$ 의 output 은 어떻게 영향을 받아서 변할 것인가?

# 정의

다음과 같은 함수 $f(\mathbf{x})=f\left(x_{1}, x_{2}, \ldots, x_{n}\right)$ 를 벡터 $\mathbf{v}=\left(v_{1}, \ldots, v_{n}\right)$ 에 따라서 $\nabla_{\mathbf{v}} f$ 를 구할 때, limit 를 활용하여 정의하자면 다음과 같다.  

$$
\nabla_{\mathbf{v}} f(\mathbf{x})=\lim _{h \rightarrow 0} \frac{f(\mathbf{x}+h \mathbf{v})-f(\mathbf{x})}{h}
$$

# Gradient 와의 관계

directional derivative 는 vector $\mathbf{v}$ 와 [[machine_learning/gradient]] $\nabla f(\mathbf{x})$ 의 [[dot product|내적]] 을 의미한다: $\mathbf{v} \cdot \nabla f(\mathbf{x})$

여기서 gradient 가 왜 가장 가파르게 올라가는 방향임을 알 수 있는데, 방향도함수가 최대가 되기 위해서는 gradient 와 vector 간 방향이 동일해야 하기 때문이다 (내적이므로).

그리고 gradient 의 크기 $|| \nabla f ||$ 는 gradient 방향으로 이동했을 때, 함수 $f$ 의 변화율을 나타낸다. 왜냐하면 방향도함수가 최대가 되는 경우, $\mathbf{v} \cdot \nabla f(\mathbf{x})=|| \nabla f ||$ 이기 때문이다 (vector 는 unit vector 를 가정함).

# References

* https://en.wikipedia.org/wiki/Directional_derivative
