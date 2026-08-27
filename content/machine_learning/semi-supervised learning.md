---
tags: ["machine_learning"]
aliases: ["Semi-Supervised Learning"]
---

# A) Semi-Supervised Learning

Semi-supervised learning은 label이 있는 데이터와 label이 없는 데이터를 함께 써서 모델을 학습하는 설정이다. label은 비싸고 unlabeled data는 많은 상황에서 자주 등장한다.

# B) 기본 아이디어

Unlabeled data 자체가 정답을 주지는 않지만, 입력 분포의 구조를 알려준다. 모델은 labeled data로 decision boundary를 배우고, unlabeled data를 통해 representation, consistency, pseudo label 등을 보강한다.

# C) 대표 접근

| 방법 | 설명 |
| --- | --- |
| Pseudo-labeling | 모델 예측을 임시 label로 사용 |
| Consistency regularization | 입력 perturbation 후에도 예측이 안정되도록 학습 |
| Self-training | high-confidence sample을 점진적으로 학습 데이터에 추가 |

# References
