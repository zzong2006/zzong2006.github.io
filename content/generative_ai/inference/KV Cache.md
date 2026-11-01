---
title: "KV Cache"
tags:
  - LLM
  - inference
  - transformer
aliases: [Key-Value Cache]
---

# A) 한눈에 보기

- **KV cache 는 앞 토큰들의 key·value 를 저장해 두는 캐시다.** 새 토큰을 만들 때 앞 토큰들의 key·value 를 다시 계산하지 않고, 새 토큰의 query 와 저장된 key 의 내적만 한다.
- **그 대가로 GPU 메모리를 쓴다.** 캐시 크기는 시퀀스 길이와 동시 요청 수에 비례해 커진다.
  - Llama 3 8B 는 토큰 하나에 128 KiB 를 쓴다. 8K 문맥 요청 16 개를 동시에 받으면 16 GiB 로, 모델 가중치(약 16 GB)와 비슷해진다.
- **캐시를 줄이는 방법은 크기 식의 어느 항을 줄이는지로 나뉜다.** MQA·GQA 는 key·value head 수를, KV 양자화는 숫자 하나의 바이트 수를, PagedAttention 은 미리 잡아 두고 안 쓰는 빈자리를 줄인다.

query·key·value 와 attention 계산 자체는 [[attention function|Attention]] 노트에서 설명했다. 이 노트는 그 위에서 캐시가 왜 필요하고 얼마나 커지는지를 그림으로 본다.

# B) 캐시가 있을 때와 없을 때의 디코딩

LLM 이 「오늘」 다음에 올 말을 만든다고 하자. 모델은 답을 한 번에 만들지 않는다. 「날씨가」 를 고르면 그것을 입력 끝에 붙여 다시 모델을 돌리고, 「정말」, 「좋다」 를 차례로 고른다. 토큰 하나를 고르는 한 번을 스텝이라 하고, 이렇게 하나씩 만드는 방식을 autoregressive decoding 이라 한다.

스텝마다 attention 이 하는 일은 같다. 새 토큰의 query(Q) 를 앞 토큰들의 key(K) 와 내적해 점수를 내고, 그 점수로 value(V) 를 가중 평균한다. 아래 그림은 토큰 4 개를 만드는 동안 이 Q·K·V 가 스텝마다 어떻게 늘어나는지 보여 준다.

![[img-84da1c4471.png]]

그림 읽는 법: 한 줄이 토큰 하나다. 주황은 그 스텝에 새로 계산한 행, 빗금은 직전 스텝에서 이미 계산한 것을 다시 계산한 행, 파랑은 캐시에서 읽기만 한 행이다.

- **캐시가 없으면 스텝마다 지금까지의 토큰 전체를 다시 계산한다.** 스텝 4 에서 「오늘」·「날씨가」·「정말」 의 K·V 를 또 만드는데, 직전 스텝에서 만든 값과 똑같다.
- **캐시가 있으면 새 토큰 한 줄만 계산한다.** 앞 토큰의 K·V 는 캐시에서 읽고, Q 도 새 토큰 것 하나만 있으면 된다.
  - 다음 토큰을 고르는 데 쓰는 것은 마지막 토큰 자리의 출력뿐이라서, 앞 토큰들의 Q 는 필요 없다.

**앞 토큰의 K·V 는 뒤에 토큰이 붙어도 바뀌지 않는다.** 이것이 저장해 두고 다시 써도 되는 이유다.

- LLM 의 attention 은 causal mask 로 뒤에 오는 토큰을 가린다. 그림의 점수 칸에서 오른쪽 위가 빈 이유다.
- 그래서 「오늘」 의 계산은 「날씨가」 가 붙든 말든 모든 층에서 같고, 거기서 만든 K·V 도 같다.

토큰이 많아지면 차이가 크게 벌어진다. 프롬프트 1,000 토큰을 넣고 답변 1,000 토큰을 만들 때, 모델에 넣는 토큰 위치를 모두 더하면 캐시가 없을 때 1,499,500 번, 있을 때 1,999 번이다 (계산은 부록). **캐시가 없으면 계산량이 답변 길이의 제곱으로 늘고, 있으면 길이에 비례해 는다.**

**캐시가 있어도 attention 의 내적은 남는다.** 그림 오른쪽의 점수 칸이 스텝마다 하나씩 는다.

- 새 query 하나가 캐시의 key 전부와 내적하고 value 전부를 가중 평균한다.
- 그래서 한 스텝에 캐시 전체를 메모리에서 한 번 읽는다. 문맥이 길수록 한 스텝이 느려진다.

# C) Prefill 과 decode

실제 생성은 프롬프트가 있는 상태에서 시작한다. 프롬프트를 처리하는 첫 단계와, 그 뒤 토큰을 하나씩 만드는 단계는 하는 일이 다르다.

