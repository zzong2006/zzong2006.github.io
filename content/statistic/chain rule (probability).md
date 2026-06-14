---
title: "chain rule (probability)"
tags: ["statistic"]
aliases: ["chain rule"]
---

# I. Chain Rule (probability) ?

* Related
	* [[joint entropy]], #[[independence (probability)]], [[Bayes theorem]]
* Statistic

Consider an indexed collection of random variables $X_{1},\ldots,X_{n}$.

To find the value of this member of the [[joint distribution]], we can apply the definition of conditional probability to obtain

 $$
 \mathrm{P}\left(X_{n},\ldots,X_{1}\right)=\mathrm{P}\left(X_{n}\mid X_{n-1},\ldots,X_{1}\right)\cdot\mathrm{P}\left(X_{n-1},\ldots,X_{1}\right)
 
$$

# II. Example

$$
\begin{aligned}&\mathrm{P}\left(X_{4},X_{3},X_{2},X_{1}\right)\\&=\mathrm{P}\left(X_{4}\mid X_{3},X_{2},X_{1}\right)\cdot\mathrm{P}\left(X_{3},X_{2},X_{1}\right)\\&=\mathrm{P}\left(X_{4}\mid X_{3},X_{2},X_{1}\right)\cdot\mathrm{P}\left(X_{3}\mid X_{2},X_{1}\right)\cdot\mathrm{P}\left(X_{2},X_{1}\right)\\&=\mathrm{P}\left(X_{4}\mid X_{3},X_{2},X_{1}\right)\cdot\mathrm{P}\left(X_{3}\mid X_{2},X_{1}\right)\cdot\mathrm{P}\left(X_{2}\mid X_{1}\right)\cdot\mathrm{P}\left(X_{1}\right)\end{aligned}
$$

# III. Related

# IV. References

* https://en.wikipedia.org/wiki/Chain_rule_(probability)
