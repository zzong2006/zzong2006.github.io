---
layout: default
title:  "Cold start (recommender systems)"
category: Machine Learning
order: 18.1
---

출처: https://ppss.kr/archives/208811

---

시스템이 아직 충분한 정보를 모으지 못한 사용자에 대한 추론을 끌어낼 수 없는 문제입니다.

사용자 기반 추천 방식만으로는 아무런 행동이 기록되지 않은 신규 사용자에게 어떠한 아이템도 추천할 수 없을 것입니다. 아이템 기반 추천 방식에서도, 새로운 아이템이 출시되더라도 이를 추천할 수 있는 정보가 쌓일 때까지 추천이 어려워지겠죠.

아이템이나 콘텐츠의 수가 많다고 하더라도 사용자들은 소수의 인기 있는 항목에만 관심을 보이기 마련입니다(파레토 법칙). 따라서 사용자들의 관심이 저조한 항목은 정보가 부족해 추천되지 못하는 문제점이 발생할 수 있습니다.

* 파레토 법칙
  * 파레토 법칙은 전체 결과의 80%가 전체 원인의 20%에서 일어나는 현상을 의미한다.
    * 그래프로 나타내었을 때 꼬리처럼 긴 부분을 형성하는 80%의 부분을 일컫는 말입니다. 
  * ![img](https://i.loli.net/2020/11/05/QK8yRUq6Sujxk3T.png)
  * 이 현상을 협업 필터링에 적용하면, 사용자들이 관심을 많이 보이는 소수의 콘텐츠가 전체 추천 콘텐츠로 보이는 비율이 높은 ‘비대칭적 쏠림 현상’이 발생한다는 의미입니다.



### 새 사용자

Note that all these information is acquired during the registration process, either by asking the user to input the data himself, or by leveraging data already available 

* e.g. in his social media accounts

## Mitigation strategies

New user의 경우, 사용자 지역의 가장 인기있는 item을 제공한다.

### Profile completion

사용자의 행동을 관찰하거나 직접적으로 질문해서 사용자 profile을 완성시키는 것에 대해 공헌한다. 

예를 들어, 등록 과정에서 사용자에게 몇몇 영화의 선호도를 물어본다. 

이 전략은 단순하지만 등록을 위해 사용자에게 추가적인 시간을 소요하게 만든다는 단점이 있고, 사용자의 특정 선호도가 무한히 지속된다는 보장이 없을 뿐더러, 사용자가 제공한 정보가 무성의하게 아무 의미없이 제안한 정보일 수 있다.

다른 사용자의 activities를 이용하여 특정 사용자의 profile을 완성시킬 수 있다. 예를 들어 social media 플랫폼 또는 browsing 기록을 이용해서 말이다. 

새로운 아이템의 경우 해당 아이템의 특징을 추출하고(such as embedding), 그 아이템과 비슷한 다른 아이템의 유사도를 통해서 community가 그 item에게 평가할 rating을 예측한다.

또 다른 가능한 기법으로는 능동학습(기계학습)을 적용하는 것이 있다. 적극적 학습의 주요 목표는 사용자에게 선호도 도출 과정에서 사용자를 안내하여 추천자의 관점에서 가장 유용한 항목이 될 항목만을 평가하도록 요청하는 것이다. 

* 가장 유용한 데이터인지는 어떻게 아는가? 예를 들어서, 어떤 데이터셋에 두 클러스터를 만들고 싶다고 해보자. 만약, 각 클러스터에 해당하는 두 점을 알게됬을 경우, 그 다음 가장 유용한 데이터는 무엇인가? 그 두 점 사이에 위치한 점이야 말로, 클러스터간 boundary를 결정짓는 유용한 점 일것이다.

다른 agent에게 그 사용자로부터 배운 선호 정보들을 공유받는 것도 다른 방법 중 하나이다.

###  Feature mapping

embedding function 또는 a group-specific latent factor을 이용해서 user와 item의 latent factor를 찾는 방법

직접 user와 item 간 상호작용이 존재하지 않아도, 기존의 사용자가 어떤 아이템을 좋아하는지 알고, 그 사용자와 아이템의 latent factor를 유추해낼 수 있다면, new user 또는 new item에 대한 latent factor를 통해 선호도를 충분히 유추해낼 수 있음.



### Hybrid feature weighting

feature에 가중치를 두는 방법

예를 들어 영화의 경우, 나라, 제목, 감독, 등등이 features로 표현될 수 있다. 특히, 제임스 본드 시리즈에서는 주연 중 일부는 자주 바뀌지만, Lois Maxwell 같이 바뀌지 않는 주연들이 존재한다. 이러한 특징은 다른 어느 특징보다 제임스 본드 시리즈를 잘 표현하는 feature가 될것이다.  

feature weight를 추정하는 방법에는 대표적으로 tf-idf 가 존재한다.

### Differentiating Regularization Weights

너무 정보량이 많아서 추천을 위해 가장 중요한 정보만 가중치를 부여하는 것 

Matrix factorization에서 너무 많은 정보들이 쌓이면 parameter가 많아지므로, overfitting을 막기 위해서 모든 feature들에게 regularization을 적용하게 되는데 중요한 정보도 함께 훼손될 수 있다.