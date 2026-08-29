---
title: "A Three-Way Model for Collective Learning on Multi-Relational Data"
tags: paper_review RESCAL ICML y2011
aliases: ["RESCAL"]
---

# A) 한줄 요약

지식 그래프를 3차원 텐서로 놓고, 관계마다 하나의 행렬을 두어 분해하는 모델이다. 이 모델을 RESCAL 이라고 부른다. Nickel et al., ICML 2011.

# B) 데이터를 어떻게 놓나

지식 그래프의 사실은 `(주어, 관계, 목적어)` 세 쌍으로 적힌다. 이를 3차원 텐서 $\mathcal{X}$ 로 둔다.

$$
\mathcal{X}_{ijk} = \begin{cases} 1 & (\text{개체} i,\ \text{관계 } k,\ \text{개체 } j) \text{ 가 참이면} \\ 0 & \text{아니면} \end{cases}
$$

앞의 두 축이 개체, 세 번째 축이 관계 종류다. 관계 하나를 고정하면 그 관계의 인접행렬 한 장이 나온다.

# C) 분해 형태

관계 $k$ 에 해당하는 조각 $\mathcal{X}_k$ 를 다음처럼 근사한다.

$$
\mathcal{X}_k \approx A R_k A^\top
$$

| 기호 | 의미 |
| --- | --- |
| $A \in \mathbb{R}^{n \times r}$ | 개체 임베딩. $i$ 번째 행이 개체 $i$ 의 벡터 |
| $R_k \in \mathbb{R}^{r \times r}$ | 관계 $k$ 를 나타내는 행렬 |
| $r$ | 잠재 차원 |

한 사실의 점수는 $\boldsymbol{a}_i^\top R_k \boldsymbol{a}_j$ 다. 개체 벡터는 관계와 무관하게 **하나만** 두고, 관계마다 행렬 $R_k$ 를 따로 둔다는 점이 핵심이다.

$A$ 를 모든 관계가 공유하기 때문에 한 관계에서 배운 개체 표현이 다른 관계로 전달된다. 논문이 collective learning 이라고 부르는 부분이 이것이다. 어떤 사람의 '국적' 관계에서 얻은 정보가 그 사람의 '거주지' 관계 예측에도 쓰인다.

$R_k$ 가 대칭일 필요가 없다는 점도 중요하다. $\boldsymbol{a}_i^\top R_k \boldsymbol{a}_j \ne \boldsymbol{a}_j^\top R_k \boldsymbol{a}_i$ 이므로 '~의 부모이다' 처럼 방향이 있는 관계를 표현할 수 있다.

# D) 대가와 이후

관계마다 $r \times r$ 행렬을 두므로 파라미터가 관계 수 × $r^2$ 로 늘어난다. 관계 종류가 많은 그래프에서는 이 부분이 부담이 되고 과적합하기 쉽다.

이후 모델들은 $R_k$ 를 제약해서 이 비용을 줄이는 방향으로 갔다. DistMult 는 $R_k$ 를 대각행렬로 두어 파라미터를 $r$ 개로 줄이지만 대칭 관계만 표현할 수 있게 되고, ComplEx 는 복소수 임베딩으로 대각 형태를 유지하면서 비대칭까지 표현한다.

[[PyTorch-BigGraph]] 는 대규모 그래프 임베딩 학습 프레임워크로, RESCAL 을 포함한 여러 스코어 함수를 선택지로 제공한다.

# E) References

* [A Three-Way Model for Collective Learning on Multi-Relational Data (ICML 2011)](https://icml.cc/2011/papers/438_icmlpaper.pdf)
