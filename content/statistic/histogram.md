---
title: "histogram"
tags: ["statistic"]
---

# Histogram ?

# Mean & Median 계산

## Mean

$$
\sum \frac{m_{i} n_{i}}{N}
$$

* $m_i$ : $i$ 번째 bin 의 중간 값
* $n_i$ : $i$ 번째 bin 의 frequency
* $N$ : 총 sample size

## Median

$$
 L+((n / 2-F) / f) * W
$$

* $L$: median group 의 lower limit
* $n$: 총 관측 개수
* $F$: median group 의 최대 누적 frequency
* $f$: median group 의 frequency
* $w$: median group 의 width

## 예시

![|400](https://i.imgur.com/a0CWicg.png)

* mean: $\left(5.5^{\star} 2+15.5^{\star} 7+25.5^{\star} 10+35.5^{\star} 3+45.5^{\star} 1\right) / 23=22.89$
* median: $21+((25 / 2-9) / 10)^{*} 9=24.15$

# References
