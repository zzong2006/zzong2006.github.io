---
title: "Hidden Markov Model과 추천"
---


# A) Hidden Markov Model 과 추천

## A.1) Hidden Markov Model (HMM) 기초

### A.1.1) HMM 구조

* **Discrete state space**를 가지며, 두 가지 주요 parameter 가 존재합니다:
	* **Transition probability**:
		* 각 시간 $t$ 에서 은닉 변수는 $N$ 개의 가능한 상태를 가질 수 있으며, 시간 $t+1$ 에는 이 상태들로 전이할 확률이 있습니다.
		* 이러한 확률은 $N^2$ 개의 전이 확률로 표현됩니다.
		* 한 상태의 전이 확률의 합은 항상 1 이어야 하며, 따라서 $N\times N$ 전이 확률 행렬은 마르코프 행렬입니다.
	* **Emission probability**

### A.1.2) 항아리 문제를 이용한 설명

 ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FBc0BresMWt.png?alt=media&token=5eecd656-0d59-4b54-bd5d-c59b333a58c0)

* 방 안에 요정과 항아리 $X_{1},X_{2},X_{3}$(states) 가 있습니다.
* 각 항아리에는 이름 붙여진 공 (observations) 들이 섞여 들어가 있습니다.
* 요정은 무작위로 항아리를 선택하고, 그 안에서 공을 하나 꺼내어 컨베이어 벨트에 올려둡니다.
* 관측자는 벨트 위의 공 순서를 볼 수 있지만, 어떤 항아리에서 나온 것인지는 알 수 없습니다.
* 요정이 공을 뽑을 때는 다음 규칙을 따릅니다:
	* $n$ 번째 공을 뽑기 위한 항아리는 무작위 숫자와 $n-1$ 번째 공을 뽑기 위해 선택한 항아리에만 영향을 받습니다.

### A.1.3) [[Markov property]]

* 직전 상태에만 영향을 받습니다.

### A.1.4) HMM 응용

* **Hidden state 예측**
	* Tagging: 주어진 단어 토큰에 대해 품사 예측에 사용됩니다.
* **다음 observation 예측**
	* Recommendation: 유저의 아이템 소비 sequence 를 통해 유저 취향을 추정하고 추천할 수 있습니다.

### A.1.5) HMM 학습: Unsupervised Learning 방식인 EM 알고리즘

* **E(Expectation)-step**: 모델 parameter 를 바탕으로 주어진 observation 이 나올 수 있도록 하는 likelihood 값을 계산합니다. 효율적인 계산을 위해 dynamic programming 을 사용합니다.
* **M(Maximization)-step**: E-step 에서 얻은 값으로 모델 parameter 를 최적화합니다.

### A.1.6) HMM 단점

* [[Markov property]] 에 의해 Long term 을 고려하지 못합니다.
* Local optimum 에 수렴하기 쉽습니다.
* 모든 가능성을 고려하기 때문에 계산 속도가 느립니다. 이를 보완하기 위해 dynamic programming 을 사용하지만 여전히 느립니다.

## A.2) Adapting Recommendations to Contextual Changes Using Hierarchical Hidden Markov Models 논문 리뷰

* Hierarchical HMM(HHMM) 구조를 기반으로 추천을 진행하는 모델입니다.

## A.3) 영상 시청 후 느낀점

* HMM 에 대한 기초적인 소개는 확인할 수 있었지만, EM 알고리즘 기반의 수학적 내용을 직관적으로 이해하지 못해 아쉬웠습니다.
* HMM 학습을 위한 EM 알고리즘에 대해서는 추가적인 조사가 필요해 보입니다.
* Decoding 및 Viterbi 알고리즘도 설명했지만 이해하기 어려웠습니다.) 들이 섞여 들어가 있습니다.
* 요정은
