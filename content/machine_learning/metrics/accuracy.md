---
title: "accuracy"
tag: metrics, machine_learning, 
---

# A) Accuracy 란?

Accuracy(정확도) 는 전체 데이터 중 정답으로 분류되는 비율을 의미한다.  

$$
\displaystyle\text{Accuracy}=\frac{\text{TruePositive}+\text{TrueNegative}}{\text{TruePositive}+\text{TrueNegative}+\text{FalsePositive}+\text{FalseNegative}}
$$

# B) Vs. Precision

클래스 비율이 치우치면 높은 Accuracy만으로 positive를 잘 찾는지 알 수 없다. [[분류 모델의 학습과 평가]]에서는 Precision·Recall과 함께 지표를 해석하는 예제를 다룬다.

[[precision]] 은 positive example 에 집중해서 평가를 진행하는 반면, accuracy 는 positive 와 negative 한 example 모두를 고려한다는 점이다.

# C) Related

* [[confusion matrix]]
