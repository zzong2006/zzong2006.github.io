---
title: "Latent Semantic Analysis"
aliases:
  - LSA
tags:
  - topic_modeling
  - embedding
---

Latent Semantic Analysis 는 잠재 의미 분석 (Latent Semantic Indexing, LSI) 이라고 부르기도 함

LSA 는 기본적으로 DTM 이나 [[TF-IDF|TF-IDF]] 행렬에 절단된 [[machine_learning/Singular Value Decomposition]](truncated SVD) 를 사용하여 차원을 축소시키고, 단어들의 잠재적인 의미를 끌어낸다는 아이디어를 갖고 있음

# A) 예시

![[img-b9a8ed2930.png||500]]

위 그림과 같이 tokenize 되어 $n$ 개의 단어로 표현된 각 $m$ 개의 문서들을 $m\times n$ matrix 로 표현하고, 이 matrix 를 truncated SVD 를 통해 $k\times m$ matrix ($U \Sigma\\V^{\mathrm{T}}$ 중 $V^{\mathrm{T}}$) 를 찾아낸다.

여기서 $k$ 는 topic 개수이므로, 각 $m$ 개의 문서는 $k$ 개의 topic 을 지닌 vector 로 표현된다.

# B) 장점 및 단점

* 장점: LSA 는 쉽고 빠르게 구현이 가능할 뿐만 아니라 단어의 잠재적인 의미를 이끌어낼 수 있어 문서의 유사도 계산 등에서 좋은 성능을 보여준다.
* 단점: large computation cost

SVD 의 특성상 이미 계산된 LSA 에 새로운 데이터를 추가하여 계산하려고하면 보통 처음부터 다시 계산해야 한다. 즉, 새로운 정보에 대해 업데이트가 어렵다.

# C) Related

* [[Probabilistic latent Semantic Indexing]]
* [[TF-IDF]]
