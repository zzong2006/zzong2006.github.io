---
title: "KaLM-Reranker-V1 - Fast but Not Late Interaction for Compressed Document Reranking"
tags: ["retrieval", "IR", "ranking", "rerank", "paper_review", "y2026", "KaLM"]
aliases: ["KaLM-Reranker-V1", "Fast but Not Late Interaction", "FBNL", "Compressed Document Reranking"]
---

# A) 한줄 요약

이 논문의 출발점은 단순하다. [[Re-ranking]]에서 cross-encoder는 정확하지만, 후보 문서마다 `query + document`를 다시 encode해야 해서 online 비용이 크다. 반대로 bi-encoder나 [[ColBERT]]류 late interaction은 빠르지만, query와 document가 깊게 섞이는 상호작용은 제한된다.

**KaLM-Reranker-V1** 은 이 둘 사이를 노린다. document는 encoder로 미리 encode해 cache하고, query가 들어오면 decoder가 그 cached document representation을 cross-attention으로 읽으면서 relevance를 판단한다. 문서 쪽 계산은 offline으로 빼고, query-document interaction은 decoder 안에 남기는 구조다.

논문이 붙인 이름은 **Fast but Not Late Interaction (FBNL)** 이다. 빠른 이유는 document encoding을 query마다 반복하지 않기 때문이다. 동시에 `not late interaction`이라고 부르는 이유는 [[ColBERT]]처럼 마지막에 token similarity만 계산하지 않고, decoder cross-attention 안에서 query-conditioned interaction을 수행하기 때문이다.

- **저자**: Xinping Zhao, Jiaxin Xu, Ziqi Dai, Xin Zhang, Shouzheng Huang, Danyu Tang, Xinshuo Hu, Meishan Zhang, Baotian Hu, Min Zhang
- **소속**: Harbin Institute of Technology (Shenzhen), Shenzhen Loop Area Institute
- **발표**: arXiv 2606.22807, 2026-06-22
- **기반 모델**: T5Gemma2 encoder-decoder backbone
- **공개 모델**: KaLM-Reranker-V1-Nano, Small, Large
- **핵심 키워드**: [[Re-ranking]], encoder-decoder reranker, cross-attention, Matryoshka Embedding Pooling, BEIR, MIRACL, LMEB

# B) 전체 구조

![[img-64165db84a.jpg|KaLM-Reranker-V1 framework]]

그림은 "문서 쪽 계산을 얼마나 미리 빼둘 수 있는가"를 중심으로 보면 읽기 쉽다. 전체 구조는 offline document encoding과 online query-aware scoring으로 나뉜다.

```text
Offline:
  document
    -> encoder
    -> token-level passage representation
    -> Matryoshka Embedding Pooling
    -> compressed passage cache

Online:
  instruction + query
    -> decoder
    -> cross-attention to cached passage representation
    -> yes/no logits
    -> relevance score
```

이 설계의 핵심은 reranker에서 가장 비싼 부분을 query traffic에서 떼어내는 것이다. 기존 cross-encoder reranker는 후보 문서 100개를 rerank하려면 `query + document` pair 100개를 모두 online에서 encode해야 한다. 반면 KaLM-Reranker-V1은 document encoding을 미리 끝내 둔다. online에서는 query를 처리하는 decoder computation과 cached document representation에 대한 cross-attention만 수행한다.

다만 이 모델은 retriever가 아니다. 전체 corpus에서 후보를 직접 찾아오는 1단계 retrieval 모델이 아니라, first-stage retriever가 가져온 top-100 후보를 다시 점수화하는 second-stage reranker다. 논문 실험에서도 KaLM-Embedding-V2.5로 top-100을 먼저 가져오고, KaLM-Reranker-V1이 그 후보를 rerank한다.

# C) 왜 이런 구조가 필요한가

## C.1) Reranker의 병목은 query-document coupling이다

[[Cascade Ranking System]]에서 reranker는 후보 수가 줄어든 뒤 더 비싼 relevance modeling을 수행한다. 문제는 strong reranker일수록 query와 document를 함께 넣고 full attention을 태우는 경우가 많다는 점이다.

