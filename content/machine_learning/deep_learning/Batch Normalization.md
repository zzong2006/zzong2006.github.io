---
title: "Batch Normalization (BN)"
aliases: ["BN"]
tags:
  - deep_learning
---

# A) Batch Normalization ?

Batch Normalization(BN)은 [[neural network]] 의 층 사이에서, 미니배치 안의 값들을 feature 마다 평균 0, 분산 1 로 맞춘 뒤 학습 가능한 크기와 위치를 다시 입히는 층이다. 학습을 빠르고 안정적으로 만들기 위해 쓴다 (Ioffe & Szegedy, 2015).

어떤 층의 feature 하나에 대해, 미니배치의 샘플 $n$ 개가 내놓은 값을 $x_1, \dots, x_n$ 이라고 하자. BN 은 각 값을 다음과 같이 바꾼다.

$$
\mu = \frac{1}{n}\sum_{i=1}^{n} x_i, \qquad
\sigma^2 = \frac{1}{n}\sum_{i=1}^{n} (x_i - \mu)^2, \qquad
y_i = \gamma\, \frac{x_i - \mu}{\sqrt{\sigma^2 + \epsilon}} + \beta
$$

| 기호 | 뜻 |
| --- | --- |
| $x_i$ | 미니배치의 $i$ 번째 샘플이 이 feature 에서 낸 값 |
| $n$ | 미니배치 크기 |
| $\mu$, $\sigma^2$ | 이 feature 의 미니배치 평균과 분산 |
| $\epsilon$ | 0 으로 나누는 것을 막는 작은 값 |
| $\gamma$, $\beta$ | feature 마다 하나씩 있는 학습 파라미터. 정규화된 값에 곱할 크기(scale)와 더할 위치(shift) |
| $y_i$ | BN 층의 출력 |

평균과 분산은 feature 마다 따로, 미니배치의 샘플들에 걸쳐 계산한다. 그래서 한 샘플의 출력이 같은 미니배치에 함께 들어온 다른 샘플들에 따라 달라진다. 이 점이 뒤의 학습·추론 차이와 [[layer normalization]] 과의 차이로 이어진다.

## A.1) $\gamma$ 와 $\beta$ 의 역할

정규화만 하면 모든 feature 가 평균 0, 분산 1 로 고정돼서, 다음 층이 받고 싶은 분포가 그와 다를 때 표현력이 줄어든다. 예를 들어 sigmoid 앞에서 모든 값을 0 근처로 모으면 sigmoid 의 거의 선형인 구간만 쓰게 된다.

$\gamma$ 와 $\beta$ 는 정규화된 값 위에 feature 마다 알맞은 크기와 위치를 학습으로 다시 입힌다. $\gamma = \sigma$, $\beta = \mu$ 로 학습되면 정규화를 정확히 되돌릴 수도 있으므로, BN 을 넣어서 모델이 표현할 수 있는 함수가 줄어들지는 않는다. 다만 $\gamma$, $\beta$ 는 학습이 끝나면 고정되는 값이라서, 정규화를 켰다 껐다 하는 스위치가 아니다. 추론 때도 정규화는 그대로 한다.

# B) 왜 학습에 도움이 되나

실험으로 확인된 효과는 다음과 같다.

- **더 큰 learning rate 를 쓸 수 있다.** 층의 입력 크기가 매 step 다시 맞춰지므로, 가중치가 크게 바뀌어도 다음 층으로 가는 값이 폭주하지 않는다.
- **가중치 초기화에 덜 민감하다.** 초기 가중치의 크기가 달라도 정규화가 출력 크기를 맞춘다.
- **약한 정규화 효과가 있다.** 같은 샘플이라도 어떤 샘플들과 같은 미니배치에 들어가느냐에 따라 $\mu$, $\sigma$ 가 달라져 출력에 잡음이 섞인다. 이 잡음이 [[dropout]] 처럼 학습 데이터를 그대로 외우기 어렵게 만든다.

왜 이런 효과가 나는지에 대한 설명은 바뀌어 왔다. 원 논문은 앞 층의 가중치가 바뀔 때마다 다음 층이 받는 입력 분포가 달라지는 현상(internal covariate shift)을 줄여서라고 설명했다. 이후 Santurkar et al. (2018) 은 BN 을 넣은 뒤 일부러 입력 분포를 흔들어도 학습이 여전히 잘 된다는 실험을 보이고, BN 이 loss 곡면을 매끄럽게 만들어 gradient 가 덜 급변하게 하는 것이 주된 이유라고 주장했다.

# C) 학습과 추론에서 다르게 동작한다

## C.1) 추론 때는 학습 중 모아 둔 통계를 쓴다

학습 때는 미니배치마다 $\mu$, $\sigma^2$ 를 새로 계산한다. 서비스에서 요청이 하나씩 들어오면 미니배치가 없거나 크기가 1 이라 이 값을 계산할 수 없다. 계산한다 해도 같은 입력의 출력이 함께 들어온 다른 요청에 따라 달라진다.

