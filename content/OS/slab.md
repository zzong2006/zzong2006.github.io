---
tags: ["linux"]
---

# A) Slab ?

[[cache]] 는 다수의 slab 의 집합으로 구성되고, 각 slab 은 Slab Object 의 집합으로 구성된다. 각 Slab 은 Page Size 크기를 갖는다 (일반적으로 Page Size 는 4kb).

Linux 의 커널은 자료구조로 Slab 을 사용한다. 어떠한 파일을 생성할 때 파일의 정보를 담고 있는 [[inode]] 와 [[dentry]] 는 보다 빠른 데이터 접근을 위해서 커널의 Slab 자료구조에 추가된다.

Linux 커널에서 커널과 디바이스 드라이버, 파일시스템 등은 영구적이지 않은 데이터들을 저장하기 위한 공간이 필요한데 (inode, task 구조체, 장치 구조체 등) 이것이 slab 구조하에 관리 되고 있다. `/proc/meminfo` 파일에서 확인할 수 있는 Slab 항목은 이러한 데이터들의 메모리상 크기를 의미한다. 그래서 kernel cache 라고도 표현한다.

이 영역은 메모리가 부족해지면 자동으로 회수해서 이슈는 없지만 간혹 성능이 낮아지는 경우가 있다.

# B) 관련 이슈

종종 [[Linux]] 메모리 현황을 확인해보면 Free 상태로 나타낸 경우는 거의 없고, 대부분 Used 가 차지한것을 볼 수 있다.

이러한 이슈는 동작하고 있는 프로세스의 성격과 관련이 높다. 프로세스가 주로 하는 작업의 패턴을 확인 해 본 결과, 특정 파일들을 다량으로 생성하고 이 데이터를 가공처리하는 작업을 반복하고 있었다. 특히 이러한 작업 과정에서 생성되고 삭제되는 파일이 매우 많은 것으로 확인 되었다.

파일을 빈번하게 생성/삭제 하거나 다량의 파일을 다루는 시스템의 경우 해당 파일을 자주 재활용하지 않는다면 (즉, 생성/기록 후에 데이터를 지속해서 접근하여 읽지 않는 경우) 캐시에 메모리를 사용하기 보다는 I/O 를 위한 버퍼 또는 프로세스에 할당되어 활용되는 편이 좋다.

# C) Related

# D) References

* [slabtop | Ssup2 Blog](https://ssup2.github.io/command_tool/slabtop/)
* [faq-linux-메모리-효율을 위한 vsf_cache_pressure](https://lunatine.tumblr.com/post/28546340998/faq-linux-%EB%A9%94%EB%AA%A8%EB%A6%AC-%ED%9A%A8%EC%9C%A8%EC%9D%84-%EC%9C%84%ED%95%9C-vfscachepressure)