이 방식은 정확하다. Query token과 document token이 여러 layer에서 서로 attention을 주고받기 때문이다. 하지만 serving 관점에서는 비싸다. 같은 document라도 query가 바뀌면 다시 encode해야 하므로, 문서 표현을 offline cache로 빼기 어렵다.

검색 조직 입장에서 이 병목은 꽤 현실적이다. 상품, 문서, help article, memory chunk처럼 후보 문서가 어느 정도 안정적이면 document representation은 미리 만들어두고 싶다. 그런데 cross-encoder는 query와 document를 처음부터 묶어 처리하므로, 이런 pre-computation 이점을 거의 쓰지 못한다. KaLM-Reranker-V1은 바로 이 지점을 파고든다.

## C.2) 기존 선택지는 세 갈래였다

| 계열 | 상호작용 방식 | 장점 | 병목 |
|---|---|---|---|
| Bi-encoder | query/document를 따로 encode 후 dot product | 매우 빠르고 ANN retrieval 가능 | 세밀한 token interaction 부족 |
| Cross-encoder | query/document를 함께 encode | relevance modeling 강함 | 후보마다 online full forward 필요 |
| Late interaction | query/document token을 따로 encode 후 MaxSim류 scoring | 문서 pre-computation 가능 | interaction이 similarity aggregation에 제한됨 |

이 논문은 세 선택지 사이에 새로운 위치를 만든다. 문서 pre-computation은 late interaction처럼 가져오되, scoring은 단순 MaxSim이 아니라 decoder cross-attention으로 한다. 그래서 논문은 이것을 **fast but not late interaction** 이라고 부른다.

여기서 `not late`는 interaction이 아예 늦게 일어나지 않는다는 뜻이 아니다. 문서와 query가 처음부터 같이 encode되지는 않으므로 cross-encoder보다는 늦다. 다만 [[ColBERT]]처럼 encoding이 완전히 끝난 뒤 token vector similarity만 계산하는 방식보다 더 풍부한 interaction을 decoder 안에서 수행한다는 뜻에 가깝다.

# D) 기존 방법에서 남는 빈칸

앞의 표를 조금 더 풀어보면, KaLM-Reranker-V1이 겨냥하는 빈칸이 분명해진다. Cross-encoder의 interaction 품질은 살리고 싶지만, query가 들어올 때마다 모든 document를 처음부터 다시 읽고 싶지는 않다. 그렇다고 late interaction처럼 마지막 similarity aggregation에만 의존하기도 아쉽다.

## D.1) Cross-encoder reranker는 정확하지만 매번 비싸다

Cross-encoder는 `query + document`를 하나의 sequence로 넣는다. 이 때문에 query intent와 document evidence를 깊게 맞춰볼 수 있다. 하지만 후보 수 `k`가 커질수록 online 비용이 그대로 `k`배 늘어난다.

예를 들어 top-100 candidate를 rerank한다면, 같은 query에 대해 100개의 document를 각각 붙여 100번 forward해야 한다. Candidate length가 길거나 LLM 기반 reranker를 쓰면 이 비용은 금방 serving bottleneck이 된다. 좋은 모델을 붙였는데 정작 online latency 때문에 후보 수를 줄여야 하는 상황이 생긴다.

## D.2) Late interaction은 빠르지만 interaction이 제한된다

[[ColBERT]]류 late interaction은 query와 document를 따로 encode하고, scoring 시점에 token-level similarity를 계산한다. 이 방식은 문서 representation을 미리 만들 수 있어 효율적이다.

하지만 scoring이 대체로 `query token -> 가장 잘 맞는 document token`을 찾는 MaxSim류 연산에 묶인다. Query intent, task instruction, document context가 decoder 안에서 서로 조건부로 섞이는 cross-attention보다는 표현력이 제한될 수 있다.

## D.3) 문서 cache는 저장 비용을 만든다

