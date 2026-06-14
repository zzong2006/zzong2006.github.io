---
title: "Exploring compact reinforcement-learning representations with linear regression"
tags: ["MAB", "linear_regression", "paper_review", "reinforcement_learning"]
aliases: ["KWIK"]
---

paper Link: https://arxiv.org/pdf/1205.2606.pdf

# A) Exploring Compact Reinforcement-learning Representations with Linear Regression ?

* [[KWIK Linear Regression]]
	* KWIK (Knows What It Knows) is a framework for studying supervised learning algorithms and was designed to unify the analysis of model-based reinforcement-learning algorithms.
	* Formally, a KWIK learner operates over an input space $X$ and an output space $Y$. At every time step $t$, an input $x_t\in X$ is chosen and presented to the learner.
	* If the learner can make an accurate prediction on this input, it can predict $\widehat{y}_{t}$, otherwise it must admit it does not know by returning $\bot$ (“I don’t know”), allowing it to see the true $y_t$ or a noisy version $z_t$.
		* $z_{t}\in\mathbb{R}$ and $y_t\in\mathbb{R}$
	* An algorithm is said to be KWIK if and only if, with high $(1−\delta)$ probability, $\left\|\widehat{y}_{t}-y_{t}\right\|<\epsilon$ and the number of $\bot$s returned over the agent’s lifetime is bounded by a polynomial function over the size of the input problem.
	* One of the first uses of the KWIK framework was in the analysis of an online linear regression algorithm used to learn linear transitions in continuous state MDPs.
		* This algorithm uses the least squares estimate of the weight vector for inputs where the output is known with high certainty.
			* Certainty is measured by two terms representing (1) the number and proximity of previous samples to the current point and (2) the appropriateness of the previous samples for making a least squares estimate.
		* When certainty is low for either measure, the algorithm reports $\bot$.
	* Some notation
		* Let $X:=\left\{\vec{x}\in\mathbb{R}^{n}\mid\|\vec{x}\|\leq1\right\}$, and let $f:X\rightarrow\mathbb{R}$ be a linear function with slope $\theta^{*}\in\mathbb{R}^{n},\left\|\theta^{*}\right\|\leq M$, i.e. $f(\vec{x}):=\vec{x}^{T}\theta^{*}$.
		* Fix a timestep $t$.
		* For each $i\in\{1,\ldots,t\}$, denote the stored samples by $\vec{x}_{i}$, their (unknown) expected values by $y_{i}:=\vec{x}_{t}^{T}\theta^{*}$, and their observed values by $z_{i}:=\vec{x}_{i}^{T}\theta^{*}+\eta_{i}$
			* where the noise $\eta_{i}$ is assumed to form a martingale, i.e. $E\left(\eta_{i}\mid\eta_{1},\ldots,\eta_{i-1}\right)=0$, and bounded: $\left|\eta_{i}\right|\leq S.$
		* Define the matrix $D_{t}:=\left[\vec{x}_{1},\vec{x}_{2},\ldots,\vec{x}_{t}\right]^{T}\in\mathbb{R}^{t\times n}$ and vectors $\vec{y}_{t}:=\left[y_{1};\ldots;y_{t}\right]\in\mathbb{R}^{t}$ and $\vec{z}_{t}:=\left[z_{1};\ldots;z_{t}\right]\in\mathbb{R}^{t}$, and let $I$ be an $n\times n$ identity matrix.
	* Suppose that a new query $\vec{x}$ arrives. If we were able to solve the linear regression problem $D_{t}\theta=\vec{z}_{t}$, then we could predict $\widehat{y}=\vec{x}^{T}\theta$, where $\theta$ is the least-squares solution to the system.
		* However, solving this system directly is problematic because
			1. If $D_t$ is rank-deficient the least-squares solution may not be unique.
			2. Even if we have a solution, we have no information on its confidence.
		* We can avoid the first problem by regularization, i.e.
by augmenting the system with Iθ = ~v, where ~v is
some arbitrary vector. Regularization certainly distorts the solution, but this gives us a measure of confidence: if the distortion is large, the predictor should
have low confidence and output ⊥. On the other hand,
if the distortion is low, it has two important consequences. First, the choice of ~v has little effect, and
second, the fluctuations caused by using ~zt instead of
~yt are also minor.

# B) Related

* [[A Contextual-Bandit Approach to Personalized News Article Recommendation]]

# C) References
