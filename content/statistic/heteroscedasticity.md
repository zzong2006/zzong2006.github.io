---
tags: ["statistic", "regression"]
aliases: ["heteroskedasticity", "non-constant variance"]
---

# A) Heteroscedasticity ?

Heteroscedasticity 는 regression 에서 error variance 가 입력 구간마다 일정하지 않은 상태를 말한다. 반대로 모든 구간에서 error variance 가 일정하다는 가정을 homoscedasticity 라고 한다.

# B) 왜 문제인가

선형 회귀에서 계수 추정 자체가 항상 크게 망가지는 것은 아니지만, standard error 와 confidence interval, hypothesis test 해석이 흔들릴 수 있다. 즉, “계수는 그럴듯해 보이는데 불확실성 추정이 틀리는” 문제가 생긴다.

# C) 어떻게 확인하나

[[residual plot]] 에서 fitted value 가 커질수록 residual 분산이 커지거나 작아지는 fan shape 이 보이면 의심할 수 있다.

# D) 대응

log transform, weighted least squares, robust standard error 같은 방법을 고려한다. 어떤 방법이 맞는지는 variance 가 왜 달라지는지에 대한 domain 가정과 함께 봐야 한다.

