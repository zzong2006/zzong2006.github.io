---
title: "Eclat"
tags: ["algorithm"]
---

# A) Eclat ?

Eclat 은 교집합을 이용한 [[DFS]] 방식이다. 그래서 [[Apriori]] 과 달리 parallel 하게 수행하는 것이 가능하다.

# B) Eclat 의 특징

Eclat 은 Apriori 와 비교했을 때 메모리에 모두 적재될 수 있는 적은 데이터셋에 적합하다.

즉, Eclat 방식은 확장성에 취약한 모습을 보인다.

또한, Aprior 는 candidate itemset 에 대해서 [[support]] 값을 반복적으로 계산해야 했지만, Eclat 은 그러지 않는다. 왜냐하면 이미 itemset 에 대한 Transaction 정보를 메모리에 저장하고 있기 때문이다.

Eclat 알고리즘은 vertical layout 을 이용한다.

즉, 한 transaction 이 어떤 itemset 을 보유하는지 나타내는 테이블을 이용하는 것이 아니라, 한 itemset 이 어떤 transaction 에 속해있는지 (TID) 나타내는 테이블을 이용한다.

![[img-9ca109b6b7.png|Image for post]]

# C) 동작 과정

1. 한 itemset 이 어떤 transaction 에 속해있는지 (TID) 나타내는 테이블을 생성
2. 테이블에서 minimum [[support]] 값을 만족하는 itemset 만을 남겨두고, 같은 테이블 내의 다른 itemset 에 대한 TID 간 교집합을 계산한다.
3. 이후, 다시 minimum [[support]] 값 이상인 itemset 을 남겨두고, 같은 과정을 반복한다.

![[img-3347cbeb15.png|Image for post]]

# D) References
