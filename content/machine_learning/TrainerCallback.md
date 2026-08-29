---
title: "TrainerCallback"
aliases: []
tags:
  - huggingface
  - deep_learning
  - LLM
---

# 1. `TrainerCallback` ?

Huggingface 의 경우 `on_init_end`, `on_train_begin`, `on_step_end`, ..등등으로 callback 의 method 들이 훈련하는 도중에 특정 시점에 호출이 됩니다.

# 2. Callback 추가 및 삭제

Callback 클래스를 추가하게 되면 특정 조건을 만족할 때마다 callback 이 호출되게 됩니다. Integration Callback 의 경우 추가하는 방법은 Trainer 를 instantiate 할 때 report_to argument 에서 지정해주게 됩니다. 예를 들어, WandBCallback 을 추가하고 싶으면 “wandb” 라는 argument 를 넘겨주면 됩니다. Default Callback 들의 경우 DefaultFlowCallback 은 자동으로 추가가 됩니다. 수동으로 Callback 들을 추가하려면 Trainer 의 add_callback 이라는 method 를 사용하게 된다면 Callback 을 추가할 수 있습니다. Trainer 의 remove_callback 이라는 method 를 사용하게 되면 Callback 을 삭제할 수 있습니다.

# 3. Custom Callback

```python
class MyCallback(TrainerCallback):
    "A callback that prints a message at the beginning of training"

    def on_train_begin(self, args, state, control, **kwargs):
        print("Starting training")
```

# 4. Related

# 5. References

[Huggingface:TrainerCallback - Woongjoon\_AI](https://woongjoonchoi.github.io/huggingface/Trainer-Callback/)
