---
title: Hash-Based Embedding
tags:
  - recommendation_system
  - feature_engineering
  - embedding
  - retrieval
aliases:
  - 해시 기반 임베딩
  - multi-hash embedding
  - hash embedding
---

# A) 한줄 요약

Hash-based embedding은 **ID를 임베딩 테이블의 몇 번째 줄에 대응시킬지를 사전(dictionary)이 아니라 해시 함수로 정하는** 방식이다. 서로 다른 해시 함수를 여러 개 써서 한 ID당 여러 줄을 뽑고, 그 줄들을 합쳐 하나의 표현으로 쓴다.

이 방식을 쓰면 ID와 행 번호를 짝지어 두는 사전을 관리할 필요가 없고, 방금 생성된 아이템도 그 자리에서 표현할 수 있다. X가 공개한 For You 피드 알고리즘(`xai-org/x-algorithm`)의 Phoenix 모델이 retrieval과 ranking 양쪽에서 이 구조를 쓴다.

# B) ID 임베딩이 사전을 요구하면 생기는 일

추천 모델은 user ID, item ID, author ID 같은 범주형 ID를 벡터로 바꿔서 입력한다. 교과서적인 방법은 임베딩 테이블 $E \in \mathbb{R}^{V \times d}$ 를 두고, ID를 0부터 $V-1$ 사이의 행 번호로 옮겨주는 사전을 따로 유지하는 것이다.

문제는 이 사전이다.

- **사전을 관리하는 주체가 필요하다.** 학습 클러스터의 모든 워커와 서빙 서버가 같은 사전을 봐야 하므로, 사전을 배포하거나 조회해주는 서비스가 하나 더 생긴다.
- **사전에 없는 ID는 표현할 수 없다.** 사전을 다시 만들기 전까지 새 ID는 전부 하나의 unknown 행으로 뭉뜽그려진다.
- **사전 자체가 크다.** 아이템이 억 단위면 ID에서 행 번호로 가는 맵도 억 단위다.

두 번째가 피드에서 특히 아프다. X 규모의 서비스에서는 게시물이 초 단위로 계속 생긴다. 사전 갱신을 하루에 한 번 돌린다면, 오늘 올라온 글은 하루 동안 "모르는 아이템" 취급을 받는다. 새 글을 빨리 돌려보는 게 목적인 피드에서 이건 설계 자체가 무너지는 지점이다.

# C) 해시를 한 번만 쓰면 충돌이 곧 동일시가 된다

사전을 없애는 가장 단순한 방법이 [[hashing trick]] 이다. ID를 해시해서 버킷 수 $B$ 로 나눈 나머지를 행 번호로 쓴다.

$$
h(x) = \text{hash}(x) \bmod B
$$

사전이 사라지고 어느 서버에서 계산해도 같은 값이 나온다. 대신 **충돌(collision)** 이 생긴다. 서로 다른 두 ID가 같은 버킷에 떨어지면 두 ID는 완전히 같은 벡터를 쓰게 되고, 모델은 둘을 구분할 방법이 없다.

충돌은 드문 사고가 아니라 기본값이다. 아이템 $N$ 개를 버킷 $B$ 개에 넣을 때 같은 버킷을 쓰는 쌍의 기대 개수는 대략 $N^2 / 2B$ 다. $N = B = 10^8$ 이면 5천만 쌍이 나온다. 버킷을 아이템 수만큼 넉넉히 잡아도 충돌 쌍은 아이템 수의 절반 규모라는 뜻이다.

# D) 해시를 여러 개 겹치면 충돌이 흩어진다

핵심 아이디어는 ID 하나를 **버킷 하나가 아니라 버킷 조합으로** 표현하는 것이다. 서로 독립인 해시 함수 $k$ 개를 두고, ID마다 $k$ 개의 행을 뽑아 합친다.

$$
e(x) = \sum_{j=1}^{k} W_j \, E\big[h_j(x)\big]
$$

| 기호 | 뜻 |
| --- | --- |
| $x$ | 엔티티 ID (user ID, post ID 등) |
| $h_j$ | $j$ 번째 해시 함수. 출력은 행 번호 |
| $E$ | 임베딩 테이블. 각 행의 폭은 $d_{\text{table}}$ |
| $W_j \in \mathbb{R}^{d_{\text{table}} \times d_{\text{model}}}$ | $j$ 번째 해시 슬롯 전용 projection 행렬 |
| $e(x)$ | 모델이 실제로 쓰는 $d_{\text{model}}$ 차원 표현 |
| $B$ | 해시 버킷 수 |
| $N$ | 실제 엔티티 개수 |

