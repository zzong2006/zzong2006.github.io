
# A) 하이퍼파라미터 최적화

## A.1) 목적

머신러닝에서 하이퍼파라미터 최적화의 목표는 주어진 머신러닝 알고리즘의 하이퍼파라미터를 찾아 검증 세트에서 최고의 성능을 내는 것입니다.

## A.2) 비효율적인 방법

Grid search 와 [[Random search]] 는 이전 결과를 기반으로 다음 하이퍼파라미터를 선택하지 않기 때문에 비효율적입니다. 과거 평가에 대한 정보 없이 무작위로 선택하므로, “나쁜” 하이퍼파라미터를 평가하는 데 많은 시간을 소비하게 됩니다.

## A.3) 베이지안 최적화 (Bayesian Optimization)

베이지안 최적화는 지금까지 확보된 데이터를 사용해 관계를 파악하고 이를 사전지식으로 사용하여 목적 함수를 최적화하는 방향으로 평가할 대상을 선정함으로써 효율적으로 탐색할 수 있도록 도와줍니다.

기본 아이디어는 다음 하이퍼파라미터를 선택하는 데 조금 더 시간을 투자하여 목적 함수 호출 횟수를 줄이는 것입니다.

### A.3.1) 핵심 모듈

1. **Surrogate Model**: 확률 모델로, 하이퍼파라미터와 목적 함수 점수의 확률을 매핑합니다: $P(\text{score}\mid\text{hyperparameters})$
2. **[[Acquisition Model]]**

### A.3.2) 최적화 단계

1. 목적 함수의 surrogate 확률 모델을 구축합니다.
2. surrogate 모델에서 가장 좋은 성능을 내는 하이퍼파라미터를 찾습니다.
3. 이 하이퍼파라미터를 실제 목적 함수에 적용합니다.
4. 새로운 결과를 반영하여 surrogate 모델을 업데이트합니다.
5. 최대 반복 횟수나 시간이 도달할 때까지 2-4 단계를 반복합니다.

### A.3.3) 시각적 설명

첫 번째 이미지는 두 번의 평가 후 surrogate 모델의 초기 추정치를 보여줍니다 — 검은색 선과 회색 불확실성 영역 — 실제 목적 함수 (빨간색) 와 비교했을 때 명확히 부정확한 추정치입니다.

  ![[img-cee32178b9.png]]

다음 이미지는 여덟 번의 평가 후 surrogate 함수입니다. 이제 surrogate 모델은 실제 함수와 거의 정확히 일치합니다.

  ![[img-cc936415fa.png]]

## A.4) 순차 모델 기반 최적화 (SMBO)

SMBO 방법은 베이지안 최적화를 공식화한 것입니다.

# B) References

[towardsdatascience](https://towardsdatascience.com/a-conceptual-explanation-of-bayesian-model-based-hyperparameter-optimization-for-machine-learning-b8172278050f)
