(function () {

    if (!mstrmojo.plugins.D3BoxPlot) {
        mstrmojo.plugins.D3BoxPlot = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );


    mstrmojo.plugins.D3BoxPlot.D3BoxPlot = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null, {
            scriptClass: "mstrmojo.plugins.D3BoxPlot.D3BoxPlot",
            cssClass: "d3boxplot",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{
                url: "//code.jquery.com/jquery-3.1.1.slim.min.js"
            }, {
                url: "//d3js.org/d3.v3.min.js"
            }],
            useRichTooltip: false,
            reuseDOMNode: false,
            supportNEE: true, // indicate the widget supports PDF exporting by New Export Engine
            plot: function () {
                /**
                 * Box Plot created by Darren Holmblad on 12/15/2015.
                 * Version 1.0
                 * This code is dependent on the D3 Library
                 */

                //defines the width of the individual box plot
                var boxPlotWidth = 20;
                var margin = {
                    top: 20,
                    left: 80,
                    bottom: 65
                };

                var width = parseInt(this.width, 10) - margin.left;
                var height = parseInt(this.height, 10) - (margin.top * 2) - margin.bottom;
                var inf = Infinity;
                //flag to decide if outliers should be removed from the box plot

                var titleFont;
                var titleColor;
                var axisFont;
                var backgroundColor;
                var cnst;
                var maxVal = 0;
                var minVal = 0;
                var remvoveOutliers = false;
                var omitOutliers = false;

                var applyVIFormatting = function (fmt) {
                    backgroundColor = fmt["background-color"];
                    axisFont = fmt.ttl.font.substring(fmt.ttl.font.indexOf(" "), fmt.ttl.font.length);
                    titleFont = fmt.ttl.font;
                    titleColor = fmt.ttl.color;
                };

                /*
                 * Function used to alter numerical value to have no special characters, and a maximum of two decimal points
                 */
                var metricPretty = function (val) {
                    return val.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                };


                d3.selection.prototype.position = function () {
                    var el = this.node();
                    var elPos = el.getBoundingClientRect();
                    var vpPos = getVpPos(el);

                    function getVpPos(el) {
                        if (el.parentNode.nodeName === 'svg') {
                            return el.parentNode.getBoundingClientRect();
                        }
                        return getVpPos(el.parentNode);
                    }

                    return {
                        top: elPos.top - vpPos.top,
                        left: elPos.left - vpPos.left,
                        width: elPos.width,
                        bottom: elPos.bottom - vpPos.top,
                        height: elPos.height,
                        right: elPos.right - vpPos.left
                    };

                };

                /*
                 * Function used to find ancestor by the class name
                 */
                var findAncestor = function(el, cls) {
                    while ((el = el.parentElement) && !el.classList.contains(cls));
                    return el;
                };

                var tFormatter = function (val) {
                    return val > 999 ? (val / 1000).toFixed(1) + 'k' : val;
                };

                /*
                 * This function takes the raw data from the MicroStrategy DataInterface API and processes it into a known flat structure
                 */
                var processData = function (data) {
                    var result = [];
                    var rawChildren = data.children;
                    for (var i = 0; i < rawChildren.length; i++) {
                        var attributeNm = rawChildren[i].name;
                        for (var z = 0; z < rawChildren[i].children.length; z++) {
                            //set max value for the y-asix range
                            if (rawChildren[i].children[z].value > maxVal) maxVal = rawChildren[i].children[z].value;
                            //set min value for the y-asix range
                            if (rawChildren[i].children[z].value < minVal) minVal = rawChildren[i].children[z].value;

                            if (result.length === 0) {
                                var metric = [];
                                metric.push(rawChildren[i].children[z].value);
                                result.push({
                                    att: rawChildren[i].name,
                                    sel: rawChildren[i].attributeSelector,
                                    d: metric
                                });
                            } else if (result.length != 0 && attributeNm != result[result.length - 1].att) {
                                var metric = [];
                                metric.push(rawChildren[i].children[z].value);
                                result.push({
                                    att: rawChildren[i].name,
                                    sel: rawChildren[i].attributeSelector,
                                    d: metric
                                });
                            } else {
                                result[result.length - 1].d.push(rawChildren[i].children[z].value);
                            }
                        }
                    }
                    return result;
                };

                /*
                 * This function takes the processed data and outputs calculated values for each box plot
                 * Minimum Value
                 * First Quartile
                 * Median Value
                 * Last Quartile
                 * Maximum Value
                 * Outliers, which are calculated as the IRQ, which is the distance between Q1 and Q2. And any outlier is greater or less than (IRQ x1.5)
                 */
                var processDataToBoxPlot = function (data) {

                    var result = [];

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].d.length === 1) {
                            var value = data[i].d[0];
                            result.push({
                                attribute: data[i].att,
                                min: value,
                                first: value,
                                median: value,
                                third: value,
                                max: value,
                                outliers: [],
                                sel: data[i].sel
                            });
                            continue;
                        }

                        var dataArry = sortDataArrayAsc(data[i].d);

                        var m = findMedian(dataArry);
                        var leftHalf;


                        //break arrays
                        if (dataArry.length % 2) {
                            //odd number, remove median
                            leftHalf = dataArry.splice(0, Math.floor(dataArry.length / 2) + 1);
                        } else {
                            //even number split in half
                            leftHalf = dataArry.splice(0, Math.floor(dataArry.length / 2));
                        }

                        var f = findMedian(leftHalf);
                        var t = findMedian(dataArry);

                        var o = [];
                        var minPos = 0;
                        var maxPos = dataArry.length - 1;

                        if (remvoveOutliers || omitOutliers) {
                            //outlierDiff is irq(box range) times 1.5

                            var outlierDiff = (t - f) * 1.5;

                            if ((f - outlierDiff) > 0) {
                                for (var j = 0; j < leftHalf.length; j++) {
                                    //check if outlier
                                    if (leftHalf[j] < (f - outlierDiff)) {
                                        o.push(leftHalf[j]);
                                    } else {
                                        minPos = j;
                                        break;
                                    }
                                }
                            }

                            for (var p = dataArry.length - 1; p > 0; p--) {
                                //check if outlier
                                if (dataArry[p] > (t + outlierDiff)) {
                                    o.push(dataArry[p]);
                                } else {
                                    maxPos = p;
                                    break;
                                }
                            }
                        }

                        result.push({
                            attribute: data[i].att,
                            min: leftHalf[minPos],
                            first: f,
                            median: m,
                            third: t,
                            max: dataArry[maxPos],
                            outliers: o,
                            sel: data[i].sel
                        });

                    }

                    return result;
                };

                var sortDataArrayAsc = function (data) {
                    return data.sort(function (a, b) {
                        return a - b;
                    });
                };

                var findMedian = function (data) {
                    var half = Math.floor(data.length / 2);
                    if (data.length % 2) {
                        return data[half];
                    } else {
                        return (data[half - 1] + data[half]) / 2.0;
                    }
                };


                $('.custom-vis-layout').css("overflow", "scroll");

                var rawData = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ADV, {
                    hasSelection: true
                });
                var outlierTip = this.zonesModel.getDropZoneObjectsByName("Display Outliers");
                var omitOutlierDrop = this.zonesModel.getDropZoneObjectsByName("Omit Outliers");


                if (omitOutlierDrop.length > 0) omitOutliers = true;
                else omitOutliers = false;

                if (outlierTip.length > 0) remvoveOutliers = true;
                else remvoveOutliers = false;

                cnst = this;

                this.addUseAsFilterMenuItem();
                //Obtains the metric name to be used as the y-axis label
                var yaxisHeader = this.dataInterface.getColHeaders(0).getHeader(0).getName();

                //Obtains the first attribute name to be used as the x-axis label
                var xaxisHeader = this.dataInterface.getRowTitles().titles[0].n;

                //load style information from VI apis
                applyVIFormatting(this.defn.fmts);

                var parsedData = processDataToBoxPlot(processData(rawData));

                if (this.width > 600 && parsedData.length < 5) boxPlotWidth = 60;

                width = parsedData.length * (boxPlotWidth * 2);


                if (width < this.width) {
                    width = this.width;
                    width = width - margin.left;
                }


                var svgParent = d3.select(this.domNode).select("svg");


                if (svgParent.empty()) {
                    //define graph container
                    var svgParent = d3.select(this.domNode).append("svg")
                        .attr("width", width + margin.left)
                        .attr("height", height + margin.top + margin.bottom)
                        .attr("class", "chartBoxPlot")
                        .on("click", function (d) {
                            if (!event.target.classList.contains('box')) {
                                $('.box').css("opacity", ".5");
                                cnst.clearSelections();
                                cnst.endSelections();
                            } else {
                                return true;
                            }
                        });
                } else {
                    $(".chartBoxPlot").empty();
                }

                /* Tooltip div for outlier circles */
                var outlierToolTip = d3.select(this.domNode)
                    .append("div")
                    .attr("class", "tool")
                    .attr("id", "outlierToolTip")
                    .style("position", "relative")
                    .style("z-index", "10")
                    .style("visibility", "hidden")
                    .text("a");
                /* Tooltip div for boxplot */
                var tooltip = d3.select(this.domNode)
                    .append("div")
                    .attr("class", "tool")
                    .attr("id", "toolTip")
                    .style("position", "relative")
                    .style("z-index", "10")
                    .style("visibility", "hidden")
                    .text("a");
                /* Tooltip div for boxplot if position is too far right */
                var overFlowTooltip = d3.select(this.domNode)
                    .append("div")
                    .attr("class", "tool")
                    .attr("id", "toolTipOver")
                    .style("position", "relative")
                    .style("z-index", "10")
                    .style("visibility", "hidden")
                    .text("a");

                var chartAndAxis = svgParent.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .attr("class", "chart-and-axis");


                var chart = chartAndAxis.append("g")
                    .attr("transform", "translate(0, 0)")
                    .attr("class", "chart")
                    .style("overflow", "scroll");

                var x = d3.scale.ordinal()
                    .domain(parsedData.map(function (d) {
                        return d.attribute;
                    }))
                    .rangePoints([0, width], 0.6);


                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");


                //append x axis
                chartAndAxis.append("g")
                    .attr("transform", "translate(0, " + (height) + " )")
                    .attr("class", "x axis")
                    .call(xAxis)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .style("font", axisFont)
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", function (d) {
                        return "rotate(-45)";
                    })
                ;

                //y-axis
                var y = d3.scale.linear()
                    .domain([minVal * 1.1, maxVal * 1.1]).nice()
                    .range([height, 0]);
                var yAxis = d3.svg.axis().scale(y).orient("left");

                //append y axis
                chartAndAxis.append("g")
                    .attr("class", "y axis")
                    .style("font", axisFont)
                    .call(yAxis)
                    .append("text")
                    .style("font", axisFont)
                    .attr("transform", "rotate(-90)")
                    .attr("y", 20 - margin.left)
                    .attr("x", -height / 2)
                    .text(yaxisHeader);

                chart.insert("g", ".grid")
                    .attr("class", "grid vertical")
                    .attr("transform", "translate(0," + (height) + ")")
                    .style("font", axisFont)
                    .call(d3.svg.axis().scale(x)
                        .orient("bottom")
                        .tickSize(-(height), 0, 0)
                        .tickFormat("")
                );

                chart.insert("g", ".grid")
                    .attr("class", "grid horizontal")
                    .call(d3.svg.axis().scale(y)
                        .orient("left")
                        .tickSize(-(width), 0, 0)
                        .tickFormat(""));


                //create box plot
                var boxplot = chart.selectAll("boxplot")
                    .data(parsedData)
                    .enter()
                    .append("g")
                    .attr("class", "boxplot").each(function (d, i) {
                        if (!omitOutliers) {
                            var outlierCircles = d3.select(this)
                                .selectAll("circle")
                                .data(d.outliers);

                            outlierCircles.enter()
                                .append("circle")
                                .attr("class", "outlier")
                                .attr("r", 4)
                                .attr("cx", x(d.attribute))
                                .attr("cy", function (outlier) {
                                    return y(outlier);
                                })
                                .attr("fill", function (outlier) {
                                    return "#" + Math.floor(Math.random() * 16777215).toString(16);
                                })
                                .on('mouseover', function (outlier) {
                                    //outlierToolTip

                                    var rectPos = d3.select(this).position();
                                    var curY = rectPos.top;
                                    var curX = rectPos.right;


                                    outlierToolTip.html("<div>" + metricPretty(outlier) + "</div>");
                                    outlierToolTip.style("top", (curY - 33) + "px").style("left", (curX - 42) + "px");
                                    outlierToolTip.style("visibility", "visible");
                                    outlierToolTip.style("position", "relative");
                                    var cir = d3.select(this);
                                    cir.transition()
                                        .duration(50)
                                        .attr('stroke-width', 2);
                                })
                                .on('mouseout', function (outlier) {
                                    $(".tool").css("visibility", "hidden");
                                    d3.select(this)
                                        .transition()
                                        .duration(50)
                                        .attr('stroke-width', 1);
                                });
                        }
                    })
                    .on("click", function (d) {
                        $('.box').css("opacity", ".5");
                        var b = this.getElementsByClassName('box');
                        $(b[0]).css("opacity", "1");

                        if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.selectionDataJSONString) { //for mobile
                              d.sel.messageType = "selection";
                              window.webkit.messageHandlers.selectionDataJSONString.postMessage(d.sel);
                            } else {
                              cnst.applySelection(d.sel); //for web
                            }

                    });

                //min line
                var minLine = boxplot.append("line")
                    .attr("y1", function (d) {
                        return y(d.min);
                    })
                    .attr("x1", function (d) {
                        return x(d.attribute) - boxPlotWidth / 2;
                    })
                    .attr("y2", function (d) {
                        return y(d.min);
                    })
                    .attr("x2", function (d) {
                        return x(d.attribute) + boxPlotWidth / 2;
                    })
                    .attr("class", "line min-line");


                //min whisker
                var minWhisker = boxplot.append("line")
                    .attr("x1", function (d) {
                        return x(d.attribute);
                    })
                    .attr("y1", function (d) {
                        return y(d.min);
                    })
                    .attr("x2", function (d) {
                        return x(d.attribute);
                    })
                    .attr("y2", function (d) {
                        return y(d.first);
                    })
                    .attr("class", "dotted-line min-line");

                //first & third box
                var rect = boxplot.append("rect")
                    .attr("class", "box")
                    .attr("x", function (d) {
                        return x(d.attribute) - boxPlotWidth / 2;
                    })
                    .attr("y", function (d) {
                        return y(d.third);
                    })
                    .attr("width", boxPlotWidth)
                    .attr("height", function (d) {
                        return y(d.first) - y(d.third);
                    })
                    .on("mouseover", function (d) {
                        var desiredTip;
                        var rectPos = d3.select(this).position();
                        var curY = rectPos.top;
                        var curX = rectPos.right;
                        if ((curX + $('#toolTip').width() + parseInt($('#toolTip').css('padding-left').replace(/[^-\d\.]/g, ''))) > $(window).width()) {
                            //to far to the right to render tooltip flip it around
                            curX = curX - 210;
                            desiredTip = overFlowTooltip;
                        } else {
                            desiredTip = tooltip;
                        }

                        /* Define the tooltip area*/
                        desiredTip.html("<div><div id='toolHeader'><strong>Interquartile Range for " + d.attribute + "</strong></div>" + "<div class='left'>Maximum </div> <div class='right'>" + metricPretty(d.max) + "</div>" + "<div class='left'>Third Quartile</div><div class='right'> " + metricPretty(d.third) + "</div>" + "<div class='left'>Median</div> <div class='right'>" + metricPretty(d.median) + "</div>" + "<div class='left'>First Quartile</div> <div class='right'>" + metricPretty(d.first) + "</div>" + "<div class='left'>Minimum </div><div class='right'> " + metricPretty(d.min) + "</div>" + "</div>");

                        desiredTip.style("top", (curY - 55) + "px").style("left", (curX + 10) + "px");
                        desiredTip.style("visibility", "visible");
                        desiredTip.style("position", "relative");
                        return true;
                    })
                    .on("mouseout", function () {
                        return $(".tool").css("visibility", "hidden");
                    });


                //median
                boxplot.append("line")
                    .attr("y1", function (d) {
                        return y(d.median);
                    })
                    .attr("x1", function (d) {
                        return x(d.attribute) - boxPlotWidth / 2;
                    })
                    .attr("y2", function (d) {
                        return y(d.median);
                    })
                    .attr("x2", function (d) {
                        return x(d.attribute) + boxPlotWidth / 2;
                    })
                    .attr("class", "line median-line");


                //max line
                boxplot.append("line")
                    .attr("y1", function (d) {
                        return y(d.max);
                    })
                    .attr("x1", function (d) {
                        return x(d.attribute) - boxPlotWidth / 2;
                    })
                    .attr("y2", function (d) {
                        return y(d.max);
                    })
                    .attr("x2", function (d) {
                        return x(d.attribute) + boxPlotWidth / 2;
                    })
                    .attr("class", "line max-line");


                //max whisker to box
                var maxWhisker = boxplot.append("line")
                    .attr("x1", function (d) {
                        return x(d.attribute);
                    })
                    .attr("y1", function (d) {
                        return y(d.max);
                    })
                    .attr("x2", function (d) {
                        return x(d.attribute);
                    })
                    .attr("y2", function (d) {
                        return y(d.third);
                    })
                    .attr("class", "dotted-line max-line");


                //perform some formatting
                var xline = $('.grid.horizontal .tick').first().find('line');
                $(xline).css("stroke", "#727476");
                $(xline).css("stroke-width", "1px");
                $(xline).css("shapeRedndering", "crispEdges");
                $(xline).css("opacity", "1");

                $('.chartBoxPlot text').css("font-family", axisFont);
                $('.chartBoxPlot text').css("font-size", "10px");

                // raise event for New Export Engine
                this.raiseEvent({
                    name: 'renderFinished',
                    id: this.k
                });
            }
        });
}());
