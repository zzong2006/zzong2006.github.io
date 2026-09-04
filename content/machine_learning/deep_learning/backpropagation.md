---
title: "backpropagation"
tags:
  - machine_learning
  - math
  - linear_algebra
  - calculus
  - deep_learning
aliases: ["back-propagation"]
---

# A) Backpropagation Algorithm

다음과 같은 일련의 방법으로 역전파 알고리즘이 진행된다.

1. input $x$ 을 통해 activation $a^1$ 을 계산
2. Feedforward: 신경망 layer $l = 2,3, …, L$ 에 대하여 $z^{l}=w^{l} a^{l-1}+b^{l}$ 그리고 $a^{l}=\sigma\left(z^{l}\right)$ 를 계산
3. 신경망 output 에 대한 Error vector $\delta^L$ 를 계산 $\delta^{L}=\nabla_{a} C \odot \sigma^{\prime}\left(z^{L}\right)$
4. Backpropagate the error: 신경망 layer $h=L-1, L-2, \ldots, 2$ 에 대하여 $\delta^{l}=\left(\left(w^{l+1}\right)^{T} \delta^{l+1}\right) \odot \sigma^{\prime}\left(z^{l}\right)$ 를 계산
5. Output: 주어진 cost function 에 대한 gradient 는 $\frac{\partial C}{\partial w_{j k}^{l}}=a_{k}^{l-1} \delta_{j}^{l}$ 그리고 $\frac{\partial C}{\partial b_{j}^{l}}=\delta_{j}^{l}$ 로 계산할 수 있다.  
위 과정에서 3–5 의 단계가 backward 과정이다. 해당 과정은 (3) 의 마지막 $L$ 번째 layer 의 error vector 를 구한 후, (4–5) 를 반복한다.

그리고 위 방식은 example 을 하나씩 처리하는 경우를 설명한 것인데, 실제로는 mini-batch 형식으로 진행되므로 matrix 계산이 필수적이다.

# B) The Equations of Backpropagation

신경망의 back-propagation 에는 총 4 가지 핵심 수식들이 존재한다. 역전파 알고리즘에 포함되어 있는 총 네가지 수식들을 정리해보자.

(1) [[cost function]] $C$ 에 대해서 [[neural network]] 의 마지막 $L$ 번째 layer 의 error $\delta^L$ 은 다음과 같이 정의된다.  

$$
\delta^{L}=\nabla_{a} C \odot \sigma^{\prime}\left(z^{L}\right)
$$

여기서 error $\delta_{j}^{l}$ 란, 신경망의 $l$ 번째 layer 가중치 합 $z_{j}^{l}=\sum_{k} w_{j k}^{l} a_{k}^{l-1}+b_{j}^{l}$ 에 대한 $C$ 의 변화량을 의미한다: $\displaystyle \delta_{j}^{l} \equiv \frac{\partial C}{\partial z_{j}^{l}}$ ($j$ 는 $l$ 번째 layer 의 $j$ 번째 neuron 을 의미). 그리고 $\nabla_{a} C$ 는 편미분 $\partial C / \partial a_{j}^{L}$ 를 원소로 가지는 [[gradient]] 를 의미한다.  
위 식은 [[activation function]] $\sigma$ 에 상관없이 항상 적용될 수 있는 식이다.

(2) 그리고 $l$ 번째 layer 의 error 를 $l+1$ 번째 layer 의 error 로 표현하면 다음과 같다.  

$$
\delta^{l}=\left(\left(w^{l+1}\right)^{T} \delta^{l+1}\right) \odot \sigma^{\prime}\left(z^{l}\right)
$$

이는 backward 방향인데, $l+1$ 번째 layer 의 error 가 가중치 곱을 통해 $l$ 번째 layer 로 흘러들어온다고 생각할 수 있다.

(3) 신경망의 bias 에 따른 $C$ 의 변화는 다음과 같이 표현할 수 있다.  

$$
\frac{\partial C}{\partial b_{j}^{l}}=\delta_{j}^{l}
$$

(4) 마지막으로 신경망의 weight 에 따른 $C$ 의 변화는 다음과 같이 표현된다.  

$$
\frac{\partial C}{\partial w_{j k}^{l}}=a_{k}^{l-1} \delta_{j}^{l}
$$

위 식은 $l-1$ 번째 layer 의 activation 값과 $l$ 번째 layer 의 error 를 곱하는 것으로, $\displaystyle \frac{\partial C}{\partial w}=a_{\text {in }} \delta_{\text {out }}$ 와 같이 표현할 수 있다.

## B.1) Proofs

위 네개의 수식들을 증명한다.

(1) [[chain rule (calculus)|chain rule]] 을 활용하여 증명한다.  

$$
\delta_{j}^{L}=\frac{\partial C}{\partial z_{j}^{L}}=\sum_{k} \frac{\partial C}{\partial a_{k}^{L}} \frac{\partial a_{k}^{L}}{\partial z_{j}^{L}}=\frac{\partial C}{\partial a_{j}^{L}} \frac{\partial a_{j}^{L}}{\partial z_{j}^{L}}=\frac{\partial C}{\partial a_{j}^{L}} \sigma^{\prime}\left(z_{j}^{L}\right)
$$

