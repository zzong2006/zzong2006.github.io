---
layout: default
title:  "First Class Function"
category: python
order: 5
---

Python은 퍼스트 클래스 함수(First Class function)를 지원한다.

퍼스트 클래스 함수란, 다음과 같은 네가지 특징을 가진 함수를 의미한다.

1. 함수 자체를 인자(argument) 로써 다른 함수에 전달할 수 있다.
2. 다른 함수의 결과값으로 리턴 할수있다.
3. 함수를 변수에 할당할 수 있다.
4. 데이터 구조안에 저장할 수 있다.

여기서 위 특성 중, (1), (2)에 대해서 자세히 알아보겠다.    
이 부분을 이해하면, 나머지 (3), (4)도 쉽게 이해할 수 있다.



## (1) 함수 자체를 인자(argument) 로써 다른 함수에 전달할 수 있음

```python
def square(x):
    return x * x

def my_map(func, arg_list):
    result = []
    for i in arg_list:
        result.append(func(i)) # square 함수 호출, func == square
    return result

num_list = [1, 2, 3, 4, 5]

squares = my_map(square, num_list)

print(squares) 
```

```
[1, 4, 9, 16, 25]
```



## (2) 다른 함수의 결과값으로 리턴 할수있음

```python
def logger(msg):
    def log_message(): #1
        print('Log: ', msg)
    return log_message

log_hi = logger('Hi')
print(log_hi) 
log_hi() 
```

```
<function logger.<locals>.log_message at 0x7f6e7c0593b0>
Log:  Hi
```

위의 주석 `#1`에서 정의된 `log_message` 라는 함수를 `logger`의 반환값으로 설정하고, `log_hi` 변수에 할당했다. 이후, `log_hi`를 호출하여 `Log: Hi`라는 결과를 얻었다.

여기서 눈여겨봐야 할 중요한 점이 있다. `msg`는 지역 변수이므로, 함수가 호출된 이후에 메모리상에서 사라지므로 다시 참조할 수 없다. 그러나, `msg` 변수에 할당된 `Hi`라는 값이 `logger('Hi')` 에 의해 호출된 이후에도 참조되었다.

이런 `log_message` 같은 함수를 **클로저 (closure)** 라고 부르는데, 클로저는 다른 함수가 종료된 이후에도 그 함수의 지역 변수를 기억할 수 있다.

클로저 함수 `log_message`가 `msg`를 실제로 기억하고 있는지 알아보기 위해, `logger`함수를 global namespace에서 완전히 지운 후, `log_message`를 호출하여 보겠다.

```python
del logger # 글로벌 네임스페이스에서 logger 오브젝트를 지웁니다.

# logger 오브젝트가 지워진 것을 확인합니다.
try:
    print (logger)
except NameError:
    print ('NameError: logger는 존재하지 않습니다.')

log_hi() # logger가 지워진 뒤에도 Log: Hi"가 출력됩니다.
```

```
NameError: logger는 존재하지 않습니다.
Log:  Hi
```



### 실용적 예제

```python
# 함수를 리턴하는 함수
def html_tag(tag):
    
    def wrap_text(msg):
        print ('<{0}>{1}<{0}>'.format(tag, msg))
        
    return wrap_text

print_h1 = html_tag('h1') #1
print (print_h1) #2
print_h1('첫 번째 헤딩 타이틀') #3
print_h1('두 번째 헤딩 타이틀') #4

print_p = html_tag('p')
print_p('이것은 패러그래프 입니다.')
```

```
<function html_tag.<locals>.wrap_text at 0x7f6e7c059ef0>
<h1>첫 번째 헤딩 타이틀<h1>
<h1>두 번째 헤딩 타이틀<h1>
<p>이것은 패러그래프 입니다.<p>
```



## Reference

* [schoolofweb](http://schoolofweb.net/blog/posts/%ED%8C%8C%EC%9D%B4%EC%8D%AC-%ED%8D%BC%EC%8A%A4%ED%8A%B8%ED%81%B4%EB%9E%98%EC%8A%A4-%ED%95%A8%EC%88%98-first-class-function/)

