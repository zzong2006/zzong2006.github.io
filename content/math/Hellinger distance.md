---
title: "Hellinger distance"
tags:
  - statistic
  - machine_learning
aliases: []
---

# A) Hellinger Distance ?

* Related
	* [[KL-Divergence]]
	* [[Jensen–Shannon divergence]]
* 정의
	* $f$-divergence 종류 중 하나로, 두 확률 분포 $P,Q$ 의 거리를 계산하기 위해 사용함
	* $H^{2}(P,Q)=\frac{1}{2}\int(\sqrt{dP}-\sqrt{dQ})^{2}$
* [[KL-Divergence]] 의 관계
	* Hellinger 거리가 $d_{H}(p,q)$ 라고 한다면, $d_{KL}(p\|q)\geq2d_{H}^{2}(p,q)$ 를 만족한다.
		* 증명은 [stackoverflow](https://stats.stackexchange.com/questions/130432/differences-between-bhattacharyya-distance-and-kl-divergence)
