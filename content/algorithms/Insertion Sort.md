---
title: "Insertion Sort"
tags: ["algorithm"]
---

# A) Insertion Sort ?

* 삽입 정렬은 자료 배열의 모든 요소를 앞에서부터 차례대로 이미 정렬된 배열 부분과 비교하여, 자신의 위치를 찾아 삽입함으로써 정렬을 완성하는 알고리즘이다.
* More efficient in practice than most other simple quadratic: [[Selection Sort]] or [[Bubble Sort]]
	* Efficient for data sets that are already substantially sorted: [[time complexity]] is `O(kn)` when each element in the input is no more than `k` places away from its sorted position
	* Best time complexity: `O(n)`

**예시 그림**

![Insertion Sort GIF by EJ Mason | Gfycat](https://thumbs.gfycat.com/DenseBaggyIbis-size_restricted.gif)

이미 정렬된 부분과 비교해서 가장 적합한 장소에 넣기 때문에, 2 중 loop 를 돌 때 안쪽 loop 은 reverse 로 돌아야 한다.

```python
def insertionSort(arr):  
	for i in range(1, len(data)):  
		idx = i  
		for j in reversed(range(i)):  
			if data[j] > data[idx]:  
				data[idx], data[j] = data[j], data[idx]  
				idx = j  
			else:  
				break  
	return data

 ```

# B) References
