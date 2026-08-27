---
tags: ["machine_learning", "metrics"]
aliases: ["classification metrics"]
---

# A) Classification Metrics ?

Classification metric 을 볼 때는 먼저 “무엇을 positive 로 정의했는가”를 확인해야 한다. Positive class 를 어떻게 잡느냐에 따라 [[Recall]], [[precision]], [[Specificity]] 의 해석이 달라진다.

# B) Sensitivity 와 Specificity

[[machine_learning/metrics/Recall|Sensitivity]] 는 실제 positive 중 모델이 positive 로 맞힌 비율이다. 같은 값을 [[machine_learning/metrics/Recall|Recall]] 또는 TPR(True Positive Rate)이라고도 부른다.

[[Specificity]] 는 실제 negative 중 모델이 negative 로 맞힌 비율이다. medical diagnosis 문맥에서는 질병이 없는 사람을 정상으로 잘 구별하는 능력으로 해석할 수 있다.

| 지표 | 기준 집단 | 의미 |
| --- | --- | --- |
| [[machine_learning/metrics/Recall]] (Sensitivity) | 실제 positive | positive 를 놓치지 않는 능력 |
| [[Specificity]] | 실제 negative | negative 를 잘 걸러내는 능력 |
| [[statistic/False Positive Rate]] (FPR) | 실제 negative | negative 를 positive 로 잘못 잡는 비율 |

Sensitivity 와 Specificity 는 항상 수학적으로 반비례하는 것은 아니지만, threshold 를 움직이면 한쪽을 높이는 대신 다른 쪽이 낮아지는 trade-off 가 자주 생긴다.

# C) Precision 과 Recall

[[precision]] 은 모델이 positive 라고 예측한 것 중 실제 positive 의 비율이다. 즉, 예측 결과의 신뢰도를 본다.

[[Recall]] 은 실제 positive 중 모델이 찾아낸 비율이다. 즉, 놓치지 않는 능력을 본다.

| 지표 | 분모 | 질문 |
| --- | --- | --- |
| [[precision]] | predicted positive | positive 라고 한 것들이 얼마나 맞았나 |
| [[Recall]] | actual positive | 실제 positive 를 얼마나 찾았나 |

두 지표를 함께 보고 싶을 때는 [[F1 Score]] 를 사용한다.
