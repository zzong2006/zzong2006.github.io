---
layout: default
title:  "On-policy Prediction with Approximation"
category: Reinforcement Learning
order: 6
---

## Value-function Approximation

$s \mapsto u$

* 상태가 updated된 $s$ 의 추정 값이 update target인 $u$에 옮겨지는 것을 표기
* 예시
  * MC 의 value prediction: $S_{t} \mapsto G_{t}$
  * TD(0)의 update: $S_{t} \mapsto R_{t+1}+\gamma \hat{v}\left(S_{t+1}, \mathbf{w}_{t}\right)$
  * $n$-step update: $S_{t} \mapsto G_{t: t+n}$
  * DP의 policy evaluation: $s \mapsto \mathbb{E} _{\pi}[R _{t+1}+\gamma \hat{v}(S _{t+1}, \mathbf{w} _{t}) \mid S _{t}=s]$
    * $s$는 임의의 state (경험에 의한 $S_t$ 와 대비됨)

함수 근사의 개념으로 생각하면, $s \mapsto u$는 state $s$에 대한 추정값이 target $u$ 에 더 가까워져야 한다.

* 이것은 기계학습의 supervised learning이며, 실제로 $u$ 와 가까워 지는 경우 이를 function approximation이라 부른다.
  * 실제로,  supervised learning에 관련된 어떤 방법도 사용할 수 있다.
  * 하지만 모든 function approximation 방법이 강화 학습에 잘 맞는것은 아니다.

가장 적합한 방법은 non-stationary target functions(target functions이 시간에 따라 바뀌는 것)을 다를 수 있는 방법이다.

* 대표적인 예로, GPI를 통해 $q_\pi$를 학습하면서 $\pi$가 바뀌는 것을 생각해볼 수 있다.



## The Prediction Objective $(\overline{V E})$

표를 기반으로 한(tabular based) 학습에는 다음과 같은 특징이 있었다.

* 학습된 value function과 true value function이 같아질 수 있었다.
* 한 state에서의 update가 다른 state에 영향을 주지 않았다.

근사를 이용한 방법은 한 state의 update가 다른 state에 큰 영향을 주므로, 모든 state에 대해서 정확하게 가치를 추정하는 것은 불가능하다.

따라서, 각 state $s$에 더 신경을 기울일 것인지 명시해야 한다.

* 즉, 그 $s$의 error에 대해서 얼마나 많은 신경을 쓰고 있는지에 대한 state distribution $\mu(s) \ge 0, \sum_{s} \mu(s)=1$ 를 명시해야 한다.

이를 위한 Mean Squared Value Error $(\overline{\mathbf{V E}})$는 다음과 같의 정의된다.

$$
\overline{\mathrm{VE}}(\mathbf{w}) \doteq \sum_{s \in \mathcal{S}} \mu(s)\left[v_{\pi}(s)-\hat{v}(s, \mathbf{w})\right]^{2}
$$

* approximation value $\hat{v}(s, \mathbf{w})$ 와 true value $v_{\pi}(s)$ 의 차이 제곱을 의미
* state space 에 걸쳐 가중치 $\mu$를 할당함으로써, 자연스러운 목적 함수를 만든다.
  * $\mu(s)$ 는 종종 $s$에서 쓰여진 시간의 비율로 채택되며, on-policy에서는 on-policy distribution으로 불린다. 

$\overline{\mathrm{VE}}$ 를 사용하는 궁극적인 목표는 모든 $\mathbf{w}$에서 $\overline{\mathrm{VE}}(\mathbf{w}^{\ast}) \leq \overline{\mathrm{VE}}(\mathbf{w})$ 를 만족하는 weight vector $\mathbf{w}^{\ast}$ 를 찾는것이다.

* 일반적으로 선형 함수로는 종종 가능하나, 인공 신경망이나 decision tree에서는 거의 불가능하다.
  * 왜냐하면 복잡한 함수의 경우 local optimum에 빠질 수 있기 때문이다.



## Stochastic-gradient and Semi-gradient Methods  

Value prediction에서 function approximation을 위한 학습 방법 중 하나는 SGD, 즉, stochastic gradient descent를 기반으로 한다.

