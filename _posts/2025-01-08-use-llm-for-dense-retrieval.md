---
layout: post
title: LLM 기반 Dense Retrieval 을 위한 학습방법, LLaRA
date: 2025-01-11 16:00:00
giscus_comments: true
categories: paper-review
toc:
  beginning: true
  sidebar: left
tags: LLM dense_retrieval
---

## LLM vs. Dense Retrieval

BERT 와 같은 모델이 아닌 decoder-only LLM 으로 구성된 모델에서 임베딩을 추출하면 뭐가 문제일까? 

- LLM 은 텍스트 생성 작업을 위해 학습되었기 때문에, 토큰 예측을 위한 임베딩을 학습하게 된다. 이 때문에 임베딩은 주로 주변 토큰과 미래 토큰에 집중된다.
- 반면, dense retrieval 은 전체 문맥에 대한 전역적인 의미를 표현하는 임베딩을 필요로 한다. 

이러한 차이는 LLM 을 dense retrieval 에 직접 적용하는 것을 제한한다.

### Methodology

다음과 같이 토크나이징된 입력 시퀀스 $T: [CLS], t_1, ..., t_N, [EOS]$ 가 주어졌다고 가정하자.

BERT 에서는 다음 두가지 방법으로 임베딩을 추출하는 것이 일반적이다.

- $e_t ← \text{BERT}(T)[CLS]$
- $e_t ← \text{AVG}(\text{BERT}(T))$: mean pooling

하지만 LLM 에서 임베딩을 추출하려면, 제일 마지막 토큰인 `</s>` 또는 $\text{[EOS]}$ 를 사용한다. 예를 들어, LLaMA 에서는 다음과 같이 임베딩을 추출한다.

$e_t ← \text{LLaMA}(T)[⟨\text{EOS}⟩]$

하지만 LLM 에서의 임베딩은 전체 문맥이 아니라 local 과 near-future semantic 에 집중되어 있기 때문에, 전체 문맥을 표현하는 임베딩을 추출하는 것이 어렵다.

## LLaRA

위와 같은 LLM 의 한계를 극복하고 dense retrieval 에 적용하기 위해서 LLaRA 라는 방법을 제안한다. LLaRA 는 일종의 비지도 생성형 pretraining 이라고 볼 수 있으며, 두 전처리 훈련 작업에 기반한다.

