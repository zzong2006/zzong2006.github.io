---
title: "posterior"
tags:
  - statistic
  - bayesian_inference
aliases: []
---

# A) Posterior ?

evidence $X$ 가 주어졌을 때, $A$ 가 발생할 확률을 나타내며, notation 은 다음과 같이 표기할 수 있다.  

$$
P(A \mid X)
$$

posterior 는 [[prior]] 를 re-weight 해준다는 목적으로 사용할 수 있다 (이벤트 $A$ 가 발생할 기존의 믿음을 바꾸는 용도).

# B) Posterior Mean 의 추정

posterior [[mode]] 의 alternative 한 측정 방식이 posterior mean  

* 만약 posterior distribution 이 [[Gaussian distribution]] 와 같이 symmetric 하다면, posterior mean 과 [[mode]] 는 동일하다. 만약, non-symmetric 하다면 동일하지 않음  
* If we want our estimate to reflect where the central mass of the  
posterior probability lies than in case where the posterior is highly  
skewed, the mode is a better choice than the mean.

# C) References

* http://fisher.utstat.toronto.edu/~hadas/STA312/Lecture%20notes/week4.pdf
