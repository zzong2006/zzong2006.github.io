---
tags: ["LLM"]
---

# A) llm_as_classifier ?

왜 전통적인 [[classification|분류]] 모델을 사용하지 않고, [[Large Language Model|LLM]] 을 통해 분류 문제를 해결하려 할까?

# B) LLM 만의 장점

* 학습 데이터셋이 많지 않은 경우, 빅 모델이 성능 면에서 더 효율적일 수 있다.
* 클래스가 자주 바뀌는 경우, LLM 은 자주 재학습시킬 필요가 없다.
* 단순히 클래스 이름을 분류하는 것을 떠나서, 모델의 출력을 구체화 (elaborate) 해보고 싶을 때가 있다.

The flexibility of the LLM method makes it very attractive for cases where you need to do ad-hoc or experimental classification:

* You only need to perform the task infrequently or for only one activity
* You don’t have dozens of labelled examples already
* The classes might change
* You want the output to be more elaborate than just the class name

# C) References
