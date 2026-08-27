---
tags: ["activation_function"]
---

# A) ReLU Function ?

![[img-e4677b4a55.png]]

$$
f(x)=\{\begin{array}{ll}0&\text{for}x\leq0\\x&\text{for}x>0\end{array}=\max\{0,x\}
$$

요즘에 ReLU 를 많이 쓰지 않는 것 같아요. GeLU 와 SiLU 와 같은 non-ReLU 계열들이 더 빠른 convergence 를 가지고 성능 측면에서도 좋다는 결과들이 많이 등장했기 때문입니다.

* 미분값
	* $\displaystyle f^{\prime}(x)=\{\begin{array}{ll}0&\text{for}x\leq0\\1&\text{for}x>0\end{array}.$
		* 원래는 $x=0$ 에서 undefined 이긴 한데, 그냥 $0$ 또는 $1$ 로 쳐준다.

# B) 장점

ReLU 는 non-ReLU 계열들과 다르게 activation sparsity 가 높습니다. pre-activation value 가 음수면 모두 0 으로 보내버리니 당연하겠죠? Activation sparsity 가 높으면 학습 및 추론에서 연산량을 줄일 수 있기 때문에 효율적입니다.

[ReLU Strikes Back: Exploiting Activation Sparsity in Large Language Models](https://arxiv.org/abs/2310.04564)

scaling law 에서 얘기하는 바처럼 충분히 많은 데이터로 큰 모델을 학습할 때는 activation function 의 종류는 큰 영향을 주지 못한다고 말합니다.

# C) 단점

* $x$ 가 음수일 때, 미분값이 0 이므로 학습이 느려질 수 있다.
	* 이 현상을 완화하기 위해 [[Leaky ReLU Function]] 을 사용한다.
* 하지만 실제로는 대부분의 $x$ 값들은 $0$ 보다 충분히 커서 학습이 상당히 빠르게 이루어 질 수 있다.

# D) References
