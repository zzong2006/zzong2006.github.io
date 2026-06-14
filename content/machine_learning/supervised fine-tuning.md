---
title: "supervised fine-tuning"
tags: ["deep_learning", "LLM"]
aliases: ["SFT"]
---

# A) Supervised Fine-tuning ?

Before we start training reward models and tuning our model with RL, it helps if the model is already good in the domain we are interested in. The easiest way to achieve this is by continuing to train the language model with the language modeling objective on texts from the domain or task.

There is nothing special about fine-tuning the model before doing [[RLHF]] - it’s just the causal language modeling objective from pretraining that we apply here.

# B) 예시: Stack Exchange Dataset

The [StackExchange dataset](https://huggingface.co/datasets/HuggingFaceH4/stack-exchange-preferences) is enormous (over 10 million instructions), so we can easily train the language model on a subset of it.

We want it to answer questions, while for other use cases, we might want it to follow instructions, in which case instruction tuning is a great idea.

# C) Related

# D) References

* [StackLLaMA: A hands-on guide to train LLaMA with RLHF](https://huggingface.co/blog/stackllama#supervised-fine-tuning)
