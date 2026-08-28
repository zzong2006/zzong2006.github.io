---
title: "DropoutNet - Addressing Cold Start in Recommender Systems"
tags: ["NIPS", "cold-start", "deep_learning", "paper_review", "recommendation_system", "y2017"]
aliases: ["DropoutNet"]
---

# A) Approach

## A.1) 목적

cold 와 warm 시나리오를 둘 다 처리할 수 있는 모델을 만드는 것

## A.2) Input

content 와 preference 정보를 모두 input 으로 사용한다. 이 경우, preference matrix $\mathbf{R}$ 을 입력으로 쓰는 경우에

# B) DropoutNet 구조 다이아그램

![](https://i.imgur.com/FFObhW3.png)

유저 선호도와 content 는 각각 DNN 을 통해 $f_{\mathbf{U}}$ 그리고 $f_{\boldsymbol{\Phi}^{\mathcal{U}}}$ 를 생성한다. 이후 둘은 concatenate 되어 fine-tuning network $f_{\mathcal{U}}$ 를 통과하여 유저의 latent representation $\hat{\mathbf{U}}_{u}$ 을 출력한다. 아이템 역시 동일한 방식으로 동작한다.

학습 과정에서는 jointly 하게 back-propagation 으로 최적화를 진행하며, inference 과정에서는 모두 고정시킨다.

# C) References

* paper link: https://papers.nips.cc/paper/2017/file/dbd22ba3bd0df8f385bdac3e9f8be207-Paper.pdf