![[img-67dd224d42.png]]

그림 읽는 법: 왼쪽에서 오른쪽으로 시간이 흐른다. 주황 칸은 그 단계에 캐시에 새로 쓴 key·value, 파랑 칸은 캐시에서 읽은 key·value 다. 아래 띠가 두 단계의 차이다.

- **Prefill 은 프롬프트 전체를 한 번에 넣어 캐시를 채운다.** 「오늘 날씨가 정말」 세 토큰의 K·V 를 모든 층에서 한꺼번에 계산해 캐시에 쓰고, 첫 출력 「좋다」 를 낸다.
  - 토큰이 수천 개면 가중치를 한 번 읽어 와 많은 토큰에 곱하는 큰 행렬곱이 된다. 그래서 GPU 의 연산 속도가 병목이다.
- **Decode 는 직전 출력 한 토큰을 넣어 캐시에 한 칸 붙이고, 캐시 전체를 읽는다.** 답변이 끝날 때까지 반복한다.
  - 토큰 하나 때문에 가중치 전체와 캐시 전체를 메모리에서 읽지만 계산할 양은 적다. 그래서 메모리 대역폭이 병목이다.
  - 실제로는 decode 의 attention 이 메모리에서 읽는 원소 수가 연산 수보다 많아서, 캐시를 읽는 속도만큼만 빨라질 수 있다 (DistServe 부록 A).

**캐시가 클수록 decode 가 느려진다.** decode 한 스텝마다 캐시 전체를 읽기 때문이다. 두 단계의 연산 특성은 [[Prefill]] 노트에, 첫 토큰까지의 시간(TTFT)과 토큰 사이 간격(TPOT) 같은 지표는 [[vllm]] 노트에 있다.

# D) 캐시 크기 계산

캐시 크기는 저장하는 숫자의 개수에 숫자 하나의 바이트 수를 곱한 값이다. 토큰 하나는 층마다, key·value head 마다 key 벡터 하나와 value 벡터 하나를 남긴다.

$$
\text{KV cache 바이트} = 2 \times n_{\text{layers}} \times n_{\text{kv}} \times d_h \times b \times T \times B
$$

- $2$ 는 key 와 value, $n_{\text{layers}}$ 는 층 수, $n_{\text{kv}}$ 는 key·value head 수, $d_h$ 는 head 하나의 벡터 길이다.
- $b$ 는 숫자 하나의 바이트 수다. BF16·FP16 은 2, FP8 은 1 이다.
- $T$ 는 시퀀스의 토큰 수(프롬프트 + 지금까지 만든 답변), $B$ 는 동시에 처리하는 요청 수다.
- 앞의 다섯 항을 곱하면 토큰 하나의 크기가 되고, 뒤의 두 항은 그런 토큰이 몇 개인지다.

key·value head 수가 query head 수와 같은 원래 방식(MHA)과, 줄인 방식(GQA)을 실제 모델 둘로 비교한다. 두 모델 모두 32 층에 query head 32 개, head 길이 128 로 같고 key·value head 수만 다르다.

![[img-8d9bf29107.png]]

그림 읽는 법: 칸 하나가 한 층, 한 head 의 key 벡터 또는 value 벡터 하나다. 세로가 층, 가로가 head 다. 칸 하나는 숫자 128 개 × 2 바이트 = 256 B 이고, 칸 수를 세면 토큰 하나의 크기가 나온다.

- **Llama 2 7B 는 query head 마다 key·value head 를 따로 둔다.** 칸이 2,048 개라 토큰 하나에 512 KiB 다.
- **Llama 3 8B 는 query head 4 개가 key·value head 하나를 나눠 쓴다.** 칸이 512 개라 토큰 하나에 128 KiB, 4 분의 1 이다.

## D.1) Step by Step 예시: Llama 3 8B

Llama 3 8B 의 설정(Hugging Face `config.json`)은 층 32 개(`num_hidden_layers`), query head 32 개(`num_attention_heads`), key·value head 8 개(`num_key_value_heads`), hidden 크기 4096 이다. head 길이는 4096 을 query head 수로 나눈 128 이다. 8K 문맥 요청 16 개를 BF16 으로 담는 경우를 식의 왼쪽부터 곱해 간다.

| 곱하는 항 | 값 | 누적 |
| --- | --- | --- |
| key + value | 2 | 2 |
| 층 수 | 32 | 64 |
| key·value head 수 | 8 | 512 (그림의 칸 수) |
| head 길이 | 128 | 65,536 개 숫자 |
| 숫자 하나의 바이트 (BF16) | 2 | 131,072 B = 128 KiB (토큰 1 개) |
| 문맥 길이 | 8,192 | 1 GiB (요청 1 개) |
| 동시 요청 수 | 16 | 16 GiB |

