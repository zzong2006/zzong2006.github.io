---
aliases: ["Reinforcement Learning from Human Feedback", "LLM", "reinforcement_learning"]
---

# A) RLHF ?

![|650](https://i.imgur.com/DgCL1q5.jpg)

단순한 next token prediction loss 와 같은 [[loss function]] 은 좋은 언어 모델을 학습하는데 제한적이다. 이를 보완하기 위해서 사용자의 선호도를 직접 모델에 알려줄 수 있는 [[Reinforcement Learning|강화 학습]] 방식을 적용할 수 있다.

# B) RLHF Method

RLHF 는 크게 3 개의 단계로 나눠진다.

1. 언어 모델을 사전 학습 (pretraining)
2. 데이터를 모아서 리워드 모델을 학습
3. 강화 학습을 통해 LM 모델을 [[fine tuning|파인 튜닝]]

## B.1) Pretraining Language Models

![|400](https://i.imgur.com/0OvSfJG.png)

RLHF 시작 지점으로, [[masked language modeling|MLM]] 과 같이 전통적인 사전 학습 objective 를 이용해서 학습된 언어 모델을 사용한다.

이 단계에서 종종 추가적인 데이터로 학습을 한다. 예를 들어 [[private/work/keys]] 의 경우, 사람이 작성한 텍스트를 기반으로 파인 튜닝을 수행한다. 하지만 이것이 필수적인 단계는 아니다.

이렇게 완성된 모델을 a SFT(supervised fine-tuned) 모델이라고 부른다.

## B.2) Reward Model Training

![|600](https://i.imgur.com/Fk8gK8z.png)

get a model or system that takes in a sequence of text, and returns a scalar reward which should numerically represent the human preference. 특히 scalar 형태로 리워드 값을 내보내는 것이 중요하다.

리워드 모델링에 사용되는 LM 은 파인 튜닝된 LM 이거나 선호하는 데이터로 처음부터 학습된 LM 일 수 있다.

Human annotators are used to rank the generated text outputs from the LM

## B.3) Fine-tuning with RL

![|700](https://i.imgur.com/w388LyL.png)

초기 LM 모델의 파라매터 일부 또는 전체를 [[Proximal Policy Optimization]] 라는 policy-gradient 강화 학습 알고리즘을 이용하여 학습시킨다.

RL 알고리즘의 시각으로 policy, action space, observation space, 그리고 reward function 은 각각 어떤것을 의미하는지 알아보자.

1. **Policy** 는 프롬프트를 입력받고 일련의 text (또는 텍스트에 대한 확률 분포) 를 반환하는 언어 모델 자체를 의미한다.
2. The **action space** of this policy is all the tokens corresponding to the vocabulary of the language model (often on the order of 50k tokens)
3. the **observation space** is the distribution of possible input token sequences, which is also quite large given previous uses of RL (the dimension is approximately the size of vocabulary ^ length of the input token sequence)
4. **reward function** is a combination of the preference model and a constraint on policy shift.

# C) Open-sources for RLHF

Today, there are already a few active repositories for RLHF in PyTorch that grew out of this. The primary repositories are Transformers Reinforcement Learning ([TRL](https://github.com/lvwerra/trl)), [TRLX](https://github.com/CarperAI/trlx) which originated as a fork of TRL, and Reinforcement Learning for Language models ([RL4LMs](https://github.com/allenai/RL4LMs)).

TRL is designed to fine-tune pretrained LMs in the Hugging Face ecosystem with PPO. TRLX is an expanded fork of TRL built by [CarperAI](https://carper.ai/) to handle larger models for online and offline training.

# D) References

* [Illustrating Reinforcement Learning from Human Feedback (RLHF)](https://huggingface.co/blog/rlhf)
