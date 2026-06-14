---
title: "gradient accumulation"
tags: ["deep_learning", "generative_model"]
---

# A) Gradient Accumulation ?

Gradient accumulation is a technique where you can train on bigger batch sizes than your machine would normally be able to fit into memory.

# B) `gradient_accumulation_steps`

`gradient_accumulation_steps` 은 gradient_accumulation 을 몇번째 step 마다 수행할 것인지 정하는 파라매터다.

```python
gradient_accumulation_steps = 2

for index, batch in enumerate(training_dataloader):
	...
    loss = loss_function(outputs, targets)
    loss = loss / gradient_accumulation_steps
    loss.backward()
    if (index + 1) % gradient_accumulation_steps == 0:
        optimizer.step()
        scheduler.step()
        optimizer.zero_grad()
```

# C) Related

# D) References
