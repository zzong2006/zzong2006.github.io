---
title: "joint entropy"
tags:
  - statistic
  - information_theory
aliases: [Joint Entropy]
---

# A) Joint Entropy ?

Joint entropy 는 두 random variable 을 함께 관찰했을 때의 불확실성을 측정한다. $X$, $Y$ 의 joint distribution 이 $p(x, y)$ 라면 joint entropy 는 다음과 같다.

$$
H(X,Y) = - \sum_x \sum_y p(x,y)\log p(x,y)
$$

# B) Conditional Entropy 와의 관계

Joint entropy 는 [[conditional entropy]] 와 다음 관계를 가진다.

$$
H(X,Y) = H(X) + H(Y|X)
$$

즉, $X$ 의 불확실성과, $X$ 를 알고 난 뒤에도 남는 $Y$ 의 불확실성을 더한 값이다.

# C) Mutual Information 과의 관계

[[mutual information]] 은 두 변수가 공유하는 정보량이다.

$$
I(X;Y) = H(X) + H(Y) - H(X,Y)
$$

두 변수가 독립이면 joint entropy 는 각 entropy 의 합과 같아진다.

