---
title: "weaviate"
tags: ["vector_database", "ANN", "vector_search", "framework"]
---

# A) Weaviate ?

데이터를 정의할 class object 를 정의해야한다.

그리고 어떤 vectorizer 를 사용할 것인지도 명세해야 한다.

```python
class_obj = {  
	"class": "Question",  
	"vectorizer": "text2vec-openai" # Or "text2vec-cohere" 
}  
  
client.schema.create_class(class_obj)
```

# B) Schema

weaviate 는 주어진 데이터에서 스키마 정보를 추론한다.

`{endpoint}/v1/schema` 를 입력하면 이미 설정된 스키마를 확인할 수 있다.

class 의 정보를 담는다.

# C) Class

일종의 logical db 역할을 하는 것 같다. object 를 저장한다.

# D) Object

각 object 는 자신이 속한 class, 생성/업데이트 시간, properties 가 존재한다.

여기서 properties 는 object 의 실제 정보가 포함된다.

`{endpoint}/v1/objects` 를 입력하면 입력된 object 를 모두 확인할 수 있다.

좀 더 구체적으로 검색을 진행하려면, `GET /v1/objects?class={className}&limit={limit}&include={include}` 와 같이 옵션을 넣을 수 있다.

예시)

```bash
curl -X GET "localhost:8080/v1/objects?class=Sphere&limit=1"
```

# E) Horizontal Scaling

[[sharding]] 과 Replication 중 어떤것을 선택할지 결정하는 것 이 중요함

## E.1) Sharding

[[HNSW]] 그래프가 메모리를 많이 차지하면 단일 클래스가 여러개의 샤드로 구성되게끔 하고, 해당 샤드는 서버에 분산되어 있도록 설정된다. weaviate 는 이런 작업을 자동으로 수행하며, 적절한 샤드 수를 정해주기만 하면 된다. 실제로 해보니 굳이 샤드 수를 정해주지 않더라도 자동으로 설정된다.

샤딩을 하면 더 큰 데이터 셋에서 작업이 가능하고 import(데이터를 입력하는 작업) 속도가 향상되지만, 질의 속도가 빨라지진 않는다.

## E.2) Replication

[[Queries-per-second|QPS]] 를 늘리고 싶거나 [[high availability|HA]] 를 목표로 한다면, replicate 를 늘려서 동일한 데이터를 여러 노드에 위치시킬 수 있다. 이것도 적절한 replication factor 를 설정해주기만 하면 된다.

리플리케이션을 늘리면 서버가 고 가용성을 보장하며, 선형적으로 질의 속도 상승을 확인할 수 있지만, import 속도가 늘어나지는 않는다. 실제로 해보니 질의 속도가 오히려 느려지는 이슈가 있다.

# F) Discussion

써보니까 불편한게 몇가지 있다.

1. 버전 컨트롤이 애매한것 같다. 새로운 임베딩 모델의 벡터를 입력하는 경우, 인덱스를 어떻게 바꿔치기 할것인지?
2. 백업은 S3 밖에 안되는 것 같은데, HDFS 지원은 안하는건가? Minio 를 이용해서 연동하면 구축이 가능할 것으로 보인다.

# G) Update Data

[FAQ | Weaviate - vector search engine](https://weaviate.io/developers/weaviate/more-resources/faq#q-what-is-best-practice-for-updating-data)

# H) References
