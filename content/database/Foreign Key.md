---
title: "Foreign Key"
tags:
  - database
  - relation
aliases: []
---

# A) Foreign Key

Foreign Key는 한 relation의 attribute가 다른 relation의 [[database/Primary Key|Primary Key]] 또는 Candidate Key를 참조하도록 만든 제약이다. table 사이의 관계를 database 수준에서 보존하는 장치다.

# B) 무엇을 막아주나

Foreign Key는 존재하지 않는 parent row를 참조하는 child row가 생기는 것을 막는다. 예를 들어 `orders.user_id`가 `users.id`를 참조한다면, 존재하지 않는 user에 대한 order가 들어가지 않도록 제약할 수 있다.

# References
