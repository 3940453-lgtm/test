# Mekko Visualization

A Mekko chart is a two-dimensional stacked chart, with varying segment heights like a regular stacked chart as well as varying column widths. The column widths are scaled so that they just fill the desired chart width, with no gaps between columns.

You use the Editor and Properties tabs to define the grouped columns and column segments of the Mekko Chart.
  - Each group of columns represents a specific attribute or combination of attributes (defined by the Group By attributes). You can use one or more Group By attributes.
  - Each individual column has segments (defined by the Series attribute).
  - The horizontal and vertical axes of the graph represent specific metrics (defined by the Horizontal Axis Metric and the Vertical Axis Metric).
     - The width of each column is determined by the value of the Horizontal Axis Metric for the specified Group By attributes.
     - The height of each segment in an individual column is determined by the value of the Vertical Axis Metric for the specified Series attribute.  
  - You can animate the metric value changes by defining an Animate By attribute, such as a time dimension. If you have a time dimension and do not want to animate the chart, you can filter on a specific date.
  - The columns and segments on the Mekko Chart are colored using either default colors or colors you select, and can include color gradients for column segments.
     - If you define a Color Axis Metric, by default, a different color is chosen automatically for each column group (defined by the Group By attributes); otherwise, each series element is assigned its own color.
     - To use custom colors, you select Mekko Chart on the Properties tab and specify the color to use for each Group By / Series attribute element.
     - If you define a Color Axis Metric, you can also use thresholding to color the entire chart based on a selected color (similar to a heat map). Note that threshold options will be visible on horizontal and vertical metrics, but setting thresholding in the Horizontal Axis Metric and the Vertical Axis Metric drop zones will not have any effect. Instead, you drag the same metric to the Color Axis Metric drop zone and set thresholds there.
     - To add gradients to the column segments, you define a Color Axis Metric. The value of this metric is used to determine the gradient of each segment, with the segment that has the highest metric value having the darkest gradient.

Note: If you are using an animated graph, the gradient for each segment will be determined by the first metric value of the Animate By attribute and will not change dynamically as the metric value changes during the animation


The recommended practice is to use this visualization in a dashboard. If you want to use it in a document, you will achieve the best results if you first add it to a dashboard and then convert the dashboard to a document. This ensures that the order of the attributes and metrics expected by the visualization is correct


### Requirements

### Object requirements:
  - Attributes: minimum 2
  - Metrics: minimum 1

### Minimum MicroStrategy version: 10.2

### Current visualization version: 1.0

### Publisher: MicroStrategy

### MicroStrategy Features
  - [Supports using a visualization as a selector][VisAsSelector]
  - [Supports custom drop zones][CustomDropZones]
  - [Supports thresholds  (10.3 and later)][Thresholds]
  - [Supports custom properties  (10.3 and later)][CustomProperties]
  - [Supports exporting engine  (10.6 and later)][ExportingEngine]

### Additional Features
  - Supports animation across an attribute

### Initial post: 08/10/2016
### Last changed: 09/13/2016
### Changes made: [Change Log Details]


[VisAsSelector]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm#topics/HTML5/Using_Vis_As_Selector.htm>
[CustomDropZones]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm#topics/HTML5/Customizing_drop_zones.htm>
[Thresholds]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm#topics/HTML5/Enabling_and_applying_threshold.htm>
[CustomProperties]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm#topics/HTML5//Creating_and_using_custom_properties.htm>
[Change Log Details]: <https://github.microstrategy.com/AnalyticsSDK/Visualizations/blob/next/D3Mekko/CHANGELOG.md>
[ExportingEngine]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/Content/topics/HTML5/Exporting_to_PDF.htm>