문서를 미리 encode하면 online 비용은 줄지만, 문서별 token representation을 저장해야 한다. 특히 token-level representation은 단일 embedding보다 훨씬 크다. 그래서 KaLM-Reranker-V1은 **Matryoshka Embedding Pooling (MEP)** 으로 passage representation을 sequence 방향으로 압축한다.

여기서 MEP는 embedding dimension을 줄이는 기법이 아니라, passage token들을 일정 비율로 묶어 평균 pooling하는 **token sequence 압축** 에 가깝다. 예를 들어 compression ratio가 `4x`라면 인접한 token representation 4개를 하나로 줄인다. 결국 decoder가 attend해야 할 document token 수가 줄어들고, cache와 online attention 비용도 같이 줄어든다.

# E) 제안 방법: KaLM-Reranker-V1

## E.1) Encoder-decoder split

이제 구조를 조금 더 구체적으로 보자. KaLM-Reranker-V1은 T5Gemma2 기반 encoder-decoder 모델이다. Encoder는 document만 입력받고, decoder는 instruction과 query를 입력받는다.

논문 notation으로는 candidate document `p`를 encoder에 넣어 passage representation을 만든다.

$$
\mathbf{H}_p = \operatorname{Enc}(p) \in \mathbb{R}^{n \times d}
$$

여기서:

- `n`: document token length
- `d`: hidden dimension
- `H_p`: cache 가능한 document token representation

Online scoring에서는 decoder가 instruction `I`와 query `q`를 보고, cached `H_p`에 cross-attention한다.

$$
\mathbf{Z} = \operatorname{Dec}(I, q; \mathbf{H}_p)
$$

Decoder는 relevance score를 직접 regression하지 않는다. 첫 prediction position에서 `yes`와 `no` token logit만 비교한다.

$$
\text{score}(q,p) =
\frac{\exp(z_{\mathrm{yes}})}
{\exp(z_{\mathrm{yes}}) + \exp(z_{\mathrm{no}})}
$$

즉 모델에게 묻는 질문은 "이 document가 query와 instruction 조건을 만족하는가?"이고, relevance score는 `yes` 확률이다. LLM reranker에서 자주 쓰는 binary classification 형태와 비슷하지만, 결정적인 차이가 있다. document를 매번 prompt에 붙이지 않고, 미리 계산해 둔 encoder output cache를 활용한다.

## E.2) Prompt template

Prompt는 encoder와 decoder가 분리된다.

```text
Encoder:
  <Document>: {Document}

Decoder:
  Judge whether the Document meets the requirements based on the Query
  and the Instruct provided. Note that the answer can only be "yes" or "no".

  <Instruct>: {Instruction}
  <Query>: {Query}
```

이 분리가 중요하다. document prompt는 query와 독립적이어야 재사용할 수 있다. 반대로 decoder prompt에는 task instruction과 query가 들어가야 한다. 같은 document라도 "claim을 반박하는 문서를 찾아라"와 "질문에 답하는 문서를 찾아라"는 relevance 기준이 다르다. document cache는 그대로 두되, decoder가 task instruction을 보고 relevance 기준을 바꾸는 구조다.

## E.3) Matryoshka Embedding Pooling

![[img-00ac389bfb.png|MEP compression]]

문서 표현을 cache할 수 있다고 해도, token-level representation을 그대로 저장하면 cache가 너무 커질 수 있다. 그래서 논문은 MEP로 passage representation을 여러 compression ratio에서 동시에 잘 작동하도록 학습한다. 논문은 `1x`부터 `32x`까지의 compression ratio를 지원한다고 보고한다.

직관은 단순하다. 문서 token representation 전체를 그대로 cache하면 정확하지만 비싸다. 반대로 너무 많이 줄이면 문서 안의 중요한 evidence가 사라진다. MEP는 여러 압축률에서 loss를 함께 걸어, 같은 모델이 serving 상황에 따라 저장 비용과 품질 사이를 조절할 수 있게 만든다. 즉 MEP는 "압축해도 최대한 덜 망가지게" 만드는 장치다.

