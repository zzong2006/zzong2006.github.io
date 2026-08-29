---
title: "Elasticsearch"
tags:
  - retrieval
  - IR
  - search_engine
  - data_engineering
  - elasticsearch
aliases: [ES]
---

# A) Elasticsearch ?

[[Lucene|Apache Lucene]] 기반의 분산 검색/분석 엔진이다. JSON 문서를 색인하고, 풀텍스트 검색, 집계, 벡터 검색 등을 지원한다.

# B) 메모리 구조

## B.1) Lucene의 Mmap 방식

Elasticsearch는 인덱스를 **전부 메모리에 올리지 않는다**. [[Lucene]](ES의 내부 엔진)은 **memory-mapped files (mmap)** 방식으로 인덱스를 읽는다:

```text
┌──────────────────────────┐
│      ES JVM Heap         │  ← 집계, 쿼리 캐시, 클러스터 상태 등
│    (보통 RAM의 50%)        │
├──────────────────────────┤
│   OS 파일시스템 캐시 (mmap)  │  ← Lucene이 여기서 인덱스를 읽음
│    (나머지 RAM)            │
├──────────────────────────┤
│         Disk             │  ← 인덱스 원본 저장 (Lucene segment files)
└──────────────────────────┘
```

1. 인덱스는 **디스크에 [[Lucene Segment|Lucene segment 파일]]** 로 저장된다
2. Lucene이 `mmap()` 시스템 콜로 [[Lucene Segment|segment 파일]] 을 가상 메모리에 매핑
3. 실제로 접근하는 페이지만 OS가 **파일시스템 캐시에 자동으로 로드**
4. 자주 조회되는 posting list, term dictionary 등은 캐시에 남고, 안 쓰이는 부분은 OS가 알아서 evict

즉 "전부 올린다/안 올린다"가 아니라, **OS가 RAM 여유분만큼 자동으로 캐싱하는 구조** 이다.

## B.2) JVM Heap Vs 파일시스템 캐시

ES 노드의 메모리는 크게 두 영역으로 나뉜다:

| 영역           | 용도                                              | 권장 비율                |
| ------------ | ----------------------------------------------- | -------------------- |
| **JVM Heap** | 집계(aggregation), field data, 쿼리 캐시, 클러스터 메타데이터  | RAM의 50% (최대 ~31 GB) |
| **파일시스템 캐시** | [[Lucene Segment]] 읽기 (mmap), inverted index 캐싱 | 나머지 RAM              |

JVM Heap을 ~32 GB 이상으로 설정하면 JVM의 **Compressed OOPs** (Compressed Ordinary Object Pointers)가 비활성화되어 오히려 메모리 효율이 떨어진다.

### B.2.1) Compressed OOPs란

64비트 JVM은 객체 참조 포인터가 8 bytes이다. Compressed OOPs는 이를 **4 bytes로 압축** 하는 JVM 최적화로, 메모리 사용량을 ~40% 절약한다.

원리: JVM은 객체를 8 byte 단위로 정렬(align)하므로 실제 주소의 하위 3비트는 항상 0이다. 주소를 3비트 오른쪽 시프트해서 저장하면 4 bytes(32비트)로 $2^{32} \times 8 = 32$ GB 범위의 주소를 표현할 수 있다.

```text
Heap ≤ ~32 GB → compressed oops 활성화 → 포인터 4 bytes
Heap > ~32 GB → compressed oops 비활성화 → 포인터 8 bytes
```

### B.2.2) 왜 31 GB인가

JVM 내부 오버헤드로 32 GB에 딱 맞추면 비활성화될 수 있어서, 안전하게 **31 GB** 로 설정하는 것이 관례이다. 32 GB를 넘기면 역설적인 상황이 발생한다:

```text
Heap 31 GB (compressed)   → 실효 용량 ~31 GB
Heap 33 GB (uncompressed) → 포인터가 2배로 커져서 실효 용량 오히려 ~26 GB 수준
```

Heap을 늘렸는데 실제로 쓸 수 있는 양은 줄어드는 것이다. 31 GB를 넘기려면 차라리 48-64 GB로 크게 잡아야 손해를 만회할 수 있다.

따라서 ES에서는 **Heap은 31 GB 이하로 유지하고, 나머지를 파일시스템 캐시에 양보** 하는 것이 일반적이다.

## B.3) 인덱스 크기와 메모리의 관계

**인덱스 크기 < 파일시스템 캐시 여유**:
- 대부분의 인덱스가 메모리에 캐싱됨 → 디스크 I/O 거의 없음 → 빠른 검색

**인덱스 크기 > 파일시스템 캐시 여유**:
- 캐시 miss 발생 → 디스크에서 읽어야 함 → **latency 급증**
- 특히 [[SPLADE on Elasticsearch|SPLADE]] 같은 sparse retrieval은 쿼리당 조회하는 posting list 수가 BM25보다 많아서 (D_q 약 30-80개 vs BM25 약 3-5개) 캐시 miss 확률이 더 높다