SGD 방법은 모든 function approximation 방식에서 굉장히 많이 사용되고, 특히 online 강화 학습에 적합하다.

gradient-descent 방법으로는 column vector $\mathbf{w} \doteq\left(w_{1}, w_{2}, \ldots, w_{d}\right)^{\top}$ 을 weight vector로 사용한다. 

* 매 time step $t=0,1,2,3, \ldots$마다 $\mathbf{w}$를 update하므로, $\mathbf{w}_{t}$를 사용한다.

$S_t$에서 $\pi$를 따랐을 때, 관측할 수 있는 true value에 대한 새로운 example $S_{t} \mapsto v_{\pi}\left(S_{t}\right)$ 을 관찰했다고 가정하자. 그리고 example에 포함된 $S_t$는 동일한 분포를 가진다고 가정하자.

위 example들을 이용하여 SGD를 적용하는 방법은 각 example에 대해 오차를 가장 많이 감소시키는 방향으로 weight vector를 조금씩 조정한다.

$$
\begin{aligned}
\mathbf{w}_{t+1} & \doteq \mathbf{w}_{t}-\frac{1}{2} \alpha \nabla\left[v_{\pi}\left(S_{t}\right)-\hat{v}\left(S_{t}, \mathbf{w}_{t}\right)\right]^{2} \\
&=\mathbf{w}_{t}+\alpha\left[v_{\pi}\left(S_{t}\right)-\hat{v}\left(S_{t}, \mathbf{w}_{t}\right)\right] \nabla \hat{v}\left(S_{t}, \mathbf{w}_{t}\right)
\end{aligned}
$$

* $\hat{v}(s, \mathbf{w})$ 는 모든 $s \in \mathcal{S}$ 에 대한 approximate value function이다.
* $\alpha$는 양(positive)의 step-size parameter를 나타낸다.
  * $\alpha$ 가 너무 크면 local minima에 빠질 확률이 높아진다.
*  $\nabla f(\mathbf{w})$는 $f(\mathbf{w})$의 partial derivatives를 나타낸다.
  * 이를 $\mathbf{w}$에 대한 gradient of $f$ 라고 표현한다.

$$
\nabla f(\mathbf{w}) \doteq\left(\frac{\partial f(\mathbf{w})}{\partial w_{1}}, \frac{\partial f(\mathbf{w})}{\partial w_{2}}, \ldots, \frac{\partial f(\mathbf{w})}{\partial w_{d}}\right)^{\top}
$$

$S_{t} \mapsto U_{t}$ 의 경우, 즉, $U_{t} \in \mathbb{R}$ 인, $t$번째 training example은 $v_{\pi}\left(S_{t}\right)$ 의 noisy한 버전일 수 있고, $\hat{v}$ 를 이용해서 업데이트 중인 bootstrapping target일 수 있다. 

* 어떤 case든, $v_{\pi}\left(S_{t}\right)$ 를 알 수 없으므로 정확하게 update하는 것은 불가능하다.
* 그래서, 위의 SGD 적용 식에 $v_{\pi}\left(S_{t}\right)$ 대신 $U_{t}$ 를 사용한다.

$$
\mathbf{w}_{t+1} \doteq \mathbf{w}_{t}+\alpha\left[U_{t}-\hat{v}\left(S_{t}, \mathbf{w}_{t}\right)\right] \nabla \hat{v}\left(S_{t}, \mathbf{w}_{t}\right)
$$

만약 $U_t$가 unbiased 추정 값이라면 (즉, $\mathbb{E}\left[U_{t} \mid S_{t}=s\right]=v_{\pi}(s)$) 라면, $\mathbf{w}_{t}$ 는 stochastic approximation conditions에 의해 local optimum으로 수렴되는 것이 보장되어 있다고 한다.

* MC target의 경우($U_{t} \doteq G_{t}$), $v_{\pi}\left(S_{t}\right)$ 의 unbiased 추정 값이므로, SGD를 통해 local optimum으로 수렴되는 것이 보장된다.

