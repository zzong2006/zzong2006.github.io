---
tags: ["algorithm", "sorting"]
---

# A) Quick Sort ?

* 합병 정렬 (merge sort) 과 달리 퀵 정렬은 리스트를 비균등하게 분할한다.
* 분할 정복 (divide and conquer) 방법
	* 문제를 작은 2 개의 문제로 분리하고 각각을 해결한 다음, 결과를 모아서 원래의 문제를 해결하는 전략이다.

# B) 장점

속도가 빠르다.

시간 복잡도가 `O(nlog₂n)` 를 가지는 다른 정렬 알고리즘과 비교했을 때도 가장 빠르다.
		* ![[img-1a9b5967c5.png]]
	* 추가 메모리 공간을 필요로 하지 않는다.

# C) 단점

정렬된 리스트에 대해서는 퀵 정렬의 불균형 분할에 의해 오히려 수행시간이 더 많이 걸린다. 최악의 경우 시간 복잡도는 `O(n^2)` 가 된다.

![[img-881a44854c.png||450]]

퀵 정렬의 불균형 분할을 방지하기 위하여, pivot 을 선택할 때 더욱 리스트를 균등하게 분할할 수 있는 데이터를 선택한다. 일반적으로 리스트 내의 중간 값 ([[median]]) 을 pivot 으로 선택한다.

# D) 구현

```python

def quickSort(alist):  
	quickSortHelper(alist, 0, len(alist) - 1)

def quickSortHelper(alist, first, last):  
	if first < last:  
		splitpoint = partition(alist, first, last)  
		quickSortHelper(alist, first, splitpoint - 1)  
		quickSortHelper(alist, splitpoint + 1, last)

def partition(alist,first,last):  
	pivotvalue = alist[last]

    leftmark = first 
    rightmark = last - 1

    while True:
        while alist[leftmark] < pivotvalue:
            leftmark = leftmark + 1

        while alist[rightmark] > pivotvalue:
            rightmark = rightmark -1

        if leftmark < rightmark:
            alist[leftmark], alist[rightmark] = alist[rightmark], alist[leftmark]
        else:
            break

    alist[last], alist[leftmark] = alist[leftmark], alist[last]

    return leftmark
    ```


# 2. Related 

# 3. References
