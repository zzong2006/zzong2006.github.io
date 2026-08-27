---
tags: ["programming", "data_structure"]
aliases: ["hash", "hash function"]
---

# A) Hash ?

Hash 는 임의 길이의 입력을 고정된 크기의 값으로 매핑하는 함수 또는 그 결과값을 말한다. 자료구조에서는 key 를 빠르게 찾기 위해 hash function 을 사용하고, security 문맥에서는 password 저장이나 무결성 확인에 사용한다.

# B) 자료구조에서의 Hash

Hash table 은 key 를 hash value 로 바꾼 뒤 bucket 위치를 찾는다. 평균적으로 lookup, insert, delete 를 $O(1)$ 에 가깝게 수행할 수 있지만, collision 이 많아지면 성능이 나빠질 수 있다.

# C) Security 문맥

암호학적 hash 는 역상 복원이 어렵고, 작은 입력 변화에도 완전히 다른 출력이 나와야 한다. password 저장에서는 [[security/salt (hash)|salt]] 를 함께 사용해 rainbow table 공격을 어렵게 만든다.

# D) Related

* [[hashing trick]]
* [[security/salt (hash)|salt]]
* [[retrieval/indexing/locality sensitive hashing|locality sensitive hashing]]

