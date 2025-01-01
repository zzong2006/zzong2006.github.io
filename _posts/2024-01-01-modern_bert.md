---
title: "새로운 Bert 모델: ModernBERT"
last_modified_at: 2025-01-01 12:00:00 -0000
categories:
  - Review
tags:
  - Encoder
  - BERT
---

## 논문 정보

### 제목

Smarter, Better, Faster, Longer: A Modern Bidirectional Encoder for Fast, Memory Efficient, and Long Context Finetuning and Inference

### Paper URL

- blog: https://huggingface.co/blog/modernbert
- paper: https://huggingface.co/papers/2412.13663


## 배경

a family of state-of-the-art encoder-only models representing improvements over older generation encoders across the board, with a 8192 sequence length, better downstream performance and much faster processing.

Encoder-only transformer models such as BERT offer a great performance-size tradeoff for retrieval and classification tasks with respect to larger decoder-only models. Despite being the workhorse of numerous production pipelines, there have been limited Pareto improvements to BERT since its release. In this paper, we introduce ModernBERT, bringing modern model optimizations to encoder-only models and representing a major Pareto improvement over older encoders. Trained on 2 trillion tokens with a native 8192 sequence length, ModernBERT models exhibit state-of-the-art results on a large pool of evaluations encompassing diverse classification tasks and both single and multi-vector retrieval on different domains (including code). In addition to strong downstream performance, ModernBERT is also the most speed and memory efficient encoder and is designed for inference on common GPUs.

