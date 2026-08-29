---
title: "A Contextual-Bandit Approach to Personalized News Article Recommendation"
tags:
  - MAB
  - bandit
  - linear_regression
  - paper_review
  - recommendation_system
aliases: [LinUCB]
---

# A) Abstract

사용자와 콘텐츠 정보를 활용한 개인화 웹 서비스 (광고, 뉴스 등) 를 제공하는 것은 다음과 같은 두 가지 이유로 어렵다.
1. web service is featured with **dynamically changing** pools of content, rendering traditional collaborative filtering methods inapplicable.
* Furthermore, a significant number of visitors are likely to be entirely new with no historical consumption record whatsoever; this is known as a **cold-start** situation
1. the scale of most web services of practical interest calls for solutions that are both **fast** in learning and computation.
This paper models personalized recommendation of news articles as a contextual bandit problem. 총 사용자 클릭 횟수 증가를 위해, 사용자 클릭 피드백에 기반한 article-selection 전략을 적용
* we argue that any bandit algorithm can be reliably evaluated offline using previously recorded random traffic.
* It is generally difficult to model popularity and temporal changes based solely on content information.
* we need to distribute more traffic to new content to learn its value more quickly, and fewer users to track temporal changes of existing content.
* Often, both users and content are represented by sets of features.
* User features may include historical activities at an aggregated level as well as declared demographic information.
* This paper proposes a new algorithm, LinUCB

# B) Multi-armed Bandit Formulation

* Formally,a contextual-bandit algorithm A proceeds in discrete trials $t=1,2,3,…$
* In trial $t$:
* The algorithm observes the current user $u_t$ and a set $A_t$ of arms or actions together with their feature vectors $x_{t,a}$ for $a∈A_t$.
* The vector $\mathbf{x}_{t,a}$ summarizes information of __both __the user $u_t$ and arm $a$, and will be referred to as the **context**.
* Based on observed payoffs in previous trials, A chooses an arm $a_t∈A_t$, and receives payoff $r_{t,a_t}$ whose expectation depends on both the user $u_t$ and the arm $a_t$.
* The algorithm then improves its arm-selection strategy with the new observation, $(\mathbf{x}_{t,a},a_t,r_{t,a_{t}})$.
* It is important to emphasize here that no feedback (namely, the payoff $r_{t,a}$) is observed for unchosen arms $a\neq a_t$.
* In the process above, the __total T-trial payoff __of A is defined as $\sum_{t=1}^{T}r_{t,a_{t}}$.
* Similarly, we define the **optimal expected T-trial pay-off** as $\mathbf{E}\left[\sum_{t=1}^{T}r_{t,a_{t}^{*}}\right]$
* where $a_{t}^{*}$ is the arm with maximum expected payoff at trial $t$.
* Our goal is to design A so that the expected total payoff above is maximized.
* Equivalently, we may find an algorithm so that its __regret __with respect to the optimal arm-selection strategy is minimized.
* the $T$-trial regret $R_{\mathrm{A}}(T)$ of algorithm A is defined formally by
* $\displaystyle R_{\mathrm{A}}(T)\stackrel{\text{def}}{=}\mathbf{E}\left[\sum_{t=1}^{T}r_{t,a_{t}^{*}}\right]-\mathbf{E}\left[\sum_{t=1}^{T}r_{t,a_{t}}\right]$
* In the context of article recommendation, we may view articles in the pool as arms.
* When a presented article is clicked, a payoff of 1 is incurred; otherwise, the payoff is 0.
* With this definition of payoff, the expected payoff of an article is precisely its **clickthrough rate (CTR)**, and choosing an article with maximum CTR is equivalent to maximizing the expected number of clicks from users, which in turn is the same as maximizing the total expected payoff in our bandit formulation.
* Existing Bandit Algorithms
* Exploration can increase __short-term __regret since some suboptimal arms may be chosen.
* However, obtaining information about the arms’ average payoffs (**i.e.**, exploration) can refine A’s estimate of the arms’ payoffs and in turn reduce **long-term** regret.
* UCB (Upper Confidence Bound)
* Specifically, in trial $t$, these algorithms estimate both the mean payoff $\hat{\mu}_{t,a}$ of each arm a as well as a corresponding confidence interval $c_{t,a}$, so that $\left|\hat{\mu}_{t,a}-\mu_{a}\right|<c_{t,a}$ holds with high probability.
* They then select the arm that achieves a highest upper confidence bound (UCB for short): $a_t=\arg\max_{a}\left(\hat{\mu}_{t,a}+c_{t,a}\right)$

