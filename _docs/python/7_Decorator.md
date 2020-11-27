---
layout: default
title:  "Decorator"
category: python
order: 7
---

함수를 장식하는 기능, 데코레이터는 **함수를 수정하지 않은 상태에서 추가 기능을 구현할 때 사용**

클래스에서 메서드를 만들 때 `@staticmethod`, `@classmethod`, `@abstractmethod` 등을 붙였는데, 이렇게 @로 시작하는 것들이 데코레이터이다.



데코레이터는 클로저 함수의 개념을 활용한다. 다음과 같은 클로저 함수의 동작을 보자.

```python
def decorator_function(original_function):
    def wrapper_function():
        print ('{} 함수가 호출되기전 입니다.'.format(original_function.__name__))
        return original_function()
    return wrapper_function

def display_1():
    print ('display_1 함수가 실행됐습니다.')

display_1 = decorator_function(display_1)  #1

display_1()
```

```
display_1 함수가 호출되기전 입니다.
display_1 함수가 실행됐습니다.
```

위 코드에서 가장 먼저 호출되는 것은 `decorator_function`이다. `decorator_function`은 `decorator_function(display_1)` 에 의해 호출되어 `wrapper_function`을 반환한다. 그리고 `display_1()`은 `wrapper_function` 을 호출하게 되는데, 이때 `wrapper_function` 안에서  `original_function`인 `display_1` 함수가 호출된 결과값이 반환된다.

위와 같은 동작은 decorator를 이용하면 좀 더 간결하게 표현할 수 있다.

```python
@decorator_function  #1
def display_1():
    print ('display_1 함수가 실행됐습니다.')
    
display_1() # same as decorator_function(display_1)()
```

```
display_1 함수가 호출되기전 입니다.
display_1 함수가 실행됐습니다.
```



인수를 가진 함수에 decorator를 붙이려면 다음과 같이 `decorator_function`을 수정한다.

```python
def decorator_function(original_function):
    def wrapper_function(*args, **kwargs):  #1
        print ('{} 함수가 호출되기전 입니다.'.format(original_function.__name__))
        return original_function(*args, **kwargs)  #2
    return wrapper_function


@decorator_function
def display():
    print ('display 함수가 실행됐습니다.')


@decorator_function
def display_info(name, age):
    print ('display_info({}, {}) 함수가 실행됐습니다.'.format(name, age))

display()
print()
display_info('John', 25)
```

```
display 함수가 호출되기전 입니다.
display 함수가 실행됐습니다.

display_info 함수가 호출되기전 입니다.
display_info(John, 25) 함수가 실행됐습니다.
```

* 데코레이터 함수에 `*args`와 `**kwargs` 인자를 추가한 것을 확인할 수 있다.



굳이 가변 인자를 추가하지 않아도 된다. 아래 데코레이터 함수는 고정된 개수의 인자들을 입력으로 받는다. 

```python
def trace(func):          # 호출할 함수를 매개변수로 받음
    def wrapper(a, b):    # 호출할 함수 add(a, b)의 매개변수와 '똑같이' 지정
        r = func(a, b)    # func에 매개변수 a, b를 넣어서 호출하고 반환값을 변수에 저장
        print('{0}(a={1}, b={2}) -> {3}'.format(func.__name__, a, b, r))  # 매개변수와 반환값 출력
        return r          # func의 반환값을 반환
    return wrapper        # wrapper 함수 반환
 
@trace              # @데코레이터
def add(a, b):      # 매개변수는 두 개
    return a + b    # 매개변수 두 개를 더해서 반환
 
print(add(10, 20))
```

```
add(a=10, b=20) -> 30
30
```



일반적으로 데코레이터는 프로그램의 로깅(logging) 기능이나 성능을 테스트하기 위해서 많이 사용된다.

```python
def my_timer(original_function):  #1
    import time

    def wrapper(*args, **kwargs):
        t1 = time.time()
        result = original_function(*args, **kwargs)
        t2 = time.time() - t1
        print '{} 함수가 실행된 총 시간: {} 초'.format(original_function.__name__, t2)
        return result

    return wrapper


@my_timer  #2
def display_info(name, age):
    time.sleep(1)
    print 'display_info({}, {}) 함수가 실행됐습니다.'.format(name, age)

display_info('John', 25)
```

```
display_info(John, 25) 함수가 실행됐습니다.
display_info 함수가 실행된 총 시간: 1.00157594681 초
```



## 두 개의 decorator

하나의 함수에 두 개의 decorator 함수를 중첩하여 사용할 수 있다.

```python
import time

def my_func(original_function):
    print('my_func 함수 호출')
    print('인자 함수 {}'.format(original_function.__name__))
    
    def my_func_wrapper(a, b):
        print('my_func_wrapper 함수 호출')
        print('인자 함수 {}'.format(original_function.__name__))
        result2 = original_function(a, b)
        return result2
    
    return my_func_wrapper

def my_timer(original_function):
    start_time = time.time()
    print('my_timer 함수 호출')
    print('인자 함수 {}'.format(original_function.__name__))
    
    def my_timer_wrapper(name, age):
        print('my_timer_wrapper 함수 호출')
        print('인자 함수 {}'.format(original_function.__name__))
        result1 = original_function(name, age)
        end_time = time.time() - start_time
        print('실행 시간 {}'.format(end_time))
        return result1
    
    return my_timer_wrapper

@my_func
@my_timer
def display_info(name, age):
    time.sleep(1)
    print('{} -> {}'.format(name, age))
    
display_info('James', 30)
```

```
my_timer 함수 호출
인자 함수 display_info
my_func 함수 호출
인자 함수 my_timer_wrapper
my_func_wrapper 함수 호출
인자 함수 my_timer_wrapper
my_timer_wrapper 함수 호출
인자 함수 display_info
James -> 30
실행 시간 1.0018019676208496
```

* 복수의 데코레이터를 쌓아가면서 사용하면, 가장 아래쪽의 데코레이터 함수부터 실행이된다. 즉, `my_timer` 함수가 `display_info`를 인자로 받으면서 먼저 실행되고, 이 함수가 반환하는 값(`my_timer_wrapper`)가 `my_func`의 인자로 들어가고 실행된다.
* `my_func`에서는 `my_func_wrapper`를 반환하고, 최종적으로 `display_info('James', 30)`은 반환된 `my_func_wrapper`를 호출한다. 
* `my_func_wrapper`는 `my_func`이 인자로 받은 `my_timer_wrapper`를 호출하고, 다시 `my_timer_wrapper`는 인자로 받은 `display_info`를 호출하게 된다. 
* 그리고 `display_info`가 반환한 값은 아무것도 없으므로, `result1`은 `None`값이 되고, 이 `result1` 값은 `result2` 값으로 들어가게 된다. 결과적으로 `display_info('James',30)`는 `result2`를 반환하게 된다.

정리하자면 호출 순서는 다음과 같다. 괄호는 중첩된 데코레이터로 인해 `display_info('James', 30)` 수행 전 호출된 함수의 순서다.

(`my_timer` -> `my_func` ->)  `my_func_wrapper` -> `my_timer_wrapper` -> `display_info` --- (반환) --> `my_timer_wrapper` -> `my_func_wrapper` -> 최종 출력



## Reference

* [schoolofweb](http://schoolofweb.net/blog/posts/%ED%8C%8C%EC%9D%B4%EC%8D%AC-%EB%8D%B0%EC%BD%94%EB%A0%88%EC%9D%B4%ED%84%B0-decorator/)