* sum notation 이 사라지는 이유는 $k$ 번째 뉴런에 대한 output activation $a_{k}^{L}$ 은 오직 $z^L_k$ 만 의존적이므로, $k=j$ 외에는 제외해도 괜찮기 때문이다.
* 마지막에서 $a$ 가 $\sigma'$ 로 바뀌는 이유는 $a_{j}^{l}=\sigma\left(z_{j}^{l}\right)$ 를 만족하기 때문이다. 참고로, $a_{j}^{l}=\sigma\left(\sum_{k} w_{j k}^{l} a_{k}^{l-1}+b_{j}^{l}\right)$ 이다.

(2) 역시 chain rule 을 활용하여 증명할 수 있다.  

$$
\delta_{j}^{l}=\frac{\partial C}{\partial z_{j}^{l}}=\sum_{k} \frac{\partial C}{\partial z_{k}^{l+1}} \frac{\partial z_{k}^{l+1}}{\partial z_{j}^{l}}=\sum_{k} \frac{\partial z_{k}^{l+1}}{\partial z_{j}^{l}} \delta_{k}^{l+1}
$$

마지막 $z_k^{l+1}$ 는 다음과 같이 풀어진다.  

$$
z_{k}^{l+1}=\sum_{j} w_{k j}^{l+1} a_{j}^{l}+b_{k}^{l+1}=\sum_{j} w_{k j}^{l+1} \sigma\left(z_{j}^{l}\right)+b_{k}^{l+1}
$$

이제 풀어진 식을 $z_j^l$ 에 대해서 미분하면 $\displaystyle \frac{\partial z_{k}^{l+1}}{\partial z_{j}^{l}}=w_{k j}^{l+1} \sigma^{\prime}\left(z_{j}^{l}\right)$ 를 얻는다. 그리고 이를 대입하면 $\delta_{j}^{l}=\sum_{k} w_{k j}^{l+1} \delta_{k}^{l+1} \sigma^{\prime}\left(z_{j}^{l}\right)$ 가 얻어진다.

(3)  

$$
\frac{\partial C}{\partial b_{j}^{l}}=\sum_{k} \frac{\partial C}{\partial z_{k}^{l}} \cdot \frac{\partial z_{k}^{l}}{\partial b_{j}^{l}}=\frac{\partial C}{\partial z_{j}^{l}}=\delta_{j}^{l}
$$

여기서 $z^l_k$ 는 $b^l_j$ 에 대해 미분하는 경우 $k=j$ 일 때 1, 그 외에는 0 이다.

(4)  

$$
\frac{\partial C}{\partial w_{j k}^{l}}=\sum_{m} \frac{\partial C}{\partial z_{m}^{l}} \cdot \frac{\partial z_{m}^{l}}{\partial w_{j k}^{l}}
$$

여기서 $\displaystyle z_{m}^{l}=\sum_{n} w_{m n}^{l} a_{n}^{l-1}+b_{m}^{l}$ 라고 한다면 $m=j, n=k$ 인 경우에만 $w_{jk}^l$ 에 대한 편미분 값이 $0$ 이 되지 않는다. 즉, 다음과 같다.  

$$
\frac{\partial C}{\partial w_{j k}^{l}}=\frac{\partial C}{\partial z_{j}^{l}} \cdot a_{k}^{l-1}=\delta_{j}^{l} a_{k}^{l-1}
$$

# C) Big Picture

Backpropagation 은 가중치 (또는 bias) 가 cost function $C$ 에 미치는 변화량의 모든 합을 계산한 것이다.

예를 들어, $w_{jk}^l$ 에 대한 $C$ 의 변화량은 해당 가중치에 변화를 줌으로써 영향을 미치게되는 모든 경우의 수 (path) 를 합한 것이다. 즉, 어떤 한 신경망 path 는 다음과 같이 계산될 수 있다.  

$$
\Delta C \approx \frac{\partial C}{\partial a_{m}^{L}} \frac{\partial a_{m}^{L}}{\partial a_{n}^{L-1}} \frac{\partial a_{n}^{L-1}}{\partial a_{p}^{L-2}} \ldots \frac{\partial a_{q}^{l+1}}{\partial a_{j}^{l}} \frac{\partial a_{j}^{l}}{\partial w_{j k}^{l}} \Delta w_{j k}^{l}
$$

그런데 이 path 말고도 다른 여러 경우의 수가 존재한다. 해당 수들을 모두 합하는 과정이 backpropagation 을 위한 계산을 수행한 것이다.  

$$
\Delta C \approx\frac{\partial C}{\partial w_{j k}^{l}}=\sum_{m n p \ldots q} \frac{\partial C}{\partial a_{m}^{L}} \frac{\partial a_{m}^{L}}{\partial a_{n}^{L-1}} \frac{\partial a_{n}^{L-1}}{\partial a_{p}^{L-2}} \ldots \frac{\partial a_{q}^{l+1}}{\partial a_{j}^{l}} \frac{\partial a_{j}^{l}}{\partial w_{j k}^{l}}
$$

![](https://i.imgur.com/C6CAYNQ.png)

# D) Related

[[computational graph]]

# E) References

* [[Probabilistic Machine Learning - An Introduction]]: 13.3 Backpropagation
* [[Neural Networks and Deep Learning]] ([link](http://neuralnetworksanddeeplearning.com/chap2.html#the_backpropagation_algorithm))
