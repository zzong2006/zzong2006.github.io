---
title: "garbage collection"
tags: ["language", "python"]
aliases: ["garbage collector"]
---

# A) Garbage Collection ?

garbage collection 에 의해 수행되는 동작으로, 더 이상 사용하거나 참조되지 않는 프로그램 내의 객체들을 메모리에서 제거하는 작업을 의미한다.

garbage collection 의 동작은 reference counting 으로 단순히 설명할 수 있다. garbage collector 는 객체들에 대한 참조 횟수 (reference count) 를 추적하여, 그 횟수가 0 에 도달할 경우 해당 객체를 삭제한다.

# B) 참고

* `sys.getrefcount(변수 이름)` 으로 참조 횟수를 확인 가능하다.
* reference counting 은 python 에서 비활성화 할 수 없는 동작이다.

# C) References
