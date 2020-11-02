---
layout: default
title:  "Interview Question"
category: python
order: 1
---

> Python 관련 인터뷰 정리

## Python의 데이터 모델은 어떻게 되는가?

python은 object-oriented programming(OOP) language이다. 즉, 모든 데이터는 객체나 객체 간의 관계로 표현된다. 

모든 객체는 identity, type, value를 가진다. 여기서 identity는 한번 만들어 진 후에 변경되지 않고,  이를 객체의 주소로 생각할 수 있다.

* `id()`함수를 사용하면 객체의 identity를 정수로 표현한 값을 확인할 수 있다.

객체는 절대로 명시적으로(explicitly) 없애지 못한다. 대신, 그 객체가 사용되지 않을 것이라 판단되면(unreachable), garbage collector에 의해 수집된다.

## Python은 interpreted language이다. 그 의미는?

interpreted language는 컴파일러를 거쳐서 기계어로 변환되지 않고 바로 실행되는 프로그래밍 언어를 의미한다.

python 코드를 실행할 때, python code(`.py`)는 bytecode(`.pyc` or `.pyo`)로 변환되고 가상 머신(virtual machine)에 전송된 후 실행된다.
* Bytecode는 interpreter(인터프리터)에 의해 실행될 수 있는 low-level의 명령어 집합을 의미한다.
  * 코드가 compile되는 행위는 C++과 같다. 다만, CPU에서 직접적으로 실행되는 기계어로 변환되지 않고 bytecode로 바뀐다.
* 만약, 반복적으로 python 코드를 실행하게 된다면, interpreter는 코드가 수정되지 않는 한 기존의 bytecode를 재사용한다. 
  * time stamp를 체크하여 코드가 수정되지 않았다는 것을 확인한다.

Interpreted language는 플랫폼에 구애받지 않는다는 것이 장점이다. 

* Interpreter와 bytecode의 버전만 동일하다면, 어떤 플랫폼(윈도우, 맥 등)에서든 실행시킬 수 있다.

## Garbage collection 이란 무엇인가?

Garbage collector에 의해 수행되는 동작으로, 더 이상 사용하거나 참조되지 않는 프로그램 내의 객체들을 메모리에서 제거하는 작업을 의미한다.

Garbage collection의 동작은 reference counting으로 단순히 설명할 수 있다.
* Garbage collector는 객체들에 대한 참조 횟수를 추적하여, 그 횟수가 0에 도달할 경우 해당 객체를 삭제한다.
* 참고로, reference counting은 python에서 비활성화 할 수 없는 동작이다.

## Python은 dynamically typed language이다. 그 의미는?

코드가 실행되기 전까지 변수의 type(타입)을 확인할 수 없다는 것을 의미한다. 그래서 python에서 선언(declaration)은 어떤 의미도 없다.

변수가 선언되면, 변수의 값은 메모리에 저장되고, 그 값은 변수의 이름과 묶인다(bind). 그리고 실행 후에 변수의 이름을 통하여 값을 확인한 후, 그 변수의 type을 확인한다.  

## `lambda`가 무엇인지? 왜 쓰는 것인지?

`lambda`는 람다 표현식이라고 불리며, 이름이 없는 익명 함수다. 인라인(in-line)으로 정의된다. 

함수를 간편하게 작성할 수 있어서, 다른 함수의 인수로 함수가 필요로 할 때 주로 사용한다.

* 사용 예시 

     ```python
     mul = lambda a, b : a * b
     print(mul(2, 5))    # output => 10
     ```
     
     `lambda`는 익명 함수이기 때문에, 이름(변수)를 할당해주지 않으면 사용할 수 없다. 

## namespace는 무엇인지? 왜 사용하는 것인지?

네임스페이스라고 불리며, 객체와 이름 간 매핑 정보를 포함하는 공간을 의미한다.

프로그램 내에서 객체(object)들의 이름을 충돌없이 사용하기 위해서 namespace를 사용한다. 

* 같은 이름을 여러 객체들이 공통으로 사용할 수 있도록, namespace는 dictionary를 활용하여, 이름(key)-객체(value)의 형식으로 저장한다.

