---
title: "Recall"
tags: ["machine_learning", "metrics"]
aliases: ["sensitivity", "hit rate", "true positive rate", "TPR", "recall"]
---

# A) Recall

Recall은 실제 positive example 중에서 모델이 positive로 찾아낸 비율이다. binary classification에서는 True Positive Rate(TPR), medical diagnosis에서는 sensitivity라고도 부른다.

$$
\mathrm{Recall}=\mathrm{TPR}=\frac{\mathrm{TP}}{\mathrm{TP}+\mathrm{FN}}=1-\mathrm{FNR}
$$

- TP(True Positive): 실제 positive를 positive로 예측한 경우
- FN(False Negative): 실제 positive를 negative로 놓친 경우

# B) 왜 중요한가

Recall은 “놓치면 안 되는 positive를 얼마나 잘 잡는가”를 본다. 사기 탐지, 질병 진단, 검색/추천 candidate generation처럼 놓친 positive의 비용이 큰 문제에서 특히 중요하다.

다만 threshold를 낮추면 recall은 올라가지만 [[statistic/False Positive Rate|FPR]]도 함께 올라갈 수 있다. 그래서 precision, specificity, ROC curve 같은 지표와 같이 읽어야 한다.

# C) Precision과의 차이

| 지표 | 보는 관점 | 질문 |
| --- | --- | --- |
| [[machine_learning/metrics/Recall]] | 실제 positive 기준 | positive를 얼마나 놓치지 않았나 |
| [[machine_learning/metrics/precision]] | 예측 positive 기준 | positive라고 한 것 중 얼마나 맞았나 |

# References