두 ID가 완전히 같은 표현을 갖게 되려면 $k$ 개 해시가 **전부** 같은 버킷을 내놔야 한다. 확률이 $B^{-k}$ 로 떨어지므로, 해시를 하나만 늘려도 충돌은 사실상 사라진다.

| 해시 개수 $k$ | 한 쌍이 완전히 겹칠 확률 | $N = B = 10^8$ 일 때 완전 충돌 쌍의 기대 개수 |
| --- | --- | --- |
| 1 | $10^{-8}$ | 약 5천만 쌍 |
| 2 | $10^{-16}$ | 약 0.5쌍 |
| 3 | $10^{-24}$ | 사실상 0 |

$k = 2$ 여도 각 ID는 여전히 각각의 해시에서 다른 ID와 행을 나눠 쓴다. 즉 부분 충돌은 그대로 있다. 달라지는 건 **정체성이 한 줄이 아니라 줄들의 조합으로 정의된다** 는 점이다. 첫 번째 해시에서 A와 B가 같은 행을 쓰더라도 두 번째 해시에서 갈라지면, 합쳐진 벡터는 서로 다르다. 겹친 행은 정체성을 지우는 대신 두 항 중 하나에 노이즈를 얹는 정도로 남는다.

독립 해시를 여러 개 겹쳐서 충돌 오차를 평균으로 밀어내는 발상 자체는 [[Count Sketch]] 나 Bloom filter와 같은 계열이다.

# E) Phoenix의 구현

X의 Phoenix는 `xrex/models/recsys_embedding.py` 의 `HashTable` 클래스에 이 구조를 담았다. 엔티티 종류는 user, item(post), author, IP 네 가지이고 각각 해시를 2개씩 쓴다.

## E.1) 해시 함수는 곱하고 더하고 나머지

각 해시는 universal hashing 계열의 단순한 형태다. ID에 상수를 곱하고 상수를 더한 뒤 소수로 나머지를 취한다.

$$
h_j(x) = \Big( \big( a_j x + b_j \big) \bmod p_j \Big) \bmod (B - 1) + 1
$$

여기서 $a_j$(scale), $b_j$(bias), $p_j$(modulus)는 엔티티 종류마다 config에 박혀 있는 상수다. 예를 들어 item 쪽은 $a = [2161410491,\ 1754358832]$, $p = 2361375383$ 이다. 상수가 config에 고정돼 있다는 건 **학습 때와 서빙 때가 같은 행을 본다** 는 뜻이고, 그래서 조회 서비스 없이도 어느 프로세스든 같은 결과를 낸다.

마지막의 `% (B-1) + 1` 은 결과를 $1$ 부터 $B-1$ 까지로 밀어내는 장치다. **0번 행을 padding 자리로 비워두기 위해서다.** ID가 0(값 없음)이면 해시를 거치지 않고 그대로 0을 내보내고, 모델은 나중에 `post_hashes[..., 0] != 0` 으로 padding mask를 만든다.

## E.2) 테이블은 하나, 구간은 offset으로 나눈다

user/item/author/IP가 각자 테이블을 갖는 대신, 하나의 큰 테이블을 구간으로 잘라 쓴다. 해시 결과에 엔티티별 offset을 더하는 게 전부다.

| 구간 | 시작 위치 | 크기 (production ranking 설정) |
| --- | --- | --- |
| padding | 0 | 1 |
| action 토큰 | 1 | 64 |
| user | 65 | 100M |
| item(post) | 65 + 100M | 100M |
| author | 65 + 200M | 30M |
| IP | 65 + 230M | 10M |

앞쪽 65칸이 예약석이다. 0번은 padding이고 1부터 64번은 사용자 행동 종류(favorite, reply 같은 60개를 64로 올림한 것)를 나타내는 토큰 자리다. 행동 임베딩과 ID 임베딩이 같은 테이블 안에 살기 때문에, 모델 입장에서는 "이 시퀀스 위치의 토큰이 무엇인가"를 전부 같은 lookup 한 번으로 처리한다.

