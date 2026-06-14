---
title: "loss function"
tags: ["machine_learning", "optimization", "loss_function"]
aliases: ["loss", "objective loss"]
---

# A) Loss Function ?

Loss function 은 모델의 예측이 정답과 얼마나 다른지를 숫자로 바꾸는 함수다. 학습은 보통 이 값을 줄이는 방향으로 parameter 를 업데이트하는 과정으로 볼 수 있다.

한 샘플에 대한 오차를 말할 때는 loss 라고 부르고, 전체 training set 또는 mini-batch 에서 loss 를 평균/합산한 값을 [[cost function]] 또는 objective function 이라고 부르는 경우가 많다. 실무와 논문에서는 둘을 엄밀히 나누지 않고 섞어 쓰기도 하지만, 수식을 읽을 때는 “개별 샘플의 손실인가, 전체 목적 함수인가”를 먼저 확인하면 헷갈림이 줄어든다.

# B) 손실 함수를 고르는 기준

손실 함수는 모델이 무엇을 잘하게 만들지 정한다. 같은 모델 구조라도 loss 를 바꾸면 학습 신호와 ranking/분류 경계가 달라진다.

| 문제 유형 | 자주 쓰는 loss | 읽는 포인트 |
| --- | --- | --- |
| Regression | [[linear_algebra/L2 Loss|L2 Loss]], [[machine_learning/mean squared error|MSE]] | 큰 오차에 더 큰 penalty 를 줄지 |
| Binary / Multiclass Classification | [[logistic loss]], [[cross-entropy]] | 확률 예측과 decision boundary 를 어떻게 맞출지 |
| Maximum-margin Classification | [[hinge loss]] | 정답만 맞히는 것이 아니라 margin 을 확보할지 |
| Metric Learning / Retrieval | [[retrieval/concepts/Triplet Loss|Triplet Loss]], [[InfoNCE]] | positive 는 가깝게, negative 는 멀게 만들지 |
| Language Model | next-token [[cross-entropy]] | 다음 token 분포를 얼마나 잘 맞추는지 |

# C) Loss 와 Metric 은 다르다

Loss 는 학습 중 gradient 를 만들기 위한 함수이고, metric 은 모델을 평가하기 위한 척도다. 예를 들어 추천/검색에서는 [[Normalized Discounted Cumulative Gain|NDCG]], [[Recall]], [[precision]] 을 보고 싶지만, 이들은 그대로 미분하기 어렵기 때문에 학습에서는 cross-entropy, pairwise loss, contrastive loss 같은 surrogate loss 를 쓰는 경우가 많다.

# D) 실무에서 보는 포인트

Loss 가 내려가는데 실제 metric 이 오르지 않으면, 학습 목적과 서비스 평가 기준이 어긋났을 가능성이 있다. 반대로 metric 이 noisy 하면 loss 를 통해 학습이 정상적으로 진행되는지 먼저 확인할 수 있다.

Regularization term 이 붙으면 objective 는 “순수 예측 loss + 복잡도 penalty”가 된다. 이때는 [[regularization]] 때문에 training loss 자체가 조금 커져도 generalization 이 좋아질 수 있다.

