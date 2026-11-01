---
title: "InfoNCE"
tags: ["loss_function", "contrastive_learning", "retrieval"]
aliases: ["InfoNCE", "Info-NCE"]
---

"강아지가 공원에서 뛰어논다" 와 뜻이 같은 문장을 후보 네 개 중에서 고르는 문제를 생각하자. 후보는 "개가 잔디밭을 달린다", "고양이가 공원에서 졸고 있다", "오늘 코스피가 2% 올랐다", "파스타 면은 8분 삶는다" 다.

InfoNCE 는 임베딩 학습을 이런 객관식 문제로 바꾼다. 정답(positive) 하나와 오답(negative) 여러 개를 한꺼번에 놓고, 모델이 정답을 고를 확률을 높인다.

# A) 한눈에 보기

**InfoNCE 는 "N 개 후보 중 positive 를 맞히는 분류 문제" 의 cross-entropy loss 다.**

- 후보는 positive 1 개와 negative N − 1 개다.
- 후보마다 anchor 와의 유사도를 점수로 쓰고, softmax 로 확률을 만든다.
- negative 를 여러 개 한꺼번에 보므로, 그중 헷갈리는 negative 에 저절로 힘이 몰린다.

Contrastive learning 이라는 학습 방식 안에서 InfoNCE 가 어디에 있는지, [[retrieval/concepts/Triplet Loss|Triplet Loss]] 와 무엇이 다른지는 [[contrastive learning|Contrastive Learning]] 노트에서 같은 예시로 비교한다. 이 노트는 InfoNCE 자체의 식과 설정을 다룬다.

# B) 식

$$
\mathcal{L}_{\text{InfoNCE}} = -\log \frac{\exp\big(s(q, k^+)/\tau\big)}{\sum_{i=0}^{K} \exp\big(s(q, k_i)/\tau\big)}
$$

- $q$ 는 기준이 되는 쪽(anchor, query)이다.
- $k^+$ 는 positive 다. $k_i$ 는 positive 를 포함한 후보 전체다.
- $s(\cdot,\cdot)$ 는 유사도다. 보통 cosine 유사도나 내적을 쓴다.
- $\tau$ 는 temperature 다. 유사도 차이를 얼마나 크게 볼지 정한다.

분수 부분은 [[softmax function|softmax]] 로 계산한 positive 의 확률이다. 여기에 −log 를 씌웠으니 정답이 positive 인 분류 문제의 [[cross-entropy]] 와 같은 식이다.

# C) Step by Step 예시

anchor 와 네 후보의 cosine 유사도가 다음과 같다고 하자.

| 이름 | 문장 | cosine 유사도 |
| --- | --- | --- |
| p (positive) | 개가 잔디밭을 달린다 | 0.8 |
| n1 (negative) | 고양이가 공원에서 졸고 있다 | 0.6 |
| n2 (negative) | 오늘 코스피가 2% 올랐다 | 0.1 |
| n3 (negative) | 파스타 면은 8분 삶는다 | 0.0 |

temperature 0.1 로 계산한다.

1. 유사도를 τ 로 나눈다: p 8, n1 6, n2 1, n3 0
2. exp 를 씌운다: 2981, 403, 2.7, 1
3. 합으로 나눠 확률을 만든다: p 0.880, n1 0.119, n2 0.0008, n3 0.0003
4. positive 확률에 −log 를 씌운다: −log 0.880 = **0.128**

**negative 는 자기 softmax 확률만큼 밀려난다.**

- negative $k$ 의 유사도에 대한 기울기가 $P_k/\tau$ 다.
- 이 예시에서 n1 은 n2 보다 약 150 배(0.119 ÷ 0.0008) 세게 밀린다.
- 헷갈리는 negative 가 어느 것인지 알려 주지 않아도 softmax 가 확률로 골라낸다.

# D) Temperature

같은 네 후보를 temperature 0.1 과 1 로 계산하면 확률 배분이 크게 달라진다. 막대 길이가 각 후보의 softmax 확률이다.

![[img-faae101dee.png]]

**temperature 가 작으면 가장 헷갈리는 negative 에 힘을 몰아주고, 크면 모든 negative 를 비슷하게 민다.**

- 0.1 에서는 negative 몫의 99% 를 n1 이 가져간다.
- 1 에서는 n1 46%, n2 28%, n3 25% 로 고르게 나뉜다. 이미 먼 n2, n3 도 계속 밀린다.
- loss 값도 0.128 에서 1.017 로 커진다. 유사도 차이가 작아 보여서 positive 를 확신하지 못하기 때문이다.

**temperature 는 너무 작아도, 너무 커도 표현이 나빠진다.**

- SimCLR 는 배치 4,096 에서 temperature 만 바꿔 ImageNet linear evaluation 정확도를 비교했다 (0.05 59.7% → 0.1 64.4% → 0.5 60.7% → 1 58.0%).
- 너무 작으면 가장 가까운 negative 하나에만 반응한다. 그 negative 가 사실 정답(false negative)이어도 그대로 밀어낸다.

자주 쓰는 값은 0.05 에서 0.1 사이다.

- MoCo 는 0.07 로 고정했다.
- CLIP 은 temperature 를 학습되는 값으로 두고 0.07 에서 시작했다.

# E) In-batch Negative

**InfoNCE 는 negative 를 따로 모으지 않고, 같은 배치에 들어 있는 다른 샘플의 정답을 negative 로 재활용한다.**

DPR 의 질문-문단 검색으로 보면 다음과 같다.

