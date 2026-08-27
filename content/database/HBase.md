---
tags: ["NoSQL"]
---

# A) HBase ?

Distributed [[data_engineering/columnar storage|column oriented DB]] 이며, HDFS 를 기반으로 구축한다.

# B) 특징

* Distributed: 분산 환경에서 동작하므로 [[scale up and scale out|scale out]] 이 가능하다.
* Random Access 기반: Hadoop 과 같은 sequential access 와는 대조적이다.
* Sparsity: HBase 는 sparse matrix(희소행렬) 방식으로 데이터를 저장 할 수 있다. 예컨데 굳이 모든 필드에 값을 채울 필요가 없다는 얘기다.

# C) 구조

Hbase 는 다음과 같은 계층적 구조로 이루어져 있으며, 상위 개념은 하위 개념의 집합을 의미한다.

```
Table -> rows ->  column familes -> columns -> key/value pairs
```

가장 상위의 테이블에 대해서 설명하면, Hbase 는 테이블로 구성되어 있으며, 각 테이블은 row 의 집합을 의미한다.

그리고 각 row 는 row key 와 column family(CF) 들로 구성되어 있어서, row key 를 통해 식별 및 정렬이 가능하고 column family 에 데이터를 저장한다.

각 column family 는 column 의 집합이며, 다시 column 은 (key, value) pair 의 집합으로 구성되어 있다. 이때 key 를 column qualifier 라고 부른다. 즉, column 자체는 column family:column qualifier 의 형태로 표현할 수 있다.

row 를 다시 생각해보면 CF 가 아닌 여러개의 column(=family:qualifier) 으로 구성되어 있다고 생각할 수 있다: `Row = Row Key + Column + [Column …]`

## C.1) 예시

![](https://i.imgur.com/QfrBVTE.png)

1. 이 테이블은 `Customer` 와 `Sales` 두 개의 컬럼 패밀리를 가지고 있다.
2. `Customer` 컬럼 패밀리는 `Name` 과 `City` 두 개의 column qualifier 를 가지고 있다.
	1. 해당 컬럼은 `Customer:Name` 와 같은 방식으로 표현할 수 있다.
3. `Sales` 컬럼 패밀리는 `Product` 와 `Amount` 두 개의 column qualifier 를 가지고 있다.
	1. 해당 컬럼은 `Sales:Amount` 와 같은 방식으로 표현할 수 있다.
4. `Row` 는 `Row Key`, `Customer CF`, `Sales CF` 로 구성된다.

# D) Lesson Learned

테이블의 CF 가 총 n 개 존재한다고 하더라도 각 row 에 해당하는 CF 는 꼭 n 개일 필요는 없다. 최소 한개 이상만 존재하면 된다.

# E) References
