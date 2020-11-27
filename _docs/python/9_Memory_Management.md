---
layout: default
title:  "Memory Management(Allocation)"
category: python
order: 9
---





해당 포스팅의 메모리 관리는 CPython 기준으로 설명한다. pypy와 같은 다른 Python 종류는 모르겠다.

파이썬의 모든 메모리 관리는 private heap에서 이루어지며, 이 heap은 Python의 모든 객체와 데이터 구조를 포함한다. 

* 그리고 이 private heap은 파이썬의 가상 머신 또는 메모리 매니저가 내부적으로 알아서 처리해준다.

메모리 정리의 주된 사항은 reference counting을 이용하여 이루어진다. 즉, Python VM (Virtual Machine)이 한 객체에 대해 얼마나 많은 참조가 이루어질 것인지 확인하고, 더 이상 참조가 될것같지 않다면 자동으로 garbage collects에 의해 객체가 차지하고 있는 메모리를 해제한다.



## Memory Allocation in Python

파이썬에서 사용하는 메모리 종류는 총 4개다: code, data, stack, heap. 

* Code: 파이썬 코드(명령어)를 저장하는 메모리 공간이다.
* Data: 전역 변수 또는 정적 변수를 저장하는 메모리 공간이다.
  * 고정된 공간으로 컴파일 시 할당되는 공간이다.
* Stack: 지역 변수 또는 함수 (호출)을 저장하는 메모리 공간이다.
  * 고정된 공간으로 컴파일 시 할당되는 공간이다.
* Heap: 동적 메모리 공간으로, 객체를 저장한다.
  * 동적 공간으로 런타임 시 할당되는 공간이다.

구체적인 Memory Allocation 동작은 다음과 같다.

* 함수와 변수들(객체를 가리키는 reference)은 stack 메모리에 저장된다.
* instance와 objects들은 heap 메모리에 저장된다.
* stack frame은 함수의 호출에 생성된다.
  * stack frame은 호출된 함수가 반환되면 바로 사라진다.
* Garbage Collector (GC)는 reference count가 0인 죽은 객체(dead object)를 처리한다.



### 함수 호출 예시

```python
#main
y = 5
```

위와 같은 코드를 실행했을 때, stack 메모리에는 main 함수를 위한 공간(stack frame 이라고 부른다)을 생성하고 main 함수를 적재한다. 이후, `5`라는 `int` 객체를 heap 메모리에 생성하고, `y`라는 변수는 stack 메모리에 올려서  `5` 객체가 존재하는 heap 메모리 주소를 가리키게 한다.

<img src="https://i.loli.net/2020/11/28/uKZmFtBGaybxpSl.png" alt="image-20201128032930793" style="zoom: 80%;" />



```python
def f1(x):
    x = x * 2
    y = f2(x)
    return y

#main
y = 5
z = f1(y)
```

다음과 같은 `f1` 함수의 호출은 새로운 stack frame을 만들어 낸다. 이는 main stack frame위에 쌓이고, 변수 `x`를 `f1`함수의 지역 변수로 가지게 된다. 또한, `x = x * 2`를 수행시, `10`이라는 새로운 값이 만들어지므로, heap 메모리에 `10` 객체를 찾지 못한 경우, 해당 객체를 heap 메모리에 생성하고 지역 변수 `x`가 이를 가리키도록 만든다.

<img src="https://i.loli.net/2020/11/28/O53wJGZA2zvNmud.png" alt="image-20201128034149149" style="zoom:80%;" />



```python
def f2(x):
    x = x + 1
    return x

def f1(x):
    x = x * 2
    y = f2(x)
    return y

#main
y = 5
z = f1(y)
```

`f1` 은 `f2`를 호출함으로써 새로운 stack frame을 만들어내고, `f2`의 지역 변수 `x`도 stack 메모리에 만들어 낸다. `f2`의 `x = x + 1`는 `11`이라는 새로운 객체를 heap 메모리에 만들어 내고, 이를 반환하여 `f1`의 지역 변수 `y`가 새로운 `11` 객체를 가리키게 만든다. 물론, 반환 시, `f2`에 해당하는 stack frame은 사라지게 된다 (그림에서는 지우지 않음).

<img src="https://i.loli.net/2020/11/28/mQzvbKPfVWJ23Y8.png" alt="image-20201128034529023" style="zoom:80%;" />



### 클래스 호출 예시

```python
class Car:
    def __init__(self, w):
        self.wheels = w
        
# main
c = Car(4)
```

`c = Car(4)` 를 수행함으로써, `Car` 객체가 만들어지고, `main` frame stack 위에 `__init__` frame stack이 쌓이게 된다. 이때, 함수의 인자인 `self`와 `w`도 같이 stack frame에 만들어 진다.

 `__init__` 에서는 `self.wheels = w`라는 assign이 발생하므로, 만들어진 `Car` 객체에는 `wheels` 이라는 새로운 객체들 만들고, 이것이 `4` 객체를 가리키게 한다(`w` 는 `4` 객체를 가리키는 인자이기 때문). 그리고 최종적으로 stack frame에 존재하는 `c` 변수는 heap 메모리의 `Car` 객체를 가리키게 한다.

<img src="https://i.loli.net/2020/11/28/43NbXOxDafVCrzn.png" alt="image-20201128035055667" style="zoom:80%;" />