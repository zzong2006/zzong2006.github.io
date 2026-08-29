---
title: "Cython"
aliases: []
tags:
  - python
  - language
---

# Cython?

Cython 은 Python 컴파일러다. 그래서 일반적인 Python code 를 컴파일 할 수 있지만, 중요한 code 의 performance 를 위해 static type 을 추가할 수 있다.

# Building Cython Code

([관련 링크](http://docs.cython.org/en/latest/src/quickstart/build.html))

Python 과 다르게, Cython 코드는 반드시 두 가지 stage 를 통해 컴파일되어야 한다.

* `.pyx` 나 `.py` 파일은 Cython 에 의해 `.c` 파일로 컴파일된다.
* `.c` 파일은 C 컴파일러에 의해 `.so` 파일 (Windows 에서는 `.pyd`) 로 컴파일되고, 컴파일 결과는 Python 세션에서 직접적으로 `import` 될 수 있다.
	* import 한다는 의미는 말 그대로 컴파일 후, `.py` 파일에서 `.pyx` 의 정의된 함수나 클래스를 import 해올 수 있다는 의미다.
	* setuptools 이 이 부분을 담당한다.

Cython 을 빌드하는 방법은 여러가지가 있다.

* setuptools 인 `setup.py` 를 작성한다: 일반적이고 추천되는 방법
* Pyximport 를 사용한다.
* `cython` 명령어를 사용해서 수동으로 `.pyx` 파일에서 `.c` 파일을 생성하고, 다시 `.c` 파일을 컴파일함

정리하면, 코드 작성 및 실행 프로세스는 다음과 같다: `pyx` 파일 작성, `setup.py` 작성, `python setup.py build_ext --inplace` 실행 후, 원하는 함수를 python 공간에서 import 해서 사용하기

# Faster Code via Static Typing ([관련 링크](http://docs.cython.org/en/latest/src/quickstart/cythonize.html))

All C types are available for type declarations: integer and floating point types, complex numbers, structs, unions and pointer types.

Typing Functions

* 함수 또는 변수 정의 시, `cdef` 사용
	* `cdef` 의 단점은 Python 공간에서 호출할 수 없다는 점이다. 이러한 문제를 해결하기 위해 `cpdef` 키워드를 사용할 수 있다. `cdef` 메소드와 비교했을 때 작은 오버헤드가 존재한다.
static typing 이 아무리 속도 gains 이 있다고 하더라도, 모든 함수나 변수에 이를 적용하는 것은 적절하지 않다.
* 가장 큰 문제는 가독성과 유연성이 감소한다. 그리고 오히려 느려질 수 있다 (e.g. 불필요한 type check, conversions 또는 slow buffer unpacking).
* 이러한 문제를 위해 profiling 과 annotation 이 중요하다.
	* Profiling 은 최적화의 첫번째 단계로, 어떤 부분에서 시간이 오래 걸리는지 확인할 수 있다.
	* Cython’s annotation 은 왜 내 코드가 오래걸리는지 말해줄 수 있다.

# 관련 파일들

## `pyx` Source File

* `pyx` 라는 것은 파이썬과 가장 유사한 문법으로 코딩을 하면 그것을 순수 C 로 소스 차원에서 변환해 주어 Python 에서 그대로 이용할 수 있게 만드는 것
* 예시) `cython cytest.pyx` -> `cytest.c` 파일 생성

## `pxd` Files

* `pyx` 에 추가로, Cython 은 `.pxd` 확장자 파일을 C header 파일과 같이 사용한다.

# Tips

* `cdef` 로 정의한 함수는 컴파일 후, 파이썬 모듈 (`.py`) 에서 호출할 수 없다.

# 외부 C 코드 사용하기

* Cython 개발 방법
	* `install` 대신 `pip setup.py develop` 으로 하면 코드 수정된 내역이 반영된다.

# With Numpy

[참고](https://cython.readthedocs.io/en/stable/src/tutorial/numpy.html)

pyx 파일 내에서 `cimport numpy as np` 정의를 통해 numpy 를 사용할 수 있다. 하지만 py 파일에서 작성하는 것처럼 속도는 별 차이가 없는데, 더 빠르게 만들려면 다음과 같은 팁을 사용하면 된다.

1. 모든 변수의 타입을 정의할 것
	1. 느림: `vmax = f.shape[0]`
	2. 빠름: `cdef int vmax = f.shape[0]`
2. 함수 parameter 의 타입도 정의할 것 (특히 numpy array)
	1. 느림: `def naive_convolve(np.ndarray f, np.ndarray g): …`
	2. 빠름: `def naive_convolve(np.ndarray[DTYPE_t, ndim=2] f, np.ndarray[DTYPE_t, ndim=2] g): … `
