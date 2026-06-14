---
title: "consumer(Kafka)"
tags: ["kafka streaming"]
aliases: ["컨슈머"]
---

# 1. Kafka Consumer ?

* `position()`
	* 만약 offset 을 포함한 레코드가 존재한다면, 가져올 다음 레코드의 오프셋을 반환한다.
* `committed()`
	* 주어진 partition 에 대해서 마지막으로 committed 된 offset 을 반환한다. 이 offset 은 event 실패시 consumer 에 대한 position 값으로 사용된다.

# 2. Related

# 3. References
