---
title: "Apriori"
tags:
  - algorithm
  - recommendation_system
aliases: []
---

# 1. Apriori ?

* [[BFS]] 방식을 사용해서 itemset 의 [[support]] 값을 계산하고, [[Anti-Monotone property]] 를 활용해 후보들을 생성해나가는 방법이다.
	* itemset 에 포함되는 item 의 개수를 한개부터 늘려가면서 최소 [[support]] 값 이상을 가지지 못하는 후보들은 제외한다.
* 예시

![[img-f15907abc6.png|Example of the A PRIORI algorithm, with support set to 2 .]]

* 위 그림은 최소 [[support]] 값이 0.5 이고, 최소 [[machine_learning/metrics/Confidence]] 값이 1.0 인 Apriori 알고리즘 동작 예시다.
* PHASE 1 과 2 를 통해서 유효한 itemset 을 구하고 (Apriori), 구해진 itemset 을 이용해 rule 을 만들어서 [[machine_learning/metrics/Confidence]] 를 계산한다.

# 2. Related

# 3. References
