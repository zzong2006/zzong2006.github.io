---
title: "Triplet Loss"
tags:
  - loss_function
  - metric_learning
  - retrieval
aliases: [Triplet Loss, triplet loss]
---

"강아지가 공원에서 뛰어논다" 를 기준으로, "개가 잔디밭을 달린다" 는 가깝게, "고양이가 공원에서 졸고 있다" 는 멀게 임베딩을 배치하고 싶다고 하자.

Triplet Loss 는 이 세 문장을 한 묶음(triplet)으로 보고 **"positive 가 negative 보다 일정 거리 이상 더 가까워야 한다"** 는 조건 하나를 학습한다.

# A) 한눈에 보기

**Triplet Loss 는 anchor, positive, negative 세 개의 거리 차이에 margin 을 거는 loss 다.**

- anchor 는 기준 샘플, positive 는 anchor 와 같은 것, negative 는 다른 것이다.
- negative 가 positive 보다 margin 이상 멀면 loss 가 0 이고, 더 배우지 않는다.
- 그래서 학습에 쓸 negative 를 잘 고르는 일(mining)이 성능을 좌우한다.

Contrastive learning 안에서 Triplet Loss 가 어디에 있는지, [[InfoNCE]] 와 무엇이 다른지는 [[contrastive learning|Contrastive Learning]] 노트에서 같은 예시로 비교한다. 이 노트는 Triplet Loss 자체의 식과 mining 을 다룬다.

# B) 식

$$
\mathcal{L}_{\text{triplet}} = \max\big(0,\ d(a, p) - d(a, n) + m\big)
$$

- $a$, $p$, $n$ 은 anchor, positive, negative 의 임베딩이다.
- $d(\cdot,\cdot)$ 는 거리다.
- $m$ 은 margin 이다. positive 와 negative 사이에 확보할 거리 차이다.

괄호 안을 말로 풀면 "positive 까지 거리 + margin 이 negative 까지 거리보다 얼마나 넘치나" 다. 넘치지 않으면 0 이다.

거리는 보통 두 가지 중 하나를 쓴다.

- FaceNet 은 임베딩 길이를 1 로 맞춘 뒤 squared L2 거리를 쓰고, margin 을 0.2 로 뒀다.
- 이 노트의 예시는 1 − cosine 유사도를 거리로 쓴다.
- 길이가 1 인 벡터에서는 squared L2 거리가 2 × (1 − cosine 유사도) 다. 두 방식은 margin 의 크기만 다르고 결과는 같다.

# C) Step by Step 예시

anchor 는 "강아지가 공원에서 뛰어논다" 이고, margin 은 0.3 이다.

| 이름 | 문장 | anchor 와의 거리 (1 − cosine) |
| --- | --- | --- |
| p (positive) | 개가 잔디밭을 달린다 | 0.2 |
| n1 (negative) | 고양이가 공원에서 졸고 있다 | 0.4 |
| n2 (negative) | 오늘 코스피가 2% 올랐다 | 0.9 |
| n3 (negative) | 파스타 면은 8분 삶는다 | 1.0 |

negative 마다 triplet 을 하나씩 만들어 계산한다.

- (a, p, n1): max(0, 0.2 − 0.4 + 0.3) = **0.1**
- (a, p, n2): max(0, 0.2 − 0.9 + 0.3) = **0**
- (a, p, n3): max(0, 0.2 − 1.0 + 0.3) = **0**

**세 triplet 중 학습 신호를 주는 것은 n1 하나뿐이다.**

- n1 은 positive 보다 0.2 멀다. margin 0.3 에 0.1 이 모자라서 더 밀려난다. 동시에 positive 는 더 당겨진다.
- n2, n3 은 이미 margin 보다 멀어서 loss 도 기울기도 0 이다.

# D) Negative 의 세 종류

FaceNet 은 negative 를 anchor 와의 거리로 세 종류로 나눈다. 아래 그림에서 점의 위치가 anchor 와의 거리다.

![[img-e26e9441bb.png]]

- **hard**: positive 보다도 가깝다. 지금 모델이 positive 와 negative 를 거꾸로 놓고 있다.
- **semi-hard**: positive 보다는 멀지만 margin 안쪽이다. 예시의 n1 이 여기 있다.
- **easy**: margin 바깥이다. 예시의 n2, n3 이 여기 있고, loss 가 0 이다.

