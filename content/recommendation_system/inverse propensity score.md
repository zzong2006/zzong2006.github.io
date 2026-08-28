---
title: "inverse propensity score"
aliases: ["IPS", "propensity score"]
---

# A) 정의

[[Importance sampling]] 이라고 불리며, IPS 는 [[expectation]] 을 계산하고자 하는 확률 분포 $f(x)$ 의 [[Probability Density Function|PDF]] $p$ 를 알고있지만 샘플들을 생성하기 어려울 때, 비교적 쉬운 PDF 인 $q(x)$ 에서 샘플을 생성하여 $f$ 의 기댓값을 계산하는 방법이다.

## A.1) 추천 시스템 맥락에서의 정의

Logging policy $\pi_p$ 가 해당 action 을 선택할 확률을 기준으로 삼고, test policy $\pi_t$ 가 해당 action 을 선택할 확률을 상대적인 가중치로 활용하여 expected weighted reward 을 계산

$$
\displaystyle\hat{\mathcal{R}}^{\mathrm{IS}}\left(\pi_{t}\right)=\frac{1}{n}\sum_{(x,a,r)\in\mathcal{S}_{n}}w(a,x)r\quad\text{where}w(a,x)=\frac{\pi_{t}(a\mid x)}{\pi_{p}(a\mid x)}
$$

* $\pi_{p}(a\mid x)$: product(logging) policy $p$ 가 context $x$ 에서 action $a$ 를 선택할 확률
* $\pi_{t}(a\mid x)$: test policy $t$ 가 $a$ 를 선택할 확률

# B) 특징

1. $\pi(a\mid x)$ 를 구하는게 쉽지 않음
2. low bias and high variance
	* 특히 두 policy 가 다를 수록, $w(a,x)$ 가 크게 바뀌므로 variance 가 커짐
3. Low variance 를 위한 capped importance sampling

	$$


\displaystyle\hat{\mathcal{R}}^{\operatorname{maxCIS}}\left(\pi_{t},c\right)=\frac{1}{n}\sum_{(x,a,r)\in\mathcal{S}_{n}}\min(w(a,x),c)r

$$
	variance를 일부 제어할 수 있지만, capping에 의해 bias가 발생함
4. Condition
	- unbiased-ness the randomisation requirements for IPS
