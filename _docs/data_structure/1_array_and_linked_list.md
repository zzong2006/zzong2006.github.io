---
layout: default
title:  "Linked list & Array"
category: Data Structure
order: 1
---

### Linked list

* 원소(노드)의 삭제와 삽입이 빠르다.
* Random Access가 불가능하다.
* Cache Locality가 나쁘다.

### Array

* 원소(노드)의 삭제와 삽입이 느리다.
* Random Access가 가능하다.
* Cache Locality가 좋다.



#### Cache Locality? ([참조](https://stackoverflow.com/questions/12065774/why-does-cache-locality-matter-for-array-performance))

캐시 지역성이 좋고 나쁘다는 것은 무슨 의미를 가지는가? CPU는 일반적으로 특정 메모리에 접근할 때, 해당 메모리 근처의 chunks 들을 cache 에 미리 올려둔다. 그리고, 근처 메모리들을 접근하게 되면, 캐시를 통해 빠르게 접근할 수 있다. 

Array는 연속된 메모리 블럭을 가지고, linked list는 각 노드의 메모리가 연속성을 보장하지 않는다. 

아래는 각 자료구조의 memory layout을 나타낸다.

```
Address      Contents       | Address      Contents
ffff 0000    data[0]        | ffff 1000    l_data
ffff 0040    data[1]        |   ....
ffff 0080    data[2]        | ffff 3460    l_data->next
ffff 00c0    data[3]        |   ....
ffff 0100    data[4]        | ffff 8dc0    l_data->next->next
                            | ffff 8e00    l_data->next->next->next
                            |   ....
                            | ffff 8f00    l_data->next->next->next->next
```

만약 `ffff 0000` 에 접근하고, 그 이후 다음 원소에 접근할 때, cache는 `ffff 2000`정도까지의 메모리를 저장한다. 그렇다면, Array가 Linked list보다 훨씬 빠른 접근이 가능하게 될 것이고, 이는 캐시 지역성이 우수하다는 것을 의미하게 된다.

