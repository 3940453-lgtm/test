# Waterfall Visualization

Visualize the cumulative effect of sequentially introduced positive and negative values. The waterfall chart uses columns and colors to show how an initial value is affected by a series of intermediate positive and negative values. The initial and final values are represented by whole columns, while the intermediate values are displayed as floating columns. The colors of the columns tell you whether the values are positive or negative, showing green for positive values and red for negative values. If you enable the totals feature, a third blue column is added representing the sum of the positive and negative values. You can change the entire color scheme by applying thresholds or change just the color of the third bar using the Properties panel.

Waterfall charts are frequently used to visualize financial statements or data about population, births and deaths.

The waterfall chart shown below is based only on metrics. If you add an attribute, a succession of waterfalls is shown, with each waterfall representing the metric values for one element of the attribute. This is very useful for quick visual comparisons.  

### Requirements

Object requirements:
  - Attributes:
     - 0  (10.4 and later)   
     - 1  (10.2 and later)
  - Metrics:
    - 1 - n metrics   

### Minimum MicroStrategy version: 10.3

### Current visualization version: 1.0

### Publisher: MicroStrategy

### MicroStrategy Features
  - [Supports using a visualization as a selector][VisAsSelector]
  - [Supports thresholds  (10.3 and later)][Thresholds]
  - [Supports custom properties  (10.3 and later)][CustomProperties]
  - [Supports exporting engine  (10.6 and later)][ExportingEngine]

### Additional features
  - Supports showing the continuity of accumulated values over time
    - To enable this feature, drag a time attribute and drop it in the Continuous drop zone on the Editor panel. When this feature is enabled, the starting point for each set of bars is the ending point for the previous set of bars.
  - Supports showing totals
    - To enable this feature, select the Show Totals checkbox in the Properties panel. The specified time dimension will be used to aggregate the totals. When this feature is enabled, a third column is added representing the sum of the positive and negative values. The color of this bar is determined by the value selected in the color picker for the Totals Bar Color in the Properties panel.
  - Supports displaying horizontal lines
    - To enable this feature, select the Show Horizontal Lines checkbox in the Properties panel. When this feature is enabled, horizontal lines are displayed at the level of each metric label on the Y-axis of the visualization.

### Initial post: 08/02/2016
### Last changed: 09/07/2016
### Changes made: [Change Log Details]


[VisAsSelector]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm#topics/HTML5/Using_Vis_As_Selector.htm>
[Thresholds]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm#topics/HTML5/Enabling_and_applying_threshold.htm>
[CustomProperties]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm#topics/HTML5//Creating_and_using_custom_properties.htm>
[Change Log Details]: <https://github.microstrategy.com/AnalyticsSDK/Visualizations/blob/next/D3Waterfall/CHANGELOG.md>
[ExportingEngine]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/Content/topics/HTML5/Exporting_to_PDF.htm>