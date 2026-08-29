---
title: "Lagrange multiplier method"
tags: optimization 
aliases: []
---

# A) Lagrange Multiplier Method ?

* Method of finding a local maximum subject to constraints.
	* Maximize $f(x,y)$ and subject to $g(x,y)=c$ (constraint)
	* Assuming that $f$ and $g$ have continuous partial derivatives.
* Lagrange function: $L(x,y,\lambda)=f(x,y)+\lambda(g(x,y)-c)$
* Applications
	* [MLE]([[Maximum Likelihood Estimation]]) parameter of multinomial distribution
* Examples
	* MLE for the categorical distribution
		* Refer: [[Probabilistic Machine Learning - An Introduction]], 4.2.4

# B) References

* [Khan Academy](https://www.khanacademy.org/math/multivariable-calculus/applications-of-multivariable-derivatives/lagrange-multipliers-and-constrained-optimization/v/constrained-optimization-introduction)
* [[constrained optimization problem]]
