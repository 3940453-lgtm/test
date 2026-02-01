(function () {
    if (!mstrmojo.plugins.D3Waterfall) {
        mstrmojo.plugins.D3Waterfall = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );
    var continuous = false, metricOnly = true, total = false, lineFlag = false, startWith = 0, metricColors = [];

    function toBoolean(str) {
        if (str && str === 'true') {
            return true;
        } else {
            return false;
        }
    }

    mstrmojo.plugins.D3Waterfall.D3Waterfall = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.D3Waterfall.D3Waterfall",
            cssClass: "d3waterfall",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{url: "//d3js.org/d3.v3.min.js"}],
            useRichTooltip: false,
            reuseDOMNode: false,
            supportNEE: true, // indicate the widget supports PDF exporting by New Export Engine
            switchContinuousMode: function (continuousFlag) {
                continuous = toBoolean(continuousFlag);
            },
            showTotal: function (totalsFlag) {
                total = toBoolean(totalsFlag);
            },
            showLine: function (isLine) {
                lineFlag = toBoolean(isLine);
            },
            startWith: function (value) {
                startWith = parseInt(value);
            },
            setColors: function setColors(color) {
                metricColors.push(color);
            },
            plot: function () {

                var ZONE_ATTRIBUTE_INDEX = 0, ZONE_METRIC_INDEX = 1;
                var isDocument = typeof this.zonesModel === "undefined";
                var is10point4 = isDocument ? false : typeof this.zonesModel.getColorByAttributes === 'function'; // Metric only mode is supported only in 10.4
                metricOnly = is10point4 ? this.zonesModel.getDropZones().zones[ZONE_ATTRIBUTE_INDEX].items.length == 0 : false;
                var is10point2 = isDocument ? true : !typeof this.addThresholdMenuItem === 'function'; //True if we are using MSTR 10.2

                //************* Process data retreived from the API
// Get the selected data
                var dataConfig = {hasSelection: true};

                if (!is10point2) {
                    dataConfig.hasThreshold = true;

                }
                if (metricOnly) {
                    dataConfig.minAttribute = 0;
                    dataConfig.minMetric = 1;
                    this.setProperty("continuousMode", 'true');
                }


                var rawD = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE, dataConfig);


                if (!is10point2) {
                    this.addThresholdMenuItem();
                    this.setDefaultPropertyValues({
                        continuousMode: metricOnly ? 'true' : this.getProperty("continuousMode") ? this.getProperty("continuousMode").toString() : 'false',
                        showTotals: this.getProperty("showTotals") ? this.getProperty("showTotals").toString() : 'false',
                        showLine: this.getProperty("showLine") ? this.getProperty("showLine").toString() : 'false',
						showLabel: this.getProperty("showLabel") ? this.getProperty("showLabel").toString() : 'true',
						showYAxis: this.getProperty("showLabel") ? this.getProperty("showYAxis").toString() : 'true',
                        startWith: metricOnly ? (this.getProperty("startWith") ? this.getProperty("startWith").toString() : 0) : 0,
                        metricOnly: metricOnly ? 'true':'false',
                        totalsColor: {
                            fillColor: '#4d88ff'
                        },
                        positiveColor: {
                            fillColor: '#48d148'
                        },
                        negativeColor: {
                            fillColor: '#ff4d4d'
                        }

                    });
                }

                //to maintain persistence after save and load

                if (!is10point2) {
                    if (this.getProperty("showTotals")) {
                        total = toBoolean(this.getProperty("showTotals").toString());
                    }
                    if (this.getProperty("continuousMode")) {
                        continuous = toBoolean(this.getProperty("continuousMode").toString());
                    }
                    if (this.getProperty("showLine")) {
                        lineFlag = toBoolean(this.getProperty("showLine").toString());
                    }
                    if (this.getProperty("startWith")) {
                        startWith = metricOnly ? parseInt(this.getProperty("startWith").toString()): 0;
                    }
                }

                scrollingHeight = true;
                var quantityName = "";
                var total_width = parseInt(this.width, 10);
                var total_height = parseInt(this.height, 10);
                var max_number_char_labels = metricOnly ? 40 : 14;
                var max_number_bars_before_scrolling = 25;
                var yaxiswidth = 50; //if you change the formatting of the y Axis, you might need to make this value bigger.
                var margin = {top: 40, right: 30, bottom: metricOnly ? 50 : 110, left: 40},
                    width = total_width - margin.left - margin.right - 20 - yaxiswidth,// -20 is to avoid having a scrolling mode by defaut
                    height = total_height - margin.top - margin.bottom - 20;// -20 is to avoid having a scrolling mode by defaut
                var colors = {
                    positive: is10point2 ? "#48d148" : this.getProperty("positiveColor").fillColor.toString(),
                    negative: is10point2 ? "#ff4d4d" : this.getProperty("negativeColor").fillColor.toString(),
                    total: is10point2 ? '#4d88ff' : this.getProperty("totalsColor").fillColor.toString()
                };
                var transitionDuration = 850;// Duration of the animations
                var me = this;
                var VIformat = this.defn.fmts;
                var numDecimal = 0;
				
		
				var labelFontSize = !is10point2 && me.getProperty("labelFont") && me.getProperty("labelFont").fontSize ? me.getProperty("labelFont").fontSize : "10pt";
				var labelFont = !is10point2 && me.getProperty("labelFont") && me.getProperty("labelFont").fontFamily ? me.getProperty("labelFont").fontFamily: "Arial";
				var labelColor = !is10point2 && me.getProperty("labelFont") && me.getProperty("labelFont").fontColor ? me.getProperty("labelFont").fontColor : "White";
				var isLabelItalic = !is10point2 && me.getProperty("labelFont") && me.getProperty("labelFont").fontItalic ? me.getProperty("labelFont").fontItalic : false;
				var isLabelBold = !is10point2 && me.getProperty("labelFont") && me.getProperty("labelFont").fontWeight ? me.getProperty("labelFont").fontWeight : true;
				var isLabelLT = !is10point2 && me.getProperty("labelFont") && me.getProperty("labelFont").fontLineThrough ? me.getProperty("labelFont").fontLineThrough : false;
				var isLabelUL = !is10point2 && me.getProperty("labelFont") && me.getProperty("labelFont").fontUnderline ? me.getProperty("labelFont").fontUnderline : false;
				var showLabel = !is10point2 && me.getProperty("showLabel") ?  toBoolean(me.getProperty("showLabel")) : false;
				var showYAxis = !is10point2 && me.getProperty("showYAxis") ?  toBoolean(me.getProperty("showYAxis")) : false;

                // Enable the "use as selector" option on the visualization menu
                this.addUseAsFilterMenuItem();
				
                //  **************************  Functions

                // Get the max metric value of a data set
                var getMaxValues = function (borders) {
                    var min = startWith <0 ? startWith :0;
                    var maxValues = [min,startWith];
                    for (j = 0; j < borders.length; j++) {
                        var value = borders[j][0] + borders[j][1]
                        if ( value> maxValues[0]) {//+startWith
                            maxValues [0]= value;
                        }
                        var displayedValue =borders[j][2] + borders[j][3]
                        if (displayedValue > maxValues[1]) {//+startWith
                            maxValues [1]= displayedValue;
                        }
                    }
                    return maxValues;
                };

                // Get the min metric value of a data set
                var getMinValues = function (borders) {
                    var minValues = [0,startWith];
                    for (j = 0; j < borders.length; j++) {
                        var value = borders[j][0] + borders[j][1]
                        if (value <  minValues[0]) {
                            minValues[0] = value;
                        }
                        var displayedValue =borders[j][2] + borders[j][3];
                        var isTotal = total&& j === borders.length-1;
                        if ( !isTotal &&displayedValue <  minValues[1] ) {
                            minValues[1] = displayedValue;
                        }
                    }
                    return minValues;
                };

                // Create the an array with the base value (where to start) and the value of the bar (the height of the bar)
                var getBarBorders = function (data) {
                    var borders = [], k = 0, last = 0, startD = 0;
                    startD = last + startWith;


                    for (j = 0; j < dataS.length; j++) {
                        for (i = 0; i < dataS[j].metrics.length; i++) {
                            var v = 0, endD = 0;
                            v = +dataS[j].metrics[i];

                            endD = v - (i===0 ?startWith:0);

                            if (total && (i === dataS[j].metrics.length - 1)) {
                                v = last ;
                                last = 0;
                                var startAndValpos = startWith >0 &&v >0;
                                endD =  v - (startAndValpos ?startWith:0) ;
                                startD= last;
                            }



                            borders[k++] = [last, v, startD, endD];
                            last += v;
                            startD = last;
                        }
                        if (!continuous){
                            last = 0;
                            startD= startWith;
                        }
                    }
                    return borders;
                };

                function getTextWidth(text, ft) {
                    // re-use canvas object for better performance
                    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
                    var context = canvas.getContext("2d");
                    context.font = ft;
                    var metrics = context.measureText(text);
                    return metrics.width;
                };

                // Retrieve the metrics' label to be displayed on the X axis
                var genMetricsLabel = function (metrics) {
                    var metricLabels = [], cut = false;
                    for (i = 0; i < metrics.length; i++) {
                        var label = metrics[i];
                        var length = label.length;
                        cut = false;

                        if (!metricOnly && length > max_number_char_labels) {
                            cut = true;
                            length = max_number_char_labels;
                             label = label.substring(0, length);
                        }

                        length = max_number_char_labels;
                        var textWidth = getTextWidth( label, "11px arial");


                        while(metricOnly && textWidth > xBarWidth){
                            cut = true;
                            length -= 4;
                            label = label.substring(0, length);
                            textWidth = getTextWidth( label, "11px arial");
                        }


                        if (cut){
                            if(metricOnly){
                                label = label.substring(0, length-4);
                            }
                            label += "..";
                        }
                        metricLabels [i] = label;


                    }
                    return metricLabels;
                };

                // Retrieve the metric values from the array of raw data
                var getMetricsValues = function (tab) {
                    var metrics = [];
                    totalV = 0;
                    for (var j = 0; j < tab.values.length; j++) {
                        metrics.push(tab.values[j]["rv"] + "");
                        totalV += +tab.values[j]["rv"];
                        countBars++;
                    }
                    if (!continuous)
                        metrics.unshift("0"); // To create a spacing between the attributeName cycles
                    if (total){
                        metrics.push(totalV);
                    }
                    return metrics;
                };

                function numberFigureAfterComma(num) {
                    return (num.split('.')[1] || []).length;
                }


                //************************** Chart Implementation


                var container1 = d3.select(this.domNode).select("div");

                if (container1.empty()) {
                    container1 = d3.select(this.domNode).append("div")
                        .attr("class", "yaxiscontainer")
                        .style("position", "relative");
                }

                var ycontainer = d3.select(this.domNode.firstChild).select("svg");

                if (ycontainer.empty()) {
                    ycontainer = d3.select(this.domNode.firstChild).append("svg")
                        .attr("class", "containerY")
                        .attr("width", yaxiswidth)
                        .attr("height", height + margin.top + margin.bottom)
                        .style("float", "left")
                        .style("postition", "relative");
                }

                var container2 = d3.select(this.domNode).select("div.maincontainer");

                if (container2.empty()) {
                    container2 = d3.select(this.domNode).append("div")
                        .attr("class", "maincontainer")
                        .style("position", "absolute");
                }


                // Get the metrics names
                var gridData = this.dataInterface;
                var colHeaders = gridData.getColHeaders(0);
                var metricsL = [];
                for (var i = 0; i < colHeaders.headers.length; i++) {
                    metricsL[i] = colHeaders.getHeader(i).getName();
                }
                if (!continuous)
                    metricsL.unshift("");// To create a spacing between the attributeName cycles
                if (total)
                    metricsL.push("Total ");

                // Process the raw data into dataS to make the manipulation of the data easier while making the chart
                var countBars = 0, totalV = 0;// To count the number of bars to be displayed in the chart
                var dataS = [];

                for (var i = 0; i < rawD.children.length; i++) {
                    var mMetrics = getMetricsValues(rawD.children[i]);
                    dataS.push({
                        attribute: {
                            value: rawD.children[i]["name"],
                            selector: rawD.children[i]["attributeSelector"]
                        },
                        valueObj: rawD.children[i].values,
                        metrics: mMetrics
                    });
                }


                // Retrieve for each bar the value to which the bar should start and the actual value of the bar
                var borders = getBarBorders(dataS);

                // Get the max value of the metrics. It will be used to scale the Y coordinates.
                var maxVal = 0, maxDisplayed = 0;
                var maxs = getMaxValues(borders);
                maxVal = maxs[0];
                maxDisplayed = maxs[1];


                // Get the min value of the metrics. It will be used to scale the Y coordinates.
                var minVal = 0, minDisplayed = 0;
                var mins = getMinValues(borders);
                minVal = mins[0];
                minDisplayed =  mins[1];




                //(minVal>0 && startWith>0) ?

                //************* Adapt the view with the size of the Visualization

                // Get the Y coordinate of a metric value
                var toYCoordValuesScope = function (y) {
                    return (y) * ( height / (maxVal -minVal));
                };
                var toYCoordDisplayedScope = function (y) {
                    var adaptorRealDisplayValuesCoef = Math.abs( (maxDisplayed - minDisplayed) / (maxVal - minVal));
                    var adaptorDisplayValuesHeightCoef = Math.abs( (height - 0) / (maxDisplayed - minDisplayed));
                    return y* adaptorDisplayValuesHeightCoef;
                };


                var zeroYPos = 0;
                zeroYPos = height - (toYCoordValuesScope(Math.abs(minVal)));
                //zeroYPos = height - ( startWith>0 ? ( - toYCoordDisplayedScope(Math.abs(startWith) )): (toYCoordDisplayedScope(Math.abs(minVal))));
                var offsetLeft = true;
                // If there is too much bars to be displayed directly, adapt the width of the chart and make the chart scrollable
                if (countBars > max_number_bars_before_scrolling) {
                    container2.style("position", "relative");
                    offsetLeft = false;
                    this.domNode.lastChild.style.overflowX = "scroll";
                    this.domNode.lastChild.style.overflowY = "hidden";
                    total_width = total_width * (countBars / max_number_bars_before_scrolling);
                    width = total_width - margin.left - margin.right;
                }


                var xAttrWidth = width / dataS.length; // Get the width of a attributeName cycle
                var xBarWidth = xAttrWidth / metricsL.length; //Get the width of a bar

                //If the width of the window is shrinking too much
                if (xBarWidth < 25) {
                    xBarWidth = 25;
                    xAttrWidth = xBarWidth * metricsL.length;
                    this.domNode.lastChild.style.overflowX = "scroll";
                    this.domNode.lastChild.style.overflowY = "hidden";
                    width = xAttrWidth * dataS.length;
                }


                //************* Create the axis and the chart

                // Create the scale functions the chart
                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width]);
                x.domain(dataS.map(function (d) {
                    return d.attribute.value;
                }));


                var y = d3.scale.linear()
                    .range([height, 0]);
                y.domain([minDisplayed, maxDisplayed]); // Use to scale the metric values to the Y coordinates

                // Create the svg and axis if it is not existing already in the visualization

                var chart = d3.select(this.domNode.lastChild).select("svg");
                var xAxis, yAxis;
				yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left")
                        .tickFormat(d3.format(".2s"));
				if(chart.empty() || showYAxis){
					//Create Y axis
						ycontainer.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(" + 48 + "," + margin.top + ")")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(quantityName);
				}
                if (chart.empty()) {
                    chart = d3.select(this.domNode.lastChild).append("svg")
                        .attr("class", "waterfall")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .on("click", function (d) {
                            if (event.target.classList.contains('waterfall')) {
                                me.clearSelections();
                                me.endSelections();
                            } else {
                                return true;
                            }
                        })
                        .append("svg:g")
                        .attr("transform", "translate(" + (offsetLeft ? (yaxiswidth + 10) : 1) + "," + margin.top + ")"); // Adding 10 to yaxiswidth to account for margin.


                    //Create X axis representing the values of the attributeName
                    xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");


                    chart.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + ( height + 80 ) + ")")
                        .call(xAxis)
                        .selectAll("text")
                        .attr("y", 12)
                        .attr("x", 0);



                    //Do grey horizontal line for more readability
                    if (lineFlag) {
                        chart.insert("g", ".grid")
                            .attr("class", "grid horizontal")
                            .call(d3.svg.axis().scale(y)
                                .orient("left")
                                .tickSize(-(width), 0, 0)
                                .tickFormat("")
                            );
                    }


                    // Create X axis representing the different metricsL
                    var metricLabels = genMetricsLabel(metricsL);// Get metricsL' labels in proper format (cut string if too long)
                    var xAttr = d3.scale.ordinal()
                        .rangeRoundBands([0, xAttrWidth]);
                    xAttr.domain(metricLabels);
                    var xAttrAxis = d3.svg.axis()
                        .scale(xAttr)
                        .orient("bottom");


                    for (i = 0; i < dataS.length; i++) { // for each attributeName cycle, print the metric labels
                        var axisAttr = chart.append("g")
                            .attr("class", "x axis attributes continuous"); // display axis line with continuous mode to make the separation more clear
                        if (!metricOnly) {
                            axisAttr
                                .attr("transform", "translate(" + (xAttrWidth * i) + "," + (height + 1) + ")")
                                .call(xAttrAxis)
                                .selectAll("text")
                                .attr("y", 0)
                                .attr("dx", -2)
                                .attr("transform", "rotate(-55)")
                                .style("text-anchor", "end");
                        } else {
                            axisAttr
                                .attr("transform", "translate(" + (xAttrWidth * i ) + "," + (height + 1) + ")")
                                .call(xAttrAxis)
                                .selectAll("text")
                                .style("text-anchor", "middle");
                        }
                    }

                }
				

                //************* Draw the bars


                var bar = chart.selectAll(".barC")
                    .data(borders);


                //Adapt the format
                d3.selectAll("text").style("font", VIformat.font);
                d3.selectAll(".x.axis text").style("font-weight", "bold");
                d3.selectAll(".x.axis.attributes text").style("font", "12px arial");

                var newBar = bar.enter()
                    .append("g")
                    .attr("class", "barC")
                    .attr("transform", function (d, i) {
                        return "translate(" + 0 + "," + (-height * (i + 1)) + ")";
                    })
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", function (d, i) {
                        if (!continuous)
                            return xBarWidth * i;
                        else
                            return xBarWidth * i;
                    })
                    .attr("width", xBarWidth)
                    .attr("opacity", "0.3")
                    .attr("y", function (d, i) {
                        var v = 0;
                        if (d[3] > 0){
                            v = y(d[0] + d[1])
                        }
                        else{
                            v = y(d[2])//d[2]<d[0]?d[2]:d[0]
                        }
                        return v;
                    })

                    .attr("height", function (d, i) {
                        var heightValue = Math.abs(toYCoordDisplayedScope(d[3]));
                        //var readjustInitialMetricValue = i === 0 ? toYCoordDisplayedScope(Math.abs(startWith)): 0;
                        return ( heightValue ); //- readjustInitialMetricValue
                    })
                    .style("stroke-width", "1")
                    .on("click", function (d, i) {
                        // Use the selector API when clicking on a bar
                        var selection = dataS[Math.floor(i / metricsL.length)].attribute.selector;
                        if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.selectionDataJSONString) { //for mobile
                            selection.messageType = "selection";
                            window.webkit.messageHandlers.selectionDataJSONString.postMessage(selection);
                        } else {
                            me.applySelection(selection); //for web
                        }

                    })
                    .append("svg:title").attr("class", "tooltip")
                    .text(function (d, i) {
                        var tooltip = (metricOnly ? "": dataS[Math.floor(i / metricsL.length)].attribute.value + ", ")
                            + metricsL[i % metricsL.length]
                            + " : [" + Math.round(d[0]) + " ; " + Math.round(d[1] + d[0]) + "]  -> " + Math.round(d[1]);
                        return tooltip;
                    });
                
                // Set the bar colors
                bar.select(".bar")
                    .style("fill", function (d, i) {
                      return applyColor(d,i);
                })
                    .style("stroke", function (d, i) {
                        return applyColor(d, i);
                    });


                function applyColor(d, i) {
                    if (total && i % metricsL.length == (metricsL.length - 1))
                        return d3.rgb(colors.total);
                    var skipObj = i % metricsL.length;
                    var ind;
                    if (!continuous && skipObj != 0) {
                        var threshold = dataS[Math.floor(i / metricsL.length)].valueObj[skipObj - 1].threshold;
                        ind = skipObj - 1;
                    }
                    else {
                        ind = skipObj;
                        var threshold = dataS[Math.floor(i / metricsL.length)].valueObj[skipObj].threshold;
                    }
                    var metricColor = me.getProperty(me.dataInterface.getColHeaders().titles[0].es[ind].n.replace(/\s/g, ''));
                    if (typeof threshold !== "undefined") {
                        return threshold.fillColor;
                    }
                    else if (metricColor && metricColor.fillColor !== "transparent") {
                        return metricColor.fillColor;
                    }
                    else if (d[1] > 0) {
                        return d3.rgb(colors.positive);
                    }
                    else{
                        return d3.rgb(colors.negative);
                    }

                }

                numDecimal = numberFigureAfterComma( dataS[Math.floor(0)].valueObj[0].v);



				if(xBarWidth > 50){
					//clear old labels before plotting
					while(me.domNode && me.domNode.querySelector(".label")){
						bar.selectAll(".label").remove();
					}
                            
                    bar.append("text")
					.attr("class", "label")
					.attr("x", function(d, i){
                        return this.previousSibling.x.baseVal.value - 25 + this.previousSibling.width.baseVal.value/2 ; //to position the text at middle
                    })
                    .attr("y", function(d, i){
                        return d[1] > 0 ? this.previousSibling.y.baseVal.value : this.previousSibling.y.baseVal.value + this.previousSibling.height.baseVal.value ; //if the value is positive position the label at top otherwise at the bottom
                    })
                    .attr("dy", function (d, i) {
                        return d[1] > 0 ? "1.6em" : "-0.8em";
                    })
                    .text(
                        function(d, i){
                            if (total && i % metricsL.length == (metricsL.length - 1)) {
                                return parseFloat(dataS[Math.floor(i / metricsL.length)].metrics[metricsL.length - 1]).toFixed(numDecimal);
                            }

                            var skipObj = i % metricsL.length;
                            if (continuous || skipObj != 0) {
                                if (!continuous) {
                                    return dataS[Math.floor(i / metricsL.length)].valueObj[skipObj - 1].v;
                                }
                                else {
                                    return dataS[Math.floor(i / metricsL.length)].valueObj[skipObj].v;
                                }
                            }
                            else
                                return "";

                        }
                    );
				
					bar.selectAll(".label")
					.style("text-align", "center")
                    .style("fill", labelColor)
                    .style("font-size", labelFontSize)
					.style("font-style", isLabelItalic ? "italic" : "normal")
					.style("font-weight", isLabelBold ? "bold" : "normal")
					.style("text-decoration", function(){
						if(isLabelLT) 
							return "line-through";
						if(isLabelUL)
							return "underline";
						return "";
					});
					
					if(!showLabel)
						bar.selectAll(".label").remove();

				}
               
			   //to remove yaxis if opted by user
			   if(!showYAxis){
					ycontainer.selectAll("g").remove();	  
			   }

                bar.exit().remove();

                bar.transition()
                    .duration(transitionDuration)
                    .attr("transform", function (d) {
                        return "translate(" + 0 + "," + 0 + ")";
                    })
                    .each("end", function () {
                        d3.select(this).select(".bar").attr("opacity", "1").attr("fill-opacity", "0.7");
                    });


                //For the visualization to start at the bottom of the scroll
                this.domNode.scrollTop = height;

                //IE SVG refresh bug: re-insert SVG node to update/redraw contents.
                var svgNode = this.domNode.firstChild;
                this.domNode.insertBefore(svgNode, svgNode);

                
                // raise event for New Export Engine
                var me = this;
                setTimeout(function(){
                    me.raiseEvent({
                    name: 'renderFinished',
                    id: me.k
                });
                }, transitionDuration);
                

            }
        })
}());
//@ sourceURL=D3Waterfall.js