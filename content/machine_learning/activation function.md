---
tags: ["machine_learning", "deep_learning"]
---

# A) Non-Linear Activation(비 선형 함수) 의 사용 이유

[[activation function]] 을 사용하지 않는다면, [[neural network]] 에 아무리 많은 layer 들을 사용해도, 그냥 입,출력 레이어만 붙어있는 네트워크와 다를바가 없기 때문이다.

예시: 다음과 같이 비 선형 함수를 사용하지 않는 신경망이 있다고 가정하자.  

![[img-a9c53fe8c7.png||500]]

## A.1.1) $x$ 가 주어질 때

* $z^{[1]}=W^{[1]}x+b^{[1]}$
* $a^{[1]}=z^{[1]}$  
* $z^{[2]}=W^{[2]}a^{[1]}+b^{[2]}$
* $a^{[2]}=z^{[2]}$

## A.1.2) 만약 $a^{[2]}$ 를 계산하면 어떻게 될까?

* $a^{[1]}=z^{[1]}=W^{[1]}x+b^{[1]}$
* $a^{[2]}=z^{[2]}=W^{[2]}a^{[1]}+b^{[2]}$
* $\begin{aligned}a^{[2]}&=W^{[2]}(W^{[1]}x+b^{[1]})+b^{[2]}\\&=W^{[2]}W^{[1]}(x)+(W^{[2]}b^{[1]}+b^{[2]})\\&=W'(x)+b'\end{aligned}$
* $a^{[2]}$ 는 하나의 layer 의 계산과 다를바가 없다.
* [[sigmoid function]] and [[tanh function]]
	* [[sigmoid function]] 함수와 [[tanh function]] 함수의 단점
		* 입력 데이터 $x$ 의 크기가 매우 크거나 작을 때, [[sigmoid function]] 과 [[tanh function]] 의 미분값이 $0$ 에 매우 가깝게 나오므로 학습이 느려지는 현상을 보인다.
* [[ReLU function]] and [[Leaky ReLU Function]]

# B) References
