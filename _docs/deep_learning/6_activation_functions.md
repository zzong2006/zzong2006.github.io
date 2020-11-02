---
layout: default
title:  "Activation Functions"
category: Deep Learning
order: 6
---

## Non-Linear Activation의 사용 이유 

비선형 activation 함수를 사용하지 않는다면, 신경망에 아무리 많은 layer들을 사용해도, 그냥 입,출력 레이어만 붙어있는 네트워크와 다를바가 없기 때문이다.

다음과 같은 신경망이 있다고 가정하자.

<img src="https://i.loli.net/2020/10/27/PxZ15jGEuCLT37w.png" alt="image-20201027184032421" style="zoom:50%;" />

$$
\begin{aligned}
&\text { Given } x:\\
&  z^{[1]}=W^{[1]} x+b^{[1]}\\
& a^{[1]}=z^{[1]} \quad \\
& z^{[2]}=W^{[2]} a^{[1]}+b^{[2]}\\
& a^{[2]}=z^{[2]} \quad \\
\end{aligned}
$$

보다시피 비선형 함수를 사용하지 않았다. 만약 $a^{[2]}$를 계산하면 어떻게 될까?

$$
\begin{aligned}
a^{[1]}&=z^{[1]}=W^{[1]} x+b^{[1]} \\
a^{[2]}&=z^{[2]}=W^{[2]} a^{[1]}+b^{[2]}\\
a^{[2]}&=W^{[2]} (W^{[1]} x+b^{[1]})+b^{[2]} \\
&=W^{[2]}W^{[1]}(x)+(W^{[2]}b^{[1]}+b^{[2]})\\
&=W'(x)+b'
\end{aligned}
$$

$a^{[2]}$ 는 하나의 계층과 다를바가 없다.

## Sigmoid Function

![Sigmoid function - Wikipedia](https://i.loli.net/2020/10/27/gLcjmKD4eCu7RVG.png)

$$
f(x)=\sigma(x)=\frac{1}{1+e^{-x}}
$$

미분값

*  $f^{\prime}(x)=f(x)(1-f(x))$



## Tangent hyperbolic function

<img src="https://i.loli.net/2020/10/27/CUX8z1NgRdrHeIt.png" alt="TANH function definition and online calculator" style="zoom:67%;" />

$$
f(x)=\tanh (x)=\frac{\left(e^{x}-e^{-x}\right)}{\left(e^{x}+e^{-x}\right)}
$$

미분값

* $f^{\prime}(x)=1-f(x)^{2}$

tanh 함수는 sigmoid function을 평행이동 시킨것이다. 

만약, activation function을 sigmoid 대신 tanh로 사용한다면, 거의 항상 sigmoid보다 좋은 성능을 보인다는 것이 증명되었다.

* 왜냐하면 최대 1, 최소 -1 값을 가지므로, tanh를 거친 값들의 평균값은 0에 가깝기 때문이다. (sigmoid는 평균값이 0.5에 가까움)
* 즉, 데이터를 원점으로 모으는 효과가 있으므로, 그 다음 layer의 학습이 더욱 쉽게 이루어지도록 한다.

하지만 출력층에서는 sigmoid를 쓰는게 좋다. 왜냐하면 출력값이 -1과 1사이므로 binary classification에 쉽게 사용될 수 없기 때문이다.

### Sigmoid 함수와 tanh 함수의 단점

두 함수 $f(x)$에서, $x$의 크기가 매우 크거나 작을 때, 미분값이 0에 매우 가깝게 나오므로 학습이 느려지는 현상을 보인다.

## Rectifier (ReLU function)

<img src="https://i.loli.net/2020/10/27/vyfGMXkse3i9YVS.png" alt="ReLu(Rectified Linear Unit)" style="zoom: 80%;" />

$$
f(x)=\left\{\begin{array}{ll}
0 & \text { for } x \leq 0 \\
x & \text { for } x>0
\end{array}=\max \{0, x\}\right.
$$

미분값

* $$f^{\prime}(x)=\{\begin{array}{ll}0 & \text { for } x \leq 0 \\ 1 & \text { for } x>0\end{array}.$$
  * 원래는 $x=0$에서 undefined 이긴한데, 그냥 0 또는 1로 쳐준다.

### ReLU 함수의 단점

$x$가 음수일 때, 미분값이 0이므로 학습이 느려질 수 있다. 이 현상을 완화하기 위해 Leaky ReLU function을 사용한다.

* 하지만 실제로는 대부분의 $x$값들은 0보다 충분히 커서 학습이 상당히 빠르게 이루어 질 수 있다.

## Leaky ReLU

![Explain Step / Threshold and Leaky ReLU Activation Functions | i2tutorials](https://i.loli.net/2020/10/27/vnuDHRzTCM2tXSd.png)
$$
f(x)=\left\{\begin{array}{ll}
\alpha *x & \text { for } x \leq 0 \\
x & \text { for } x>0
\end{array}=\max \{ \alpha *x, x\}\right.
$$
주로 $\alpha$값은 $0.01$이다. 