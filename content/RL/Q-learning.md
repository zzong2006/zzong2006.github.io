---
tags: ["reinforcement_learning"]
---

# A) Q-learning ?

Q-Learning 은 model-free 강화 학습 알고리즘이다. 환경에 대한 모델이 필요없다는 점에서 model-free 라는 prefix 가 붙었다.

또 Q-Learning 을 부르는 다른 이름은 off-policy [[temporal difference]] Control 이다. off-policy 라 불리는 이유는 exploitation 을 위한 greedy policy 가 하나 있고, exploration 을 위한 $\varepsilon$-greedy 와 같은 또 다른 policy 가 존재하기 때문이다.

$Q$ 에서 유도되는 policy 에 상관없이 $\underset{a}{\mathrm{max}}\ Q(S_{t+1},a)$ 를 통해서 최적의 [[action-value function]] 를 통해 $Q$ 를 update 한다.

## A.1) Algorithm

state-action 조합에 대한 quality(q-value) 를 저장하고 있는 함수를 사용한다.

$$
Q: S \times A \rightarrow \mathbb{R}
$$

학습을 시작하기 전에, $Q$ 값은 임의로 초기화된다. 그리고 각 time $t$ 마다 action $a_t$ 을 선택하고 reward $r_t$ 를 받은 뒤, 새로운 state $s_{t+1}$ 로 진입한다. 이후 $Q$ 값을 업데이트 하게된다.

### A.1.1) Core

알고리즘의 핵심은 [[value iteration]] update 인 [[Bellman Equation]] 에 있는데, 식은 아래와 같다 ([[Incremental Implementation]] 참조).

![](https://i.imgur.com/oqH1cHJ.png)

위 식을 풀었을 때, $Q^{n e w}\left(s_{t}, a_{t}\right)$ 값은 세 요소에 대한 합으로 생각할 수 있다.

1. $(1-\alpha) Q\left(s_{t}, a_{t}\right)$: learning rate 에 의해 가중된 현재 값을 의미한다. learning rate $\alpha$ 가 $1$ 에 가까울 수록 $Q$ 값은 더욱 빠르게 변한다.
2. $\alpha r_t$ : $s_t$ 에서 $a_t$ 를 선택했을 때 얻어지는 보상값 $r_{t}=r\left(s_{t}, a_{t}\right)$. 이 값도 $\alpha$ 에 의해 가중된다.
3. $\alpha \gamma \max _{a} Q\left(s_{t+1}, a\right)$: state $s_{t+1}$ 로 부터 얻어지는 최대 reward

모든 마지막 state $s_f$ 의 $Q\left(s_{f}, a\right)$ 값은 절대 업데이트 하지 않고, 일반적으로 $0$ 값으로 설정한다.

### A.1.2) Figures

**algorithm**

![[img-fe468d670e.png|image-20201023175619321]]

**Diagram (vs. [[SARSA]])**

![[img-1fb388ed3e.png|image-20201023180629700]]

# B) Double Q-learning

기존 Q-learning 은 동일한 Q 함수를 통해 평가와 행동 선택을 진행하므로 종종 action value 에 대한 과추정을 하여 학습 속도를 느리게한다.

Double Q-Learning 은 이러한 이슈를 해소하기 위한 방법으로, 평가와 행동 선택을 서로 다른 policy 를 통해 수행한다.

두 policy $Q^{A}$ 와 $Q^{B}$ 를 학습하는 방법은 아래와 같다. 식을 보면 $Q^{A}$ 의 입장에서 봤을때 행동 선택은 $Q^{A}$ 의 값을 기반으로 진행하고 ($a' \doteq \arg \underset{a}{\max } Q_{t}^{A}\left(s_{t+1}, a\right)$), 그 행동에 따른 value 평가는 $Q^{B}$ 에서 수행하여 ($Q_{t}^{B}\left(s_{t+1}, a' \right)$), $Q^{A}$ 업데이트 식에 활용하게 된다.

![](https://i.imgur.com/Vw0Q9aV.png)

# C) Related

* [[value-based method]]

# D) References
