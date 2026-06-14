---
tags: ["machine_learning", "metrics"]
aliases: ["sensitivity", "hit rate", "true positive rate", "TPR", "재현율"]
---

# A) Recall ?

recall 은 전체 positive example 중, 모델이 얼마나 positive example 을 잘 찾아내는가를 나타내는 척도이다.  

$$
\mathrm{TPR}=\frac{\mathrm{TP}}{\mathrm{P}}=\frac{\mathrm{TP}}{\mathrm{TP}+\mathrm{FN}}=1-\mathrm{FNR}
$$

* TP 는 True Positive: [[confusion matrix#true positive TP]]
* FN 는 False Negative: [[confusion matrix#false negative FN]]

# B) Related

Sensitivity 는 medical diagnosis 나 binary test 문맥에서 쓰는 [[machine_learning/metrics/Recall|Recall]] / TPR 의 다른 이름이다.
