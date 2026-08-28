---
title: "partition(Spark)"
tags: ["Spark"]
aliases: ["partition"]
---

# A) Spark Partition ?

partition 은 [[mlops/resilient distributed datasets|RDD]]s 나 Dataset 를 구성하고 있는 최소 단위 객체이며, 스파크의 성능과 리소스 점유량을 크게 좌우할 수 있는 RDD 의 가장 기본적인 개념이다.

데이터 partitioning 은 데이터를 여러 클러스터 노드로 분할하는 메커니즘을 의미한다.

각 파티션은 서로 다른 노드에서 분산 처리되므로, **1 Core = 1 Task = 1 Partition** 이다. 여기서 Spark 의 최소 연산을 Task 라고 표현한다.

partition 의 수는 core 수를 결정할 뿐만 아니라 각 partition 의 크기를 결정한다. 결과적으로, Core 당 필요 메모리 크기도 결정하게 된다. 따라서, partition 의 크기와 수가 Spark 성능에 큰 영향을 미치는데, 통상적으로는 partition 의 크기가 클수록 더 많은 메모리가 필요하고, 적은 수의 partition 이 할당된다.

즉, Partition 의 수를 늘리는 것은 Task 당 필요한 메모리를 줄이고 병렬화의 정도를 늘린다.

일반적으로 파티션 크기는 128MB 를 default 로 설정한다. 파일을 읽을 때 이보다 크면 파티션 크기만큼 쪼개면서 파일을 읽고, 이보다 작다면 그대로 읽어서 파일 하나당 partition 하나를 구성한다.

# B) References

* https://tech.kakao.com/2021/10/08/spark-shuffle-partition/
