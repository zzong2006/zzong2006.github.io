---
title: "Kendall rank correlation"
tags: ["statistic"]
---

# Kendall Rank Correlation ?

Kendall 의 $\tau$ 계수라고도 불리며, rank correlation 을 측정하는 방식 중 하나를 의미한다. 즉, 순위가 매겨진 각 데이터가 있을 때, 해당 순서의 유사도를 측정하는 방식이다.

직관적으로, Kendall 상관 계수는 두 변수 간 유사한 순위를 가질 때 $1$ 값에 가까워진다.

## 측정 방식

$$
\tau=\frac{(\text { number of concordant pairs })-(\text { number of discordant pairs })}{\left(\begin{array}{l}
n \\
2
\end{array}\right)}$$
여기서 분모 $\left(\begin{array}{l}n \\ 2\end{array}\right)=\frac{n(n-1)}{2}$ 는 binomial 계수로, $n$ 개의 아이템에서 2개를 선택하는 방법의 수를 계산한 것이다.

## 예시
아래와 같이 2개의 변수를 가지는 데이터의 집합이 존재한다 (총 30개). 각 관찰된 데이터 쌍은 [[concordant]] 하거나 그렇지 않다(discordant).

![|400](https://i.imgur.com/V2A7n3u.png)

두 데이터를 뽑는 경우의 수가 $\left(\begin{array}{c}30 \\ 2\end{array}\right)=435$ 개가 존재할 때, concordant 데이터는 총 395개가 존재한다 (discordant = 40개). 결과적으로  두 변수 $X$ 와 $Y$의 Kendall rank correlation은 $0.816$으로 계산된다

# References
* https://en.wikipedia.org/wiki/Kendall_rank_correlation_coefficient
