---
tags: ["data_engineering", "hadoop"]
aliases: ["Apache Hadoop"]
---

# A) Hadoop

Hadoop은 대규모 데이터를 분산 저장하고 처리하기 위한 오픈소스 생태계다. 원래는 HDFS와 MapReduce가 중심이었고, 이후 Hive, YARN, Spark, Parquet 같은 도구들과 함께 data lake의 기반으로 많이 쓰였다.

# B) 핵심 구성

| 구성 | 역할 |
| --- | --- |
| HDFS | 큰 파일을 block 단위로 나누어 여러 node에 저장 |
| YARN | cluster resource 관리와 job scheduling |
| MapReduce | batch processing 실행 모델 |
| Hive | SQL 형태로 Hadoop data를 질의하는 warehouse 계층 |

# C) 지금도 중요한 이유

실무에서는 순수 MapReduce를 직접 쓰는 일은 줄었지만, Hadoop 생태계의 file format, metastore, storage layout은 여전히 많이 남아 있다. [[hadoop/Apache Parquet|Apache Parquet]] 같은 columnar format도 Hadoop ecosystem에서 널리 쓰이는 분석용 저장 포맷이다.

# References
