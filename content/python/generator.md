---
tags: ["python"]
aliases: ["생성자"]
---

# Generator ?

generator 는 [[iterator]] 를 생성해주는 함수 (method) 다.

Iterator 는 클래스에 `__iter__`, `__next__` 또는 `__getitem__` 메서드를 구현해야 하지만, [[generator]] 는 함수 안에서 `yield` 라는 키워드를 사용해서 값을 지정해준다.

그래서 제너레이터는 이터레이터보다 훨씬 간단하게 작성할 수 있다.

# 예시

```python
def number_generator(stop):
    n = 0              # 숫자는 0부터 시작
    while n < stop:    # 현재 숫자가 반복을 끝낼 숫자보다 작을 때 반복
        yield n        # 현재 숫자를 바깥으로 전달
        n += 1         # 현재 숫자를 증가시킴
 
for i in number_generator(3):
    print(i)
```

# Generator 표현식

```python
(식 for 변수 in 반복가능한객체)
```

* 리스트 표현식을 사용할 때 `[ ]`(대괄호) 를 사용했다.
* 같은 리스트 표현식을 `( )`(괄호) 로 묶으면 제너레이터 표현식이 된다.
* 리스트 표현식은 처음부터 리스트의 요소를 만들어내지만,

Generator 표현식은 필요할 때 요소를 만들어내므로 메모리를 절약할 수 있다.

```python
>>> [i for i in range(50) if i % 2 == 0]
[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22,
24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48]

>>> (i for i in range(50) if i % 2 == 0)
<generator object <genexpr> at 0x024F02A0>
```

# References
