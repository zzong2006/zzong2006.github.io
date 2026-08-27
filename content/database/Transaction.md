---
title: "Transaction"
---

# A) Transaction 의 정의

DB 의 상태를 변화시키기 위해서 수행하는 작업의 단위

* DB 의 상태 변화란, DB 에 접근하는 연산을 의미한다.
  * SQL 의 INSERT, DELETE, UPDATE 등 이 대표적인 예시다.

# B) Transaction 의 성질

ACID, Atomicity, Consistency, Isolation, Durability 총 4 가지.

## B.1) Atomicity (원자성)

Transaction 의 연산은 DB 에 모두 반영되든지 아니면 전혀 반영되지 않아야 한다. 즉, Transaction 에 대한 모든 명령은 반드시 완벽히 수행되어야 하며, 어느 하나라도 오류 발생 시 해당 Transaction 전부가 취소되어야 한다.

## B.2) Consistency (일관성)

Transaction 의 실행 결과로 DB 상태가 모순되지 않도록 해야한다.

* Transaction 이 진행되는 동안에는 DB 가 변경이 발생하더라도, 업데이트된 DB 로 transaction 이 수행되는 것이 아니라, 처음에 transaction 을 진행하기 위해 참조한 DB 로 진행된다.

## B.3) Isolation (독립성, 격리성)

둘 이상의 transaction 이 병행하여 실행되는 경우, 어느 하나의 transaction 실행중에 다른 transaction 의 연산이 끼어들 수 없다. 즉, 실행중인 transaction 이 완전히 완료될 때까지 다른 transaction 에서 실행 결과를 참조할 수 없다.

## B.4) Durability (영속성, 지속성)

성공적으로 수행된 transaction 의 결과는 영구적으로 반영되어야 한다.

# C) Transaction 연산의 종류

하나의 Transaction 은 commit 또는 rollback 으로 구성된다.

1. **Commit**: 하나의 transaction 에 대한 작업이 성공적으로 끝나고, DB 가 consistency 를 유지하는 상태에 있을 때, transaction 이 끝났다라는 것을 알려주기 위한 연산
2. **Rollback**: 하나의 transaction 처리가 비정상적으로 종료되어 DB 의 일관성을 깨뜨렸을 때, atomicity 특성에 기반해 transaction 이 수행한 모든 연산을 undo 하는 연산

   * Rollback 시, 해당 transaction 을 재시작하거나 폐기

# D) Transaction 상태

<img src="https://i.loli.net/2020/11/26/1hkKFt4LizeMopN.png" alt="How to rollback using explicit SQL Server transactions" style="zoom:80%;" />

1. **Active**: transaction 이 실행중인 상태
2. **Failed**: transaction 실행에 오류가 발생하여 중단된 상태
3. **Aborted**: transaction 이 비정상적으로 종료되어 rollback 연산을 수행한 상태
4. **Partially Committed** : transaction 의 마지막 연산까지 실행했지만, commit 연산이 실행되기 직전의 상태
5. **Committed**: transaction 이 성공적으로 종료되어 commit 연산을 실행한 후의 상태

# E) Transaction Isolation Level

Isolation level (격리 수준): 동시에 여러 transaction 이 수행될 때, transaction 간 특정 데이터에 대한 간섭 여부의 한도를 결정하는 것

총 4 개의 level 이 존재함: Read Uncommitted, Read Committed, Repeatable Read, Serializable

## E.1) Read Uncommitted

어떤 transaction 의 수행한 작업 결과가 commit 또는 rollback 전에도 다른 transaction 이 읽을 수 있는 격리 수준을 의미

* 문제점: Dirty Read 발생 가능
  * Dirty Read: 커밋하지 않은 데이터를 읽는 것
  * Dirty Read 의 발생 가능성이 있는 상황: A transaction 에서 어떤 테이블의 데이터를 생성 후 커밋하지 않았는데, B transaction 에서 해당 테이블의 데이터를 읽으려고 하는 경우

![A beginne](https://vladmihalcea.com/wp-content/uploads/2018/05/DirtyRead.png)

## E.2) Read Committed

대부분의 DBMS 에서 설정하는 기본 설정으로, <u>커밋된 데이터만 읽는 격리 수준</u>을 의미한다. 또한, dirty read 가 발생하지 않도록 보장한다.

문제점: Non-repeatable read 발생 가능

* 테이블의 한 row 를 조회하고, 이후에 다시 해당 row 를 조회했을 때, 이전의 조화 결과와 동일하다는 것을 보장하지 않음 (왜냐하면 다른 transaction 에서 해당 row 를 갱신하였기 때문에)

![Non-Repeatable Read](https://vladmihalcea.com/wp-content/uploads/2018/06/NonRepeatableRead-1024x646.png)

## E.3) Repeatable Read

데이터 조회 시, 항상 동일한 데이터 응답을 보장하는 격리 수준으로, non-repeatable read 를 해결할 수 있다.

* 방법: 선행 transaction A 가 읽은 데이터는 A 가 종료될 때까지, 후행 transaction B 가 갱신하거나 삭제하는 것을 금지함 (UPDATE, DELETE 금지)

문제점: phantom read

* 한 transaction 안에서 일정 범위의 레코드를 두번 이상 읽을 때, 첫번째 쿼리에서 없던 레코드가 두번째 쿼리에서 나타나는 현상
* Non-repeatable read 와의 차이점: phantom read 는 (INSERT 등으로 인해) transaction 에 따라 얻어진 rows 의 collection 에서 차이가 발생하는 것이고, non-repeatable read 는 (UPDATE 등으로 인해) 하나의 row 에서 차이가 발생하는 것이다.

![](https://i.stack.imgur.com/aCtew.png)

## E.4) Serializable

가장 높은 격리 수준으로, phantom read 를 해결할 수 있다.

* 방법: 선행 transaction 이 읽은 데이터를 후행 transaction 이 갱신하거나 삭제하지 못할 뿐만 아니라, 중간에 새로운 record 를 삽입하는 것도 금지함 (UPDATE, DELETE, INSERT 금지)

# F) Isolation Level 에 따른 Concurrency 와 Consistency

격리 수준을 높이면 일관성은 향상되지만, 더 넓은 범위의 lock 을 오랫동안 유지하는 방식으로 concurrency 를 저하시킨다.

<img src="https://i.loli.net/2020/11/25/qlQ5vnaXMRmst7A.jpg" alt="img" style="zoom:80%;" />
