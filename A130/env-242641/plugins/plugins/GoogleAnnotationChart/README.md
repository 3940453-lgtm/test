# Annotation Chart Visualization

Visualize data over time using a line chart with annotations to provide insight into data points.  Annotation charts are interactive time series line charts with full annotations that are visible on the side of the visualization, rather than appearing in a tooltip. The annotations correspond to specific data points on the chart.  

The sample annotation chart below compares current customer counts with customer counts for last month and last year, over the period of a year.

### Requirements

### Object requirements:
  - Attributes: 1
  - Metrics: 1 - n metrics

### Minimum MicroStrategy version: 10.2

### Current visualization version: 1.0

### Publisher: MicroStrategy

### MicroStrategy Features
  - [Supports using a visualization as a selector][VisAsSelector]
  - [Supports exporting engine  (10.6 and later)][ExportingEngine]

### Additional Features
  - Supports annotations with titles and subtitles
  - To enable annotations, create an attribute whose name begins with the prefix "Title_" and append to the prefix the name of the metric that the annotation will be associated with - for example, Title_Cost. You can also create a second attribute with the prefix "Subtitle_". Drag one or both of these metrics to the Annotations drop zone on the Editor panel.
  - Works as time series widget when no annotations are present


### Initial post: 08/02/2016
### Last changed:
### Changes made: [Change Log Details]


[VisAsSelector]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm#topics/HTML5/Using_Vis_As_Selector.htm>
[Change Log Details]: <https://github.microstrategy.com/AnalyticsSDK/Visualizations/blob/next/GoogleAnnotationChart/CHANGELOG.md>
[ExportingEngine]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/Content/topics/HTML5/Exporting_to_PDF.htm>