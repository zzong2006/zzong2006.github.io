---
title: "Mixed Negative Sampling for Learning Two-tower Neural Networks in Recommendations"
tags: ["Google", "NLP", "WWW", "implicit_feedback", "paper_review", "recommendation_system"]
---

# A) Abstract

NLP 에서 dual encoder 로 불리는 two-tower 신경망 framework 를 어떻게 추천 시스템에 적용할 수 있는지 보임
추가로, Mixed Negative Sampling (MNS) 이라는 negative sampling 전략을 제안

일반적인 batch 또는 unigram sampling 전략과 달리, MNS 는 [[implicit feedback]] 의 selection bias 를 제거하기 위하여 a mixture of batch 와 uniformly sampled negatives 를 사용

실험적으로 MNS 가 다른 sampling 전략보다 우수하다는 것을 보임

# B) Modeling Framework

# C) References

* paper link: https://research.google/pubs/pub50257/
