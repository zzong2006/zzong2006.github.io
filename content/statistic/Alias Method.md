---
tags: ["statistic"]
---

# A) Why We Need the Alias Method?

어떤 노드 $s$ 에서 가중치 (routing probability) 를 고려하며 이웃 노드 를 선택하는 방법은 [[random walk]] 에서 중요한 문제다. 이 문제를 다르게 해석한다면 집합 $S$ 의 원소들, 즉, 각 간선 $e\in S$ 에 대한 routing probability $r(e)$ 를 고려하여 $S$ 중 하나의 $e$ 를 선택하는 것이다 ($\sum_{e\in S}r(e)=1$).

위 문제를 해결하는 가장 간단한 방법은 다음과 같다.

* $z\in[0,1]$ 에 속하는 임의의 숫자를 선택한 뒤, 가장 큰 $z^{1/r(e)}$ 값을 가지고 있는 원소 $e$ 를 $S$ 로 부터 선택하면 되는 것이다.
* 결과적으로, 이러한 접근의 시간 복잡도는 $O(|S|)$ 가 요구된다.
* 하지만 모든 그래프의 간선 개수가 동일하지는 않기 때문에, 이러한 접근 방법은 처리 시간에서 큰 불균형을 발생시킨다.

그래서 `[1]` 에 나오는 Alias Method 를 사용한다.

# B) Alias Method ?

이 방법은 각 $e\in S$ 에 대하여 모든 switch probability $p(e)\in[0,1]$ 그리고 alias $a(e)\in S$ 를 미리 계산한다.
이후, 매 Random Walk 를 수행할 때, 이 두 테이블 $p(e),a(e)$ 을 활용하여 $O(1)$ 의 시간 복잡도로 가중치를 고려하며 선택할 수 있다.

# C) Alias Method 진행 과정

* Alias Method 는 크게 두 가지 과정을 거친다.
	* Build phase: alias 와 switch probability 테이블을 생성한다.
	* Selection phase: 생성된 테이블을 기반으로 sampling 을 수행한다.

## C.1) Build Phase

* 아래와 그림 같이 네개의 모두 다른 확률들이 존재한다고 가정하자.
 ![[img-bde2243d9f.png]]

이 확률을 모두 더하면 1 이다.

* Alias method 는 서로 다른 discrete 확률 분포를 모두 1 로 uniform 하게 만든다.
	* 그러기 위해선, 일단 모든 확률에 전체 확률 개수를 곱한 다음 (그림에서는 4), 이후 각 확률이 모 두 1 이 되도록 각 확률을 잘라내서 (?) 다른 확률에 붙여준다.
	* 이렇게 하면 반드시 각 확률마다 최대 2 개 의 확률이 하나의 확률에 공존하게 된다.
* Switch probability 테이블은 전체 확률 1 중에서 원래 확률이 차지하고 있던 확률을 나타내는 것이다.
* 그리고 Alias 테이블은 원래 확률이 아닌 붙여진 (?) 확률을 나타낸다.

## C.2) Selection Phase

* 이렇게 alias 와 switch probability 를 미리 계산했다면, 가중치를 고려한 원소 선택은 아주 쉽다.
* 전체 선택 과정

	1. 우선, 임의의 원소 $e'$ 를 $1/|S|$ 의 확률로 선택한다 (무작위 확률).
	2. 그리고 임의의 실수값 $p_t\in[0,1]$ 를 생성한다.
	3. 만약, $p_{t}\leq p\left(e^{\prime}\right)$ 이라면, 그 원소를 선택한다 ($e=e'$).
	4. 그렇지 않은 경우, $e'$ 가 가리키는 alias 를 원소로 선택한다 ($e=a(e')$).

* 이러한 이분적 선택으로 가중치를 고려하는 것이 가능한 이유는 위에서 언급했지만 최대 두개의 확률이 한 확률 1 에 존재할 수 있기 때문이다.
	* 그리고, 수학적으로 얘기하자면 $S$ 에서 $e$ 를 선택하는 확률은 다음과 같이 계산된다.
	* $\displaystyle\frac{1}{|S|}\cdotp(e)+\sum_{e^{\prime}\in S\wedge a\left(e^{\prime}\right)=e}\frac{1}{|S|}\cdot\left(1-p\left(e^{\prime}\right)\right)=r(e)$

# D) Algorithms

<img src="https://i.imgur.com/3zXJZof.png" width="80%">

* 이 알고리즘은 alias 와 switch probability 테이블을 만드는 알고리즘이다.
* 실제 구현에서는 조금 차이가 있는데, 그것은 `while` 의 조건문에서 $S^l$ 뿐만 아니라 $S^s$ 도 비어있는지 확인해야 한다는 것이다.
* 원래대로라면 $S^l$ 만 고려해도 되지만, double/float precision 문제로 종종 모든 원소 $e\in S$ 의 확률을 정확히 `1` 로 만들 수 없다.
	* 그렇기에 $S^l$ 가 비어버리기 전에 $S^s$ 가 먼저 비어버리는 현상이 나타난다.
	* 하지만 이러한 문제가 나타나도 그 확률차이는 (e.g. `1` 이나 `1.000001` 이나) 거의 없기 때문에 무시하고 알고리즘 구현을 마무리하면 된다.

# E) Alias Method 의 문제점

* 실제로 이 방법을 구현하게 되면, 기존 가중치를 고려하는 방식보다 간선 개수만큼 공간 복잡도가 더 요구된다는 문제가 있는데, 간선이 많아지면 [[Alias Method]] 는 많은 저장 공간을 요구하게 된다.
* 그래서 시간 복잡도를 약간 희생하는 대신, 공간 복잡도를 절약하는 방법을 제안하는데, 이를 alias tree 라 부른다.
* 자세한 내용은 [2] 를 참조한다. 여기에 alias method 에 대한 설명도 같이 들어있다.
		- [2] https://arxiv.org/pdf/1903.11749.pdf

# F) References

[1] A Linear Algorithm For Generating Random Numbers With a Given Distribution

# H) References
