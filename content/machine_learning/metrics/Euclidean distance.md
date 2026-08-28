---
title: "Euclidean distance"
tags: ["metrics"]
aliases: ["Euclidean norm", "유클리디안 거리"]
---

$$
\|\boldsymbol{x}\|_{2}:=\sqrt{\sum_{i=1}^{n} x_{i}^{2}}=\sqrt{\boldsymbol{x}^{\top} \boldsymbol{x}}
$$

* $L^2$ norm
	* Limitation
		* In many contexts, the squared $L^2$ norm may be undesirable because **it increases very slowly near the origin**.
		* In several machine learning applications, it is important to discriminate between elements that are exactly zero and elements that are small but nonzero.
			* 이런 경우, 모든 location 에서 동일한 growth rate 를 가지는 $L^1$ norm 을 쓰면 좋다.
			* The $L^1$ norm is commonly used in machine learning when the diﬀerence between zero and nonzero elements is very important.
