# Bullet Chart Visualization

Provide a rich display of data in a small space, with quantitative and qualitative context to enrich the meaning. Bullet charts compare a single, primary measure to other complementary measures within a qualitative context of performance ranges represented by different shades of a single color.

A bullet chart has five main components:
  - Text label
	- Defines your chart and the unit of measurement
  - Quantitative scale
	- Measures the value of your metric along a single linear axis
  - Primary measure
	- Bar representing the featured metric
  - Comparative measures (optional)
	- Metrics you want to compare the featured metric to
  - Qualitative scale (optional)
	- Two to five ranges along the quantitative scale that represent the performance of the primary measure

### Requirements

### Object requirements:
  - Attributes: 1 or more
  - Metrics: 1 or more

### Drop zones:
  - Category: 1 or more attributes
	- When there are multiple attributes, all the combinations of attributes should be listed - for example, USA Central, USA Mid-Atlantic, Web Web, etc. By default, all of the attributes should be listed like a grid.
  - Actual: 1 metric
	- Value used for the bar
  - Target: 1 metric
	- Value used for the tick
  - Range (Low, Medium, High): 1 or 3 metrics
	- When 1 metric is used, use 0.5* for Low, 1* for Medium, and 2* for High
	- When 3 metrics are used, use the first metric for Medium, the second metric for High, and the third metric for Low
  - KPI: 1 or more metrics

### Minimum MicroStrategy version: 10.2

### Current visualization version: 1.0

### Publisher: MicroStrategy

### MicroStrategy Features
  - [Supports exporting engine  (10.6 and later)][ExportingEngine]

### Initial post: 08/02/2016
### Last changed:
### Changes made: [Change Log Details]

[Change Log Details]: <https://github.microstrategy.com/AnalyticsSDK/Visualizations/blob/next/BulletChart/CHANGELOG.md>
[ExportingEngine]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/Content/topics/HTML5/Exporting_to_PDF.htm>