마지막 줄의 16 GiB 는 모델 가중치와 맞먹는다. 가중치는 약 80 억 개 × 2 바이트 ≈ 16 GB 다. 같은 계산을 Llama 2 7B 에 하면 토큰 하나에 512 KiB 라서, 최대 문맥 4,096 토큰짜리 요청 하나가 2 GiB 다.

캐시는 토큰 수에 정비례하므로 직선으로 커진다.

![[img-539e6bec23.png]]

그림 읽는 법: 가로축은 캐시에 들고 있는 토큰 수(문맥 길이 × 동시 요청 수), 세로축은 캐시 크기다. 주황 실선이 Llama 3 8B, 빨간 점선이 key·value head 를 32 개로 둔 MHA 였을 경우다.

- **8K 요청 16 개와 128K 요청 1 개는 같은 16 GiB 다.** 캐시 크기는 토큰이 어느 요청에 속하든 총 토큰 수로 정해진다.
  - 128K 문맥은 같은 구조로 문맥만 늘린 Llama 3.1 8B 기준이다.
- **MHA 였다면 4 분의 1 인 32K 토큰에서 이미 가중치만큼 커진다.**

**서빙에서 한 GPU 가 동시에 받을 수 있는 요청 수는 대개 이 캐시가 정한다.** GPU 메모리에서 가중치를 뺀 나머지에 캐시를 담기 때문이다.

- Kwon et al. (2023, Figure 1) 은 A100 40GB 에서 13B 모델을 서빙할 때 메모리의 약 65% 가 가중치, 약 30% 가 KV cache 라고 적었다.

# E) 캐시를 줄이는 방법

크기 식의 항 하나를 줄이면 캐시가 그만큼 준다. 방법마다 건드리는 항이 다르다.

![[img-436d1d3d1b.png]]

그림 읽는 법: 가운데 줄이 크기 식이고, 숫자는 위 예시(Llama 3 8B, 8K 요청 16 개)다. 아래 파란 상자가 이 노트에서 다루는 방법이고, 화살표가 그 방법이 줄이는 항을 가리킨다. 위 회색 글씨는 모델 구조를 더 크게 바꾸는 다른 방법이다.

- **MQA·GQA 는 key·value head 수를 줄인다.** 여러 query head 가 key·value head 하나를 나눠 쓴다.
  - GQA 는 query head 를 그룹으로 묶어 그룹마다 하나를, MQA 는 전부가 하나를 쓴다. 그림의 8 이 Llama 3 8B 의 GQA 설정이다.
  - 모델 구조가 바뀌므로 학습 때 정한다. 원리와 품질 비교는 [[attention function|Attention]] 노트의 최적화 기법 절에 있다.
- **KV 양자화는 숫자 하나의 바이트 수를 줄인다.** 캐시를 FP8 로 저장하면 BF16 의 절반이다.
  - 근사이므로 품질 변화를 따로 확인해야 한다. 2 비트까지 내린 방법(KIVI)도 있다. 일반적인 내용은 [[Quantization]] 노트에 있다.
- **PagedAttention 은 토큰 하나의 크기가 아니라 빈자리를 줄인다.** 답변이 얼마나 길어질지 모르니, 기존 서빙 시스템은 요청마다 최대 길이만큼 메모리를 미리 잡았다.
  - Kwon et al. (2023, Figure 2) 의 측정에서 기존 시스템은 캐시용 메모리의 20.4–38.2% 에만 실제 key·value 를 담았고, 16 토큰 블록을 필요할 때 할당하는 vLLM 은 96.3% 를 담았다.
  - 같은 GPU 에 요청을 더 많이 담을 수 있게 된다. 자세한 내용은 [[vllm]] 노트에 있다.

**캐시 크기가 그대로인 방법도 decode 를 빠르게 할 수 있다.** FlashAttention·Flash-Decoding 은 캐시를 읽는 커널을 빠르게 하고, NSA·DSA 는 한 스텝에 읽는 토큰을 골라 줄인다. 이 방법들도 [[attention function|Attention]] 노트에 있다.

# 부록: 계산과 방법별 크기

## 캐시가 없을 때와 있을 때의 토큰 위치 수

프롬프트 1,000 토큰, 답변 1,000 토큰일 때 스텝마다 모델에 넣는 토큰 위치 수를 더한다. 토큰 위치 하나마다 모든 층의 projection 과 feed-forward 를 한 번씩 계산하므로, attention 행렬 계산을 뺀 연산량이 이 수에 비례한다.

