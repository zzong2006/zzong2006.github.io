---
tags: ["sampling statistic"]
---

# Metropolis-Hasting ?

Metropolis-Hasting 알고리즘은 pdf $P(x)$ 에 해당하는 어떤 확률 분포 (a.k.a. a target distribution) 의 샘플링을 가능하게 해준다.

다만, 이 알고리즘은 $f(x)$ 를 활용하여 진행하는데, 이 함수는 반드시 $P(x)$ 와 비례해야 한다. 왜냐하면 $f(x)$ 를 통해 대신 계산하게 되면, $P(x)$ 를 직접 evaluate 하는 것 보다는 훨씬 계산량을 절약할 수 있기 때문이다.

## Sampling Algorithm

sampling 은 반복적으로 진행된다. 한번 샘플링하고 그 다음 샘플 (next sample) 의 분포는 오직 현재 샘플링된 값 (current sample) 에 의존적이다. 즉, [[Markov Chain]] 의 property 를 따른다. 다시 말하면, 현재 sample 값을 기준으로 다음 sample 값의 후보를 정한다.

일정 확률로 해당 후보는 accept 되거나 reject 된다. 여기서 해당 확률을 결정하는 것은 현재 $f(x)$ 의 값들과 후보 값들의 비교로 진행된다.

# 단점

The samples are correlated.

어떤 nearby samples 들은 서로 상관관계에 있기 때문에 제대로 분포를 반영할 수 없다.

만약 시작 지점의 지역이 매우 낮은 density 에 해당한다면, 초기 샘플들은 매우 다른 분포에서 생성될 수 있다. 결과적으로 burn-in 구간이 일반적으로 필요하며, 초기 일부 샘플들 (약 천개 정도) 가 버려진다.

# Related

# References
