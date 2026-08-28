---
title: "LVLM 를 따라하는 정보 넣기"
tags: ["LLM", "LVLM"]
---

# A) General LVLMs 학습 방법

Visual-encoder → cross-modal connector → LLM

Vision Transformer (ViT) Component

* Image-text pairs 를 이용해서 학습 수행
* 주로 CLIP 모델을 인코더로 활용한다. 그럼 CLIP 모델은 어떻게 학습하는거지?
* 하지만 텍스트로 따지자면, 인코더 모델을 이용할꺼니까 굳이 추가 학습은 필요 없어보인다.

Image Input

* `<img>` 와 `</img>` 같은 tag 로 나눠진다.
* 이 사이에 fixed-length sequences of image features 가 들어간다.

**Qwen-VL (2023) 학습 방법**
![](https://i.imgur.com/aT4iF5s.png)

# B) 질문

* Encoder 는 어떻게 학습하는가?
* 중간에 connector 는 어떻게 학습하지?
* 마지막 LLM 은?

# C) Qwen-VL Training Stage

## C.1) Stage (1)

In the first stage of pre-training, we mainly utilize a large-scale, weakly labeled, web-crawled set of image-text pairs.

We freeze the large language model and only optimize the vision encoder and VL adapter in this stage.

The training objective is to minimize the cross-entropy of the text tokens. The maximum learning rate is $2e^{−4}$.

The training objective is to minimize the cross-entropy of the text tokens.

## C.2) Stage (2)

In the second stage of multitask pre-training, we introduce high-quality and fine-grained VL annotation data with a larger input resolution and interleaved image-text data.

We unlocked the large language model and trained the whole model. The training objective is the same as the pre-training stage.

## C.3) Stage (3)

During this stage, we finetuned the Qwen-VL pre-trained model through instruction fine-tuning to enhance its instruction following and dialogue capabilities, resulting in the interactive Qwen-VL-Chat model.

In this stage, we freeze the visual encoder and optimize the language model and adapter module.

# D) Qwen-VL 서베이

[transformers/src/transformers/models/qwen2\_vl/processing\_qwen2\_vl.py at main · huggingface/transformers · GitHub](https://github.com/huggingface/transformers/blob/main/src/transformers/models/qwen2_vl/processing_qwen2_vl.py)

`Qwen2VLImageProcessor` 에서 입력받은 이미지를 처리한다.

[transformers/src/transformers/models/qwen2\_vl/image\_processing\_qwen2\_vl.py at main · huggingface/transformers · GitHub](https://github.com/huggingface/transformers/blob/main/src/transformers/models/qwen2_vl/image_processing_qwen2_vl.py)

…

[Qwen-VL/finetune.py at master · QwenLM/Qwen-VL · GitHub](https://github.com/QwenLM/Qwen-VL/blob/master/finetune.py)

# E) Paligemma Survey

* Pali-Gemma 1: [Gemma 설명: PaliGemma 아키텍처 - Google Developers Blog](https://developers.googleblog.com/ko/gemma-explained-paligemma-architecture/)
* Pali-Gemma 2: [PaliGemma 2 출시: 강력한 비전-언어 모델, 간단한 미세 조정 - Google Developers Blog](https://developers.googleblog.com/ko/introducing-paligemma-2-powerful-vision-language-models-simple-fine-tuning/?_gl=1*1di858s*_up*MQ..*_ga*NTI4MTI1Mzg5LjE3MzQ0MjY2MjA.*_ga_H733Y2BZES*MTczNDQyNjYxOS4xLjEuMTczNDQyNjYyNi4wLjAuMA..)

```python
c.model_name = 'proj.paligemma.paligemma'
c.model = {}
c.model.img = dict(variant='So400m/14', pool_type='none', scan=True)
c.model.llm = dict(vocab_size=256_000 + 1024 + 128, dropout=0.1)
c.model_init = f'pt_{c.res}'
```

뭔가 이상한 부분은 linear projection 부분이 없는것 같아서 의심된다.

# F) Llama 3.2 - Vision Survey

## F.1) 학습 데이터

Llama 3.2-Vision was pretrained on 6B image and text pairs. The instruction tuning data includes publicly available vision instruction datasets, as well as over 3M synthetically generated examples.

# G) 신규 모델을 만들고 싶다면

다음의 정의가 필요하다

* `PreTrainedModel`: (reference: [transformers/src/transformers/models/qwen2\_vl/modeling\_qwen2\_vl.py at a7f5479b45a8040392af80bf1107a2bdd796931c · huggingface/transformers · GitHub](https://github.com/huggingface/transformers/blob/a7f5479b45a8040392af80bf1107a2bdd796931c/src/transformers/models/qwen2_vl/modeling_qwen2_vl.py#L912))
* PretrainedConfig: [transformers/src/transformers/models/qwen2\_vl/configuration\_qwen2\_vl.py at a7f5479b45a8040392af80bf1107a2bdd796931c · huggingface/transformers · GitHub](https://github.com/huggingface/transformers/blob/a7f5479b45a8040392af80bf1107a2bdd796931c/src/transformers/models/qwen2_vl/configuration_qwen2_vl.py#L57)
