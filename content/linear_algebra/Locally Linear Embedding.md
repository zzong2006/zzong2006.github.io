---
tags: ["machine_learning"]
aliases: ["LLE"]
---

# A) LLE ?

* [[Locally Linear Embedding]](Locally Linear Embedding) 는 차원 축소에 사용되는 기법이다.
* [[Locally Linear Embedding]] 는 고차원에서 nearest neighbors 이었던 $k$ 개의 점들을 저차원에서도 nearest neighbors 가 되도록 변환시킨다.
* 단점
	* $k$ 개의 가장 가까운 점들은 신경쓰지만 그 외의 점들은 전혀 신경쓰지 않는다.
	* $k$ 는 [[hyperparameter]] 이다.
