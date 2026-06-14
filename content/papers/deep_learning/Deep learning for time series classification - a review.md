---
tags: ["deep_learning", "paper_review"]
---

# 1. Deep Learning for time Series Classification - a Review ?

* [[Convolution Neural Network]]
	* Applying several filters on a time series will result in a __multivariate__ time series whose dimensions are equal to the number of filters used.
		* An intuition behind applying several filters on an input time series would be to learn multiple discriminative features useful for the classification task.

Recurrent Neural Network([[Recurrent Neural Network]]) 은 다음과 같은 이유로 TSC 에 잘 사용되지 않는다.

* (1) the type of this architecture is designed mainly to predict an output for each element (time stamp) in the time series.
* (2) RNNs typically suffer from the [[vanishing gradients]] problem due to training on long

time series (Pascanu et al., 2012);

* (3) RNNs are considered hard to train and parallelize which led the researchers to avoid using them for computational reasons.

# 2. Related

# 3. References
