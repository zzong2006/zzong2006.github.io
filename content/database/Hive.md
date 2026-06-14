---
title: "Hive"
tags: ["database"]
---

# A) Hive ?

Hive 는 하둡에서 정형화된 데이터를 처리하기 위한 데이터 웨어하우스 인프라.

The Apache Hive ™ data warehouse software facilitates reading, writing, and managing large datasets residing in distributed storage using SQL.

# B) Why Hive?

[[MapReduce]] 는 복잡도가 높은 프로그래밍 기법이 필요했고, 이는 업무 분석가 및 관리자들에게 빅데이터에 접근하는 것을 어렵게 만들었습니다. 이를 해결하기 위해 페이스북에서 SQL 과 매우 유사한 방식으로 하둡 데이터에 접근성을 높인 Hive 개발을 하게 되었습니다.

# C) Hive 수행 기능

1. 아파치 하이브는 아파치 HDFS 이나 아파치 [[HBase]] 와 같은 데이터 저장 시스템에 저장되어 있는 대용량 데이터 집합들을 분석
2. HiveQL 이라고 불리는 SQL 같은 언어를 제공하며 맵리듀스의 모든 기능을 지원
3. 쿼리를 빠르게 하기위해 비트맵 인덱스를 포함한 index 기능을 제공
4. 하둡에서 동작하는 데이터 웨어하우스 (Data Warehouse) 인프라 구조로서 데이터 요약, 질의 및 분석 기능을 제공합니다.

