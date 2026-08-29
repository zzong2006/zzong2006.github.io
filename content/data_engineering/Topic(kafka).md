---
title: "Topic(kafka)"
tags:
  - kafka
  - streaming
  - data_engineering
aliases: [Kafka Topic, topic]
---

# A) Kafka Topic ?

Kafka Topic 은 같은 종류의 event/message 를 모아두는 logical stream 이다. [[Producer]] 는 topic 으로 message 를 쓰고, [[Consumer]] 는 topic 에서 message 를 읽는다.

# B) Partition

Topic 은 하나 이상의 partition 으로 나뉜다. Partition 은 Kafka 의 병렬 처리 단위이자 순서 보장 단위다. 같은 partition 안에서는 offset 순서가 유지되지만, 서로 다른 partition 사이의 전역 순서는 보장되지 않는다.

# C) 이름을 잘 잡아야 하는 이유

Topic 이름은 데이터의 의미와 ownership 을 드러내야 한다. 예를 들어 `click_log`, `order_created`, `model_inference_event` 처럼 event 의 domain 과 발생 시점을 알 수 있게 잡으면 downstream consumer 가 이해하기 쉽다.

# D) Related

* [[data_engineering/Kafka|Kafka]]
* [[Producer]]
* [[Consumer]]

