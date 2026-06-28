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

Prefill은 LLM이 사용자의 prompt 전체를 처음 한 번 읽고, 첫 output token을 만들 준비를 하는 단계다.

LLM serving은 보통 두 단계로 나눠 본다.

```text
prefill: prompt 전체를 병렬로 처리하고 KV Cache를 만든다
decode: 새 token을 하나씩 생성한다
```

그래서 prefill 성능은 주로 **첫 token이 나오기까지의 시간**, 즉 TTFT(Time To First Token)에 영향을 준다. decode 성능은 이후 token들이 얼마나 빠르게 이어서 나오는지, 즉 TPOT(Time Per Output Token)이나 inter-token latency에 더 직접적으로 연결된다.

# B) Prefill에서 실제로 하는 일

사용자가 아래 prompt를 보냈다고 하자.

```text
Q: FP8 quantization을 쉽게 설명해줘.
```

모델은 이 prompt를 token으로 쪼갠 뒤, prompt token 전체를 Transformer에 통과시킨다. 이때 각 layer에서 attention key/value를 계산하고, 다음 decode 단계에서 재사용할 수 있도록 [[KV Cache]]에 저장한다.

```text
prompt tokens
-> transformer layers
-> KV Cache 생성
-> first output token 확률 계산
```

이 단계가 끝나야 첫 번째 output token을 만들 수 있다. 그래서 prompt가 길수록 prefill 시간이 길어진다.

# C) Decode와 무엇이 다른가

Decode는 prefill 이후에 시작된다. prefill에서 만든 KV Cache를 들고, output token을 하나씩 생성한다.

```text
prefill:
  input token 1..N을 한 번에 처리

decode:
  output token N+1
  output token N+2
  output token N+3
  ...
```

prefill은 prompt token들을 병렬로 처리할 수 있다. 반면 decode는 autoregressive generation이라 이전 token이 나와야 다음 token을 만들 수 있다. 이 차이 때문에 두 단계의 병목도 다르다.

| 구간 | 입력 모양 | 주 병목 | 주요 지표 |
| --- | --- | --- | --- |
| Prefill | prompt token 전체 | 대규모 matrix multiplication | TTFT, prefill throughput |
| Decode | 새 token 1개씩 | KV cache read, memory bandwidth, scheduling | TPOT, inter-token latency |

# D) GEMM이 여기서 왜 나오나

GEMM은 General Matrix Multiplication의 줄임말이다. 쉽게 말해 큰 행렬 곱이다.

Transformer의 linear layer는 대부분 다음 형태의 계산을 한다.

$$
Y = XW
$$

여기서:

| 기호 | 뜻 |
| --- | --- |
| $X$ | token들의 hidden state |
| $W$ | layer의 weight matrix |
| $Y$ | 다음 layer로 넘어갈 activation |

prefill에서는 prompt token 전체가 한 번에 들어간다. batch 안에 request가 많거나 prompt가 길면 $X$의 token dimension이 커진다.

```text
X: [batch * prompt_length, hidden_dim]
W: [hidden_dim, hidden_dim]
Y: [batch * prompt_length, hidden_dim]
```

이 모양은 GPU가 좋아하는 큰 GEMM이 된다. Tensor Core가 바쁘게 일할 수 있고, FP8 같은 저정밀 연산도 잘 붙는다. 그래서 "batch가 충분히 커서 GEMM 처리량이 병목"이라고 하면, prefill에서 큰 행렬 곱을 얼마나 빨리 처리하느냐가 throughput을 좌우한다는 뜻이다.

반대로 decode는 step마다 새 token을 하나씩 처리한다. 물론 decode에서도 내부 계산은 matrix multiplication이지만, 한 번에 처리하는 token 수가 작고 KV Cache를 계속 읽어야 한다. 그래서 decode는 GEMM compute보다 memory bandwidth, KV cache 접근, scheduler overhead가 더 두드러질 때가 많다.

# E) Prefill Throughput은 무엇을 재나

Prefill throughput은 보통 prompt token을 초당 얼마나 처리하는지로 본다.

```text
prefill throughput = processed input tokens / prefill time
```

예를 들어 8개의 request가 있고, 각 prompt가 4K token이라면 prefill에서 처리해야 할 input token은 32K token이다. 이 32K token을 얼마나 빨리 Transformer에 통과시키고 KV Cache를 만들 수 있는지가 prefill throughput이다.

이 값은 다음 상황에서 중요하다.

1. RAG처럼 prompt가 긴 서비스
2. agent trace나 code context처럼 입력이 긴 서비스
3. 동시 요청이 많아 prompt batch가 커지는 serving
4. long-context benchmark
5. vLLM/SGLang에서 TTFT가 크게 튀는 상황 분석

# F) FP8과 Prefill의 관계

[[FP8 Quantization]]이 prefill에 잘 먹히는 이유는 prefill이 큰 GEMM을 많이 만들기 때문이다. H100/H200/Blackwell에서는 FP8 Tensor Core를 쓸 수 있고, batch와 prompt length가 충분히 크면 FP8 GEMM 처리량 이득이 throughput으로 이어질 수 있다.

하지만 prefill이 항상 FP8만으로 해결되는 것은 아니다. prompt가 아주 길면 KV Cache 생성과 memory allocation도 커지고, concurrent request가 많으면 scheduler와 queueing도 중요해진다.

그래서 FP8을 평가할 때는 지표를 나눠 봐야 한다.

| 지표 | 의미 |
| --- | --- |
| TTFT | 사용자가 요청한 뒤 첫 token이 나오기까지의 시간 |
| Prefill throughput | prompt token을 초당 얼마나 처리하는지 |
| TPOT | 첫 token 이후 output token 하나를 만드는 평균 시간 |
| Decode throughput | output token을 초당 얼마나 생성하는지 |

FP8은 prefill throughput을 올릴 가능성이 크다. 반면 TPOT나 inter-token latency는 KV Cache, memory bandwidth, batch scheduling 영향도 커서 별도로 측정해야 한다.

# G) 실무 체크리스트

Prefill 병목을 볼 때는 아래를 같이 확인한다.

1. input token 수가 긴가?
2. TTFT가 TPOT보다 훨씬 큰가?
3. GPU utilization은 높지만 output token/sec가 기대보다 낮은가?
4. batch size를 키우면 prefill throughput이 좋아지는가?
5. FP8/BF16 전환 시 prefill throughput과 decode throughput이 다르게 움직이는가?
6. KV Cache memory 때문에 batching이 제한되고 있지는 않은가?

짧게 말하면, prefill은 모델이 prompt를 "읽는" 단계이고, decode는 답변을 "말하는" 단계다. 긴 prompt 서비스에서는 읽는 시간이 병목이 되고, 긴 답변 서비스에서는 말하는 시간이 병목이 된다.

# References

- Zhong et al., [DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language Model Serving](https://arxiv.org/abs/2401.09670)
- [[KV Cache]]
- [[FP8 Quantization]]
