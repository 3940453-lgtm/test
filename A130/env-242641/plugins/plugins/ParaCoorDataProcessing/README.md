# Parallel Coordinates Visualization

Plot individual data elements across multiple dimensions with a parallel coordinates chart. There is a separate vertical axis for each dimension, and each data element is displayed as a series of connected points along the dimensions/axes.  These vertical axes form a backdrop of equally spaced parallel lines, allowing you to quickly see the relationship between each dimension.

You customize the Parallel Coordinates Chart using the Editor tab and the Properties tab.
  - On the Editor tab:
     - The Color By attribute defines the main vertical axis to the far left of the chart. The metric data points for each element of this attribute are plotted across the other parallel vertical axes within the chart.
     - The Metrics define one or more equally spaced vertical axes, which appear within the chart in the order they are added. There is a label at the top of each axis to show what metric is displayed and the axis itself shows the units of the metric.
  - On the Properties tab, you choose Parallel Coordinates Custom Properties and define the color scheme for the chart:
     - To make all lines a single color, choose from the color drop-down.
     - To have lines automatically assigned different colors, select the Color palette checkbox.
By default, all the lines are black.



### Requirements

### Object requirements:
  - Attributes: 1
  - Metrics: 2 or more

### Minimum MicroStrategy version: 10.2

### Current visualization version: 1.0

### Publisher: MicroStrategy

### MicroStrategy Features
  - [Supports using a visualization as a selector][VisAsSelector]
  - [Supports custom properties  (10.3 and later)][CustomProperties]
  - [Supports exporting engine  (10.6 and later)][ExportingEngine]

### Initial post: 08/11/2016
### Last changed:
### Changes made:


[VisAsSelector]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm#topics/HTML5/Using_Vis_As_Selector.htm>
[CustomProperties]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm#topics/HTML5//Creating_and_using_custom_properties.htm>
[ExportingEngine]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/Content/topics/HTML5/Exporting_to_PDF.htm>