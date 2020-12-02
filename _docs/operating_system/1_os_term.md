---
layout: default
title:  "OS Terms"
category: Operating System
order: 0.9
---

### Synchronization 

프로세스 또는 스레드들이 수행되는 시점을 조절하는 것

### Race Condition

두 개 이상이 concurrent한 스레드들이 공유된 자원에 접근하려고 할 때, 동기화 메커니즘 없이 접근하려고 하는 상황을 의미한다.

#### VS. Deadlock (교착 상태)

교착 상태는 두 개 이상의 스레드들이 서로 점유한 자원을 해제할 때까지 무한정 **기다리는 상태**를 의미한다. (실행하지 않음)

* 반대로, race condition은 두 개 이상의 스레드들이 **동시에 실행되어서**, 순차적으로 실행된 결과 다르거나 잘못된 결과를 보이는 현상을 의미한다. (실행함)

### 물리적 주소 (Physical Address)

램 용량은 실제 물리적인 메모리의 주소 범위다. 

* 이 물리적인 메모리 주소를 할당 하는 것을 물리적 주소 지정이라고(Physical Addressing) 한다. 
* 물리적 주소 지정의 특징은 메인 메모리 크기에 따라서 지정 가능한 주소 범위가 결정된다는 것이다. 

## Binding

(Address) binding 이란, 특정 메모리 주소에 데이터를 저장하는 것을 의미한다. 

### Compile Time Binding

컴파일하는 시점에 논리적 주소를 물리적 주소로 변환하는 것을 의미한다.

### Load Time Binding

프로그램을 실행 전 메모리에 올릴 때, 바인딩할 주소 값을 결정하는 방법

