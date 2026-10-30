---
title: "hard negative"
tags: machine_learning 
aliases: []
---

# A) Hard Negative ?

hard negative 는 정답이 아닌데 모델이 정답과 헷갈리기 쉬운 데이터다. 반대로 easy negative 는 정답이 아니고 모델도 쉽게 구분하는 데이터다.

이 말은 두 맥락에서 쓴다.

| 맥락 | hard negative 의 뜻 |
| --- | --- |
| 분류 · 객체 탐지 | 실제로는 negative 인데 모델이 positive 로 잘못 예측한 사례. [[False Positive]] 쪽의 오답이다 |
| 검색 · 임베딩 학습 | 질의와 비슷해 보이지만 정답이 아닌 문서. 학습할 때 negative 로 일부러 넣는다 |

분류에서는 이미 틀린 사례를 다시 학습에 넣어(hard negative mining) 경계를 바로잡는다. 검색에서는 학습 데이터를 만들 때 일부러 어려운 negative 를 골라 넣는다.

# B) 검색 학습에서 Hard Negative 가 필요한 이유

[[Bi-Encoder vs Cross-Encoder|bi-encoder]] 검색 모델은 질의 벡터를 정답 문서 벡터와 가깝게, 다른 문서와는 멀게 학습한다. [[InfoNCE]] loss 로 쓰면 다음과 같다.

$$
L = -\log \frac{e^{s(q, d^+)}}{e^{s(q, d^+)} + \sum_{j} e^{s(q, d_j^-)}}
$$

| 기호 | 의미 |
| --- | --- |
| $s(q, d)$ | 질의 벡터와 문서 벡터의 유사도 |
| $d^+$ | 정답 문서 |
| $d_j^-$ | negative 문서들 |

negative 는 보통 같은 batch 의 다른 질의 정답 문서를 재활용한다(in-batch negative). 이 문서들은 대부분 질의와 주제부터 다르다. 학습 초반이 지나면 $s(q, d_j^-)$ 가 정답보다 훨씬 작아져 분모에서 거의 사라지고, 그 negative 에서 오는 gradient 도 0 에 가까워진다. 이미 아는 것을 계속 보는 셈이다.

hard negative 는 질의와 가까운 negative 라서 분모에서 큰 몫을 차지하고, 모델이 아직 구분하지 못하는 경계를 가르친다. 예를 들어 "아이폰 15 배터리 교체 비용" 이라는 질의에 "아이폰 14 배터리 교체 비용" 문서를 negative 로 주면, 모델은 숫자 하나의 차이를 구분하도록 배운다.

# C) 어디서 구하나

hard negative 는 질의와 비슷한 문서 중에서 정답이 아닌 것을 골라 만든다. 무엇으로 "비슷함" 을 재느냐에 따라 방법이 나뉜다.

| 방법 | 고르는 방식 | 예 |
| --- | --- | --- |
| BM25 상위 | 키워드가 많이 겹치는 문서 중 정답이 아닌 것 | [[DPR]] |
| 현재 모델의 ANN 상위 | 학습 중인 모델이 정답과 헷갈리는 문서. 모델이 바뀌면 다시 뽑는다 | ANCE |

두 번째 방법은 지금 모델이 실제로 헷갈리는 문서를 고르므로 더 어려운 negative 를 얻는다. 그만큼 실제 정답이 negative 로 섞일 위험도 커진다.

# D) False Negative: 어려울수록 정답이 섞인다

검색 데이터는 질의마다 정답을 한두 개만 표시한다. 수백만 문서 중에 정답이 그것뿐이라는 뜻이 아니라, 사람이 확인한 것이 그것뿐이라는 뜻이다. 라벨이 없는 나머지 문서 중에도 실제 정답이 있다.

hard negative 를 질의와 가까운 상위 후보에서 뽑으면, 그 라벨 없는 정답이 negative 로 같이 뽑힌다. 이것이 false negative 다. 모델은 정답을 질의에서 멀리 밀어내도록 학습하게 된다.

![[img-3891518bd2.png]]

이 문제는 작지 않다. RocketQA 저자들은 MSMARCO 에서 상위로 검색됐지만 정답 라벨이 없는 문서를 사람이 다시 확인했고, 그중 70% 가 실제로는 정답이었다고 보고했다. MSMARCO 는 질의당 정답이 평균 1.1 개, 문서가 880 만 개다.

hard negative 를 상위 후보에서 뽑을수록 어려운 negative 를 얻지만, false negative 비율도 함께 올라간다. 어려운 negative 와 false negative 가 모두 질의와 가까운 상위 후보에서 나오기 때문이다.

# E) False Negative 를 줄이는 방법

- **cross-encoder 로 거른다**: 상위 후보를 cross-encoder 로 다시 매기고, 관련도가 높게 나온 문서는 negative 에서 뺀다. RocketQA 의 denoised hard negative 가 이 방식이다.
- **최상위는 건너뛴다**: 상위 몇 개는 정답일 가능성이 높으므로, 그 아래 순위에서 negative 를 뽑는다. 어디부터 뽑을지는 데이터마다 다르다.
- **정답 점수를 기준으로 자른다**: 정답 문서 점수에 가까운 negative 는 정답일 가능성이 높다고 보고 뺀다. NV-Retriever(Moreira et al., 2024)는 정답 점수를 기준으로 negative 를 거르는 방식이 학습을 빠르게 하고 검색 성능을 높인다고 보고했다.
- **LLM 으로 판정한다**: 후보 문서가 질의에 답하는지 LLM 에게 묻고, 답한다고 하면 negative 에서 뺀다. 판정 비용이 들지만 사람 라벨에 가깝다.

# F) References

- [RocketQA: An Optimized Training Approach to Dense Passage Retrieval for Open-Domain Question Answering (Qu et al., NAACL 2021)](https://arxiv.org/abs/2010.08191)
- [Approximate Nearest Neighbor Negative Contrastive Learning for Dense Text Retrieval (ANCE, Xiong et al., ICLR 2021)](https://arxiv.org/abs/2007.00808)
- [NV-Retriever: Improving text embedding models with effective hard-negative mining (Moreira et al., 2024)](https://arxiv.org/abs/2407.15831)
- [hard negative mining : 네이버 블로그](https://blog.naver.com/PostView.nhn?isHttpsRedirect=true&blogId=sogangori&logNo=221073537958&parentCategoryNo=&categoryNo=6&viewDate=&isShowPopularPosts=false&from=postView)
