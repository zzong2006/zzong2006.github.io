---
layout: default
title:  "Index"
category: Database
order: 4
---

Indexing은 원하는 데이터 접근 속도를 높이기 위해 Index file을 구성하는 메커니즘을 의미한다.

* Index file은 검색 키와 포인터로 구성된 index 엔트리들로 구성된 파일을 의미한다.
  * 검색 키(Search Key): 레코드를 look up 하기 위해 구성된 속성

<img src="https://i.loli.net/2020/11/26/i1xMCgXNd8c7eTy.png" alt="image-20201126005222757" style="zoom: 67%;" />

**Indexing은 언제 사용해야 하나?**

* Indexing은 주로, 검색(SELECT)이 많고 DB 변경(INSERT, UPDATE, DELETE)이 적게 일어나는 테이블에서 인덱스를 사용하면 좋다.

Indexing은 크게 두 종류로 구성된다: Ordered indices, Hash indices

* Ordered indices : search key들이 순서에 의해 정렬됨
* Hash indices: search key들이 해시 함수에 의해 buckets에 저장됨



### Dense index

모든 search-key에 대한 index record를 보유할 때

<img src="https://i.loli.net/2020/12/02/FoSW59PK6DVM2ws.png" alt="image-20201202015214340" style="zoom: 55%;" />

### Sparse Index

index record가 오직 몇개의 search-key만 보유하고 있을 때

* 키 $K$ 에 대한 검색 방법: $K$ 보다 작은 largest search key를 찾고, 거기서 부터 sequentially 하게 검색
* dense 와 비교해서 필요 공간과 삽입 오버헤드가 작다. 하지만, 검색 시간이 dense 보다 더 많이 필요하다.

<img src="https://i.loli.net/2020/12/02/XkDApngUIr3KLcQ.png" alt="image-20201202015145725" style="zoom:67%;" />

### Secondary Indices

search-key가 아닌 다른 field에 대한 index (secondary index)가 search-key 값에 대한 index record를 가리키고 있을 때

> Index record points to a bucket that contains pointers to all the actual records with that particular search-key value

* Secondary indices는 반드시 **dense** 여야 한다.

<img src="https://i.loli.net/2020/12/02/1RMfpJmDTIlOPvo.png" alt="image-20201202014955790" style="zoom: 67%;" />

## B+-Tree Index Files

![image-20201202014318881](https://i.loli.net/2020/12/02/jliFt7pS3fyTZ5x.png)

B+-Tree는 indexed-sequential 파일의 개선책이다.

* indexed-sequential의 단점
  * 파일 사이즈가 커질수록, 전체 파일을 주기적으로 재구성해야하므로 오버헤드가 크다.
* B+-tree의 장점
  * 삽입과 삭제 연산에서 적은 지역적 변화가 요구되므로, 전체 파일을 재구성할 필요가 없다.
* B+-tree의 단점
  * 삽입과 삭제에서 space overhead가 발생

----

B+-Tree는 하나의 노드에 여러개의 데이터를 저장할 수 있다.

* 하나의 노드에 최대로 저장할 수 있는 데이터의 수를 order라고 한다. 

만약 어떠한 B 트리의 order가 $m$일 때, B+-Tree는 다음과 같은 속성을 갖는다.

1. 각 노드는 최대 $m+1$개의 자식을 가질 수 있다.
2. Root node와 leaf node를 제외한 모든 노드는 반드시 $\lceil (m+1)/2 \rceil$개이상의 자식 노드를 가져야 한다.
3. Leaf node는 $\lceil m/2 \rceil$ 개 이상의 값을 가져야 한다. 
4. 높이가 1 이상인 B+-tree의 root node는 반드시 두 개 이상의 자식 노드를 가져야 한다.
   * root가 leaf의 경우 0에서 $m$ 까지의 값을 가질 수 있다.
5. 모든 leaf node는 같은 레벨(height)에 위치해야 한다. 즉, leaf node와 root node의 거리는 모두 같아야 한다.

$K$ 개의 search-key가 존재할 경우, B+-Tree의 최대 높이는 $\left\lceil\log _{\lceil (m+1) / 2 \rceil}(K)\right\rceil$ 이다.

* With 1 million search key values and $m = 99$
  * at most $log_{50}(1,000,000) = 4$ nodes are accessed in a lookup.