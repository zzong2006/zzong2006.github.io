---
title: "standard deviation"
tags: statistic 
aliases: ["표준 편차"]
---

# A) Standard Deviation ?

집단에 속한 평균을 중심으로 퍼진 정도를 의미한다. 해당 집단이 모 집단인 경우 모 표준편차를 의미하고, 표본 집단을 대상으로 한다면 표본 표준편차를 뜻한다.

계산은 [[variance]](일반적으로 표본 분산) $s^2$ 에 root 를 씌우면 구할 수 있다.

$$
s=\sqrt{s^{2}}=\sqrt{\frac{1}{n-1} \sum_{i}^{n}\left(Y_{i}-\bar{Y}\right)^{2}}
$$

random values $x_i$ 가 sampling 될 확률이 모두 동일한 경우

$$
\displaystyle\sigma=\sqrt{\frac{1}{N}\sum_{i=1}^{N}\left(x_{i}-\mu\right)^{2}},\ \text{where} \ \mu=\frac{1}{N}\sum_{i=1}^{N}x_{i}
$$

random values $x_i$ 가 sampling 될 확률이 서로 다른 경우: $p_i$

$$
\displaystyle\sigma=\sqrt{\sum_{i=1}^{N}p_{i}\left(x_{i}-\mu\right)^{2}},\ \text{where} \ \mu=\sum_{i=1}^{N}p_{i}x_{i}
$$

# B) Related

* 

# C) References
