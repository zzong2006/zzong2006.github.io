---
title: "Selection Sort"
tags: ["algorithm", "sorting"]
---

# A) Selection Sort ?

선택 정렬은 다음과 같은 순서로 이루어진다.

* 주어진 리스트 중에 최소값을 찾는다.
* 그 값을 맨 앞에 위치한 값과 교체한다.
* 맨 처음 위치를 뺀 나머지 리스트를 같은 방법으로 교체한다.
* 하나의 원소만 남을 때까지 위의 과정을 반복한다.

## A.1) 예시 그림

![example of implementing selection sort algorithm | 400](https://www.researchgate.net/profile/Khalid-Alkharabsheh/publication/259911889/figure/fig1/AS:297041486991362@1447831617568/example-of-implementing-selection-sort-algorithm.png)

# B) 코드

## B.1) 일반적인 방식

```python
def selectionSort(x):
	length = len(x)
	for i in range(length-1):
	    indexMin = i
		for j in range(i+1, length):
			if x[indexMin] > x[j]:
				indexMin = j
		x[i], x[indexMin] = x[indexMin], x[i]
	return x
```

## B.2) Recursion (재귀)

```python
def selectionSort(data, start):
    def _find_min_index(data, start):
      min_index = start
      for i in range(start + 1, len(data)):
          if data[i] < data[min_index]:
              min_index = i
      return min_index

    def _swap(data, i, j):
        if i != j:
            data[i], data[j] = data[j], data[i]
        return data
    
    if start < len(data) - 1:
        swap(data, start, _find_min_index(data, start))
        selectionSort(data, start + 1)
    return data


selectionSort(data, start=0)
```

# C) Related

# D) References
