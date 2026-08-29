---
title: "ROC Curve"
tags:
  - machine_learning
  - metrics
  - classification
aliases: ["ROC"]
---

# A) ROC Curve ?

ROC(Receiver Operating Characteristic) curve 는 [[classification]] 의 모델의 성능을 표현하기 위한 curve 이다.

어떻게 활용하냐에 따라서 multi-class 또는 multi-label 분류기의 성능 측정까지 가능하다.

# B) ROC Curve 를 분석하는 방법

좌상단에 붙어있는 커브가 더 좋은 분류기를 의미한다고 생각할 수 있다. 즉, 좌상단에 가까운 커브에 해당하는 분류기는 positive 와 negative 클래스를 더 잘 구별할 수 있다는 의미가 된다.

![[img-f28872df87.png||400]]  
위 그림에서 [[Recall|TPR]] 은 True Positive Rate, 그리고 [[False Positive Rate]] 은 False Positive Rate 를 의미한다.

# C) ROC Curve 에서 TPR 과 FPR 의 의미

일반적으로 binary 분류기는 출력 값이 미리 정의된 threshold 이상인 경우를 positive, 이하일 경우 negative 로 결정한다.

만약 [[machine_learning/metrics/Recall]] 이 높다면, 어떤 데이터이든 대부분 positive 로 분류하려고 하는 경향이 강하기 때문에, 모델이 **낮은 threshold** 를 사용하고 있다는 것을 의미한다. 또한, FPR 도 동시에 높아지게 되는데, 그 이유는 threshold 를 너무 낮춰버리면 negative example 도 positive 로 판정하기 때문이다.

반대로, 높은 threshold 는 TPR 와 FPR 을 동시에 낮춘다.결과적으로, threshold 가 변함에 따라서 FPR 과 TPR 이 어느 정도는 비례적으로 값이 바뀐다는 것을 알 수 있다.

# D) ROC Curve 에서 Curve 의 의미

ROC Curve 에 위치한 점은 특정 threshold 에 대한, TPR 와 FPR 의 비율을 의미한다. 즉, ROC Curve 는 가능한 모든 threshold 에 대한 TPR 와 FPR 의 비율을 표시한 것이다.

![[img-bf257d03ea.gif]]

* 왼쪽 그래프의 빨간색 [[Probability Density Function|pdf]] 는 true positive, 파란색 pdf 는 true negative example 의 분포를 의미한다.
* 왼쪽 그래프의 x-axis $x$ 는 threshold 를 의미한다.

# E) References
