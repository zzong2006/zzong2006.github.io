---
title: "Count Sketch"
tags: ["embedding"]
---

Count Sketch는 FDE뿐만 아니라 일반적인 단일 벡터(예: SBERT 768차원 임베딩)에도 그대로 적용하여 차원을 줄일 수 있는 방법입니다.

Count Sketch는 일반 벡터의 차원 축소에도 효과적으로 활용할 수 있으며, 오프라인 학습 과정 없이 대용량 데이터나 스트리밍 환경에서 특히 유용합니다. 다만 충돌 노이즈 특성상 PCA나 GRP에 비해 약간 더 큰 차원을 사용해야 유사한 정확도를 기대할 수 있으므로, 실험을 통해 적절한 $d_{\text{final}}$ 값을 찾는 것이 중요합니다.

Count Sketch 적용 방법

입력 벡터 $x \in \mathbb{R}^D$를 원하는 최종 차원 $d_{\text{final}}$로 스케치합니다. 구현 방식은 아래와 같습니다.

```python
out = np.zeros(d_final)
for i in range(D):
    b = h(i)               # 0부터 d_final-1까지의 해시 버킷
    sgn = s(i) ∈ {±1}      # 부호 함수, ±1 중 하나
    out[b] += sgn * x[i]
```

여기서 $h$와 $s$는 seed에 따라 결정되는 해시 및 부호 함수입니다.

FDE 코드에서 `_apply_count_sketch_to_vector` 함수를 그대로 활용할 수 있습니다.

장점

- 데이터와 무관하게 적용 가능하며, 별도의 학습 없이 대규모 데이터셋도 즉시 처리할 수 있습니다.
- 메모리 사용량이 $O(d_{\text{final}})$로 매우 효율적이며, 투영 행렬을 저장할 필요가 없습니다.
- 내적(dot product)의 기대값이 무편향으로 보존되어 dot/cosine 유사도 근사가 가능합니다.
- 완전히 스트리밍 처리가 가능해 온라인 삽입 및 업데이트에도 적합합니다.

한계 및 주의사항

- 충돌로 인한 노이즈 때문에 PCA나 Gaussian Random Projection(GRP)에 비해 같은 성능을 얻으려면 더 큰 차원이 필요합니다.
- 밀집(dense) 벡터의 경우 “부호 충돌” 현상이 자주 발생하므로, $d_{\text{final}}$을 너무 작게(256 이하 등) 설정하면 품질 저하가 심할 수 있습니다.
- L2 정규화 후에 스케치를 적용하면 cosine 유사도 근사가 더욱 안정적입니다.

실무 활용 팁

- 적정 $d_{\text{final}}$ 값은 256, 512, 1024 등 다양한 값을 실험하여 최적화하는 것이 좋습니다.
- 검색 인덱스(HNSW, Faiss IVF 등)는 스케치된 벡터로 직접 구축하거나, 스케치 후 L2 정규화하여 코사인 기반 인덱스로 사용할 수 있습니다.
- Product Quantization(PQ) 또는 Scalar Quantization과 함께 사용하여 추가적인 압축 및 저장 효율을 높일 수도 있습니다.

간단 예시 코드

```python
from muvera_eval.generator import _apply_count_sketch_to_vector
import numpy as np

vec_768 = np.random.randn(768).astype(np.float32)         # 예시 임베딩
sketched_256 = _apply_count_sketch_to_vector(vec_768, final_dimension=256, seed=42)

print(vec_768.dot(vec_768), sketched_256.dot(sketched_256))   # 길이 비교
```
