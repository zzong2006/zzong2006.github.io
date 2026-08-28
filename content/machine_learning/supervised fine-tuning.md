---
title: "supervised fine-tuning"
tags: ["deep_learning", "LLM", "generative_ai", "alignment"]
aliases: ["SFT", "supervised finetuning", "supervised fine-tuning"]
---

# A) Supervised Fine-Tuning

Supervised Fine-Tuning(SFT)은 pretrained language model을 instruction-response 형식의 labeled data로 추가 학습하는 단계다. foundation model이 “다음 token을 잘 예측하는 모델”에서, 사용자의 지시를 따르는 assistant처럼 답하도록 행동 분포를 옮기는 역할을 한다.

RLHF나 DPO 같은 preference optimization을 바로 적용하기 전에 SFT를 먼저 거치는 이유도 여기에 있다. 모델이 기본적인 task format과 답변 스타일을 배워야, 이후 preference signal이 “무엇을 더 선호하는가”를 안정적으로 조정할 수 있다.

# B) Fine-Tuning과의 차이

일반적인 [[machine_learning/fine tuning|fine tuning]]은 pretrained model을 특정 domain이나 task에 맞게 추가 학습하는 넓은 개념이다. SFT는 그중에서도 **정답 response가 있는 supervised data** 를 사용해 instruction following을 학습하는 LLM alignment 단계에 가깝다.

| 구분 | 목적 | 데이터 |
| --- | --- | --- |
| Domain fine-tuning | 특정 domain language에 적응 | domain corpus |
| Instruction tuning/SFT | 지시를 따르는 답변 형식 학습 | prompt-response pair |
| Preference optimization | 더 선호되는 답변 쪽으로 조정 | preference pair 또는 reward signal |

# C) Alignment에서의 위치

SFT는 보통 [[machine_learning/generative_ai/alignment tax|alignment]] pipeline의 초반에 온다. 이후 preference data를 쓰는 [[RLHF]], DPO, rejection sampling 같은 방법이 붙을 수 있지만, SFT가 기본적인 instruction following 형식을 먼저 잡아준다.

# D) 주의할 점

SFT data가 너무 좁거나 품질이 낮으면 모델이 원래 갖고 있던 일반 능력을 잃을 수 있다. 이 현상을 alignment tax처럼 볼 수 있으며, 실무에서는 data mixture, learning rate, epoch 수를 조심해서 잡는다.

# References

* [StackLLaMA: A hands-on guide to train LLaMA with RLHF](https://huggingface.co/blog/stackllama#supervised-fine-tuning)
