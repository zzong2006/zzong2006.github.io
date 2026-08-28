---
title: "Mean Normalization"
tags: ["feature_engineering"]
---

# Mean Normalization ?

새로운 user 에 대해서 rating 을 측정할 필요가 있다.

![[img-fb9347fd95.png|image-20201102210104328]]

* 위 그림처럼 cost function 은 평가된 rating 을 활용하여 parameter 를 update 하므로, 오직 cost function 에서 영향이 있는 것은 regularization term 이다.
* 즉, 사용자 Eve 의 rating 이 없는 상태에서는 학습 과정에서 Eve 의 parameter 들은 0 으로 수렴할 수 밖에 없다.
* 최종적으로 rating 계산은 0 이 되는데 직관적으로 이러한 점수 배정은 이상하다.

새로운 user 에 대한 rating 을 좀 더 reasonable 하게 바꿔주는 방법은 mean normalization 이다.

* ![[img-e4d91cc3f4.png|image-20201102210405993]]
* 우선 rating 된 item 에 대하여, 해당 점수 값들을 normalize 하여 평균을 0 으로 만든다.
	* normalize 에서 계산된 평균 $\mu$ 는 보관한다.
* 그리고 언급된 cost function 을 이용하여 학습을 진행한다.
	* 이 경우 당연히 Eve 의 parameter 는 0 으로 수렴한다.
* 학습 이후 rating 을 추정할 때, 추정값에 이전에 구한 평균 값 $\mu$ 를 더해준다.

# References
