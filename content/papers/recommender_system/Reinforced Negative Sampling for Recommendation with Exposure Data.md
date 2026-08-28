---
title: "Reinforced Negative Sampling for Recommendation with Exposure Data"
tags: ["IJCAI", "paper_review", "recommendation_system", "y2019"]
---

# Introduction

 data (노출이 발생한 아이템) 정보는 유저들의 negative preference 에 대한 정보를 담고있지만 활용하기는 쉽지 않은데, 다음과 같은 이유가 있기 때문이다.

* 불완전성
	* 노출된 아이템들은 일반적으로 추천 로직에 의해 선택된다. 그러나 노출되지 않은 아이템 역시 사용자에 대한 negative preference 를 가질 수 있다.
	* 노출된 아이템만을 가지고 학습을 진행하면 selection bias 가 존재하여 suboptimal 한 performance 를 만들어낼 수 있다.
* negative sampler 최적화의 어려움
	* item ID 에 대해서 discrete sampling 을 진행하기 때문에 objective function 이 미분 불가능하다. 결과적으로 gradient-based 방식의 학습이 불가능해짐

# References

* paper link: https://www.ijcai.org/proceedings/2019/0309.pdf