수식으로 보면 compression ratio `r`일 때 인접한 `r`개 token representation을 평균 내어 하나의 token으로 만든다. 그러면 document token 수는 대략 `n / r`로 줄어든다. Decoder cross-attention이 봐야 할 cached passage token 수도 그만큼 줄어 online cost와 memory buffer가 같이 줄어든다.

## E.4) Training objective

구조가 정해졌다면, 다음 질문은 이 모델을 어떻게 relevance 판단기로 학습시키느냐다. 논문은 크게 두 objective를 쓴다.

| Objective | 역할 |
|---|---|
| SFT with yes/no label | relevance 여부를 binary label로 학습 |
| Knowledge distillation | strong teacher reranker의 soft label을 따라가며 미세한 relevance 차이를 학습 |

SFT에서는 `yes` 또는 `no` label의 negative log-likelihood를 최소화한다. KD stage에서는 teacher reranker가 준 soft label과 student score 사이의 binary cross-entropy를 최소화한다.

Soft label이 중요한 이유는 hard negative가 항상 진짜 negative가 아니기 때문이다. 검색 데이터에서는 "정답으로 annotation되지 않았지만 실제로는 꽤 관련 있는 문서"가 자주 섞인다. Hard yes/no만 쓰면 이런 borderline document를 과하게 밀어낼 수 있다. Soft label은 relevance 정도의 뉘앙스를 남겨준다.

## E.5) Progressive multi-stage training

![[img-0f4ac8d653.jpg|Multi-stage training]]

학습은 한 번에 끝내지 않고 세 단계로 나눈다.

1. **General reranking ability learning**: instruction 없이 query-document relevance를 학습한다. Domain-agnostic reranking foundation을 만드는 단계다.
2. **Task-specific reranking adaptation**: task instruction을 넣어 reranking 기준을 명시한다. 예를 들어 [[BEIR]]의 ArguAna에서는 "claim을 반박하는 문서"를 찾도록 instruction이 바뀐다.
3. **Fine-grained relevance distillation**: stronger teacher reranker가 만든 soft label로 작은 모델을 distill한다. 논문에서는 Large가 Nano와 Small의 teacher 역할을 한다.

Large 모델은 1, 2단계까지만 학습하고, Nano와 Small은 3단계 distillation까지 수행한다. 이 설계는 실무적으로도 자연스럽다. 큰 모델로 좋은 판단 기준을 만든 뒤, 작은 모델이 그 판단을 따라오게 해서 serving 효율을 살리는 구조이기 때문이다.

# F) 모델 스펙과 구현 디테일

논문이 보고한 모델 구성은 다음과 같다.

| Model | Backbone | Activated params | Layers | Sequence length | Document token dim | MEP support |
|---|---|---:|---:|---:|---:|---|
| KaLM-Reranker-V1-Nano | T5Gemma2 270M-270M | 0.27B | 18 | 128K | 640 | 1x-32x |
| KaLM-Reranker-V1-Small | T5Gemma2 1B-1B | 1B | 26 | 128K | 1152 | 1x-32x |
| KaLM-Reranker-V1-Large | T5Gemma2 4B-4B | 4B | 34 | 128K | 2560 | 1x-32x |

여기서 `activated params`는 논문 표기 기준으로 online reranking에서 주로 활성화되는 decoder-side parameter 규모에 가깝다. Encoder는 passage pre-encoding에 쓰이므로, Hugging Face checkpoint의 전체 parameter size와는 다르게 보일 수 있다.

학습 설정에서 눈에 띄는 점은 다음과 같다.

- **precision**: bf16
- **query max length**: 128 tokens
- **passage max length**: 512 tokens
- **training group size**: 16개 passage, 즉 1 positive + 15 negatives
- **fine-tuning 방식**: LoRA
- **LoRA target modules**: `q_proj`, `k_proj`, `v_proj`, `out_proj`
- **optimizer**: Adam + cosine learning-rate scheduler
- **effective batch size**: 각 모델 128
- **GPU**: Nano/Small은 16 NVIDIA RTX 5090, Large는 32 NVIDIA RTX 5090
- **epoch**: stage당 1 epoch

