---
title: "Llama"
tags: ["LLM"]
aliases: ["라마", "라마2", "Llama2"]
---

# A) Llama ?

# B) Llama 2

모델 사이즈

* 7, 13, 34, 70 billion and a Llama chat variant with the same sizes

## B.1) 기존 모델과 비교

* increased the size of the pretraining corpus by 40%
* doubled the context length of the model to 4k
* adopted grouped-query attention

## B.2) 학습 방식

[[RLHF]] 가 모델 성능에 매우 중요하다고 강조

* Uses two reward models to avoid the safety-helpfulness tradeoff identified in Anthropic’s work.
* Uses a two-stage RLHF approach: starting with Rejection Sampling, then doing Rejection Sampling + [[Proximal Policy Optimization]] (PPO)

## B.3) Text Generation

* Temperature: 창의적인 답변을 원한다면 temperature 를 올려야 한다.

# C) Tokenizer

The model is not learning to predict the `EOS` token.

[LLaMA FastTokenizer does not add \`eos\_token\_id\` at the end. · Issue #22794 · huggingface/transformers · GitHub](https://github.com/huggingface/transformers/issues/22794#issuecomment-1598977285)

# D) References

* [Llama 2: an incredible open LLM - by Nathan Lambert](https://www.interconnects.ai/p/llama-2-from-meta?sd=pf)