![image-20201025235459971](https://i.loli.net/2020/10/25/2vAoxDZ9Vt8RfaP.png)

MC 방법과 달리, $n$-step이나 DP target을 이용한 bootstrap 방법은 **semi-gradient method**라 불리는데, 그 이유는 weight vector $\mathbf{w}_t$를 변경하는 것이 추정값에 미치는 효과를 고려하지만 target에 미치는 효과는 무시하기 때문이다.

* 즉, bootstrap 방법은 target과 $\mathbf{w}_t$를 독립적으로 본다.

결과적으로, 올바른 수렴을 보장할 순 없지만, 에피소드가 완전히 끝나기 전에 학습이 가능하므로 continuous task에도 활용될 수 있고, 계산상으로 이점이 존재한다.

가장 대표적인 semi-gradient방법은 semi-gradient TD(0)로, $U_{t} \doteq R_{t+1}+\gamma \hat{v}\left(S_{t+1}, \mathbf{w}\right)$ 를 target으로 사용한다.

![image-20201026002249359](https://i.loli.net/2020/10/25/XKfgU8MICp7BJ2n.png)



## Linear Methods  

함수 근사(function approximation)에서 가장 중요하게 쓰이는 것이 linear function $\hat{v}(\cdot, \mathbf{w})$ 이다. 

모든 state $s$에 대한 실수 값 벡터 $\mathbf{x}(s) \doteq(x_{1}(s), x_{2}(s), \ldots, x_{d}(s))^{\top}$ 와 가중치 벡터 $\mathbf{w}$의 inner product로 linear function을 표현할 수 있다.

$$
\hat{v}(s, \mathbf{w}) \doteq \mathbf{w}^{\top} \mathbf{x}(s) \doteq \sum_{i=1}^{d} w_{i} x_{i}(s)
$$

$\mathbf{x}(s)$ 는 $s$ 를 표현하는 feature vector로 이루어져있다.

* $x_i(s)$를 하나의 feature로 본다.
* linear methods에서는 feature들은 basis functions으로 불리는데, 그 이유는 feature들이 근사 함수들의 집합에 대한 linear basis를 이루기 때문이다.
  * 즉, $d$ 차원의 feature vector들을 구성하는 것은 $d$ 개의 basis function들로 이루어진 집합을 선택하는 것과 같다.

linear function 근사도 SGD를 이용해서 update하면 된다. 이전의 SGD 식에 linear function을 적용하면 다음과 같다.
$$
\mathbf{w}_{t+1} \doteq \mathbf{w}_{t}+\alpha\left[U_{t}-\hat{v}\left(S_{t}, \mathbf{w}_{t}\right)\right] \mathbf{x}\left(S_{t}\right)
$$

* $\nabla \hat{v}(s, \mathbf{w})=\mathbf{x}(s)$

linear SGD는 상당히 간단해서 대부분의 수학적 분석에 자주 사용된다.

---

linear 를 이용하는 경우 오직 하나의 최적값만 존재하므로, local optimum이 보장된 방법의 경우 linear를 통해서 global optimum (또는 그 근처로) 수렴할 수 있다.

* 위에서 소개한 MC 수렴의 경우를 보았을 때, linear function 근사를 사용할 경우, 시간이 지나면서 $\alpha$가 조금씩 감소하면 global optimum으로 수렴한다.

TD(0)의 경우는 조금 다른데, 우선 SGD는 다음과 같이 전개된다.
$$
\begin{aligned}
\mathbf{w}_{t+1} & \doteq \mathbf{w}_{t}+\alpha\left(R_{t+1}+\gamma \mathbf{w}_{t}^{\top} \mathbf{x}_{t+1}-\mathbf{w}_{t}^{\top} \mathbf{x}_{t}\right) \mathbf{x}_{t} \\
&=\mathbf{w}_{t}+\alpha\left(R_{t+1} \mathbf{x}_{t}-\mathbf{x}_{t}\left(\mathbf{x}_{t}-\gamma \mathbf{x}_{t+1}\right)^{\top} \mathbf{w}_{t}\right)
\end{aligned}
$$

* 간단하게 $\mathbf{x}_{t}=\mathbf{x}\left(S_{t}\right)$ 로 표현했다.

그리고 학습을 하다보면, 주어진 임의의 $\mathbf{w}_{t}$ 에 대해서 next weight vector의 기대값은 다음과 같이 표현된다. 
$$
\mathbb{E}\left[\mathbf{w}_{t+1} \mid \mathbf{w}_{t}\right]=\mathbf{w}_{t}+\alpha\left(\mathbf{b}-\mathbf{A} \mathbf{w}_{t}\right)
$$

* $$
  \mathbf{b} \doteq \mathbb{E}\left[R_{t+1} \mathbf{x}_{t}\right] \in \mathbb{R}^{d} \quad \text { and } \quad \mathbf{A} \doteq \mathbb{E}\left[\mathbf{x}_{t}\left(\mathbf{x}_{t}-\gamma \mathbf{x}_{t+1}\right)^{\top}\right] \in \mathbb{R}^{d \times d}
  $$
  * 너무 어렵게 생각할 필요 없이 $\mathbf{b}$와 $\mathbf{A}$를 그냥 대입해보면 된다.

그리고 만약 linear semi-gradient TD(0)가 수렴한다고 하면, 다음과 같은 weight vector로 수렴한다고 한다. 증명은 생략한다.
$$
\begin{aligned}
\mathbf{b}-\mathbf{A} \mathbf{w}_{\mathrm{TD}} &=\mathbf{0} \\
\mathbf{b} &=\mathbf{A} \mathbf{w}_{\mathrm{TD}} \\
\mathbf{w}_{\mathrm{TD}} & \doteq \mathbf{A}^{-1} \mathbf{b}
\end{aligned}
$$
여기서 $\mathbf{w}_{\mathrm{TD}}$ 값을 TD fixed pointer라 부른다. 

### $n$-step semi-gradient TD

![image-20201026150428627](https://i.loli.net/2020/10/26/rb6oZqdWIgBUOpm.png)

위 알고리즘의 핵심은 다음과 같다.
$$
\mathbf{w}_{t+n} \doteq \mathbf{w}_{t+n-1}+\alpha\left[G_{t: t+n}-\hat{v}\left(S_{t}, \mathbf{w}_{t+n-1}\right)\right] \nabla \hat{v}\left(S_{t}, \mathbf{w}_{t+n-1}\right), \\ \quad 0 \leq t<T
$$
$n$-step은 아래와 같이 일반화될 수 있다.
$$
G_{t: t+n} \doteq R_{t+1}+\gamma R_{t+2}+\cdots+\gamma^{n-1} R_{t+n}+\gamma^{n} \hat{v}\left(S_{t+n}, \mathbf{w}_{t+n-1}\right), \\ \quad 0 \leq t \leq T-n
$$


## Feature Construction for Linear Methods  

### Polynomials  

두개의 좌표 시스템의 경우 아래와 같이 표현될 수 있음
$$
\mathbf{x}(s)= \left(s_{1}, s_{2}\right)^{\top}
$$
하지만 위 feature들은 작아서, 추가로 더 많은 feature들을 넣을 수 있음
$$
\mathbf{x}(s)=\left(1, s_{1}, s_{2}, s_{1} s_{2}\right)^{\top}
$$
더욱 많은 features (higher-dimensional)
$$
\mathbf{x}(s)=\left(1, s_{1}, s_{2}, s_{1} s_{2}, s_{1}^{2}, s_{2}^{2}, s_{1} s_{2}^{2}, s_{1}^{2} s_{2}, s_{1}^{2} s_{2}^{2}\right)^{\top}
$$


## Nonlinear Function Approximation: Artificial Neural Networks

activation function(logistic, ReLU,step etc.) 을 사용하는 ANN

![image-20201026163109913](https://i.loli.net/2020/10/26/MkUp94xGOCzJB1n.png)

backpropagation 알고리즘을 사용하여 partial derivative를 계산하여 학습

너무 네트워크기가 깊으면 (many hidden layers), overfitting의 문제가 발생함

Overfitting을 줄이기 위한 방법

1. Cross-validation: training data외의 validation data에 대하여 신경망 성능이 감소할 때 학습을 멈추는 방법
2. regularization: approximation의 complexity를 감소시킴 
3. weights들 사이에 dependency를 도입하는 방법
4. dropout 기법 : units 간 connections을 임의로 제거

Batch Normalization/ Deep residual learning을 이용하는 경우도 있음

* 이 둘의 방법은 alpha go 에서 사용됨

