---
title: "Primary Key"
tags:
  - database
  - relation
aliases: []
---

# A) Primary Key

Primary Key는 relation에서 각 row를 대표적으로 식별하기 위해 선택한 key다. Candidate Key 중 하나를 고른 것이며, 일반적으로 `NULL`을 허용하지 않고 값이 중복될 수 없다.

# B) 왜 중요한가

Primary Key는 data integrity의 기준점이다. row를 업데이트하거나 삭제할 때 대상을 안정적으로 찾게 해주고, 다른 table의 [[database/Foreign Key|Foreign Key]]가 참조하는 기준이 된다.

# References
