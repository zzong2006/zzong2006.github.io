---
title: "epsilon-greedy algorithm"
tags: ["reinforcement_learning", "algorithm", "MAB"]
aliases: ["epsilon-greedy"]
---

$\varepsilon$-Greedy 알고리즘은 $\varepsilon$ 확률로 가능한 모든 action 들 중 하나를 동일한 확률로 임의 선택하는 것이다.

그 외에는 greedy 알고리즘과 동일하다.

중심으로 부터 얼마나 떨어져 있는지 척도화한 부등식을 concentration inequality 라고 부른다.

ε-greedy 는 항상 empirical mean 이 좋은 arm 만 고르고, 나머지를 ε의 확률로 고르지만, 지금 empirical mean 이 크다고 해서 정말로 그 arm 이 늘 best 일거라고 확신할 수 없다.

왜냐하면, 매 시간마다 arm $i$ 에서 얻는 보상은 constant 가 아닌 특정 distribution 에서 draw 되는 random variable 이기 때문이다.

# A) Algorithm Figure

![[img-70525ccd56.png|image-20201126164644237]]

* 위의 의사코드에서 $Q(A)$ 는 $Q_{t}(a)$ 와 같다.

## A.1) QnA

Q1. 그런데 어떻게 $Q(A)+\frac{1}{N(A)}[R-Q(A)]$ 와 같은 식이 나오는가?

A1. 그 이유는 [[Incremental Implementation]] 을 사용했기 때문이다.

## A.2) Some Notes

 보상이 Stationary Reward 를 가진다면, 즉 시간에 따라 변하지 않는다면, 모든 슬롯머신을 당겨보면서 가장 높은 평균 보상값을 주는 슬롯머신만 당기면 된다 (Greedy 알고리즘).

	- $\displaystyle Q_{t}(a)\doteq\frac{\text{sum of rewards when} a \text{take n prior to}t}{\text{number of times}a\text{takenpriorto}t}=\frac{\sum_{i=1}^{t-1}R_{i}\cdot\mathbf{1}_{A_{i}=a}}{\sum_{i=1}^{t-1}\mathbf{1}_{A_{i}=a}}$

		- 여기서 $Q_{t}(a)$ 는 [[action-value function]]으로, 시간 $t$ 에 action $a$를 취했을 때, 얻을 수 있는 보상의 평균값을 의미한다.

		- [[action-value function]]은 해당 action을 취했을 때 얻으려는 보상 $R$의 기대값과 최대한 동일하도록 유도하는 것이 목적이다.

			- $A_{t}\doteq\underset{a}{\arg\max}Q_{t}(a)$

* Tracking a [[non-stationary]] Problem  
	* 지금까지 논의한 방법은 stationary 한 bandit 의 경우에서 적절하지만, reward 가 시간에 따라서 변하는 경우는 적절하지 않다.
	* 이런 경우, 최근 보상에 과거 보상보다 더 높은 가중치를 부여하는 것이 옳을 것이다.
	* 가장 유명한 방법은 constant step-size parameter 를 이용하는 것이다.
		* $Q_{n+1}\doteq Q_{n}+\alpha\left[R_{n}-Q_{n}\right]$
			* 여기서 step size $\alpha\in(0,1]$ 는 상수다.
			* step size 크기를 time step 에 따라 변화시키는 경우, 수렴성을 보장할 수 있는가?
				* 100% 의 확률로 수렴을 보장하기 위해서는 아래의 두 조건을 만족해야 한다.
				* $\displaystyle\sum_{n=1}^{\infty}\alpha_{n}(a)=\infty\quad\text{and}\quad\sum_{n=1}^{\infty}\alpha_{n}^{2}(a)<\infty$
					왼쪽의 식은 step size 가 충분히 커야됨을 의미하며,
오른쪽 식은 시간 간격이 감소하여 수렴할 만큼 충분히 작아짐을 의미한다.
* [[Exploration and Exploitation trade-off]]
* [[Multi-Armed Bandit]] 는 현실에 적용하기에는 풀어야 할 문제가 많아서 이를 [[recommendation_system/Recommendation System|RS]] 에 바로 사용할 수는 없다.
	* 일반적인 [[Multi-Armed Bandit]] 는 한 번에 하나의 슬롯머신만 시도할 수 있지만, 현실에서는 한 번에 여러 콘텐츠를 추천할 수 있으므로, 여러 슬롯머신을 시도하는 상황으로 문제를 바꾸어야 한다.
	* [[non-stationary]]: 콘텐츠 수명이나 트렌드 때문에 시간에 따라 반응률이 계속 변한다.
		* 심지어 같은 시간이라도 추천하는 위치에 따라 편향이 발생해 위치에 따라 반응률이 다르다.
	* 이론적인 MAB 는 슬롯머신을 시도할 때마다 결과를 바로 알 수 있지만, 현실에서는 추천 결과를 노출하자마자 사용자들이 반응하는 것이 아니므로 약간 지연된 결과를 얻는다.
		* 사용자로부터의 반응을 빠르게 수집해 반영할수록 높은 반응률을 얻을 수 있지만, 수집 속도를 빠르게 할수록 시스템 부하가 커지고 리소스가 증가됨므로, 추천 성능과 시스템 효율을 잘 조율하는 것이 중요하다.
* 특성
	* 일반적인 MAB 알고리즘들은 고정된 exploration space 에서 모든 arm 들이 동시에 initialize 되었다는 가정 하에서 optimal solution 에 수렴한다는 것이 이론적으로 증명되었지만, real-world 와 같이 exploration space 가 변하는 상황에서는 이러한 증명이 성립하지 않는다.

https://yjjo.tistory.com/41?category=982145 , http://sanghyukchun.github.io/96/
