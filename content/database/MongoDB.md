---
title: "MongoDB"
tags: ["database", "work"]
---

# A) MongoDB ?

# B) MongoDB Indexes

## B.1) Single Field Indexes

## B.2) Compound Indexes

# C) Query 시 주의사항

MongoDB 사용에 있어서 가장 중요한 점은 어플리케이션에서 보내는 쿼리가 인덱스를 거쳐서 수행되는지 여부입니다. 쿼리가 인덱스를 거치지 않고 수행되면 전체 데이터를 읽어야 하기 때문에 슬로우 쿼리가 될 가능성이 높고 다른 쿼리 수행에도 영향을 미칩니다.

인덱스를 거치지 않는 케이스를 아래에 정리했으니 참고해주세요.

1. 쿼리에서 사용하는 필드가 인덱스 생성이 안되어있는 경우  
   제일 많이 발생하는 케이스이고, DB 쪽에서도 제일 많이 연락이 왔던 케이스 입니다. `get`/`mget` 메서드나 직접 컬렉션 객체에서 `find` 연산을 하는 경우 조건이 되는 필드에 인덱스가 생성되는지 확인해주세요. 안전하게 가려면 컬렉션 생성시 사용하고자 하는 쿼리를 같이 첨부해주는 게 좋을 것 같습니다.

2. 컬렉션 데이터를 전체 삭제하거나 전체 스캔하는 경우  
   드물긴 하지만, `find` 에 조건을 걸지 않고 쓰거나 `delete_many` 에 조건 없이 쓰는 경우가 있는데 이런 경우가 로직에서 생기지 않도록 해야합니다.
   
3. TTL index 설정 오류  
   aurochs mongo 에서 `get_insert_query_by_sims` 를 통해 추천 결과를 업데이트 하는 경우, ts 필드에 업데이트 시간이 integer 형태로 저장됩니다. 그런데 대부분의 경우 TTL index 는 timestamp 필드에 걸어두기에 TTL 기능이 작동하지 않게 됩니다. TTL index 를 사용하는 경우 필드를 바르게 쓰고있는지 확인해야합니다.
   
4. Compass 에서 인덱스를 삭제한 경우  
   아주 드물긴 한데 불가능한 것은 아니라 기재합니다. 현재 aurochs mongodb 계정 권한에 인덱스 생성/삭제 권한도 포함이 되어있어 MongoDB Compass 에서 직접 인덱스 삭제가 가능합니다. (그런일은 없겠지만) 삭제하지 않도록 주의해야합니다.

## C.1) mongoDB 부하 관련

* DB 에서 클라이언트, 데이터베이스, 컬렉션 별로 통계를 알 수 있는 방법이 없습니다.
	* DB 는 인스턴스 단위의 쿼리 종류별 카운트만 제공할 뿐입니다.
* 해당 쿼리는 `nin` 조건을 사용하기 때문에 조건에 맞지 않는 데이터를 리턴하기 위해 모든 데이터를 읽어야 합니다. 단, 조건절에 인덱스가 있으므로 인덱스 풀스캔을 하게 됩니다.
* `is_pool_item` 필드는 샤드키가 아니므로 브로드캐스트 쿼리가 됩니다. 브로드캐스트 쿼리는 샤드를 늘려도 쿼리가 분산되지 않기 때문에 쿼리 호출 회수가 매우 중요합니다. 또한 필터링 될 데이터를 전송해야 하기 때문에 결과셋의 크기가 커지는 상황이 우려가 되네요.
	* 예상 호출 횟수와 평균 도큐먼트 개수를 산정
	* `toros_meta_317` 의 평균 도큐먼트 크기는 850 바이트라서 평균 1500 개 정도 리턴된다고 가정하면 결과셋의 크기는 약 1.2MB 정도 되겠네요. 1 초에 0.5 회 정도 호출되고 유사한 쿼리 계획이 없으시니 이 정도면 사용하셔도 무리 없어 보입니다.
* `$nin` 조건을 적용했는데 이 기능은 조건에 맞지않는 데이터를 리턴하기 위해 모든 데이터를스캔하므로적은쿼리양으로도부하를발생시킬수있습니다.

# D) Mongo 서버의 부하 확인 방법

다음과 같은 수치가 급등하는지 확인하면 된다.

> CPU Usage, System Load, WT Cache Usage (%Dirty), Connections, 관련 Operation

Query 를 자주해서 우려가 되는 경우는 Operation (Query) 를 살펴본다.

* Cache Usage (%Dirty) 비율이 높게되면 foreground eviction 이 발생해서 update/insert 가 제한된다.
* 5% 넘은 순간부터 eviction 이 수행되고, 20% 가 넘어가면 update/insert 가 막힌다.

[Grafana Link](http://mongodb.daumkakao.io:3000/d/mHup9eSWz/cluster-mongodb-overview?orgId=1)

# E) Lesson Learned

* mongosh 로 cli 에서 remote db 접근 가능

# F) Related

# G) References

* mongosh 관련 튜토리얼: [MongoDB mongosh Find](https://www.w3schools.com/mongodb/mongodb_mongosh_find.php)
