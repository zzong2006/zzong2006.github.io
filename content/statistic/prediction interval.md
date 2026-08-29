---
title: "prediction interval"
aliases: ["예측구간"]
tags:
  - statistic
---

# A) Prediction Interval ?

앞으로 관측될 **개별 값 하나** 가 들어갈 범위를 나타낸 구간이다. "다음에 오는 손님의 대기 시간은 95% 확률로 3분에서 21분 사이" 같은 진술이 여기 해당한다.

# B) [[confidence interval]] 과의 차이

둘 다 "95%" 라는 같은 수를 달고 나오지만 감싸려는 대상이 다르다.

| | 감싸는 대상 | 데이터를 늘리면 |
| --- | --- | --- |
| confidence interval | 모수 (평균 등 고정된 미지의 값) | 계속 좁아진다 |
| prediction interval | 아직 관측되지 않은 개별 값 | 어느 폭 아래로는 안 좁아진다 |

confidence interval 은 평균이 어디쯤인지에 대한 불확실성만 담는다. 데이터가 무한히 많아지면 평균을 정확히 알게 되므로 구간이 한 점으로 수렴한다.

prediction interval 은 여기에 **개별 값이 평균에서 흩어지는 정도** 가 더해진다. 평균을 완벽히 알아도 다음 관측이 정확히 평균일 리는 없으므로, 데이터를 아무리 모아도 이 흩어짐만큼의 폭은 남는다. 그래서 같은 신뢰수준이면 prediction interval 이 항상 더 넓다.

# C) 선형회귀에서의 형태

새로운 입력 $x_0$ 에 대해 두 구간의 표준오차는 다음처럼 갈린다.

$$
\begin{aligned}
\text{CI} &: \hat{y}_0 \pm t_{\alpha/2}\, \hat{\sigma}\sqrt{h_0} \\
\text{PI} &: \hat{y}_0 \pm t_{\alpha/2}\, \hat{\sigma}\sqrt{1 + h_0}
\end{aligned}
$$

| 기호 | 의미 |
| --- | --- |
| $\hat{y}_0$ | $x_0$ 에서의 예측값 |
| $\hat{\sigma}$ | 잔차의 표준편차 추정값 |
| $h_0$ | leverage. 회귀선 추정의 불확실성이 $x_0$ 에서 얼마나 큰지 |
| $t_{\alpha/2}$ | 신뢰수준에 해당하는 t 분포 값 |

차이는 근호 안의 $1$ 하나다. 이 항이 개별 관측의 오차항 분산에서 오고, 표본이 아무리 커져 $h_0 \to 0$ 이 되어도 남는다.

# D) References
