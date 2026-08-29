---
title: "setattr"
aliases: []
tags:
  - python
  - function
---

# 1. Setattr ?

[[Python]] 에서 클래스 인스턴스의 attribute 를 설정하는 함수다.

예를 들어, `setattr(x, 'foobar', 123)` 는 `x.foobar = 123` 와 같은 효과를 보인다.

그럼 왜 굳이 `setattr` 를 사용할까? 이는 dynamic variable 을 assign 해줄 수 있기 때문이다.

# 2. 예시

```python
for i, value in enumerate(dynamic_values):
    setattr(i, 'attribute{}'.format(i), value)
```

# 3. Related

# 4. References

* https://stackoverflow.com/questions/19123707/why-use-setattr-and-getattr-built-ins
