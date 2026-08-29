---
title: "distcp"
aliases: []
tags:
  - hadoop
---

# A) `DistCp` ?

하둡은 클러스터내의 대규모 데이터 이동을 위한 DistCp(Distribute Copy) 기능을 제공합니다. 기본 파일 복사 명령인 `hadoop fs -cp` 로는 파일을 하나씩 복사하지만 `DistCp` 기능을 이용하면, 맵리듀스를 이용하여 대규모의 파일을 병렬로 복사합니다.

# B) 유의할 점

맵리듀스를 이용하여 작업을 처리하기 때문에 클러스터의 리소스를 이용하게 되고, 큐를 사용해야 한다면 큐 이름을 입력해야 합니다.

대규모 병렬 처리 작업이기 때문에 네트워크 사용량을 잘 확인해야 합니다. 너무 많은 매퍼를 할당 하면 네트워크 자원을 많이 사용하여 운영에 문제가 생길 수 있습니다.

운영 상황에서 `DistCp` 작업시 네트워크 사용량을 꼭 확인하는 것이 좋고, mapper 의 개수를 점진적으로 늘리는 것이 좋습니다. 또한 클러스터의 설정이 다르다면 복사 위치의 블록사이즈, 복제개수를 확인해야 합니다.

# C) 예시

```bash
# a 폴더를 b 로 복사 
$ hadoop distcp hdfs:///user/a hdfs:///user/b 

# a, b 폴더를 c로 복사 
$ hadoop distcp hdfs:///user/a hdfs:///user/b hdfs:///user/c

# mapper 개수 설정
hadoop distcp -m 10 hdfs://source-nn/dir hdfs://target-nn/dir
```

# D) Related

# E) References

* [1-DistCp - 빅데이터 - 하둡, 하이브로 시작하기](https://wikidocs.net/25261)
