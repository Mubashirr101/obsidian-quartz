---
title: Linear Regression
---

## Definition

> [!info] DEF 
> **Linear regression** is a supervised regression algorithm that models the relationship between input features and a continuous output as a straight line (or hyperplane), by finding the weights that best fit the data.

## Diagram

![](assets/excalidraw/ml/linear-regression.light.svg)

## Calculation

#### Sample dataset

|Age (x)|Weight (y)|
|---|---|
|24|62|
|25|63|
|21|72|
|27|62|

- 'x' is the independent variable or input & 'y' is the dependent variable or the output or target
- 'y' is a linear function of 'x' _(since 'y' depends on 'x')_

#### Equation

Formula for best fit line in linear regression:
$$ y = mx + c $$

$$or$$
$$ y = \beta_0 + \beta_1 x $$
$$or$$
$$ h_\theta(x) = \theta_0 + \theta_1 x $$
where,

- $\theta_0$ = Intercept (i.e. when $x=0$, $h_\theta(x) = \theta_0$, aka the point where you are meeting the y axis)
- $\theta_1$ = Slope or Coefficient (i.e. with 1 unit measurement in x-axis, what is the unit measurement in y-axis)

![](assets/excalidraw/ml/linear-regression-2.light.svg)

> [!tip] Aim
> Main aim of a linear regression is to find out the best fit line, in such a way that the distance between the data points and the predicted points should the very less.

![](assets/excalidraw/ml/linear-regression-3.light.svg)

#### Hypothesis $$h_\theta(x) = \theta_0 + \theta_1 x$$ i.e. predicted weight = intercept + slope × datapoint(Age)

Now, this formula is for just one point, but if we want to find out the entire line, we need to keep on changing $\theta_0$ and $\theta_1$. To find the new $\theta_0$ and $\theta_1$, we have to use the [[Cost Function]].