그래서 BN 은 학습 중에 미니배치 통계의 [[exponential moving average|지수이동평균]]을 따로 모아 둔다. 이를 running mean, running variance 라고 한다. PyTorch 기본값으로는 매 step 다음과 같이 갱신한다.

$$
\hat\mu \leftarrow 0.9\,\hat\mu + 0.1\,\mu_{\text{batch}}, \qquad
\hat\sigma^2 \leftarrow 0.9\,\hat\sigma^2 + 0.1\,\sigma^2_{\text{batch}}
$$

추론 때는 미니배치 통계 대신 이 $\hat\mu$, $\hat\sigma^2$ 를 고정값으로 쓴다. 그러면 BN 은 입력마다 같은 수를 빼고 나누는 고정된 선형 변환이 되고, 요청이 하나여도 계산할 수 있으며, 같은 입력은 항상 같은 출력을 낸다.

| | 학습 (`model.train()`) | 추론 (`model.eval()`) |
| --- | --- | --- |
| 정규화에 쓰는 평균·분산 | 지금 미니배치의 값 | 학습 중 모은 running 값 (고정) |
| running 통계 | 매 step 갱신 | 갱신하지 않음 |
| 한 샘플의 출력 | 같은 미니배치의 다른 샘플에 따라 달라짐 | 입력에만 의존 |

## C.2) `eval()` 을 빠뜨리면

PyTorch 에서는 `model.eval()` 이 BN 을 추론 동작으로 바꾼다. 이를 빠뜨리고 추론하면 BN 이 학습 동작 그대로 돈다. feature 하나짜리 `BatchNorm1d` 를 평균 5, 표준편차 2 인 데이터로 학습시켜 running 통계를 쌓은 뒤 확인하면 다음과 같다.

| 상황 | 입력 7 의 출력 |
| --- | --- |
| 학습 모드, `[7, 3, 5, 4]` 와 함께 입력 | 1.52 |
| 학습 모드, `[7, 9, 10, 8]` 과 함께 입력 | -1.34 |
| 학습 모드, 7 하나만 입력 | 오류 (`Expected more than 1 value per channel when training`) |
| 추론 모드, 어떤 묶음으로 넣어도 | 1.00 |

추론 모드의 1.00 은 running 평균 4.98, running 분산 4.06 으로 계산한 $(7 - 4.98)/\sqrt{4.06}$ 이다. 학습 모드에서는 같은 입력 7 이 함께 들어온 값들에 따라 부호까지 바뀐다. 요청 하나만 넣으면 분산이 0 이라 PyTorch 가 오류를 낸다.

running 통계도 망가진다. 학습 모드로 평균 50 인 데이터를 50 번 넣었더니 running 평균이 4.98 에서 49.77 로 바뀌었다. 추론 데이터의 분포가 학습 데이터와 다르면, 그 뒤로는 `eval()` 을 켜도 틀린 통계로 정규화하게 된다.

[[dropout]] 도 학습과 추론에서 동작이 다른 층이라 `eval()` 로 함께 전환된다.

# D) 정규화 축: BatchNorm 과 LayerNorm

미니배치를 행이 샘플, 열이 feature 인 표로 놓으면 두 정규화의 차이는 평균과 분산을 어느 방향으로 계산하느냐다.

```
              feature 1  feature 2  feature 3
 샘플 1    [    x11        x12        x13    ]  ← LayerNorm: 행 하나 안에서
 샘플 2    [    x21        x22        x23    ]
 샘플 3    [    x31        x32        x33    ]
                 ↑
          BatchNorm: 열 하나 안에서 (샘플들에 걸쳐)
```

| | BatchNorm | LayerNorm |
| --- | --- | --- |
| 평균·분산을 구하는 범위 | feature 하나, 미니배치의 모든 샘플 | 샘플 하나, 그 샘플의 모든 feature |
| 다른 샘플에 의존하는가 | 의존한다 | 의존하지 않는다 |
| 학습과 추론의 동작 | 다르다 (running 통계) | 같다 |
| 주로 쓰는 곳 | CNN | Transformer, RNN |

CNN 에서는 채널 하나를 feature 하나로 보고, 미니배치의 샘플과 이미지의 모든 위치(높이 × 너비)에 걸쳐 평균과 분산을 구한다.

BN 은 미니배치 통계에 기대므로, 미니배치가 작으면 통계가 불안정해 효과가 떨어진다. 길이가 제각각인 시퀀스나 토큰을 하나씩 생성하는 모델처럼 미니배치 통계를 의미 있게 구하기 어려운 경우에는 LayerNorm 을 쓴다. 그 이유는 layer normalization 노트에 있다.

# References

- Sergey Ioffe, Christian Szegedy, "[Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift](https://arxiv.org/abs/1502.03167)", ICML 2015.
- Shibani Santurkar, Dimitris Tsipras, Andrew Ilyas, Aleksander Madry, "[How Does Batch Normalization Help Optimization?](https://arxiv.org/abs/1805.11604)", NeurIPS 2018.
- https://nenadmarkus.com/p/fusing-batchnorm-and-conv/
