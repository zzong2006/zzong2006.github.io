---
layout: post
title: "Deepseek-R1 모델"
date: 2025-04-13 10:00:00
giscus_comments: true
categories: model-review
toc:
  beginning: true
  sidebar: left
tags: LLM reasoning inference DeepSeek
---

새로운 DeepSeek-R1 모델이 나왔다. [Huggingface](https://huggingface.co/deepseek-ai/DeepSeek-R1-0528)

## 성능 개선 사항들

![Image](https://i.imgur.com/MhY760V.png){: width="100%"}

코딩 실력이 많이 향상되었다고 한다.

- R1은 이제 Artificial Analysis Coding Index에서 Gemini 2.5 Pro랑 비슷한 수준이고, o4-mini (high)랑 o3만 R1보다 우위를 보인다.

더 많은 토큰 사용량

- R1-0528은 Artificial Analysis Intelligence Index 평가를 끝내는 데 9,900만 개 토큰을 썼는데, 이건 원래 R1이 썼던 7,100만 개보다 40%나 더 많이 쓴 결과다.
- 즉, 새로운 R1이 더 오래 생각한다는 뜻이다. 근데 이게 제일 많은 건 아니고, Gemini 2.5 Pro는 R1-0528보다 30%나 더 많은 토큰을 쓴다고 한다.

## DeepSeek-R1-0528-Qwen3-8B

DeepSeek-R1-0528의 chain-of-thought(추론 과정)을 Qwen3 8B Base에 distillation해서 DeepSeek-R1-0528-Qwen3-8B라는 모델도 만들었다.
이 모델은 AIME 2024 벤치마크에서 오픈소스 모델 중 SOTA(최고 성능)를 달성했고, Qwen3 8B보다 10% 더 좋은 성능을 보였다. 심지어 Qwen3-235B-thinking이랑도 비슷한 수준이다.


