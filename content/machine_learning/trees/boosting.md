---
title: "Boosting"
tags: ensemble
aliases: ["부스팅"]
---

집값을 예측하는데, 질문 하나("방이 3 개 이상인가?")로만 나누는 아주 얕은 결정 트리밖에 쓸 수 없다고 하자. 트리 하나로는 집을 두 무리로 나눠 각 무리의 평균을 말하는 것이 전부라 많이 틀린다. 그래서 트리를 하나 더 만드는데, 이번에는 앞 트리가 많이 틀린 집을 고치는 데 집중하게 한다. 이렇게 약한 모델을 하나씩 차례로 더하면서, 새 모델이 지금까지의 모델들이 틀린 부분을 고치게 하는 방식을 boosting 이라 한다.

# A) 한눈에 보기

- **Boosting 은 약한 모델을 차례로 더하고, 새 모델은 앞 모델들이 틀린 부분을 고친다**: 앞 모델의 결과가 있어야 다음 모델을 만들 수 있어서 동시에 학습할 수 없다.
- **틀린 부분에 집중하는 방법은 두 가지다**: AdaBoost 는 틀린 샘플의 가중치를 올리고, gradient boosting 은 남은 오차를 다음 모델의 정답으로 쓴다.
- **Boosting 은 주로 bias 를 줄인다**: 너무 단순해서 생기는 오차를 줄인다. 모델들을 독립으로 학습해 평균하는 [[bagging]] 은 주로 variance 를 줄인다.
- **모델을 계속 더하면 학습 데이터의 우연한 흔들림까지 맞춘다**: 그래서 검증 데이터로 모델 수를 정하고, learning rate 로 한 번에 고치는 양을 줄인다.

# B) 틀린 부분에 집중하는 두 방법

## B.1) 틀린 샘플의 가중치를 올린다: AdaBoost

[[AdaBoost]] 는 샘플마다 가중치를 두고 시작한다. 처음에는 모든 집의 가중치가 같다.

1. 가중치를 반영해 약한 모델 하나를 학습한다.
2. 이 모델이 틀린 샘플의 가중치는 올리고, 맞힌 샘플의 가중치는 내린다.
3. 다음 모델은 바뀐 가중치로 학습하므로, 앞 모델이 틀린 샘플을 맞히는 쪽으로 만들어진다.
4. 이를 반복한 뒤, 모델마다 정확도에 따라 정한 비중으로 예측을 합친다. 많이 맞힌 모델일수록 비중이 크다.

가중치를 손실에 직접 곱하지 못하는 모델은, 가중치에 비례하는 확률로 샘플을 다시 뽑아 학습 데이터를 만든다. 그래서 "틀린 샘플이 더 자주 뽑히는 bootstrap" 으로 설명하기도 하지만, 핵심은 가중치다.

## B.2) 남은 오차를 다음 모델의 정답으로 쓴다: gradient boosting

[[Gradient Boosting Machine|Gradient boosting]] 은 샘플 가중치를 바꾸지 않는다. 대신 다음 모델이 맞출 정답 자체를 바꾼다.

- 실제 가격이 3.5 억인 집을 지금까지의 모델이 3.0 억으로 예측했다면, 다음 트리는 이 집에서 0.5 억을 정답으로 삼아 학습한다.
- 많이 틀린 집은 맞출 값이 커서 다음 트리가 크게 고치고, 이미 맞힌 집은 맞출 값이 0 에 가까워 거의 그대로 둔다.
- 예측은 모든 트리의 출력을 더해서 만든다. 실제로는 트리 출력에 learning rate 를 곱해 조금씩 더한다.

**AdaBoost 도 gradient boosting 의 특수한 경우로 볼 수 있다.**

- AdaBoost 가 하는 일은 지수 손실을 모델 하나씩 더해 가며 줄이는 것과 같다 (Friedman, Hastie, Tibshirani, 2000).
- 그래서 gradient boosting 에서 손실을 지수 손실로 두면 AdaBoost 를 다시 얻는다.
- 지금 많이 쓰는 boosting 라이브러리(XGBoost, LightGBM, CatBoost)는 모두 gradient boosting 방식이다.

