---
tags: ["operating_system"]
---

# A) Iostat ?

iostat 는 disk IO 대한 통계를 보고하고 처리량, 사용률, 대기열 길이, transaction 비율 및 서비스 시간에 대한 측정 결과를 알수 있는 프로그램

* 평소 디스크에 베드 섹터라든지 이상이 없는데, 서버의 부하가 평소보다 높을 경우

# B) Iostat 옵션

```bash
iostat -dxm 1 -p ALL 
```

* `-d` : 디스크 사용량 정보를 출력
* `-x` : 확장 정보 출력
* `-m`: 초당 throughput 을 MB/s 로 출력 (default 는 KB/s)
* `-1`: iostat output 을 출력하는 시간 간격 (sec)
* `-p ALL`: 시스템의 모든 디바이스를 출력

일반적으로 SSD 에서는 `sda` 만 확인하면 되므로 `-p ALL` 옵션은 필요없는 것 같다.

# C) Install

```bash
yum -y install sysstat
```

# D) 해석

* `rrqm/s` : 디바이스 큐에 대기중인 초당 읽기 요청의 건수
* `r/s` : 디바이스에 요청한 초당 읽기 요청의 건수
* `rsec/s` : 디바이스에서 초당 읽어들인 섹터의 갯수
* `await` : 디바이스에서 처리되기 위해서 요청된 I/O 평균 시간 (밀리초, 1/1000 초). 큐에서 소요된 시간과 처리된 시간이 합쳐져 출력
* `%util` : 디바이스에서 요청한 I/O 작업을 수행하기 위해 사용한 CPU 시간 비율. 이 값이 100% 에 가까워지면 디바이스가 한계에 도달했다고 보면 된다
