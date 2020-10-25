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

$\overline{\mathrm{VE}}$ 를 사용하는 궁극적인 목표는 모든 $\mathbf{w}$에서 $\overline{\mathrm{VE}}\left(\mathbf{w}^{*}\right) \leq \overline{\mathrm{VE}}(\mathbf{w})$ 를 만족하는 weight vector $\mathbf{w}^{*}$ 를 찾는것이다.

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


$$
\hat{v}(s, \mathbf{w}) \doteq \mathbf{w}^{\top} \mathbf{x}(s) \doteq \sum_{i=1}^{d} w_{i} x_{i}(s)
$$


## Feature Construction for Linear Methods  



## Selecting Step-Size Parameters Manually  



## Nonlinear Function Approximation: Artificial Neural Networks



## Least-Squares TD  



## Memory-based Function Approximation  