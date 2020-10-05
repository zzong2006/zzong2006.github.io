---
layout: post
title:  "Probability Theory: basic"
date:   2020-10-02 22:00
categories: probabilitytheory
series: 1
---

## Probability distribution

* 우리가 어떤 일에 대해서 무슨 결과가 나올지는 모르지만, 가능한 모든 결과를 알고 있다고 가정할 때, 어떤 일에 대해서 가능한 모든 결과들의 집합(Sample space)을 $\Omega$라고 하자.   
  이때, 이벤트 $A$란 $\Omega$의 부분 집합이다.

  * disjoint 이벤트 $A$ 와 $B$: 서로 겹치는 원소(결과)가 없음: $A \cap B = \empty$
    * 이러한 $A$와 $B$의 관계를 상호 배타(mutually exclusive) 관계라고 부른다. 

* 특정 일 또는 실험에 대한 Sample space $S$의 각 이벤트 $E$가 주어지고, 그 실험을 $n$번 실행했을 때 $E$가 발생한 횟수 $n(E)$를 통한 **확률** $P(E)$은 다음과 같이 정의된다.
  $$
  P(E)=\lim_{n\rightarrow\infty}\frac{n(E)}{n}
  $$
  다시 말하면, $P(E)$는 이벤트 $E$에 대한 확률을 의미한다. 

  * 그러나 아무리 실험을 많이 반복한다고 해서 그 값이 항상 특정 값($P(E)$)으로 수렴한다는 보장이 없다.    
    그래서, 만약 수렴한다면, 그 확률 $P(E)$는 아래와 같은 세개의 axiom (가정)을 만족한다고 한다.

    1. $0 \le P(E) \le 1$

    2. $P(S) = 1$

    3. 어떤 상호 배타적인 이벤트 $E_1, E_2, \cdots$ 에 대해      
       $$
       P\left(\bigcup^{\infty}_{i=1}E_i\right)=\sum^{\infty}_{i=1}P(E_i)
       $$

  * 위 세개의 axioms들을 활용하면, 아래와 같은 결론들을 도출할 수 있다.

    * $P(\empty)=0$, $\empty$는 empty event
    * $P(\neg A)=1-P(A)$
    * $ A \subseteq B$ 이라면, $P(A) \le P(B)$를 만족한다.
    * $P(A\cup B)=P(A) + P(B) - P(A \cap B)$
  
  * 만약 Sample space $S$의 모든 결과들이 동일하게 발생한다고 가정했을 때, 어떤 이벤트 $E$가 발생할 확률 $P(E)$는 아래와 같이 표현할 수 있다.   
    $$
    P(E)=\frac{E\text{의 가능한 결과의 총 개수}}{S\text{의 가능한 결과의 총 개수}}
    $$
    
  
* 예시) 주사위 굴리기 $\Omega=\{1,2,3,4,5,6\}$

  * 일반적인 주사위라면, 각 눈이 나올 확률은 $\frac{1}{6}$이다:        
    $P(1)=P(2)=P(3)=P(4)=P(5)=P(6)=\frac{1}{6}$
  * 각각 disjoint인 이벤트이므로, 다음의 내용들이 성립한다.   
    * $P(\{1\})=\frac{1}{6}$
    * $P(\{1, 2\})=P(\{1\})+P(\{2\})=\frac{1}{3}$
    * $P(\{1, 2\}\cup\{2,3\})=P(\{1,2,3\})=\frac{1}{2}$

## Joint Events

  * 어떤 두 이벤트 $A$와 $B$가 동시에 일어날 확률은 결합 확률(joint probability) $P(A, B)$로 표현할 수 있다.

      * 예) $P(\text{"개가 짖고있다"}, \text{"고양이가 울고있다"})=0.3$

  * $A|B$는 조건부 확률(conditional probability)를 표현한 것인데, $B$가 발생할 경우 $A$가 일어날 확률을 정의한 것이다.
    $$
    P(A|B)=\frac{P(A,B)}{P(B)}, \ P(B) \neq 0
    $$

    * 조건부 확률은 결합 확률을 사용한다.

* 결합 확률은 아래와 같은 식으로 표현 가능하다.

     * $$
     P(A, B) = P(A|B)\cdot P(B) =P(B|A)\cdot P(A)
     $$

* 통계 분할표(Contingency table)를 사용하면, joint 와 conditional probabilities의 확률 관계를 명확히 할 수 있다.
  * ![image-20201002225911132](https://i.loli.net/2020/10/02/R8cjgwWJr3OG17t.png)
  * $P(A)=P(A, B) + P(A, \neg B)$   
    $P(\neg A)=P(\neg A, B) + P(\neg A, \neg B)$     
    $P(B)=P(A, B) + P(\neg A, B)$     
    $P(\neg B)=P(A, \neg B) + P(\neg A, \neg B)$        
  * 위에서 확인했다시피, conditional probability = joint probability / marginal probability 이다.

* dwad	

* 

* ​	