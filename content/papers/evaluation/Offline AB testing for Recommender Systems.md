---
tags: ["evaluation", "hypothesis_test", "paper_review", "recommendation_system"]
---

# A) Notation

* 현재 production policy $\pi_p$ 그리고 test policy $\pi_t$
* $X$: contextual feature 에 대한 random variable
* $\pi(A\mid X)$ 는 action $A$ 에 대한 확률 분포

# B) Offline A/B Test

* 테스트를 수행하기 위해서는 behaviour policy 또는 logging policy $\pi_p$ 라고 불리는 것을 활용해 $n$ 개의 [[i.i.d.]] samples $\mathcal{S}_{n}=\left\{\left(x_{i},a_{i},r_{i}\right):i\in[n]\right\}$ 들을 셋팅한다.
* 테스트 수행의 목적은 새로운 policy $\pi_t$ 를 현재 시스템 $\pi_p$ 와 비교하는 것이다.
* $\hat{\mathcal{R}}\left(\mathcal{S}_{n}\right)$ 를 활용해서 $\mathbb{E}_{\pi_{p}}[R]$ 을 바로구할 수 있겠지만, $\pi_t$ 에서 얻은 데이터가 아무것도 없기 때문에 $\mathbb{E}_{\pi_{t}}[R]$ 를 직접적으로 추정할 순 없다.

policy $\pi$ 의 expected reward

$$
\mathbb{E}_{\pi_{p}}[R]=\mathbb{E}[R\mid A]\pi_{p}(A\mid X)\mathbb{P}(X)
$$

logging policy 로 얻은 reward 를 이용해서 target policy 의 expected reward 를 추정하는 방법이 [[importance sampling]] 또는 [[inverse propensity score]] 라고 불리는 방법이다.

# C) Related

# D) References

* https://arxiv.org/pdf/1801.07030.pdf
