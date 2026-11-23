---
title: "Accuracy"
tag: metrics, machine_learning, 
---

# A) Accuracy 란?

Accuracy(정확도) 는 전체 데이터 중 정답으로 분류되는 비율을 의미한다.  

$$
\displaystyle\text{Accuracy}=\frac{\text{TruePositive}+\text{TrueNegative}}{\text{TruePositive}+\text{TrueNegative}+\text{FalsePositive}+\text{FalseNegative}}
$$

positive 를 맞힌 것과 negative 를 맞힌 것을 모두 센다. [[precision]] 이 positive 로 판정한 것만 보는 것과 다르다.

# B) 클래스 비율이 치우칠 때

**positive 가 드물면 positive 를 하나도 못 찾는 모델도 Accuracy 가 높다.**

- 메일 100 통 중 스팸이 1 통이라고 하자. 모든 메일을 정상으로 판정하는 모델도 99 통을 맞혀 Accuracy 가 99% 다.
- 이 모델은 스팸을 하나도 찾지 못한다. [[Recall]] 은 0 이다.
- 그래서 positive 를 잘 찾는지는 [[precision]] · [[Recall]] 과 함께 본다. 숫자 예제는 [[분류 모델의 학습과 평가]] 에 있다.

# C) Accuracy 와 AUC

**Accuracy 는 기준값 하나에서 맞힌 비율이고, AUC 는 기준값 없이 순서를 잘 매기는지 본다.**

- Accuracy 를 계산하려면 "점수가 0.5 이상이면 스팸" 처럼 기준값 (threshold) 을 먼저 정해야 한다. 기준값을 바꾸면 Accuracy 도 바뀐다.
- [[Area Under Curve|AUC]] 는 기준값을 처음부터 끝까지 바꿔 본 결과를 숫자 하나로 줄인 값이다.
	- 스팸 한 통과 정상 메일 한 통을 무작위로 골랐을 때, 스팸 점수가 더 높을 확률과 같다.

앞의 스팸 1 통 예시로 두 값을 나란히 놓으면 차이가 드러난다.

1. 모든 메일에 같은 점수를 주는 모델은 Accuracy 가 99% 다. 하지만 스팸과 정상 메일의 순서를 전혀 구분하지 못해 AUC 는 0.5 다. 무작위로 줄 세운 것과 같다.
2. 스팸에 가장 높은 점수를 주는 모델은 AUC 가 1 이다. 그런데 기준값을 그 점수보다 높게 잡으면 스팸도 정상으로 판정해, Accuracy 는 똑같이 99% 다.

**Accuracy 가 같아도 순서를 매기는 능력은 전혀 다를 수 있다.**

- 검색 · 추천처럼 점수로 줄을 세워 위에서부터 보여 주는 문제에서는 AUC 처럼 순서를 보는 지표가 더 맞다.
- 반대로 기준값이 이미 정해져 있고 그 판정 결과 자체가 중요하면, 그 기준값에서의 Accuracy · Precision · Recall 을 본다.

# D) Related

* [[confusion matrix]]
* [[Area Under Curve]]
