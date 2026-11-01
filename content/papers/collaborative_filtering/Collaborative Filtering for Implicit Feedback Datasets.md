---
title: "Collaborative Filtering for Implicit Feedback Datasets"
aliases: []
tags:
  - implicit_feedback
  - collaborative_filtering
  - paper_review
---

**별점 없이 시청 · 구매 기록만 있을 때 쓰는 행렬 분해(Weighted ALS)를 제안한 논문이다.** Hu, Koren, Volinsky, ICDM 2008.

방법 자체와 손계산 예시는 [[Alternating Least Squares]] 노트에 있다. 여기에는 논문이 무엇을 주장했는지만 정리한다.

# A) 문제

**implicit feedback 은 별점과 성질이 다르다.**

- 싫다는 신호가 없다. 안 본 것은 싫어서일 수도, 몰라서일 수도 있다.
- 본 것도 꼭 좋아서 본 것은 아니다. 앞 프로그램을 보다 채널을 안 돌렸을 수도 있다.
- 숫자(시청 횟수)의 크기는 선호의 크기가 아니라 "좋아한다" 는 판단을 얼마나 믿을지에 가깝다.

**별점처럼 관측된 칸만 학습하면 안 된다.** 안 본 칸에 담긴 약한 부정 신호까지 써야 하므로 모든 칸을 학습에 넣는다.

# B) 제안

- 시청 횟수 $r_{ui}$ 를 preference $p_{ui}$ (봤으면 1) 와 confidence $c_{ui} = 1 + \alpha r_{ui}$ 로 나눈다.
- 모든 칸의 $c_{ui}(p_{ui} - x_u^{\top} y_i)^2$ 합을 최소화한다.
- 칸이 수십억 개라 SGD 대신 ALS 로 푼다. $Y^{\top}Y$ 를 미리 계산해 한 바퀴 비용을 0 아닌 칸 수에 비례하게 만든다.
- 예측을 "과거에 본 아이템의 가중합" 으로 다시 써서 추천 이유를 설명할 수 있게 한다.

# C) 실험

**디지털 TV 셋톱박스 약 30만 대의 4 주 시청 기록으로 다음 1 주 시청을 예측했다.**

- 프로그램은 약 1만 7천 개, 0 아닌 칸은 약 3,200만 개다.
- 학습 기간에 이미 본 프로그램은 평가에서 뺐다. 새로 볼 프로그램을 맞히는지 보려는 것이다.

**평가는 실제로 본 프로그램이 추천 목록의 위에서 몇 % 지점에 있었는지의 평균이다 (expected percentile ranking).** 낮을수록 좋고, 무작위로 추천하면 50% 다.

- 인기순: 16.46%
- 아이템 이웃 기반: 10.74%
- 제안 방법: 8.35% ($f = 200$). $f$ 를 늘릴수록 계속 좋아졌다.

**preference 와 confidence 를 나눈 것이 핵심이었다.** 시청 횟수를 그대로 맞히는 행렬 분해는 $f = 100$ 에서 13.40% 로 이웃 기반보다도 나빴다.

# D) References

* [paper link](http://yifanhu.net/PUB/cf.pdf)
