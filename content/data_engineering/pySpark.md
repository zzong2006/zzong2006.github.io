---
title: "pySpark"
tags: ["python", "open_source", "Spark"]
---

# pySpark ?

[[Apache Spark|Spark]] 의 [[Python]] wrapper

# Functions

## withColumn

스파크 데이터프레임에서 column 을 추가하거나, 한 column 의 값을 다른 값으로 변경 할 때는 `withColumn` 함수를 이용합니다.

예시) `df.withColumn("xx", $"name")`: `xx` 라는 column 을 추가. 추가할때 `name` 이라는 column 의 값과 동일한 값을 집어넣어줌.

## Lit

literal value 로 column 을 생성할 때 사용한다. dataframe 에 없고 내가 원하는 값만 들어가는 column 을 생성하고 싶을때 사용한다.

**예시**

``` python
>>> from pyspark.sql.functions import lit
>>> df1.withColumn('manager1',lit('x1')).show()
```

```bash
+--------+--------+
|manager1|manager2|
+--------+--------+
|      x1|  value2|
|      x1|  value4|
+--------+--------+
```

## Coalesce

## Fillna

결측치를 특정 값으로 채운다. `subset` 옵션을 통해 특정 column 에 동작하도록 설정할 수 있다.

**예시**: a, b column 에만 fillna 동작 (0 을 채우기)

```python
df.fillna(0, subset=['a', 'b'])
```

# References
