---
aliases: ["Mixture-of-Experts"]
---

# A) MoE ?

# B) 한계점

* 제한된 범위: 인코더 - 디코더 모델이나 [[seq2seq]] task 한정으로 연구가 진행되었고, GPT-3 와 같은 NLG 모델은 덜 연구되었음
* 메모리 한계: 많은 파라매터 개수가 필요하다. MoE based models have a much lower “parameter eﬃciency” compared to quality-equivalent dense models.
	* 7.4B 크기의 Switch transformers 가 0.74B 크기의 T5-large 모델에 비해 downstream tasks 성능이 좋지 못함
* Limited Inference Performance: 모델 사이즈가 커지면 그만큼 모델에 맞는 GPU 에 넣어줘야 하는데, 일반적인 multi-gpu 추론 방식은 MoE 기반 모델에 맞춰져 있지 않다. 또한, 주로 인퍼런스 병목은 memory bandwidth bound 에 의해 발생하는데, 이는 dense 모델의 10 배 수준이며, dense 모델과 비슷한 인퍼런스 속도를 가지려면 10 배의 bandwidth 사이즈가 필요하다.

# C) Models

* [jetmoe/jetmoe-8b · Hugging Face](https://huggingface.co/jetmoe/jetmoe-8b?utm_source=tldrai)
* [On PHATGOOSE: The Challenge of Recycling PEFT Modules for Zero-Shot Generalization](https://colinraffel.com/blog/phatgoose.html)
	* LoRA based MoE

# D) Related

# E) References
