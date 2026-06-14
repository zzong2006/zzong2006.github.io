---
tags: ["statistic"]
aliases: ["VIF"]
---

# A) Variance Inflation Factor, VIF ?

The VIF is the ratio of the variance of $\hat{\beta}_{j}$ when fitting the full model divided by the variance of $\hat{\beta}_{j}$ if fit on its own.

$$
\displaystyle\operatorname{VIF}\left(\hat{\beta}_{j}\right)=\frac{1}{1-R_{X_{j}\midX_{-j}}^{2}}
$$

$R_{X_{j}\mid X_{-j}}^{2}$ is the $R^{2}$([[R-squared]]) from a regression of $X_j$

# B) 특징

* The smallest possible value for VIF is 1, which indicates the complete absence of [[collinearity]].
* As a rule of thumb, a VIF value that exceeds 5 or 10 indicates a problematic amount of collinearity.

# C) Related

# D) References
