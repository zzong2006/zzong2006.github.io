---
layout: default
title:  "Database Term"
category: Database
order: 0.0
---

1. Relation (릴레이션) : 테이블
2. Attribute (속성)
   * <img src="https://i.loli.net/2020/11/28/jcvqmb6NWEVICuX.png" alt="Relation" style="zoom: 33%;" />
3. Degree (차수) 
   * 한 테이블에 들어있는 attribute의 수
   * 유효한 테이블의 최소 degree는 1, 즉, 모든 relation은 적어도 한 개의 attribute를 가져야 함

4. Tuple : 레코드
   * Relataion의 각 행을 의미
5. Cardinality 
   * Relation의 tuple의 총 개수
6. Domain : 도메인
   * relation에 포함된 각각의 속성이 가질 수 있는 값들의 집합
   * 예) 성별 속성의 도메인은 '남, 여'

7. DBMS: DataBase Management System
   * DB를 관리하며 응용 프로그램들이 DB를 공유하며 사용할 수 있는 환경을 제공하는 소프트웨어
8. RDBMS: Relational DBMS
   * 관계형 모델을 기반으로 한 DB 시스템
   * **RDBMS는 DBMS와 달리 무결성과 정규화, 그리고 Transaction의 ACID 모델을 지원한다.**
9. SQL: Structured Query Language
   * RDBMS에서 전용으로 사용하는 질의 언어 