# C) Boosting 은 bias 를, bagging 은 variance 를 줄인다

모델 여러 개를 합친다는 점은 [[bagging]] 과 같지만, 줄이는 오차가 다르다. 오차를 bias 와 variance 로 나누는 방법은 [[Bias-variance tradeoff]] 에 있다.

- **Boosting 은 bias 를 줄인다**: 얕은 트리 하나는 너무 단순해서 데이터의 실제 모양을 따라가지 못한다. 앞 트리가 틀린 구간을 다음 트리가 고치면서, 더한 결과는 얕은 트리 하나로는 못 그리는 복잡한 모양을 따라간다.
- **Bagging 은 variance 를 줄인다**: 학습 데이터가 조금만 바뀌어도 크게 흔들리는 깊은 트리 여러 개를 서로 독립으로 학습해 평균한다. 흔들림은 평균으로 줄지만, 모델이 단순해서 생기는 오차는 평균해도 그대로다.

같은 깊이 1 트리 100 개를 두 방식으로 합친 실험에서 차이가 숫자로 드러난다 ([[bagging]] 노트의 bagging 과 boosting 비교 절).

- 트리 하나: bias² 0.072, variance 0.040.
- Bagging 으로 평균: bias² 0.070, variance 0.019. bias 는 거의 그대로이고 variance 만 절반이 됐다.
- Boosting 으로 더함: bias² 0.009, variance 0.023. bias 가 8 분의 1 로 줄었다.

**그래서 boosting 에는 얕은 트리를, bagging 에는 깊은 트리를 쓴다.** 각 방식이 줄이지 못하는 오차를 기본 모델이 처음부터 작게 갖고 있어야 한다.

# D) 모델을 너무 많이 더하면

Bagging 은 모델을 아무리 늘려도 평균이 안정될 뿐이라 test 오차가 다시 오르지 않는다. Boosting 은 다르다.

- 모델을 더할수록 학습 데이터의 남은 오차가 계속 줄어든다.
- 진짜 패턴을 다 맞춘 뒤에도 더하면, 남은 오차에 섞인 우연한 흔들림까지 맞추기 시작한다.
- 그러면 학습 오차는 계속 줄지만 검증 오차는 다시 오른다. 이것이 [[overfitting]] 이다.

**그래서 boosting 은 한 번에 고치는 양과 모델 수를 함께 조절한다.**

- learning rate 를 작게 두어 트리 하나가 오차를 조금씩만 고치게 한다.
- 검증 오차가 몇 단계 동안 줄지 않으면 트리 추가를 멈춘다 (early stopping).
- 트리 깊이·잎 수를 제한해 트리 하나가 너무 많이 외우지 못하게 한다.

# E) 대표 알고리즘

- [[AdaBoost]]: 틀린 샘플의 가중치를 올리는 처음의 boosting 알고리즘.
- [[Gradient Boosting Machine|GBM]]: 남은 오차(손실의 negative gradient)를 다음 트리가 맞춘다.
- [[Extreme Gradient Boosting|XGBoost]]: GBM 에 정규화와 2차 미분을 더해 빠르고 정확하게 만든 라이브러리.
- [[LightGBM]]: 분할 후보를 구간으로 묶고, 효과가 큰 잎부터 나눠 학습을 빠르게 한 라이브러리.
- [[CatBoost]]: 범주형 feature 를 다루는 방식에 공을 들인 라이브러리.

# F) References

- Friedman, Hastie, Tibshirani, "Additive Logistic Regression: A Statistical View of Boosting", Annals of Statistics 28(2), 2000. https://doi.org/10.1214/aos/1016218223
- Hastie, Tibshirani, Friedman, The Elements of Statistical Learning, 2nd ed., Ch. 10 Boosting and Additive Trees.
