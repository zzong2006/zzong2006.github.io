---
tags: ["statistic", "machine_learning"]
aliases: ["아웃라이어"]
---

# A) Outlier ?

outlier is a point for which $y_i$ is far from the value predicted by the model.

# B) Outlier 판단 하기

## B.1) Using [[standardization]]

A standard cut-off value for finding outliers are Z-scores of +/-3 or further from zero.  
The probability distribution below displays the distribution of Z-scores in a standard normal distribution.

![Distribution of Z-scores for finding outliers.](https://i1.wp.com/statisticsbyjim.com/wp-content/uploads/2019/10/Z-scores.png?resize=576%2C384&ssl=1)  
Z-scores beyond +/- 3 are so extreme you can barely see the shading under the curve.

### B.1.1) 문제점

Z-scores can be misleading with small datasets because the maximum Z-score is limited to $\displaystyle\frac{n-1}{\sqrt{n}}$.  
$n=10$ 이면, Z-score 는 3 을 넘지 못한다.

## B.2) Using Boxplot

[[boxplot]]s display asterisks or other symbols on the graph to indicate explicitly when datasets contain outliers.

These graphs use the interquartile method with fences to find outliers.  
![Example of a boxplot that displays scores by teaching method.](https://i1.wp.com/statisticsbyjim.com/wp-content/uploads/2019/01/boxplot_teaching.png?resize=576%2C384&ssl=1)

* The boxplot below shows a different dataset that has an outlier in the Method 2 group.

## B.3) Using Residual Plot

* [[residual plot]]s can be used to identify outliers.

# C) Related

# D) References
