---
title: "scann"
tags: ["ANN", "vector_search", "Google"]
---

# A) (1) Scann ?

구글에서 만든 [[Approximate Nearest Neighbor|ANN]] 라이브러리. 2022 년 기준 벤치마크 상으로 가장 좋은 성능을 내고 있다.

# B) (2) 튜닝하기

* 데이터가 100k 개 이상일 경우, AH 로 점수를 계산하고 rescore 절차를 거쳐야 한다.
* AH 로 점수를 계산할 때, `dimensions_per_block` 은 `2` 로 설정하자.
* 파티셔닝 시에 `num_leaves` 는 데이터포인트 개수의 제곱근 수 (square root) 와 비슷하게 설정하면 좋다.

# C) References

* [scann algorithm explained in github (google research)](https://github.com/google-research/google-research/blob/master/scann/docs/algorithms.md)
