---
title: "torch.diagonal"
aliases: []
tags:
  - PyTorch
  - NLP
  - attention
---

Transformer 모델에서는 보통 마스크를 $(\text{batch}, \text{heads}, \text{seq}, \text{seq})$ 형태로 만듭니다. 이 마스크에서 $(i, j)$ 위치는 “토큰 $i$가 토큰 $j$를 볼 수 있는가”를 의미하며, 허용된 경우 $0$, 차단된 경우에는 $-\infty$와 같은 큰 음수 값이 들어갑니다.

하지만 우리가 실제로 필요한 것은 각 토큰이 유효한지(즉, 패딩이 아닌지) 여부입니다. 패딩 토큰의 경우, 자기 자신과 상호작용하는 대각선 위치 $(i,i)$에 $-\infty$가 들어가 있습니다. 반면 정상적인(패딩이 아닌) 토큰은 해당 위치가 $0$입니다. 따라서 마스크의 대각선 성분만 추출하면 각 토큰의 유효 여부를 알 수 있습니다.

아래 예시 코드를 통해 확인해봅시다.

```python
attention_mask = torch.tensor([
    [[
        [0.0, -inf, -inf],
        [0.0, 0.0, -inf],
        [0.0, 0.0,  0.0],
    ]]
])  # shape: (batch=1, heads=1, seq=3, seq=3)

mask_diag = torch.diagonal(attention_mask[:, 0], dim1=1, dim2=2)
print(mask_diag)         # tensor([[0., 0., 0.]])
print(mask_diag.shape)   # torch.Size([1, 3])
```

`attention_mask[:, 0]` 부분은 `heads` 차원이 포함되어 있기 때문에 사용합니다. 대부분의 경우 모든 헤드에 동일한 마스크를 적용하므로 첫 번째 헤드(index $0$)만 가져오면 충분합니다. 이렇게 하면 텐서 크기는 $(\text{batch}, \text{seq}, \text{seq})$가 됩니다.

여기서 `torch.diagonal(..., dim1=1, dim2=2)`을 사용하면 각 시퀀스별로 대각선 성분만 모아서 $(\text{batch}, \text{seq})$ 형태로 만들어줍니다.

이렇게 추출한 결과는 “유효한 토큰이면 $0$, 패딩이면 $-\infty$”인 이차원 마스크입니다. 이후 이 값을 이용해 간단히 $01$ 마스크로 변환하면 멀티벡터(batch 내 여러 문장들) 처리 과정에서 패딩 벡터들을 깔끔하게 제거할 수 있습니다.
