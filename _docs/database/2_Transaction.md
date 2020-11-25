---
layout: default
title:  "Transaction"
category: Database
order: 2
---

## Transaction의 정의

DB의 상태를 변화시키기 위해서 수행하는 작업의 단위

* DB의 상태 변화란, DB에 접근하는 연산을 의미한다.
  * SQL의 INSERT, DELETE, UPDATE 등 이 대표적인 예시다.



## Transaction의 성질

ACID, Atomicity, Consistency, Isolation, Durability 총 4가지.

### Atomicity (원자성)

Transaction의 연산은 DB에 모두 반영되든지 아니면 전혀 반영되지 않아야 한다. 즉, Transaction에 대한 모든 명령은 반드시 완벽히 수행되어야 하며, 어느 하나라도 오류 발생 시 해당 Transaction 전부가 취소되어야 한다.

### Consistency (일관성) 

Transaction의 실행 결과로 DB 상태가 모순되지 않도록 해야한다.

* Transaction이 진행되는 동안에는 DB가 변경이 발생하더라도, 업데이트된 DB로 transaction이 수행되는 것이 아니라, 처음에 transaction을 진행하기 위해 참조한 DB로 진행된다.

### Isolation (독립성, 격리성)

둘 이상의 transaction이 병행하여 실행되는 경우, 어느 하나의 transaction 실행중에 다른 transaction의 연산이 끼어들 수 없다. 즉, 실행중인 transaction이 완전히 완료될 때까지 다른 transaction에서 실행 결과를 참조할 수 없다. 

### Durability (영속성, 지속성)

성공적으로 수행된 transaction의 결과는 영구적으로 반영되어야 한다.



## Transaction 연산의 종류

하나의 Transaction은 commit 또는 rollback으로 구성된다.

1. **Commit**: 하나의 transaction에 대한 작업이 성공적으로 끝나고, DB가 consistency를 유지하는 상태에 있을 때, transaction이 끝났다라는 것을 알려주기 위한 연산

2. **Rollback**: 하나의 transaction 처리가 비정상적으로 종료되어 DB의 일관성을 깨뜨렸을 때, atomicity 특성에 기반해 transaction이 수행한 모든 연산을 undo 하는 연산

   * Rollback 시, 해당 transaction을 재시작하거나 폐기

   

## Transaction 상태

![DBMS](https://www.tutorialspoint.com/dbms/images/transaction_states.png)

1. **Active**: transaction이 실행중인 상태
2. **Failed**: transaction 실행에 오류가 발생하여 중단된 상태
3. **Aborted**: transaction이 비정상적으로 종료되어 rollback 연산을 수행한 상태
4. **Partially Committed** : transaction의 마지막 연산까지 실행했지만, commit 연산이 실행되기 직전의 상태
5. **Committed**: transaction이 성공적으로 종료되어 commit 연산을 실행한 후의 상태



## Transaction Isolation Level

Isolation level (격리 수준): 동시에 여러 transaction이 수행될 때, transaction 간 특정 데이터에 대한 간섭 여부의 한도를 결정하는 것 

총 4개의 level이 존재함: Read Uncommitted, Read Committed, Repeatable Read, Serializable

### Read Uncommitted

어떤 transaction의 수행한 작업 결과가 commit 또는 rollback 전에도 다른 transaction이 읽을 수 있는 격리 수준을 의미

* 문제점: Dirty Read 발생 가능
  * Dirty Read: 커밋하지 않은 데이터를 읽는 것
  * Dirty Read의 발생 가능성이 있는 상황: A transaction에서 어떤 테이블의 데이터를 생성 후 커밋하지 않았는데, B transaction에서 해당 테이블의 데이터를 읽으려고 하는 경우

![A beginne](https://vladmihalcea.com/wp-content/uploads/2018/05/DirtyRead.png)

### Read Committed

대부분의 DBMS에서 설정하는 기본 설정으로, <u>커밋된 데이터만 읽는 격리 수준</u>을 의미한다. 또한, dirty read가 발생하지 않도록 보장한다.

문제점: Non-repeatable read 발생 가능

* 테이블의 한 row를 조회하고, 이후에 다시 해당 row를 조회했을 때, 이전의 조화 결과와 동일하다는 것을 보장하지 않음 (왜냐하면 다른 transaction에서 해당 row를 갱신하였기 때문에) 

![Non-Repeatable Read](https://vladmihalcea.com/wp-content/uploads/2018/06/NonRepeatableRead-1024x646.png)

### Repeatable Read

데이터 조회 시, 항상 동일한 데이터 응답을 보장하는 격리 수준으로, non-repeatable read를 해결할 수 있다.

* 방법: 선행 transaction A가 읽은 데이터는 A가 종료될 때까지, 후행 transaction B가 갱신하거나 삭제하는 것을 금지함 (UPDATE, DELETE 금지)

문제점: phantom read

* 한 transaction 안에서 일정 범위의 레코드를 두번 이상 읽을 때, 첫번째 쿼리에서 없던 레코드가 두번째 쿼리에서 나타나는 현상
* Non-repeatable read와의 차이점: phantom read는 (INSERT 등으로 인해) transaction에 따라 얻어진 rows의 collection에서 차이가 발생하는 것이고, non-repeatable read는 (UPDATE 등으로 인해) 하나의 row 에서 차이가 발생하는 것이다.

![](https://i.stack.imgur.com/aCtew.png)

### Serializable

가장 높은 격리 수준으로, phantom read 를 해결할 수 있다.

* 방법: 선행 transaction이 읽은 데이터를 후행 transaction이 갱신하거나 삭제하지 못할 뿐만 아니라, 중간에 새로운 record를 삽입하는 것도 금지함 (UPDATE, DELETE, INSERT 금지)

## Isolation level에 따른 Concurrency와 Consistency

격리 수준을 높이면 일관성은 향상되지만, 더 넓은 범위의 lock을 오랫동안 유지하는 방식으로 concurrency를 저하시킨다.

<img src="https://i.loli.net/2020/11/25/qlQ5vnaXMRmst7A.jpg" alt="img" style="zoom:80%;" />