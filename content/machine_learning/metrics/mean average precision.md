---
title: "mean average precision"
tags: ["metrics", "recommendation_system"]
aliases: ["MAP"]
---

# A) Mean Average Precision ?

Mean Average [[precision]](MAP) 는 AP 의 평균을 계산하는 방법이다.

여기서 AP 는 각 query(User) 의 추천 결과에 대해서 계산할 수 있는 모든 precision 의 평균을 의미한다.

즉, 추천 결과에서 relevant item 에 대한 순위에 대한 집합이 $K$ 라면, AP 는 Precision@$k$ 의 평균을 의미한다 ($k\in K$).

# B) MAP 예시

![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FVUbz2e-MCS.png?alt=media&token=afddd2c8-d715-448d-8313-e20ed5ce7b83)

MAP 계산 예시: AP 를 먼저 계산하고, 계산된 AP 의 평균을 계산하면 MAP 를 구할 수 있다.

* 장점
	* 추천 결과를 집합으로 생각하는 Precision 과 달리, MAP 는 순서를 고려하여 Precision 을 계산할 수 있음
* 단점
	* Binary ratings(추천 결과가 관련 있는가/없는가) 에 대해서만 유용하고, numerical ratings (평점 1~5 ⭐ 시스템) 에 대한 추천 결과에서는 적절하지 않음
