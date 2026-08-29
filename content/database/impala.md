---
title: "impala"
tags:
  - SQL
  - open_source
aliases: [임팔라]
---

# A) Impala ?

Apache Impala 는 아파치 하둡을 사용하는 컴퓨터 클러스터에 저장된 데이터를 처리하기 위한 오픈 소스 대규모 병렬 처리 (MPP) SQL 쿼리 엔진입니다. 이 엔진은 [[C++]] 로 작성되었습니다.

임팔라는 빅데이터 분석을 인메모리 기반의 실시간 온라인 분석으로 확장할 수 있게 해주며, 구글의 드레멜 논문이 2010 년에 발표된 이후, 2012 년 10 월 클라우데라가 이를 오픈소스로 공개하여 실시간 빅데이터 분석 질의를 가능하게 했습니다.

# B) 임팔라 특징

임팔라는 [[HBase]] 나 맵리듀스 같은 별도의 계층을 거치지 않고 HDFS(Hadoop Distributed File System) 와 직접 통신합니다. 또한 하이브처럼 ‘하이브쿼리언어 (HiveQL)’를 사용합니다.

임팔라는 다양한 파일 저장소 (HDFS, 쿠두, HBase, Amazon S3, Azure Data Lake Store) 에 있는 데이터를 SQL 로 실시간 분석하는 기능을 지원합니다.

# C) Impala Vs Hive

Impala 와 Hive 의 가장 큰 차이는 실시간 처리 능력입니다. Hive 는 데이터 접근 시 MapReduce 프레임워크를 사용하는 반면, Impala 는 응답 시간을 최소화하기 위해 자체 분산 질의 엔진을 사용합니다. 이 분산 질의 엔진은 클러스터 내 모든 데이터 노드에 설치되어 있어 성능 면에서 두 시스템 간에 큰 차이를 보입니다.

Cloudera 가 언급한 Impala 성능이 우수한 이유는 다음과 같습니다:

1. Impala 는 Hive 보다 CPU 부하를 줄였고, 그만큼 I/O 대역폭을 더 효율적으로 사용할 수 있습니다. 순수 I/O 중심의 질의에서는 Impala 가 Hive 보다 3~4 배 더 나은 성능을 보여줍니다.
2. 복잡한 질의를 처리할 때 Hive 는 여러 단계의 MapReduce 작업이나 Reduce-side 조인 (JOIN) 을 필요로 합니다. 이러한 비효율적인 작업에서는 적어도 하나 이상의 JOIN 연산이 포함된 경우 Impala 가 7~45 배 더 빠른 성능을 제공합니다.
3. 분석할 데이터 블록이 파일 캐시에 저장되어 있는 경우에는 매우 빠른 속도를 보여주며, 이때는 Hive 보다 20~90 배 빠른 성능을 발휘합니다.

# D) References

* [\[BIGDATA Platform\] 빅데이터 분석 활용 기술 – 임팔라(Impala) :: Practice makes perfect](https://kerpect.tistory.com/77)
