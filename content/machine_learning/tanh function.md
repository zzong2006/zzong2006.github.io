---
tags: ["machine_learning", "deep_learning", "activation_function"]
aliases: ["tanh", "hyperbolic tangent"]
---

# A) Tanh Function ?

Tanh function 은 입력을 $[-1, 1]$ 범위로 압축하는 비선형 [[activation function]] 이다.

$$
\tanh(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}
$$

출력이 0을 중심으로 대칭이라 [[sigmoid function]] 보다 hidden representation 의 평균이 0에 가까워지기 쉽다. 그래서 예전 RNN 계열이나 gating 구조에서 자주 쓰였다.

# B) Gradient

Tanh 의 미분은 다음처럼 간단하다.

$$
\frac{d}{dx}\tanh(x) = 1 - \tanh^2(x)
$$

입력의 절댓값이 커지면 출력이 -1 또는 1에 가까워지고, gradient 는 0에 가까워진다. 이 saturation 때문에 깊은 신경망에서는 [[vanishing gradients]] 문제가 생길 수 있다.

# C) 어디서 쓰이나

[[Long Short-Term Memory|LSTM]] 과 [[Gated Recurrent Unit|GRU]] 에서는 candidate state 나 cell state 를 만들 때 tanh 를 자주 사용한다. 값의 범위를 제한해서 hidden state 가 지나치게 커지는 것을 막기 좋기 때문이다.

[[Gaussian Error Linear Units|GELU]] 는 정확한 계산이 비쌀 때 tanh 기반 근사식을 쓰기도 한다. 이 경우 tanh 는 activation 자체라기보다 계산을 빠르게 하는 smooth approximation 역할을 한다.

# D) ReLU 와 비교

| 함수 | 출력 범위 | 장점 | 주의점 |
| --- | --- | --- | --- |
| [[sigmoid function]] | 0~1 | 확률처럼 해석하기 쉬움 | 0 중심이 아니고 saturation 이 큼 |
| tanh | -1~1 | 0 중심 출력 | saturation 으로 gradient 가 작아짐 |
| [[ReLU function]] | 0~∞ | 양수 구간 gradient 가 단순함 | dead ReLU 가능성 |

