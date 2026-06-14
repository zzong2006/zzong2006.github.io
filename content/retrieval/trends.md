---
tags: ["retrieval", "IR", "survey"]
---

2025년 retrieval 구성 방식에 따른 트랜드 조사

# A) Lesson Learned

- 네거티브 샘플 수를 늘릴수록 특히 in-domain 환경에서 성능 향상이 두드러지지만, out-of-domain 일반화에는 큰 영향이 없었습니다.

# B) Methods

- 여러 cross-encoder re-ranker 앙상블을 활용해 distillation score 를 생성
