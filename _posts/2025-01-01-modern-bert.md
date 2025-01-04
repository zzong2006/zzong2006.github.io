---
layout: post
tags: LLM encoder BERT Flash_Attention
title: "새로운 Bert 모델: ModernBERT"
date: 2025-01-01
categories: paper-review
giscus_comments: true
toc:
  sidebar: left
---


기존 BERT family 들의 성능과 속도를 모두 이길 수 있는 ModernBERT 가 나왔다고 한다. 

여기서 성능이라하면 GLUE score 를 의미하고, 속도라 하면 초당 토큰 처리를 의미한다. 아래 그래프를 참고하자.

<img src="https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/blog/modernbert/modernbert_pareto_curve.png" style="width: 85%;">


## 특징

ModernBERT 는 기존의 BERT 대비 다음과 같은 장점을 가지고 있다.

1. 8k 토큰 사이즈 지원: 대부분의 BERT 시리즈는 최대 512 토큰 사이즈를 지원했다.
2. 메모리 효율적: Kaggle 에서 가장 많이 쓰이는 DeBERTaV3 모델보다 1/5 정도 메모리만 필요하다.
3. 추론 속도가 빠름: DeBERTa 모델보다 기본적으로 2배 빠르며, mixed length 인 케이스에서는 최대 4배 더 빠르다.

그 외에도 학습 데이터셋 사이즈가 2T token 이라는 특징이 있다.

아래의 세가지 방법론을 적용해서 ModernBERT 를 만들었다고 한다.

1. 현대화된 transformer 구조
2. Particular attention to efficiency
3. 학습 데이터셋을 현대적으로 재구성

## (Recipe 1) Transformer 구조 업데이트

Llama2 패밀리 모델에서 사용된 Transformer++ 구조에 영감을 얻어서 다음과 같은 업데이트를 적용했다고 한다.

- Old positional encoding 을 RoPE(rotary positional embeddings) 로 대체
- 기존 BERT 의 GeLU activation function 이 포함된 MLP layers 를 GeGLU layers 로 교체
- 불필요한 bias term 을 제거해서 parameter 수를 줄이는데 기여
- 임베딩 레이어 이후에 normalization layer 를 추가

## (Recipe 2) Attention 방식 변경으로 효율성 높이기 

Flash Attention 2 를 활용하여 아래와 같은 업데이트를 적용했다.

1. Attention 변경: local and global
2. Sequence Packing 적용
3. 하드웨어 밎춤형 모델 디자인

### 2-1. Local and Global Attention

기존 BERT 에서는 모든 레이어에서 모든 input token 들에 대해 attention 로직을 적용했다. 이를 full attention 이라고 표현해보자.

ModernBert 에서는 full attention 방식을 global 과 local attention 으로 나눴다. 

- global attention: 매 3번째 layer 에서 모든 input token 들에 대해 attention 로직을 적용
- local attention: 나머지 layer 에서 sliding window 방식으로 **일부 input token 들**에 대해 attention 로직을 적용 (window size: 128)

이는 마치 책을 읽을때와 비슷한데, 모든 문장에 대해서 집중하는 것(full attention) 과 주요 줄거리와 일부 문장에 대해서만 집중하는 것(global and local attention) 의 개념적 차이라고 볼 수 있다.

Attention 의 계산 복잡도는 토큰 사이즈에 따라서 급증하므로, modernBert 는 긴 문장에 대해서 효율적으로 대처할 수 있다.

### 2-2. Sequence Packing

일반적으로 서로 다른 sequence length 를 가진 데이터를 처리하기 위해서는 padding 을 적용해야 한다. 

하지만, 이 방식은 낭비되는 패딩 토큰에 의해서 성능 저하를 발생시키고, 패딩 토큰 역시 어떠한 의미론적 기여를 하지도 않는다.

