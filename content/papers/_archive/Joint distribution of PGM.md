---
tags: ["PGM", "paper_review", "probability_distribution", "statistic"]
---

# A) Joint Distribution of PGM ?

각 random variable 에 따른 확률 분포

# B) 예시

Intelligence ($I$: $i^0,i^1$), Difficulty ($D$: $d^0,d^1$), Grade ($G$: $g^1,g^2,g^3$)

![|340](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2FBVFrWMAbIS.png?alt=media&token=01737524-7f62-4f81-9d70-ffbe211bcf51)

위 분포의 모든 값을 합치면 1 이 된다.

# C) Conditioning

* joint distribution 에서 random variable 이 특정 조건을 만족하는 확률들만 찾을 수 있음
* 다만, 단순히 그 확률들을 찾게되면 모두 더했을 때 $1$ 이 아니므로, normalization 을 해줌으로써 제대로된 확률 분포 (conditional probability distribution) 를 확인할 수 있음
* 예시: condition on $g^1$

![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2F3Zr7Rr0_xq.png?alt=media&token=8cc6e034-99e0-42b3-baa5-3c211105c59a)

* unnormalized measure 에서 normalized distribution 으로 바꿈
* Marginalization
	* 특정 확률 변수에 해당하는 분포의 모든 확률값을 더하는 방법
	* 예시: marginalize $I$
		* $\sum_{I}P(I,D)=P(D)$

![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Fwoosung_graph%2F606JX5dkko.png?alt=media&token=cdb39936-631c-4495-92aa-a3bb3c3f0bb8)

# D) Related

# E) References
