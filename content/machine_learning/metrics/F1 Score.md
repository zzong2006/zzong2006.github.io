---
title: "F1 Score"
tags:
  - machine_learning
  - metrics
aliases: ["F1-Score"]
---

# A) F1 Score?

f1 score 는 [[Recall]] 과 [[precision]] 에 대한 조화 평균 (harmonic mean) 점수다.  

$$
\displaystyle\text{F1Score}=2\times\frac{\text{Precision}\times\text{Recall}}{\text{Precision}+\text{Recall}}
$$

F1 Score는 0.0–1.0 사이의 값을 가지며 높을수록 좋다. Confusion matrix부터 threshold 선택까지의 흐름은 [[분류 모델의 학습과 평가]]에서 함께 정리한다.

# B) F1 Score 를 사용하는 이유

Recall 과 precision 의 불균형을 해결하기 위해 조화 평균 값인 F1 Score 를 사용한다.

어느 이진 분류 모델이 항상 모든 데이터를 positive 로만 분류하는 모델이라 가정해보자. 이 경우, Recall 은 $1$ 의 값을 가지겠지만, precision 은 $0$ 에 가까울 수 있다.

# C) 기하학적으로 해석하는 F1 Score

![Crossed ladders. h is half the harmonic mean of A and B| 500](https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/CrossedLadders.png/440px-CrossedLadders.png)  
여기서 A는 Recall, B는 Precision이고, 그림의 h는 두 값의 조화평균의 절반이다. 따라서 F1 Score는 2h다.

* 한 값을 고정하면 다른 값이 커질수록 h와 F1도 커진다.
* 두 값의 합이 같다면, 두 값이 같을 때 F1이 가장 크다.

# D) For Multi-class Classification

다중 클래스 [[classification]] 문제에서는 각 클래스에 대해서 One-vs-Rest(OvR) F1 score 를 계산하는 것이 중요하다. 즉, 각 class 에 대하여 TP(True Positive), FP, FN 을 계산하여 precision, recall 을 구하고, 최종적으로 F1 Score 를 계산한다.

각 클래스마다 F1 score 를 구하기 보다는 이 score 를 평균내어 하나의 숫자로 표기하는게 전반적인 performance 를 확인하기 더 편하다. 평균을 내는 방식에는 총 세가지 방식이 존재한다.

## D.1) (1) Macro Average

가장 단순 방식으로, 모든 클래스 당 F1-score 의 평균을 의미한다.

## D.2) (2) Weighted Average

각 class의 [[support]], 즉 실제 샘플 수로 F1-score를 가중 평균한다. 다수 클래스가 더 큰 비중을 차지하므로 소수 클래스의 낮은 성능이 가려질 수 있다.

## D.3) (3) Micro Average

Micro 평균 방식은 F1-score 를 계산하기 위한 TP, FN, FP 를 각각 class 마다 합산하고, 합산된 결과를 활용하여 F1-score 를 계산하는 방식이다.

각 샘플에 정답과 예측 클래스가 하나씩인 single-label multiclass에서 모든 클래스를 포함해 평가하면 micro 평균은 [[machine_learning/metrics/accuracy|accuracy]]와 같다. Multilabel이나 일부 클래스만 평가하는 경우에는 일반적으로 성립하지 않는다.
추가적으로 micro-recall 또는 micro-precision 방식도 micro F1-score 와 동일한 값을 가지게 된다.

간단히 정리하면 이렇다.  

$$
\text { micro-F1 = accuracy = micro-precision }=\text { micro-recall }
$$

## D.4) 어느 방식이 가장 좋은가?

만약 분류하려는 class 가 모두 중요하고, 데이터셋의 클래스가 불균형하다면 macro average 가 무난한 선택이 될 것이다.

데이터의 클래스 빈도를 반영하려면 weighted 방식을 쓴다. 이 가중치는 사업적 중요도가 아니라 실제 샘플 수다. 클래스마다 오류 비용이 다르면 별도 비용 기준도 함께 평가한다.

마지막으로 데이터셋의 클래스가 밸런스가 맞고 전반적인 performance 를 쉽게 이해할 수 있는 metric 을 고려한다면 micro average 방식이 좋다.

# E) Fbeta-Measure

recall 또는 precision 에 더 가중치를 주는 방식. false positive 또는 false negative 에 더 많은 가중치를 주기 위해 사용한다.  

$$
F_{\beta}=\frac{\left(1+\beta^{2}\right) \cdot(\text { precision } \cdot \text { recall })}{\left(\beta^{2} \cdot \text { precision }+\text { recall }\right)}
$$

위 식의 $\beta$ 는 recall 에 주는 가중치를 의미한다. 낮을수록 recall 에 가중치를 낮게 준다는 의미.

* F0.5-Measure (beta=0.5): precision > recall
* F1-Measure (beta=1.0): precision = recall (F1-score)
* F2-Measure (beta=2.0): precision < recall

# F) References

* https://towardsdatascience.com/micro-macro-weighted-averages-of-f1-score-clearly-explained-b603420b292f
