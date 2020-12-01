---
layout: default
title:  "Memory Fragmentation"
category: Operating System
order: 6
---

연속 메모리 할당



## MMU(Memory Management Unit)

CPU 코어 안에 탑재되어 가상 주소를 실제 메모리 주소로 변환해주는 장치

제한된 물리적 크기의 메모리에 여러 프로세스를 올리기 위해, 실제로 메모리에 적재되는 내용은 프로그램의 일부만 적재되게 만든다.

CPU는 MMU를 통해 메모리에 요청을 하면, MMU는 사용하지 않는 메모리 블럭을 할당해준다.

* 이러한 블럭을 페이지 프레임(하드웨어 관점), 또는 페이지(소프트웨어 관점)이라고 한다.
* 가상 메모리와 실제 물리 메모리는 같이 Mapping되는데, 

## Contiguous allocation





## Paging

가상 메모리를 고정된 크기로 나누



## Segmentation

메모리를 서로 크기가 다른 논리적인 블록 단위인 세그먼트로 분할하고, 메모리를 할당하여 물리 주소를 논리 주소로 변환하는 것을 의미함



세그멘테이션 