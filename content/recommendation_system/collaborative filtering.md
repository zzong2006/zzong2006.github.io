---
tags: ["recommendation_system"]
aliases: ["CF"]
---

# A) Collaborative Filtering ?

collaborative filtering 추천은 사용자들의 콘텐츠 사용 패턴을 분석해 추천하는 방법이다.

* 콘텐츠 사용 패턴이 비슷한 사람들은 비슷한 선호를 가지고 있다고 가정하에 수행하는 방법이다.
* [[matrix factorization]]
	* [Alternative Least Square](https://www.notion.so/Alternative-Least-Square-46ed46182ab94ed982094a704b510436)
* Other CF methods
	* [[Word2Vec]] (스트림 데이터)
	* Personalized PageRank ([[PPR]], 그래프 데이터)
	* Belief Propagation, BP (그래프 데이터)
* Scalability
	* CF 를 실제 서비스에 적용할 때는 규모성을 반드시 고려해야 한다.
	* 사용자와 item 의 규모가 매우 크므로, 다음과 같은 방법으로 CF 알고리즘을 빠르게 하거나 최적화를 수행한다.
		* SIMD (Single Instruction Multiple Data) 또는 GPU 연산 사용
		* 음성 샘플링 (negative sampling)

# B) CF 장점 그리고 단점

✅ 장점

1. 클릭 등의 사용자 선호도를 알 수 있는 데이터를 직접 사용하므로, 다른 추천 방법론들과 비교했을 때 성능이 우수한 편이다.
2. 추천 결과가 친숙하다.

❎ 단점

1. 콜드 스타트 ([[cold-start]]) 문제가 존재한다.
	* 충분한 정보가 모이지 않은 경우, 사용자 또는 아이템에 대해 어떠한 추론도 이끌어낼 수 없는 현상
2. 인기 편향 (popularity bias) 문제가 존재한다.
	* 인기있는 콘텐츠만 추천 결과에 자주 노출되는 현상

[[implicit feedback]] CF

* CF 모델에 큰 영향을 주는 세 가지 요소
	* Interaction Encoder
		* 각 사용자와 아이템에 대한 embedding 을 학습하기 위해 사용하는 function
	* Loss Function
		* Pointwise loss function: binary [[cross-entropy]], [[machine_learning/mean squared error]]
		* Pairwise loss function: [[BPR - Bayesian Personalized Ranking from Implicit Feedback]]
	* Negative Sampling
		* informative negative samples
			* [[Reinforced Negative Sampling for Recommendation with Exposure Data]]
		* tackling the selection bias of implicit user feedback
			* [[Mixed Negative Sampling for Learning Two-tower Neural Networks in Recommendations]]

# C) Challenges

* sparsity
	* sparsity 를 줄이는 방법
		* 아이템 필터링
			* 노이즈 감소라는 추가적인 효과가 있음
		* 수집 기간 늘리기
* serving bias
	* implicit feedback 을 기반으로 할 경우, user 가 몇 번 클릭했는지에 대한 정보만 고려하고, 몇 번 노출되었는지에 대한 고려를 안하고 있기 때문에 발생하는 문제
	* 이러한 문제를 해결하기 위해 CF 모델 결과에 [[Multi-Armed Bandit]] 를 붙인다.

# D) [[memory-based CF]] Or Model-Based

 Collaborative Filtering 은 Memory-based 와 Model-based 로 나뉜다.

 나누는 기준은 parametric maching learning 을 사용하는 방법은 Model-based 라 할 수 있다.즉, Gradient Descent 와 같은 Optimization 방법으로 parameter 를 업데이트하는 방식이면

Model-based, 그렇지 않으면 Memory-based 이다.
