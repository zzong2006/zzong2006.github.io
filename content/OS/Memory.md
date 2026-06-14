---
tags: ["operating_system"]
aliases: ["메모리"]
---

# A) Memory ?

# B) 메모리의 구성 요소 4 개

![https://i.loli.net/2020/10/19/jGfJd8MyWkE2Awu.png](https://i.loli.net/2020/10/19/jGfJd8MyWkE2Awu.png)

## B.1) Code

실행할 프로그램의 코드가 저장되는 영역 (컴파일 시 크기가 결정됨)

## B.2) Data

전역 변수, static variable 등 컴파일 시 결정되는 것들에 대한 영역

## B.3) [[stack]]

* 지역 변수, parameters, return value 등 임시로 사용하는 값들에 대한 영역 (컴파일 시 크기가 결정됨)
* 데이터가 높은 주소부터 낮은 주로소 쓰여진다는 특징이 존재함
* parameters 와 return value 는 함수 호출 시 생성되었다가 끝나면 그 영역을 반환함

## B.4) [[Heap]]

new, malloc 등을 통한 동적 할당 객체에 대한 영역 (런타임 시 그 크기가 결정됨)

# C) 메모리 관리의 이중성 ?

[[Process]] 입장에서는 [[Memory]] 를 독차지하려 하고, [[Memory]] 관리자 입장에서는 되도록 관리를 효율적으로 하고 싶어 하는 것
