---
layout: post
title: ML Recap - Confusion Matrix 
date: 2025-02-03 21:00:00
giscus_comments: true
categories: ml-fundamentals
toc:
  beginning: true
  sidebar: left
tags: machine-learning metrics
---

Confusion Matrix 는 분류 모델의 예측 결과를 실제 정답과 비교하여, 모델이 어느 정도 잘 예측했는지를 한눈에 보여주는 표(매트릭스)이다.

|                | 예측: Positive       | 예측: Negative       |
|----------------|----------------------|----------------------|
| 실제: Positive | True Positive (TP)  | False Negative (FN)  |
| 실제: Negative | False Positive (FP) | True Negative (TN)   |

- True Positive (TP): 실제로 Positive인 데이터를 모델이 Positive로 올바르게 예측한 경우
- False Negative (FN): 실제로 Positive인데 모델이 Negative로 잘못 예측한 경우
- False Positive (FP): 실제로 Negative인데 모델이 Positive로 잘못 예측한 경우
- True Negative (TN): 실제로 Negative인 데이터를 모델이 Negative로 올바르게 예측한 경우

### Metrics using Confusion Matrix

Confusion Matrix 의 각 셀에 있는 값을 바탕으로 여러 성능 지표를 계산할 수 있다.

(1) 정확도 (Accuracy): 전체 샘플 중 올바르게 예측한 비율  

$$ \text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN} $$

(2) 정밀도 (Precision): Positive로 예측한 것 중 실제로 Positive인 비율  

$$ \text{Precision} = \frac{TP}{TP + FP} $$

(3) 재현율 (Recall) 또는 민감도 (Sensitivity): 실제 Positive 샘플 중 Positive로 올바르게 예측한 비율  

$$ \text{Recall} = \frac{TP}{TP + FN} $$

(4) F1 Score: 정밀도와 재현율의 조화평균  

$$ \text{F1 Score} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}} $$


## Application: RAGAS

RAGAS 는 Retrieval-Augmented Generation 의 성능을 측정하는 방법이다.

- Context Precision (문맥 정밀도)
  - 모델이 검색한(또는 제공한) 문맥 중 실제로 관련성이 높은 부분의 비율을 측정합니다.
  - 질문과 컨텍스트 간의 관련성을 LLM 또는 임베딩 유사도로 측정.
  - 높을수록 검색된 컨텍스트가 질문 해결에 적합함을 의미.
- Context Recall (문맥 재현율)
  - 실제로 필요한 문맥 중 모델이 검색해낸 비율을 나타냅니다.
  - Ground Truth 정답과 검색된 컨텍스트의 내용 일치도 측정.
  - 높을수록 검색 시스템이 핵심 정보를 누락하지 않았음을 의미.
