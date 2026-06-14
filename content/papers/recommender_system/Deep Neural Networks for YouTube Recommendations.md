---
tags: ["RecSyS", "Youtube", "paper_review", "recommendation_system", "y2016"]
---

[paper link](https://static.googleusercontent.com/media/research.google.com/ko//pubs/archive/45530.pdf)

# A) Abstract

* classic two-stage information retrieval dichotomy (2 단계 정보 검색 이분법)
	* deep candidate generation model
	* deep ranking model
* practical lessons and insights 을 제공

# B) Introduction

* Introduction
	* YouTube video 추천에서 다루고 있는 도전들
		* Scale: 소규모 데이터에 대해서 잘 동작하는 많은 추천 알고리즘이 대규모 서비스에 오면 잘 동작하지 않는다.
			* 분산 학습 알고리즘과 효율적인 서빙 시스템이 필요하다.
		* Freshness: 초당 수 많은 비디오가 업로드 된다 (very dynamic corpus).
			* 추천 시스템은 새롭게 업데이트 되는 콘텐츠와 사용자들의 최신 행동에 대해 반응할 책임이 있다.
			* new content 와 well-established video 간 밸런스 (exploration & exploitation) 를 잘 맞추는게 필요함
		* Noise: 관측되지 않는 variety 와 sparsity 로 인해, 사용자들의 행동을 예측하는 것이 어려움
			* noisy 한 [[implicit feedback]] signal 을 활용해 모델링하고, 유저 만족도의 ground truth 를 얻는것은 어려움
			* 또한, 콘텐츠에 대한 metadata 역시 poorly structured 되어 있는 상황
		* YouTube 는 Google Brain 기반의 System (open sourced as [[TensorFlow]]) 에 기반하고 있음

# C) System Overview

* 시스템은 두 신경망으로 구성됨: 1) candidate generation, 2) ranking
	* candidate generation network 는 사용자의 history 를 입력으로 받아서 small subset video 를 반환함
		* 이러한 candidate 들은 [[collaborative filtering]] 를 통한 넓은 범위의 개인화를 제공함
	* ranking network 는 desired objective function 에 기반하여 각 비디오에 점수를 할당함
		* a rich set of features describing the video and user
* Development 에서는 offline metrics (precision, recall, ranking loss 등) 에 의존해서 시스템 향상을 진행했지만, 알고리즘이나 모델의 효과에 대한 최종적인 결정은 [[AB Test]] 를 통해 내려진다.
	* **Live A/B results are not always correlated with offline experiments.**

# D) RS Architecture

![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FJas03vI3mQ.png?alt=media&token=3522e2f4-4259-44ac-966d-41d3d6198296)

# E) Candidate Generation

* Recommendation as [[classification]]
	* Youtube 의 추천은 extreme multiclass 분류 문제로 보고 있음

$$
\displaystyle P\left(w_{t}=i\mid U,C\right)=\frac{e^{v_{i}u}}{\sum_{j\in V}e^{v_{j}u}}
$$

	* explicit feedback 이 많아도 시청에 대한 implicit feedback을 이용하여 모델을 학습하고 있음
		* 비디오를 끝까지 보면 해당 비디오에 대해서 positive 할 것임

* Efficient Extreme Multiclass
	* [[hierarchical softmax]] 보다는 [[negative sampling]] 방식이 더 효과가 좋았음
* Model Architecture
	* continuous [[bag of words]] language models 로 부터 영감을 받음
	* 사용자의 시청 기록이 video ID 의 시퀀스로 표현되고, 이것이 embedding 을 통해 dense vector 로 표현됨
	* 계산된 embedding 들은 mean-vector 를 통해서 신경망의 입력으로 활용된다.
		* sum, component-wise max 등 보다 average 가 제일 성능이 좋았음
* Heterogeneous Signals
	* Example Age Feature
		* 새로운 콘텐츠에 대한 추천이 필요하지만, 일반적으로 ML 시스템은 과거 히스토리에 암묵적인 bias 가 있을 수 밖에 없음 (과거 데이터를 활용해 미래를 예측하기 때문)
		* 그러나 비디오에 대한 인기 정도의 분포는 non-stationary 하기 때문에, 이를 correct 할 필요가 있는데, 해당 이슈를 다루기 위해 **training example 의 age**를 feature 로 입력한다.
			* serving 시, 해당 값은 `0` (또는 약간 음수 값) 으로 설정하여 모델이 training window 의 막바지에서 추천을 진행한다는 신호를 보냄
* Ranking
	* a deep neural network with similar architecture as candidate generation to assign an independent score to each video impression using [[logistic regression]]
	* expected watch time per impression 을 기준으로 A/B test 진행
		* CTR 의 경우는 낚시성 비디오들을 promote 해주는 경향이 있기 때문에 시청 시간 (watch time) 이 사용자의 흥미를 잡아내는데 더 나음
	* Deep ranking network architecture
		* ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FMUX73N-B2P.png?alt=media&token=c213a18b-f278-4bc0-a787-333ac620a6a6)

# F) References

[[The YouTube Video Recommendation System]]
