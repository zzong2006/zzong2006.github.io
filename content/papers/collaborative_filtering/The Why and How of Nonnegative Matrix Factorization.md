---
title: "The Why and How of Nonnegative Matrix Factorization"
aliases: []
tags:
  - collaborative_filtering
  - paper_review
---

* Tags
	* [[matrix factorization]], #[[non-negative matrix factorization]]
* [paper link](https://arxiv.org/pdf/1401.5226.pdf)
* # Standard NMF 알고리즘
	* 대부분의 NMF 알고리즘이 $\displaystyle\min_{W\in\mathbb{R}^{p\timesr},H\in\mathbb{R}^{r\timesn}}\|X-WH\|_{F}^{2}$ 를 풀기위해 two-block coordinate descent scheme 을 사용함
		* 이 scheme 은 두 factor $H$ 또는 $W$ 중 하나를 고정하고 나머지를 최적화하면서 번갈아 반복하는 방식을 의미함
		* NMF 이기 때문에 constraints 가 존재: $W\geq0\text{and}H\geq0$
	* 이렇게 하는 이유는 하나를 고정하면 one factor 에 대한 subproblem 으로 바뀌게 되는데, 이것이 convex 하기 때문임: 이를 nonnegative [least square problem]([[least squares estimation]])(NNLS) 라고 부른다.
		* 예를 들어, $\displaystyle\min_{W\geq0}\|X-WH\|_{F}^{2}$ 에서 $H$ 를 고정하는 경우를 생각해보자
	* ## [[Alternating Least Squares]]
		* Also 는 NMF 목적함수 $\min_{W}\|X-WH\|_{F}$ 를 constrain 없이 풀어서 optimal solution 을 계산한 뒤, 해당 solution 에 대해서 nonnegative projection 을 수행한다.
			* $\displaystyleW\leftarrow\max\left(\operatorname{argmin}_{Z\in\mathbb{R}^{p\timesr}}\|X-ZH\|_{F},0\right)$
		* 일반적으로 Also 는 수렴하지 않는다. max 함수가 component-wise 형태로 적용되기 때문에, loss 값이 Also 업데이트마다 oscillate 한다.
		* Also 는 수렴 이슈때문에 추천되지 않는 방법이지만, 초기값을 설정할 때 유용하다.
			* Also 로 few step 밟은 뒤, 다른 NMF 알고리즘 수행
	* ## Alternating Nonnegative Least Squares