## E.3) 합치기 전에 해시마다 다른 projection을 태운다

Phoenix는 $k$ 개 행을 그냥 더하지 않는다. 해시 슬롯마다 별도의 projection 행렬을 하나씩 두고, 통과시킨 다음 더한다. 코드에서는 `user_hash_0_proj`, `user_hash_1_proj` 처럼 이름이 따로 붙는다.

```python
result = jnp.zeros((B, 1, D), dtype=fprop_dtype)
for i in range(num_user_hashes):
    h = user_embs[:, i : i + 1, :]
    result = result + _project_hash(h, f"user_hash_{i}_proj", config)
```

이렇게 하는 이유가 두 가지다.

첫째, 테이블 행의 폭과 모델 폭이 다르다. production ranking 설정에서 테이블 행은 1024차원이고 transformer가 쓰는 폭은 2560차원이라 어차피 선형 변환이 한 번 필요하다.

둘째, 슬롯마다 변환을 분리하면 같은 행을 여러 슬롯이 우연히 공유하더라도 역할이 섞이지 않는다. 첫 번째 해시로 뽑은 행과 두 번째 해시로 뽑은 행이 서로 다른 방향으로 투영되기 때문에, 합에서 각 슬롯의 기여를 모델이 구분해서 쓸 수 있다.

같은 project-then-sum 패턴이 post 토큰과 author 토큰에도 그대로 반복된다. 한 게시물 토큰은 post 해시 2개와 author 해시 2개, 총 4번의 lookup을 각자의 projection에 태워 더한 결과다.

## E.4) 규모가 만드는 엔지니어링

숫자를 넣어보면 이 설계가 왜 별도 인프라를 끌고 다니는지 보인다.

- 테이블 행 수: 약 2억 4천만 행
- 행 폭: 1024
- fp32 기준 크기: $2.4 \times 10^8 \times 1024 \times 4\ \text{B} \approx 983\ \text{GB}$

GPU 한 장에 올라가는 크기가 아니다. 그래서 저장소는 임베딩 테이블 전용 경로로 빠진다. 학습 쪽은 `xrex/cuda/async_emb/` 의 CUDA 커널로 lookup과 gradient 업데이트를 비동기로 겹치고, 옵티마이저도 행 단위로 상태를 갖는 `rowwise_adagrad` 를 쓴다. 서빙 쪽은 Rust로 짠 `emb_table.rs` 가 huge page를 잡아 gather를 처리한다.

lookup 횟수도 만만치 않다. ranking 모델은 한 예시마다 history 1022개와 candidate 64개를 시퀀스로 받고 각 위치가 4번 조회하므로, 예시 하나에 4천 행 이상을 읽는다. 그래서 조회 전에 `compress_token_ids` 로 배치 안의 중복 ID를 먼저 unique 처리한다. 같은 작성자의 글이 시퀀스에 여러 번 나오는 게 흔하기 때문에 이 중복 제거가 꽤 벌어준다.

# F) 해시는 "즉시 표현"까지만 해준다

새 게시물이 올라오면 해시는 그 순간 행 번호를 내놓는다. 하지만 그 행에 들어 있는 벡터는 **아직 이 게시물에 대해 아무것도 학습하지 않은 값** 이다. 표현 가능(representable)과 학습됨(learned)은 다른 얘기다.

더 근본적으로, 해시는 의미를 보존하지 않는 임의 사상이다. 내용이 거의 같은 두 글이라도 ID가 다르면 완전히 무관한 행으로 흩어진다. ID 해싱만으로는 "비슷한 글이니 비슷하게 다뤄라" 라는 일반화가 원리적으로 불가능하다.

Phoenix는 이 구멍을 semantic ID로 메운다. 게시물의 multimodal 임베딩(텍스트와 이미지를 함께 인코딩한 벡터, [[CLIP]] 계열)을 residual quantization으로 6단계 × 코드북 256개의 코드열로 바꾼 것이다. residual quantization은 벡터를 코드북에서 가장 가까운 코드로 근사하고, 남은 오차를 다음 단계 코드북으로 다시 근사하기를 반복하는 방식이라, 앞쪽 코드가 거친 주제를 잡고 뒤로 갈수록 세부를 잡는다. 결과적으로 **주제가 같은 글은 코드열의 앞부분을 공유한다.** 처음 보는 글도 이미 학습된 코드 임베딩의 조합으로 표현되므로 [[cold-start]] 상황에서 의미 있는 벡터가 나온다.

