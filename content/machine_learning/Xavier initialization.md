---
tags: ["deep_learning"]
---

# A. Xavier Initialization ?

[[neural network]] 의 weight 초기화 방법

모든 layer $l$ 에 대해서 다음과 같이 weight 와 bias 값을 초기화  

$$
\begin{aligned}W^{[l]}&\sim\mathcal{N}\left(\mu=0,\sigma^{2}=\frac{1}{n^{[l-1]}}\right)\\b^{[l]}&=0\end{aligned}
$$

즉, layer $l$ 의 모든 weights 는 [[Gaussian distribution]] 에서 mean 이 $0$ 이고 variance 가 $\displaystyle\sigma^{2}=\frac{1}{n^{[l-1]}}$ 인 값을 sampling 한 것과 같다 ($n^{[l-1]}$ 는 $l-1$ layer 의 neuron 개수).

# B. Justification for Xavier Initialization

> 왜 학습이 잘될까?

* 읽다가 졸려서 못 읽겠어..

## B.1. Joto Matthe

# C. Related

# D. References

* https://www.deeplearning.ai/ai-notes/initialization/
