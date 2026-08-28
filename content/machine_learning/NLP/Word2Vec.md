---
title: "Word2Vec"
tags: ["word2vec", "NLP"]
---

# A) Word2Vec ?

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

* Word2Vec 는 예측 기반으로 단어 간 유추 작업에는 LSA 보다 뛰어나지만, 임베딩 벡터가 윈도우 크기 내에서만 주변 단어를 고려하기 때문에 코퍼스의 전체적인 통계 정보를 반영하지 못합니다.

# D) W2V 의 네거티브 샘플링이 더 빠른 이유

네거티브 샘플링이 빠른 이유는 **계산 범위를 전체에서 일부로 줄였기 때문**입니다. 기존 Softmax 는 100 만 개의 단어 중 정답을 찾는 문제처럼, 모든 단어에 대한 확률을 계산해야 해서 연산량이 매우 컸습니다. 반면 네거티브 샘플링은 ‘이 단어가 정답이냐, 아니냐’를 맞추는 이진 분류 문제로 바꿔, 정답 단어 1 개와 저희가 뽑은 오답 단어 몇 개 (K 개) 만 보고 학습합니다. 따라서 **연산량이 전체 어휘 크기 ‘V’에서 샘플링 개수 ‘K’로 줄어들어** 학습 속도가 비약적으로 향상됩니다.

W2V(Word2Vec) 에서 네거티브 샘플링이 기존의 Softmax 방식보다 훨씬 빠른 이유는 **전체 어휘 (Vocabulary) 를 대상으로 하던 계산을 일부 샘플링된 어휘만으로 한정**하여 연산량을 획기적으로 줄였기 때문입니다.

이를 Softmax 의 연산량 문제와 연결하여 설명드리겠습니다.

**1. 기존 Softmax 방식의 문제점: $O(V)$ 의 연산량**

Word2Vec 의 Skip-gram 모델을 예로 들면, 중심 단어 (Center Word) 가 주어졌을 때 주변 단어 (Context Word) 가 무엇인지 예측하는 문제를 풉니다.

* 이때 일반적인 다중 클래스 분류 (Multi-class Classification) 처럼 Softmax 함수를 출력층에 사용하면, **전체 어휘 (Vocabulary, $V$) 에 속한 모든 단어**에 대해 각각 정답일 확률을 계산해야 합니다.
* Softmax 함수의 수식을 보면 분모를 계산할 때 전체 어휘 (V) 에 대한 점수를 모두 더하는 과정 (Normalization) 이 포함됩니다.
* 만약 어휘의 크기 (V) 가 100 만 개라면, 매 학습 단계 (step) 마다 100 만 개의 단어에 대한 점수를 계산하고, 이들의 합을 구해 정규화해야 합니다. 이는 **연산량이 어휘 크기 $V$ 에 비례 $(O(V))$** 하므로 엄청난 계산 비용을 유발합니다.

**2. 네거티브 샘플링의 해결책: $O(K)$ 로 연산량 감소**

네거티브 샘플링은 이 문제를 ‘어떤 단어가 정답인가?’라는 다중 클래스 분류가 아닌, **‘이 단어 쌍이 정답 (Positive) 인가, 오답 (Negative) 인가?’를 맞추는 이진 분류 (Binary Classification) 문제**로 바꿔버립니다.

* 학습 시, 실제 정답인 단어 (Positive Sample) 1 개와, 정답이 아닌 단어 (Negative Samples) 를 K 개 무작위로 샘플링합니다. (보통 K 는 5~20 사이의 작은 값입니다.)
* 그다음 모델은 Positive Sample 에 대해서는 1 에 가까운 값을, K 개의 Negative Sample 에 대해서는 0 에 가까운 값을 출력하도록 학습됩니다. 이때는 Sigmoid 함수가 사용됩니다.
* 결과적으로, 전체 어휘 V 개를 모두 계산할 필요 없이 **오직 (1+K) 개의 단어에 대해서만 점수를 계산하고 가중치를 업데이트**하면 됩니다.
* 따라서 연산량이 **O(V) 에서 O(K) 로 획기적으로 줄어듭니다.** 100 만 개를 계산하던 것이 단 11 개 (K=10 일 경우) 만 계산하면 되므로 비교할 수 없을 정도로 학습 속도가 빨라지는 것입니다.
