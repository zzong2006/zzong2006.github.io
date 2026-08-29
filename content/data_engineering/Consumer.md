---
title: "Consumer"
tags:
  - kafka
  - streaming
  - data_engineering
aliases: [Kafka Consumer, consumer]
---

# A) Kafka Consumer

Kafka Consumer는 [[data_engineering/Topic(kafka)|Kafka Topic]]에 저장된 message를 읽어 처리하는 client다. 읽은 message를 DB에 적재하거나, feature를 계산하거나, 다른 topic으로 다시 publish할 수 있다.

# B) Consumer Group

Consumer는 보통 [[data_engineering/consumer group|consumer group]] 단위로 동작한다. 같은 group 안의 consumer들은 topic partition을 나누어 읽으므로 처리량을 늘릴 수 있다.

반대로 서로 다른 group은 같은 topic을 독립적으로 읽는다. 그래서 하나의 event stream을 batch 적재, online feature 계산, monitoring pipeline이 각자 소비하는 구조를 만들 수 있다.

# C) Offset

Consumer는 어디까지 읽었는지를 offset으로 관리한다. Offset commit 전략에 따라 장애가 났을 때 중복 처리(at-least-once)나 누락 위험(at-most-once)이 달라진다.

Kafka client API에서는 다음 값을 구분해서 보는 일이 많다.

| API | 의미 |
| --- | --- |
| `position()` | consumer가 다음에 읽을 record의 offset |
| `committed()` | partition별로 마지막 commit된 offset |

`position()`은 현재 consumer의 진행 위치이고, `committed()`는 장애 복구 시 다시 시작할 기준점에 가깝다. 둘이 다를 수 있으므로 consumer lag이나 retry 문제를 볼 때 구분해야 한다.

# D) 같이 볼 개념

[[data_engineering/Producer|Producer]]는 message를 topic으로 보내고, [[data_engineering/Consumer|Consumer]]는 topic에서 message를 읽는다. 둘 사이의 logical stream이 [[data_engineering/Topic(kafka)|Kafka Topic]]이다.

# References
