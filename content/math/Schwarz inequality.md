---
title: "Schwarz inequality"
tags: linear_algebra 
aliases: ["슈바르츠 부등식"]
---

# Schwarz Inequality ?

$$
|\boldsymbol{v}\cdot\boldsymbol{w}|\leq\|\boldsymbol{v}\|\|\boldsymbol{w}\|
$$

위 식은 두 unit vectors $\boldsymbol{v}/\|\boldsymbol{v}\|$ 와 $\boldsymbol{w}/\|\boldsymbol{w}\|$ 의 내적이 절대 1 을 넘지 않는다는 관찰에 의해 세워진 부등식이다.

이 식을 통해 “geometric mean $\leq$ Arithmetic mean” 을 표현할 수 있다.

(유도 과정) 두 벡터 $\boldsymbol{v}=(a,b)$ 와 $\boldsymbol{w}=(b,a)$ 가 있을 때, 슈바르츠 부등식에 의해 $2\boldsymbol{a}\boldsymbol{b}\leq\boldsymbol{a}^{2}+\boldsymbol{b}^{2}$ 를 만족한다. 여기서 $x=a^{2}$ 그리고 $y=b^{2}$ 와 같이 치환하면, geometric mean 인 $\sqrt{xy}$ 는 arithmetic mean 인 $\frac{1}{2}(x+y)$ 를 절대 넘지 않는다.

$$
\displaystyle\sqrt{xy}\leq\frac{x+y}{2}
$$

# References