이런 문제를 해결하기 위해서, ModernBert 는 padding 을 붙이지 않는 Sequence packing 방식을 적용했다.

<img src="https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/blog/modernbert/modernbert_unpadding.png" style="width: 100%;">

Sequence packing 의 효과를 최대화하기 위해, 사전 학습 과정에서 model max-length 와 최대한 가까운 sequence 길이의 순서로 packing 을 적용하여 처리 속도를 높였다고 한다.

### 2-3. 하드웨어 밎춤형 모델 디자인

연구에 따르면 deep & narrow layer 조합이 wide & shallow layer 조합보다 더 좋은 성능을 보이는 경우가 많다. 하지만 trade-off 가 발생하는데, 모델 layer 가 깊을수록 병렬화가 줄어들고 따라서 동일한 파라매터 개수라도 속도가 느려지게 된다.

일반적인 GPU 사양이 RTX 3090/4090 정도 급이라는걸 가정하고, 제한된 grid search 를 통해서 최적의 모델 디자인을 찾았다고 한다. 

그 결과, base 는 150M 정도, large 는 400M 정도 크기의 모델이 되었으며, 임베딩 크기는 768 (base) 와 1024 (large) 로 확인할 수 있다.

## (Recipe 3) 학습 데이터셋 재구성

기존의 DeBERTaV3 같은 모델들은 Wikipedia and Wikibooks 와 같이 고품질 데이터만 학습셋으로 구성한 데이터로만 학습했다 (single text modality).

하지만 modernBert 는 web documents, code, and scientific articles 같은 다양한 종류의 데이터도 학습 데이터셋을 활용한다.

이런 학습 데이터셋의 변화는 ModernBERT 가 프로그래밍 관련 task 에서 더 좋은 성능을 보이는 것으로 증명할 수 있겠다.

## 학습 프로세스

기존의 BERT 학습 방식을 그대로 유지하되, 별 효과가 없는 next-sentence prediction 목적함수를 제거하고, masking rate 를 15% 에서 30% 로 증가시켰다. 

그리고 2T 데이터셋을 한번에 학습하지 않고, 총 3 단계의 학습을 거쳤다.

1. 1.7T 의 데이터는 1024 토큰 사이즈로 학습
2. 나머지 250B 토큰은 8192 토큰 사이즈로 학습
3. 마지막으로 나머지 50B 토큰은 길이를 랜덤으로 샘플링하여 학습

이는 ProLong 이라는 것에서 영감을 받았다고 하는데, 구체적인 내용은 확인해보지 않아서 잘 모르겠다.

이 외에도 아래 두가지 트릭으로 좀 더 효율적인 학습이 가능했다고 한다.

1. Batch Size warming up: 배치 사이즈를 학습 초기에는 작게 가져갔다가 시간이 지날수록 조금씩 늘려가는 방법
2. Tiling Model weight: Large 모델 weight 를 초기화할때 학습된 Base 모델을 활용하여 loss 수렴 속도를 높이는 방법

## 느낀점

최근 8k 수준의 임베딩을 생성할 수 있는 인코더 전략들이 많이 나오는것 같다. 

FlashAttention 기반의 Sequence Packing 을 적용했다는 점, attention 방식을 Layer 마다 다르게 적용한 점도 흥미로웠다. 상당히 배워보고 싶은 기술들이다.

최적의 레이어 디자인을 찾는것은 grid search 를 이용했다고 하니, 역시 이 부분은 노다가 아니면 안되는 일인듯 싶다.

그리고 단순히 고품질 데이터가 문제가 아니라 더 다양한 데이터 역시 성능에 중요한 영향을 미친다는 것도 중요한 포인트인듯 싶다.


## References

Smarter, Better, Faster, Longer: A Modern Bidirectional Encoder for Fast, Memory Efficient, and Long Context Finetuning and Inference

- blog: https://huggingface.co/blog/modernbert
- paper: https://huggingface.co/papers/2412.13663
