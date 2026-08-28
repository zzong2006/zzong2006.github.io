---
title: "Incremental Implementation"
tags: ["reinforcement_learning", "algorithm"]
---

# A) Incremental Implementation ?

$Q_n$ 는 action $a$ 를 $n-1$ 번 선택한 이후의 [[action-value function]] 의 추정값을 의미한다.

$$
\displaystyle Q_{n}\doteq\frac{R_{1}+R_{2}+\cdots+R_{n-1}}{n-1}
$$

이 계산 방법을 실제로 구현하려면, 모든 보상값들을 전부 저장해야 하므로, 많은 메모리가 요구된다.

이러한 현상을 완화하기 위해 다음과 같은 수식이 유도된다.

$$
\begin{aligned}Q_{n+1}&=\frac{1}{n}\sum_{i=1}^{n}R_{i}\\&=\frac{1}{n}\left(R_{n}+\sum_{i=1}^{n-1}R_{i}\right)\\&=\frac{1}{n}\left(R_{n}+(n-1)\frac{1}{n-1}\sum_{i=1}^{n-1}R_{i}\right)\\&=\frac{1}{n}\left(R_{n}+(n-1)Q_{n}\right)\\&=\frac{1}{n}\left(R_{n}+nQ_{n}-Q_{n}\right)\\&=Q_{n}+\frac{1}{n}\left[R_{n}-Q_{n}\right]\end{aligned}
$$

$Q_{n}+\frac{1}{n}\left[R_{n}-Q_{n}\right]$ 는 다음과 같이 생각할 수 있다.

$$
\text{NewEstimate}\leftarrow\text{OldEstimate}+\text{StepSize}[\text{Target}-\text{OldEstimate}]
$$

* $[\text{Target}-\text{OldEstimate}]$ 는 estimation 의 오차로, 학습을 진행할수록 $0$ 에 가까워진다.
* 또한 StepSize $1/n=\alpha$ 는 수렴을 위해 $0 <\alpha < 1$ 사이를 만족해야 한다.

편의를 위해 $Q_{0} \triangleq 0$ 로 정의한다.

# B) References
