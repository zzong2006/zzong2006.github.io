---
title: "SLIM - Sparse Linear Methods for Top-N Recommender Systems"
tags:
  - paper_review
  - recommender_system
  - collaborative_filtering
aliases: [SLIM, Sparse Linear Methods for Top-N Recommender Systems]
---

# A) SLIM ?

SLIM(Sparse Linear Methods for Top-N Recommender Systems)은 item-item similarity 를 sparse linear model 로 학습하는 top-N recommendation 방법이다.

# B) 핵심 아이디어

User-item interaction matrix 에서 각 item 을 다른 item 들의 sparse linear combination 으로 재구성한다. 학습된 coefficient matrix 는 item 간 관계를 나타내며, 이를 이용해 사용자가 아직 소비하지 않은 item 의 score 를 계산한다.

# C) 실무적 의미

SLIM 은 neighborhood 기반 CF 와 matrix factorization 사이의 느낌을 가진다. 해석 가능한 item-item 관계를 얻을 수 있지만, item 수가 커질수록 coefficient 학습 비용과 sparsity 제어가 중요해진다.

# D) Related

* [[collaborative filtering]]
* [[matrix factorization]]
* [[recommendation_system/itemKNN|itemKNN]]

