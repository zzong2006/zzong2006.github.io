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

일반적으로 binary 분류기는 출력 값이 threshold 이상이면 positive, 미만이면 negative로 판정한다.

같은 데이터와 점수를 고정하고 threshold를 낮추면 positive로 판정하는 집합이 커진다. 따라서 [[machine_learning/metrics/Recall]]과 FPR은 줄어들지 않는다. 다만 Recall이 높다는 사실만으로 threshold가 낮다고 판단할 수는 없다. Positive와 negative를 잘 구별하는 모델은 높은 Recall과 낮은 FPR을 동시에 얻을 수 있다.

반대로 threshold를 높이면 TPR과 FPR은 증가하지 않는다. 두 값이 일정한 비율로 변하는 것은 아니다.

# D) ROC Curve 에서 Curve 의 의미

ROC curve의 점 하나는 특정 threshold에서의 좌표 $(FPR, TPR)$다. 두 값을 나눈 비율이 아니다. 가능한 threshold를 바꾸며 이 좌표를 연결한다. ROC-AUC의 쌍별 순위 해석과 PR curve와의 차이는 [[분류 모델의 학습과 평가 - 면접 기초]]에서 함께 설명한다.

![[img-bf257d03ea.gif]]

* 왼쪽 그래프의 빨간색 [[Probability Density Function|pdf]] 는 true positive, 파란색 pdf 는 true negative example 의 분포를 의미한다.
* 왼쪽 그래프의 x-axis $x$ 는 threshold 를 의미한다.

# E) References
