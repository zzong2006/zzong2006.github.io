---
tags: ["bias", "recommendation_system"]
---

# A) Propensity ?

* 배경
	* To remedy the selection bias in evaluation, some recent work considers a recommendation as an intervention analogous to treating a patient with a specific drug.
		* In both tasks, we have only partial knowledge of how much certain patients (users) benefit from certain treatments (items), while the outcomes for most patient-treatment (user-item) pairs are unobserved.
		* A promising strategy for both tasks is weighting the observations with inverse propensity scores.
* 정의
	* The propensity $P_{u,i}$, which is defined as the marginal probability of observing a rating value $\left(P_{u,i}=P\left(O_{u,i}=1\right)\right)$ for certain user-item pair $(u,i)$, can offset the selection bias.