### B.3.1) 예시: 64 GB RAM 노드

```text
JVM Heap:        ~31 GB
파일시스템 캐시:    ~33 GB
BM25 인덱스 (1억): ~100 GB → 캐시의 ~33% 커버 가능
SPLADE 인덱스:    ~325 GB → 캐시의 ~10% 커버 가능
```

대응 방법:
- **노드 수 증가**: shard를 더 많은 노드에 분산 → 노드당 인덱스 크기 축소 → 캐시 적중률 향상
- **SSD 필수**: 캐시 miss 시에도 SSD라면 약 0.1ms, HDD라면 약 10ms로 100배 차이
- **RAM 증설**: 파일시스템 캐시 여유분이 늘어나면 자연스럽게 적중률 향상

## B.4) Latency 보장과 메모리 사이징

### B.4.1) 전체 인덱스를 메모리에 올려야 하나?

꼭 그렇진 않다. 핵심은 전체 인덱스 크기가 아니라 **working set 크기** 이다.

모든 [[Inverted Index|posting list]] (= 특정 term이 등장하는 문서 목록)가 균등하게 조회되는 게 아니다. 실제로는 자주 검색되는 term의 posting list가 전체의 일부만 차지한다:

```text
전체 인덱스:     325 GB (1억 docs, SPLADE D_avg=650)
Working set:   자주 조회되는 term들의 posting list → 전체의 10-30% 정도
```

**Working set < 파일시스템 캐시** 이면, 전체 인덱스가 캐시보다 커도 대부분의 쿼리는 메모리에서 처리된다.

### B.4.2) 문제는 Tail Latency

평균 latency는 괜찮아도, **P99/P999에서 터진다**:

```text
인기 term "맛집" 조회     → 캐시에 있음  → ~0.1ms
희귀 term "자가스크린" 조회 → 캐시 miss   → SSD ~0.1-0.5ms/page
```

SPLADE는 쿼리당 30-80개 posting list를 조회하므로, 하나라도 캐시 miss가 나면 해당 쿼리의 latency가 올라간다. 희귀 term이 섞인 쿼리일수록 위험하다:

```text
"파스타 맛집"         → 인기 term만    → P50 수준
"트러플 부라타 파니니"  → 희귀 term 포함 → P99 급증
```

### B.4.3) 시나리오별 판단

| 시나리오                   | 전체 인덱스 ≤ 캐시 필요?                 |
| ---------------------- | ------------------------------- |
| P50 latency만 챙기면 됨     | No, working set만 커버하면 됨         |
| **P99 < 50ms 보장**      | 거의 Yes, 또는 아래 대안 필요             |
| 쿼리 패턴이 편향적 (인기 키워드 위주) | No, hot posting list만 캐시에 있으면 됨 |
| 쿼리 패턴이 균등/랜덤           | Yes, 전체 인덱스가 캐시에 있어야 함          |

### B.4.4) 전체를 메모리에 안 올리고 Latency를 줄이는 방법

1. **shard 분산**: 노드를 늘려서 노드당 인덱스 크기를 줄임 → 각 노드의 캐시 적중률 향상
2. **캐시 워밍**: 주기적 dummy 쿼리로 hot posting list를 미리 캐시에 올림
3. **index sorting/routing**: 관련 문서를 같은 shard에 모아서 접근 패턴의 locality 향상
4. **replica**: 읽기 부하를 여러 replica에 분산 → 노드당 쿼리 수 감소 → 캐시 eviction 줄임
5. **D_avg 줄이기**: SPLADE의 FLOPS regularizer $\lambda_d$를 높여서 인덱스 자체를 축소

# C) Ranking Feature로 쓰기

[[retrieval/ranking/PageRank|PageRank]]처럼 미리 계산된 static score는 Elasticsearch 안에서 직접 계산하기보다, 문서 field로 색인한 뒤 ranking feature로 활용하는 편이 자연스럽다.

대표적으로 `pagerank`를 `rank_feature` field로 저장하고, 검색 query의 `should` 절에서 `rank_feature` query로 약하게 boost한다. 더 복잡한 score 조합이 필요하면 모든 후보 문서에 script를 실행하기보다 top-k 후보에만 `rescore`를 적용하는 편이 비용을 통제하기 쉽다.

# D) References

- [# 왜 ElasticSearch를 도입하려고 하시나요.review](https://www.jungmin.me/post/%EC%99%9C-elasticsearch-%EB%8F%84%EC%9E%85%ED%95%98%EB%A0%A4%EA%B3%A0-%ED%95%98%EC%8B%9C%EB%82%98%EC%9A%94)