# C) Algorithm

This paper shows that a confidence interval can be computed __efficiently in closed form __when the payoff model is linear, and call this algorithm LinUCB.

## C.1) LinUCB with Disjoint Linear Models

![|500](https://i.imgur.com/qcu1hD9.png)
we assume the expected payoff of an arm $a$ is linear in its $d$-dimensional feature $\mathbf{x}_{t,a}$ with some unknown coefficient vector $\boldsymbol{\theta}_{a}^{*}$; namely, for all $t$,
Equation (2): $\mathbf{E}\left[r_{t,a}\mid\mathbf{x}_{t,a}\right]=\mathbf{x}_{t,a}^{\top}\boldsymbol{\theta}_{a}^{*}$
This model is called *disjoint* since the parameters are not shared among different arms.
* Let $\mathbf{D}_{a}$ be a design matrix of dimension $m\times d$ at trial $t$
* whose rows correspond to $m$ training inputs (e.g., $m$ contexts that are observed previously for article $a$ )
* $\mathbf{b}_{a}\in\mathbb{R}^{m}$ be the corresponding response vector (e.g., the corresponding $m$ click/no-click user feedback).
* Applying ridge regression to the training data $\left(\mathbf{D}_{a},\mathbf{c}_{a}\right)$ gives an estimate of the coefficients:

$$
\hat{\boldsymbol{\theta}}_{a}=\left(\mathbf{D}_{a}^{\top}\mathbf{D}_{a}+\mathbf{I}_{d}\right)^{-1}\mathbf{D}_{a}^{\top}\mathbf{c}_{a}
$$

* where $\mathbf{I}_{d}$ is the $d×d$ identity matrix.
* When components in $\mathbf{c}_{a}$ are independent conditioned on corresponding rows in $\mathbf{D}_{a}$, it can be shown [27] that, with probability at least $1−δ$,
* $\left|\mathbf{x}_{t,a}^{\top}\hat{\boldsymbol{\theta}}_{a}-\mathbf{E}\left[r_{t,a}\mid\mathbf{x}_{t,a}\right]\right|\leq\alpha\sqrt{\mathbf{x}_{t,a}^{\top}\left(\mathbf{D}_{a}^{\top}\mathbf{D}_{a}+\mathbf{I}_{d}\right)^{-1}\mathbf{x}_{t,a}}$
* for any $\delta>0$ and $\mathbf{x}_{t,a}\in\mathbb{R}^{d}$, where $\alpha=1+\sqrt{\ln(2/\delta)/2}$ is a constant.
* In other words, the inequality above gives a reasonably tight UCB for the expected payoff of arm $a$, from which a UCB-type arm-selection strategy can be derived: at each trial $t$, choose

$$
\displaystyle a_{t}\stackrel{\text{def}}{=}\arg\max_{a\in\mathcal{A}_{t}}\left(\mathbf{x}_{t,a}^{\top}\hat{\boldsymbol{\theta}}_{a}+\alpha\sqrt{\mathbf{x}_{t,a}^{\top}\mathbf{A}_{a}^{-1}\mathbf{x}_{t,a}}\right)
$$

* where $\mathbf{A}_{a}\stackrel{\text{def}}{=}\mathbf{D}_{a}^{\top}\mathbf{D}_{a}+\mathbf{I}_{d}$
This algorithm has a few nice properties.
First, its computational complexity is linear in the number of arms and at most cubic in the number of features.
* To decrease computation further, we may update $\mathbf{A}_{a_{t}}$ in every step (which takes $O(d^2)$ time), but compute and cache $\mathbf{Q}_{a}\stackrel{\text{def}}{=}\mathbf{A}_{a}^{-1}$ (for all $a$) periodically instead of in real time.
* Second, the algorithm works well for a dynamic arm set, and remains efficient as long as the size of $\mathcal{A}_{t}$ is not too large.
* Third, if the arm set $A_t$ is fixed and contains $K$ arms, then the confidence interval (i.e., $\alpha\sqrt{\mathbf{x}_{t,a}^{\top}\left(\mathbf{D}_{a}^{\top}\mathbf{D}_{a}+\mathbf{I}_{d}\right)^{-1}\mathbf{x}_{t,a}}$ ) decreases fast enough with more and more data.
* LinUCB with Hybrid Linear Models
* $\mathbf{D}_{a}^{\top}\mathbf{D}_{a}+\mathbf{I}_{d}$
* It is helpful to have features that have both shared and non-shared components.
* Formally, we adopt the following hybrid model by adding another linear term to the right-hand side of Equation (2): $\mathbf{E}\left[r_{t,a}\mid\mathbf{x}_{t,a}\right]=\mathbf{x}_{t,a}^{\top}\boldsymbol{\theta}_{a}^{*}$:
* $\mathbf{E}\left[r_{t,a}\mid\mathbf{x}_{t,a}\right]=\mathbf{z}_{t,a}^{\top}\boldsymbol{\beta}^{*}+\mathbf{x}_{t,a}^{\top}\boldsymbol{\theta}_{a}^{*}$
* $\mathbf{z}_{t,a}\in\mathbb{R}^{k}$ is the feature of the current user/article combination, and $\boldsymbol{\beta}^{*}$ is an unknown coefficient vector common to all arms.
* This model is hybrid in the sense that some of the coefficients $\boldsymbol{\beta}^{*}$ are shared by all arms, while others $\boldsymbol{\theta}_{a}^{*}$ are not.

# D) Evaluation Methodology

* Our goal here is to measure the performance of a bandit algorithm $π$, that is, a rule for selecting an arm at each time step based on the preceding interactions.
* Because payoffs are only observed for the arms chosen by the logging policy, which are likely to often differ from those chosen by the algorithm $π$ being evaluated, it is not at all clear how to evaluate $π$ based only on such logged data.
* This evaluation problem may be viewed as a special case of the so-called “off-policy evaluation problem” in reinforcement learning
* One solution is to build a simulator to model the bandit process from the logged data, and then evaluate $π$ with the simulator.
* However, the modeling step will introduce **bias** in the simulator and so make it hard to justify the reliability of this simulator-based evaluation approach.
* In contrast, we propose an approach that is simple to implement, grounded on logged data, and **unbiased**.
* This paper describes a provably reliable technique for carrying out such an evaluation, assuming that the individual events are [[i.i.d.]], and that the logging policy that was used to gather the logged data chose each arm at each time step uniformly at random.
* This latter assumption can be weakened considerably so that any randomized logging policy is allowed and our solution can be modified accordingly using rejection sampling, but at the cost of decreased efficiency in using data.
* More precisely, we suppose that there is some unknown distribution $D$ from which tuples are drawn i.i.d. of the form $\left(\mathbf{x}_{1},\ldots,\mathbf{x}_{K},r_{1},\ldots,r_{K}\right)$, each consisting of observed feature vectors and hidden payoffs for all arms.
* Each such event consists of the context vectors $\mathbf{x}_{1},\ldots,\mathbf{x}_{K}$, a selected arm $a$ and the resulting observed payoff $r_{a}$.
* Crucially, only the payoff $r_a$ is observed for the single arm $a$ that was chosen uniformly at random.
* For simplicity of presentation, we take this sequence of logged events to be an **infinitely** long stream
* however, we also give explicit bounds on the actual finite number of events required by our evaluation method.

## D.1) Proposed Policy Evaluator

![[img-6687f1ec5b.png||600]]
* The method takes as input a policy $\pi$ and a desired number of “good” events $T$ on which to base the evaluation.
* If, given the current history $h_{t-1}$, it happens that the policy $π$ chooses the same arm $a$ as the one that was selected by the logging policy, then the event is retained, that is, added to the history, and the total payoff $R_t$ updated.
* Otherwise, if the policy $π$ selects a different arm from the one that was taken by the logging policy, then the event is entirely ignored, and the algorithm proceeds to the next event without any other change in its state.
* Note that, because the logging policy chooses each arm uniformly at random, each event is retained by this algorithm with probability exactly $1/K$, independent of everything else.
* This means that the events which are retained have the same distribution as if they were selected by $D$.
* As a result, we can prove that two processes are equivalent: the first is evaluating the policy against $T$ real-world events from $D$, and the second is evaluating the policy using the policy evaluator on a stream of logged events.
THEOREM 1. For all distributions $D$ of contexts, all policies $π$, all $T$ , and all sequences of events $h_T$ ,
![[img-7eb181b680.png||400]]
where $S$ is a stream of events drawn i.i.d. from a uniform random logging policy and $D$.
Furthermore, the expected number of events obtained from the stream to gather a history $h_T$ of length $T$ is $KT$.

# E) References

[paper Link](https://arxiv.org/pdf/1003.0146.pdf)
