---
title: "Class Imbalance Problem"
tags: classification 
aliases: ["imbalanced data"]
---

# A) Class Imbalance Problem ?

분류 문제에서 클래스마다 샘플 수가 크게 차이 나는 데이터를 imbalanced data 라고 한다. 사기 거래 탐지, 유해 문서 판별, 광고 클릭 예측처럼 찾으려는 사건이 드문 문제는 대부분 이렇다. 아래에서는 드문 쪽을 positive, 흔한 쪽을 negative 라고 부른다.

불균형이 문제가 되는 이유는 두 가지다.

- **학습이 흔한 클래스 쪽으로 쏠린다.** loss 는 샘플마다 더해지므로, positive 가 1% 면 loss 의 대부분이 negative 에서 나온다. 모델은 negative 를 잘 맞히는 쪽으로 먼저 학습된다.
- **평가 지표가 실제 성능을 가린다.** positive 가 1% 인 데이터에서 모든 샘플을 negative 로 예측해도 accuracy 는 99% 다.

# B) 평가부터 맞춘다

대응 방법을 고르기 전에, 불균형을 반영하는 지표로 평가하고 있는지부터 확인한다.

- accuracy 대신 positive 에 대한 precision, recall, PR curve 와 Average Precision 을 본다. positive 가 1% 면 PR curve 에서 무작위로 예측한 모델의 기준선은 0.5 가 아니라 0.01 이다.
- ROC curve 의 FPR 은 분모가 negative 전체라서, negative 가 압도적으로 많으면 false positive 가 많아도 FPR 이 작게 나온다. ROC-AUC 만 보면 낙관적으로 보이기 쉽다.
- 평가 데이터는 원래 분포 그대로 둔다. 아래의 리샘플링은 학습 데이터에만 적용한다.

지표와 threshold 를 함께 고르는 방법, ROC 가 낙관적으로 보이는 숫자 예시는 [[분류 모델의 학습과 평가]] 노트의 "불균형 데이터에서는 positive를 얼마나 믿을 수 있는가" 절에 있다.

# C) 대응 방법

| 방법 | 하는 일 | 주의할 점 |
| --- | --- | --- |
| 그대로 학습하고 threshold 만 옮긴다 | 0.5 대신 검증 데이터에서 고른 threshold 로 판정한다 | 가장 먼저 시도한다. 확률이 그대로 보존된다 |
| negative undersampling | negative 중 일부만 무작위로 남겨 학습한다 | 버린 negative 의 정보를 잃는다. 학습 비용은 줄어든다 |
| positive oversampling | positive 를 복제하거나(SMOTE 처럼) 비슷한 샘플을 합성해 늘린다 | 같은 positive 를 반복해 보므로 그 샘플들에 [[overfitting]] 하기 쉽다 |
| class weight | loss 에서 positive 샘플의 가중치를 키운다 | 효과는 oversampling 과 비슷하지만 데이터를 늘리지 않는다 |
| focal loss | 이미 잘 맞힌 쉬운 샘플의 loss 를 줄여, 어려운 샘플에 학습이 집중되게 한다 | 쉬운 negative 가 아주 많은 경우(물체 탐지 등)에 쓴다 |

첫 줄을 먼저 시도하는 이유는, 모델 자체가 positive 를 잘 구분하는데 threshold 0.5 가 맞지 않아서 recall 이 낮은 경우가 많기 때문이다. 이때는 threshold 만 옮기면 된다.

focal loss 의 식과 효과는 [[Focal Loss와 Gradient Blending]] 노트에 있다.

# D) 리샘플링과 class weight 는 확률을 부풀린다

undersampling, oversampling, class weight 는 모두 모델이 보는 positive 의 비율을 실제보다 키운다. positive 가 1% 인 데이터를 50% 처럼 보여 주고 학습시키면, 모델은 positive 확률을 체계적으로 높게 예측한다. 반면 샘플들의 점수 순서는 거의 그대로다.

## D.1) 시뮬레이션으로 확인하기

positive 비율이 약 1% 인 데이터 20 만 개로 [[logistic regression]] 을 학습하고, 같은 방식으로 만든 test 데이터 20 만 개로 평가했다. feature 5 개 중 3 개만 positive 에서 평균이 조금 높게 만들었다.

