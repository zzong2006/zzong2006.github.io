---
title: "Page Fault"
aliases: []
tags:
  - linux
---

# A) Page Fault ?

* [[Process]] 가 [[Page]] 를 요청했을 때, 그 [[Page]] 가 [[Memory]] 에 없는 상황
	* [[Process]] 의 부재에서 오류가 발생했을 뿐, [[Process]] 가 만든 오류는 아니다.
* [[Page Fault]] 가 발생하면, [[Process]] 가 해당 [[Page]] 를 사용할 수 있도록 [[swap 영역]] 에서 물리 [[Memory]] 로 옮겨야 한다 ([[swap in]]).
	* 만약 [[Memory]] 가 꽉 찼다면 메모리에 있는 [[Page]] 를 [[swap 영역]] 으로 내보내야 한다 ([[swap out]]).
	* 이때, 어떤 [[Page]] 를 보낼지 선정하는 알고리즘이 [[페이지 교체 알고리즘]] 이다.
