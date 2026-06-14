---
tags: ["deep_learning", "kaggle", "paper_review", "tabular"]
---

# A) TabPFN ?

[[Prior-data Fitted Network|PFN]] 에 기반하여 만들어진 모델이다.
PFN 은 [[posterior predictive distribution]] 을 근사하는 방식으로 이뤄진다.

TabPFN 의 구조는 단일 [[transformer]] 로 이루어져 있다.

오프라인 stage 에서 PFN 은 prior 가 주어질때의 PPD 를 근사하여 학습한다. 이렇게하면 online stage 에서 한번의 forward pass 만으로 새로운 데이터셋에 대한 예측을 수행할 수 있다.

# B) Limitation

트랜스포머 기반 모델이라 그런지 데이터셋이 적은 경우에만 효율적이라고 한다. 논문의 evaluation 에서 분류 문제푸는 경우에도 최대 1,000 개의 샘플에 (numerical) 피쳐 개수가 100 개 정도로 산정했다고 한다 (클래스 수는 10 개). 이 기준 이상으로 데이터를 구성해서 작업할 수 있겠지만 보장은 못한다는 듯.

자세히 말하면, 런타임 시간과 메모리 사용량이 입력 사이즈에 따라 quadratically 하게 늘어난다. 그래서 100,000 개 이상의 데이터에서는 GPU 가 힘들어 한다고 적혀있다.

missing values 나 categorical feature 는 성능이 떨어질 가능성이 있다고 한다. numerical feature 위주로 작업했다고 (…). 추가적으로 도움이 안되는 피쳐를 prior 에 추가해서 성능이 나빠지는 경우도 고려하지 않았다고 한다. 알아서 잘 골라내라는 것 같다.

# C) Discussion

통계 개념이 들어가 있어서 상당히 복잡해 보인다. 난 통쌤이 아니라서..

# D) Related

# E) References

[TabPFN: A Transformer That Solves Small Tabular Classification Problems in a Second](https://arxiv.org/abs/2207.01848)
