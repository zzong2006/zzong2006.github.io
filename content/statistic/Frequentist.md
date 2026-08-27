---
tags: ["statistic"]
---

# A) Frequentist ?

통계 학파 중 하나로, Frequentist 와 [[Bayesian]] 학파가 존재한다.

Frequentist 들은 확률을 [[상대도수]] 로 정의한다. 그렇기 때문에 Frequentist 에서는 ==사건이 무한히 반복 가능해야한다==는 전제가 필수적이다.

The frequentist interpretation considers the relative frequencies ([[상대도수]]) of events of interest to the total number of events that occurred. The probability of an event is defined as the relative frequency of the event in the limit when one has infinite data.

# B) 예시

* 주사위 던지기를 통해 4 가 나올 확률을 알고 싶다고 하자.
* 주사위를 무한하게 던지면, $\frac{n_4}{N}$ 는 점점 $1/6$ 에 가까워진다. 여기서 $n_4$는 4가 나온 횟수, $N$은 전체 시행 횟수다.

# C) 문제점

* 세상에는 무한히 반복될 수 있는 사건만 존재하는 것이 아니다.
	* 2020 년까지 빙하가 녹을 확률을 알고 싶다면?
		* 이런 경우 사건은 단 한번 밖에 일어날 수 없기 때문에 전체 시행 횟수는 1 이 되고, 실제로 사건이 일어난 횟수는 0 또는 1 이 된다.
		* 녹을 확률은 $\frac{n_{\text{melt}}}{N}$ 가 된다.
		* 즉, 실제로 녹았을 경우 확률이 1, 녹지 않을 경우 확률이 0 이다.
* 이처럼 사건이 무한히 반복될 수 없을 때, [[Frequentist]] 의 View 는 우리의 상식과는 다른 답을 내놓는다.

# D) Frequentist vs. Bayesian

어떤 $N$ 개의 데이터를 기반으로 통계적으로 추론하고 싶은 것이 있다면, $N$ 의 값이 작을수록 베이지안 방식이 유리하다. 왜냐하면 [[prior]] 를 통해 추론의 불완전성을 보완해줄 수 있기 때문이다.

반대로 $N$ 이 점점 커질수록 두 방식의 추론 결과는 거의 차이가 없을 것이다. 이 경우는 좀 더 간단한 방식인 frequentist 의 방식을 주로 택하게 될 것이다.

그렇다면 빅데이터 시대에서는 frequentist 가 항상 유리할까? 그렇지만도 않다. 어떤 문제에 대해서 데이터의 수가 충분해지면, 그 문제를 더 깊게 파고들기 위해서 더 많은 데이터가 필요해진다. 예를 들어 투표 설문조사에서, 구 단위가 아니라 동 단위의 의견이 궁금할 때가 있을 것이다. 이런 경우 데이터 부족으로 베이지안 방식이 다시 유리해진다.

# E) References
