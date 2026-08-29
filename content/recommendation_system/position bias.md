---
title: "position bias"
aliases: []
tags:
  - bias
  - position_bias
---

# A) Position Bias 확인하는 방법

## A.1) 순서 바꾸기

Alter the order of ranked recommendations or search results in some manner

1. 아이템 순서를 섞은것과 섞지 않은 것을 비교하는 방법
   예를 들어 reverse ordering 해서 추천 결과를 보내면, click 수 역시 거꾸로 나오는 것인지? vimp 의 평균 pos 가 높은 사용자 일수록 position bias 에 덜 민감할 가능성이 높다.

3. click modeling
4. few heuristics in the pairwise manner (e.g., SkipAbove)
5. unbiased learning-to-rank framework by treating the bias as a counterfactual effect
   [[Unbiased Learning-to-Rank with Biased Feedback]]

# B) Papers

* Addressing Trust Bias for Unbiased Learning-to-Rank (WWW, 2019)

  좀 더 진화한 구글 논문. 마찬가지로 EM 알고리즘을 활용한다.

* Unbiased Learning-to-Rank with Biased Feedback

# C) References
