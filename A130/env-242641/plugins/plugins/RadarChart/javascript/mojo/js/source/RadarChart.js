(function () {
    if (!mstrmojo.plugins.RadarChart) {
        mstrmojo.plugins.RadarChart = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface",
        "mstrmojo.array",
        "mstrmojo.num",
        "mstrmojo.color"
    );

    var ARRAY = mstrmojo.array,
        NUM = mstrmojo.num,
        COLOR = mstrmojo.color;

    //MSTR colors, 16 colors
    var MSTRCOLOR = ["#1f77b4", "#d61515", "#1ba11b", "#ff7f0e", "#8a53bd", "#bcbd22", "#17becf", "#7f7f7f", "#aec7e8",
        "#ff9896", "#98df8a", "#ffbb78", "#c5b0d5", "#dbdb8d", "#9edae5", "#c7c7c7"];


    mstrmojo.plugins.RadarChart.RC_PROPERTIES = {
        REVERSE_SCALE: 'reverseScale'
    };

    mstrmojo.plugins.RadarChart.RadarChart = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.RadarChart.RadarChart",
            cssClass: "radarchart",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            externalLibraries: [{url: "//cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.6/Chart.bundle.min.js"},
                {url: "//cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.6/Chart.min.js"},
                {url: "//d3js.org/d3.v3.min.js"},
                {url: "//code.jquery.com/jquery-3.1.0.min.js"}],
            useRichTooltip: false,
            reuseDOMNode: false,
            supportNEE: true, // indicate the widget supports PDF exporting by New Export Engine

            getReverseScaleOption: function getReverseScaleOption() {
                var RC_PROPERTIES = mstrmojo.plugins.RadarChart.RC_PROPERTIES,
                    reverseScale = (this.getProperty(RC_PROPERTIES.REVERSE_SCALE) === 'true');
                return reverseScale;

            },

            plot: function () {
                /**
                 * Radar Chart created by Xiuyi Ye on 12/22/2016.
                 * Version 1.0
                 * The code uses chart.js(http://www.chartjs.org/).
                 */

                var rawData = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE, {hasSelection: false});

                var gridData = this.dataInterface;

                var scaleReverse = false;

                var is10Point2 = true;

                if (typeof this.addThresholdMenuItem == 'function') {
                    is10Point2 = false;
                }

                if (!is10Point2) {
                    scaleReverse = this.getReverseScaleOption();
                }

                var labels = [];

                //attribute title
                var rowTitles = this.dataInterface.getRowHeaders().titles[0],
                //metric title
                    colTitles = this.dataInterface.getColHeaders().titles[0];

                for (var i = 0; i < gridData.getTotalRows(); i++) {
                    if (rowTitles && rowTitles['es'] && rowTitles['es'][i] && rowTitles['es'][i]['n']) {
                        labels[i] = rowTitles['es'][i]['n'];
                    }
                }
                var numRow = this.dataInterface.getTotalRows(),
                    numCol = this.dataInterface.getTotalCols();

                var childList = rawData['children'],
                    dataEntries = [], metricValues, currentColor, randomColorFullOpaque, currentBackgroundColor;

                //looping through the metrics
                for (var i = 0; i < numCol; i++) {

                    metricValues = [];

                    currentColor = getColor(i);

                    randomColorFullOpaque = currentColor + 1 + ")";

                    currentBackgroundColor = currentColor + 0.2 + ")";

                    //looping through the attributes
                    ARRAY.forEach(childList, function (item, idx) {
                        metricValues.push(item['values'][i]['rv']);
                    });

                    var metricLabel;
                    if (colTitles && colTitles['es'] && colTitles['es'][i] && colTitles['es'][i]['n']) {
                        metricLabel = colTitles['es'][i]['n'];
                    }

                    var dataEntry = {
                        label: metricLabel,
                        backgroundColor: currentBackgroundColor,
                        borderColor: randomColorFullOpaque,
                        pointBackgroundColor: randomColorFullOpaque,
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: randomColorFullOpaque,
                        data: metricValues
                    }

                    dataEntries.push(dataEntry);
                }

                var chartData = {
                    labels: labels,
                    datasets: dataEntries
                };

                var aNode = d3.select(this.domNode)
                    .append("canvas")
                    .attr("id", "myChart")
                    .style("width", this.width + "px")
                    .style("height", this.height + "px");

                // Any of the following formats may be used
                var ctx = this.domNode.getElementsByTagName("canvas")[0];

                var myRadarChart = new Chart(ctx, {
                    type: 'radar',
                    data: chartData,
                    options: {
                        scale: {
                            reverse: scaleReverse,
                            ticks: {
                                callback: function (value, index, values) {
                                    return formatThousandsNoRounding(value, 2);
                                },
                                beginAtZero: false
                            }
                        },
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    //metric_name: metric_value
                                    return data.datasets[tooltipItem.datasetIndex].label + ": " + formatThousandsNoRounding(tooltipItem.yLabel ,2);
                                },
                                title: function (tooltipItem, data) {
                                    //attribute_name: attribute_form
                                    return rowTitles['n'] + ": " + data.labels[tooltipItem[0].index];
                                }
                            }
                        }
                    }
                });

                //dp stands for how many digits after the decimal point
                function formatThousandsNoRounding(n, dp){
                    var e = '', s = e+n, l = s.length, b = n < 0 ? 1 : 0,
                        i = s.lastIndexOf('.'), j = i == -1 ? l : i,
                        r = e, d = s.substr(j+1, dp);
                    while ( (j-=3) > b ) { r = ',' + s.substr(j, 3) + r; }
                    return s.substr(0, j + 3) + r +
                        (dp ? '.' + d + ( d.length < dp ?
                            ('00000').substr(0, dp - d.length):e):e);
                };


                function getColor(index) {

                    var i = index % 16;
                    var rgbColor = COLOR.hex2rgb(MSTRCOLOR[i]);
                    if (rgbColor != null) {
                        return "rgba(" + rgbColor[0] + "," + rgbColor[1] + "," + rgbColor[2] + ",";
                    }

                }

                // raise event for New Export Engine
                this.raiseEvent({
                    name: 'renderFinished',
                    id: this.k
                });

            }
        })
}());
//@ sourceURL=RadarChart.js