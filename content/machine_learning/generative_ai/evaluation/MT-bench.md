---
title: "MT-bench"
tags: ["LMSYS", "LLM", "evaluation"]
---

# A) MT-bench ?

MT-bench LLM 모델을 평가하기 위한 multi-turn open-ended 질문 모음

To automate the evaluation process, we prompt strong LLMs like GPT-4 to act as judges and assess the quality of the models’ responses.

# B) 논문 주장

* strong LLM judges like GPT-4 can match both controlled and crowdsourced human preferences well, achieving over 80% agreement, the same level of agreement between humans.

# C) Methods

1. MT-bench 질문들에 대해 타겟 모델의 응답을 생성한다.
2. GPT-4 의 평가 (judgement) 들을 생성한다.
	1. 여러 옵션이 존재한다: (1) pairwise winrate, (2) single-answer grading (default)
3. MT-bench 점수를 계산한다.

# D) References

* [github: llm\_judge](https://github.com/lm-sys/FastChat/tree/main/fastchat/llm_judge)
* paper: [[2306.05685] Judging LLM-as-a-judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685)
