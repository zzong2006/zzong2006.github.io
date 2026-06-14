---
title: "FastText"
tags: ["NLP", "Meta"]
---

# A) FastText ?

[[Word2Vec]] 과 비슷한 임베딩 모델이다. 주요 차이점은 FastText 의 경우 문자 레벨에서 동작하고, Word2Vec 은 단어 레벨에서 동작한다는 점이다.

즉, [[skip-gram]] 구조를 가져가면서 학습할때 사용하는 데이터가 [[n-gram]] 단위로 나눠진 문자가 되는 것이다.

# B) 문자 N-gram

문자 n-gram 이란, 주어진 문자를 크기가 n 인 윈도우만큼 잘라내었을 때 확인할 수 있는 문자들의 집합을 의미한다.

## B.1) 예시

`n=2` 인 경우 `this` 라는 문자의 `n-gram` 은 다음과 같다 : `<t`, `th`, `hi`, `is`, `s>`, `this`
마지막 `this` 는 단어 자체로, special sequence 취급을 한다.

# C) Training with N-gram Character

만약 “This is a visual comparison” 과 같은 문장에서, This 단어를 통해 visual 이라는 단어를 추론하도록 모델을 학습시키고 싶다면, 아래와 같이 this 를 n-gram 으로 분해하고 visual 을 추론하도록 한다.
이때 각 임베딩을 합치는 것은 [[CBOW]] 방식과 유사하다.

![|500](https://i.imgur.com/1a7buNy.png)

# D) Tips

* The authors found that using n-grams with `n>=3` and `n<=6` worked best.
* 영어보다는 러시안, 독일어, 아랍어 등에 도움이 되었다고 한다.

# E) Pros and Cons

## E.1) Pros

* [[out-of-vocabulary|OOV]] 단어에 대한 임베딩을 생성할 수 있다.
* 발생 빈도수가 낮은 단어에 대해서도 보다 좋은 단어 임베딩을 생성할 수 있다.

## E.2) Cons

* it takes longer to generate fasttext embeddings compared to word2vec
* As the corpus size grows, the memory requirement grows too

# F) Evaluation

fasttext 과 같은 Word Representation 모델의 성능을 확인하기 위한 방법에 대해 기술한다.

## F.1) (1) Human Similarity Judgement

주어진 두 단어 간 유사도 또는 연관도를 사람이 평가하도록 시키고, 모델이 평가한 점수와 [[correlation]] 을 측정한다. 높으면 높을수록 모델이 좋은 성능을 내고있다고 평가한다.

이 평가방식의 경우 학습에 사용된 단어만 처리할 수 있어서 [[Word2Vec]] 과 같은 모델은 OOV 에 대한 예측을 수행할 수 없다.

# G) Related

# H) References

* [09-06 패스트텍스트(FastText) - 딥 러닝을 이용한 자연어 처리 입문](https://wikidocs.net/22883)
* [What is the main difference between word2vec and fastText? - Quora](https://www.quora.com/What-is-the-main-difference-between-word2vec-and-fastText)
