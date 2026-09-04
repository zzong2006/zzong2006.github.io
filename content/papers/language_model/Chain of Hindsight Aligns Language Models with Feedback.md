---
title: "Chain of Hindsight Aligns Language Models with Feedback"
tags:
  - language_model
  - -
  - LLM
  - nlp
  - paper_review
  - LLM
  - paper_review
  - y2023
aliases:
  - CoH
---

# A) Chain of Hindsight Aligns Language Models with Feedback?

# B) [[supervised fine-tuning|SFT]]

* 사전 학습된 언어 모델을 미세 조정하는 데 사용됩니다.
* 인간이 주석을 달아준 데이터와 긍정적으로 평가된 모델 생성에 의존합니다.

## B.1) 문제점

* 이 접근 방식은 레이블이 지정된 데이터의 가용성에 크게 의존하며, 이는 상당한 비용과 시간 투자를 필요로 할 수 있습니다.
* 긍정적으로 평가된 데이터에만 의존하면 모델이 부정적인 속성이나 오류를 식별하고 수정하는 능력이 제한될 수 있으며, 따라서 새로운 데이터나 보지 못한 데이터에 대한 일반화 능력이 감소할 수 있습니다.

# C) RLHF

* 피드백 등급과 상관없이 모든 데이터를 학습할 수 있게 합니다.
* 이 방법은 보상 함수를 학습해야 하며, 이는 불일치와 결함이 있을 수 있습니다.
* 강화 학습 알고리즘의 최적화는 어려울 수 있으며, 적용하는 데 상당한 어려움을 초래할 수 있습니다.

# D) 제안 방법: CoH

![CoH](https://i.imgur.com/ZSV9oNx.png)

SFT 와 RLHF 의 강점을 결합하여 강화 학습 없이 모든 피드백을 활용함으로써 두 방법의 한계를 극복합니다.

우리의 접근 방식은 causual & decoder-only 인 기존 Transformer 모델 아키텍처를 사용합니다. 토큰으로 표현된 텍스트 $\mathbf{x}=\left[x_1, \cdots, x_n\right]$ 가 주어졌을 때, $\mathbf{x}$ 의 log [[likelihood]] 를 자동 회귀적으로 최대화하는 것입니다. CoH 에서는 여러 모델 출력과 피드백을 결합하여 $\mathbf{x}$ 를 구성합니다.

# E) References
