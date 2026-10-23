---
title: "hashing trick"
aliases:
  - feature hashing
  - 해싱 트릭
tags:
  - machine_learning
  - feature_engineering
---

# A) Hashing Trick ?

Hashing trick은 범주형 값을 해시 함수에 통과시켜 나온 나머지를 그대로 feature 인덱스로 쓰는 방법이다. 값과 인덱스를 짝지어 놓은 사전(vocabulary)을 유지하지 않아도 되고, 처음 보는 값도 계산만으로 자리를 얻는다.

$$
\text{index}(x) = \text{hash}(x) \bmod B
$$

여기서 $x$ 는 원래 값(단어, 카테고리, ID 등), $B$ 는 해시 공간의 크기다.

# B) 사전을 없애면 무엇이 좋아지나

텍스트 분류에서 단어를 인덱스로 바꾸려면 보통 코퍼스를 한 번 훑어 단어 사전을 만든다. 이 사전은 학습과 추론 양쪽에서 같은 것을 써야 하고, 배포 대상이 되며, 새 단어가 들어오면 갱신해야 한다.

Hashing trick은 이 과정을 함수 호출 하나로 바꾼다. 어느 프로세스에서 계산해도 같은 결과가 나오므로 사전 배포나 학습·추론 사전 불일치 문제가 사라지고, 스트리밍처럼 값 집합이 계속 변하는 환경에서도 전처리 단계가 필요 없다.

# C) 파라미터가 없어지는 것은 아니다

사전이 사라지는 대신 해시 공간 크기 $B$ 가 새 하이퍼파라미터로 남는다. 그리고 이 값은 학습을 시작하기 전에 정해야 한다. $B$ 를 작게 잡으면 서로 다른 값이 같은 인덱스를 쓰는 충돌이 늘어 모델이 둘을 구분하지 못하고, 크게 잡으면 대부분 비어 있는 공간에 메모리를 쓴다.

값 $N$ 개를 버킷 $B$ 개에 넣을 때 같은 버킷을 공유하는 쌍의 기대 개수는 대략 $N^2 / 2B$ 라서, $B$ 를 $N$ 만큼 잡아도 충돌 쌍은 $N/2$ 규모로 남는다. 충돌을 실질적으로 없애려면 해시를 하나만 쓰는 것으로는 부족하고, 독립적인 해시를 여러 개 겹쳐 조합으로 값을 식별해야 한다. [[hash-based embedding]] 이 이 확장을 임베딩 테이블에 적용한 형태다.

# References

* [Don’t be tricked by the Hashing Trick | by Lucas Bernardi | Booking.com Data Science](https://booking.ai/dont-be-tricked-by-the-hashing-trick-192a6aae3087)
