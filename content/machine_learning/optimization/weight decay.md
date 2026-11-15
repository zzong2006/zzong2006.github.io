---
title: "Weight Decay"
tags: deep_learning 
aliases: []
---

# A) Weight Decay ?

weight decay 는 학습의 매 step 마다 가중치를 일정 비율로 줄이는 정규화다. 가중치가 필요 이상으로 커지지 않게 해서 [[overfitting]] 을 줄인다.

$$
\theta_t = (1 - \alpha\lambda)\,\theta_{t-1} - \alpha\, (\text{optimizer 가 정한 이동량})
$$

| 기호 | 뜻 |
| --- | --- |
| $\theta_t$ | step $t$ 의 가중치 |
| $\alpha$ | learning rate |
| $\lambda$ | weight decay 계수. $\alpha\lambda$ 가 한 step 에 가중치를 줄이는 비율이다 |

loss 에 L2 벌점 $\frac{\lambda}{2}\lVert\theta\rVert^2$ 를 더하는 L2 [[regularization]] 과 목적이 같고, SGD 에서는 둘이 정확히 같은 업데이트를 만든다. 그래서 두 이름이 섞여 쓰이지만, Adam 같은 적응형 optimizer 에서는 결과가 달라진다.

# B) SGD 에서는 L2 벌점과 같다

L2 벌점을 더한 loss 의 gradient 는 원래 gradient $g_t$ 에 $\lambda\theta$ 가 더해진 것이다. 이것으로 SGD 업데이트를 하면 다음과 같다.

$$
\theta_t = \theta_{t-1} - \alpha\,(g_t + \lambda\theta_{t-1}) = (1 - \alpha\lambda)\,\theta_{t-1} - \alpha\, g_t
$$

마지막 식은 "가중치를 $(1 - \alpha\lambda)$ 배로 줄이고, 원래 gradient 로 한 step 간다" 는 뜻이다. weight decay 의 정의와 똑같다.

# C) Adam 에서는 L2 벌점과 다르다

Adam 은 gradient 를 그 파라미터의 평소 gradient 크기 $\sqrt{\hat v_t}$ 로 나눈다 ([[optimization algorithms]] 노트의 Adam 절). L2 벌점을 loss 에 넣으면 $\lambda\theta$ 도 gradient 에 섞여 함께 나뉜다.

- 평소 gradient 가 큰 파라미터는 큰 값으로 나뉘므로 가중치를 줄이는 힘이 약해진다.
- 평소 gradient 가 작은 파라미터는 작은 값으로 나뉘므로 가중치가 세게 줄어든다.

같은 $\lambda$ 를 줘도 파라미터마다 정규화 강도가 달라지는 것이다. AdamW 는 가중치를 줄이는 항을 이 나눗셈 밖으로 빼서, gradient 크기와 상관없이 모든 파라미터를 $(1 - \alpha\lambda)$ 배로 줄인다.

## C.1) 시뮬레이션으로 확인하기

평균 0 인 잡음만 gradient 로 받는 파라미터 하나를 가중치 1 에서 시작해 2,000 step 학습시켰다. 학습할 신호가 없으므로 가중치가 줄어드는 것은 순전히 정규화 때문이다. gradient 잡음의 표준편차만 바꿔 가며 L2 벌점을 넣은 Adam 과 AdamW 를 비교했다. learning rate $10^{-3}$, $\lambda = 10^{-2}$, $\beta_1 = 0.9$, $\beta_2 = 0.999$ 이고, 50 번 반복한 평균이다.

| gradient 잡음의 표준편차 | Adam + L2 벌점 | AdamW |
| --- | --- | --- |
| 1 | 0.98 | 0.98 |
| 0.01 | 0.19 | 0.98 |
| 0.0001 | 0.02 | 0.98 |

AdamW 는 gradient 크기와 상관없이 가중치가 $(1 - 10^{-5})^{2000} \approx 0.98$ 로 같은 비율만큼 줄었다. L2 벌점을 넣은 Adam 은 gradient 가 작은 파라미터일수록 훨씬 많이 줄었고, 표준편차 0.0001 에서는 가중치가 0.02 까지 내려갔다. 가중치를 줄이는 힘 $\lambda\theta$ 가 작은 $\sqrt{\hat v_t}$ 로 나뉘면서 커졌기 때문이다.

신경망에서는 층이나 파라미터마다 gradient 크기가 크게 다르므로, L2 벌점을 넣은 Adam 에서는 어느 파라미터가 얼마나 정규화되는지를 $\lambda$ 하나로 조절할 수 없다. Loshchilov & Hutter (2019) 는 이 차이를 지적하고 AdamW 를 제안했다.

# D) 실무에서 정하는 값

- PyTorch 의 `torch.optim.Adam(weight_decay=...)` 은 L2 벌점 방식이고, `torch.optim.AdamW(weight_decay=...)` 가 decoupled weight decay 다. 이름이 같은 인자라도 동작이 다르다.
- bias 와 LayerNorm·BatchNorm 의 scale·shift 파라미터에는 weight decay 를 걸지 않는 것이 흔한 관행이다. 이 파라미터들은 수가 적어 overfitting 에 미치는 영향이 작고, 0 쪽으로 당기면 정규화 층이 내보내는 값의 크기와 위치만 바뀐다.

# References

- Ilya Loshchilov, Frank Hutter, "[Decoupled Weight Decay Regularization](https://arxiv.org/abs/1711.05101)", ICLR 2019.
