---
tags: ["statistic", "probability_distribution"]
aliases: ["Quantile-Quantile Plot"]
---

# 1. Q-Q Plot ?

Q-Q plot 은 두 확률 분포를 비교하는 시각적 방법으로, 확률 분포의 [[Quantile]] 을 plotting 함으로써 비교를 수행한다.

만약 두 분포가 비슷하면, Q-Q plot 은 $y=x$ 형태를 보일 것이다.
만약 두 분포가 비슷하진 않아도, linearly related 하다면, Q-Q plot 은 line 의 형태를 보일 것이지만, 그것이 꼭 $y=x$ 일 필요는 없다.

# 2. Plotting 하는 방법

비교하려는 각 분포에 대해서 1 ~ 100% quantile 에 해당하는 point 를 구한다. 그리고 서로 동일한 quantile 에 해당하는 값을 각각 x, y 축에 놓는다.
만약 동일한 % 에 해당하는 quantile point 값이 같다면, 이는 $y=x$ 꼴을 보일 것이다.

![|400](https://i.imgur.com/sAmqd8L.png)

# 3. Notes

Q-Q plot (Quantile-Quantile Plot) 의 Quantile 은 분위수로, 사분위수 [[quartile]] 과 헷갈리면 안된다.

# 4. Related

# 5. References
