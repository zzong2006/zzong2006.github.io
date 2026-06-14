---
title: "tangent plane"
tags: ["differentitation", "calculus"]
aliases: ["접평면"]
---

# Tangent Plane ?

그래프와 접하는 평면을 의미한다.

![|400](https://i.imgur.com/L1YhKRi.png)

# Tagent Plane 찾기

$(x', y', z')$ 를 지나는 접평면 $L$ 은 다음과 같은 성질을 지닌다.

1. $L(x', y') = z'$ 를 만족한다.
2. 어떤 차원에 평행한 평면과 접평면이 교차할 경우 생겨나는 선의 기울기는 항상 일정하다. 예를 들어, $\partial{L}/\partial{x}=a$ 를 만족한다 ($a$ 는 const).
3. 위 성질은 접평면과 만나는 point 에서 그래프 $f$ 에 대한 [[partial derivatives]] 를 계산할 경우, 동일한 상수값을 가질 수 있다는 의미가 된다. 즉, $\frac{\partial f}{ \partial x} (x', y') =a$ 를 만족한다.

위 두가지 성질을 이용하면 다음과 같은 선형 접평면 함수를 구할 수 있다.

$$
\begin{aligned} L(x, y) &=a x+b y+c \\ &=a(x-x')+b(y-y') + z'\end{aligned}
$$

* $\partial L / \partial y=b$ 를 의미하며, $c$ 는 상수 (이 상수는 성질 (1) 을 활용해서 찾을 수 있다).

# Related

# References

* [칸 아카데미: Tangent planes and local linearization](https://www.khanacademy.org/math/multivariable-calculus/applications-of-multivariable-derivatives)
