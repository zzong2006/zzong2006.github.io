---
tags: ["tip"]
---

# A) GPU 메모리 부족 시

아래 방식처럼 현재 [[CUDA]] 메모리를 클리어할 수 있다.

```python
import torch
torch.cuda.empty_cache()
```

또한 아래와 같이 사용하지 않는 변수들도 삭제할 수 있다.

```python
import gc
del variables
gc.collect()
```

실제로는 파이토치는 메모리 자체를 청소하는게 아니라 메모리를 차지하는 변수들을 가리키는 레퍼런스들을 청소한다.

참고) [stackoverflow: how-to-avoid-cuda-out-of-memory-in-pytorch](https://stackoverflow.com/questions/59129812/how-to-avoid-cuda-out-of-memory-in-pytorch)

# B) Related

# C) References
