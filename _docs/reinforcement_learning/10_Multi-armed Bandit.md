---
layout: default
title:  "Multi-armed Bandit"
category: Reinforcement Learning
order: 0.9
---

Multi-armed Bandit은 어떤 슬롯머신이 어떤 수익률을 가지는지 모를 때, 탐색(Exploration)과 활용(Exploitation)을 적절히 사용하여 최적의 수익을 찾아내고자 하는 강화학습 알고리즘을 의미한다.

보상이 Stationary Reward를 가진다면, 즉 시간에 따라 변하지 않는다면, 모든 슬롯머신을 당겨보면서 가장 높은 평균 보상값을 주는 슬롯머신만 당기면 된다(Greedy 알고리즘). 

$$
Q_{t}(a) \doteq \frac{\text { sum of rewards when } a \text { taken prior to } t}{\text { number of times } a \text { taken prior to } t}=\frac{\sum_{i=1}^{t-1} R_{i} \cdot \mathbf{1}_{A_{i}=a}}{\sum_{i=1}^{t-1} \mathbf{1}_{A_{i}=a}}
$$

* 여기서 $Q_{t}(a)$ 는 action-value function으로, 시간 $t$ 에 action $a$를 취했을 때, 얻을 수 있는 보상의 평균값을 의미한다.
* Action-value function은 해당 action을 취했을 때 얻으려는 보상 $R$의 기대값과 최대한 동일하도록 유도하는 것이 목적이다.

$$
A_{t} \doteq \underset{a}{\arg \max } Q_{t}(a)
$$



## $\varepsilon$-Greedy

$\varepsilon$-Greedy 알고리즘은 $\varepsilon$ 확률로 가능한 모든 action들 중 하나를 동일한 확률로 임의 선택하는 것이다. 그 외에는 greedy 알고리즘과 동일하다.

![image-20201126164644237](https://i.loli.net/2020/11/26/HAvsq6Yy9hzUNBt.png)

* 위의 의사코드에서  $Q(A)$ 는 $Q_{t}(a) $ 와 같다. 그런데 어떻게 $$ Q(A)+\frac{1}{N(A)}[R-Q(A)] $$ 와 같은 식이 나오는가? 그 이유는 Incremental Implementation을 사용했기 때문이다.



### Incremental Implementation

$Q_n$ 는 action $a$ 를 $n-1$번 선택한 이후의 action value의 추정값을 의미한다.
$$
Q_{n} \doteq \frac{R_{1}+R_{2}+\cdots+R_{n-1}}{n-1}
$$
이 계산 방법을 실제로 구현하려면, 모든 보상값들을 전부 저장해야 하므로, 많은 메모리가 요구된다. 이러한 현상을 완화하기 위해 다음과 같은 수식이 유도된다.
$$
\begin{aligned}
Q_{n+1} &=\frac{1}{n} \sum_{i=1}^{n} R_{i} \\
&=\frac{1}{n}\left(R_{n}+\sum_{i=1}^{n-1} R_{i}\right) \\
&=\frac{1}{n}\left(R_{n}+(n-1) \frac{1}{n-1} \sum_{i=1}^{n-1} R_{i}\right) \\
&=\frac{1}{n}\left(R_{n}+(n-1) Q_{n}\right) \\
&=\frac{1}{n}\left(R_{n}+n Q_{n}-Q_{n}\right) \\
&=Q_{n}+\frac{1}{n}\left[R_{n}-Q_{n}\right]
\end{aligned}
$$

* $$   Q_{n}+\frac{1}{n}\left[R_{n}-Q_{n}\right]  $$ 는 다음과 같이 생각할 수 있다. 강화학습에서 정말 자주 나오는 form이므로, 확실히 기억하자.

$$
\text { NewEstimate } \leftarrow \text { OldEstimate }+\text { StepSize }[\text { Target }-\text { OldEstimate }]
$$



## Tracking a Nonstationary Problem  

지금까지 논의한 방법은 stationary한 bandit 의 경우에서 적절하지만,  reward가 시간에 따라서 변하는 경우는 적절하지 않다. 이런 경우, 최근 보상에 과거 보상보다 더 높은 가중치를 부여하는 것이 옳을 것이다.

가장 유명한 방법은 constant step-size parameter를 이용하는 것이다.
$$
Q_{n+1} \doteq Q_{n}+\alpha\left[R_{n}-Q_{n}\right]
$$

* 여기서 step size $\alpha \in(0,1]$ 는 상수다.

step size 크기를 time step에 따라 변화시키는 경우, 수렴성을 보장할 수 있는가? 100%의 확률로 수렴을 보장하기 위해서는 아래의 두 조건을 만족해야 한다.
$$
\sum_{n=1}^{\infty} \alpha_{n}(a)=\infty \quad \text { and } \quad \sum_{n=1}^{\infty} \alpha_{n}^{2}(a)<\infty
$$

* 왼쪽의 식은 step size가 충분히 커야됨을 의미하며, 오른쪽 식은 시간 간격이 감소하여 수렴할 만큼 충분히 작아짐을 의미한다.

$a_n(a)=1/n$의 경우 