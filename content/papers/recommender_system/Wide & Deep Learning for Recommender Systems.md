---
title: "Wide & Deep Learning for Recommender Systems"
tags: ["e-commerce", "deep_learning", "linear_regression", "paper_review", "recommendation_system"]
aliases: ["Wide & Deep"]
---

# A) Abstract

# B) Introduction

A wide linear model and a deep neural network are trained together to both memorize and generalize a recommendation systems.

## B.1) The Spectrum of Wide & Deep Models

![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FC2NcIgtvcN.png?alt=media&token=7caa6971-0a0e-45b6-aad6-26a5fe2969a8)

* Wide linear model 은 cross-product feature 변환을 활용하여 이미 관찰한 상호작용의 feature 를 memorize 한다.
* deep models 은 이전에 관찰하지 못한 상호작용에 대한 feature 를 저차원 임베딩을 통해 generalize 한다.

# C) References

* [paper link](https://arxiv.org/abs/1606.07792)
