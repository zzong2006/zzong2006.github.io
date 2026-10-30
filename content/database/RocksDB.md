---
title: "RocksDB"
tags:
  - key_value_storage
  - Meta
aliases: []
---

# A) RocksDB ?

RocksDB 는 Facebook(현 Meta)이 개발한 오픈소스 고성능 임베디드 key-value 데이터베이스 라이브러리다.

* **임베디드 (Embedded) 라이브러리**: Redis·MySQL 처럼 별도 서버로 동작하지 않고, 애플리케이션 코드에 라이브러리로 포함돼 직접 실행된다.
	* 네트워크 통신 오버헤드가 없어 로컬 데이터 처리가 매우 빠르다.
* **Key-Value 데이터베이스**: 캐시가 아니라 데이터를 디스크(주로 SSD)에 영속적으로(persistently) 저장하는 데이터베이스다.
	* 애플리케이션이 종료되거나 서버가 재시작돼도 데이터가 보존된다.

## A.1) LSM Tree 기반 쓰기 구조

RocksDB 는 쓰기에 최적화된 LSM Tree (Log-Structured Merge-Tree) 자료구조를 기반으로 한다.

* **MemTable**: 모든 쓰기 요청은 먼저 메모리의 MemTable 에 기록된다. 그래서 쓰기가 빠르다.
* **SSTable**: MemTable 이 가득 차면 정렬된 상태로 디스크의 SSTable(Sorted String Table) 파일로 옮긴다.
* **Compaction**: 백그라운드에서 여러 계층(level)의 SSTable 파일을 병합해 읽기 성능을 높이고 공간을 아낀다.

## A.2) TTL eviction

* 한 번 eviction 한다고 용량이 정리되지 않고, 다시 불러온 뒤 iteration 을 돌려야 정리되는 듯하다.

# B) RocksDB 재설치

RocksDB 컴파일

```bash
rm -rf /usr/lib/librocksdb.so*
git clone -b v4.6.1 --depth 1 https://github.com/facebook/rocksdb.git rocksdb.git  
cd rocksdb.git  
make shared_lib && make install-shared INSTALL_PATH=/usr
```

# C) Key-Value Cache 와 RocksDB 비교

일반 key-value 캐시와 RocksDB 는 캐시와 데이터베이스라는 점에서 근본적으로 다르다.

| 항목 | 일반 Key-Value Cache (예: Redis, Memcached) | RocksDB |
| --- | --- | --- |
| 주요 목적 | 데이터의 일시적 보관 (캐싱) | 데이터의 영속적 저장 (데이터베이스) |
| 데이터 저장소 | 주로 메모리 (In-Memory) | 주로 디스크 (SSD/Flash Storage) |
| 데이터 영속성 | 휘발성 (Volatile), 재시작하면 데이터가 사라짐 | 영속성 (Persistent), 재시작해도 데이터 유지 |
| 처리 가능 용량 | RAM 크기에 제한 | 디스크 크기까지 확장 가능 (RAM 보다 훨씬 큼) |
| 아키텍처 | 독립된 서버 (Standalone Server) | 애플리케이션에 내장되는 라이브러리 (Embedded) |
| 주요 강점 | 매우 빠른 읽기·쓰기 (메모리 기반) | 매우 높은 쓰기 처리량, 대용량 데이터 관리 |

## C.1) RocksDB 가 맞는 워크로드

* **데이터 영속성이 필요할 때**: 상태 정보나 중간 계산 결과를 장애·재시작 뒤에도 잃으면 안 되는 경우다.
	* 인메모리 캐시는 영속성을 보장하지 못하므로 디스크 기반 RocksDB 가 적합하다.
* **데이터가 RAM 보다 클 때**: 수십–수백 GB 데이터는 가용 RAM 에 다 담을 수 없다.
	* RocksDB 는 데이터를 SSD 에 저장하므로 RAM 용량에 묶이지 않고 대용량 데이터를 관리한다.
* **쓰기가 매우 잦을 때 (Write-Heavy)**: 초당 수천 건 이상의 로그·이벤트가 계속 쌓이는 워크로드에 강하다.
	* LSM Tree 는 쓰기를 메모리에 먼저 기록하고 디스크에는 순차적으로 쓰므로 랜덤 쓰기(Random Write) 부하가 적다.
* **낮은 지연 시간 (Low Latency) 이 중요할 때**: DB 와 통신하는 네트워크 지연을 없앨 수 있다.
	* 애플리케이션에 내장된 라이브러리라 네트워크 호출 없이 함수 호출만으로 데이터에 접근한다.

# D) RocksDB vs. [[sqlite]]

작은 DB 를 아주 많이 만드는 설계(예: 아이템마다 DB 하나)에서는 inode 소모와 파일 시스템 부하 때문에 SQLite 가 RocksDB 보다 훨씬 낫다.

## D.1) inode

리눅스/유닉스 파일 시스템에서 inode(Index Node)는 파일·디렉터리 하나의 메타데이터를 모두 담는 자료구조다.

* 권한, 소유자, 크기, 생성·수정 시간, 그리고 데이터가 디스크의 어느 블록에 있는지 가리키는 포인터를 담는다.
* 모든 파일과 디렉터리는 고유한 inode 를 하나씩 가진다.
* 파일 시스템의 inode 총개수는 디스크 공간과 별개로 정해져 있다.
	* 작은 파일이 많아져 inode 를 모두 소진하면 더 이상 파일을 만들 수 없다.

