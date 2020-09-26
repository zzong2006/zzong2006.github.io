---
layout: post
title:  "Machine Learning: Introduction"
date:   2020-09-21 22:55:30 +0900
categories: jekyll update
---

### (1) 머신러닝이란 무엇인가?

1. 학습하는 컴퓨터

2. 주어진 일 T와 관련된 경험 E 를 통해 학습하여, T 의 수행 성능 P 가 향상되는 프로그램

    * 예시) 체스 게임 
      * E : 체스를 많이 플레이해서 경험을 얻는다.
      * T : 체스를 플레이
      * P : **다음** 게임에서 이길 확률 (Q. 왜 **다음** 게임인가? 경험을 통해 학습하기 때문)

* 머신러닝은 크게 두 가지로 나눠짐
  1. 지도학습 

     * 무엇이 올바른 출력인지 알고 있는 입력 데이터로 학습하는 것

     * 지도학습 관련 문제들은 두 가지 문제로 분류됨
       1. Regression Problem : **Continuous** valued output
          * 예시) 평수($x$)에 따른 집값($y$) 예측 (\$1000 ? \$1200 ?)
       2. Classification Problem : **Discrete** valued output
           * 예시) 종양 크기($x$)에 따른 유방암 판정 ($y$) 예측 (Yes ? No ?)

  2. 비지도학습

     * 분석되지 않은(정답이 없는) 데이터를 이용하여 알아서 구조를 찾는 학습

     * 비지도학습도 두 가지 문제로 분류됨

       * Clustering 

         * 예시) 뉴스 기사들을 이용해서, 비슷한 내용의 기사끼리 묶어 그룹 형성

       * Non-Clustering : clustering의 반대

         * Cocktail party Problem

           주변 소음이 있는 환경에서 원하는 소리만 추출해내는 방법 
           (Singular Value Decomposition 활용)



