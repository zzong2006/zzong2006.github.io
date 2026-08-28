---
title: "vicuna"
tags: ["LLM"]
aliases: ["비쿠나"]
---

# A) Vicuna ?

ShareGPT 에서 모은 약 125K 개의 사용자 대화 데이터를 기반으로 파인튜닝한 [[Llama]] 기반 모델

# B) Training

## B.1) 데이터셋

**ShareGPT 데이터셋은 공개하지 않음**

### B.1.1) Preprocessing

* To ensure data quality, we convert the HTML back to markdown and filter out some inappropriate or low-quality samples.  
* Additionally, we divide lengthy conversations into smaller segments that fit the model’s maximum context length.

# C) References

* [GitHub - lm-sys/FastChat](https://github.com/lm-sys/FastChat): An open platform for training, serving, and evaluating large language models. Release repo for Vicuna and Chatbot Arena.
