---
title: "min-max scaling"
tags: feature_scaling
aliases: []
---

# Min-max Scaling ?

values are shifted and rescaled so that they end up ranging from 0 to 1.

We do this by subtracting the min value and dividing by the max minus the min.

$$
x^{\prime}=\frac{x-\min (x)}{\max (x)-\min (x)}
$$

# 단점

[[outlier]] 에 취약한 편이다. 반대로, [[standardization]] is much less affected by outliers.

# References
