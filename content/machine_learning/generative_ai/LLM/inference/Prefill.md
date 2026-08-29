---
title: Prefill
tags:
  - LLM
  - inference
  - serving
  - latency
aliases:
  - prefill
  - prefill phase
  - prefill throughput
---

# A) 한줄 요약

Prefill은 LLM이 사용자의 prompt를 처음 한 번 읽는 단계다. 이때 모델은 prompt token 전체를 Transformer에 통과시키고, 이후 decode에서 재사용할 [[KV Cache]]를 만든다.

LLM serving을 단순하게 나누면 아래처럼 볼 수 있다.

```text
prefill: prompt 전체를 읽고 KV Cache를 만든다
decode: KV Cache를 보면서 output token을 하나씩 말한다
```

그래서 prefill은 사용자가 요청을 보낸 뒤 **첫 token이 나오기까지의 시간**, 즉 TTFT(Time To First Token)에 직접 영향을 준다. 반대로 decode는 첫 token 이후 답변이 얼마나 부드럽게 이어지는지, 즉 TPOT(Time Per Output Token)이나 inter-token latency와 더 가깝다.

짧게 말하면, prefill은 모델이 질문을 읽는 시간이고 decode는 답을 말하는 시간이다.

# B) 왜 두 단계로 나눠 보나

LLM은 한 번에 완성된 문장을 뱉지 않는다. 먼저 사용자의 prompt를 읽고, 그다음부터 token을 하나씩 이어 붙인다.

예를 들어 사용자가 아래처럼 물었다고 하자.

```text
Q: FP8 quantization을 쉽게 설명해줘.
```

모델은 이 문장을 token으로 쪼갠 뒤 prompt 전체를 한 번에 처리한다. 이 과정에서 각 layer의 attention key/value가 계산되고, 그 결과가 KV Cache에 저장된다. 여기까지가 prefill이다.

```text
prompt tokens
-> transformer layers
-> KV Cache 생성
-> first output token 확률 계산
```

이 단계가 끝나야 첫 번째 output token을 고를 수 있다. prompt가 길수록 읽어야 할 token이 많아지고, 그만큼 TTFT도 길어지기 쉽다. RAG처럼 context를 많이 붙이거나, agent trace와 code context가 길게 들어가는 서비스에서 prefill이 먼저 병목으로 보이는 이유가 여기에 있다.

# C) Decode와 무엇이 다른가

Prefill이 끝나면 decode가 시작된다. decode는 prefill에서 만든 KV Cache를 들고 output token을 하나씩 생성한다.

```text
prefill:
  input token 1..N을 한 번에 처리

decode:
  output token N+1
  output token N+2
  output token N+3
  ...
```

두 단계의 가장 큰 차이는 병렬성이다.

Prefill에서는 이미 prompt token이 모두 주어져 있다. 모델 입장에서는 읽을 문장이 한꺼번에 들어온 셈이라 여러 token을 병렬로 처리할 수 있다.

Decode는 다르다. autoregressive generation에서는 이전 token이 나와야 다음 token을 만들 수 있다. 방금 생성한 token을 다시 입력으로 넣고, KV Cache를 읽으며 다음 token을 고른다. 이 반복이 답변이 끝날 때까지 이어진다.

그래서 prefill과 decode는 같은 Transformer 안에서 돌지만 병목은 다르게 나타난다.

| 구간 | 입력 모양 | 주 병목 | 주요 지표 |
| --- | --- | --- | --- |
| Prefill | prompt token 전체 | 큰 matrix multiplication | TTFT, prefill throughput |
| Decode | 새 token 1개씩 | KV Cache read, memory bandwidth, scheduling | TPOT, inter-token latency |

# D) GEMM은 왜 Prefill에서 중요해지나

Prefill을 성능 관점에서 보면 핵심은 prompt token 전체를 빠르게 밀어 넣는 일이다. 이때 Transformer의 linear layer는 대부분 큰 행렬 곱으로 실행된다.

GEMM은 General Matrix Multiplication의 줄임말이다. 쉽게 말해 큰 행렬 곱이다.

$$
Y = XW
$$

여기서:

| 기호 | 뜻 |
| --- | --- |
| $X$ | token들의 hidden state |
| $W$ | layer의 weight matrix |
| $Y$ | 다음 layer로 넘어갈 activation |

Prefill에서는 prompt token 전체가 한 번에 들어간다. batch 안에 request가 많거나 prompt가 길면 $X$의 token dimension이 커진다.

```text
X: [batch * prompt_length, hidden_dim]
W: [hidden_dim, hidden_dim]
Y: [batch * prompt_length, hidden_dim]
```

이 모양은 GPU가 좋아하는 큰 GEMM이 된다. Tensor Core를 바쁘게 채울 수 있고, batch와 prompt length가 충분히 크면 compute throughput을 잘 뽑아낸다.

