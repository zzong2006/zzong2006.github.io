---
layout: default
title:  "Memory Fragmentation"
category: Operating System
order: 6
---

## External Fragmentation (외부 단편화)

메모리에 가용할 공간이 충분히 있음에도 불구하고, 해당 공간들이 연속적이지 않아서 프로그램의 메모리 적재 요청을 수행할 수 없는 것

* 이렇게 메모리 중간 중간에 남는 공간들을 hole 이라 한다.
* 이러한 문제를 해결하기 위해서 Compaction 이라는 작업을 수행한다. 
  * Compaction은 메모리에 적재된 process를 다시 디스크와 같은 secondary storage에 옮기고 이를 다시 fragmentation이 없도록 메모리에 적재하는 방법이다.
  * 하지만 메모리에 비해 디스크는 매우 느리다. 결과적으로, I/O 병목 현상이 발생한다.

![Internal and external fragm](https://i.loli.net/2020/12/02/Jj8BwxZpm5CAkNM.gif)

## Internal Fragmentation (내부 단편화)

한 프로세스에게 **할당된** 메모리 블록이 필요한 공간보다 커서, 메모리의 일부분이 사용하지 않고 낭비되어 다른 프로세스가 해당 부분을 사용할 수 없을 때

* External 이랑 헷갈리면 안되는게, External에서 발생한 메모리는 실제로 사용 가능하다. 다만, 그 공간들이 너무 작을뿐이다. 반대로, Internal은 아무리 공간이 커도, 다른 프로세스가 할당받았기 때문에 사용할 수 없다. 

![Internal fragmentation](https://i.loli.net/2020/12/02/tiWbcdHNs9Axjlq.gif)

### Fit Strategy (first, best, worst)

프로세스를 넣기 전에 External Fragmentation을 최소화하도록 하는 프로세스의 메모리 적재 전략을 fit 이라 한다.

1. First Fit
   * 가장 최초로 발견되는 hole에 적재를 한다.
   * 나머지 fit 전략 중 가장 빠르다 (hole을 비교할 필요가 없으므로)
2. Best Fit
   * Allocate the **smallest hole** that is big enough
   * 가능한 모든 hole에 한번씩 넣어보면서, 가장 external fragmentation이 적게 발생하는 곳에 적재시킨다.
3. Worst Fit
   * Allocate the **largest hole**
   * Best Fit과 마찬가지로 모든 hole을 검사해봐야 한다.

![SOP ](https://i.loli.net/2020/12/02/PnQEhI6Z5acCxdK.png)



## Paging

페이징이란, external fragmentation의 발생을 완전히 차단하기 위하여 적용한 방법으로, 프로세스가 적재되는 메모리의 논리 주소를 Page라고 불리는 고정된 크기의 블록들로 분할하여 관리하는 기법이다.

* 나눠진 물리적 메모리의 블럭을 frame 이라 부르고, 동일한 크기로 나눠진 논리적 메모리의 블럭을 Page라 부른다.
* 그리고, 공간을 나누다 보니 프로세스가 적재되는 물리적 공간은 연속적이지 않을 수 있다.
* Page와 frame을 대응에서 mapping이 발생하므로, 이를 위한 mapping table, 즉, paging table을 사용한다.

또한, external fragmentation 대신에 internal fragmentation이 발생한다.

* 일반적으로 프로세스가 요구하는 논리적 메모리 공간이 고정된 크기로 정확히 나눠떨어지지 않기 때문이다.

<img src="https://os.phil-opp.com/paging-introduction/paging-page-tables.svg" style="zoom:67%;" />





## Segmentation 

Paging 기법과 달리, 논리 메모리를 서로 크기가 다른 논리적 단위인 세그먼트로 분할하고, 이를 물리 메모리 주소의 연속적인 공간에 mapping 시키는 방법이다. 

* Paging과 마찬가지로, segmentation도 segment table을 사용한다. 해당 테이블에는 세그먼트의 시작 주소(base)와 길이(limit) 정보가 담겨있다.



## MMU(Memory Management Unit)

CPU 코어 안에 탑재되어 가상 주소(또는 논리 주소)를 실제 메모리 주소로 변환해주는 장치

* CPU는 MMU를 통해 메모리에 요청을 하면, MMU는 사용하지 않는 메모리 블럭을 할당해준다.

![image-20201202100321634](https://i.loli.net/2020/12/02/PVAUKDxNbLX3dfl.png)

* 이러한 블럭을 페이지 프레임(하드웨어 관점), 또는 페이지(소프트웨어 관점)이라고 한다.
* Contiguous allocation (연속 (메모리) 할당)
  * hole 발생

논리 주소가 연속적이면 물리 주소도 연속적으로 배치되는 것 