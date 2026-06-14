---
title: "Fully Sharded Data Parallel"
tags: ["huggingface", "accelerate"]
aliases: ["FSDP"]
---

# A) Fully Sharded Data Parallel ?

# B) Error Handling

```python
UserWarning: FSDP is switching to use `NO_SHARD` instead of ShardingStrategy.FULL_SHARD since the world size is 1.
```

GPU 의 개수가 1 인 경우 발생하는 이슈로, config 에서 process 개수를 GPU 개수만큼 바꿔주자.

## B.1) Very Slow Issue on Multi-node Training

FSDP 기반 멀티 노드로 학습을 진행하는 경우 단일 노드 학습보다 매우 느려지는 경우가 있다. 수치상 약 5 배 정도 느려지는 것으로 보인다.

비슷한 이슈를 깃헙에서도 확인할 수 있었는데, [FSDP very slow on multi-node training · Issue #102434 · pytorch/pytorch · GitHub](https://github.com/pytorch/pytorch/issues/102434) 에서 보면 샤딩 방식을 `FULL_SHARD` 에서 `HYBRID_SHARD` 로 바꾸면 더 빨라진다는 얘기가 있다. 하지만 Huggingface Trainer 에서는 FSDP 의 하이브리드 옵션이 가능하다고 따로 명시되지 않았다.

[move fsdp handling to accelerate by pacman100 · Pull Request #23158 · huggingface/transformers · GitHub](https://github.com/huggingface/transformers/pull/23158) 에서 보면 accelerate 만 하이브리드 옵션이 가능하도록 만들어 놓았다.

# C) Related

# D) References

* [Fully Sharded Data Parallel](https://huggingface.co/docs/accelerate/usage_guides/fsdp)
* [Train models with billions of parameters using FSDP — PyTorch Lightning 2.1.0.rc0 documentation](https://lightning.ai/docs/pytorch/latest/advanced/model_parallel/fsdp.html)
