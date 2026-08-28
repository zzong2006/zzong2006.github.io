---
title: "Trainer(huggingface)"
tags: ["huggingface", "LLM"]
---

# 1. Trainer(huggingface) ?

언어 모델을 학습하기 위해 사용하는 허깅페이스 클래스. 주로 [[Large Language Model|LLM]] 을 학습할때 사용한다.

# 2. Training Arguments

* `steps`: 데이터셋에 포함된 배치 개수를 의미. 예를 들어, 1,000 개의 example 이 포함된 데이터셋이 있고, 해당 데이터셋의 배치 사이즈가 100 이라서 총 10(=1,000/100) 개의 배치로 구성되어 있다면, `steps` 은 10 이 된다.
* `max_steps`: If set to a positive number, the total number of training steps to perform. Overrides `num_train_epochs`. Finite 데이터셋인 경우 데이터가 모두 소진되면 정해진 steps 에 가기 전에 학습이 정지될 수 있다.
* `num_train_epochs`: 학습할 전체 에폭시 수 (정수가 아닌 경우, will perform the decimal part percents of the last epoch before stopping training).

## 2.1. Batch Size

* `batch_size * gradient_accumulation_steps` 이 목적하는 실제 배치 사이즈로 계산됨
* 여기서 멀티 GPU 를 사용해서 학습하게 된다면, [[DistributedDataParallel|DDP]] 에 의해 계산되는 배치 사이즈 수가 GPU 개수만큼 늘어나게 된다.
* 최종적으로 1 training epoch 를 수행하기 위해 필요한 steps 은 다음과 같다: `steps = num_examples / (batch_size_per_gpu * gradient_accumulation_steps * num_gpus)`
* Evaluation 은 다르다. `gradient_accumulation_steps` 이 필요하지 않으므로, 단일 Evaluation 을 수행하기 위해서 필요한 steps (?) 은 `steps = num_examples / (batch_size_per_gpu * num_gpus)` 이다.

# 3. Notations

## 3.1. `past_key_values`

(언어) 모델에 입력 (`input_ids`, `attention_mask`) 을 주면 출력을 뱉어내는데, 출력에 `logit` 과 `past_key_values` 가 포함된다.

`past_key_values` 는 [[attention function|attention]] block 의 key 와 value 에 대한 hidden states 를 precomputed 한 결과이며, 디코딩 속도를 향상시키기 위해서 사용된다.

예를 들어, `GPTNeoXModel` 의 경우 `GPTNeoXLayer` 라는 디코더가 총 24 개가 존재하는데, 이 경우 `past_key_values` 는 총 24 개의 hidden states 를 tuple 형태로 가지게 되며, 각 tuple 은 key 와 value 의 hidden state 로 구성되어 있다. 각 hidden state 의 shape 는 `[batch_size, num_of_heads, model_dimension, head_dimension]` 로 구성되어 있으며, 해당 예시에서는 `[1, 16, 2048, 128]` 로 나타나게 된다 (참고: `head_dim * num_of_heads = model_dim`).

# 4. 사용 사례

* [Training CodeParrot 🦜 from Scratch](https://huggingface.co/blog/codeparrot)

# 5. Related

# 6. References
