
# A) `unittest` ?

# B) Mock

```python
from unittest.mock import Mock, MagicMock, call
```

mocking 은 소외 mock 이라고 불리는 가짜 객체를 생성하는 것부터 시작합니다. 우리는 이 mock 객체가 어떻게 작동을 할지를 지정해줄 수 있으며, 이 mock 객체는 자신을 상대로 어떤 작업이 일어났는지를 기억합니다.

먼저 호출되었을 때 특정 값을 리턴하는 mock 객체는 `return_value` 옵션을 이용해서 생성할 수 있습니다.

```python
from unittest.mock import Mock
mock = Mock(return_value='Hello, Mock!')
mock()
# 'Hello, Mock!'
```

반면에 호출되었을 때 예외가 발생하는 mock 객체는 `side_effect` 옵션을 이용해서 생성할 수 있습니다.

```python
mock = Mock(side_effect=Exception('Oops!'))
mock()

"""
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/Users/dale/.pyenv/versions/3.7.6/lib/python3.7/unittest/mock.py", line 1011, in __call__
    return _mock_self._mock_call(*args, **kwargs)
  File "/Users/dale/.pyenv/versions/3.7.6/lib/python3.7/unittest/mock.py", line 1071, in _mock_call
    raise effect
Exception: Oops!
"""
```

# C) Related

[[pytest]]

# D) References

* mock: [\[파이썬\] 테스트 모킹 - unittest.mock | Engineering Blog by Dale Seo](https://www.daleseo.com/python-unittest-mock/)
