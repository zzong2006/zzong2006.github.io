---
title: "A Survey on Deep Learning Based POI Recommendations"
aliases: []
tags:
  - deep_learning
  - paper_review
  - recommendation_system
---

# A) A Survey on Deep Learning Based POI Recommendations ?

A [[POI recommendation]] technique essentially exploits users’ historical check-ins and other multimodal information to recommend the next set of POIs suitable for a user.

Earlier works in [[POI recommendation]] primarily focused on [[feature engineering]] and conventional (non-deep learning) [[machine learning]]-based methods.

* [[matrix factorization]](MF) methods have also been studied for better POI recommendation modeling.
* [[Bayesian Personalized Ranking]], [[collaborative filtering]] methods have also been exploited in different works for personalized POI recommendation.
* 이런 방법들의 가장 주요한 단점은 [[feature engineering]] 에 있다.
	* Explicit 한 [[feature engineering]] 은 해당 도메인 전문가의 스킬이 요구된다.
	* 이미지, 텍스트, POI reviews 등 다양한 데이터가 사용 가능하지만, 이것들을 손수 feature engineering 하는 것은 쉽지 않은 일이다.
	* 결과적으로, 최근에는 deep learning 기반 방식이 이런 전통적인 방법들을 대체하게 되었다.

Deep learning methods like [[Convolution Neural Network]] or [[Recurrent Neural Network]] provide many advantage in terms of automatic feature extraction eliminating the difficulties in handcrafted feature design.

* CNN 과 RNN 외에도 graph embedding 이나 attention network 를 활용하는 POI 추천 방식이 제안되기도 하였다.
* 특히, state-of-the-art POI 추천 모델 중에서 [[self-attention]] 방식을 적용한 추천이 높은 성능을 내고 있다.
[[Long Short-Term Memory]] models

* Since successful recommendation fundamentally depends on historical POI information, sequential models (i.e., [[Recurrent Neural Network]], [[Long Short-Term Memory]]) have been primarily used in recent POI recommendation models.
	* Among them, [[Long Short-Term Memory]] is the most popular approach due to its long term sequential information capturing capability.
* Most of the models use an encoder-decoder scheme.
	* the encoder usually collects the information from users’ check-in list and other attributes
	* And using this information, the decoder predicts the next POI or a sequence of POI.
* A drawback of [[Recurrent Neural Network]] / [[Long Short-Term Memory]] approaches
	* unable to model the relations between two nonconsecutive POIs.

# B) [[Graph Embedding]] Models

일부 POI 추천 방법들은 POI-POI, 사용자 -POI, 그리고 POI- 시간과 같은 다양한 형태로 구성된 그래프들을 낮은 차원으로 표현하는 [[Graph Embedding]] 방식을 활용한다.

* Shortcomings and Challenges
	* Data Sparsity
		* 지역 추천 시스템을 만들 때, 가장 큰 문제는 그래프나 행렬이 sparse 하다는 것이다.
			* 예를 들어, 대부분의 사용자는 일생동안 available 한 POI 수 보다 훨씬 적은 장소만 방문한다.
	* Cold Start
		* 어떤 사용자가 처음 LBSN 에 가입한 경우, 해당 사용자의 적절한 특성을 알 수 없기 때문에, 초기 추천 성능이 좋지 못하다.
	* Lack of online learning
		* POI 추천 모델들의 대부분이 [[Offline Learning]] 기반이다.
		* 매일 사용자가 수많은 데이터를 생성하기 때문에, 이러한 전략은 optimal 하지 않다.
	* Dataset
		* 대부분의 모델들이 POIs 에 포함된 텍스트 정보를 활용하지 않는데, 그 이유는 대부분의 데이터셋에는 텍스트 정보가 포함되어 있지 않기 때문이다.

# C) References
