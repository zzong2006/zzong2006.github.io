---
title: "Layer Normalization"
tags:
  - deep_learning
  - machine_learning
aliases: []
---

# A) Layer Normalization ?

Layer Normalization(LN)은 샘플 하나의 hidden 벡터 안에서, 그 벡터의 모든 차원에 걸쳐 평균 0, 분산 1 로 맞춘 뒤 학습 가능한 크기와 위치를 다시 입히는 층이다 (Ba et al., 2016). Transformer 의 모든 블록에 들어간다.

hidden 차원이 $H$ 인 벡터 $\boldsymbol{x} = (x_1, \dots, x_H)$ 하나에 대해 다음과 같이 계산한다.

$$
\mu = \frac{1}{H}\sum_{k=1}^{H} x_k, \qquad
\sigma^2 = \frac{1}{H}\sum_{k=1}^{H} (x_k - \mu)^2, \qquad
y_k = \gamma_k\, \frac{x_k - \mu}{\sqrt{\sigma^2 + \epsilon}} + \beta_k
$$

| 기호 | 뜻 |
| --- | --- |
| $x_k$ | 벡터의 $k$ 번째 차원 값. Transformer 에서는 토큰 하나의 hidden 벡터 |
| $H$ | hidden 차원 수 |
| $\mu$, $\sigma^2$ | 이 벡터 하나의 모든 차원에 걸친 평균과 분산 |
| $\gamma_k$, $\beta_k$ | 차원마다 하나씩 있는 학습 파라미터. 정규화된 값에 곱할 크기와 더할 위치 |
| $\epsilon$ | 0 으로 나누는 것을 막는 작은 값 |

[[Batch Normalization]] 과 식의 모양은 같지만 평균과 분산을 구하는 방향이 다르다. BN 은 feature 하나를 미니배치의 여러 샘플에 걸쳐 정규화하고, LN 은 샘플 하나를 그 샘플의 여러 차원에 걸쳐 정규화한다. 그래서 LN 의 출력은 같은 미니배치의 다른 샘플과 무관하다. 두 방향을 표로 비교한 그림은 Batch Normalization 노트의 "정규화 축" 절에 있다.

# B) Transformer 가 BatchNorm 대신 LayerNorm 을 쓰는 이유

BN 은 미니배치 안의 다른 샘플들로 통계를 구하는데, Transformer 가 다루는 텍스트에서는 그 통계가 불안정하거나 아예 의미가 없다.

- **시퀀스 길이가 제각각이다.** 미니배치 안의 문장들은 길이가 달라 짧은 문장 뒤를 padding 으로 채운다. 위치마다 실제 토큰이 있는 샘플 수가 달라지고, padding 이 통계에 섞이면 평균과 분산이 왜곡된다.
- **미니배치가 작다.** 긴 시퀀스와 큰 모델은 메모리를 많이 써서 장치 하나에 들어가는 미니배치가 작다. 샘플이 적으면 미니배치 통계의 잡음이 커진다.
- **생성할 때는 미니배치 통계가 없다.** 언어 모델은 토큰을 하나씩 이어서 생성하므로, 추론 때 한 번에 처리하는 것은 시퀀스 하나의 토큰 하나뿐이다.

LN 은 토큰 하나의 hidden 벡터 안에서 통계를 구하므로 미니배치 크기와 시퀀스 길이에 영향받지 않는다. 학습 때와 추론 때 계산이 똑같아서 BN 처럼 running 통계를 따로 모을 필요도 없고, `model.eval()` 을 빠뜨려도 LN 의 결과는 달라지지 않는다.

# C) Transformer 블록 안에서의 위치: Post-LN 과 Pre-LN

Transformer 블록에서 LN 을 [[skip connection]] 의 어디에 두느냐에 따라 두 방식이 있다.

![[img-07d75b42c6.png|500]]

## C.1) Post-LN

[[transformer]] 원 논문에서 쓴 방식으로, sub-layer 의 출력을 skip connection 으로 더한 다음에 정규화한다.

층이 깊어지면 학습 초반 [[gradient]] 가 발산하는 경우가 있어 학습이 까다롭다. 그래서 [[Learning rate]] 를 작은 값에서 시작해 목표값까지 서서히 올리는 learning rate warm-up 을 함께 쓴다.

## C.2) Pre-LN

sub-layer 에 들어가기 전에 먼저 정규화하고, 그 출력을 skip connection 으로 더한다. skip connection 경로에는 정규화가 끼지 않아 gradient 가 그대로 흐르므로 더 안정적이고, warm-up 없이도 학습되는 경우가 많다고 보고됐다 (Xiong et al., 2020). 최근 대형 언어 모델은 대부분 Pre-LN 이나 그 변형을 쓴다.

# References

- Jimmy Lei Ba, Jamie Ryan Kiros, Geoffrey E. Hinton, "[Layer Normalization](https://arxiv.org/abs/1607.06450)", 2016.
- Ruibin Xiong et al., "[On Layer Normalization in the Transformer Architecture](https://arxiv.org/abs/2002.04745)", ICML 2020.