논문은 약 3.7M reranking data로 KaLM-Reranker-V1을 학습했다고 설명한다. 비교 대상으로 자주 등장하는 Qwen3-Reranker series가 19M high-quality data로 학습되었다는 점을 감안하면, 데이터 효율도 논문이 강조하는 포인트다.

# G) Serving 비용이 줄어드는 지점

![[img-958b51fd37.png|Time complexity by passage length]]

이 논문의 실용성은 serving 비용에서 나온다. 기존 encoder/decoder 기반 reranker는 candidate마다 `query + passage`를 online에서 함께 처리한다. 후보 수가 `k`라면 online 비용이 거의 `k`배로 늘어난다.

KaLM-Reranker-V1은 passage encoder를 offline으로 빼고, online에서는 decoder만 실행한다. Decoder는 query context와 compressed passage tokens를 함께 attention한다. 그래서 passage length가 길수록, 그리고 같은 passage가 여러 query에서 반복적으로 등장할수록 이 구조의 이득이 커진다. 자주 등장하는 문서를 미리 계산해둘 수 있는 검색 서비스일수록 유리하다.

![[img-4c260ba9e5.png|Time complexity by compression ratio]]

MEP compression ratio `r`은 serving knob처럼 쓸 수 있다. 같은 모델을 두고도 서비스의 latency budget과 cache budget에 맞춰 압축률을 고를 수 있다는 뜻이다.

| Compression ratio | 의미 | 실무적 해석 |
|---:|---|---|
| 1x | full passage representation | 품질 우선, cache와 online buffer 큼 |
| 2x-4x | moderate compression | 논문이 실무 trade-off로 가장 권장하는 구간 |
| 16x-32x | aggressive compression | 비용은 작지만 relevance 구분력이 더 떨어질 수 있음 |

이 지점은 검색 조직에서 특히 중요하다. Product catalog나 help document처럼 문서가 비교적 안정적이면 offline passage cache를 구축할 수 있다. 반대로 문서 freshness가 매우 중요하거나 후보 문서가 query마다 동적으로 생성된다면, cache invalidation과 fallback 설계가 필요하다.

# H) 실험 결과: 성능만 보지 말고 비용과 같이 보기

## H.1) BEIR

실험 결과는 accuracy 숫자만 보면 논문 의도가 잘 안 보인다. 이 논문은 "최고 점수"보다 "비슷한 점수를 훨씬 낮은 online cost로 낼 수 있는가"를 묻는다. 먼저 [[BEIR]]에서는 13개 English retrieval task의 nDCG@10 평균을 보고한다. First-stage retriever는 KaLM-Embedding-V2.5이고, 모든 reranker는 같은 top-100 후보를 rescoring한다.

| Model | Size | Relative online cost | BEIR avg nDCG@10 |
|---|---:|---:|---:|
| KaLM-Embedding-V2.5 first-stage | 0.5B | - | 53.78 |
| gte-reranker-base | 0.3B | 11.9x | 56.77 |
| jina-reranker-v2 | 0.3B | 11.9x | 56.26 |
| KaLM-Reranker-V1-Nano | 0.27B | 1.0x | 57.41 |
| Qwen3-Reranker-0.6B | 0.6B | 42.4x | 59.36 |
| KaLM-Reranker-V1-Small | 1B | 6.9x | 60.01 |
| Qwen3-Reranker-4B | 4B | 236.8x | 63.50 |
| KaLM-Reranker-V1-Large | 4B | 43.7x | 62.87 |
| Qwen3-Reranker-8B | 8B | 539.7x | 65.11 |

