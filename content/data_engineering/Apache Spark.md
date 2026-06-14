---
tags: ["open_source"]
aliases: ["Spark"]
---

# A) Spark ?

Apache Spark 는 메모리 내 처리를 지원하여 빅 데이터를 분석하는 애플리케이션의 성능을 향상시키는 오픈 소스 병렬 처리 프레임워크입니다.

Spark 는 **메모리**에서 대량의 데이터를 처리하므로 디스크 기반 대체 방법보다 훨씬 빠릅니다.

# B) Spark 기초

## B.1) Partition

[[partition(Spark)]] 를 참고

# C) Coalesce & Repartition

coalesce 나 repartition 연산을 사용해 현재의 RDD 의 파티션 개수를 조정할 수 있다. 이때, `repartition` 이 파티션 수를 늘리거나 줄이는 것을 모두 할 수 있는 반면, coalesce 는 줄이는 것만 가능하다.

이렇게 모든 것이 가능한 repartition 가 있음에도 coalesce 방식을 따로 두는 이유는 바로 처리 방식에 따른 **성능 차이** 때문이다. 즉, repartition 은 셔플을 기반으로 동작을 수행하는 데 반해 coalesce 는 강제로 셔플을 수행하라는 옵션을 지정하지 않는 한 셔플을 사용하지 않기 때문이다.

* coalesce: 데이터 필터링 등의 작업으로 데이터 수가 줄어들어 파티션의 수를 줄이고자 할 때 사용
* repartition: 파티션 수를 늘려야 하는 경우에만 사용

# D) Lesson Learned

## D.1) Executor Memory 부족 이슈

### D.1.1) 개요

대용량 데이터를 다루다 보니 heartbeat timeout 이 발생함. 히스토리 서버에서 확인해보니 executor 의 메모리가 부족해서 error 로 인해 task 가 완료되지 않았고, 이로 인해 다른 task 들이 pending 상태에 걸려서 기달리다가 종료 (timeout) 되는 현상 발생.

### D.1.2) Trial and Errors

대용량 데이터를 save 하는데 파티션 개수가 부족한 걸수도 있겠다.

1. executor 메모리 증가 시도 (`--executor-memory` 옵션 조정): 실패
2. Spark partition 개수 증가 시도. 200(default) 개 에서 600 개로 늘림: 실패
3. 단순히 repartitioning 개수만 늘릴게 아니라 column 도 같이 신경써줘야 할거 같아서, `repartition` 과 `partitionBy` 함수를 함께 사용했음
4. 범인을 찾는것 같다. [[postgreSQL]] dataframe 에서 파티셔닝을 안해줘서 에러가 발생한 것 같음.

한 executor 가 마스터 노드랑 연결이 끊어졌다고 스스로 죽어버리는 이슈가 있다. 대략 살펴보니 데이터의 skewness 가 심해서 특정 노드의 join 에서 과도한 연산이 발생해 지연이 발생하고 있는것 같다.

skewness join 을 해결하기 위해 (우선 executor 의 코어수와 메모리 용량을 늘려서 돌려보긴 했지만..) 코드 상으로 해결할 수 있는 방법을 찾아보니 salting join 방식을 참고할 수 있을 것 같다: [Salting 기법 예제 코드:: MESH KOREA | VROONG 테크 블로그](https://mesh.dev/20220130-dev-notes-008-salting-method-and-examples/)

### D.1.3) Solution

postgreSQL 에서 데이터를 가져올때 레코드 개수가 약 2 억개 정도로 너무 많아서 OOM 에러가 발생한다. 이런 경우 옵션에서 spark 의 jdbc read 옵션에 `partitionNum` 을 주는 것이 중요하다.

그리고 이렇게 파티셔닝을 통해 dataFrame 을 가져왔다 하더라도, join 연산이 존재한다면 연산에 타겟이 되는 컬럼을 기준으로 리파티션이 진행된다. 이렇게 되면 다시 OOM 이슈가 발생한다. 그래서 join 연산 전에 `repartition(num, *cols)` 메소드를 통해 조인할 컬럼을 파티셔닝 해줘야 한다.

위 솔루션을 적용하고 `explain` 메소드를 통해 전체 plan 을 확인할 수 있다. 적용한 파티션이 줄어들지 않는지 주의깊게 체크하자.

# E) Related

[[pySpark]]

# F) References

* https://brocess.tistory.com/183

# G) 궁금한 점

* shuffling 이 뭔지?
* RDD 는 뭔지?
