---
layout: default
title:  "Magic Methods"
category: python
order: 4
---

클래스 안에 정의할 수 있는 특별한 메소드로, 클래스를 `int`, `str`, `list` 등 의 python built-in type과 같은 동작을 하게 해준다.

`__init__` 에서 `_`가 두개 붙은 것을 던더(double under, `__`) 라고 부른다. 그래서 매직 메소드를 던더 메소드 라고도 부른다.

`+`, `-`, `>`, `<` 등의 operator도 매직 메소드를 호출한다.

* 대표적인 예로, `a+b`의 경우 `a.__add__(b)`를 호출하는 것과 동일하다.



만약, 클래스를 상속한 경우, 매직 메소드 역시 자동으로 자식 클래스가 상속 받게된다.

```python
# int를 부모 클래스로 가진 새로운 클래스 생성
class MyInt(int):
    pass

# 인스턴스 생성
my_num = MyInt(5)

# 덧샘 실행
print(my_num + 5)  # => 10
```



Overriding을 통해서 operator의 동작을 바꿀수도 있다.

```python
# int를 부모 클래스로 가진 새로운 클래스 생성
class MyInt(int):
    # __add__ 변경
    def __add__(self, other):
        return '{} 더하기 {} 는 {} 입니다'.format(self.real, other.real, self.real + other.real)

my_num = MyInt(5) # 인스턴스 생성

print(my_num + 5) # => 5 더하기 5 는 10 입니다
```



`list`와 같은 다른 built-in type도 `__add__`를 사용한다. 다만, overloading을 통해 다른 동작을 한다.

```python
# 리스트의 덧셈
print([1,2,3] + [4,5,6])
# 매직 메소드로 덧셈
print([1,2,3].__add__([4,5,6]))
```

```
[1, 2, 3, 4, 5, 6]
[1, 2, 3, 4, 5, 6]
```



## `__dir__`

특정 인스턴스가 가지고 있는 모든 매직 메소드를 확인할 수 있다.

```python
# int를 부모 클래스로 가진 새로운 클래스 생성
class MyInt(int):
    pass

# 인스턴스 생성
my_num = MyInt(5)

# 매직 메소드를 가지고 있는지 확인
print(dir(my_num))
```

```
['__abs__', '__add__', '__and__', '__bool__', '__ceil__', '__class__', '__delattr__', '__dict__', '__dir__', '__divmod__', '__doc__', '__eq__', '__float__', '__floor__', '__floordiv__', '__format__', '__ge__', '__getattribute__', '__getnewargs__', '__gt__', '__hash__', '__index__', '__init__', '__int__', '__invert__', '__le__', '__lshift__', '__lt__', '__mod__', '__module__', '__mul__', '__ne__', '__neg__', '__new__', '__or__', '__pos__', '__pow__', '__radd__', '__rand__', '__rdivmod__', '__reduce__', '__reduce_ex__', '__repr__', '__rfloordiv__', '__rlshift__', '__rmod__', '__rmul__', '__ror__', '__round__', '__rpow__', '__rrshift__', '__rshift__', '__rsub__', '__rtruediv__', '__rxor__', '__setattr__', '__sizeof__', '__str__', '__sub__', '__subclasshook__', '__truediv__', '__trunc__', '__xor__', 'bit_length', 'conjugate', 'denominator', 'from_bytes', 'imag', 'numerator', 'real', 'to_bytes']
```





## Reference

* [schoolofweb](http://schoolofweb.net/blog/posts/%ED%8C%8C%EC%9D%B4%EC%8D%AC-oop-part-6-%EB%A7%A4%EC%A7%81-%EB%A9%94%EC%86%8C%EB%93%9C-magic-method/)

