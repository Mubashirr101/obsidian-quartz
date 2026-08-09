---
title: Formatting, Themes & Conditional Formatting
tags: [powerbi, formatting, themes, conditional-formatting]
aliases: [Format pane, report themes, data bars, tooltips]
---

# Formatting, Themes & Conditional Formatting

> [!abstract] Definition
> Every visual has an extensive **Format pane** (paint roller icon) controlling its appearance in detail. Report-wide consistency is managed via **Themes**, and data-driven styling (colors/icons that respond to values) is handled via **Conditional Formatting**.

---

## The Format Pane Structure

```
Select a visual > Format pane (paint roller icon) > collapsible sections:
  General       - visual/canvas size, position, alt text
  Visual         - chart-specific options (axis, legend, data colors, data labels)
  General          - title, background, border, effects (shadow), tooltips
```

> [!tip] "Format your visual" vs "General"
> Newer Power BI versions split the pane into a **Visual** tab (chart-type-specific settings like axis/legend) and a **General** tab (universal settings like title/background/border that every visual type shares) - check both when hunting for a specific option.

---

## Report Themes

```
View > Themes > choose a built-in theme, or "Browse for themes" to import a custom JSON theme file
```

> [!tip] Custom theme JSON for brand consistency
> A theme file defines the color palette, default fonts, and default visual styles applied report-wide in one click - teams commonly build a company-branded theme JSON once and reuse it across every report, ensuring consistent colors without manually restyling each visual.

```json
{
  "name": "Company Theme",
  "dataColors": ["#004B8D", "#5DA9E9", "#FFB81C", "#7F7F7F"],
  "background": "#FFFFFF",
  "foreground": "#252423"
}
```

---

## Conditional Formatting

```
Select a table/matrix column, or a card > Format pane > Conditional Formatting > choose a rule type
```

| Rule type | Effect |
|---|---|
| **Background color** | cell background shaded based on value (rules or a color scale/gradient) |
| **Font color** | text color shaded based on value |
| **Data bars** | an in-cell horizontal bar proportional to the value, like Excel's Data Bars |
| **Icons** | small icons (arrows, traffic lights, etc.) shown based on thresholds |
| **Web URL** | turns cell text into a clickable hyperlink dynamically |

```
Example rule: Background color
  Format by: Color scale (Min -> Max gradient) OR Rules (if/then thresholds)
  Based on field: [Profit Margin %]
  Minimum: 0%, red  |  Maximum: 30%+, green
```

> [!tip] "Format by: Field value" for fully dynamic formatting
> Instead of a fixed color scale, you can point conditional formatting at ANOTHER measure (e.g. a measure that returns a specific hex color code per row based on custom business logic) for maximum flexibility beyond the built-in rule types.

---

## Data Labels

```
Format pane > Data labels > toggle On
  Display units: Auto, Thousands, Millions, Billions
  Value decimal places
  Label position (varies by chart type)
```

---

## Tooltips

```
Format pane > Tooltips
  Type: Default (shows field values automatically)
       Report page (a full custom page shown as a tooltip - see 09-Visualizations-Chart-Types)
```

---

## Titles, Borders & Backgrounds

```
General > Title: text, font, alignment, background color
General > Effects > Background: color, transparency
General > Effects > Border: color, radius (rounded corners), width
General > Effects > Shadow: adds a drop shadow for a "card" look
```

---

## Gridlines & Canvas Settings

```
View tab (ribbon) > Show gridlines / Snap to grid    - helps align visuals precisely while designing
View tab > Page view: Fit to Page / Fit to Width / Actual Size
File > Options and Settings > Options > Report Settings > Canvas size (default 16:9, 4:3, or custom)
```

---

## Alt Text (Accessibility)

```
Format pane > General > Alt Text
```

> [!tip] Always fill in Alt Text for published reports
> Screen readers use this to describe a visual to visually impaired users - a short, meaningful description (e.g. "Bar chart showing monthly sales by region") makes reports genuinely accessible, and is increasingly expected in enterprise/government reporting standards.

---

## Consistent Formatting at Scale - Format Painter

```
Select a fully-formatted visual > Format tab (ribbon) > Format Painter > click another visual to copy its formatting
```

> [!tip] Format Painter saves huge amounts of manual reformatting
> Style ONE visual exactly as desired, then paint that formatting onto every similar visual on the page/report - much faster than manually replicating dozens of individual format settings on each new visual.

---

## Related
- [[09-Visualizations-Chart-Types]]
- [[12-Bookmarks-Buttons-Navigation]]
