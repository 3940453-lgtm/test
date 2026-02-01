(function () {
    mstrmojo.requiresCls(
        "mstrmojo.Container",
        "mstrmojo._HasLayout",
        "mstrmojo.tooltip",
        "mstrmojo.css",
        "mstrmojo.VisUtility",
        "mstrmojo.num"
    );

    var $CSS = mstrmojo.css,
        $NUM = mstrmojo.num,
        $VISUTIL = mstrmojo.VisUtility,
        MIN_FONT_SIZE = 8;


    mstrmojo.plugins.SmartKPIWidget.SINGLE_METRIC_DISPLAY_MODE = {
        HORIZONTAL: 0,
        VERTICAL: 1
    };

    mstrmojo.plugins.SmartKPIWidget.KPI_TEMPLATE_MODE = {
        ONLY_METRIC: 0,
        METRIC_WITH_TIME: 1,
        METRIC_WITH_CATEGORY: 2,
        METRIC_WITH_TIME_AND_CATEGORY: 3
    };

    var SINGLE_METRIC_DISPLAY_MODE = mstrmojo.plugins.SmartKPIWidget.SINGLE_METRIC_DISPLAY_MODE,
        KPI_TEMPLATE_MODE = mstrmojo.plugins.SmartKPIWidget.KPI_TEMPLATE_MODE,
        STYLE_NAME = ['only_metric', 'metric_with_timeline', 'only_metric', 'metric_with_timeline'];

    mstrmojo.plugins.SmartKPIWidget.KPISingleMetric = mstrmojo.declare(
        mstrmojo.Container,

        [mstrmojo._HasLayout],

        /**
         * @lends mstrmojo.Container.prototype
         */
        {
            scriptClass: 'mstrmojo.plugins.SmartKPIWidget.KPISingleMetric',

            cssClass: 'single-kpi-container',

            displayMode: SINGLE_METRIC_DISPLAY_MODE.HORIZONTAL,

            invertThresholdColor: false,

            layoutConfig: {
                w: {
                    containerNode: '100%',
                    leftPadding: '0px',
                    rightPadding: '0px'
                },
                xt: true
            },

            KPITemplateMode: 0,

            metricName: 'profit',

            metricNameHTML: 'profit',

            categoryElemName: 'Books',

            metricValue: '280,200$',

            prevMetricInfo: 'Last Year : 200,700$',

            compareToPrev: '0.396',

            chartData: [78, 20, 36, 50, 58, 30, 14, 59, 22, 15],

            xAxisData: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],

            markupString: '<div class="{@cssClass}" style="{@cssText}" >' +
                '<div class="metric-name label">{@metricNameHTML}</div>' +
                '<div class="metric-value label">{@metricValue}</div>' +
                '<div class="previous-metric label">{@prevMetricInfo}</div>' +
                '<div class="compare-to-previous label">{@compareToPrevString}</div>' +
                '<div class="chart" style=""></div>' +
            '</div>',

            markupSlots: {
                containerNode: function () {
                    return this.domNode;
                },
                metricNameNode: function () {
                    return this.domNode.childNodes[0];
                },
                metricValueNode: function () {
                    return this.domNode.childNodes[1];
                },
                prevMetricNode: function () {
                    return this.domNode.childNodes[2];
                },
                compareNode: function () {
                    return this.domNode.childNodes[3];
                },
                chartNode: function () {
                    return this.domNode.childNodes[4];
                },
                //Return HTMLElements in array which tooltip will attach on.
                tooltipNode: function () {
                    return [];
                }
            },

            markupMethods: {
                onvisibleChange: mstrmojo.Widget.visibleMarkupMethod,
                onenabledChange: mstrmojo.Widget.enabledMarkupMethod
            },


            hasTimeLine: function hasTimeLine() {
                return (this.KPITemplateMode === KPI_TEMPLATE_MODE.METRIC_WITH_TIME || this.KPITemplateMode === KPI_TEMPLATE_MODE.METRIC_WITH_TIME_AND_CATEGORY) && this.chartData.length > 1;
            },

            hasCategoryAttr: function hasCategoryAttr() {
                return this.KPITemplateMode === KPI_TEMPLATE_MODE.METRIC_WITH_CATEGORY || this.KPITemplateMode === KPI_TEMPLATE_MODE.METRIC_WITH_TIME_AND_CATEGORY;
            },


            init: function init(p) {
                this._super(p);

                var dataCnt = this.chartData.length,
                    lastValidMetricValueIdx = dataCnt - 1,
                    isPercent,
                    isPermillage;

                //find last metric value which is not NaN
                while(lastValidMetricValueIdx >= 0 && isNaN(this.chartData[lastValidMetricValueIdx])){
                    lastValidMetricValueIdx--;
                }


                this.metricValue = this.chartFormatData[lastValidMetricValueIdx];
                this.metricRawValue = this.chartData[lastValidMetricValueIdx];

                // has time attribute
                if (this.hasTimeLine() && lastValidMetricValueIdx >= 1) {
                    this.prevMetricValue = this.chartFormatData[lastValidMetricValueIdx - 1];
                    this.prevMetricRawValue = this.chartData[lastValidMetricValueIdx- 1];

                    this.prevMetricInfo = 'Previous ' + this.periodName + ': ' + this.prevMetricValue;

                    isPercent = this.metricValue.indexOf('%') > 0;
                    isPermillage = this.metricValue.indexOf('‰') > 0;

                    if (isPercent || isPermillage) {
                        this.compareToPrev = this.metricRawValue - this.prevMetricRawValue;

                        this.compareToPrevString = (this.compareToPrev > 0 ? '+' : '') + $NUM.formatByMask(this.nfs, this.compareToPrev) + '.';
                        //if (isPercent) {
                        //    this.compareToPrevString = (this.compareToPrev > 0 ? '+ ' : '- ') + Number(Math.abs(this.compareToPrev * 100)).toFixed(1) + '%';
                        //} else {
                        //    this.compareToPrevString = (this.compareToPrev > 0 ? '+ ' : '- ') + Number(Math.abs(this.compareToPrev * 1000)).toFixed(1) + '‰';
                        //}
                    } else {
                        this.compareToPrev = (this.metricRawValue - this.prevMetricRawValue) / Math.abs(this.prevMetricRawValue);

                        this.compareToPrevString = (this.compareToPrev > 0 ? '+ ' : '- ') + Number(Math.abs(this.compareToPrev * 100)).toFixed(1) + '%';

                    }


                }

                //has category attribute
                if (this.hasCategoryAttr()) {
                    this.metricNameHTML = this.metricName + ' of ' + '<span class="category-name" >' + this.categoryElemName + '</span>';
                    this.metricName = this.metricName + ' of ' + this.categoryElemName;
                } else {
                    this.metricNameHTML = this.metricName;
                }
            },


            preBuildRendering: function preBuildRendering() {
                var cssText = this.cssText || '';

                var left = this.left;
                if (left) {
                    cssText += 'left:' + this.left + ';';
                }

                var top = this.top;
                if (top) {
                    cssText += 'top:' + this.top + ';';
                }

                this.cssText = cssText;

                return (this._super) ? this._super() : true;
            },


            postBuildRendering: function postBuildRendering() {

                this._super();

                var width = parseFloat(this.width),
                    height = parseFloat(this.height);

                if (width/height < 1) {
                    this.responsiveMode = SINGLE_METRIC_DISPLAY_MODE.VERTICAL;
                    $CSS.toggleClass(this.containerNode, 'vertical', true);
                    $CSS.toggleClass(this.containerNode, 'horizontal', false);
                } else {
                    this.responsiveMode = SINGLE_METRIC_DISPLAY_MODE.HORIZONTAL;
                    $CSS.toggleClass(this.containerNode, 'vertical', false);
                    $CSS.toggleClass(this.containerNode, 'horizontal', true);
                }

                $CSS.toggleClass(this.containerNode, STYLE_NAME[this.KPITemplateMode], true);

                this.fitTextToContainer(this.metricNameNode);
                this.fitTextToContainer(this.metricValueNode);

                if (this.hasTimeLine()) {
                    if ((!this.invertThresholdColor && this.compareToPrev > 0) || (this.invertThresholdColor && this.compareToPrev <= 0)) {
                        $CSS.toggleClass(this.containerNode, 'increasing', true);
                        $CSS.toggleClass(this.containerNode, 'decreasing', false);
                    } else {
                        $CSS.toggleClass(this.containerNode, 'increasing', false);
                        $CSS.toggleClass(this.containerNode, 'decreasing', true);
                    }

                    this.fitTextToContainer(this.prevMetricNode);

                    if (this.responsiveMode === SINGLE_METRIC_DISPLAY_MODE.HORIZONTAL) {
                        this.positionCompareNode();
                    }

                    this.fitTextToContainer(this.compareNode);

                    this.parseData();

                    this.drawChart();
                }

            },

            parseData: function parseData() {
                this.dataMin = Math.min.apply(null, this.chartData);
            },

            drawChart: function drawChart() {

                var myChart = echarts.init(this.chartNode),
                    chartFormatData = this.chartFormatData,
                    compareNode = this.compareNode,
                    compareNodeStyle = window.getComputedStyle(compareNode),
                    dataPointColor = compareNodeStyle.backgroundColor,
                    chartNode = this.chartNode,
                    chartNodeStyle = window.getComputedStyle(chartNode),
                    chartColor = chartNodeStyle.color;


                var option = {
                    animation: !window.mstrApp.isExporting,
                    title: {
                        show: false,
                        padding: 0
                    },
                    tooltip: {
                        show: true,
                        trigger: 'axis',
                        axisPointer: {
                            type: 'line',
                            lineStyle: {
                                width: 0
                            }
                        },
                        formatter: function (params) {
                            var dataIndex = params[0].dataIndex;
                            return params[0].name + '<br/>' + chartFormatData[dataIndex];
                        }
                    },
                    legend: {
                    },
                    xAxis: {
                        show: false,
                        boundaryGap: false,
                        data: this.xAxisData
                    },
                    yAxis: {
                        show: false,
                        boundaryGap: false,
                        //min: 'dataMin',
                        min: Math.min(0, this.dataMin),
                        max: 'dataMax'
                    },
                    series: [{
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        showSymbol: false,
                        itemStyle: {
                            normal: {
                                color: dataPointColor,
                                areaStyle: {color: chartColor, opacity: 1},
                                lineStyle: {color: chartColor}
                            }
                        },
                        data: this.chartData
                    }],
                    grid:{
                        x:0,
                        y:5,
                        x2:0,
                        y2:0,
                        borderWidth:0
                    }
                };

                myChart.setOption(option);

            },

            measureTextSize: function (string, fs, bonus) {
                return {
                    width: $VISUTIL.measureTextWidthWithSpan(string, fs, bonus),
                    height: $VISUTIL.measureTextHeight(string, fs, bonus)
                }
            },

            getFontStyle: function getFontStyle(div, fontSize){
                var computedStyle = $CSS.getComputedStyle(div),
                    fontStyle = {};

                fontStyle.fontFamily = computedStyle.fontFamily;
                fontStyle.fontStyle = computedStyle.fontStyle;
                fontStyle.fontSize = fontSize + 'px';
                fontStyle.fontWeight = computedStyle.fontWeight;
                fontStyle.bonus = parseInt(computedStyle.paddingLeft) + parseInt(computedStyle.paddingRight);

                return fontStyle;
            },

            getCurrTextSize: function getCurrTextSize(div, fontSize) {
                var text = div.innerText,
                    fontStyle = this.getFontStyle(div, fontSize);
                return this.measureTextSize(text, fontStyle, fontStyle.bonus);
            },

            fitTextToContainer: function fitTextToContainer(div) {
                var fontSize = MIN_FONT_SIZE + 1,
                    containerWidth = div.offsetWidth,
                    containerHeight = div.offsetHeight,
                    text = div.innerText,
                    currSize = this.getCurrTextSize(div, fontSize);

                // fnie;If text in div is empty str, return size will always be zero
                if (text && text !== '') {
                    while (currSize.width < containerWidth && currSize.height < containerHeight) {
                        fontSize++;
                        currSize = this.getCurrTextSize(div, fontSize);
                    }
                }

                fontSize--;

                div.style.fontSize = fontSize + 'px';
                //make text vertical middle
                var computedStyle = window.getComputedStyle(div);
                div.style.lineHeight = (containerHeight - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom)) + 'px';
            },

            positionCompareNode: function positionCompareNode(){

                if (this.displayMode === SINGLE_METRIC_DISPLAY_MODE.HORIZONTAL) {
                    var metricValueNode = this.metricValueNode,
                        compareNode = this.compareNode,
                        metricValueStyle = window.getComputedStyle(metricValueNode),
                        fontSize = parseFloat(metricValueStyle.fontSize),
                        metricValueTop = metricValueNode.offsetTop,
                        metricValueHeight = metricValueNode.offsetHeight,
                        compareNodeHeight = fontSize * 0.7;

                    compareNode.style.height = compareNodeHeight + 'px';
                    compareNode.style.top = (metricValueTop + (metricValueHeight - compareNodeHeight)/2) + 'px';

                }

            }


        }


    );
}());
//# sourceURL=KPISingleMetric.js:
