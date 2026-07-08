---
title: "Prompt Compression"
tags: ["LLM", "inference", "prompt_compression"]
aliases: ["프롬프트 압축", "prompt compression"]
---

# A) 한줄 요약

Prompt Compression은 [[Large Language Model|LLM]]에 넣는 prompt를 더 짧게 줄이되, 답변에 필요한 정보는 최대한 남기려는 input 최적화 방법이다. 긴 [[Retrieval-Augmented Generation|RAG]] context나 대화 기록을 그대로 넣으면 [[Prefill]] 비용과 input token 비용이 커지므로, 불필요하거나 중복된 token을 제거해 정보 밀도를 높인다.

대표적인 hard prompt compression 방법이 [[LLMLingua]] 다. LLMLingua는 사람이 읽기 좋은 요약을 만드는 것이 아니라, LLM이 답변하는 데 필요한 단서를 남기는 쪽에 가깝다.

최근 흐름은 단순 token 삭제를 넘어 query-aware RAG compression, generative rewrite, gist token이나 memory slot 같은 representation-level compression, 그리고 실제 serving break-even 평가로 넓어지고 있다. 이 변화는 [[Prompt Compression Trends|Prompt Compression Trends - From Token Pruning to Context Engineering]]에서 따로 정리한다.

# B) Hard Compression과 Soft Compression

Prompt compression은 크게 두 흐름으로 볼 수 있다.

| 구분 | 설명 | 장점 | 단점 |
| --- | --- | --- | --- |
| Hard compression | 원본 prompt를 더 짧은 텍스트로 바꿈 | black-box LLM API에 붙이기 쉬움 | 문장이 깨지고 정보 손실 가능 |
| Soft compression | prompt를 embedding이나 special token으로 압축 | token 절감 폭이 클 수 있음 | target LLM 학습이나 내부 접근이 필요 |

[[LLMLingua]]는 hard compression 쪽이다. 압축 결과가 일반 텍스트이므로 GPT, Claude, hosted open model처럼 내부를 바꿀 수 없는 LLM에도 적용하기 쉽다. 반대로 [[xRAG]]는 document embedding을 LLM이 직접 이해하게 만드는 접근이라 token 절감은 더 공격적일 수 있지만, 모델 수정이나 학습이 필요하다.

# C) 실무에서 봐야 할 지표

Prompt compression은 항상 이득이 아니다. compressor를 먼저 실행하는 시간이 있고, 압축 과정에서 중요한 정보가 빠질 수도 있다.

도입 여부는 아래 지표를 같이 보고 판단해야 한다.

1. compression time
2. target LLM TTFT
3. end-to-end latency
4. input token cost
5. answer correctness
6. citation faithfulness
7. compression ratio adherence

짧은 prompt에서는 압축 overhead가 이득을 잡아먹기 쉽다. 반대로 5k token 이상 RAG context처럼 input이 길고 [[Prefill]]이 병목인 경우에는 LLMLingua 계열을 평가해볼 만하다.

# References

- [[Prompt Compression Trends|Prompt Compression Trends - From Token Pruning to Context Engineering]]
- [[LLMLingua]]
- [[Prefill]]
- [[Retrieval-Augmented Generation]]
- [[xRAG]]
