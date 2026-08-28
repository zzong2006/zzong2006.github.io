---
title: "Producer"
tags: ["kafka", "streaming", "data_engineering"]
aliases: ["Kafka Producer"]
---

# A) Producer ?

Kafka 에서 Producer 는 event/message 를 생성해서 [[Topic(kafka)]] 으로 보내는 client 다. 예를 들어 click log, order event, model inference log 를 Kafka 로 흘려보내는 application 이 producer 역할을 한다.

# B) Producer 가 정하는 것

Producer 는 어떤 topic 으로 보낼지, 어떤 key 를 사용할지, serialization format 을 어떻게 둘지 결정한다. key 를 지정하면 같은 key 를 가진 message 가 같은 partition 으로 들어가도록 만들 수 있어 순서 보장이 필요한 event stream 에 중요하다.

# C) Related

* [[data_engineering/Kafka|Kafka]]
* [[Topic(kafka)]]
* [[Consumer]]

