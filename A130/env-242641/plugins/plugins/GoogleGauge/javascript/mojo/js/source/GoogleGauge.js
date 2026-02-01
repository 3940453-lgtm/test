(function () {
    if (!mstrmojo.plugins.GoogleGauge) {
        mstrmojo.plugins.GoogleGauge = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    mstrmojo.plugins.GoogleGauge.GG_PROPERTIES = {
        DISPLAY_METRIC: 'displayMetric',
        GREEN_FORMAT: 'GF',
        YELLOW_FORMAT: 'YF',
        RED_FORMAT: 'RF'
    };

    mstrmojo.plugins.GoogleGauge.GoogleGauge = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.GoogleGauge.GoogleGauge",
            cssClass: "googlegauge",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{url: "//www.google.com/jsapi"}],
            useRichTooltip: false,
            reuseDOMNode: false,
            supportNEE: true, // indicate the widget supports PDF exporting by New Export Engine
            getDisplayMetricOption: function () {
                var GG_PROPERTIES = mstrmojo.plugins.GoogleGauge.GG_PROPERTIES,
                    displayOption = this.getProperty(GG_PROPERTIES.DISPLAY_METRIC);
                return displayOption;
            },

            getColorOption: function (property) {
                return this.getProperty(property);
            },
            //The method used to get the color and percentage
            processColorHelper: function (color, defaultColor, defaultValue) {
                var processedColor = null;
                if (!color) return defaultColor;
                if (color.fillAlpha) {
                    var colorValue = parseInt(color.fillAlpha);

                    var tempColor = color.fillColor !== null ? color.fillColor : defaultColor;
                    var colorValue = (colorValue >= 0 && colorValue <= 100) ? colorValue : defaultValue;
                    processedColor = {
                        percentage: colorValue,
                        color: tempColor
                    }
                }
                return processedColor;

            },
            processColor: function () {

                var GG_PROPERTIES = mstrmojo.plugins.GoogleGauge.GG_PROPERTIES,
                    green = this.getColorOption(GG_PROPERTIES.GREEN_FORMAT),
                    yellow = this.getColorOption(GG_PROPERTIES.YELLOW_FORMAT),
                    red = this.getColorOption(GG_PROPERTIES.RED_FORMAT);

                if (green === undefined && yellow === undefined && red === undefined)return null;

                var processedGreen = this.processColorHelper(green, "#109618", 20),
                    processedYellow = this.processColorHelper(yellow, "#FF9900", 75),
                    processedRed = this.processColorHelper(red, "#DC3912", 90);

                var colorOption = {
                    green: {color: processedGreen.color, percentage: processedGreen.percentage},
                    yellow: {color: processedYellow.color, percentage: processedYellow.percentage},
                    red: {color: processedRed.color, percentage: processedRed.percentage}
                }
                return colorOption;
            },
            toggleMetrics: function () {
                var metricLabels = document.querySelectorAll('.custom-vis-layout.googlegauge g g text');
                for (m = 0; m < metricLabels.length; m++) {
                    metricLabels[m].style.display = metricLabels[m].style.display === 'none' ? '' : 'none';
                }
            },
            plot: function () {


                var me = this;
                this.domNode.style.overflow = "auto";
                var is10point2 = true;
                if (typeof me.addThresholdMenuItem == 'function') {
                    is10point2 = false;
                    me.setDefaultPropertyValues({
                        displayMetric: 'true',
                        GF: {fillColor: '#109618', fillAlpha: '20'},
                        YF: {fillColor: '#FF9900', fillAlpha: '75'},
                        RF: {fillColor: '#DC3912', fillAlpha: '90'}
                    });

                }

                if (!google.visualization || !google.visualization.Gauge) {
                    google.load('visualization', '1.1', {
                        "callback": drawChart,
                        packages: ["gauge"]
                    });


                } else {
                    drawChart();
                }


                function drawChart() {


                    var orgData = me.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ROWS_ADV, {
                        hasSelection: true,
                        hasTitleName: true
                    });


                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'Label');
                    data.addColumn('number', 'Value');
                    //Max and Min of the data, used to calculate the percentages
                    var dMax = 0;
                    var dMin = 0;

                    orgData.forEach ( function (data, i ){
                        var value = parseFloat(data.values[0].rv.toFixed(2));
                        dMax = value > dMax ? value : dMax;
                        dMin = value < dMin ? value : dMin;
                    })
                    var dRange = dMax - dMin;

                    for (var i = 0; i < orgData.length; i++) {


                        var label = orgData[i].headers[0].name;
                        var value = parseFloat(orgData[i].values[0].rv.toFixed(2));


                        data.addRows([
                            [label, 100 * (value - dMin) / dRange]
                        ]);


                    }
                    var options = {
                        width: me.domNode.clientWidth,
                        height: me.domNode.clientHeight,
                        redFrom: 90,
                        redTo: 100,
                        yellowFrom: 75,
                        yellowTo: 90,
                        greenFrom: 0,
                        greenTo: 20,
                        minorTicks: 5
                    };


                    var chart = new google.visualization.Gauge(me.domNode);
                    if (!is10point2) {
                        var colors = me.processColor();
                        if (colors !== null) {
                            options.greenColor = colors.green.color;
                            options.yellowColor = colors.yellow.color;
                            options.redColor = colors.red.color;
                            options.greenTo = colors.green.percentage <= colors.yellow.percentage ?
                                colors.green.percentage : colors.yellow.percentage;
                            options.yellowFrom = colors.yellow.percentage <= colors.red.percentage ?
                                colors.yellow.percentage : colors.red.percentage;
                            options.yellowTo = colors.red.percentage;
                            options.redFrom = colors.red.percentage;

                        }


                    }

                    chart.draw(data, options);

                    if (!is10point2) {
                        if (me.getDisplayMetricOption() === 'false') {
                            me.toggleMetrics();
                        }
                    }

                    // raise event for New Export Engine
                    me.raiseEvent({
                        name: 'renderFinished',
                        id: me.k
                    });
                }
            }
        })
}());
//@ sourceURL=GoogleGauge.js