---
title: "Listing Embeddings in Search Ranking"
tags:
  - retrieval
  - e-commerce
  - embedding
  - ranking
  - tech_blog
  - word2vec
aliases: []
---

# A) Listing Embeddings in Search Ranking ?

[blog link](https://medium.com/airbnb-engineering/listing-embeddings-for-similar-listing-recommendations-and-real-time-personalization-in-search-601172f7603e) - Mar 14, 2018

[[cold-start]] embeddings

* 새로운 host 에 대한 embedding 은 만들 수 없기 때문에, 해당 호스트로부터 유사한 3 개의 embedding 들을 찾고, 그들의 mean vector 를 계산함
	* 유사한 기준은 지역적 (geographically), 가격 분포 (price range), 그리고 same listing type (Entire Home, Private Room, Shared Room)
* Embedding 을 통해 알 수 있는것?
	* 실제로 embedding 에 대해서 [[K-means]] clustering 을 수행한 결과 유사한 지역끼리 나눠짐을 확인할 수 있었음 (cluster 수는 100 개)
		* 또한, embedding 들의 type 간, price range 간 평균 [[cosine similarity]] 를 계산한 결과, 동일한 type 그리고 price range 는 비교할만한 높은 유사도를 보였음
	* meta data 에서 추출해 낼 수 있는 price 같은 것은 학습할 필요가 없다. 그러나 집 구조, style, 느낌 등 추출해 내기 애매한 feature 들이 embedding 에 잘 녹아들었는지 확인할 필요가 있다.
* Offline Evaluation of Listing Embeddings
	* 사용자가 최종적으로 예약한 목록 (list) 이 포함된 가장 최근에 클릭된 목록과 ranking 선정이 필요한 목록 candidate 가 제공된다고 가정
	* 클릭한 목록들의 embedding 과 candidate 목록들 간 cosine similarity 를 계산해서 가장 값이 큰 (유사한) 목록들부터 정렬하여 ranking
* Real time personalization in Search using Embeddings
	* 2 주간 클릭한 아이템 목록과 skip 한 아이템 목록을 ranking 에 반영

# B) References
