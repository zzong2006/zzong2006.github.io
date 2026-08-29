---
title: "survival analysis"
tags: statistic 
aliases: ["생존분석"]
---

# Survival Analysis ?

통계학의 한 분야로, 어떠한 현상이 발생하기까지에 걸리는 시간에 대해 분석하는 것이다. 예를 들면, (1) 생명체의 관찰시작부터 사망에 이르는 시간을 분석하거나 (2) 어떤 환자에 대해 특정 시간이 지나도 생존할 확률을 분석할 수 있다.

다음 이벤트가 발생할때까지 걸리는 시간을 $T$ 라 가정한다면, hazard function(이벤트가 발생할 비율) 은 아래와 같이 정의된다.

$$
\lambda(t)=\lim _{d t \rightarrow 0} \frac{\operatorname{Pr}\{t \leq T<t+d t \mid T \geq t\}}{d t}
$$

위 수식을 이용하면, $t$ 시간 후에 이벤트가 발생할 확률은 다음과 같이 정의할 수 있다.

$$
S(t)=e^{-\int_{0}^{t} \lambda(x) d x}
$$

# References
