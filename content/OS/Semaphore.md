---
tags: ["operating_system"]
---

# A) Semaphore ?

* 현재 공유 자원에 접근할 수 있는 [[thread]] 또는 [[Process]] 의 수를 나타내는 값을 설정하여 [[mutual exclusion]] 를 달성하는 기법
	* [[Semaphore]] 는 리소스 상태를 나타내는 간단한 카운터를 사용하며, 이는 OS 또는 [[Kernel]] 에서 지정된 값이다.
* 일반적으로 비교적 긴 시간을 확보하는 리소스에 대해 이용한다.
* 각 [[Process]] 는 [[Semaphore]] 값을 확인하고 변경할 수 있다.
	* 사용 중이지 않는 자원의 경우 그 process 가 즉시 자원을 사용할 수 있다.
	* 이미 다른 process 에 의해 사용 중이라는 사실을 알게 되면 재시도하기 전에 일정 시간을 기다려야 한다.
	* Semaphore 을 사용하는 process 는 그 값을 확인하고, 자원을 사용하는 동안 그 값을 변경함으로써 다른 semaphore 이용자들이 기다리도록 해야한다.

# B) References
