---
tags: ["index", "database"]
---

# 1. B+Tree ?

![[img-2c42a52750.png|image-20201202014318881]]

* [[B+Tree]] 는 indexed-sequential 파일의 개선책이다.
	* indexed-sequential 의 단점
		* 파일 사이즈가 커질수록, 전체 파일을 주기적으로 재구성해야하므로 overhead 가 크다.
* [[B+Tree]] 의 장점
	* 삽입과 삭제 연산에서 적은 지역적 변화가 요구되므로, 전체 파일을 재구성할 필요가 없다.
* [[B+Tree]] 의 단점
	* 삽입과 삭제에서 space overhead 가 발생
- ---
* [[B+Tree]] 는 하나의 노드에 여러개의 데이터를 저장할 수 있다.
	* 하나의 노드에 최대로 저장할 수 있는 데이터의 수를 order 라고 한다.
* 만약 어떠한 B 트리의 order(또는 value 최대 개수) 가 $m$ 일 때, [[B+Tree]] 는 다음과 같은 속성을 갖는다.
	1. 각 노드는 최대 $m+1$ 개의 자식을 가질 수 있다.
	2. Root node 와 leaf node 를 제외한 모든 노드는 반드시 $\lceil(m+1)/2\rceil$ 개이상의 자식 노드를 가져야 한다.
	3. Leaf node 는 $\lceil m/2 \rceil$ 개 이상의 값을 가져야 한다.
	4. 높이가 1 이상인 [[B+Tree]] 의 root node 는 반드시 두 개 이상의 자식 노드를 가져야 한다.
		* root 가 leaf 의 경우 0 에서 $m$ 까지의 값을 가질 수 있다.
	5. 모든 leaf node 는 같은 레벨 (height) 에 위치해야 한다.
		* 즉, leaf node 와 root node 의 거리는 모두 같아야 한다.
* $K$ 개의 search-key 가 존재할 경우, B+-Tree 의 최대 높이는 $\left\lceil\log_{\lceil(m+1)/2\rceil}(K)\right\rceil$ 이다.
	* With 1 million search key values and $m=99$
		* at most $log_{50}(1,000,000)=4$ nodes are accessed in a lookup.

# 2. Related

# 3. References
