---
title: "columnar storage"
tags: ["database"]
aliases: ["column oriented DB"]
---

# A) Columnar Storage ?

columnar storage [[row based storage]] 의 단점을 극복하기 위한 방법으로 많이 사용된다.

**columnar storage 와 row based storage 의 비교**
![[img-ca67a8d829.png]]

# B) 장점 및 단점

## B.1) 장점

1. 높은 압축률: 컬럼 단위로 데이터를 구성하면, 데이터가 균일하므로 압축률이 높아 파일의 크기도 작다.
2. 낮은 Disk IO: 다른 열에 영향을 주지 않고 특정 열의 값을 추가 및 업데이트할 때 효율적으로 사용할 수 있다.
3. 주로 같은 열 내에서는 데이터 타입이 동일하게 사용되므로, row based storage 일 때와 다른 압축 방식을 사용할 수 있어 공간 효율 또한 향상시킬 수 있다는 장점이 있다.

columnar storage 에서는 Row group 이라는 개념을 통해 데이터를 분리해두는 기법을 사용한다.

![[img-5f4ab3fd78.png]]

## B.2) 단점 ?

IO 비용을 최소화 하기 위해서는 block size 내 에서 최대 크기가 되도록 partition 을 나누는 것이 필요하다.

# C) References
