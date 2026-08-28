---
title: "Python"
tags: ["programming", "language"]
---

# A) Python 이란?

Python은 [[object-oriented programming]] 언어로, 모든 데이터는 객체나 객체 간의 관계로 표현된다.

## A.1) 객체의 구성 요소

모든 객체는 세 가지 속성을 가진다:
- **Identity**: 객체 생성 후 변경되지 않는 고유 식별자 (메모리 주소). `id()` 함수로 확인 가능
- **Type**: 객체의 자료형
- **Value**: 객체가 담고 있는 값

객체는 명시적으로 삭제할 수 없으며, unreachable 상태가 되면 [[garbage collector]]에 의해 수집된다.

# B) 메모리 관리

Python은 변수에 값을 직접 저장하지 않는다. 값 객체는 별도의 메모리 공간에 저장되고, 변수는 해당 객체를 가리키는 포인터 역할을 한다.

동일한 값을 가진 변수들은 같은 객체를 참조한다:

```python
a = 10
b = 10
c = 20

print(id(a))  # 140734913394752
print(id(b))  # 140734913394752 (a와 동일)
print(id(c))  # 140734913395072
```

# C) 언어적 특징

## C.1) Interpreted Language

Python은 [[software/Interpreted language]]이다.

- 소스 코드(.py)는 bytecode(.pyc)로 컴파일된 후 [[virtual machine]]에서 실행된다
- Bytecode는 인터프리터가 실행하는 low-level 명령어 집합이다
- C++처럼 컴파일 과정이 있지만, 기계어가 아닌 bytecode로 변환된다는 차이가 있다
- 코드가 수정되지 않으면 기존 bytecode를 재사용한다 (timestamp 체크)

## C.2) Dynamically Typed Language

Python은 동적 바인딩(dynamic binding)을 수행한다. 바인딩([[binding]])이 런타임에 발생하고 실행 중 변경 가능하다.

**변수의 동적 바인딩:**
- 코드 실행 전까지 변수의 type을 알 수 없다
- 변수 선언(declaration)은 의미가 없으며, 실행 후에야 type이 결정된다

**함수의 동적 바인딩:**
- 실행 파일 생성 시 호출할 함수의 메모리 주소가 확정되지 않는다
- 실행 시점에 함수 주소가 결정되며, 이를 위한 저장 공간(4byte)을 미리 확보한다
- 실행 여부가 불확실한 함수를 위해 공간을 할당해야 하므로 메모리 효율이 떨어질 수 있다

# D) 실행 과정

## D.1) Compilation

- 파이썬 코드를 컴파일러가 bytecode로 변환
- 변환된 `.pyc` 파일은 `__pycache__` 디렉토리에 저장

## D.2) Interpretation

- Python Virtual Machine(PVM)이 bytecode를 기계어로 변환
- PVM은 시스템의 OS와 processor에 맞는 기계어로 변환한다
- Line by line 변환으로 속도가 느리며, 이를 보완하기 위해 [[JIT]] 컴파일러를 사용한다
