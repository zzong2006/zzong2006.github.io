---
title: "confusion matrix"
---

# A) Confusion Matrix

실제 레이블과 예측 레이블을 교차해 센 표다. 클릭 예측에서는 노출되어 클릭 여부를 관측한 샘플에 threshold를 적용해 판정을 비교한다. 노출하지 않은 아이템은 클릭 여부를 알 수 없으므로 단순히 TN이나 FN으로 세면 안 된다. 지표를 직접 계산하는 예제는 [[분류 모델의 학습과 평가]]에서 설명한다.

![[img-49639380f2.jpg|Confusion Matrix]]

## A.1) Terminology

### A.1.1) True Positive (TP)

A test result that correctly indicates the presence of a condition or characteristic  
예시 1) 실제로 병이 있는 환자를 병이 있다고 정확히 예측한 것  
예시 2) 노출된 아이템을 클릭할 것으로 예측했고, 실제로 클릭한 경우

### A.1.2) True Negative (TN)

A test result that correctly indicates the absence of a condition or characteristic  
예시 1) 건강한 사람을 병이 없다고 정확히 예측한 것  
예시 2) 노출된 아이템을 클릭하지 않을 것으로 예측했고, 실제로 클릭하지 않은 경우

### A.1.3) False Positive (FP)

A test result which wrongly indicates that a particular condition or attribute is present  
예시 1) 건강한 사람을 병이 있다고 잘못 예측한 것  
예시 2) 노출된 아이템을 클릭할 것으로 예측했지만, 실제로 클릭하지 않은 경우

### A.1.4) False Negative (FN)

A test result which wrongly indicates that a particular condition or attribute is absent  
예시 1) 실제로 병이 있는 환자를 건강하다고 잘못 예측한 것  
예시 2) 노출된 아이템을 클릭하지 않을 것으로 예측했지만, 실제로 클릭한 경우

# B) 예시

![[img-820044d262.png]]

* [[precision]]: 예측 positive 중 실제 positive의 비율
* [[Recall]]: 실제 positive 중 positive로 예측한 비율
* [[Specificity]]: 전체 population 의 negative 에서 negative 예측을 맞춘 비율
