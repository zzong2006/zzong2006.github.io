---
layout: default
title:  "Metrics for Learning Models"
category: Machine Learning
order: 11
---

민감도(sensitivity)는 질병이 있는 사람(negative)을 얼마나 잘 찾아 내는가에 대한 값이고 특이도(specificity)는 정상(positive)을 얼마나 잘 찾아 내는가에 대한 값이다.

민감도와 특이도는 일반적으로 좋지 않은 진단 방법일 경우 한 쪽이 증가하면 다른 한 쪽이 감소하는 경향을 보인다. 따라서 민감도와 특이도가 둘 다 높은 진단 방법을 찾는 것이 관건이다. 

* 검사를 받는 모든 사람에 대하여 항상 '질병'으로 진단 내리는 검사를 생각해 보자. 이 경우 검사를 받은 사람 중 환자에 대하여 모두 질병으로 판단하였기 때문에 민감도는 1.0 이 된다. 그러나 검사를 받은 사람 중 정상에 대하여도 '질병'으로 판단하였기 때문에 특이도는 0 이 된다. 
* 반대로 이번에는 검사를 받는 모든 사람에 대하여 항상 '정상'으로 진단을 내리는 검사를 생각해 보자. 이 경우 검사를 받은 사람 중 모든 정상에 대하여 '정상'으로 판단을 내렸기 때문에 특이도는 1.0 이 된다. 그러나 검사를 받은 환자 중 '질병'으로 진단된 사람은 없기 때문에 민감도는 0 이 된다. 
* Sensitivity와 Specificity가 항상 반비례는 아니지만 같이 맞추기가 힘들다.

## Sensitivity (또는 Recall)

$$
\frac{\text{True Positive}}{\text{True Positive + False Negative}}
$$

## Specificity

$$
\frac{\text{True Negative}}{\text{True Negative + False Positive}}
$$



질병의 특징에 따라 민감도를 높일 것인지 특이도를 높일 것인지를 고려하기도 한다. 예를 들면, 매우 심각한 질병이라면 정상을 질병이라고 진단하는 비율이 조금 있다 하더라도 될 수 있으면 질병이 있는 사람을 보다 잘 진단하기 위하여 민감도를 높이고 특이도를 낮추어야 할 것이다. 그 후 재검사를 통해 보다 정확히 진단할 것이다.



## Confusion Matrix

![How to Remember all thesdium](https://i.loli.net/2020/11/05/mRcQTGMuyaCpKJV.jpg)



## Precision & recall (sensitivity) & specifity

![Data Science in Medicine ](https://i.loli.net/2020/11/05/8PkKpsnwEoxB4C6.png)

* precision: 분류된 결과 중 positive에만 신경 씀
* recall (sensitivity) : 실제 positive 가 얼마나 잘 분류되있는지만 신경씀 
  * 분류 결과에 대해서는 관심 없음
  * 재검사 cost가 크지 않다면 recall 위주로 성능 측정을 진행해도 됨
* specificity : 실제 negative가 얼마나 잘 분류되있는지만 신경씀
  * 마찬가지로 분류 결과에 대해서는 관심 없음 