---
title: "Fifty Shades of Ratings - How to Benefit from a Negative Feedback in Top-N Recommendations Tasks"
aliases: []
tags:
  - RecSyS
  - cold-start
  - matrix_factorization
  - paper_review
  - recommendation_system
  - y2016
---

# A) Abstract

온라인 추천 시스템을 지원하기 위해 3 차원 텐서 분해 기법을 사용하고, 고차원 folding-in 방법을 구현합니다. 또한, 표준 지표를 수정하여 원치 않는 bias 를 드러내고 negative feedback 에 대한 민감도를 고려할 수 있는 방안을 제안합니다.

# B) Introduction

여기서 말하는 negative feedback 은 실제로 부정적인 의미의 점수가 아니라, 유저가 낮은 점수를 준 아이템들을 의미합니다. 예를 들어, 유저가 낮은 평가나 점수를 준 아이템들이 이에 해당됩니다.

*****

## B.1) Tensor Concepts

* **Tensor Factorization**
* **Efficient Computation of Recommendations**
  * 실시간 추천 생성을 위한 고차원 folding-in 방법으로 cold-start 상황을 지원합니다.
  * $R_{(i)}=VV^{T}P_{(i)}WW^{T}$*

# C) Reference

[arxiv.org/pdf/1607.04228](https://arxiv.org/pdf/1607.04228.pdf)
