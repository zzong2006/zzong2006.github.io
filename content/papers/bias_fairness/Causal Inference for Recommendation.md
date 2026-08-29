---
title: "Causal Inference for Recommendation"
aliases: []
tags:
  - UAI
  - bias
  - fairness
  - paper_review
  - popularity_bias
  - y2016
---

[paper link](https://dawenl.github.io/publications/LiangCB16-causalrec.pdf)

# A) Abstract

Joint models of exposure and clicks

[[Scalable Recommendation with Poisson Factorization]]

# B) Opinion

내가 본 논문 중 vimp 데이터를 학습에 활용한 첫번째 논문

vimp 데이터를 이용하여 exposure model 을 먼저 세우고, 해당 모델이 생성한 값을 propensity score $p_{ui}$ 로 활용하여 click model 을 학습한다 (with click data).

해당 데이터는 explicit feedback 을 target 으로 한 모델이고, implicit feedback 을 target 으로 한 모델은 [[Modeling user exposure in recommendation]] 를 참조

정확히는 이 논문은 vimp 데이터가 명시된 것을 활용한 논문이고, link 가 걸린 paper 는 vimp 데이터가 없어서 inference 를 수행해야 하는 논문임

# C) Related

paper from the same author : [[Causal Inference for Recommender Systems]]
