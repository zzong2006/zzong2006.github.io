---
title: "Self-Rewarding Language Models"
tags: ["language_model", "Meta", "nlp", "paper_review", "y2024"]
---

# A) Self-Rewarding Language Models ?

Self-Rewarding Language Models, where the language model itself is used via LLM-as-a-Judge prompting to provide its own rewards during training.

* 스스로 보상을 주는 언어 모델을 메타에서 제안했다. 이 언어 모델 자체가 학습 과정에서 Judge 가 되어 스스로 보상을 결정한다.
* Iterative DPO 학습 과정을 제안
* 제안된 방식으로 Llama2 70B 로 학습한 모델은 Gemini Pro, GPT-4 0613 을 이겼다.

# B) 기존 방식 (DPO, PPO) 문제점

* 어느쪽이든 선호 데이터의 품질과 양이 문제가 된다 (=병목이 된다).
* 그리고 RLHF(PPO) 의 경우, 이런 데이터를 이용해서 학습한 보상 모델은 frozen 된 상태로 진행하는 것이 문제가 된다.

제안된 언어 모델은 언어 모델 그 자체와 보상 모델 두 개의 역할을 모두 수행하게 된다. 즉, (1) 주어진 프롬프트에 따라 명령을 수행하는 응답을 생성하거나, (2) 새로운 명령을 생성하고 평가하여 기존 학습 데이터에 추가하는 작업을 수행할 수 있다.

Self-rewarding 방식을 거듭할수록 보다 seed model 대비해서 명령을 따르는 능력 뿐만 아니라 보상 능력까지 향상되는 효과를 확인했다고 주장한다.

![](https://i.imgur.com/b4zkCB3.png)

제안한 방식은 이미 학습된 base 언어 모델 + 작은 양의 human-annotated seed data 가 있다는 가정하에 진행된다.

주어진 모델은 두 기능을 수행해야 한다.

1. Instruction following: 프롬프트 주고 원하는 결과 생성
2. Self-Instruction creation: 새로운 Instruction following 샘플을 생성하고 평가하여 학습 데이터에 추가할 수 있어야 한다.

# C) 모델

* Base 모델은 Llama2 70B 모델인데, [open-assistant 데이터셋](https://huggingface.co/datasets/OpenAssistant/oasst1) 으로 파인튜닝된 베이스 모델로부터 시작했다.

# D) Data

## D.1) Human-annotated Seed Data

1. Seed instruction following data (IFT, Instruction Fine-Tuning): SFT 데이터
2. Seed LLM-as-a-Judge instruction following data: 평가 프롬프트를 주고, 응답을 평가하는 결과를 생성하는 데이터.
	1. 일반적으로 (1) 을 통해 학습된 모델로 충분히 평가를 진행할 수 있기 때문에, 평가 명령 데이터가 개별적으로 더 필요한것은 아님. 다만,
	2. 평가 응답은 CoT 기반의 추론을 통해 평가의 정당성을 제시하고, 최종 점수 (ex. 0~5) 로 평가할 수 있다.

## D.2) 추가 데이터 구성

* DPO: To form the winning and losing pair we take the highest and lowest scoring responses from the N evaluated candidate responses, discarding the pair if their scores are the same.
* 만점을 받은 데이터는 SFT 에 추가

# E) Discussion

아래의 논문에서도 비슷한 방법이 소개되었다고 한다.

> We train these models using an Iterative DPO framework similar to that recently introduced in [Some things are more CRINGE than others: Preference Optimization with the Pairwise Cringe Loss](https://arxiv.org/abs/2312.16682)

위 논문에 영감을 많이 받은듯?

# F) 발견점들

* We note that in our experiments, we found that adding only positive examples in a related manner did not help, whereas adding preference pairs did help.
* Further, we observed an increase in length in model generations, and there is a known correlation between length and estimated quality.

# G) Related

# H) References

* [2401.10020.pdf](https://arxiv.org/pdf/2401.10020.pdf)