![LLaRA](https://i.imgur.com/uUtuEIw.png){: width="100%"}

1. EBAE (Embedding-Based Auto-Encoding): LLM 이 입력 문장을 구성하는 토큰들을 예측할 수 있도록 하는 훈련. 주로 similarity search 에 사용된다.
2. EBAR (Embedding-Based Auto-Regression): EBAE 와 유사하지만, 입력 문장의 다음 문장(next sentence)을 예측할 수 있도록 하는 훈련. 주로 question answering 에 사용된다.

LLaRA 에서는 sentence-level features 을 예측하는 것은 LLM 의 linear projection 을 통해 이루어지고, 추가적인 decoding process 는 필요하지 않다. 즉, 기존의 pretrained model 에 대해 LLaRA 를 적용하는 것이 가능하므로, 효율적인 접근 방법이라고 할 수 있다.

### Prediction & Training

EBAE 와 EBAR 은 다음과 같이 동시에 예측 및 훈련된다.

**Inference**

Prompt 는 어떤 sequence $T$ 와 SELF 문장 (`The original sentence:`), `<\s>` 그리고 NEXT 문장 (`The next sentence:`), `<\s>` 를 사용한다. 여기서 T 는 학습할 시퀀스를 의미하고, SELF 는 원본 문장에 대한 임베딩, 그리고 NEXT 는 원본 문장에 대한 다음 문장의 임베딩을 의미한다. 즉, 프롬프트로 구성하면 `T The original sentence: <\s> The next sentence: <\s>` 으로 구성하고 이걸 LLM 에 밀어넣어서 각 `<\s>` 에 대한 임베딩을 추출하면 EBAE 와 EBAR 의 값을 얻을 수 있는것이다.

근데 이렇게 하면 SELF 문장이 NEXT 문장에 영향을 줄 수 있으므로, 아래 그림처럼 attention mask 를 수정해서 이를 방지한다. 

![Image](https://i.imgur.com/wqPpY48.png){: width="50%"}

여기서 보면 NEXT 문장에 대해 예측할때 SELF 문장에 대한 정보를 볼 수 없도록 masking 하는 것을 확인할 수 있다.

**Training**

위 EBAE 와 EBAR 의 예측 과정을 통해 얻은 임베딩을 $e_t$ 라고 하면, linear projection matrix $W ∈ R^{\text{vocab_size}×d}$ 을 적용하고, original 문장에 대한 토큰들 (for EBAE) 과 다음 문장에 대한 토큰들 (for EBAR) 에 대한 확률 값을 최대화하는 것을 목표로 학습을 진행한다.

[Loss 를 계산하는 모델 forward 코드](https://github.com/FlagOpen/FlagEmbedding/blob/808b6c8cc9b36e02278bd572909cf13d10d78598/research/LLARA/pretrain/modeling.py#L314-L388)를 찾았긴 했는데 논문에 나와있는 내용과 꽤 다른것 같다.

```python
# Logit 계산 부분
outputs = self.model(...)
hidden_states = outputs[0]
if self.config.pretraining_tp > 1:
    lm_head_slices = self.lm_head.weight.split(self.vocab_size // self.config.pretraining_tp, dim=0)
    logits = [F.linear(hidden_states, lm_head_slices[i]) for i in range(self.config.pretraining_tp)]
    logits = torch.cat(logits, dim=-1)
else:
    logits = self.lm_head(hidden_states)
logits = logits.float()

# AR Loss 계산 부분 (AR 은 EBAR 인건지?)
ar_loss = None
if labels is not None:
    # Shift so that tokens < n predict n
    shift_logits = logits[..., :-1, :].contiguous()
    shift_labels = labels[..., 1:].contiguous()
    # Flatten the tokens
    loss_fct = CrossEntropyLoss()
    shift_logits = shift_logits.view(-1, self.config.vocab_size)
    shift_labels = shift_labels.view(-1)
    # Enable model parallelism
    shift_labels = shift_labels.to(shift_logits.device)
    ar_loss = loss_fct(shift_logits, shift_labels)
```

## 실험 결과

LLaMA 2-7B 을 base 모델로 삼았으며, unlabeled 위키피디아 데이터를 학습에 사용했다고 한다.
또한, LoRA 를 이용해서 먼저 학습 후 ANN hard negative sampling 을 통해 추가적인 학습(contrastive learning)을 진행했다고 한다.

BEIR 벤치마크에서 LLaRA 는 56.1 (NDCG@10), BERT 는 40.1, BM25 는 43.7 점을 달성했다. 참고로 openai 의 ada-2 모델은 52.1 점을 달성했다.

## 느낀점

- 뭔가 정리가 잘 안된 논문같다. 코드도 좀 복잡해서 이해하기 어려웠다.
- EBAR 과 EBAE 내용을 쭉 설명하다가 갑자기 실험에는 ANN 을 사용해서 contrastive learning 을 진행했다고 하는데 갑툭튀 느낌이라 당황스러웠다. 코드를 살펴보니 pretrained 과정과 finetuning 과정이 따로 있어서 그런듯 해보였음.


## Reference

paper

- [Making Large Language Models A Better Foundation For Dense Retrieval](https://arxiv.org/pdf/2312.15503)
- [Approximate nearest neighbor negative contrastive learning for dense text retrieval](https://arxiv.org/abs/2007.00808): 실험 진행할 때 사용한 방법

Others

- [BAAI/bge-reranker-v2-gemma (huggingface model)](https://huggingface.co/BAAI/bge-reranker-v2-gemma)
- [FlagEmbedding (github)](https://github.com/FlagOpen/FlagEmbedding/tree/master/research/LLARA): 구현 코드
