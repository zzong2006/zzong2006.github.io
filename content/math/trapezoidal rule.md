---
tags: ["formula"]
aliases: ["사다리꼴 공식"]
---

# A) Trapezoidal Rule 소개

수치 해석에서 사다리꼴 공식 (trapezoidal rule) 은 정적분을 근사하는 한 수치적분 방법이다.

사다리꼴 공식은 적분이 나타내는 넓이를 일련의 사다리꼴들의 넓이의 합으로 근사한다.

![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FBhw6tooX2H.png?alt=media&token=1128b253-f9be-4c5b-bffd-eca90a79b290)

# B) 정의

$f:\left[t_{0},t_{N}\right]\rightarrow\mathbb{R}$ 에 대한 적분은 $\displaystyle F=\int_{t_{0}}^{t_{N}}f(x)\mathrm{d}x$ 이다.

이때, trapezoidal rule 은 다음과 같다.

$$
\displaystyle\tilde{F}=\sum_{i=0}^{N-1}\frac{\left(t_{i+1}-t_{i}\right)\left(f\left(t_{i+1}\right)+f\left(t_{i}\right)\right)}{2}
$$

$N=1$ 인 경우는 다음과 같다.

$$
\displaystyle\tilde{F}=\frac{\left(t_{1}-t_{0}\right)\left(f\left(t_{1}\right)+f\left(t_{0}\right)\right)}{2}
$$

# C) Application

## C.1) Computing the [[posterior]] Distribution Using a Numerical Method

marginal probability 계산은 다음과 같다.

$$
p(\mathcal{D})=\int p(\mathcal{D}\mid\boldsymbol{w})p(\boldsymbol{w})dw
$$

이때, $\boldsymbol{w}$ 공간 위에 있는 joint density $p(\mathcal{D},\boldsymbol{w})=p(\mathcal{D}\mid\boldsymbol{w})p(\boldsymbol{w})$ 는 다음과 같이 근사할 수 있다.

$$
\displaystyle\int p(\mathcal{D}\mid\boldsymbol{w})p(\boldsymbol{w})d\boldsymbol{w}\approx\delta^{d}*\sum_{\boldsymbol{w}\in W_{GRID}}p(\mathcal{D}\mid\boldsymbol{w})p(\boldsymbol{w})
$$

* $\boldsymbol{W}_{GRID}$ 는 $\boldsymbol{w}$ 공간을 [[discretization]] 하여 weight vectors 의 집합으로 치환한 것을 의미한다.
* $\delta$ 는 discretization 내 points 간 간격을 의미하며, $d$ 는 $\boldsymbol{w}$ 공간의 차원을 의미한다.
* 일반적으로 차원 수 $d$ 가 커질수록 이러한 numerical integration 은 intractable 하게 된다.