그래서 "prefill은 GEMM 처리량이 중요하다"는 말은 prompt를 읽는 동안 큰 행렬 곱을 얼마나 빨리 처리하느냐가 TTFT와 throughput을 크게 좌우한다는 뜻이다.

Decode에서도 matrix multiplication은 일어난다. 다만 step마다 새 token을 하나씩 처리하므로 한 번에 처리하는 token 수가 작다. 여기에 KV Cache를 계속 읽어야 해서 memory bandwidth, cache access, scheduler overhead가 더 크게 보일 때가 많다.

# E) Prefill Throughput은 무엇을 재나

Prefill throughput은 prompt token을 초당 얼마나 처리하는지로 본다.

```text
prefill throughput = processed input tokens / prefill time
```

예를 들어 8개의 request가 있고 각 prompt가 4K token이라면, prefill에서 처리해야 할 input token은 32K token이다. 이 32K token을 얼마나 빨리 Transformer에 통과시키고 KV Cache로 남기는지가 prefill throughput이다.

이 지표는 특히 입력이 긴 서비스에서 중요하다.

1. RAG처럼 검색 결과를 prompt에 많이 붙이는 서비스
2. agent trace나 code context처럼 입력이 긴 서비스
3. 동시 요청이 많아 prompt batch가 커지는 serving
4. long-context benchmark
5. vLLM/SGLang에서 TTFT가 크게 튀는 상황 분석

여기서 조심할 점은 prefill throughput이 좋아졌다고 항상 사용자가 느끼는 전체 응답이 좋아지는 것은 아니라는 점이다. 첫 token은 빨라질 수 있지만, 긴 답변을 생성하는 구간은 decode 병목의 영향을 따로 받는다.

입력 token 자체가 병목이라면 [[LLMLingua]] 같은 prompt compression도 선택지가 된다. 이 접근은 모델 실행 방식을 바꾸는 대신 prompt를 짧게 만들어 prefill 부담을 줄인다. 다만 compressor를 먼저 돌리는 시간이 있으므로, 전체 latency 기준으로 이득이 나는지 따로 재야 한다.

# F) FP8과 Prefill의 관계

[[FP8 Quantization]]이 prefill에서 효과를 보기 쉬운 이유도 같은 흐름으로 이해할 수 있다. Prefill은 prompt 전체를 읽는 동안 큰 GEMM을 많이 만든다. H100/H200/Blackwell처럼 FP8 Tensor Core를 잘 활용할 수 있는 GPU에서는 이 큰 GEMM이 FP8 처리량 이득으로 이어질 수 있다.

다만 prefill이 항상 FP8만으로 해결되는 것은 아니다. prompt가 아주 길면 KV Cache 생성과 memory allocation 부담도 커진다. concurrent request가 많으면 scheduler와 queueing도 TTFT에 영향을 준다.

그래서 FP8을 평가할 때는 지표를 나눠 봐야 한다.

| 지표 | 의미 |
| --- | --- |
| TTFT | 사용자가 요청한 뒤 첫 token이 나오기까지의 시간 |
| Prefill throughput | prompt token을 초당 얼마나 처리하는지 |
| TPOT | 첫 token 이후 output token 하나를 만드는 평균 시간 |
| Decode throughput | output token을 초당 얼마나 생성하는지 |

FP8은 prefill throughput을 올릴 가능성이 크다. 하지만 TPOT나 inter-token latency는 KV Cache, memory bandwidth, batch scheduling의 영향도 크다. 그래서 prefill과 decode를 한 숫자로 합쳐 보면 어디가 좋아졌고 어디가 그대로인지 놓치기 쉽다.

# G) 실무에서 어떻게 읽어야 하나

Prefill 병목을 볼 때는 먼저 사용자가 체감하는 지연이 어디서 생기는지 나눠 봐야 한다.

1. input token 수가 긴가?
2. TTFT가 TPOT보다 훨씬 큰가?
3. GPU utilization은 높은데 output token/sec가 기대보다 낮은가?
4. batch size를 키우면 prefill throughput이 좋아지는가?
5. FP8/BF16 전환 시 prefill throughput과 decode throughput이 다르게 움직이는가?
6. KV Cache memory 때문에 batching이 제한되고 있지는 않은가?

긴 prompt 서비스에서는 모델이 읽는 시간이 병목이 된다. 긴 답변 서비스에서는 모델이 말하는 시간이 병목이 된다.

이 구분을 잡고 보면 TTFT, prefill throughput, TPOT, decode throughput이 서로 따로 노는 이유가 자연스럽게 보인다. 같은 LLM inference라도 어느 구간을 보고 있느냐에 따라 최적화 방향이 달라진다.

# References

- Zhong et al., [DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language Model Serving](https://arxiv.org/abs/2401.09670)
- [[KV Cache]]
- [[FP8 Quantization]]
