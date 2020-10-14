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