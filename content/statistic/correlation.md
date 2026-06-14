---
title: "correlation"
tags: ["metrics", "statistic"]
aliases: ["상관"]
---

# Correlation?

두 변수 간 선형 관계를 측정하기 위해서 사용하는 값
[[covariance]] 역시 선형 관계를 측정하지만, normalized 된 것이냐 아니냐의 차이가 있다.

아래는 [[Pearson correlation]] 계산 식을 나타낸다.

$$
\displaystyle\operatorname{corr}[x,y]=\frac{\operatorname{Cov}[x,y]}{\sqrt{\mathbb{V}[x]\mathbb{V}[y]}}\in[-1,1]
$$

The correlation matrix is the [[covariance]] matrix of standardized random variables, $x/\sigma(x)$. 다른 말로하면, correlation matrix 에 존재하는 각 랜덤 변수를 해당 변수의 표준 편차로 나눈 것으로 생각할 수 있다.

## Sample Correlation

$$
\displaystyle\operatorname{Cor}(X,Y)=\frac{\sum_{i=1}^{n}\left(x_{i}-\bar{x}\right)\left(y_{i}-\bar{y}\right)}{\sqrt{\sum_{i=1}^{n}\left(x_{i}-\bar{x}\right)^{2}}\sqrt{\sum_{i=1}^{n}\left(y_{i}-\bar{y}\right)^{2}}}
$$

# 특징

![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FUZRMtnsHaW.png?alt=media&token=83a100df-4bf2-4e4a-b32e-f20c6c6480cc)

Positive correlation $\operatorname{corr}[x,y]$ means that when $x$ grows, then $y$ is also expected to grow. Negative correlation means that as $x$ increases, then $y$ decreases.

# 단점

상관관계의 정도에 상관없이 동일한 값이 나오는 경우가 많다.
예를 들어 선형 그래프의 slope 에 상관없이 동일한 상관관계 값이 나오는 경우가 있다.
