---
layout: default
title:  "Built-in Function"
category: python
order: 3
---

`all(반복 가능한 객체)`

* 반복 가능한 객체의 요소가 모두 참이면 `True`, 하나라도 거짓이면 `False`
* 예) `all([1, 2, 3])`은 `True`, `all([1, 0, 3])`은 `False`

`any(반복 가능한 객체)`

* 반복 가능한 객체의 요소가 하나라도 참이면 `True`, 모두 거짓이면 `False`
* 예) `any([1, 0, 0])`은` True`, `any([0, 0, 0])`은 `False`

`zip(반복 가능한 객체, ...)`

* 반복 가능한 객체 여러 개를 넣으면 요소 순서대로 튜플로 묶어서 zip 객체를 반환

* 예) `list(zip([1, 2, 3], [97, 98, 99]))`는 `[(1, 97), (2, 98), (3, 99)]`

`super()`

* 현재 클래스의 부모 클래스 인스턴스(객체)를 반환

`eval('문자열')`

* 문자열 형태의 python 코드를 실행하고 결과를 반환 (문자열을 python interpreter에서 실행)
* `eval(print(1,2))`는 `1 2` 출력

`bytes(바이트)`

* 바이트 객체를 반환(읽기 전용), bytes는 바이트 단위(8비트)로 값을 저장하는 자료형
* `bytes(b'hello')`는 `b'Hello'`