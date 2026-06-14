---
tags: ["SQL"]
---

# Presto ?

* 정의
	* Distributed SQL Query Engine for Big Data ([[Trino]] 와 유사)
	* Presto is an open source distributed SQL query engine for running interactive analytic queries against data sources of all sizes ranging from gigabytes to petabytes.
* Presto Concepts ([presto docs](https://prestodb.io/docs/current/overview/concepts.html))
	* Server Types
		* Presto 서버에는 두 가지 종류가 존재: coordinators and workers
			* coordinator
				* brain 역할을 맡는 서버: statement parsing, planning queries, 그리고 worker node 관리 등
				* worker 에게 결과를 fetch 해온 뒤, 최종 결과를 client 에게 돌려주는 역할을 맡는다.
			* worker
				* task 실행과 data 처리 등의 역할을 맡는 서버
	* Data sources
		* connector
			* [[Hive]] 또는 relational database 와 같은 data source 를 Presto 에 연결시킴
				* database 를 위한 driver 와 동일한 방식으로 동작함
		* catalog
			* schemas 를 포함한 어떠한 것. connector 를 통한 data source 를 reference 로 가지고 있음
				* 예시) the Hive catalog to connect to a Hive data source
			* Presto 내에서 테이블을 다루려면 항상 catalog 가 root 로 와야함
				* 예시) `hive.test_data.test` 는 `hive` catalog 에 있고, `test_data` schema 에 존재하는 `test` 테이블이다.
		* schema
			* 테이블을 구성하는 방식을 의미
			* catalog 과 schema 는 query 를 던질 수 있는 table 들의 집합을 정의함
		* table
			* 테이블은 특정 type 의 named columns 으로 구성된 unordered rows 들의 집합을 의미한다.
				* relational database 의 table 개념과 동일함
			* source data 로 부터 tables 의 mapping 은 connector 가 담당한다.
		* 

# Related

# References
