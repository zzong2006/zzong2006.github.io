---
tags: ["statistic"]
aliases: ["기댓값", "기대값", "expected value"]
---

# 1. Expectation ?

분포의 중심이 되는 값이다.

[[Probability Theory]] 에서, 랜덤 변수 $X$ 에 대한 expected value 는 $E(X)$ 또는 $E[X]$ 로 표기된다.

* discrete random variable $X\sim p(x)$
* Let $X$ be a random variable with a finite number of finite outcomes $x_{1},x_{2},\ldots,x_{k}$ occurring with probabilities $p_{1},p_{2},\ldots,p_{k}$, respectively.
* The expectation of $X$ is defined as
	* $\displaystyle\mathrm{E}[X]=\sum_{i=1}^{k}x_{i}p_{i}=x_{1}p_{1}+x_{2}p_{2}+\cdots+x_{k}p_{k}$

## 1.1. 예시

Let $X$ represent the outcome of a roll of a fair six-sided die. More specifically, $X$ will be the number of pips showing on the top face of the die after the toss.

* The possible values for $X$ are 1, 2, 3, 4, 5, and 6, all of which are equally likely with a probability of $1/6$ .
* The expectation of $X$ is $\mathrm{E}[X]=1\cdot\frac{1}{6}+2\cdot\frac{1}{6}+3\cdot\frac{1}{6}+4\cdot\frac{1}{6}+5\cdot\frac{1}{6}+6\cdot\frac{1}{6}=3.5$
* univariate continuous random variable
	* $\displaystyle\mathbb{E}_{X}[g(x)]=\int_{\mathcal{X}}g(x)p(x)\mathrm{d}x$
* Remark
	* When the random variable associated with the expectation or covariance is clear by its arguments, the subscript is often suppressed (for example $\mathbb{E}_{X}[x]$ is often written as $\mathbb{E}[x]$).

# 2. Basic Property

## 2.1. Linearity of Expectation

for any random variables $X$ and $Y$, 그리고 상수 $a$ 에 대하여 다음을 만족한다.

* $\mathrm{E}[X+Y]=\mathrm{E}[X]+\mathrm{E}[Y]$
* $\mathrm{E}[aX]=a\mathrm{E}[X]$
* $E(a+b Y)=a+b E(Y)$

## 2.2. Non-multiplicativity

일반적으로, $\mathrm{E}[XY]$ 가 꼭 $\mathrm{E}[X]\cdot\mathrm{E}[Y]$ 와 같진 않다. 그러나 만약 $X$ 와 $Y$ 가 독립이라면, $\mathrm{E}[XY]=\mathrm{E}[X]\mathrm{E}[Y]$ 을 만족한다.

# 3. Uses and Applications

기댓값은 [[variance]] 를 계산하는데 활용할 수 있다.  

$$
\operatorname{Var}(X)=\mathrm{E}\left[X^{2}\right]-(\mathrm{E}[X])^{2}
$$

# 4. Related

# 5. References

* https://danielkhashabi.com/learn/ep.pdf
