---
title: "True Positive Rate"
tags: ["metrics", "machine_learning"]
aliases: ["TPR", "sensitivity", "true positive rate"]
---

# A) True Positive Rate ?

True Positive Rate(TPR)는 실제 positive 중 모델이 positive 로 맞힌 비율이다. 같은 개념을 [[machine_learning/metrics/Recall|Recall]] 또는 sensitivity 라고도 부른다.

$$
\mathrm{TPR} = \frac{\mathrm{TP}}{\mathrm{TP}+\mathrm{FN}}
$$

TPR 이 $1$ 에 가까울수록 실제 positive 를 잘 놓치지 않는다. 다만 threshold 를 너무 낮추면 TPR 은 올라가지만 [[False Positive Rate|FPR]] 도 함께 올라갈 수 있다.