읽는 포인트는 절대 1등만 보는 것이 아니다. KaLM-Reranker-V1-Large는 Qwen3-Reranker-4B보다 BEIR 평균이 조금 낮지만, 논문 추정 online cost는 훨씬 낮다. Small도 Qwen3-Reranker-0.6B보다 높은 평균을 보이면서 cost는 크게 낮다. 이 논문의 주장은 "가장 큰 모델이 가장 세다"가 아니라, **비용 대비 성능 곡선을 더 유리한 쪽으로 옮긴다** 에 가깝다.

## H.2) MIRACL

MIRACL은 18개 언어를 포함한 multilingual retrieval benchmark다. 논문은 KaLM-Reranker-V1이 주로 Chinese/English data로 학습되었기 때문에, extensively multilingual training을 받은 모델은 일부 비교에서 제외했다고 설명한다.

| Model | Size | Relative online cost | MIRACL avg nDCG@10 |
|---|---:|---:|---:|
| KaLM-Embedding-V2.5 first-stage | 0.5B | - | 60.19 |
| KaLM-Reranker-V1-Nano | 0.27B | 1.0x | 62.08 |
| KaLM-Reranker-V1-Small | 1B | 6.9x | 66.89 |
| bge-reranker-v2-gemma | 2.5B | 81.3x | 69.82 |
| KaLM-Reranker-V1-Large | 4B | 43.7x | 70.07 |

Large는 bge-reranker-v2-gemma보다 약간 높은 평균을 보이면서 논문 추정 cost는 더 낮다. 다만 논문도 Chinese subset에서는 상대적으로 약하다고 언급한다. 모델이 Chinese data를 적게 본 것은 아닌데도 성능이 약한 점을 보면, backbone의 Chinese capability나 instruction alignment가 병목일 수 있다.

## H.3) MEP 압축 효과

논문은 compression ratio가 커질수록 성능이 떨어진다고 보고한다. 다만 `2x`와 `4x` 정도의 moderate compression에서는 하락이 작고, `16x`나 `32x`로 갈수록 더 뚜렷해진다.

중요한 관찰은 두 가지다.

1. **큰 모델은 압축에 더 강하다**: 같은 compression ratio에서도 Large가 Nano보다 relevance 구분력을 더 잘 유지한다.
2. **작은 모델은 정보 손실에 민감하다**: Nano는 compression ratio가 커질수록 ROC-AUC 하락이 더 크다.

논문의 AUC 예시는 이 점을 잘 보여준다. FQA task에서 compression ratio가 `2x -> 32x`로 커질 때, Nano의 AUC는 `0.871 -> 0.832`로 내려가지만 Large는 `0.952 -> 0.948`로 거의 유지된다.

## H.4) LMEB

LMEB는 long-horizon dialogue memory retrieval benchmark다. 이 부분은 agent memory나 RAG memory retrieval에 관심이 있다면 볼 만하다.

| Model | Size | LMEB avg nDCG@10 |
|---|---:|---:|
| KaLM-Embedding-V2.5 first-stage | 0.5B | 50.80 |
| KaLM-Reranker-V1-Nano | 0.27B | 61.39 |
| KaLM-Reranker-V1-Small | 1B | 63.15 |
| KaLM-Reranker-V1-Large | 4B | 64.16 |
| Qwen3-Reranker-8B | 8B | 66.42 |

논문이 강조하는 포인트는 retrieve-then-rerank가 단순히 embedding model을 키우는 것보다 효과적일 수 있다는 점이다. 0.5B KaLM-Embedding-V2.5 + 0.27B KaLM-Reranker-V1-Nano 조합은 LMEB 평균 `61.39`를 기록해, 9B bge-multilingual-gemma embedding model의 `59.60`보다 높다.

# I) 실무에서 어디에 꽂을 수 있나

## I.1) 검색 serving에서 가장 매력적인 지점

KaLM-Reranker-V1은 아무 검색 시스템에나 바로 꽂는 만능 reranker라기보다, document side를 cache할 수 있는 환경에서 빛난다. 특히 다음 조건에서 매력적이다.

