---
aliases: ["Taylor series"]
---

# A) Taylor Approximation ?

테일러 급수 (Taylor series) 또는 테일러 전개 (Taylor expansion) 는 어떤 미지의 함수 $f(x)$ 를 아래 식과 같이 근사 다항함수로 표현하는 것을 말합니다.

$$f(x)=p_{\infty}(x)$$

$$\begin{aligned}p_{n}(x)&=f(a)+f^{\prime}(a)(x-a)+\frac{f^{\prime\prime}(a)}{2!}(x-a)^{2}+\cdots+\frac{f^{(n)}(a)}{n!}(x-a)^{n}\\&=\sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}(x-a)^{k}\end{aligned}$$

* 주의해야 될 사항은 좌변과 우변이 모든 $x$ 에 대해 같은 것이 아니라 $x=a$ 근처에서만 성립한다는 점입니다.
* 즉, $x$ 가 $a$ 에서 멀어지면 멀어질수록 $f(x)=p(x)$ 로 놓는 것은 큰 오차를 갖게 됩니다.

테일러 급수는 결국 $x=a$ 에서 $f(x)$ 와 동일한 미분계수를 갖는 어떤 다항함수로 $f(x)$ 를 근사시키는 것입니다.
* 위 식에서 $f(a)=p(a),f'(a)=p'(a),f''(a)=p''(a),…$ 임은 쉽게 확인할 수 있을 것입니다.

# B) 테일러 급수가 필요한 이유?

우리가 잘 모르거나 복잡한 함수를 다루기 쉽고 이해하기 쉬운 다항함수로 대체시키기 위함입니다. 또한 어떤 함수를 테일러 급수로 표현하면 그 함수의 특성을 분석하기가 좀더 용이해지기 때문입니다.

## B.1) 예시

$$
\displaystyle\int_{0}^{1}\sin\left(x^{2}\right)dx=\int_{0}^{1}\left(x^{2}-\frac{x^{6}}{3!}+\frac{x^{10}}{5!}-\cdots\right)dx
$$

# C) Taylor’s Theorem

테일러 정리는 $n$ 번 미분가능한 함수 $f(x)$ 에 대해 $\displaystyle f(x)=f(a)+f^{\prime}(a)(x-a)+\cdots+\frac{f^{(n)}(a)}{n!}(x-a)^{n}+h_{n}(x)(x-a)^{n}$ 그리고 $\lim_{x\rightarrow a}h_{n}(x)=0$ 를 만족하는 실함수 $h(x)$ 가 반드시 존재한다는 것을 의미한다.

이 때, $h(x)(x-a)^n$ 은 근사오차를 나타낸다.

즉, 테일러 정리 (Taylor’s theorem) 는 어떤 함수를 유한차수 ($n$ 차) 의 다항함수로 근사시킬 수 있는 수학적 근거를 제공합니다. 

# E) References

* https://darkpgmr.tistory.com/59
