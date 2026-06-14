---
title: "ACID"
tags: ["database"]
---

# A) What is ACID?

Transaction 의 성질: Atomicity, Consistency, Isolation, Durability 총 4 가지를 의미한다.

# B) Atomicity (원자성)

* Transaction 의 연산은 DB 에 모두 반영되든지 아니면 전혀 반영되지 않아야 한다.
* 즉, Transaction 에 대한 모든 명령은 반드시 완벽히 수행되어야 하며, 어느 하나라도 오류 발생 시 해당 Transaction 전부가 취소되어야 한다.

# C) Consistency (일관성)

* Transaction 의 실행 결과로 DB 상태가 모순되지 않도록 해야한다.
* Transaction 이 진행되는 동안에는 DB 가 변경이 발생하더라도, 업데이트된 DB 로 transaction 이 수행되는 것이 아니라, 처음에 transaction 을 진행하기 위해 참조한 DB 로 진행된다.

# D) Isolation (독립성, 격리성)

* 둘 이상의 transaction 이 병행하여 실행되는 경우, 어느 하나의 transaction 실행중에 다른 transaction 의 연산이 끼어들 수 없다.
* 즉, 실행중인 transaction 이 완전히 완료될 때까지 다른 transaction 에서 실행 결과를 참조할 수 없다.

# E) Durability (영속성, 지속성)

* 성공적으로 수행된 transaction 의 결과는 영구적으로 반영되어야 한다.
