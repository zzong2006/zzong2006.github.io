---
layout: post
title: Multi-Head Latent Attention
date: 2025-02-06 21:00:00
giscus_comments: true
categories: ml-fundamentals
toc:
  beginning: true
  sidebar: left
tags: NLP attention
---

MQA (Multi-Query Attention) 또는 GQA (Grouped Query Attention) 처럼 헤드 수를 줄이는 대신, $W_{KV}$ 행렬을 저차원 행렬 분해(Low-rank decomposition) 방식으로 압축한다.

MLA의 작동 방식은 다음과 같다:

1. $K$ 와 $V$ 벡터를 압축하여 잠재(Latent) $K$ 와 $V$ 벡터로 변환
2. 이 압축된 정보를 KV 캐시에 저장
3. 필요할 때 이를 다시 전체 크기의 $K$ 와 $V$ 로 복원 (Decompression)

