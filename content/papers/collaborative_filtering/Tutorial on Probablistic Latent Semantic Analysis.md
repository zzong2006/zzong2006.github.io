---
tags: ["nlp", "paper_review"]
---

* Tags
	* [[Probabilistic latent Semantic Indexing]], [[PLSI]], [[multinomial distribution]]
* paper link
	* https://arxiv.org/pdf/1212.3900.pdf
* notations
	* size
		* $T$: topic size, $D$: document size, $N_d$: position size of document $d$, $V$: term size
	* probability
		* 각 단어 $V$ 에 대한 확률 분포 $\phi_{k}$ 가 존재
			* $p(w\midk)=\phi_{(k,w)}$ and $\sum_{w}^{V}\phi_{(k,w)}=1$
		* 각 a distribution θd over a fixed number of topics T for each document d
			* $p(k\midd)=\theta_{(d,k)}$ and $\sum_{k}^{T}\theta_{(d,k)}=1$
* generation process
	* 어떤 사람이 문서 $d$ 에 글을 쓴다고 해보자. 문서 $d$ 에 있는 각 token position 에 대해 어떤 term 을 작성할지 정해야 한다.
		* 첫째로, $i$- 번째 position 에 대해, $\theta_d$ 분포를 기반해서 어떤 topic 을 주제로 쓸지 정한다.
			* 이 단계에서는 $T$- 면을 가진 주사위를 굴리는 것과 동일하다. 왜냐하면 $\theta_d$ 분포가 [[multinomial distribution]] 를 따르기 때문이다.
		* 둘째로, 정해진 topic $k$ 에 대해서 $\phi_k$ 에 기반해서 어떤 term 을 작성할지 정해야 한다.
			* 첫번째 단계와 비슷하게, $V$- 면을 가진 주사위를 굴리는 것과 동일하다.
	* 위와 같은 두 단계는 데이터셋의 모든 문서들과 모든 token position 에 대해 반복된다.
	* 요약된 generation process
		* For each document $d$
			* For each token position $i$
Choose a topic $z$ ∼ Multinomial($θ_d$)
Choose a term $w$ ∼ Multinomial($φ_z$)
* 문서 $d$ 의 position $i$ 에서 term $w$ 가 나타날 확률은 다음과 같다
: $\displaystylep\left(d_{i}=w\mid\Phi,\theta_{d}\right)=\sum_{z=k}^{T}\phi_{(z,w)}\theta_{(d,z)}$
* 그리고 전체 데이터셋 $\mathcal{W}$ 에 대한 [[joint likelihood]] 는 다음과 같다
: $\begin{aligned}p(\mathcal{W}\mid\Phi,\Theta)&=\prod_{d}^{D}\prod_{i}^{N_{d}}\sum_{z=k}^{T}\phi_{(z,w)}\theta_{(d,z)}\\&=\prod_{d}^{D}\prod_{w}^{V}\left(\sum_{z=k}^{T}\phi_{(z,w)}\theta_{(d,z)}\right)^{n(d,w)}\end{aligned}$
	* $n(d,w)$ 는 문서 $d$ 에서 term $w$ 가 나타난 빈도 수를 의미
	* we wish to obtain the parameters that can maximize the above likelihood.
* objective function
: $\displaystyle\arg\max_{\Phi,\Theta}\left[\logp(\mathcal{W}\mid\Phi,\Theta)+\sum_{d}^{D}\lambda_{d}\left(1-\sum_{z}^{T}\theta_{(d,z)}\right)+\sum_{z}^{T}\sigma_{k}\left(1-\sum_{w}^{V}\phi_{(z,w)}\right)\right]$
	* the second and the third part of the equation is [Lagrange Multipliers]([[Lagrange multiplier method]]) to guarantee Multinomial parameters in range `[0, 1]`.
	* It is difficult to directly optimize the above equation due to the log sign is out of a summation.
	* $\displaystyle\mathcal{L}=\logp(\mathcal{W}\mid\mathbf{R},\Phi,\Theta)=\sum_{d}^{D}\sum_{di}^{N_{d}}\sum_{z}^{T}R_{\left(w_{di},z\right)}\left(\log\phi_{\left(z,w_{di}\right)}+\log\theta_{(d,z)}\right)$
* [[machine_learning/EM algorithm]] of PLSA
	* E-step: 데이터와 현재 parameters 의 값이 주어진 상태에서 the posterior distribution of hidden variables 를 계산
		* $\displaystyle\begin{aligned}\left\langleR_{\left(w_{di},k\right)}\right\rangle&=p\left(R_{\left(w_{di,},k\right)}=1\mid\mathcal{W},\Theta,\Phi\right)=\frac{p\left(\mathcal{W},R_{\left(w_{di},k\right)}=1\mid\Theta,\Phi\right)}{\sum_{k}^{T}p\left(\mathcal{W},R_{\left(w_{di},k\right)}=1\mid\Theta,\Phi\right)}\\&=\frac{p\left(w_{di},R_{\left(w_{di},k\right)}=1\mid\theta_{d},\Phi\right)}{\sum_{k}^{T}p\left(w_{di},R_{\left(w_{di},k\right)}=1\mid\theta_{d},\Phi\right)}=\frac{p\left(w_{di}\mid\phi_{\left(k,w_{di}\right)}\right)p\left(k\mid\theta_{d}\right)}{\sum_{k}^{T}p\left(w_{di}\mid\phi_{\left(k,w_{di}\right)}\right)p\left(k\mid\theta_{d}\right)}\\&=\frac{\phi_{\left(k,w_{di})\right.}\theta_{(d,k)}}{\sum_{k}^{T}\phi_{\left(k,w_{di}\right)}\theta_{(d,k)}}\end{aligned}$
	* M-step: hidden variables 의 현재 설정을 기반으로 parameter 들의 새로운 optimal 값들을 획득
		* $\displaystyle\theta_{(d,z)}=\frac{\sum_{d_i}<R_{\left(w_{d_i}z\right)}>}{N_{d}}$
		* $\displaystyle\phi_{(z,w)}=\frac{\sum_{d}^{D}\sum_{di}^{N_{d}}<R_{\left(w_{di},z\right)>}\mathbb{I}\left(w_{di}=w\right)}{\sum_{w^{\prime}}^{V}\sum_{d}^{D}\sum_{di}^{N_{d}}<R_{\left(w_{di},z\right)>}\mathbb{I}\left(w_{di}=w^{\prime}\right)}$
