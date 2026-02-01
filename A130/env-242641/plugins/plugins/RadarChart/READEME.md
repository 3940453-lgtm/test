# Radar Chart Visualization

Use a Radar Chart to compare the values of multiple quantitative  variables, visualized as overlapping polygons that resemble a spider web. Each variable is represented by an axis radiating from the center of the two-dimensional chart, with each axis equidistant from the other.  The values to be compared on each axis are connected by lines and the enclosed areas can be filled with a transparent color to enhance the comparisons.  The position and angle of the axes are not important.

Radar charts are useful for determining which variables in a dataset have similar values and which are outliers, and to display  performance  by visualizing which variables rank highest or lowest in a dataset. Radar charts are also a great way to compare members of a dimension in a function of several metrics. For example, when users are selecting  a health plan, you can provide a radar chart to let them compare different plans across metrics such as deductibles, premiums, and maximum out-of-pocket costs.

To make the  Radar Chart most effective and easiest to read, you should limit the number of variables used.

### Requirements

### Object requirements:
  - Attributes: 1
 - Metrics: 1 - n metrics

### Minimum MicroStrategy version: 10.2

### Current visualization version: 1.0

### Publisher: MicroStrategy

### MicroStrategy Features
  - [Supports custom properties  (10.3 and later)][CustomProperties]
  - [Supports exporting to PDF  (10.6 and later)][ExportingEngine]

### Additional Features
  - Supports collapsing nodes.

### Initial post: 12/22/2016
### Last changed:
### Changes made: [Change Log Details]


[CustomProperties]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm#topics/HTML5//Creating_and_using_custom_properties.htm>
[Change Log Details]: <https://github.microstrategy.com/AnalyticsSDK/Visualizations/blob/next/RadarChart/CHANGELOG.md>
[ExportingEngine]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/Content/topics/HTML5/Exporting_to_PDF.htm>