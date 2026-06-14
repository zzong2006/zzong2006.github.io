
# A) What is the Heap?

완전 [[Binary Tree]] 의 일종으로 [[priority queue|우선순위 큐]] 를 위하여 만들어진 자료구조이다.

여러 개의 값들 중에서 최댓값 (Max Heap) 이나 최솟값 (Min Heap) 을 빠르게 찾아내도록 만들어진 자료구조이다.

Heap 은 일종의 반정렬 상태 (느슨한 정렬 상태) 를 유지한다.

부모 노드의 키 값이 자식 노드의 키 값보다 항상 크거나 작은 상태를 유지한다.

# B) Vs. Binary Tree

[[Binary Tree]] 에서는 중복된 값을 허용하지 않지만, [[Heap]] 에서는 중복된 값을 허용한다.

# C) Heap 의 종류

![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FnhKo9eco7n.png?alt=media&token=77cffc35-bacc-4d36-833b-ccf64e1f9d2f)

# D) Heap Building (max Heap 기준)

* Insertion
	* [[Heap]] 의 가장 마지막 노드에 원소를 추가하고 부모 노드의 값보다 크면 swap 한다.
* Pop (Extraction)
	* [[Heap]] 의 root 노드에 포함된 원소를 출력하고 삭제
	* [[Heap]] 의 가장 마지막 노드의 값을 root 노드의 원소 값으로 설정하고 자식 노드 값보다 작을 경우 swap
		* 이때, 자식 노드가 몇 개 있냐에 따라서 swap 방식이 달라진다.
			* 자식 노드가 없을 경우
				* leaf 노드에 도달했으므로 종료
			* 자식 노드가 1 개 있을 경우
				* 해당 자식 노드의 값과 비교 후 조건이 일치하면 swap
			* 자식 노드가 2 개 있을 경우
				* 두 자식 노드 중 값이 큰 노드와 비교 후 조건이 일치하면 swap

# E) Time Complexity

* Get max/min element: O(1)
* Insert an element: O(log n)
