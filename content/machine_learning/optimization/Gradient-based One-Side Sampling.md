---
tags: ["optimization"]
aliases: ["GOSS"]
---

# A) Gradient-based One-Side Sampling ?

The standard gbdt is reliable but it is not fast enough on large datasets. Hence, goss suggests a sampling method based on the gradient to avoid searching for the whole search space. We know that for each data instance when the gradient is small that means no worries data is well-trained and when the gradient is large that should be retrained again. So we have **two sides** here, data instances with  large and small gradients. Thus, goss keeps all data with a large gradient and does a random sampling (**that’s why it is called One-Side Sampling**) on data with a small gradient. This makes the search space smaller and goss can converge faster. Finally, for gaining  more insight about goss, you can check this [blog post](https://towardsdatascience.com/what-makes-lightgbm-lightning-fast-a27cf0d9785e).

# B) Pros and Cons

## B.1) Pros

converge faster

## B.2) Cons

overfitting when dataset is small

# C) Related

# D) References
