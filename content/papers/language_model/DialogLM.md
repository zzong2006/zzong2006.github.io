---
title: "DialogLM"
tags: ["language_model", "LLM", "Microsoft", "NLP", "nlp", "paper_review", "summarization", "y2022"]
---

# A) DialogLM이란?

DialogLM은 긴 대화를 이해하고 요약하기 위해 사전 학습된 인코더-디코더 기반 신경망 모델입니다.

## A.1) 기존 연구의 한계

- 지금까지의 연구는 주로 짧은 길이의 1:1 대화 상황에 집중되어 있었습니다.
- 따라서 긴 대화 맥락을 효과적으로 이해하고 처리할 수 있는 연구와 강력한 도구가 부족한 실정입니다.
- 기존의 BART나 UNILM 모델은 대화 데이터로 사전 학습되지 않았으며, 대화 중심의 태스크를 위해 특별히 설계된 모델도 아닙니다.

# B) 특징

## B.1) 모델 구조 (with Hybrid attention)

UNILMv2 모델에 기반한 sequence-to-sequence 구조로 구성되어 있다.

![|550](https://i.imgur.com/Pilfjs4.png)

A hybrid attention (sparse attention + global self-attention): 길어진 시퀀스와 학습 시간 감소를 위해

- 대부분의 layer 에는 sparse attention 적용: 모델에게 local 정보를 학습시키기 위해
- 나머지 layer 에는 global self-attention 적용: 전체적인 대화의 맥락 파악을 위해

### B.1.1) Sinkhorn Attention

Long sequence 를 다룰때 encoder 의 [[self-attention]] 이 가장 큰 오버헤드를 발생시킨다. 이에 대응하기 위해 Local attention 에 기반한 Sinkhorn attention 방식을 적용한다.

Local attention 방식은 입력값을 여러개의 블록 기반의 attention 으로 나눠서, 각 단어들은 자신만의 블록에만 참가할 수 있도록 제한을 둔다. 이렇게 하면 컴퓨팅 비용은 크게 낮출 수 있지만, global 정보는 잃게 된다.

Sinkhorn attention 는 이러한 한계를 극복하기 위해 **정렬 (sorting)** 이 가능한 신경망을 사용한다. 해당 신경망은 기존의 나눠진 블록들을 새로운 순서로 정렬시킨다. 위 그림에서 초록색 블록은 정렬 후 노란색 블록과 동일한 위치이기 때문에 서로 상호작용 (attend) 하여 학습을 진행할 수 있다. 이렇게 하면 각 블록이 여러 위치에 해당하는 정보를 접근할 수 있게 된다.

하지만 텍스트 요약의 경우 전체적인 맥락의 파악은 필수적인 요소이기 때문에 일부 레이어 (e.g. 4, 8, 12 번째 레이어) 의 경우 full self-attention 을 두게 된다 (no free-lunch 와 비슷한 맥락인듯).

# C) Pre-train Task: Window-based Denoising

![](https://i.imgur.com/GxHrbL4.png)

1. 연속적은 multiple consecutive turns 들이 포함되어 있는 window 를 선택
2. window 에 masking 같은 노이즈 (arbitrary dialogue-related noise) 를 삽입
3. 나머지 대화를 기반으로 해당 윈도우를 복구하는 작업을 통해 학습

## C.1) 다른 모델의 학습 방식과 비교

(1) PEGASUS
윈도우는 여러 대화 문장이 포함되어 있으므로, 문장 수준의 마스킹 (sentence-level masking) 기법으로 학습하는 PEGASUS 보다 대화를 이해하는데 적합하다.

Unlike documents, numerous individual turns in a conversation are not informative. Sentence/turn-level masking does not necessarily enable the model to understand the core content of the whole dialogue.

(2) [[BART]]
BART 는 full-text denoising 방식을 채택하는데, 매우 긴 시퀀스를 대상으로 학습하는데 있어서 윈도우 방식이 훨씬 적은 리소스를 필요로 한다. 또한 대화 요약과 같은 task 에 윈도우 방식이 적합하다고 주장한다.

# D) Five Types of Dialogue-inspired Noises

How do we generate a noisy window?

1. Speaker Mask: 윈도우 내 50% 화자의 이름을 임의로 마스킹
2. Turn Splitting: 한 사람이 여러번 말하는 경우가 있는데, 가장 많은 문장을 가진 케이스를 나눔
3. Turn Merging, (4) Text Inﬁlling and (5) Turn Permutation.

![](https://i.imgur.com/hwcI0BK.png)

# E) 실험

Hybrid attention 방식을 사용한 모델 (DialogLM-sparse) 과 그렇지 않은 모델 (DialogLM) 을 나눠서 실험을 진행하였다.

## E.1) Datasets

- MediaSum: 미디어 인터뷰
- OpenSubtitles Corpus: 영화와 TV 자막
	- 약 60 개의 언어로 구성되었는데 영어 부문만 학습에 사용

위와 같은 데이터셋의 선정 이유

- 긴 대화가 많고 여러 화자가 참가함
- 텍스트 구조가 깔끔함

## E.2) Pre-training

- Parameters
	- steps: 200,000 steps on dialogue data, of which 20,000 are warmup steps
	- batch size: 64
	- maximum learning rate: 2e-5
- window size
	- set to 10% of the input length
	- maximum size is limited to 512 tokens
- Computing resources
	- 8 A100 GPUs with 40GB

## E.3) Downstream Task

- Long Dialogue Summarization: 5 천 단어 이상의 대화를 입력받고, 512 단어 이하로 요약글 작성
- Abstractive Question Answering(QA)
- Topic Segmentation

## E.4) 평가

- 요약 task 의 경우 [[rogue]] 방식으로 측정

## E.5) 결과

**Human Evaluation**

- ﬂuency, informativeness and faithfulness 에 대해 사용자에게 랭킹으로 피드백을 받음
- DialogLM can output more coherent sentences than UniLM, and it is comparable to BART
- However, the performance of all neural models is still far from the human-annotated answers or summaries.

# F) References

- GitHub: [microsoft/DialogLM: Official Implementation of "DialogLM: Pre-trained Model for Long Dialogue Understanding and Summarization."](https://github.com/microsoft/DialogLM)
