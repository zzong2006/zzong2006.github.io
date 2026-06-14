---
tags: ["deep_learning", "paper_review", "recommendation_system"]
---
[2107.05315](https://arxiv.org/pdf/2107.05315)

we reformulate the cold-start item representation learning from an information-theoretic standpoint. It aims to maximize the mutual dependencies between item content and collaborative signals.

the representation learning is theoretically lower-bounded by the integration of two terms: mutual information between collaborative embeddings of users and items, and mutual information between collaborative embeddings and feature representations of items.

Fromtheviewpointofrobustlearning,robustness-basedmethods frame the cold-start items as the corrupted forms of warm
items whose interaction histories are missing. Technically, they augment the training data by randomly corrupting warm items’ collaborative embeddings or manually crafting new items so as to enhance the generalization ability to unseen items. However, no function is designed to explicitly considertherelationshipsbetweenitemcontentandcollaborative embeddings, thereby hardly refining useful collaborative signals for cold-start items. • Constraint-based methodsexplicitly model the relationships betweenitemcontentandcollaborativeembeddings by applying a constraint loss. Specifically, for an item, its content is transferred as feature representation; thereafter, a constraint loss (e.g., 𝐿2 regularizer) enforces dimension-wise similarity between feature representation and collaborative embedding. Nonetheless, there are two limitations: (1) such dimension-wise regularization merely remains the consistency between these two representations, which possibly discards the heterogeneous and unique information; (2) it lacks sufficient theoretical support to ensure what and how much information on collaborative embeddings is preserved in feature representations

우리는 콜드스타트 아이템의 표현 학습을 정보이론적 관점에서 새롭게 정식화한다. 핵심은 아이템의 콘텐츠 정보와 협업 신호 간의 상호 의존성을 최대화하는 것이다. 이때 학습된 표현은 이론적으로 두 가지 항의 결합으로 하한이 보장된다. 첫째, 사용자와 아이템의 협업 임베딩 간 상호정보량, 둘째, 아이템의 협업 임베딩과 특징 표현(feature representation) 간 상호정보량이다.

견고성(robustness) 기반 접근법에서는 콜드스타트 아이템을 상호작용 기록이 결핍된 ‘손상된(warped)’ 웜(warm) 아이템으로 간주한다. 이를 위해 웜 아이템의 협업 임베딩을 무작위로 훼손하거나 새로운 아이템을 인위적으로 생성하여 학습 데이터를 증강한다. 이러한 방식은 미지의 아이템에 대한 일반화 능력을 높이는 데 유용하지만, 콘텐츠와 협업 임베딩 간 관계를 직접적으로 반영하는 기능은 부족하다. 따라서 실제로 콜드스타트 상황에서 필요한 유용한 협업 신호를 충분히 정제하지 못한다는 한계가 있다.

제약(constraint) 기반 방법은 콘텐츠와 협업 임베딩 사이의 관계를 명시적으로 모델링하기 위해 제약 손실(constraint loss)을 도입한다. 예를 들어, 특정 아이템에 대해 콘텐츠 정보를 특징 표현으로 변환한 뒤, $L_2$ 정규화를 활용해 특징 표현과 협업 임베딩이 차원별로 유사하도록 강제한다. 그러나 이러한 방식에는 두 가지 문제점이 존재한다. (1) 차원 단위의 일관성만 유지되므로, 이질적이고 고유한 정보를 소거할 가능성이 있다. (2) 협업 임베딩에 담긴 정보가 특징 표현에 어느 정도 보존되는지에 대해 충분한 이론적 근거가 부족하다.

**예상되는 긍정적 변화:**

- **신규 아이템 노출 속도 증가:** 가장 큰 효과입니다. 이전에는 데이터가 쌓일 때까지 기다려야 했던 신상품들이 등록 즉시 개인화 추천에 포함될 수 있습니다. 이는 재고 관리 및 초기 판매 증진에 직접적으로 기여할 것입니다.
- **추천 다양성 증대:** 인기 아이템에 편중되던 추천 목록에, 사용자의 잠재적 취향과 일치하는 새로운 롱테일(long-tail) 아이템들이 포함될 기회가 많아져 전반적인 추천의 다양성과 질이 향상될 것입니다.

**예상되는 부정적 변화 (또는 리스크):**

- **필터 버블(Filter Bubble) 강화 가능성:** 모델이 콘텐츠 유사성에 크게 의존하므로, 사용자가 특정 스타일의 상품을 몇 번 소비하면, 계속해서 시각적으로나 의미적으로 매우 유사한 신상품들만 추천받게 될 수 있습니다. 이는 사용자의 경험을 오히려 단조롭게 만들 위험이 있습니다.
- **초기 노출의 양극화:** 콘텐츠가 풍부하고 '좋은' 아이템은 빠르게 노출되는 반면, 콘텐츠가 부실한 신규 아이템은 추천 시스템에서 완전히 소외되는 '부익부 빈익빈' 현상이 발생할 수 있습니다.
