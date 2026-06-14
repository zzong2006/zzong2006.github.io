---
tags: ["statistic", "bayesian"]
---

# A) Bayes Theorem ?

베이즈 이론 (Bayes theorem) 은 어떤 이벤트가 발생할 확률을 해당 이벤트와 관련될 법한 사전 지식 (prior) 에 의거해 설명하는 방법이다.

$$
\displaystyle P(A\mid B)=\frac{P(B\mid A)P(A)}{P(B)}=\frac{P(A,B)}{P(B)}=\frac{P(A\mid B)P(B)}{P(A)}
$$

**가정**: $A$ 와 $B$ 는 서로 다른 이벤트이고, $P(B)\neq0$

# B) Notations

* $P(A\mid B)$ 는 $B$ 가 발생했을 때 $A$ 가 발생할 조건부 확률: [[posterior]]
	* 다른 말로 하면, $B$ 가 True 일 때, $A$ 의 posterior probability (사후 확률)
* $P(B\mid A)$ 도 $A$ 가 발생했을 때 $B$ 가 발생할 조건부 확률: [[likelihood]]
	* 다른 말로 하면, $A$ 의 likelihood (우도)
		* $P(B\mid A)=L(A\mid B)$
		* 주로 $A$ 는 data, $B$ 는 latent variables 로 해석한다.
* $P(A)$ 와 $P(B)$ 는 어떠한 조건도 주어지지 않을 때 순전히 $A$ 와 $B$ 가 각각 관찰된 확률:
	* $P(A)$ 는 prior
		* it is critical to ensure that the [[prior]] has a nonzero PDF (or PMF) on all plausible $A$, even if they are very rare.
	* $P(B)$ 는 evidence 또는 marginal likelihood
		* $P(B):=\int P(B\mid A)p(A)\mathrm{d}A=\mathbb{E}_{X}[P(B\mid A)]$
		* $A$ 에 대해 독립이며, expected likelihood 로 해석할 수 있다.
		* 적분때문에 evidence 는 종종 계산하기 어렵다.

Bayes theorem with multiple conditions ([refer link](https://math.stackexchange.com/questions/408774/bayes-rule-with-multiple-conditions))

$$
\begin{aligned}P((a,z)\mid b)&=\frac{P(a,z,b)}{P(b)}=\frac{P(z,b)P(a\mid(z,b))}{P(b)}\\&=\frac{P(b)P(z\mid b)P(a\mid(z,b))}{P(b)}=P(z\mid b)P(a\mid(z,b))\end{aligned}
$$

위 예시에서 $P(a,z,b)$ 를 $P(b)P(z\mid b)P(a\mid(z,b))$ 로 유도하기 위해 단순히 [[chain rule (probability)]] 을 사용할 수 있다.

# C) Some Notes

$P(B\mid A)P(A)=P(A,B)=P(A\mid B)P(B)$ 인 이유: [[product rule]]

# D) Related

# E) References
