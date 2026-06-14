---
tags: ["retrieval", "embedding", "multi_vector", "python"]
---

# A) `projection_dimension` Vs. `final_projection_dimension`

두 방식의 차원 축소는 **어느 단계에서, 어떻게 차원을 줄이는지**에 따라 완전히 다르게 작동합니다.

---

### A.1.1) **projection_dimension (내부 축소)**

- **적용 대상:**
  파티션별로 집계하기 전에, 각 벡터를 $D \rightarrow r$ 차원으로 먼저 축소합니다.
- **적용 위치:**
  ```python
  (N, D) point_cloud
      │  AMS-Sketch (r)  ← projection_dimension
      └─▶ (N, r) projected_matrix
  ```
- **효과:**
  한 벡터의 메모리 사용량과 연산 비용을 즉각적으로 줄입니다. $r$이 작아질수록 파티션 대표 벡터(FDE 조각)의 정보량은 감소하지만, 전체 FDE 길이도 함께 짧아집니다.
- **전제 조건:**
  `projection_type` 을 `AMS_SKETCH`로 설정해야만 의미가 있습니다.
- **최종 벡터 길이:**
  $[\text{num\_repetitions} \times 2^{\text{num\_simhash\_projections}} \times r]$

---

### A.1.2) **final_projection_dimension (최종 축소)**

- **적용 대상:**
   모든 과정을 거쳐 긴 FDE 벡터가 완성된 뒤, 한 번에 $L \rightarrow d_{final}$로 차원을 줄입니다.
- **적용 위치:**
   ```python
   long_FDE (L)   ── Count-Sketch ──▶ final_FDE ($d_{final}$)
   ```
- **효과:**
   이미 만들어진 FDE를 더 작은 크기로 변환해 저장·전송·유사도 연산 비용을 크게 낮춥니다. 이 단계에서는 다양한 파티션 정보가 해시 기반 Count-Sketch에 “섞여” 들어가 약간의 정보 손실이 있을 수 있지만, 내부 파티셔닝 표현력($r$ 값)은 그대로 보존됩니다.
- **최종 벡터 길이:**
   $d_{final}$로 고정됩니다 (예시: `1024`)

---

### A.1.3) 정리

- **projection_dimension**은 “벡터 → 파티션 집계” 직전에 적용하는 _로컬(내부) 차원 축소_입니다.
- **final_projection_dimension**은 모든 파티션을 이어붙인 후 마지막에 적용하는 _글로벌(후단) 차원 축소_입니다.

두 방식 모두 차원을 낮추지만 적용 시점과 영향 범위(표현력, 메모리 사용량, 계산 효율성)가 다릅니다. 상황에 따라 하나만 사용하거나 둘 다 조합해서 사용할 수 있습니다.
