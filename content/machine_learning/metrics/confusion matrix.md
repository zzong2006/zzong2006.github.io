# A) Confusion Matrix

![Confusion Matrix](https://i.loli.net/2020/11/05/mRcQTGMuyaCpKJV.jpg)

## A.1) Terminology

### A.1.1) True Positive (TP)

A test result that correctly indicates the presence of a condition or characteristic  
예시 1) 실제로 병이 있는 환자를 병이 있다고 정확히 예측한 것  
예시 2) 어떤 아이템을 추천했을 때, 사용자가 그 아이템을 클릭한 것 (i.e. click)

### A.1.2) True Negative (TN)

A test result that correctly indicates the absence of a condition or characteristic  
예시 1) 건강한 사람을 병이 없다고 정확히 예측한 것  
예시 2) 어떤 아이템을 추천하지 않고, 사용자는 실제로도 그 아이템에 관심이 없는 것

### A.1.3) False Positive (FP)

A test result which wrongly indicates that a particular condition or attribute is present  
예시 1) 건강한 사람을 병이 있다고 잘못 예측한 것  
예시 2) 어떤 아이템을 추천하지 않았는데, 사용자는 그 아이템에 관심이 있던것

### A.1.4) False Negative (FN)

A test result which wrongly indicates that a particular condition or attribute is absent  
예시 1) 실제로 병이 있는 환자를 건강하다고 잘못 예측한 것  
예시 2) 어떤 아이템을 추천했을 때, 사용자가 그 아이템을 무시한 것 (i.e. vimp)

# B) 예시

![](https://i.loli.net/2020/11/05/8PkKpsnwEoxB4C6.png)

* [[precision]]: 분류된 결과 중 predicted positive 의 negative 와 positive 만 신경 씀
* [[Recall]] : predicted positive 에서 positive 만 신경 씀
* [[Specificity]]: 전체 population 의 negative 에서 negative 예측을 맞춘 비율
