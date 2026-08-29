---
title: "cosine similarity"
tags:
  - math
  - metrics
  - machine_learning
aliases: []
---

# A) Cosine Similarity ?

 $$
 \displaystyle\operatorname{sim}(u,v)=\frac{u^{\top}v}{\|u\|_{2}\|v\|_{2}}
 
 
 
$$

두 벡터가 서로 유사할수록, Cosine similarity 값은 커진다.

# B) Vs. MSE

[[machine_learning/mean squared error|MSE]] 와 차이점은 두 벡터 크기를 이용해 유사도의 정도를 [[machine_learning/Normalization|Normalization]] 할 수 있다는 점이다.

# C) Cosine Similarity 의 범위

$$
-1\le\text{sim}(u,v)\le1
$$

![[img-aa38387822.png||300]]

# D) References
