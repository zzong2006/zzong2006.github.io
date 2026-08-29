---
title: "Search key"
aliases: ["탐색키"]
tags:
  - database
---

# A) Search Key ?

인덱스에서 레코드를 찾을 때 기준으로 삼는 속성(또는 속성들의 묶음)이다. [[Indexing]] 에서 index entry 하나는 search key 값과 그 값을 가진 레코드를 가리키는 포인터로 이루어진다.

```
index entry:  [ search key 값 | 레코드 포인터 ]
```

`WHERE last_name = 'Kim'` 을 자주 쓴다면 `last_name` 을 search key 로 하는 인덱스를 만든다. 그러면 테이블 전체를 훑는 대신 인덱스에서 `'Kim'` 을 찾아 포인터를 따라가면 된다.

# B) [[Key]] 와의 구분

이름은 비슷하지만 목적이 다르다. [[Primary Key]], [[Candidate Key]], [[Alternate Key]] 같은 키는 **레코드를 유일하게 식별하기 위한 제약조건** 이다. 반면 search key 는 **탐색을 빠르게 하려고 인덱스를 건 속성** 일 뿐이라, 값이 중복돼도 된다.

같은 성을 가진 사람이 여럿이면 `'Kim'` 이라는 search key 값에 여러 레코드가 달린다. 이 경우 인덱스는 그 값에 대응하는 포인터를 여럿 갖게 된다.

# C) 인덱스 종류와의 관계

- **[[Dense index]]**: 모든 search key 값마다 index record 를 둔다
- **[[Sparse Index]]**: 일부 search key 값에 대해서만 두고, 나머지는 그 지점부터 순차 탐색한다

sparse index 가 성립하려면 데이터 파일이 search key 순으로 정렬돼 있어야 한다. 그래서 한 테이블에 sparse index 는 하나만 둘 수 있고, 나머지는 [[Secondary Indices]] 로 dense 하게 만든다.

여러 속성을 묶어 search key 로 삼을 수도 있다(composite key). `(성, 이름)` 순서로 만든 인덱스는 성만으로 찾을 때도 쓸 수 있지만, 이름만으로 찾을 때는 쓸 수 없다. 정렬 순서가 앞쪽 속성부터 정해지기 때문이다.

# D) References
