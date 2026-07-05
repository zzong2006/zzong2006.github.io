---
title: "Singular Value Decomposition"
tags: ["linear_algebra", "matrix_factorization", "machine_learning"]
aliases: ["SVD"]
---

# A) Singular Value Decomposition

특이값 분해, SVD 는 임의의 $m \times n$ 행렬 $A$ 를 세 행렬의 곱으로 분해하는 방법이다.

$$
A = U \Sigma V^{\top}
$$

각 행렬은 다음 역할을 한다.

| 기호 | 크기 | 의미 |
| --- | --- | --- |
| $U$ | $m \times m$ | left singular vectors 를 열벡터로 갖는 [[orthogonal]] matrix |
| $\Sigma$ | $m \times n$ | singular value 를 대각 성분으로 갖는 diagonal matrix |
| $V$ | $n \times n$ | right singular vectors 를 열벡터로 갖는 [[orthogonal]] matrix |

singular value 는 보통 다음처럼 큰 값부터 정렬한다.

$$
\sigma_1 \ge \sigma_2 \ge \cdots \ge 0
$$

$\sigma_i$ 는 $A^{\top}A$ 또는 $AA^{\top}$ 의 [[eigenvalue]] 에 square root 를 씌운 값으로 볼 수 있다.

# B) Compact SVD

실제로는 0 이 아닌 singular value 만 남긴 compact form 을 자주 사용한다. $A$ 의 rank 를 $r$ 이라고 하면 다음처럼 쓸 수 있다.

$$
A = U_r \Sigma_r V_r^{\top}
$$

| 기호 | 크기 |
| --- | --- |
| $U_r$ | $m \times r$ |
| $\Sigma_r$ | $r \times r$ |
| $V_r$ | $n \times r$ |

이때 $U_r$ 와 $V_r$ 는 square matrix 가 아니므로 full orthogonal matrix 라기보다는 orthonormal columns 를 가진 행렬로 이해하는 편이 정확하다.

$$
U_r^{\top}U_r = I_r,\quad V_r^{\top}V_r = I_r
$$

# C) 직관

SVD 는 행렬 $A$ 가 만드는 선형변환을 다음 세 단계로 나눠서 보는 방법이다.

1. $V^{\top}$: input coordinate 를 right singular vector 기준으로 회전한다.
2. $\Sigma$: 각 축을 singular value 만큼 늘리거나 줄인다.
3. $U$: output coordinate 로 다시 회전한다.

핵심 관계는 다음과 같다.

$$
A v_i = \sigma_i u_i
$$

즉 $A$ 는 right singular vector $v_i$ 방향의 입력을 left singular vector $u_i$ 방향의 출력으로 보낸다. 이때 크기는 $\sigma_i$ 만큼 조정된다.

그래서 큰 singular value 는 $A$ 가 강하게 보존하거나 증폭하는 주요 방향을 의미하고, 작은 singular value 는 상대적으로 덜 중요한 방향을 의미한다.

# D) Rank-1 행렬들의 합

SVD 는 행렬 $A$ 를 rank-1 행렬들의 가중합으로도 볼 수 있다.

$$
A = \sum_{i=1}^{r} \sigma_i u_i v_i^{\top}
$$

여기서 $u_i v_i^{\top}$ 는 $A$ 와 같은 크기의 rank-1 matrix 이고, $\sigma_i$ 는 그 rank-1 component 의 중요도를 나타낸다.

이 관점이 중요한 이유는 singular value 가 큰 항부터 남기면 원래 행렬의 중요한 구조를 먼저 보존할 수 있기 때문이다.

# E) Truncated SVD

Truncated SVD 는 singular value 가 큰 상위 $k$ 개 component 만 남기는 근사 방법이다.

$$
A_k = \sum_{i=1}^{k} \sigma_i u_i v_i^{\top}
$$

또는 행렬 곱 형태로 다음처럼 쓴다.

$$
A_k = U_k \Sigma_k V_k^{\top}
$$

$k < r$ 이므로 $A_k$ 는 원래 $A$ 보다 낮은 rank 를 가진다. 이때 $k$ 는 얼마나 많은 정보를 남길지 정하는 hyperparameter 에 가깝다. 상위 singular value 를 남기는 이유는, 이 방식이 원래 행렬을 rank-$k$ 행렬로 근사할 때 가장 작은 reconstruction error 를 주기 때문이다.

Truncated SVD 의 효과는 다음과 같다.

* 계산 비용과 저장 공간을 줄인다.
* 작은 singular value 에 해당하는 약한 신호나 noise 를 줄인다.
* 원래 행렬을 낮은 차원의 latent representation 으로 바꾼다.

# F) Applications

## F.1) Latent Semantic Analysis

문서-단어 행렬에 SVD 를 적용하면, 단어와 문서를 낮은 차원의 latent semantic space 로 보낼 수 있다. 이 방식이 [[Latent Semantic Analysis]] 의 핵심이다.

## F.2) Recommender System

사용자-아이템 rating matrix 에 SVD 를 적용하면 사용자와 아이템을 같은 latent factor space 에 놓을 수 있다.

예를 들어 $A$ 가 사용자 $\times$ 영화 평점 행렬이라면,

* $U_k$: 사용자 latent vector
* $V_k$: 영화 latent vector
* $\Sigma_k$: 각 latent dimension 의 중요도

처럼 해석할 수 있다.

## F.3) Dimensionality Reduction

Truncated SVD 는 sparse matrix 에도 자주 쓰이는 차원 축소 방법이다. [[Principal Component Analysis|PCA]] 와도 연결되는데, centered data matrix 에 SVD 를 적용하면 principal components 를 얻을 수 있다.

# G) Related

* [[machine_learning/NLP/Latent Semantic Analysis|Latent Semantic Analysis]]
* [[Principal Component Analysis]]
* [[recommendation_system/matrix factorization|matrix factorization]]
* [[linear_algebra/eigen-decomposition|eigen-decomposition]]
* [[linear_algebra/orthogonal|orthogonal]]

# H) References

* [Singular value decomposition - Wikipedia](https://en.wikipedia.org/wiki/Singular_value_decomposition)
* [Eckart-Young theorem - Wikipedia](https://en.wikipedia.org/wiki/Low-rank_approximation#Proof_of_Eckart%E2%80%93Young%E2%80%93Mirsky_theorem)
