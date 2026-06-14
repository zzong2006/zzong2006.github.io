---
tags: ["MLOps", "machine_learning"]
---

# A) Scoping Process

ML 프로젝트를 정의하는 과정

(1) Biz 문제에 대해서 브레인 스토밍

* Biz problem 정의 (not AI problems)
* AI 전문가가 아닌 사람과 브레인 스토밍을 통해 이루고 싶은 목표를 설정한다.
	* e.g. Increase margin (profit per item)
* 뭘 이루고 싶은지 명확히 하기

(2) AI 솔루션을 브레인 스토밍

* (1) 에서 정의한 문제를 어떻게 해결할 것인지 생각하기

(3) 가능성있는 solution 들에 대해 가치와 가능성을 논하기

* 동일한 노력을 해도 더 가치있는 프로젝트가 있는데, 이를 잘 찾는 것이 중요함

(4) 마일스톤 & 자원 budget 정하기

* ML metrics (accuracy, precision/recall etc.)
* Software metrics (latency, etc.)
* Business metrics (revenue, etc.)
* Resources needed (data, personnel, etc.)
* Timeline

만약 (4) 를 진행하기 힘들다면, 다른 프로젝트를 벤치마킹하거나 POC (Proof of Concept) 을 먼저 진행하라.

# B) Diligence on Feasibility and Value

## B.1) Feasibility: 이 프로젝트가 가능한가?

* HLP 생각해보기: 사람한테 데이터를 주면 동일한 task 를 수행할 수 있는가?
	* e.g. self-driving car
* 프로젝트의 기록을 살펴보기: 미래 예측
* 가용할 수 있는 predictive features 가 존재하는지?
	* e.g. 과거 구매 이력을 통해 미래 구매를 예측
* 새로운 predictive features 가 존재하는지?

# C) Diligence on Value

MLE metrics 과 Biz metrics 의 균형을 맞추는게 중요하다. 서로 comfort zone 에서 벗어나야 한다.

![](https://i.imgur.com/3134e65.png)

# D) Ethical Considerations

* Is this project creating net positive societal value?
* Is this project reasonably fair and free from bias?
* Have any ethical concerns been openly aired and debated?
