---
title: Cost Function
aliases:
  - hypothesis
tags:
  - cost-function
  - cost
  - loss-function
---
## Definition

> [!info] DEF
>  **Cost function** (also called loss function) is a mathematical function that measures the difference between a model's predicted output and the actual output. The goal of training is to minimize this value.



### Formula for Cost Function

$$ J(\theta_0, \theta_1) = \frac{1}{2m} \sum_{i=1}^{m} \left( h_\theta(x^{(i)}) - y^{(i)} \right)^2 $$

where:

- $J(\theta_0, \theta_1)$ → the cost function
- $m$ → number of training examples (all the points)
- $h_\theta(x)$ → the hypothesis function (model's prediction)
- $x^{(i)}, y^{(i)}$ → input and actual output of the $i^{th}$ training example

This is also called the **Squared Error Function (SEF)** 
i.e. the $(y - \hat{y})^2$ column in SMLP.

### Why $\frac{1}{2m}$?

- Divided by $m$ → to find the **average** (mean) value
- Divided by $2$ → makes derivation cleaner

eg: $\frac{d}{dx}(x^2) = 2x$ (since $x^n \to nx^{n-1}$) but since it's divided by 2, it becomes $\frac{2x}{2} = x$

> [!note] 
> In SEF, squaring is done so we don't get any negative values.

> [!warning] 
> In linear regression, the cost function $$\frac{\sum (y - \hat{y})^2}{2n}$$ is the **Mean Squared Error (MSE)**, or SEF divided by $2n$ and not to be confused with SEF alone: $$\frac{\sum (y - \hat{y})^2}{n}$$


solving of cost func

minimize -> $$ J(\theta_0, \theta_1) = \frac{1}{2m} \sum_{i=1}^{m} \left( h_\theta(x^{(i)}) - y^{(i)} \right)^2 $$ by adjusting the $$J(\theta_0, \theta_1)$$
Step 1 :
![](assets/excalidraw/ml/hypothesis-s1.light.svg)

Calculation:
 So if $J(\theta_1)=1$ ,
  $$J(\theta_1) = \frac{1}{2m} \sum_{i=1}^{3} \left( h_\theta(x^{(i)}) - y^{(i)} \right)^2 $$ 
 > here, no $\theta_0$ since its equal to 0

 $$J(\theta_1) = \frac{1}{2m} [(1-1)^2+(2-2)^2+(3-3)^2] = 0$$
 
 
 