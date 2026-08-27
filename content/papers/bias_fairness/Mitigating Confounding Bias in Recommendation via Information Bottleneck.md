---
tags: ["RecSyS", "bias", "fairness", "paper_review"]
---

# I. Mitigating Confounding Bias in Recommendation via Information Bottleneck ?

* https://dl.acm.org/doi/pdf/10.1145/3460231.3474263
* Abstract
	* biased 와 unbiased feedback 생성 과정을 설명
		* 두 과정의 차이는 bias 의 source 때문인데, 이를 confounding bias 라고 부름
	* biased feedback 이 존재하는 상황에서 causal diagrams 으로부터 debiased 한 표현을 얻기 위해서는 어떤 조건이 필요한지 확인함
	* 이러한 조건들을 최적화하고 [[tractable]] solution 을 찾는 debiased information bottleneck(DIB) 을 제안
		* 학습 과정에서는 독립적인 biased 와 unibased 요소들로 이루어진 biased embedding vector 를 학습하고, 테스트 과정에서는 unbiased 요소들만 사용
* Introduction
	* how to effectively alleviate the bias of the feedback data collected in a recommender system is an important problem
* Related works
	* Debiasing in [[Recommendation System]]
		* 추천 시스템에서 debiasing 하는 접근 방식은 총 4 가지의 카테고리로 분류될 수 있음
			* heuristic-based methods
			* inverse propensity score-based methods
				* sample weights 를 적용하여 biased feedback 분포를 correct
			* unbiased data augmentation methods
				* 특정 uniform policy 를 통해 모은 unbiased data 를 biased feedback 에 접목하여 모델 학습
			* some theoretical tools based methods
				* unbiased data 를 모으는 것은 실제로 비용이 많이 들기 때문에, 이론적 도구를 활용해서 단일 biased data 를 debiasing 하는 것
				* 이러한 도구들은 information bottleneck, upper bound minimization, asymmetric tri-training 등 이 있음
	* Information Bottleneck
		* [[information bottleneck]] 방식은 정보 이론에서 정확도와 복잡도의 trade-off 를 맞추기 위한 방법이다.
* Notations and Problem formulation
	* Notations
		* $N$ 개의 events: $\left(x^{1},y^{1}\right),\ldots,\left(x^{N},y^{N}\right)$
			* $x^{i}=\left(x_{1}^{i},\cdots,x_{d}^{i}\right)\in\mathcal{X}$ 은 $d$ 차원 feature vector,

$y^{i}\iny$ 는 binary response: $y=\{0,1\}$

	* Confounding Bias and Problem Formulation

		* 추천 시스템에서의 feedback 생성 과정

![[img-2295bad3ca.png]]

* $x$ 는 feature vector 고, 3 가지 파트로 나눠질 수 있음
	* confounder variables $C$, adjustment variables $A$, instrumental variables $I$
* (a) biased feedback
	* $I$ 와 $C$ 는 treatment $T$ 를 결정하고, outcome $y$ 에 대해 간접적인 영향을 줌

: $\{I,C\}\rightarrow T \rightarrowy$

* treatment 는 시스템이 추천할 아이템을 선택하거나, rank 과정 등을 의미
* $C$ 와 $A$ 는 $y$ 에 대해 직접적인 영향을 줌

: $\{C,A\}\rightarrowy$

* Confounding bias is essentially a collection of biases at the system level, such as the position bias and popularity bias.
* The proposed method

# II. Related

# III. References
