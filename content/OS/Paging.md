---
title: "Paging"
aliases: []
tags:
  - operating_system
---

# A) Paging ?

페이징이란 [[external fragmentation]] 의 발생을 완전히 차단하기 위하여 적용한 방법으로, 프로세스가 적재되는 [[Memory|메모리]] 의 논리 주소를 Page 라고 불리는 고정된 크기의 블록들로 분할하여 관리하는 기법이다.

* 나눠진 물리적 메모리의 블럭을 frame 이라 부르고, 동일한 크기로 나눠진 논리적 메모리의 블럭을 Page 라 부른다.
* 그리고, 공간을 나누다 보니 프로세스가 적재되는 물리적 공간은 연속적이지 않을 수 있다.
* Page 와 frame 을 대응에서 mapping 이 발생하므로, 이를 위한 mapping table, 즉, paging table 을 사용한다.

페이징은 external fragmentation 대신에 internal fragmentation 이 발생한다. 왜냐하면 일반적으로 프로세스가 요구하는 논리적 메모리 공간이 고정된 크기로 정확히 나눠떨어지지 않기 때문이다.

<img src="/images/img-205c8127dd.svg" style="zoom:67%;" />
