---
tags: ["probability"]
---

# A) 조합(Combination)이란?

$n$개의 객체 중에서 $r$개를 선택하는 방법의 수는 다음과 같이 계산할 수 있습니다.

$$
\left(\begin{array}{c}
n \\
r
\end{array}\right) = \frac{n!}{r!(n-r)!}
$$

## A.1) 예시

STATISTICS라는 단어의 알파벳을 이용해 만들 수 있는 서로 다른 배열의 개수를 구해봅시다.

이 단어는 총 10개의 알파벳으로 이루어져 있으며, 각 알파벳의 개수는 다음과 같습니다: S 3개, T 3개, I 2개, A 1개, C 1개입니다. 따라서 가능한 배열의 수는 아래와 같이 계산됩니다.

$$
\frac{10!}{3! \; 3! \; 2! \; 1! \; 1!} = 50,\!400
$$

([[permutation#partitioning]] 참조)