1. 그대로 학습한다.
2. negative 를 1.01% 만 남겨(positive 비율 약 50%) 학습한다.
3. 2 의 예측을 아래 D.2 의 식으로 되돌린다.
4. scikit-learn `class_weight="balanced"` 로 학습한다.

| 방법 | ROC-AUC | Average Precision | 예측 확률의 평균 | log loss | recall 80% 에서의 precision | 그때의 threshold |
| --- | --- | --- | --- | --- | --- | --- |
| 그대로 학습 | 0.842 | 0.094 | 0.010 | 0.046 | 0.029 | 0.009 |
| negative undersampling | 0.842 | 0.094 | 0.331 | 0.496 | 0.029 | 0.468 |
| undersampling + 되돌리기 | 0.842 | 0.094 | 0.010 | 0.046 | 0.029 | 0.009 |
| class weight | 0.842 | 0.095 | 0.329 | 0.493 | 0.029 | 0.465 |

test 데이터의 실제 positive 비율은 0.99% 다.

- **순위를 보는 지표는 그대로다.** ROC-AUC, Average Precision, 같은 recall 에서의 precision 이 네 방법에서 모두 같다. 판정 품질은 바뀌지 않았고, 같은 판정을 내리는 threshold 의 위치만 0.009 에서 0.47 근처로 옮겨 갔다.
- **확률의 절대값은 틀어졌다.** undersampling 과 class weight 는 실제 비율이 1% 인데 평균 33% 를 예측한다. 확률 자체의 정확도를 보는 log loss 는 0.046 에서 0.496 으로 10 배 넘게 나빠졌다.
- **되돌리면 원래대로 돌아온다.** D.2 의 식으로 바꾼 확률은 그대로 학습한 모델과 평균, log loss 가 같다.

이 실험에서 순위가 정확히 같은 것은 logistic regression 의 특성이다. logistic regression 에서 negative 를 무작위로 버리면, 이론적으로 절편만 바뀌고 기울기는 거의 그대로다. 신경망이나 트리 모델에서는 학습에 쓴 데이터가 달라지므로 순위도 조금 달라질 수 있지만, 확률이 부풀려지는 방향은 같다.

## D.2) 확률을 되돌리는 방법

threshold 를 넘었는지만 보는 판정에는 부풀려진 확률도 문제가 없다. threshold 를 검증 데이터에서 다시 고르면 된다. 문제가 되는 것은 확률값 자체를 쓰는 경우다. 광고 경매에서 예측 클릭률에 입찰가를 곱해 순위를 매기거나, 여러 모델의 점수를 더하거나, 기대 비용으로 의사결정을 하는 경우가 그렇다.

negative 를 비율 $w$ 로 무작위 undersampling 했다면 다음 식으로 되돌린다.

$$
p = \frac{p'}{p' + (1 - p')/w}
$$

| 기호 | 뜻 |
| --- | --- |
| $p'$ | undersampling 한 데이터로 학습한 모델의 예측 |
| $w$ | negative 를 남긴 비율. 위 실험에서는 0.0101 |
| $p$ | 원래 분포 기준으로 되돌린 확률 |

이 식이 나오는 과정과, 식으로 되돌릴 수 없는 경우에 쓰는 Platt scaling, isotonic regression 은 [[probability calibration]] 노트에 있다. class weight 를 썼을 때도 같은 식에서 $w$ 를 negative 가중치 ÷ positive 가중치로 두면 근사적으로 되돌릴 수 있지만, 원래 분포의 검증 데이터로 calibration 을 다시 맞추는 쪽이 확실하다.

# E) 무엇을 고르나

1. 먼저 그대로 학습하고, 불균형을 반영하는 지표로 평가하고, 검증 데이터에서 threshold 를 고른다.
2. positive 를 잘 구분하지 못하면 class weight 나 oversampling 으로 positive 쪽 학습 신호를 키운다. 판정만 쓴다면 확률 보정은 필요 없다.
3. negative 가 너무 많아 학습 비용이 문제면 negative undersampling 을 쓴다. 광고 클릭 예측에서 흔한 방식이다. 확률을 쓰는 서비스라면 D.2 의 식으로 반드시 되돌린다.
