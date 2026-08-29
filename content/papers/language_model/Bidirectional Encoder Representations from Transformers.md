---
title: "Bidirectional Encoder Representations from Transformers"
tags:
  - language_model
  - -
  - NLP
  - nlp
  - paper_review
  - NLP
  - Google
  - encoder
  - bidirectional
aliases:
  - BERT
---

# A) BERT ?

Google 에서 만든 language representation model. BERT 는 미리 학습된 (pre-trained) 언어 모델이다.  
BERT is designed to pre-train deep bidirectional representations from unlabeled text([[unsupervised learning]]) by jointly conditioning on both left and right context in all layers.

기존 방식들은 fine-tuning 을 잘 하지 못하기 때문에, pre-trained 표현이 잘 될 수 있는 부분을 억제하고 있다. 가장 문제가 되는 부분은 일반적인 language model 가 unidirectional 하다는 것이다. 예를 들어, OpenAI GPT 의 경우 left-to-right 구조를 택하고 있어서 [[transformer]] 의 [[self-attention]] layer 에 있는 모든 token 이 오직 이전 token 에만 붙을 수 (attend) 있다. 이런 방식은 양쪽 방향에 대한 context 가 모두 필요한 task 의 경우 불리할 수 있다 (i.e. question answering)

BERT 에서는 masked language model (MLM) 이라는 전략을 사용해서 기존의 한방향에 대한 제한을 완화한다. MLM 방식은 입력 token 들의 일부에 대해서 임의로 mask 를 씌우고 이를 예측하고도록 학습하는 방식을 의미한다. MLM 방식을 쓰면 양쪽 context 를 학습하여 representation 을 만드는것이 가능하다. 즉, 이것은 pre-trained deep bidirectional Transformer 을 의미한다. 추가로 MLM 모델 말고도 “ 다음 문장 예측 ” task 를 text-pair representation 과 함께 학습한다.

# B) Related Work

pre-training language representation 방식은 두 가지로 나뉘어짐

## B.1) Unsupervised Feature-based Approaches

Fine-tuning 보다 과거부터 접근해오던 방식이다. 특정 task 를 수행하는 network 에 pre-trained language representation 을 추가적인 feature 로 제공한다.

## B.2) Unsupervised Fine-tuning Approaches

supervised downstream task 를 수행하기 위해 unlabeled text 그리고 fine-tuned 를 이용해서 미리 학습하는 방식을 의미하며, 학습된 encoder 들은 contextual token 표현을 생성한다.

이 방식의 장점은 일부 parameter 들만 다시 학습해도 괜찮다는 것이다.

대표적으로 OpenAI 의 GPT 가 있으며, BERT 도 이 방식중 하나이다.

# C) BERT 구조

BERT 프레임워크는 크게 두 가지로, pre-training 과 fine-tuning 으로 나뉜다.  
pre-training 과정에서는 서로 다른 pre-training tasks 로 부터 학습하는데, 학습하는 데이터로 unlabeled 데이터를 사용한다. 그리고 fine-tuning 에서는 BERT 모델이 pre-training 된 parameter 로 처음 초기화된다. 이후 downstream task 로부터 labeled 데이터를 이용해서 모든 parameter 들을 fine-tuning 하게 된다. 각 downstream task 에 대한 각 모델은 서로 동일하게 초기화하여 시작했지만, 이후에는 개별적인 튜닝 모델을 가지게 된다.

예를 들면 아래처럼 표현된다.  
![](https://i.imgur.com/dofGzch.png)

## C.1) 모델 구조

BERT 는 양 방향 학습이 가능한 멀티 레이어 형태의 transformer 인코더다. 가장 기본적인 모델은 BERT base 로, (L=12, H=768, A=12) 의 parameter 셋팅을 가진다. 여기서 L 은 레이어 (transformer 블록) 개수, H 는 히든 레이어 크기, 그리고 A 는 셀프 어텐션 head 수 를 의미한다.

transformer 인코더를 쌓아놓은 형태다.

![](https://i.imgur.com/5x1Q43z.png)

# D) References

* [bert github](https://github.com/google-research/bert)
* [paper link](https://arxiv.org/abs/1810.04805)
* [[BERT4Rec - Sequential Recommendation with Bidirectional Encoder Representations from Transformer]]
