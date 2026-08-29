---
title: "Indexing"
aliases: []
tags: []
---

# A) Indexing

**Indexing** 이란 원하는 데이터에 더 빠르게 접근할 수 있도록 **Index file** 을 구성하는 메커니즘을 의미한다.

- **Index file** 은 여러 개의 인덱스 엔트리들로 이루어진 파일이며, 각 엔트리는 **[[Search key]]** 와 해당 레코드를 가리키는 포인터로 구성된다.
  - **[[Search key]]**: 특정 레코드를 탐색하기 위해 사용하는 속성
  - 예시 이미지:
	![[img-767d9d1904.png]]

---

## A.1) [[Indexing]] 사용 시점

- 인덱스는 주로 **검색(SELECT)** 연산이 많고, **데이터 변경(INSERT, UPDATE, DELETE)** 연산이 상대적으로 적은 테이블에서 효율적이다.
- [[Indexing]] 은 크게 두 가지 방식으로 나눌 수 있다.
  1. **Ordered indices**: 검색 키들이 순서대로 정렬된 형태
  2. **Hash indices**: 검색 키들이 해시 함수에 의해 해시 버킷(bucket)에 저장되는 형태

---

## A.2) 관련 개념

- [[Dense index]]
- [[Sparse Index]]
- [[database/Secondary Indices]]
- [[B+Tree]] Index Files
