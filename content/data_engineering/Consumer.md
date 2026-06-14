---
title: "Consumer"
tags: ["kafka", "streaming", "data_engineering"]
aliases: ["Kafka Consumer"]
---

# A) Consumer ?

Kafka Consumer 는 [[Topic(kafka)]] 에 저장된 message 를 읽어서 처리하는 client 다. 처리 결과를 DB 에 적재하거나, feature 를 계산하거나, 다른 topic 으로 다시 publish 할 수 있다.

# B) Consumer Group

Consumer 는 보통 [[consumer group]] 단위로 동작한다. 같은 group 안의 consumer 들은 partition 을 나누어 읽으므로 처리량을 늘릴 수 있다. 반대로 서로 다른 group 은 같은 topic 을 독립적으로 읽을 수 있다.

# C) Offset

Consumer 는 어디까지 읽었는지를 offset 으로 관리한다. offset commit 전략에 따라 장애 시 중복 처리(at-least-once) 또는 누락 위험(at-most-once)이 달라질 수 있다.

# D) Related

* [[data_engineering/consumer(Kafka)|Kafka Consumer]]
* [[Producer]]
* [[Topic(kafka)]]

