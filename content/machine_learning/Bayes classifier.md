---
tags: ["machine_learning", "statistic"]
---

# 1. Bayes Classifier ?

* 조건부 확률을 이용한 분류기
	* $\operatorname{Pr}\left(Y=j\mid X=x_{0}\right)$
	* $X=x_0$ 가 주어졌을 때, $j$ class 일 확률을 계산함
* 실제로는 데이터 분포를 모르기 때문에, true classifier 를 찾는 것은 불가능함
	* 대신, Bayes classifier 를 근사할 수 있는 방법들이 존재함
* Bayes error rate
	* $\displaystyle1-E\left(\max_{j}\operatorname{Pr}(Y=j\mid X)\right)$
	* the expectation averages the probability over all possible values of $X$
		* The Bayes error rate is analogous to the [[irreducible error]]
	* Bayes error rate 는 the lowest possible test(validation) error rate 를 얻을 수 있다고 증명되었기 때문에, 기준으로 활용할 수 있음
* Bayes classifier 를 근사할 수 있는 방법들
	* K-nearest neighbors (KNN) classifier
		* 주어진 데이터 $x_0$ 와 가장 가까운 $K$ 개의 데이터 포인트 ($\mathcal{N}_{0}$) 를 찾고, 해당 데이터들이 어떤 클래스에 해당하는 지 검사. 이후 과반수 클래스를 $x_0$ 에 부여
		* $\displaystyle\operatorname{Pr}\left(Y=j\mid X=x_{0}\right)=\frac{1}{K}\sum_{i\in\mathcal{N}_{0}}I\left(y_{i}=j\right)$
		* KNN can often produce classifiers that are surprisingly close to the optimal Bayes classifier

# 3. Related

# 4. References
