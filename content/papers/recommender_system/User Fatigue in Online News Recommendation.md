---
tags: ["WWW", "implicit_feedback", "paper_review", "recommendation_system", "y2016"]
---

# A) User Fatigue in Online News Recommendation ?

* Abstract
	* the impact of User Fatigue has been mostly ignored in the literature
	* User fatigue 란, 특정 유저에게 동일한 아이템을 반복적으로 보여줬을 때, 해당 아이템에 대해 빠르게 흥미를 잃는 현상을 의미한다.
	* online [[Recommendation System]] 에서 발생하는 user fatigue 에 대한 광범위한 연구를 진행
		* Bing Now 뉴스 추천에서의 유저 행동 로그를 분석
	* user fatigue 는 CTR 의 큰 감소와 유저 경험에 안좋은 영향을 미치는 것을 확인함
		* 또한, 다른 유저 간에는 반복 추천에 대해 반응하는 정도도 다름을 확인
* Introduction
	* 유저의 연속적인 두 방문에 얼마나 많은 news overlap 이 있는지 확인하기 위해 평균을 계산
		* ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FGHZN8ss8ZP.png?alt=media&token=49aa5c14-c1c8-4ad8-9c44-0a3e1e97fd3c)
			* 연속된 방문의 time gap 이 커질수록 overlap 되는 아이템 수가 줄어듦
	* Fundamental RQ
		* 사용자들이 반복적인 추천을 봤을 때 fatigue 되는 것인가?
		* 만약 그렇다면, 사용자의 fatigue 에 영향을 미치는 major factor 는 무엇인가?
	* fatigue 와 관련있는 factor 를 활용한 방법을 고안하여 더 나은 ranking 결과를 낼 수 있도록 함

# B) Related

# C) References
