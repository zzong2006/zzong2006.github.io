---
title: "consumer group"
tags: ["kafka"]
aliases: ["컨슈머 그룹"]
---

# A) Consumer Group ?

* [[consumer group]] 은 여러 [[Consumer]] 들이 포함된 그룹이다.
* [[consumer group]] 안의 [[Consumer]] 수만큼 파티션의 데이터를 분산처리하게 된다.
* 이 group 의 consumer 는 동일한 offset 을 공유하므로, 그룹 내 한 consumer 가 데이터를 읽었다면, 그룹 내 다른 consumer 는 그 데이터를 읽을 수 없다.
* consumer group 은 새로 추가된 consumer 의 default offset 을 설정할 수 있다.
	* 만약, 최신 데이터부터 읽게 하고 싶다면 `largest` 를, 가장 초기 데이터부터 읽게 하고 싶다면 `earliest` 를 설정하면 된다.
* Q) 파티션 당 컨슈머가 1:1 로 배치되는 것인지?

# B) Related

# C) References
