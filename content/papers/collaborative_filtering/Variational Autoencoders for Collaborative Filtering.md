---
title: "Variational Autoencoders for Collaborative Filtering"
tags: ["WWW", "bayesian_inference", "deep_learning", "collaborative_filtering", "paper_review", "y2018"]
aliases: ["Mult-VAE"]
---

# A) Variational Autoencoders for Collaborative Filtering ?

![](https://i.imgur.com/INAWZqJ.png)

With Mult-VAE, the authors introduce a generative model with multinomial likelihood, propose a different regularization parameter for the learning objective, and use Bayesian inference for parameter estimation.

# B) KL Regularization Term Meaning

This means that we are less able to generalize to novel user clicks from historical data.

# C) Improvement

Most works that develop further developments of VAE for collaborative filtering introduce alternative loss functions

# D) Think

* the choice of the used cutofs (20 and 50 for Recall, and 100 for NDCG) is not very consistent in the paper.

# E) Related

# F) References

* [Autoencoders for Collaborative Filtering - WSDM 2020 paper "RecVAE: A New Variational Autoencoder for Top-N Recommendations with Implicit Feedback"](https://cs.hse.ru/mirror/pubs/share/541866760.pdf)