| 방식 | 스텝 k 에서 넣는 토큰 수 | 1,000 스텝의 합 |
| --- | --- | --- |
| 캐시 없음 | 지금까지의 시퀀스 전체 999 + k | 999 × 1,000 + 500,500 = 1,499,500 |
| 캐시 있음 | 첫 스텝은 프롬프트 1,000 개, 이후는 1 개 | 1,000 + 999 = 1,999 |

## 같은 attention 크기에서 MHA, GQA, MQA, MLA 비교

DeepSeek-V3 의 attention 크기(층 61 개, query head 128 개, head 길이 128)를 고정하고 key·value 를 저장하는 방식만 바꿔 토큰 하나의 캐시를 계산했다. 원소당 2 바이트로 가정했다.

| 방식 | 층 하나의 토큰당 원소 수 | 61 층 합계 | 바이트 | MHA 대비 |
| --- | --- | --- | --- | --- |
| MHA | 2 × 128 × 128 = 32,768 | 1,998,848 | 3.81 MiB | 100% |
| GQA, 그룹 8 개 | 2 × 8 × 128 = 2,048 | 124,928 | 244 KiB | 6.25% |
| MQA | 2 × 128 = 256 | 15,616 | 30.5 KiB | 0.78% |
| MLA | latent 512 + RoPE key 64 = 576 | 35,136 | 68.6 KiB | 1.76% |

- MLA 는 key·value 를 길이 512 짜리 latent 벡터 하나로 압축해 저장하고, 위치 정보(RoPE)를 담는 길이 64 짜리 key 를 따로 둔다.
- DeepSeek-V2 보고서 (Table 1) 는 MLA 의 캐시가 그룹이 2.25 개인 GQA 와 같은 크기라고 적었다. 같은 보고서의 MoE 모델 비교(부록 D.2)에서 MLA 는 MHA 의 14%(약 16B 모델), 4%(약 250B 모델) 크기 캐시로 MHA 보다 좋은 성능을 냈다.

## 방법별로 바뀌는 항과 크기 변화

| 방법 | 바뀌는 항 | 크기 변화 |
| --- | --- | --- |
| MQA, GQA | key·value head 수 | query head 수 ÷ key·value head 수 배로 준다 (Llama 3 8B 는 4 배) |
| MLA | key·value head 수 × head 길이 | 같은 크기 MHA 의 1.76% (위 표) |
| KV 양자화 | 숫자 하나의 바이트 | FP8 이면 절반, 2 비트면 8 분의 1 (양자화 상수와 원래 정밀도로 남기는 최근 토큰은 뺀 계산) |
| sliding window | 토큰 수를 층마다 W 로 제한 | Mistral 7B 는 W = 4096, 32K 시퀀스에서 8 배 감소 (Jiang et al., 2023, 2절) |
| hybrid (Mamba·linear attention 층 + attention 층) | 층 수를 attention 층 수로 | Jamba(8 층 중 1 층만 attention) 는 256K 문맥에서 4 GB, Mixtral 은 32 GB (Lieber et al., 2024, Table 1) |
| PagedAttention | 없음 (빈자리를 줄임) | 토큰당 크기는 그대로, 같은 메모리에 요청을 더 담는다 |
| NSA, DSA | 없음 | 줄지 않는다. decode 한 스텝에 읽는 양이 준다 |
| FlashAttention, Flash-Decoding | 없음 | 그대로. 캐시를 읽는 커널이 빨라진다 |

# References

- [[attention function|Attention]] — query·key·value, causal mask, 최적화 기법의 원리
- [[Prefill]], [[vllm]], [[Quantization]]
- Llama Team, Meta, 2024, [The Llama 3 Herd of Models](https://arxiv.org/abs/2407.21783) — Table 3
- Hugging Face 사본의 설정 파일 — [Llama 3 8B config.json](https://huggingface.co/unsloth/llama-3-8b/blob/main/config.json), [Llama 2 7B config.json](https://huggingface.co/NousResearch/Llama-2-7b-hf/blob/main/config.json)
- DeepSeek-AI, 2024, [DeepSeek-V2](https://arxiv.org/abs/2405.04434) — Table 1, 부록 D.2
- DeepSeek-AI, 2024, [DeepSeek-V3 Technical Report](https://arxiv.org/abs/2412.19437) — 4.2절 설정
- NVIDIA, 2023, [Mastering LLM Techniques: Inference Optimization](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/) — "LLM memory requirement"
- Agrawal et al., 2024, [Sarathi-Serve](https://arxiv.org/abs/2403.02310)
- Zhong et al., 2024, [DistServe](https://arxiv.org/abs/2401.09670)
- Kwon et al., 2023, [Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180)
- Jiang et al., 2023, [Mistral 7B](https://arxiv.org/abs/2310.06825)
- Lieber et al., 2024, [Jamba: A Hybrid Transformer-Mamba Language Model](https://arxiv.org/abs/2403.19887)
