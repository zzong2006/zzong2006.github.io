---
tags: ["data_structure"]
---

# A) LSM Tree ?

LSM Tree 는 Bitcask, [[MongoDB]], Bigtable, Cassandra, InfluxDB 및 SQLite4 와 같은 최신 관계형 및 비관계형 데이터베이스에서 사용하고 있는 인기있는 데이터 구조이다.

LSM tree 도 다른 search tree 처럼 key-value 쌍을 유지한다. LSM tree 는 두개 혹은 그 이상의 구조에 데이터를 담고 있으며, 각 구조는 저장되어 있는 storage medium 하에 최적화된다.

![](https://i.imgur.com/T4ppYtW.png)

# B) Time Complexity

* insert
	* Avergae: O(1)
	* Worst case: O(1)
* Find-min
	* Average: O(n)
	* Worst case: O(n)

# C) Related

# D) References

* https://en.wikipedia.org/wiki/Log-structured_merge-tree