## D.2) 아이템별 RocksDB 인스턴스의 파일 수 문제

아이템별로 DB 를 두고 피드백을 쌓는 설계는 초기에는 빠르지만, 아이템 수가 늘면 시스템 전체 성능이 급격히 떨어진다. RocksDB 는 단일 파일 DB 가 아니고, 인스턴스 하나가 여러 파일로 이뤄진 디렉터리이기 때문이다.

* **MANIFEST 파일**: DB 의 상태와 버전 정보를 관리한다.
* **WAL (Write-Ahead Log) 파일**: 쓰기 요청을 먼저 기록해 내구성을 보장한다.
* **SSTable (.sst) 파일 여러 개**: 정렬된 실제 데이터를 담는 불변(immutable) 파일이다.
	* 데이터가 쌓이고 compaction 이 돌 때마다 계속 생성·삭제된다.

추천 시스템에 아이템이 100 만 개 있다고 가정하면 파일 수는 다음처럼 늘어난다.

* 아이템마다 RocksDB 인스턴스를 만들면 RocksDB 디렉터리가 100 만 개 생긴다.
* 인스턴스마다 파일이 최소 5–10 개(WAL, MANIFEST, SSTable 여러 개)라면 파일이 500 만–1,000 만 개로 늘어난다.
* **inode 소모**: 파일이 수백만–수천만 개로 늘면서 inode 를 빠르게 소진한다.
* **파일 시스템 성능 저하**: OS 가 파일 하나를 찾으려 해도 거대한 디렉터리 구조를 탐색하고 수많은 inode 를 읽어야 한다.
	* 파일 열기(open)·읽기(read)·쓰기(write) 등 모든 파일 관련 시스템 콜이 느려지고, 이것이 시스템 전체가 느려지는 근본 원인이다.
* **OS 파일 디스크립터 한계**: 프로세스가 열 수 있는 파일 수(file descriptor limit)는 정해져 있다.
	* 인스턴스를 많이 동시에 관리하면 이 한계에 쉽게 닿는다.

원인은 LSM Tree 아키텍처가 아니라, RocksDB 동작 방식을 고려하지 않은 "아이템 하나 = 인스턴스 하나" 설계다.

## D.3) 같은 설계에서 SQLite 의 장점

SQLite 는 단일 파일 데이터베이스라서, 같은 아이템별 DB 설계에서도 이 문제를 훨씬 잘 피한다.

* SQLite DB 하나는 기본적으로 `.db` 파일 하나로 모든 것을 관리한다.
	* WAL 모드를 쓰면 `-wal`, `-shm` 파일이 추가로 생기지만 RocksDB 보다 훨씬 적다.
* 아이템 100 만 개 기준으로 RocksDB 는 약 1,000 만 개, SQLite 는 100 만 개 파일이 생긴다.
	* SQLite 도 파일 수가 많지만 RocksDB 의 1/10 수준이라 inode 부담이 적고 관리가 쉽다.
	* 파일 시스템 부담이 적어 성능이 더 안정적이고 예측 가능하다.

## D.4) 설계 비교

| 항목 | 아이템별 RocksDB (잘못된 설계) | 아이템별 SQLite (더 나은 설계) | 단일 RocksDB/SQLite (최적 설계) |
| --- | --- | --- | --- |
| 구조 | 아이템 1개 = RocksDB 인스턴스 1개 | 아이템 1개 = SQLite DB 파일 1개 | DB 인스턴스 1개에서 모든 데이터 관리 |
| 파일·inode 수 | N (아이템 수) × M (인스턴스당 파일 수), 극도로 많음 | N (아이템 수), 많음 | 상수, 적음 |
| 자원 영향 | inode 고갈, 파일 시스템 전체 성능 저하, OS 한계 도달 | inode 부담은 덜하지만 파일 관리가 여전히 복잡함 | OS·파일 시스템 자원을 효율적으로 사용 |
| 데이터 관리 | 수백만 개 DB 를 애플리케이션이 직접 관리 (사실상 불가능) | 수백만 개 DB 파일 관리 (복잡함) | 단일 DB 안에서 key 설계로 관리 (효율적) |

### D.4.1) 단일 DB 인스턴스와 Composite Key

가장 이상적인 해법은 RocksDB(또는 SQLite) 인스턴스 하나에 모든 데이터를 담는 방식이다.

* **Key 설계**: 아이템 ID 를 key 의 일부로 넣은 복합 키(Composite Key)를 쓴다.
	* 예: `[ItemID]:[FeedbackTimestamp]`, `[ItemID]:[UserID]`
* **데이터 조회**: 특정 아이템의 피드백은 RocksDB 의 Prefix Scan 으로 가져온다.
	* ItemID 를 prefix 로 지정하면 그 아이템으로 시작하는 key-value 쌍을 효율적으로 스캔한다.
* 피드백이 수억 개여도 파일 시스템이 관리할 파일은 수십–수백 개라 inode 문제가 사라진다.
* RocksDB 의 compaction 도 전체 데이터에 대해 최적으로 동작한다.
