---
title: "clickbait"
aliases: []
tags:
  - recommendation_system
---

# A) Clickbait ?

일종의 클릭 낚시 현상 (issue) 으로, 시스템이 매력있는 썸네일 (attrative exposure features) 을 가지면서 실망스러운 콘텐츠 (dissatisfying content features) 를 가진 아이템을 자주 추천하는 현상을 의미한다.

* 그럼 어떤 시스템이 clickbait issue 가 있다는 것은 어떻게 알 수 있을까?

  ➡️ negative experience identification ?

# B) II. 평가

“clickbait 을 잘 막았다” 라는 것은 어떻게 평가할 수 있을까?

1. post-click feedback 으로 판단 (i.e. likes)

# C) III. 문제점

post-click feedback 은 일반적으로 spare 하기 때문에, like 가 존재하는 click 만 쓰기에는 많은 양의 positive sample 들을 잃을 수 있다.

# D) IV. In Viewtab

뷰탭에서는 클릭 낚시 현상이 있는걸까?

일반적으로 내가 알고싶은건 clickbait 라기 보다는 만족도를 고려하는 추천을 진행하면 좋겠다는 것이다.

기존 뷰탭은 click 을 통해 콘텐츠를 확인하지 않더라도 바로 좋아요, 공유, 구독 등을 누를 수 있다. 그래서 그 정도가 다를 수 있는 이슈가 존재한다.

# E) VI. References

## E.1) VI.A. Papers

* [[The good, the bad and the bait - Detecting and characterizing clickbait on YouTube]]
* [[Clicks can be Cheating - Counterfactual Recommendation for Mitigating Clickbait Issue]]
