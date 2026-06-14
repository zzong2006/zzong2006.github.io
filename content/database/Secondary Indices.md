---
title: "Secondary Indices"
---

* search-key 가 아닌 다른 field 에 대한 index 가 search-key 값에 대한 index record 를 가리키고 있을 때
	* ![](https://i.loli.net/2020/12/02/1RMfpJmDTIlOPvo.png)
* > Index record points to a bucket that contains pointers to all the actual records with that particular search-key value
* [[Secondary Indices]] 는 반드시 [[Dense index]] 여야 한다.