1. 후보 문서나 상품이 비교적 안정적이다.
2. Query traffic이 많아서 같은 document가 여러 query에서 반복적으로 등장한다.
3. Cross-encoder quality가 필요하지만, 모든 후보를 매번 full forward하기에는 latency와 GPU cost가 부담된다.
4. Candidate top-k가 수십~수백 개 수준이고, second-stage reranking이 병목이다.

이 조건은 e-commerce search, document search, help center search, RAG context reranking에 꽤 자주 나타난다. 특히 상품 catalog처럼 document side가 상대적으로 느리게 바뀌는 곳에서는 offline passage cache가 실용적일 수 있다. 반대로 문서가 query마다 새로 생성되는 환경이라면 이 논문의 장점이 줄어든다.

## I.2) 운영에서 챙길 것

첫째, passage representation cache의 lifecycle이 필요하다. 문서가 수정되면 encoder output도 다시 만들어야 한다. 검색 index refresh와 embedding/reranker cache refresh가 따로 놀면 stale ranking이 생긴다.

둘째, MEP compression ratio를 offline/online budget에 맞춰 잡아야 한다. `2x-4x`는 품질 보존에 유리하지만 cache와 online buffer가 크다. `16x-32x`는 비용을 줄이지만 작은 모델에서는 relevance 구분력이 더 많이 무너질 수 있다.

셋째, binary `yes/no` score calibration을 봐야 한다. 모델 score가 확률처럼 생겼다고 해서 그대로 business ranking score와 섞기 쉽다는 뜻은 아니다. 기존 ranker feature, BM25 score, dense score, click model score와 결합하려면 calibration이 필요하다.

넷째, instruction design이 중요하다. 이 모델은 task instruction을 decoder에 넣는다. 검색 vertical마다 "정답 문서", "반박 문서", "상품 속성 일치", "법률 근거"의 relevance 기준이 달라질 수 있으므로, instruction template을 evaluation과 serving에서 일관되게 관리해야 한다.

# J) 한계와 주의점

첫째, 논문의 cost는 analytical online computation estimate다. 실제 serving latency는 cache layout, batch scheduling, GPU memory bandwidth, quantization, candidate length distribution에 따라 달라진다. Production 판단에는 실제 benchmark가 필요하다.

둘째, first-stage retriever에 의존한다. 논문 실험은 KaLM-Embedding-V2.5가 top-100 후보를 가져온 뒤 rerank한다. Retriever가 놓친 문서는 reranker가 복구할 수 없다.

셋째, cache가 공짜가 아니다. Full token-level passage representation을 저장하려면 corpus 규모가 커질수록 storage와 memory traffic이 커진다. MEP는 이 문제를 줄이지만, 완전히 없애지는 않는다.

넷째, multilingual 일반화는 더 봐야 한다. MIRACL에서 평균은 좋지만, 논문도 Chinese subset 약점을 언급한다. 한국어 검색에 바로 쓰려면 Korean query/document에서 별도 평가가 필요하다.

다섯째, 이 논문은 work in progress technical report다. 공개 모델과 paper 수치가 빠르게 업데이트될 수 있으므로, 실제 도입 검토 시점에는 Hugging Face model card와 benchmark 재현 결과를 다시 확인하는 편이 안전하다.

# K) References

- [KaLM-Reranker-V1: Fast but Not Late Interaction for Compressed Document Reranking (arXiv)](https://arxiv.org/abs/2606.22807)
- [KaLM-Reranker-V1 HTML version](https://arxiv.org/html/2606.22807v1)
- [Hugging Face paper page](https://huggingface.co/papers/2606.22807)
- [Lychee-KaLM-Reranker model collection](https://huggingface.co/collections/KaLM-Embedding/lychee-kalm-reranker)
- [KaLM-Reranker-V1-Nano](https://huggingface.co/KaLM-Embedding/KaLM-Reranker-V1-Nano)
- [KaLM-Reranker-V1-Small](https://huggingface.co/KaLM-Embedding/KaLM-Reranker-V1-Small)
- [KaLM-Reranker-V1-Large](https://huggingface.co/KaLM-Embedding/KaLM-Reranker-V1-Large)
