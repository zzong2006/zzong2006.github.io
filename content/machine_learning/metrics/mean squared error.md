---
title: "mean squared error"
tags:
  - machine_learning
  - linear_regression
aliases: [MSE, RMSE]
---

# A) Mean Squared Error ?

MSE of the estimates

$$
\begin{aligned}\operatorname{MSE}&=\mathbb{E}\left[\left(\hat{\theta}_{m}-\theta\right)^{2}\right]=\operatorname{Bias}\left(\hat{\theta}_{m}\right)^{2}+\operatorname{Var}\left(\hat{\theta}_{m}\right)\end{aligned}
$$ 

# B) Root Mean Squared Error

$$
\operatorname{RMSE}(\boldsymbol{w})=\sqrt{\operatorname{MSE}(\boldsymbol{w})}=\sqrt{\frac{1}{N}\sum_{n=1}^{N}\left(y_{n}-\boldsymbol{w}^{\top}\boldsymbol{x}_{n}\right)^{2}}
$$

# C) Related

[[Maximum Likelihood Estimation|MLE]]

# D) References
