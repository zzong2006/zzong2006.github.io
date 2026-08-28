---
title: "python tip"
tags: ["python", "programming"]
---

# Float

최솟값 또는 최댓값을 찾기 위해서는 `-float('inf')` 또는 `float('inf')` 를 활용하면 편하다.

# Tuple, List

```python
a, *b = (1,2,3) # a = 1, b = [2, 3]
```

# 폴더 리스트 가져오기

1. `os.listdir(DIR)` : `DIR` 내 존재하는 모든 폴더의 이름을 반환한다.
2. `glob.glob(DIR)`: `DIR` 내 존재하는 모든 폴더의 절대 경로를 반환한다.

`glob.glob` 의 경우 unix 스타일로 파일을 검색할 수 있다. 예를 들어, `glob.glob('*.gif')` 와 같은 검색이 가능하다.

# References
