---
title: "KV Cache"
tags:
  - LLM
  - inference
  - transformer
aliases: [Key-Value Cache]
---

# A) KV Cache

KV Cache는 Transformer decoder가 autoregressive generation을 할 때 이전 token들의 key/value tensor를 저장해두는 cache다. 다음 token을 만들 때 과거 token의 key/value를 다시 계산하지 않아도 되므로 LLM inference latency를 크게 줄인다.

# B) 왜 필요한가

Autoregressive decoding은 token을 하나씩 생성한다. 매 step마다 전체 prefix를 다시 Transformer에 통과시키면 계산이 중복된다. KV Cache는 이전 step에서 계산한 attention key/value를 보관하고, 새 token의 query만 추가로 계산해 attention을 수행한다.

# C) trade-off

속도는 빨라지지만 sequence length와 batch size가 커질수록 GPU memory를 많이 쓴다. 그래서 vLLM의 PagedAttention처럼 KV Cache를 효율적으로 관리하는 기법이 LLM serving에서 중요해진다.

# References
