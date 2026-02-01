# Box Plot Visualization

Explore the distribution of data based on five key calculations: minimum, first quartile, median, third quartile, and maximum. The "boxes" in a box plot visualize the likely range of variation (between the first and third quartiles) with a line indicating the median value. The "whiskers", which are lines extending to the minimum and maximum values on either side of the boxes, indicate variability outside the upper and lower quartiles. "Outliers", which are surprisingly high maximums or low minimums often found in real datasets, can be removed from the box plot or plotted as small circles. For more information, please reference [Wikipedia].

Values are calculated according to the following formula:
Interquartile Range(IQR) = Difference(Q1(first quartile) , Q3(third quartile)  

A value is an outlier if it is below (1.5 x IQR) of Q1 or above (1.5 X IQR) of Q3.

### Requirements
Object requirements:
  - Attributes: 2
  - Metrics: 1

### Minimum MicroStrategy version: 10.2

### Current visualization version: 1.0

### Publisher: MicroStrategy

### MicroStrategy Features
  - [Supports using a visualization as a selector] [VisAsSelector]
  - [Supports customizing drop zones] [CustomDropZones]  
    - This feature can be used to turn outlier feature on/off.

### Additional Features  
  - Supports adjusting fonts to match Dashboard default fonts

### Initial post: 08/02/2016
### Last changed:
### Changes made: [Change Log Details]


[Wikipedia]: <https://en.wikipedia.org/wiki/Box_plot>
[VisAsSelector]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm#topics/HTML5/Using_Vis_As_Selector.htm>
[CustomDropZones]: <https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm#topics/HTML5/Customizing_drop_zones.htm>
[Change Log Details]: <https://github.microstrategy.com/AnalyticsSDK/Visualizations/blob/next/D3BoxPlot/CHANGELOG.md>
