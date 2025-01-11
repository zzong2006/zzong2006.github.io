---
layout: post
title: Algorithm lesson learned - string
date: 2025-01-11 10:00:00
giscus_comments: true
categories: algorithm
toc:
  beginning: true
tags: competitive-programming string lesson-learned
---

알고리즘 string 관련 문제를 풀면서 인사이트를 얻은 내용들을 정리합니다.

## Palindromes (회문)

Palindrome 의 특성

- 회문은 반드시 홀수 번 등장하는 문자가 중심이 되어야 한다. 예를 들어, "aba" 와 같이 "b" 는 홀수번 등장한다 (또는 "abbba", "abxba"). 
- 그래서 주어진 문자들로 회문을 만든다고 하면, 홀수 번 등장하는 문자의 개수가 회문의 개수를 결정한다.

### Related problem

- [leetcode: construct-k-palindrome-strings](https://leetcode.com/problems/construct-k-palindrome-strings/description/?envType=daily-question&envId=2025-01-11)