- 배치에 (질문, 정답 문단) 쌍이 B 개 있다.
- 질문 임베딩 B 개와 문단 임베딩 B 개를 곱하면 B × B 유사도 행렬이 나온다.
- 대각선이 positive 이고, 나머지 B − 1 개가 그 질문의 negative 다.
- 문단 임베딩을 한 번만 계산해 B 개 질문이 함께 쓰므로 추가 계산이 거의 없다.

```text
         문단1  문단2  문단3  문단4
질문1  [  +     -      -      -  ]
질문2  [  -     +      -      -  ]
질문3  [  -     -      +      -  ]
질문4  [  -     -      -      +  ]
```

**배치가 크면 negative 가 많아지고, 그 안에 헷갈리는 negative 가 들어갈 가능성도 커진다.**

- SimCLR 는 이미지 N 장을 두 번씩 변형해 2N 장을 만들고, positive 짝을 뺀 2(N − 1) 장을 negative 로 쓴다. 배치 4,096 이 기본값이다.
- CLIP 은 배치 32,768 을 썼다.
- DPR 는 배치 128 에 BM25 상위 오답 문단을 질문마다 1 개씩 더했다. 무작위 negative 만으로는 헷갈리는 문단이 부족하기 때문이다 ([[hard negative]]).

**배치를 키울 수 없으면 negative 수를 배치와 떼어 놓는다.**

- MoCo 는 지난 미니배치들의 임베딩을 큐(queue)에 쌓아 negative 로 쓴다. 가장 오래된 배치를 빼고 새 배치를 넣는다.

# F) 이름과 원래 식

InfoNCE 라는 이름은 CPC(Contrastive Predictive Coding, van den Oord et al., 2018)에서 붙었다.

- NCE 는 Noise-Contrastive Estimation 이다. 진짜 샘플과 잡음 샘플을 구분하게 해서 확률 분포를 추정하는 기법(Gutmann & Hyvärinen, 2010)이다. InfoNCE 는 이 아이디어에 기반한다.
- Info 는 상호정보량(mutual information)이다. InfoNCE 를 줄이면 두 대상 사이 [[mutual information|상호정보량]]의 하한이 올라간다.

CPC 의 원래 식에는 temperature 가 없다.

- 점수로 $f(x, c) = \exp(z^\top W c)$ 를 쓴다. $z$ 는 맞힐 대상의 임베딩, $c$ 는 앞부분 문맥의 임베딩이다.
- cosine 유사도를 temperature 로 나누는 형태는 이후 연구(Wu et al., 2018, MoCo, SimCLR)에서 자리 잡았다.

CPC 는 상호정보량과의 관계를 다음 부등식으로 보였다. $N$ 은 후보 수다.

$$
I(x; c) \ge \log N - \mathcal{L}_N
$$

**후보가 적으면 loss 를 아무리 줄여도 보일 수 있는 상호정보량에 한계가 있다.**

- loss 는 0 보다 작아질 수 없으므로, 하한은 $\log N$ 을 넘지 못한다.
- 이 노트의 예시처럼 후보가 4 개면 그 한계는 log 4 ≈ 1.39 다.
- 논문은 N 이 클수록 이 하한이 실제 값에 가까워진다고 쓴다. negative 를 많이 쓰는 이유 중 하나다.

# G) 변형들

- **NT-Xent** (Normalized Temperature-scaled Cross Entropy): SimCLR 가 붙인 이름이다. cosine 유사도를 temperature 로 나눈 InfoNCE 이고, 같은 짝을 (i, j) 와 (j, i) 두 방향으로 모두 계산한다.
- **대칭 InfoNCE**: CLIP 은 이미지 → 텍스트 방향과 텍스트 → 이미지 방향의 loss 를 각각 구해 평균한다.
- **SupCon** (Supervised Contrastive): 라벨이 있을 때 같은 클래스의 샘플을 모두 positive 로 둔다.
- **N-pair loss** (Sohn, 2016): positive 하나와 negative 여러 개를 softmax 로 비교하는, InfoNCE 와 거의 같은 형태다. SimCLR 는 NT-Xent 의 선행 연구로 이 논문을 든다.

# H) 대표적 활용

1. **SimCLR, MoCo**: 이미지 표현 학습
2. **[[CLIP]]**: 이미지와 텍스트를 한 공간에 놓는 학습
3. **Dense Retrieval**: [[DPR]], [[papers/advertisement/UniERF - A Uniform Embedding-based Retrieval Framework for E-Commerce Search|UniERF]] 등 two-tower 검색 모델
4. **Sentence Embedding**: SimCSE, E5

# I) References

- [Representation Learning with Contrastive Predictive Coding (van den Oord et al., 2018)](https://arxiv.org/abs/1807.03748)
- [Noise-contrastive estimation: A new estimation principle for unnormalized statistical models (Gutmann & Hyvärinen, AISTATS 2010)](https://proceedings.mlr.press/v9/gutmann10a.html)
- [A Simple Framework for Contrastive Learning of Visual Representations (SimCLR, Chen et al., ICML 2020)](https://arxiv.org/abs/2002.05709)
- [Momentum Contrast for Unsupervised Visual Representation Learning (MoCo, He et al., CVPR 2020)](https://arxiv.org/abs/1911.05722)
- [Dense Passage Retrieval for Open-Domain Question Answering (DPR, Karpukhin et al., EMNLP 2020)](https://arxiv.org/abs/2004.04906)
- [Learning Transferable Visual Models From Natural Language Supervision (CLIP, Radford et al., ICML 2021)](https://arxiv.org/abs/2103.00020)
