---
title: "Word2Vec"
aliases: []
tags:
  - word2vec
  - NLP
---

# A) Word2Vec 개요

Word2Vec 은 shallow [[neural network]] 를 통해 단어를 저차원 [[vector space]] 로 임베딩 하는 모델이다.

모델의 학습 결과로 얻어지는 vector 간 거리가 가깝다는 것은 단어 간 의미가 서로 비슷함을 의미한다.

## A.1) Document Embedding

가장 직관적인 방법은 문서 내 단어들을 모두 Word2Vec 을 통해 벡터로 임베딩하고, 얻어진 벡터들의 평균을 계산하는 방법이다. 그 외 다른 방법은 [[Doc2Vec]] 을 참고할 수 있다.

# B) Methods

* [[CBOW]] ([Reference](https://reniew.github.io/21/))
* [[skip-gram]]
* [[Subsampling Frequent words]]
* Complexity Problem
	* [[skip-gram]] 과 [[CBOW]] 는 Output Layer 에서 모든 단어에 대한 Softmax 계산을 해야하기 때문에, 이에 따른 연산량이 막대하다.
	* 이 부분의 계산량을 줄이기 위한 방법이 두가지 제안되었는데, 하나는 [[hierarchical softmax]] 고, 다른 하나는 [[negative sampling]] 이다.
	* [[hierarchical softmax]] 와 [[negative sampling]] 은 확률 값 계산의 계산량을 줄이기 위한 방법으로 목적이 같다. 즉, 택일하여 사용해야한다.
* Glove word Vectors
	* 음.. 시간이 나면 채워넣겠다. 생략

# C) Limitations

* Word2Vec 은 예측 기반이라 단어 간 유추 작업에서는 LSA 보다 뛰어나다.
* 하지만 임베딩 벡터가 윈도우 크기 안의 주변 단어만 고려하므로 코퍼스 전체의 통계 정보를 반영하지 못한다.

# D) 네거티브 샘플링이 빠른 이유

W2V(Word2Vec) 의 네거티브 샘플링은 전체 어휘(Vocabulary)를 대상으로 하던 확률 계산을 샘플링한 일부 단어로 한정한다. 그래서 연산량이 전체 어휘 크기 $V$ 에서 샘플링 개수 $K$ 로 줄고, 학습 속도가 크게 빨라진다.

## D.1) 기존 Softmax 의 연산량

Skip-gram 은 중심 단어(Center Word)가 주어지면 주변 단어(Context Word)를 예측한다.

* 출력층에 Softmax 를 쓰는 다중 클래스 분류(Multi-class Classification)로 풀면, 전체 어휘 $V$ 에 속한 모든 단어에 대해 정답일 확률을 각각 계산해야 한다.
* Softmax 의 분모에는 전체 어휘의 점수를 모두 더하는 정규화(Normalization) 과정이 들어 있다.
* 어휘 크기가 100 만 개면 매 학습 step 마다 100 만 개 단어의 점수를 계산하고, 그 합으로 정규화해야 한다.
	* 연산량이 어휘 크기에 비례($O(V)$)하므로 계산 비용이 매우 크다.

## D.2) 네거티브 샘플링의 연산량

네거티브 샘플링은 '어떤 단어가 정답인가' 라는 다중 클래스 분류를, **'이 단어 쌍이 정답(Positive)인가 오답(Negative)인가'를 맞히는 이진 분류** (Binary Classification)로 바꾼다.

* 학습 때 실제 정답 단어(Positive Sample) 1 개와 정답이 아닌 단어(Negative Samples) K 개를 무작위로 샘플링한다.
	* K 는 보통 5–20 사이의 작은 값이다.
* 모델은 Sigmoid 를 써서 Positive Sample 에는 1 에 가까운 값을, K 개 Negative Sample 에는 0 에 가까운 값을 출력하도록 학습한다.
* 전체 어휘 V 개를 모두 계산하지 않고 (1+K) 개 단어만 점수를 계산하고 가중치를 업데이트한다.
* 연산량이 $O(V)$ 에서 $O(K)$ 로 줄어든다.
	* K=10 이면 100 만 개 대신 11 개만 계산하므로 학습 속도가 비교할 수 없을 정도로 빨라진다.
