---
title: "method of moments"
tags: ["MAB", "reinforcement_learning"]
aliases: ["moment method"]
---

# A) Method of Moments ?

## A.1) Recoteam

* [픽코마 적용 사례 issue](https://github.daumkakao.com/toros/intern-logging/issues/25): 2019 하계 인턴, 픽코마/선물하기 연관 추천 개선
	* 신규 arm 이 지나치게 높은 entry expected reward 값을 가지고 있기 때문에 신규 arm 이 아니면 거의 explore 되지 못 하는 문제가 있었음
	* 기존 arm 과 신규 arm 이 적절하게 섞여서 explore 될 수 있게 만든데 있었다.
	* 픽코마 및 선물하기 (Toros Gift) 에서 실험 결과 각각 CVR and CTR 하락
* [미디어다음 스포츠 비디오 I조: moment method 개선](https://github.daumkakao.com/toros/intern-logging/issues/34#issuecomment-168494)
	* prior dominant 문제
		* 새롭게 initialize 된 arm 은 prior 에 절대적으로 depend 하게 되고, exploration 이 올바르게 이루어지지 않음
			* 베이지안 prior setting 에서도 주의할 점 중 하나임
		* 예시
			* alpha=5, beta=500 인 경우, 실제 클릭이 40/100 이 들어와서 해당 컨텐츠가 매우 좋은 컨텐츠임을 암시하더라도 계산된 posterior ctr 은 45/600 으로, 7.5% 의 ctr 정도로 예측
		* 해결 방안
			* CTR 평균을 통해 alpha 만 계산하고, beta 를 16 정도로 고정해서 낮춤
				* LinUCB 입장에서 보면 mean init 하고, std_dev 는 고정시키는 것과 비슷하다고 생각함
			* 실제 추천에 사용되는 arm 들의 ctr 의 pred 만 이용해서 초기화함
	* idea
		* LinUCB 에서 초기화된 theta 가 pred CTR 이 수렴할때까지 어느정도 학습이 요구되는지?
		* non Mean Init 과 mean init 방식이 pred CTR 이 초기에는 다르겠지만, 실질적으로 CTR 에 의미를 주기전에 바로 수렴하여 영향이 그렇게 크지 않을 수 있음
* [미디어다음 J 조] Initialized problem in MAB
	* new item 과 비슷한 item 들을 찾고, 그 아이템들만 이용해서 moment method 적용
	* 성능 하락
* 채널탭, 연예탭
	* https://github.daumkakao.com/toros/aurochs.app/issues/727
	* [성능 하락 코멘트](https://github.daumkakao.com/toros/aurochs.app/issues/727#issuecomment-153054)
* PRs
	* https://github.daumkakao.com/toros/aurochs.app/pull/692

# B) Related

# C) References
