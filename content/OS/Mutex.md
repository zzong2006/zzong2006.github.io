---
title: "Mutex"
tags: ["operating_system"]
---

# A) Mutex ?

* 공유된 자원의 데이터를 여러 [[thread]] 가 접근하는 것을 막는 것
* 상호배제라고도 하며, [[Critical Section]] 을 가진 [[thread]] 의 Running time 이 서로 겹치지 않도록 각각 단독으로 실행하게 하는 기술이다.
	* [[Critical Section]]: 각 프로세스에서 공유 자원을 액세스하는 프로그램 코드 부분
* 다중 [[Process]] 들의 공유 리소스에 대한 접근을 조율하기 위해 synchronized 또는 lock 을 사용한다.
	* 즉, [[Mutex]] 객체를 두 스레드가 동시에 사용할 수 없다.
