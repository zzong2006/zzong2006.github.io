---
title: "session-based recommendations"
tags: ["SBRS", "paper_review", "recommendation_system"]
aliases: ["세션 기반 추천", "SBRS"]
---

# A) Session-based Recommendations (SBRS)?

이벤트의 시퀀스를 기반으로 추천을 진행하는 방식을 의미하며, next item prediction 이 그 예이다.

## A.1) 세션 기반 추천의 필요성

기존의 content-based RSs 이나 [[collaborative filtering]]-based RSs 들은 유저 선호도가 static 하다는 가정하에 long-term modeling 을 진행한다. 그러나 세션 기반 추천은 short-term & dynamic 한 유저 선도를 고려한다. 이러한 고려가 중요한 이유는 다음과 같다.

1. 어떤 아이템을 선택하냐는 long-term 도 있지만 short-term 또한 고려되며, time-sensitive 한 context 도 유저의 선택에 영향을 미친다.
2. 사용자의 선호도는 시간이 갈수록 바뀐다.

예를 들어, [[matrix factorization|MF]] 기법은 이벤트의 순서를 고려하지 않는다는 문제가 있어서 세션 기반 추천에 적절하지 못하다.

# B) SBRS - How?

세션의 경우 일련의 연속된 시간으로 구분할 수 있다 (분 또는 시 단위).

# C) Vs. Sequential Recommendation (SRS)

SBRS 은 세션 데이터를 기반으로 하고, [[sequential recommendation|SRS]] 은 시퀀스 데이터를 기반으로 한다.

## C.1) Session Data

세션은 명료한 boundary 가 있는 interactions 의 리스트를 의미하며, 이러한 interaction 이 시간순서대로 정렬될 수 있고 정렬되지 않을 수 있다. 한 유저로부터 얻어진 세션 데이터는 일반적으로 각자 다른 시간에 발생한 여러개의 세션으로 구성되며, 세션 간의 시간 (time interval) 은 동일하지 않다.

## C.2) Sequence Data

시퀀스는 명확히 시간 순서대로 정렬되어 있는 historical 원소들 (e.g. item IDs) 의 리스트를 의미한다. 시퀀스 역시 boundary 가 존재하지만, 여러개의 boundary 가 존재하는 세션 데이터와 달리 오직 하나만 존재한다. 대부분의 시퀀스 데이터는 timestamp 를 통해 정렬되며, 명시적인 time intervals 이 구분되어 있지는 않다.

# D) SBRS 종류

기존의 SBRS 방식들은 크게 세 가지 카테고리로 나눠질 수 있다.

1. next-interaction 추천 (e.g. item 구입)
세션 간 의존성을 모델링하여 현재 세션에서 발생할 수 있는 다음 상호 작용을 추천한다. 이 task 는 일반적으로 상호작용할 다음 아이템을 예측하는 것으로 단순화할 수 있다.
2. next partial-session recommendation
현재 세션에서 발생할 수 있는 모든 상호 작용을 추천한다. 예를 들어, basket(어떤 한 세션 자체를 지칭) 을 모두 채울 수 있는 all subsequent item 을 예측한다. 실제로 유저들은 세션이 끝날때까지 여러 아이템을 상호작용하므로, 이러한 task 가 좀 더 현실성 있다.
3. next-session 추천 (e.g. basket)
historical session 들을 학습하여 그 다음 세션을 추천한다.

종종 세션간 의존성이 (1), (2) task 의 추천 성능을 올리기 위해 사용되는 경우가 존재한다.

# E) 전통적 SBRS 접근 방법들

Pattern/rule mining based, [[k-Nearest Neighbors|KNN]] based, [[Markov Chain]] 기반, Generative probabilistic 가 존재하지만 KNN 방식 중 session-KNN 이 가장 성능이 좋았다고 한다.

## E.1) Session-KNN

현재 세션 context $c$ 가 주어졌을 때, session-KNN 기반 SBRS 은 $c$ 와 다른 세션 간 유사도를 계산하여 K 이웃 세션 $N(c)$ 를 찾는다. 이후, 각 candidate item $\hat{v}$ 에 대한 score 를 다음과 같이 계산한다.

$$
\operatorname{score}(\hat{v})=\sum_{s_{n h} \in N(c)} \operatorname{sim}\left(c, s_{n b}\right) \cdot 1_{s_{n b}}(\hat{v})
$$

$\operatorname{sim}$ 은 유사도 측정 방식이고, $1_{s_{n b}}(\hat{v})$ 는 indicator 함수로 $\hat{v}$ 가 $s_{nb}$ 에 존재하면 $1$ 그렇지 않다면 $0$ 을 나타낸다.

* Next-basket 추천을 위해 KNN 을 활용한 논문: [[Modeling personalized item frequency information for next-basket recommendation]]

# F) Challenges Facing SBRS

## F.1) Session-based Recommendations with General User Preference

SBRS 는 일반적으로 사용자의 general 한 long-term preferences 를 무시한다. 이는 CF 와 같은 전통적인 RS 가 잘 capture 할 수 있는 방법과 대비되는 결과이다.

1. cross domain: target domain 내 SBR 의 성능을 끌어올리기 위해 다른 domain 에서의 knowledge 를 어떻게 가져올 수 있는것인가?
대표적인 예시로는 [[transfer learning]] 을 예로 들 수 있겠다.

2. 대용량 streaming 또는 online 데이터를 어떻게 효율적으로/제한된 시간 내에 추천할 수 있는지?
3. 한가지 type 의 feedback 이 아닌 다양한 feedback 을 가지고 학습해야 하는 경우가 있다. (view, add cart, skip etc.)

# G) Related

* [[BERT4Rec - Sequential Recommendation with Bidirectional Encoder Representations from Transformer|BERT4Rec]] - Transformer Encoder 기반으로 Masked Language Model 방식으로 학습

# H) References

* [A Survey on Session-based Recommender Systems](https://arxiv.org/pdf/1902.04864.pdf) - 2021