namespace에는 세가지 계층적 종류가 존재한다. 가장 낮은 단계부터 1) local, 2) global, 3) built-in namespace가 존재한다.
1. local namespace: **함수** 내에서 정의되는 이름들을 포함하는 namespace. 이 namespace는 함수가 호출될 때 임시로 생성되었다가 함수가 끝나면(return) 초기화된다.
2. global namespace: **프로젝트**에서 import되는 여러 **패키지, 모듈**들에서 사용하는 이름들을 포함하는 namespace. 이 namespace는 스크립트에서 모듈 또는 패키지가 import될 때 생성되고, 스크립트 실행이 종료되면 사라진다.
3. built-in namespace: python의 핵심 built-in 함수 또는 여러 types들의 이름들을 포함하는 namespace.

* 주로 낮은 단계의 namespace를 안에 있다(inner)고 하며, 높은 단계의 namespace를 밖에 있다(outer)고 한다.
  * outer namespace에서 inner namespace에 접근할 수 없다. 

## 객체의 복사는 어떻게 하는가? [출처](https://blueshw.github.io/2016/01/20/shallow-copy-deep-copy/)

총 세가지가 존재한다.

*  1) `=`를 이용한 단순 복사, 2) Shallow Copy (얕은 복사), 3) Deep Copy (깊은 복사)

1. 단순 복사

   * 복사하려는 객체의 종류에 따라 복사 방식이 바뀐다. 
     * 변경 가능(mutable)한 객체일 경우, 변수에 그 객체의 주소 값을 복사한다. (e.g. `list`)
     * 변경 불가능(immutable)한 객체일 경우, 변수에 그 객체와 값이 동일한 새로운 객체를 할당한다. (e.g. `int`)

2. Shallow Copy (얕은 복사)

   * Shallow Copy는 mutable한 객체도 값이 동일한 새로운 객체를 할당해준다(편의를 위해 이를 완벽히 복사한다고 칭하자). 

     * 다만, mutable한 객체가 또 다른 mutable객체를 포함할 경우(복합 객체의 경우), 가장 바깥의 객체만 완벽히 복사한다.

       ```python
       a = [1, [1, 2, 3]]
       b = copy.copy(a)    # shallow copy 발생
       print(b)    # [1, [1, 2, 3]] 출력
       b[0] = 100
       print(b)    # [100, [1, 2, 3]] 출력,
       print(a)    # [1, [1, 2, 3]] 출력
       
       c = copy.copy(a)
       c[1].append(4)    # 리스트의 두번째 item(내부리스트)에 4를 추가
       print(c)    # [1, [1, 2, 3, 4]] 출력
       print(a)    # [1, [1, 2, 3, 4]] 출력
       ```

3. Deep Copy

   * 복합 객체의 경우라도 **재귀적으로** 객체 내의 모든 객체들을 완벽히 복사하여, 새로운 객체를 변수에 할당한다.

     ```python
     a = [1, [1, 2, 3]]
     b = copy.deepcopy(a)    # deep copy 실행
     print(b)    # [1, [1, 2, 3]] 출력
     b[0] = 100
     b[1].append(4)
     print(b)    # [100, [1, 2, 3, 4]] 출력
     print(a)    # [1, [1, 2, 3]] 출력
     ```

## PEP8이란 무엇인가?

PEP는 Python Enhancement Proposal을 의미한다. 

PEP는 python 코드의 가독성을 최대화 하기 위해 어떻게 코드를 format해야 할지에 대한 규칙들을 모아놓은 집합이다. 

## 모듈이란?

모듈(Module)은 하나의 파일 `.py`을 가리킴 

* 모듈은 파이썬 코드를 논리적으로 묶어서 관리하고 사용할 수 있도록 돕는 것

파이썬 모듈 `.py` 파일은 `import` 하여 사용할 수 있을 뿐만 아니라,   
해당 모듈 파일 안에 있는 스크립트 전체를 바로 실행할 수도 있다. 

  * ```python
    # run.py
    import sys
    def openurl(url):
        #..본문생략..
        print(url)
     
    if __name__ == '__main__':
        openurl(sys.argv[1])
    ```


파이썬에서 모듈을 import해서 사용할 경우 그 모듈 안의 `__name__` 은 해당 모듈의 이름이 되며, 모듈을 스크립트로 실행할 경우 그 모듈 안의 `__name__`은 `"__main__"` 이 된다.




1. ㅇㅇㅇㅇ

   * 