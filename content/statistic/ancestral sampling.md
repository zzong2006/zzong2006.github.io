---
tags: ["sampling", "PGM"]
---

# Ancestral Sampling ?

[[graph/graphical model]] 에서 사용되는 sampling 방식으로, 어떤 $K$ 개의 노드 (variable) 이 존재할 때, 이에 대한 [[joint distribution]] $p\left(x_{1}, \ldots, x_{K}\right)$ 을 sampling 으로 구하는 방식을 의미한다.

각 노드는 자기보다 높은 순번의 노드 (부모 노드) 로 밖에 이어지지 않는다고 가정한다.

## 예시

초기에 $p\left(x_{1}\right)$ 분포에서 $\widehat{x}_1$ 를 샘플링 했다면, 그 다음은 [[conditional probability]] $p(x_2 \mid x_1)$ 로 $\widehat{x}_{2}$ 를 샘플링할 수 있다. 이를 $N$ 번 반복하면, joint probability $p(x_2, x_1)$ 에 대한 확률을 구할 수 있다.

더 깊은 노드를 포함한 확률 계산을 원한다면, $p(x_3 \mid x_2)$ 를 통해 $\widehat{x}_{3}$ 을 샘플링 하는 것을 고려해보자. 이 경우 $p(x_3, x_2, x_1)$ 을 계산할 수 있다.

# References

* PRML - 8.1.2
* https://www.cse.psu.edu/~rtc12/CSE586/lectures/samplingPart1.pdf
* https://www.reddit.com/r/deeplearning/comments/cgqpde/what_is_ancestral_sampling/