hard 의 예를 하나 더 들면, "강아지가 공원에서 잠을 잔다" 가 거리 0.15 로 positive(0.2)보다 가깝게 놓여 있다고 하자. loss 는 max(0, 0.2 − 0.15 + 0.3) = 0.35 로, semi-hard 인 n1 보다 크다.

**가장 어려운 negative 만 고르면 오히려 학습이 망가질 수 있다.**

- FaceNet 은 학습 초반에 hardest negative 만 고르면 나쁜 지역 최솟값에 빠지고, 모든 입력을 한 점(f(x) = 0)으로 보내는 붕괴(collapse)가 생길 수 있다고 보고했다.
- 라벨이 잘못된 샘플이나 품질이 나쁜 사진이 hardest 자리를 차지하기도 한다.
- 그래서 FaceNet 은 semi-hard negative 를 골랐다.

# E) Mining: 학습할 negative 고르기

**easy negative 로 만든 triplet 은 loss 가 0 이라 계산만 하고 학습에는 쓰이지 않는다.** 그래서 학습에 쓸 triplet 을 고르는 과정이 따로 필요하다.

FaceNet 이 고려한 두 방법은 다음과 같다.

- **offline**: 몇 step 마다 최신 모델로 데이터 일부의 거리를 계산해 triplet 을 미리 만든다.
- **online**: 미니배치 안에서 바로 고른다. FaceNet 은 이 방법을 주로 썼다.

online mining 은 배치 구성이 중요하다.

- 배치 안에 같은 사람 사진이 여러 장 있어야 positive 를 만들 수 있다. FaceNet 은 한 사람당 약 40 장을 넣었다.
- 배치 안 후보가 많아야 semi-hard negative 가 들어 있다. FaceNet 은 배치를 약 1,800 장으로 잡았다.

배치 안에서 triplet 을 고르는 대표 방식 두 가지가 있다 (Hermans et al., 2017).

- **Batch Hard**: anchor 마다 배치 안에서 가장 먼 positive 와 가장 가까운 negative 를 골라 triplet 하나를 만든다.
- **Batch All**: 배치 안에서 만들 수 있는 유효한 triplet 을 모두 쓴다. loss 가 0 인 triplet 이 평균을 낮추지 않도록 0 이 아닌 것만 평균하는 변형도 있다.
- 이 논문의 사람 재식별 실험에서는 Batch Hard 가 Batch All 보다 꾸준히 좋았다.

# F) 변형들

- **Lifted Structured Loss** (Song et al., 2016): 배치 안의 모든 positive 쌍과 negative 쌍을 한꺼번에 쓴다.
- **N-pair Loss** (Sohn, 2016): negative 하나 대신 여러 개를 softmax 로 동시에 비교한다. [[InfoNCE]] 와 거의 같은 형태다.

# G) 활용

1. **Face Recognition**: FaceNet 이 대규모로 쓰며 널리 알려졌다. 논문은 이 loss 가 LMNN(Weinberger et al.)에 기반한다고 밝힌다.
2. **Image Retrieval**: 유사 이미지 검색, 사람 재식별(re-identification)
3. **E-commerce Search**: [[papers/advertisement/UniERF - A Uniform Embedding-based Retrieval Framework for E-Commerce Search|UniERF]] 등

# H) References

- [FaceNet: A Unified Embedding for Face Recognition and Clustering (Schroff et al., CVPR 2015)](https://arxiv.org/abs/1503.03832)
- [Distance Metric Learning for Large Margin Nearest Neighbor Classification (Weinberger et al., NeurIPS 2005)](https://papers.nips.cc/paper/2795-distance-metric-learning-for-large-margin-nearest-neighbor-classification)
- [In Defense of the Triplet Loss for Person Re-Identification (Hermans, Beyer, Leibe, 2017)](https://arxiv.org/abs/1703.07737)
- [Deep Metric Learning via Lifted Structured Feature Embedding (Song et al., CVPR 2016)](https://arxiv.org/abs/1511.06452)
- [Improved Deep Metric Learning with Multi-class N-pair Loss Objective (Sohn, NeurIPS 2016)](https://papers.nips.cc/paper/6200-improved-deep-metric-learning-with-multi-class-n-pair-loss-objective)
