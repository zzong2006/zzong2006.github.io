---
layout: default
title:  "Closure"
category: python
order: 6
---

클로저(Closure)는 함수의 종류를 의미한다. 클로저는 일반 함수와는 다르게, 프리 변수(free variable)를 복사하고 저장한 뒤, 후에 액세스할 수 있게 도와준다.

* **프리 변수**란 코드 블록 안에서 사용되었지만, 그 코드 블럭 안에서 정의되지 않은 변수를 뜻한다. 즉, 자신의 영역 밖에서 호출된 함수의 변수들 또는 레퍼런스(reference)들을 의미한다.



## 예제 코드

```python
def outer_func(): #1
    message = 'Hi' #3

    def inner_func(): #4
        print(message) #6

    return inner_func #5

my_func = outer_func() #2
my_func() #7
```

```
Hi
```



`message`는 `outer_func`의 변수다. `inner_func`는 해당 변수를 가져다 출력한다. 하지만, 주석 `#2`에서 확인할 수 있듯이 `outer_func()`이 호출된 이후에는 `message`는 지역 변수이므로 존재하지 않는다. 그럼에도 불구하고 주석 `#7`에서 수행된 `my_func()`에서 `message` 변수를 사용할 수 있는 이유는 `inner_func`이 클로저 함수이고, `message` 함수를 따로 저장하였기 때문이다.



## `__closure__`

그렇다면 도대체 클로저 함수는 어디다가 변수를 저장하는 것인가? 해답은 `__closure__`라는 매직 메소드에 존재한다. 

`__closure__` 라는 메소드는 `cell` 이라는 `tuple` 타입을 반환하는데, 이 `cell`의 `cell_contents` 안에는 `message` 변수의 값이 포함되어 있다.

```python
print(my_func)
print(dir(my_func))
print(type(my_func.__closure__)) #9
print(my_func.__closure__)  #10
print(my_func.__closure__[0])  #11
print(dir(my_func.__closure__[0]))  #12
print(my_func.__closure__[0].cell_contents)  #13
```



```python
# print(my_func)
<function inner_func at 0x1019dfed8>	

# print(dir(my_func))
['__call__', '__class__', '__closure__', '__code__', '__defaults__', '__delattr__', '__dict__', '__doc__', '__format__', '__get__', '__getattribute__', '__globals__', '__hash__', '__init__', '__module__', '__name__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'func_closure', 'func_code', 'func_defaults', 'func_dict', 'func_doc', 'func_globals', 'func_name']

# print(my_func.__closure__)
<type 'tuple'> 

# print(my_func.__closure__)
(<cell at 0x1019e14b0: str object at 0x1019ea788>,)

# print(my_func.__closure__[0])
<cell at 0x1019e14b0: str object at 0x1019ea788>

#  print(dir(my_func.__closure__[0]))
['__class__', '__cmp__', '__delattr__', '__doc__', '__format__', '__getattribute__', '__hash__', '__init__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'cell_contents']

# print(my_func.__closure__[0].cell_contents)
Hi
```

