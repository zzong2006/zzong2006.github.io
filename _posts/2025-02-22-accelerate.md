---
layout: post
title: python accelerate 라이브러리 함수 조사기
date: 2025-02-22 21:00:00
giscus_comments: true
categories: framework-review
toc:
  beginning: true
  sidebar: left
tags: python
---


### `accelerate.utils.gather_object`

Recursively gather `object` in a nested list/tuple/dictionary of objects from all devices.

뭐하는 친구인지 잘 모르겠다. multi-gpu 환경에서 여러 객체들을 한데로 모으는 역할을 하는 것 같다. 하지만 모으기 위해서 왜 object 를 입력으로 받는걸까?

**Usage**

```python
from accelerate.utils import gather_object

def example(inputs: dict[str, Union[torch.Tensor, Any]]):
    prompts_text = [
      maybe_apply_chat_template(example, self.processing_class)["prompt"] for example in inputs]
    # Generate completions using vLLM: gather all prompts and use them in a single call in the main process
    all_prompts_text = gather_object(prompts_text)
```
