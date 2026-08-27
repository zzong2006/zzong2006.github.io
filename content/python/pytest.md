---
tags: ["test", "python"]
---

# A) `fixtures`

“Fixtures”는 테스트가 그것을 수행하는 데 필요한 모든 것으로, 문자 그대로 각각의 **준비 (arrange)** 단계와 데이터를 의미한다.

## A.1) Arrange?

**Arrange**(준비) 는 테스트를 위해 모든 것을 준비하는 단계다. 마치 도미노 처럼 **act** 같은 state-changing 단계가 연쇄적으로 일어난다.

## A.2) Act?

**Act** is the singular, state-changing action that kicks off the **behavior** we want to test. This behavior is what carries out the changing of the state of the system under test (SUT), and it’s the resulting changed state that we can look at to make a judgement about the behavior. This typically takes the form of a function/method call.

# B) References

[pytest fixtures: explicit, modular, scalable — pytest documentation](https://docs.pytest.org/en/6.2.x/fixture.html)
