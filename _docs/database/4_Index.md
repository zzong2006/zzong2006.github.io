---
layout: default
title:  "Index"
category: Database
order: 4
---

Indexing은 원하는 데이터 접근 속도를 높이기 위해 Index file을 구성하는 메커니즘을 의미한다.

* Index file은 검색 키와 포인터로 구성된 index 엔트리들로 구성된 파일을 의미한다.
  * 검색 키(Search Key): 레코드를 look up 하기 위해 구성된 속성

<img src="https://i.loli.net/2020/11/26/i1xMCgXNd8c7eTy.png" alt="image-20201126005222757" style="zoom: 67%;" />

Indexing은 크게 두 종류로 구성된다: Ordered indices, Hash indices

* Ordered indices : search key들이 순서에 의해 정렬됨
* Hash indices: search key들이 해시 함수에 의해 buckets에 저장됨





Search Key