---
tags: ["brainstroming"]
---

연구를 위해 문제를 정의하고 솔루션을 찾는다. 일반적으로 [[scientific method]] 를 따른다.

# A) Problems

## A.1) For CBandits

cbandit 을 운영하면서 발생할 수 있는 문제들에 대해서 고민해본다.

### A.1.1) Problem: Large Actions

sequential decision making 방식에서 actions 이 많은 경우 문제가 발생한다.

cbandit 으로 해결할 수 있는 방법은 여러가지가 있음

1. cbandit 속도를 빠르게 한다.
2. two-stage 구조를 가져간다.

### A.1.2) Cold-start

종종 user feature 가 없는 경우에 대해서는 대처가 미흡한 편이다. 한번도 클릭한 적이 없다면 무조건 fallback 쪽으로 넘어가게 되어있다.

### A.1.3) Bias

cbandit 내에서 발생할 수 있는 bias 를 해결한다. 사실 cbandit 뿐만 아니라 일반적인 추천 시스템에서는 여러 bias 가 존재한다고 볼 수 있음.

1. position bias
2. popularity bias

### A.1.4) Exploration

효율적인 탐색이 필요하다. UCB 계열 방식은 constant 한 exploration hyperparameter 를 가지고 있어서 개인화가 제대로 진행되지 못한다. 개인화된 exploration 을 진행할 필요가 있는걸까?

### A.1.5) Multiple-Objective Learning

아래의 [[#One-Class CF OCCF vs HOCCF]] 와 비슷하다. 목적은 다양한 feedback 을 학습하는 Bandit 을 구현하는 것.

## A.2) Features

### A.2.1) One-Class CF (OCCF) vs. HOCCF

HOCCF 는 Heterogeneous OCCF version 을 의미하며, 여러 feedback 종류를 하나로 합치는 문제를 의미한다.

어떻게 하면 다양한 feedback(e.g. users purchase, examinations etc.) 을 하나로 합칠 수 있을까?

일종의 [[multi-task learning]] 방식으로 생각할 수 있다.

### A.2.2) Using Future Information

Matrix Factorization 은 시간 정보를 고려하지 않는다.

### A.2.3) Using Slow and Fast Preferences

유저의 단기 성향과 장기 성향을 함께 학습할 수 있을까?

### A.2.4) Cross-domain Learning

다른 도메인에서 생성한 데이터를 활용하여 추천에 유용한 feature 를 생성할 수 있을까?

### A.2.5) Implicit Feedback

click 이 반드시 positive feedback 을 의미하지는 않는다. 이를 확실히 알 수 있는 방법은 없는걸까?

### A.2.6) Dynamic Approach

user feature 를 sequential 형식으로 업데이트 할 수 없을까?

# B) Others

## B.1) Baits Issue

낚시성 글들을 어떻게 처리하거나 제한할 수 있는가?

유저 만족도는 어떻게 측정할 수 있는가?

# C) Solutions

## C.1) For Large Actions: Two-stage

two-stage 로 시도해본 내역은 팀에서 3 가지 정도가 있음

1. graph 활용
2. [[pointwise mutual information|NPMI]] 활용
3. rule based 방식

# D) Related

# E) References
