---
tags: ["machine_learning", "clustering"]
aliases: ["distortion cost", "k-means distortion"]
---

# A) Distortion ?

Distortion 은 clustering 에서 data point 와 자신이 속한 cluster center 사이의 거리 기반 cost 를 말한다. [[K-means]] 에서는 각 point 가 배정된 centroid 와 얼마나 떨어져 있는지를 평균적으로 측정한다.

$$
J = \frac{1}{m}\sum_{i=1}^{m}\left\|x^{(i)}-\mu_{c(i)}\right\|^2
$$

# B) K-means 에서의 의미

K-means 는 cluster assignment 와 centroid update 를 반복하면서 distortion 을 줄인다. cluster 수 $K$ 를 늘리면 distortion 은 보통 감소하지만, 너무 큰 $K$ 는 해석력을 떨어뜨리고 [[overfitting]] 에 가까운 clustering 을 만들 수 있다.

# C) Related

* [[K-means]]
* [[silhouette score]]
* [[Elbow Method]]

