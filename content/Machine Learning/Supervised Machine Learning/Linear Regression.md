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

| Age (x) | Weight (y) |
| ------- | ---------- |
| 24      | 62         |
| 25      | 63         |
| 21      | 72         |
| 27      | 62         |
-  'x' is the independent variable or input & 'y' is the dependent variable or the output or target
-  'y 'is a linear function of 'x' *(since 'y' depends on 'x')*

#### Equation 

Formula for best fit line in linear regression:

y = mx + c 

or


y = β₀ + β₁x

or

h<sub>θ</sub>(x) = θ₀ + θ₁x


where,
- θ₀ = Intercept (i.e. when x=0, h<sub>θ</sub>(x)= θ₀ , aka the point where you are meeting the y axis)
- θ₁ = Slope or Coefficient (i.e. with 1 unit measurement in x-axis, what is the unit measurement in y-axis)

![](assets/excalidraw/ml/linear-regression-2.light.svg)

**NOTE** : Main aim of a linear regression is to find out the best fit line, in such a way that the distance between the data points and the predicted points should the very less.

![](assets/excalidraw/ml/linear-regression-3.light.svg)

#### Hypothesis

> **h<sub>θ</sub>(x) = θ₀ + θ₁x**
>-
>i.e. predicted weight = intercept + slope * datapoint(Age)


Now,
This formula is for just one point, but if we want to find out the entire line, we need to keep on changing the θ₀  and θ₁ .
To find the new θ₀ and θ₁ , we have to use the Cost Function.



