---
title: "False Positive Rate"
tags: ["metrics", "machine_learning"]
aliases: ["FPR", "false positive rate"]
---

# A) FPR ?

FPR(False Positive Rate)은 실제 negative 중에서 모델이 positive 로 잘못 예측한 비율이다.

$$
\mathrm{FPR} = \frac{\mathrm{FP}}{\mathrm{FP}+\mathrm{TN}}
$$

[[Specificity]] 가 실제 negative 를 negative 로 맞힌 비율이라면, FPR 은 그 반대 방향의 오류율이다.

$$
\mathrm{FPR} = 1 - \mathrm{Specificity}
$$

주의할 점은 FPR 이 $1 -$ [[machine_learning/metrics/Recall|Sensitivity]] 가 아니라는 것이다. [[machine_learning/metrics/Recall|Sensitivity]] 는 실제 positive 를 기준으로 하고, FPR 은 실제 negative 를 기준으로 한다.

# B) False Positive 와의 관계

[[False Positive]] 는 개별 예측 오류의 종류이고, FPR 은 그 오류가 실제 negative 전체 중 얼마나 자주 일어나는지를 나타내는 비율이다.

# C) References

