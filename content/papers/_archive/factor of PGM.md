---
title: "factor of PGM"
tags:
  - PGM
  - paper_review
aliases: ["factor"]
---

# 1. Factor of PGM ?

Factor 는 함수 또는 테이블이다.

Factor 는 a bunch of arguments 를 입력으로 받는데, 일반적으로 random variables 의 집합을 입력으로 받게된다.

* Scope: Factor 가 받을 수 있는 랜덤 변수의 범위를 scope 라 한다.
* Factor 가 필요한 이유
* Fundamental building block for defining distributions in high-dimensional spaces

: 많은 랜덤 변수를 포함하는 분포를 정의할 때 필수적인 요소로 사용됨

* Set of basic operations for manipulating these probability distributions

: 이렇게 정의된 분포들을 다양한 연산으로 통해 조작할 수 있음

# 2. 예시

## 2.1. Example (1)

Factor: $\phi\left(X_{1},\ldots,X_{k}\right)$ and $\phi:\operatorname{Val}\left(X_{1},\ldots,X_{\mathrm{k}}\right)\rightarrow\mathrm{R}$

Scope: $\left\{X_{1},\ldots,X_{k}\right\}$

## 2.2. Example (2)

* [[Joint distribution of PGM]] 도 factor 다. $P(I,D,G)$ 의 경우 Random Variable $I,D,G$ 에 따른 확률 분포를 실수로 표현한다.
* 예시: condition on $g^1$ 에서 Unnormalized measure 도 factor 다: $P\left(I,D,g^{1}\right)$.
	* 다만, $g^1$ 의 경우 factor 출력에 관계가 없는 constant 이기 때문에 scope 는 $\{I,D\}$ 이다.
* Conditional Probability Distribution(CPD) 도 factor 다. $P(G\mid I,D)$ 의 경우 테이블로 표현될 수 있다.
	* ![[img-6cf167ce37.png||230]]
		* 조건 $I,D$ 에 의한 $G$ 의 확률이므로, 테이블 행의 합이 $1$ 이다.
		* 이 조건 $I,D$ 를 context 라고 한다.

# 3. Factor Operation

* Factor product
	* Factor 를 테이블로 표현했을 때, factor 의 scope 에서 동일한 variable 끼리 묶어서 확률을 곱하는 작업
	* SQL 의 inner join 과 비슷한데, 확률을 곱하는 것이 차이가 있음
	* 예시

		1. the scope of the factor product $\phi(A,B,C)\times\phi(C,D)$ is $\{A,B,C,D\}$
		2. ![[img-ad5fabbd29.png]]

* Factor Marginalization
	* Factor 의 scope 에서 특정 variable 을 하나로 합치는 작업
		* 하나로 합칠 때 해당되는 확률 값을 전부 더해준다.
	* [[Joint distribution of PGM]] 의 Marginalization 과 비슷한 동작
	* 예시: Scope $\{A,B,C\}$ -> $\{A,C\}$
		* ![[img-e39a899319.png]]
* Factor Reduction
	* Marginalization 과 다르게, 특정 조건을 만족하는 확률만 찾아서 줄이는 방법
	* [[Joint distribution of PGM]] 의 conditioning 와 비슷한 개념이다.
	* 예시
		* ![[img-d804ef7645.png]]

# 4. Related

# 5. References
