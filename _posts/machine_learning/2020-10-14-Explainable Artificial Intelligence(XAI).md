---
layout: post
date:   2020-10-14 
title: "Machine Learning: Explainable Artificial Intelligence (XAI)"
categories: machinelearning
series: 99
---

* The Need for Explainable AI
  * Models are opaque
  * Make them more understandable for end user
* Today  
  Training data -> Learning Process -> Learned Function -> Output (After Input) -> User
  * Model says; "This is a cat: (p = .93)"
* Tomorrow  
  Training data -> Learning Process -> Explainable Model-> Explanation Interface (After Input) -> User
  * Model says; "This is cat: It has fur, whiskers, and claws"
* ![image-20201014205145043](https://i.loli.net/2020/10/14/vQ2iGyp3ZhEu8rO.png)
  * Produce more explainable models, while maintaining a high level of learning performance
  * Enable human users to understand, appropriately trust, and effectively manage the emerging generations of AI systems

### XAI Performers

* Creating a heat map or a salience map
  * What part of the data is the AI system paying attention to when it makes a decision  
  * ![image-20201014205912262](https://i.loli.net/2020/10/14/6d3tkF1VzKMpesL.png)
    * solar farm : focus on the roof / shopping mall : focus on the parking lot
* Explanation by Example
  * Explanation by selecting subset of training data examples that are most representative of the model's classification
  * ![image-20201014210251143](https://i.loli.net/2020/10/14/2GxRpmS3Zlgi518.png)
* Network Dissection
  * AlexNet Layers for Recognizing Place
    * Each layer takes difference place for recognizing
  * ![image-20201014210612782](https://i.loli.net/2020/10/14/F7fZMUBEDlAL8gv.png)
  * 30% 노드 정도만 확인할 수 있고, 나머지 nodes들은 vague함

* Combine Visual and Textual Explanations
  * ![image-20201014211009976](https://i.loli.net/2020/10/14/M43kyGfEUnOwrtZ.png)
  * 모델의 Prediction이 잘못되더라도, end-user가 무엇이 문제인지 파악하는 것은 매우 중요하다

* Explaining Image Classification by Counter-factual Generation
  * GAN을 이용하여 Image Classifier의 행동을 설명
  * ![image-20201014211544172](https://i.loli.net/2020/10/14/1kYgQArVLiTOCSP.png)
	  * GAN에게 배경화면 또는 강아지를 지워보라고 요청 시, 결과를 통해서 어느 부분에 집중하고 있는지 알 수 있음 





# Interpretable Machine Learning (IML)

* 기계 학습의 결과에 대한 원인을 파악할 수 있는 방법 또는 모델
  * **Interpretability** is the degree to which a human can understand the cause of a decision
  * Methods and models that make the behavior and predictions of machine learning systems understandable to humans.
  * Interpretable machine learning is not new but being rediscovered to address wider challenges.
* XAI와의 관계: IML는 XAI의 일부
  * ![image-20201015230640344](https://i.loli.net/2020/10/15/xI3LDpadGs7oihj.png)

* Why Interpretability?
  1. 설계한대로 분류 작업이 동작하는지 검증함으로써 신뢰성을 획득
  2. 사람의 알 권리(Right to Explanation)
     * 민감 정보가 유출되지 않았는지 확인할 수 있음 (Protect privacy)
     * Unbiased and not discriminating against protected groups
  3. 데이터로부터 새로운 insights를 얻기 위해서 사용
  4. Machine learning 성능 향상
     * debug and audit (low accuracy의 원인 파악)

### Explainable Models 

* Deep Explanation
  * 설명 가능한 특징(explainable features)들을 배우기 위한 deep learning techniques
* Interpretable Models
  * Structured, Interpretable, causal models 개념으로 접근
* Model Induction
  * Black box 같은 모델의 경우 explainable한 모델을 이용해 동작 원리를 추측

## Function Level Evaluation

* 모델을 특정 함수를 통해서 얻어진 factor를 통해 interpretability를 측정
  * ![image-20201015232715139](https://i.loli.net/2020/10/15/KZtnAeNUuHqlVWf.png)

### Example measures(factors)

* Model sparsity
  * Small number of features are easier to explain
  * ![image-20201015232811119](https://i.loli.net/2020/10/15/Leuo8FNl92paTzM.png)
  * High sparsity: make more weights to have zero value
* Continuity(Monotonicity)
  * 두 입력이 비슷하다면 prediction 역시 비슷할 것이고, 결과적으로 explanation도 비슷해야 한다.
  * ![image-20201015233022795](https://i.loli.net/2020/10/15/tbuhqDfrHVeRCxY.png)
* Positivity
  * 데이터의 features들이 음수와 양수가 존재하기보다는 양수와 0 만 존재하는 것이 더욱 해석하기 좋다.
* Cognitive Processing Time
  * Explanation을 이해하는데 얼마나 오래 걸리는가?

### Criteria for Interpretability

* Intrinsically interpretable models (이미 설명 가능한 모델들)
  * Decision trees
  * Linear models
  * Logistic regression
  * Decision rules
  * RuleFit
* Black box model을 interpretable model로 변환
  * E.g. model compression, global surrogate methods
* Features
  * Feature summary statistics or visualization
* Data points
  * E.g. identification of prototypes of predicted classes