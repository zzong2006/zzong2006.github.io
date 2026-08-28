---
title: "airflow"
tags: ["MLOps"]
---

# A) Airflow ?

DAG object: 기초 구성 요소는 Operator 와 Task

* Operator: Task 를 실행하기 위한 수단 (Bash, Python, Spark, Hive 등)
* Task: DAG 를 구성하는 실행 단위 (workflow 의 각 단계)

Airflow python script 파일은 DAG 구조를 상세화하기 위한 설정 파일 (configuration file) 이라는 것이다. script 의 목적은 DAG 객체를 정의하는데 있을뿐이고, 실제로 뭔가를 처리하지 않는다.

Script 에 정의된 실제 task 들은 서로 다른 context 에서 실행된다. 서로 다른 task 들은 서로 다른 worker 에서 실행되고 서로 다른 시간에서 실행된다. 즉, script 는 task 간 상호 커뮤니케이션을 하는데 사용할 수 없다는 의미가 된다.

## A.1) Python Script for DAG

* DAG 를 먼저 인스턴스화하고, 이를 각 operator 에게 넘겨준다.
	* operator 가 초기화될 때 DAG 설정을 override 를 통해 변경할 수 있다.
		* e.g. DAG 에서는 `retires: 1` 이지만, Operator 에서는 `retries: 3` 으로 override 할 수 있다.
* operator 를 통해 task 가 정의된다.
	* e.g. `t1 = BashOperator( … )`
* operator 를 통해 task 를 선언하고 나면, task 간 동작 순서를 설계할 수 있다.
	* e.g. `t1 >> [t2, t3]` 또는 operator 의 `set_upstream` 함수를 활용할 수 있다.

# B) Arguments

* `depends_on_past`: `True` 라면 개별 task 인스턴스는 부모 task 인스턴스의 성공에 따라 동작이 달라진다.

# C) Airflow 를 k8s 에 적용하기

[[Kubernetes]] `Executor` 랑 `PodOperator` 가 있다. `Executor` 는 개별 pods 에 task 동작할 때 사용하고, `PodOperator` 는 pod 생성할 때 사용한다. 모든 task instance 를 처리할 때마다 pod 을 생성한다.

* https://airflow.apache.org/docs/apache-airflow/stable/tutorial.html

# D) Vs. Cronjob

단순 스케줄링을 필요로 하는 작업은 Airflow 의 사용을 지양하고 K8s(Kubernetes) Cronjob 이나 Github Action 등을 활용하는 것을 권장

# E) Related Docs

* [전사 구성원들이 사용하는 배치 데이터 플랫폼 만들기 - Airflow Advanced - SOCAR Tech Blog](https://tech.socarcorp.kr/data/2022/11/09/advanced-airflow-for-databiz.html)
