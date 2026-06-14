---
tags: ["law_of_total_probability", "statistic"]
---
* Tags: [[law of total probability]]
* 응용
	* [[Bayes theorem]]
		* $P(X\mid Y)=P(X,Y)/P(Y)$
	* [[marginalization]]
		* $\displaystyle\operatorname{Pr}(W,L)=\mathrm{E}(\operatorname{Pr}(W,L\mid p))=\int\operatorname{Pr}(W,L\mid p)\operatorname{Pr}(p)dp$
			* $\mathrm{E}$ 는 [[expectation]]

# A) 결합 확률 (Joint Probability)

결합 확률은 여러 확률 변수의 값이 동시에 발생할 확률을 의미합니다. 이는 각 확률 변수의 표본 공간들의 데카르트 곱 (Cartesian product) 으로 정의됩니다.

## A.1) 결합 확률 공식

결합 확률은 다음과 같이 계산됩니다:

$$
P(X=x_{i}, Y=y_{j}) = \frac{n_{ij}}{N}
$$

여기서 $n_{ij}$ 는 $X=x_i$ 와 $Y=y_j$ 가 동시에 발생한 횟수, $N$ 은 전체 사건 수를 나타냅니다.

### A.1.1) 예시

![](https://i.imgur.com/MvR5UHu.png)

* $P(A=\text{true}, B=\text{true})$: A 도 참이고, B 도 참일 때의 결합 확률을 의미합니다.

## A.2) 응용

### A.2.1) 베이즈 정리 (Bayes Theorem)

베이즈 정리는 조건부 확률을 계산하는 중요한 도구입니다. 다음과 같은 식으로 표현됩니다:

\[

P(X \mid Y) = \frac{P(X, Y)}{P(Y)}

\]

이는 사건 Y 가 주어졌을 때 사건 X 가 일어날 조건부 확률을 구하는 방법입니다.

### A.2.2) 주변화 (Marginalization)

주변화는 특정 변수를 제외하고 나머지 변수들에 대한 결합 분포를 구하는 과정입니다. 이를 통해 복잡한 다변량 분포에서 일부 변수를 제거하여 단순화된 분포를 얻습니다. 수식으로는 다음과 같이 표현됩니다:

\[

$$
\operatorname{Pr}(W,L) = \mathrm{E}(\operatorname{Pr}(W,L \mid p)) = \int \operatorname{Pr}(W,L \mid p)\operatorname{Pr}(p)dp
$$

여기서 $\mathrm{E}$ 는 기대값 ([[expectation]]) 을 나타냅니다.이 표현됩니다:

\[

\operatornamefrac{n_{
