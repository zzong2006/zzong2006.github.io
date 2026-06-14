
# A) What is the Pool Shifting?

시간이 지남에 따라 추천풀에 새로운 Arm 이 등장하거나 기존에 있던 Arm 이 사라지는 현상

대부분의 [[Multi-Armed Bandit]] 문제를 푼 논문들은 전체 Arm Set 이 고정이라고 가정하지만, 추천에서는 pool-shift 이슈가 분명 존재한다.

pool-shift 상황에서는 끊임없이 새로운 optimal 을 찾아서 Exploration 을 진행하여야 한다
