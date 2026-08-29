---
title: Train Large Model
tags:
  - LLM
  - deepspeed
aliases: []
---

# A) 배경

Qwen2.5 의 72b 급 대용량 모델을 학습하는 방법에 대해 조사해보자.

[[deepspeed]] **Bucket 크기 조정**

모델을 크게 학습하는 문제와 별개로, instruction-following이나 한국어 문체를 맞추는 단계는 post-training 설계가 따로 필요하다. SFT, [[DPO]], [[GRPO]], distillation, reward 설계의 큰 그림은 [[LLM Post-Training for Natural Korean]]에서 이어서 본다.

**모델 병렬화 필요성:**  
* ZeRO-3 는 모델 병렬화가 아닌 데이터 병렬화 방식으로 설계됨. 따라서 모델 병렬화를 활용하는 것이 권장됨.

# B) Trials

* bucket_size 조절
	* `allgather_bucket_size` 및 `reduce_bucket_size` 값을 `2e8` 로 낮추는 방법이 제안됨
	* 별 효과 없음
* `offload_optimizer` 옵션 키기: 별 효과가 없음
