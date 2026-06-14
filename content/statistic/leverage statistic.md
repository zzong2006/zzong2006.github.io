---
title: "leverage statistic"
tags: ["statistic"]
---

# A) Leverage Statistic ?

데이터 (observation) 의 leverage 를 측정하기 위한 방법

simple [[linear regression]] 의 경우, $\displaystyle h_{i}=\frac{1}{n}+\frac{\left(x_{i}-\bar{x}\right)^{2}}{\sum_{i^{\prime}=1}^{n}\left(x_{i^{\prime}}-\bar{x}\right)^{2}}$

# B) 특성

$$
\displaystyle h_{i}=\frac{1}{n}+\frac{\left(x_{i}-\bar{x}\right)^{2}}{\sum_{i^{\prime}=1}^{n}\left(x_{i^{\prime}}-\bar{x}\right)^{2}}
$$

* $h_i$ 는 항상 $1/n$ 과 $1$ 사이이므로, 평균은 반드시 $(p+1)/n$ 이다 ($p$ 는 모델 계수의 개수).
* 그러므로, $(p+1)/n$ 이상인 $h_i$ 를 지닌 데이터는 높은 leverage 인 확률이 높다.
* 일반적으로 [[studentized residuals]] 과 함께 표시해서 [[outlier]] 를 조사함과 동시에 leverage 의 정도도 조사한다.

![|400](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2F_Vnm4KB7OL.png?alt=media&token=8553bbb3-c3a8-4e46-89d4-55bcb550a630)

# C) Related

# D) References
