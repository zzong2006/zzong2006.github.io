---
tags: ["hadoop", "data_engineering", "file_format"]
aliases: ["Parquet", "parquet"]
---

# A) Apache Parquet

Apache Parquet는 Hadoop ecosystem에서 널리 쓰이는 columnar storage file format이다. Row 단위로 저장하는 CSV와 달리 column 단위로 데이터를 묶어 저장하므로, 분석 query에서 필요한 column만 읽기 좋다.

# B) 왜 쓰나

Parquet는 압축과 encoding 효율이 좋고, schema를 함께 저장할 수 있다. Spark, Hive, Presto, Trino 같은 분석 엔진과 잘 맞기 때문에 data lake의 기본 저장 포맷으로 자주 선택된다.

특히 feature table이나 log table처럼 column 수가 많고 일부 column만 읽는 workload에서는 [[data_engineering/columnar storage|columnar storage]]의 장점이 크다.

# C) CSV와의 차이

| 구분 | CSV | Apache Parquet |
| --- | --- | --- |
| 저장 방식 | row-oriented text | columnar binary |
| Schema | 별도 관리 필요 | file metadata에 포함 |
| 압축 효율 | 낮은 편 | 높은 편 |
| 분석 query | 전체 row scan이 잦음 | 필요한 column 중심으로 읽기 쉬움 |

# D) References
