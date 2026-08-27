---
tags: ["word2vec", "NLP"]
aliases: ["continuous bag of words"]
---

# A) CBOW ?

CBOW 는 주변단어 (Context) 를 통해서 주어진 단어 (target) 가 무엇인지 찾는 것이다. 정확히는 앞뒤로 $\frac{c}{2}$ 개의 단어를 (총 $c$ 개) 통해 주어진 단어를 예측한다는 것이 CBOW 의 아이디어이다.

**예시**

$c=8$ 인 경우: a glass of orange `_____` to go along with

## A.1) CBOW Figure

![|350](https://i.imgur.com/DYWHBRy.png)

$\mathbf{W}_{V\times N}$ 은 Embedding matrix, $x$ 는 $V$ 차원의 one-hot vector, $N$ 은 embedding vector 의 크기다.

Embedding matrix $\mathbf{W}$ 는 one-hot-encoding 된 입력벡터와 은닉층을 이어주는 가중치행렬임과 동시에, [[Word2Vec]] 의 최종 결과물인 **임베딩 단어벡터의 모음**이다.

가운데 hidden layer 는 총 $c=2m$ 개 embedding vector 들 $v$ 의 평균 vector 다.

$$
\displaystyle\hat{v}=\frac{v_{c-m}+v_{c-m+1}+\cdots+v_{c+m}}{2m}\in\mathbb{R}^{n}
$$

CBOW 의 목적 함수 $H$ 는 이전에 서술한 것과 같이 target word 에 대한 확률을 최대로 만드는 것이다. 즉, [[entropy]] 함수를 통해 다음과 같이 서술될 수 있다.

$$
\displaystyle H(\hat{y},y)=-\sum_{j=1}^{|V|}y_{j}\log\left(\hat{y}_{j}\right)=-y_{i}\log\left(\hat{y}_{i}\right)
$$

$y_i$ 는 one-hot vector 므로, 하나만 제외하고 나머지는 0 이다.

Optimization 을 위해 [[stochastic gradient descent|SGD]] 를 사용한다.

## A.2) Vs. Skip-gram

[[skip-gram]]

# B) References
