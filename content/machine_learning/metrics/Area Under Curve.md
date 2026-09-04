---
title: "Area Under Curve"
aliases: ["AUC", "AUROC", "Area Under the ROC Curve"]
tags:
  - classification
  - metrics
  - machine_learning
---

# A) AUC

AUC 는 [[ROC Curve|ROC]] 곡선 아래의 면적이다. ROC 곡선이 임계값을 0 에서 1 까지 훑으면서 그려지는 곡선이므로, 그 아래 면적은 "임계값을 어디에 두든 평균적으로 얼마나 잘 구분하는가" 를 한 숫자로 요약한 값이 된다. 임계값을 하나 고정해야 하는 [[accuracy]] 나 [[precision]] 과 달리 임계값 선택에서 자유롭다는 것이 AUC 의 성격이다.

ROC 곡선에 대한 면적임을 명시할 때는 AUROC (Area Under the Receiver Operating Characteristic Curve) 라고 쓴다. AUC 만 쓰면 [[precision]]-[[Recall]] 곡선의 면적 (AUPRC) 과 헷갈릴 수 있어서, 논문에서는 AUROC 로 적는 경우가 많다.

![[img-22d80b9cf0.gif]]

값의 해석은 두 기준점만 기억하면 된다.

| AUC | 의미 |
| --- | --- |
| 1.0 | 모든 positive 를 모든 negative 보다 높게 점수 매긴 완벽한 분류 |
| 0.5 | 두 class 의 점수 분포가 완전히 겹친 상태. 무작위 추측과 같다 |

위 그림에서 두 class 분포가 완전히 겹치면 ROC 곡선이 대각선이 되면서 AUC 가 0.5 가 되고, 이때 모델은 이진 분류기로서의 판별력을 잃은 것이다. 분포가 떨어질수록 곡선이 좌상단으로 붕 뜨면서 AUC 가 1 에 가까워진다.

AUC 에는 확률적 해석이 하나 더 있다. positive 샘플 하나와 negative 샘플 하나를 무작위로 뽑았을 때, 모델이 positive 쪽에 더 높은 점수를 줄 확률이 곧 AUC 다. 그래서 AUC 는 예측 확률의 절대값이 아니라 **순위** 만 본다. 확률값 자체가 맞아야 하는 상황이라면 [[probability calibration]] 을 따로 확인해야 한다.

# B) 임계값의 의미

AUC 를 이해하려면 그 아래 깔린 임계값 개념이 먼저 필요하다.

대부분의 분류 모델은 0 과 1 사이의 확률값을 출력한다. 임계값은 이 확률을 positive / negative 로 가르는 기준점이다. 임계값이 0.5 라면 출력 0.7 은 positive, 0.3 은 negative 로 분류된다.

임계값을 움직이면 두 지표가 같은 방향으로 함께 움직인다.

- 임계값을 올리면 (예: 0.7) positive 판정이 엄격해져 [[False Positive]] 가 줄어들지만 [[Recall|True Positive]] 도 같이 줄어든다.
- 임계값을 내리면 (예: 0.3) positive 판정이 관대해져 True Positive 가 늘어나지만 False Positive 도 같이 늘어난다.

ROC 곡선은 이 trade-off 를 임계값 전 구간에 대해 그린 그림이고, AUC 는 그 그림을 한 숫자로 줄인 것이다. 곡선을 직접 보면 실제 응용에서 쓸 임계값을 어디로 잡을지 판단할 수 있다.

## B.1) TPR 과 FPR

ROC 곡선의 두 축은 다음과 같다.

- **TPR** (True Positive Rate, 민감도 = [[Recall]]): 실제 positive 중 모델이 positive 로 맞춘 비율
- **FPR** (False Positive Rate, 1 − [[Specificity]]): 실제 negative 중 모델이 positive 로 잘못 판정한 비율

# C) 한계

AUC 는 오분류의 실제 비용을 반영하지 않는다. False Positive 한 건과 False Negative 한 건이 사업적으로 전혀 다른 손실을 낼 때도 AUC 는 둘을 같은 무게로 센다.

class 비율이 심하게 치우친 경우에도 해석이 어려워진다. positive 가 100 개 중 2 개뿐이면 예측 하나가 바뀌는 것만으로 TPR 이 50% 움직여서 곡선 자체가 불안정해진다. 이런 [[class imbalance problem]] 상황에서는 AUPRC 를 함께 본다.

# D) Multi-class 와 Multi-label

원래 AUC 는 이진 분류용 지표라서, class 가 셋 이상이면 이진 문제로 쪼개서 계산한다.

**Multi-class** — `[1, 0, 2]` 처럼 정답 class 가 하나지만 종류가 여러 개인 경우다. 각 class 를 차례로 positive 로 두고 나머지 전부를 negative 로 묶어 AUC 를 구한 뒤 평균한다. one-vs-rest 방식이다. torchmetrics 는 one-vs-one 방식을 지원하지 않고, 기본값이 전체 class 평균이며 `average` 인자로 바꿀 수 있다.

**Multi-label** — `[1, 0, 1]` 처럼 한 샘플에 positive label 이 여러 개 붙는 경우다. label 별로 독립적인 이진 문제로 보고 각각 AUC 를 구한다.

# E) References

* [AUROC — PyTorch-Metrics documentation](https://lightning.ai/docs/torchmetrics/stable/classification/auroc.html)
* [분류: ROC 및 AUC | Machine Learning | Google for Developers](https://developers.google.com/machine-learning/crash-course/classification/roc-and-auc)
