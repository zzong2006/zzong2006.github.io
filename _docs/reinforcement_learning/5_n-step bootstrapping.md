---

layout: default
title:  "N-step bootstrapping"
category: Reinforcement Learning
order: 5
---

## n-step TD Prediction  

MC는 에피소드가 끝날때까지 기다리다가 관측된 보상들의 전체 sequence를 기반으로 각 state의 update를 수행한다($\infty$-step). 

반면에, TD 방법은 단지 바로 다음 보상을 기반으로 state를 update한다($1$-step). 

![image-20201025184132084](https://i.loli.net/2020/10/25/7TwU8BuQc1n9iPK.png)

$n$-step 방식도 여전히 TD 방식이다. 왜냐하면 이후(later) 추정값과 이전(earlier)의 차이를 이용하여 update를 수행하기 때문이다.

* 다만, 이후 추정값이 1-step이 아니라 $n$-step인 점이 다르다.

---

Formal하게 설명하기 위해서, $S_t$에서 시작하여 에피소드의 마지막 state $S_T$까지 수행한 state-reward sequence가 있다고 생각해보자.

* $S_{t}, R_{t+1}, S_{t+1}, R_{t+2}, \ldots, R_{T}, S_{T}$ (Action 제외)

그러면 MC의 경우 $v_\pi(S_t)$의 추정값은 다음과 같은 complete return값을 이용한다.

$$
G_{t} \doteq R_{t+1}+\gamma R_{t+2}+\gamma^{2} R_{t+3}+\cdots+\gamma^{T-t-1} R_{T}
$$

반면, one-step TD 방식은 최초의 reward와 discount된 next state의 추정 값을 이용한다.

$$
G_{t: t+1} \doteq R_{t+1}+\gamma V_{t}\left(S_{t+1}\right)
$$

* 위 값 $G_{t:t+1}$을 one-step return이라 부르기로 한다.

사실 생각해보면 $G_{t:t+1}$는 $G_t$에서 $\gamma R_{t+2}+\gamma^{2} R_{t+3}+\cdots+\gamma^{T-t-1} R_{T}$ 부분을 $\gamma V_{t}\left(S_{t+1}\right)$ 로 만든것 밖에 없다.

이제 이러한 공통점을 활용하여 two-step return을 생각해보면 다음과 같다.

$$
G_{t: t+2} \doteq R_{t+1}+\gamma R_{t+2}+\gamma^{2} V_{t+1}\left(S_{t+2}\right)
$$

* 여기서는 $\gamma^{2} R_{t+3}+\cdots+\gamma^{T-t-1} R_{T}$ 가 $\gamma^{2} V_{t+1}\left(S_{t+2}\right)$ 로 치환되었다.

더 확장해서, $n$-step return은 다음과 같다.

$$
G_{t: t+n} \doteq R_{t+1}+\gamma R_{t+2}+\cdots+\gamma^{n-1} R_{t+n}+\gamma^{n} V_{t+n-1}\left(S_{t+n}\right)
$$

* for all $n, t$ such that $n \geq 1$ and $0 \leq t<T-n$
* 만약, $n$-step return값이 에피소드 종료 이후까지 포함하는 경우라면($t+n \ge T$ ), 이후에 관련된 값은 모두 $0$으로 처리함
  * $G_{t: t+n} \doteq G_{t}$ if $t+n \geq T$

$t$에서 시작하여 $n$-step returns을 계산할 수 있는 time은 $t+n$이다. 이러한 점을 활용하여 고안된 $n$-step TD의 natural algorithm은 다음과 같다.

$$
V_{t+n}\left(S_{t}\right) \doteq V_{t+n-1}\left(S_{t}\right)+\alpha\left[G_{t: t+n}-V_{t+n-1}\left(S_{t}\right)\right], \quad 0 \leq t<T
$$

$n$-step return 값은 $V_{t+n-1}$을 이용하여 $R_{t+n}$ 이후의 값을 표현하는데, 이는 $n$-step return의 error reduction 성질을 활용한 것이다.

### Error reduction property

Error reduction property란, $n$-step return의 중요한 특성으로, return의 기대값이 적어도 $V_{t+n-1}$ 보다 $v_\pi$를 추정하는데 있어서 더 좋다는 것이다.

이를 식으로 표현하면 아래와 같다.

$$
\max _{s}\left|\mathbb{E}_{\pi}\left[G_{t: t+n} \mid S_{t}=s\right]-v_{\pi}(s)\right| \leq \gamma^{n} \max _{s}\left|V_{t+n-1}(s)-v_{\pi}(s)\right|
$$

* 간단히 생각하면, $G_{t:t+n}$과 $V_{t+n-1}$ 간 $v_\pi(s)$에 대한 최대 오차를 비교하는 식이다.
* 이 성질을 통해 $n$-step TD 방법이 올바른 predictions으로 수렴한다는 것을 보장할 수 있다.

![image-20201025190205743](https://i.loli.net/2020/10/25/pvSbzDCksGxoyEP.png)



## n-step SARSA

이제 prediction 말고 control에도 $n$-step 방법을 적용해보자.

* 이전에 소개한 SARSA는 짐작했겠지만, $1$-step SARSA 또는 SARSA(0)라고 불린다.

핵심은 states를 action 값(state-action)으로 바꾸고, $\varepsilon$-greedy policy를 사용하는 것이다. 

![image-20201025200848764](https://i.loli.net/2020/10/25/VFI7ohBcfkYrvyR.png)



state를 action으로 바꾼 $n$-step return은 다음과 같다.

$$
G_{t: t+n} \doteq R_{t+1}+\gamma R_{t+2}+\cdots+\gamma^{n-1} R_{t+n}+\gamma^{n} Q_{t+n-1}\left(S_{t+n}, A_{t+n}\right), \\
 \quad n \geq 1,0 \leq t<T-n
$$

* 위 식에서도 $n$ step이 에피소드 끝을 넘어가면 그 값은 0이 된다.
  * $G_{t: t+n} \doteq G_{t}$ if $t+n \geq T$

$n$-step SARSA의 natural algorithm은 다음과 같다.

$$
Q_{t+n}\left(S_{t}, A_{t}\right) \doteq Q_{t+n-1}\left(S_{t}, A_{t}\right)+\alpha\left[G_{t: t+n}-Q_{t+n-1}\left(S_{t}, A_{t}\right)\right],\\ \quad 0 \leq t<T
$$


![image-20201025200443586](https://i.loli.net/2020/10/25/KfvZNDzGmQ1RI8y.png)

### $n$-step SARSA vs $1$-step SARSA 비교

![image-20201025202546376](https://i.loli.net/2020/10/25/CbWe2O8yYJiDEPs.png)

위 그림에서 G에만 reward가 1이고 나머지가 0인경우, $1$-step SARSA의 경우 G에 접근하는 마지막 action에만 영향을 주고, $n$-step SARSA의 경우 G에 접근하는 $n$개의 action에 영향을 준다. 즉, 한 에피소드에서 더 많은것을 배울 수 있다.

### $n$-step version of Expected SARSA

$n$-step SARSA의 $n$-step return값을 조금만 수정해주면 된다.

$$
G_{t: t+n} \doteq R_{t+1}+\cdots+\gamma^{n-1} R_{t+n}+\gamma^{n} \bar{V}_{t+n-1}\left(S_{t+n}\right), \quad t+n<T
$$

* 당연히 $G_{t: t+n} \doteq G_{t}$ for $t+n \geq T$ 이다.
* $\bar{V}_{t+n-1}$ 은 $t$와 $s$에서 수행될 수 있는 action들의 Expected approximate value로, 다음과 같이 계산된다.
  * $\bar{V}_{t}(s) \doteq \sum_{a} \pi(a \mid s) Q_{t}(s, a), \quad$ for all $s \in \mathcal{S}$



## n-step Off-policy Learning  

Off-policy는 value function을 학습하는 policy $\pi$와 또 다른 policy $b$를 활용하는 학습 방법임을 기억하자.

* 주로, $\pi$는 greedy policy 그리고, $b$는 $\varepsilon$-greedy로 표현될 수 있다.

두 policies의 차이를 $b$에서 얻어지는 데이터로 설명하려면, actions에 대한 relative probability를 알아야 한다.

* $n$-step 방법에는 $n$-steps에 대하여 returns을 계산하므로, $n$ action들에 대한 relative probability를 계산해야한다.

간단한 off-policy 버전의 $n$-step TD는 다음과 같다.

$$
V_{t+n}\left(S_{t}\right) \doteq V_{t+n-1}\left(S_{t}\right)+\alpha \rho_{t: t+n-1}\left[G_{t: t+n}-V_{t+n-1}\left(S_{t}\right)\right],  \quad 0 \leq t<T
$$

* 여기서 $\rho_{t: t+n-1}$ 는 importance sampling ratio(i.s.r.)를 의미한다.

  * $A_t$ 부터 $A_{t+n-1}$ 까지 $n$ 개의 actions을 취할 때, 두 policies 간 relative probability를 의미한다.

  * $$
    \rho_{t: h} \doteq \prod_{k=t}^{\min (h, T-1)} \frac{\pi\left(A_{k} \mid S_{k}\right)}{b\left(A_{k} \mid S_{k}\right)}
    $$

만약 $\pi$에 의해서 수행될 수 없는 action이라면 (i.e., $\pi\left(A_{k} \mid S_{k}\right)=0$), i.s.r. 는 0이 될것이고, 완전히 무시되는 결과를 낳는다.

* 반대로, 그 action에 대한 확률이 $b$보다 많이 크다면 i.s.r.는 큰 weight이 될 것이다.

만약 $\pi$와 $b$가 서로 같다면, i.s.r. 값은 항상 1이 될것이고, 결과적으로 on-policy $n$-step TD 와 같은 식이 만들어진다.

비슷하게, $n$-step SARSA도 off-policy로 수정될 수 있다.

$$
Q_{t+n}\left(S_{t}, A_{t}\right) \doteq Q_{t+n-1}\left(S_{t}, A_{t}\right)+\alpha \cdot \rho_{t+1: t+n}\left[G_{t: t+n}-Q_{t+n-1}\left(S_{t}, A_{t}\right)\right]
$$

* for $0\le t<T$

* 위 식에서 $\rho_{t+1: t+n}$ 는 $Q_{t+n-1}\left(S_{t}, A_{t}\right)$ 보다 1 step 이후로 계산되는 것을 확인하자 ($t+n$  그리고 $t+n-1$).
  * 그 이유는 policy control를 위해서 state말고, action-state 쌍을 다루고 있기 때문이다.
  * 즉, $t$은 이미 일어난 일이고, 이후 $t+1$부터 $t+n$까지 $n$-step을 밟으므로 , 해당 step들에 대해서만 학습을 하고자 하는 것이다.

![image-20201025210716454](https://i.loli.net/2020/10/25/ndpjBO6Z1EtTHNs.png)