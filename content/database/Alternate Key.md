---
title: "Alternate Key"
aliases: ["대체키"]
tags:
  - database
---

# A) Alternate Key ?

[[Candidate Key]] 중에서 [[Primary Key]] 로 뽑히지 **않은** 나머지를 부르는 말이다. 대체키라고 옮긴다.

키들의 관계를 정리하면 이렇다.

| 이름 | 뜻 |
| --- | --- |
| [[Super Key]] | 레코드를 유일하게 식별하는 속성 묶음. 불필요한 속성이 섞여 있어도 된다 |
| [[Candidate Key]] | super key 중 어느 하나를 빼도 유일성이 깨지는 것 (최소성을 만족) |
| [[Primary Key]] | candidate key 중 대표로 고른 하나 |
| Alternate Key | 대표로 뽑히지 않은 나머지 candidate key |

# B) 예시

사원 테이블에 `사번`, `주민등록번호`, `사내 이메일` 이 있고 셋 다 값이 중복되지 않는다고 하자. 셋 모두 candidate key 다. 이 중 `사번` 을 primary key 로 고르면, `주민등록번호` 와 `사내 이메일` 이 alternate key 가 된다.

# C) 실무에서의 취급

alternate key 도 유일성을 보장해야 하는 속성이므로, 제약조건을 걸어두는 것이 보통이다. `UNIQUE` 제약을 걸면 대부분의 DBMS 가 자동으로 인덱스를 만들어 준다.

primary key 와 다른 점은 두 가지다. 하나는 primary key 가 NULL 을 허용하지 않는 반면 alternate key 는 DBMS 에 따라 NULL 을 허용할 수 있다는 것이고, 다른 하나는 [[Foreign Key]] 가 보통 primary key 를 참조한다는 것이다.

어느 candidate key 를 primary key 로 삼을지는 값이 바뀌지 않는지, 길이가 짧은지, 외부에 노출해도 되는지로 정한다. 주민등록번호처럼 유일하더라도 노출 위험이 있는 값은 primary key 로 두지 않는다.

# D) References
