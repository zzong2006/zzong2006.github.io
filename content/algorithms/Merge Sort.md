---
title: "Merge Sort"
aliases: []
tags: []
---
* 분할 단계와 병합 단계로 나뉘는 divide and conquer 알고리즘
	* 시간 복잡도: `O(nlog(n))`
	* 공간 복잡도: `O(n)` (병합 단계에서 사용)
* 코드

```python

def mergeSort(arr, l, r):

	if l < r:

		# Same as (l+r)//2, but avoids overflow for large l and h

		m = (l + (r - 1)) // 2

  
        # Sort first and second halves
        mergeSort(arr, l, m)  		# 분할 단계
        mergeSort(arr, m + 1, r) 	# 분할 단계
        merge(arr, l, m, r)   		# 합병 단계
        

def merge(arr, l, m, r):

	“””

	 Merges two subarrays of arr[]. 

	 First subarray is arr[l..m]

	 Second subarray is arr[m+1..r]

	“””

	n1 = m - l + 1 # 왼쪽 subarray의 길이

	n2 = r - m   	# 오른쪽 subarray의 길이

  
    # create temp arrays
    L = [0] * (n1)
    R = [0] * (n2)
  
    # Copy data to temp arrays L[] and R[]
    for i in range(0 , n1):
        L[i] = arr[l + i]
  
    for j in range(0 , n2):
        R[j] = arr[m + 1 + j]
  
    # Merge the temp arrays back into arr[l..r]
    i = 0     # Initial index of first subarray
    j = 0     # Initial index of second subarray
    k = l     # Initial index of merged subarray
  
    while i < n1 and j < n2 :
        if L[i] <= R[j]:
            arr[k] = L[i]
            i += 1
        else:
            arr[k] = R[j]
            j += 1
        k += 1
  
    # Copy the remaining elements of L[], if there are any
    while i < n1:
        arr[k] = L[i]
        i += 1
        k += 1
  
    # Copy the remaining elements of R[], if there are any
    while j < n2:
        arr[k] = R[j]
        j += 1
        k += 1

n = len(arr)

mergeSort(arr, 0, n-1) # 호출 방법 

```

* Drawbacks of Merge Sort
	* Slower comparative to the other sort algorithms for smaller tasks.
	* Merge sort algorithm requires additional memory space of `O(n)` for the temporary array.
	* It goes through the whole process even if the array is sorted.
