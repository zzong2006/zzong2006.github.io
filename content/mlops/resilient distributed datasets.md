---
title: "resilient distributed datasets"
tags: ["Spark"]
aliases: ["RDD"]
---

# A) Resilient Distributed Datasets ?

RDD 는 스파크 내에 저장된 데이타를 의미하며, 여러 분산 노드에 걸쳐서 저장되는 변경이 불가능한 데이타 (객체) 의 집합이다. 각각의 RDD 는 여러개의 파티션으로 분리가 된다.

RDD 의 생성은 외부로 부터 데이타를 로딩하거나 또는 코드에서 생성된 데이타를 저장함으로써 생성할 수 있다.

# B) Operations

RDD 는 두 가지 연산만 적용할 수 있다.

1. Transformation
   기존의 RDD 데이타를 변경하여 새로운 RDD 데이타를 생성해내는 것. 흔한 케이스는 filter 와 같이 특정 데이타만 뽑아 내거나 map 함수 처럼, 데이타를 분산 배치 하는 것 등을 들 수 있다.
2. Action
   RDD 값을 기반으로 무엇인가를 계산해서 (computation) 결과를 (셋이 아닌) 생성해 내는것으로 가장 쉬운 예로는 count() 와 같은 operation 들을 들 수 있다.

# C) Loading

RDD 의 데이타 로딩 방식은 Lazy 로딩 컨셉을 사용하는데, 예를 들어 sc.textFile(“파일”) 로 파일을 로딩하더라도 실제로 로딩이 되지 않는다. 파일이 로딩되서 메모리에 올라가는 시점은 action 을 이용해서 개선할 당시만 올라간다.

아래와 같은 예시 코드를 보자.

```python
lines = sc.textFile("README.md") 
pythonLines = lines.filter(lambda line: "Python" in line) pythonLines.count()
```

언제 실제 README.md 파일이 읽혀질까? 실제로 읽혀지는 시기는 README.md 파일을 `sc.textFile` 로 오픈할 때가 아니라 .count() 라는 액션이 수행될 때 이다.

# D) References

* [https://bcho.tistory.com/1027](https://bcho.tistory.com/1027)
* [RDD Programming Guide - Spark 3.5.2 Documentation](https://spark.apache.org/docs/latest/rdd-programming-guide.html#overview)