두 표현의 역할이 정확히 갈린다.

| | ID 해시 | Semantic ID |
| --- | --- | --- |
| 나타내는 것 | 이 개체가 누구/무엇인지 | 이 개체의 내용이 무엇인지 |
| 처음 보는 개체 | 행은 생기지만 벡터는 미학습 | 학습된 코드 조합으로 즉시 의미 표현 |
| 비슷한 개체 | 무관한 행으로 흩어짐 | 코드열 prefix 공유 |
| 개체 구분 | 조합이 다르면 구분됨 | 내용이 같으면 구분 못 함 |

그래서 [[Two-tower Model|two-tower]] retrieval의 candidate tower는 아이템 정체성을 post ID 해시가 아니라 **semantic ID + author 해시** 로 잡는다. 코퍼스에 1천만 개 넘는 후보가 계속 갈리는 상황에서, 개체 식별보다 내용 일반화가 더 중요하다고 판단한 셈이다.

두 방식을 한 메커니즘 안에서 섞는 장치도 있다. `sid_hash_level` 옵션을 켜면 semantic ID 6단계 뒤에 **post ID 해시를 코드북 크기(256)로 한 번 더 접은 값** 을 7번째 레벨처럼 붙인다. 내용으로 설명되는 부분은 앞 6단계가 맡고, 내용만으로는 구분이 안 되는 개체 고유의 무언가를 마지막 한 칸이 받아내는 구조다.

# G) 도입할 때 정해야 하는 것들

버킷 수는 학습을 시작하기 전에 확정해야 한다. [[hashing trick]] 이 파라미터를 없애주는 것처럼 보이지만 해시 공간 크기라는 하이퍼파라미터가 남는다는 지적이 그대로 적용된다. 게다가 hash-based embedding에서는 이 값이 곧 테이블 행 수라서 GPU 메모리와 체크포인트 크기를 직접 결정한다. Phoenix가 user/item에 1억, author에 3천만을 쓰고 IP에 1천만을 쓴 배분도 카디널리티 추정에서 나온 값이다.

해시 개수는 표현력과 비용의 교환이다. $k$ 를 늘리면 완전 충돌 확률이 지수적으로 떨어지지만 lookup 횟수와 projection 파라미터가 선형으로 늘어난다. Phoenix가 전 엔티티에 일괄로 2를 쓰는 걸 보면, 버킷을 카디널리티 수준으로 넉넉히 잡을 수 있다면 2로 충분하다는 판단으로 읽힌다.

운영에서 감수해야 하는 건 추적 불가능성이다. 사전이 없으므로 특정 행이 어떤 엔티티의 것인지 역으로 알 수 없고, 특정 아이템의 임베딩만 골라 초기화하거나 삭제하는 작업도 성립하지 않는다. 반대로 이 성질 덕분에 사전 배포 실패나 학습·서빙 사전 불일치 같은 사고 유형이 통째로 사라진다.

정리하면 hash-based embedding이 값을 하는 조건은 명확하다. **ID 카디널리티가 크고, 계속 늘어나고, 새로 생긴 ID가 곧바로 서빙에 들어가야 하는** 경우다. 피드, 광고([[CTR prediction]]), 커머스 검색처럼 아이템 풀이 하루에도 여러 번 갈리는 도메인이 여기 해당한다. 반대로 아이템 집합이 고정돼 있고 카디널리티가 수십만 수준이면, 사전을 유지하는 비용이 충돌을 감수하는 비용보다 싸다.

# References

- [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm) — X For You 피드 알고리즘
- [phoenix/README.md](https://github.com/xai-org/x-algorithm/blob/main/phoenix/README.md) — Key Design Decisions, Model Architecture Configs
- [xrex/models/recsys_embedding.py](https://github.com/xai-org/x-algorithm/blob/main/phoenix/xrex/models/recsys_embedding.py) — `HashTable`, `_hash_ids_batch`
- [xrex/models/recsys_feature_prep.py](https://github.com/xai-org/x-algorithm/blob/main/phoenix/xrex/models/recsys_feature_prep.py) — `_project_hash`, semantic ID 임베딩
