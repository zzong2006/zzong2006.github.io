---
title: "Deep Bayesian Bandits Showdown - An Empirical Comparison of Bayesian Deep Networks for Thompson Sampling"
tags: ["Google", "ICLR", "MAB", "bandit", "deep_learning", "paper_review", "y2018"]
---

# A) Summary

이 논문의 main research question: how approximated model posteriors affect the performance of decision making via Thompson Sampling in contextual bandits.

# B) Introduction

A fundamental aspect of sequential decision making is the exploration-exploitation dilemma. [[Thompson sampling]] 은 효율적이지만, 단순한 모델을 제외하고 이러한 posterior 를 유지하기가 어렵다.

대신, Approximate Bayesian methods for deep neural networks 하려는 시도가 있었음. 그런데 posterior 를 정확히 계산하는게 어려우니까 이런 시도들에 대한 평가가 힘듦. 벤치마크 결과도 거의 없음. 그래서 이 논문은 deep neural network 를 활용한 exploration 방식들을 벤치마킹함.

서로 다른 posterior 추정 방식이 TS 성능에 어떻게 영향을 미치는지 경험적 측면에서 조사를 진행.

어떤 한 알고리즘이 모든 밴딧 문제에 우위에 있지는 않지만, 어떤 트렌드를 확인했음. dropout, injecting random noise, 그리고 bootstrapping 은 어떤 과제에 대해서는 높은 성능 향상을 보였지만, synthetic exploration task 는 잘 풀어내지 못함. 다른 알고리즘들인 Variational Inference, Black Box α-divergence, 그리고 minibatch Markov Chain Monte Carlo 접근 방법들은 온라인 상황에서 잘 동작하지 않았음. 그리고 Bayesian linear regression 는 나름 robust 하고 튜닝이 쉬웠음.

# C) Discussion

## C.1) Linear Methods

In terms of the diagonal linear approximations, we found that diagonalizing the precision matrix (as in mean-field Variational Inference) performs dramatically better than diagonalizing the covariance matrix.

# D) Future Work

the impact on performance of approximate model posteriors for decision making via Thompson Sampling in contextual bandits.

# E) References

* [paper link](https://arxiv.org/pdf/1802.09127.pdf)
