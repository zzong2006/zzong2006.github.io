---
tags: ["python"]
---

# 1. Contextlib ?

contextlib 모듈을 통해서 어떠한 작업을 할때 자동으로 close 메소드를 호출하게끔 할 수 있습니다.

# 2. 예시

```python
from contextlib import closing 


class OpenClose: 
	def open(self): 
		print("작업을 시작합니다.") 
		
	def do_something(self): 
		print("작업을 진행합니다...") 
	
	def close(self): 
		print("작업을 종료합니다.")

def doOpenClose(): 
	with closing(OpenClose()) as d: 
		d.open() 
		d.do_something()
```

```python
>>> from close import doOpenClose 
>>> doOpenClose() 
# 작업을 시작합니다. 
# 작업을 진행합니다...
# 작업을 종료합니다.
```

# 3. Related

# 4. References
