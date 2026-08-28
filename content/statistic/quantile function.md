---
title: "quantile function"
tags: ["statistic"]
---

# 1. Quantile Function ?

quantile function 은 [[Cumulative Distribution Function|CDF]] 의 역함수를 의미하며, 어떤 분포의 함수 $F$ 에 대한 quantile function $Q$ 는 다음을 만족하는 $x$ 를 반환한다

$$
F_{X}(x):=\operatorname{Pr}(X\leq x)=p
$$

즉, CDF 에서는 랜덤 변수 $X$ 가 $x$ 보다 작을 확률을 의미했다면,

반대로 quantile 함수는 어떤 확률 $p$ 가 주어졌을 때, $p$ 에 해당하는 $x$ 를 찾아준다:

$$
F^{-1}(p)=x
$$

![|500](https://i.stack.imgur.com/SNViH.png)

# 2. Use-case

[[inverse tranform sampling]]

# 3. 예시

[[exponential distribution]] 의 CDF 는 다음과 같다.

$$
F(x;\lambda)=\begin{cases}1-e^{-\lambda x}&x\geq0\\0&x<0\end{cases}
$$

* 이 분포의 quantile 함수는 $x=Q$ 로 설정함으로써 얻을 수 있다: $1-e^{-\lambda Q}=p$
	* $\displaystyle Q(p;\lambda)=\frac{-\ln(1-p)}{\lambda},0\leq p<1$
* 그리고 각 quartiles 에 따른 결과는 다음과 같다.
	* first quartile ($p=1/4$): $-\ln(3/4)/\lambda$
		* 해석: exponential 분포에서 random sampling 한 값이 특정 값 $x$ 보다 작은데, 그 확률이 25% 를 만족하는 $x$ 의 값은? $x=-\ln(3/4)/\lambda$
	* median $(p=2/4)$: $-\ln(1/2)/\lambda$

# 4. Related

# 5. References

* https://stats.stackexchange.com/questions/212813/help-me-understand-the-quantile-inverse-cdf-function
* https://en.wikipedia.org/wiki/Quantile_function
