---
layout: default
title:  "Introduction"
category: Deep Learning
order: 1
---

이 게시글은 deep learning에 대한 전반적인 내용을 다룬다.

## Supervised Learning

* | Input(x)            | Output(x)                  | Application               |
  | ------------------- | -------------------------- | ------------------------- |
  | 집 특징들           | 집 가격                    | 부동산 (DNN)              |
  | 광고, 사용자 정보   | 광고를 클릭할 것인가?(0/1) | 온라인 광고 (DNN)         |
  | 이미지              | 객체 (1, ... , 1000)       | 사진 태그 (CNN)           |
  | 오디오              | 텍스트                     | 음성 인식 (RNN)           |
  | 영어                | 중국어                     | 기계 번역 (RNN)           |
  | 이미지, 레이다 정보 | 다른 차들의 위치           | 자동 주행 (Custom/Hybrid) |

* Structured Data 
  * Records in table
  * 기계가 이해하기 쉬움
* Unstructured Data 
  * Audio, Image, Text
  * 사람이 이해하기 쉬움

## Why deep learning

* ![image-20201016151444146](https://i.loli.net/2020/10/16/m7AT9lUEXqN2Vbz.png)
  * Traditional Learning algorithms : SVM, logistic regression
* Deep learning 발전에 크게 영향을 끼친 세가지
  1. Data : 인터넷의 발전
  2. Computation : GPU, CPU의 발전
  3. Algorithms 
     * Example) *ReLu* function is much faster than *Sigmoid* function in learning process