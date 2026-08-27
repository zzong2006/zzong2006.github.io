---
tags: ["statistic"]
---

# A) Independence (probability) ?

* Related
	* Marginal independence
	* Conditional independence
* 정의
	* That is, knowledge of $Y$’s value doesn’t affect your belief in the value of $X$, given a value of $Z$.
	* Variables $A$ and $B$ are independent if any of the following hold:
		* $\mathrm{P}(A\mid\mathrm{B})=\mathrm{P}(A)$
		* $\mathrm{P}(\mathrm{A},\mathrm{B})=\mathrm{P}(\mathrm{A})\mathrm{P}(\mathrm{B})$
		* This says that knowing the outcome of $A$ does not tell me anything new about the outcome of $B$.
	* Marginal independence
		* 일반적으로 알고있는 독립 개념
		* Random variable $X$ is marginally independent of random variable $Y$ if, for all $x_{i}\in\operatorname{dom}(X),y_{j}\in\operatorname{dom}(Y)$ and $y_{k}\in\operatorname{dom}(Y)$

$$
\begin{aligned}&P\left(X=x_{i}\mid Y=y_{j}\right)\\&=P\left(X=x_{i}\mid Y=y_{k}\right)\\&=P\left(X=x_{i}\right)\end{aligned}
$$

* That is, knowledge of $Y$’s value doesn’t affect your belief in the value of $X$.
* Conditionally independence
	* Sometimes, two random variables might not be marginally independent. However, they can become independent after we observe some third variable.
	* $X$ and $Y$ are conditionally independent (CI) given $Z$ iff the conditional joint can be written as a product of conditional marginals

: $p(X,Y\mid Z)=p(X\mid Z)p(Y\mid Z)$

* 표기법
	* $X\perp Y$는 서로 독립적이라는 의미가 되고, $X \perp Y \mid Z$ 는 $Z$가 주어졌을 때 $X$와 $Y$가 독립적이라는 의미가 된다.
* 예시
	* K 라는 사람이 A, B 에게 1 부터 10 사이의 어떤 **같은** 숫자 ($n_{k}\in\{1,\ldots,10\}$) 를 각각 얘기해준다.
	* A 가 들은 숫자를 $n_{a}$ 으로, B 가 들은 숫자를 $n_{b}$ 라고 할때, $n_{a}$ 그리고 $n_{b}$ 가 marginally independent 하지 않다: $P\left(n_{a}=1\midn_{b}=1\right)>P\left(n_{a}=1\right)$
		* 왜냐하면 A 입장에서는 B 가 들은 숫자를 확인하고, 자신에게도 어떤 숫자가 올 것인지 예측할 수 있기 때문이다.
	* 그런데, $n_k$ 를 알고있는 조건에서는 서로 conditionally independent 하다.
		* 왜냐하면 이미 $K$ 가 말해준 숫자를 알고 있기 때문에, $A$ 입장에서는 $B$ 의 숫자가 아무 쓸모가 없다.
		* 즉, $P\left(n_{a}=1\mid n_{b}=1,n_{k}=2\right)=P\left(n_{a}=1\mid n_{k}=2\right)$ 를 만족한다.

# B) References
