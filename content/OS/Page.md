---
tags: ["linux", "operating_system"]
---

# 1. Page ?

Linux 는 I/O 성능을 높이기 위해서 Page Cache 를 사용한다.  

Linux 는 물리적인 저장/통신 장치와 데이터를 주고 받을 때 메모리에 먼저 적재한 후에 데이터를 주고 받는데 이는 동일한 데이터에 대한 접근을 할 경우 메모리에서 바로 가져오도록 하여 I/O 성능을 높이기 위함이다. 이를 Page 라는 단위로 관리를 하며 흔히 Page Cache 라고 이야기 한다.

따라서, 한번이라도 데이터를 읽거나 쓴 적이 있다면 메모리는 Page Cache 에 적재되고, `/proc/meminfo` 파일에서 cached 영역으로 표기 된다.

# 2. Related

# 3. References

* [Linux 메모리 효율을 위한 vfs_cache_pressure](https://lunatine.tumblr.com/post/28546340998/faq-linux-%EB%A9%94%EB%AA%A8%EB%A6%AC-%ED%9A%A8%EC%9C%A8%EC%9D%84-%EC%9C%84%ED%95%9C-vfscachepressure)
