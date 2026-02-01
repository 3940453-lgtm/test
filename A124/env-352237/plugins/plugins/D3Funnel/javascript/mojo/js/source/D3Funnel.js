(function () {
    if (!mstrmojo.plugins.D3Funnel) {
        mstrmojo.plugins.D3Funnel = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    mstrmojo.plugins.D3Funnel.D3Funnel = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {

            scriptClass: "mstrmojo.plugins.D3Funnel.D3Funnel",
            cssClass: "d3funnel",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{url: "//d3js.org/d3.v3.min.js"}],
            useRichTooltip: true,
            reuseDOMNode: false,
            supportNEE: true, // indicate the widget supports PDF exporting by New Export Engine


            isTrue: function (attr) {
                return attr === "true" || attr === true;
            },

            //Helper method that helps to update font styles like bold, italic, underline, linethrough
            applyFontStyle: function (attrName, attr, isTrue, domObject) {
                domObject.style(attrName, this.isTrue(attr) ? isTrue : "");
            },

            //Helper method that helps to update label styles in the charactorGroup
            applyCharGroup: function (domText, labelStyle) {

                if (labelStyle.fontSize)
                    domText.style("font-size", labelStyle.fontSize);

                if (labelStyle.fontFamily)
                    domText.style("font-family", labelStyle.fontFamily);

                if (labelStyle.fontColor)
                    domText.style("fill", labelStyle.fontColor);

                //update font weight
                if (labelStyle.fontWeight !== null) {
                    this.applyFontStyle("font-weight", labelStyle.fontWeight, "bold", domText);
                }


                //update font italic
                if (labelStyle.fontItalic !== null) {
                    this.applyFontStyle("font-style", labelStyle.fontItalic, "italic", domText);
                }

                //update font underline
                if (labelStyle.fontUnderline !== null && labelStyle.fontLineThrough !== null) {
                    var ul = labelStyle.fontUnderline;
                    var lt = labelStyle.fontLineThrough;
                    if (this.isTrue(ul) && this.isTrue(lt)) {
                        this.applyFontStyle("text-decoration", true, "underline line-through", domText);
                    } else if (this.isTrue(ul)) {
                        this.applyFontStyle("text-decoration", true, "underline", domText);
                    } else if (this.isTrue(lt)) {
                        this.applyFontStyle("text-decoration", true, "line-through", domText);
                    } else {
                        this.applyFontStyle("text-decoration", false, "normal", domText);
                    }
                } else if (labelStyle.fontUnderline !== null) {
                    this.applyFontStyle("text-decoration", labelStyle.fontUnderline, "underline", domText);
                } else if (labelStyle.fontLineThrough !== null) {
                    this.applyFontStyle("text-decoration", labelStyle.fontLineThrough, "line-through", domText);
                } else {
                    this.applyFontStyle("text-decoration", false, "normal", domText);
                }

            },

            //Method that updates the font style of the labels, called in the Custom Properties Model Editor when a label font style is changed
            updateLabelStyle: function (labelStyle) {

                if (labelStyle === null)return;
                var dom = this.domNode;
                var domText = d3.select(dom).selectAll("text");

                //apply font style
                this.applyCharGroup(domText, labelStyle);

            }
            ,
            //Method that update the labels format, called in the Custom Properties Model Editor when a label format is changed
            updateLabelFormat: function (rawD, labels) {

                var dom = this.domNode;

                function updateLabel(element, i, j, numRow) {
                    var label = " ";

                    if (labels.text === "true") {
                        label += element.name;
                        if (labels.values === "true") {
                            label += ": ";
                        }
                    }

                    if (labels.values === "true") {

                        label += element.formattedValue;

                    }


                    d3.select(dom).selectAll("text")[0][i * numRow + j].textContent = label;
                }

                var numRow = rawD.children.length;// Number of row in a funnel
                rawD.children.forEach(function (child, i) {
                    if (child.children) {
                        numRow = child.children.length;
                        child.children.forEach(function (child2, j) {
                            updateLabel(child2, i, j, numRow);
                        });
                    } else {
                        updateLabel(child, 0, i, numRow);
                    }

                });

            }
            ,
            plot: function () {

                var me = this;

                var dom = me.domNode;

                if (typeof me.addUseAsFilterMenuItem === 'function') {
                    me.addUseAsFilterMenuItem();
                }

                var is10point2 = true;
                if (typeof me.addThresholdMenuItem === 'function') {
                    //Add "Thresholds" in the menu that get when you right click on a metric
                    me.addThresholdMenuItem();
                    //Define the default values for the custom properties
                    me.setDefaultPropertyValues({
                        labels: {
                            text: 'true',
                            values: 'false',
                        },
                        labelStyle: {
                            fontSize: 14,
                            fontFamily: "Arial",
                            fontColor: "white",
                            fontStyle: {
                                fontWeight: false,
                                fontItalic: false,
                                fontUnderline: false,
                                fontLineThrough: false
                            }
                        }
                    });
                    is10point2 = false;
                }

                //Make sure that the plugin works with 10.2
                var defaultLabelSize = 14;
                var dataConfig = {};
                dataConfig.hasSelection = true;
                if (!is10point2)
                    dataConfig.hasThreshold = true;


                // Get the selected ()
                var rawD = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ADV, dataConfig);
                // var data = [];

                var VIformat = this.defn.fmts;

                var DEFAULT_HEIGHT = 400,
                    DEFAULT_WIDTH = 600,
                    DEFAULT_BOTTOM_PERCENT = 1 / 3,
                    DEFAULT_INDEX = -1;

                var FunnelChart = function (options) {
                    /* Parameters:
                     data:
                     Array containing arrays of categories and engagement in order from greatest expected funnel engagement to lowest.
                     I.e. Button loads -> Short link hits
                     Ex: [['Button Loads', 1500], ['Button Clicks', 300], ['Subscribers', 150], ['Shortlink Hits', 100]]
                     width & height:
                     Optional parameters for width & height of chart in pixels, otherwise default width/height are used
                     bottomPct:
                     Optional parameter that specifies the percent of the total width the bottom of the trapezoid is
                     This is used to calculate the slope, so the chart's view can be changed by changing this value
                     */

                    this.data = options.data;
                    this.totalEngagement = 0;
                    for (var i = 0; i < this.data.length; i++) {
                        this.totalEngagement += this.data[i][1];
                    }
                    this.width = typeof options.width !== 'undefined' ? options.width : DEFAULT_WIDTH;
                    this.height = typeof options.height !== 'undefined' ? options.height : DEFAULT_HEIGHT;
                    var bottomPct = typeof options.bottomPct !== 'undefined' ? options.bottomPct : DEFAULT_BOTTOM_PERCENT;
                    this._slope = 2 * this.height / (this.width - bottomPct * this.width);
                    this._totalArea = (this.width + bottomPct * this.width) * this.height / 2;
                    this.index = typeof options.index !== 'undefined' ? options.index : DEFAULT_INDEX;
                };

                FunnelChart.prototype._getLabel = function (ind) {
                    /* Get label of a category at index 'ind' in this.data */
                    return this.data[ind][0];
                };

                FunnelChart.prototype._getEngagementCount = function (ind) {
                    /* Get engagement value of a category at index 'ind' in this.data */
                    return this.data[ind][2];
                };

                FunnelChart.prototype._createPaths = function () {
                    /* Returns an array of points that can be passed into d3.svg.line to create a path for the funnel */
                    trapezoids = [];

                    function findNextPoints(chart, prevLeftX, prevRightX, prevHeight, dataInd) {
                        // reached end of funnel
                        if (dataInd >= chart.data.length) return;

                        // math to calculate coordinates of the next base
                        area = chart.data[dataInd][1] * chart._totalArea / chart.totalEngagement;
                        prevBaseLength = prevRightX - prevLeftX;
                        nextBaseLength = Math.sqrt((chart._slope * prevBaseLength * prevBaseLength - 4 * area) / chart._slope);
                        nextLeftX = (prevBaseLength - nextBaseLength) / 2 + prevLeftX;
                        nextRightX = prevRightX - (prevBaseLength - nextBaseLength) / 2;
                        nextHeight = chart._slope * (prevBaseLength - nextBaseLength) / 2 + prevHeight;

                        points = [
                            [nextRightX, nextHeight]
                        ];
                        points.push([prevRightX, prevHeight]);
                        points.push([prevLeftX, prevHeight]);
                        points.push([nextLeftX, nextHeight]);
                        points.push([nextRightX, nextHeight]);
                        trapezoids.push(points);

                        findNextPoints(chart, nextLeftX, nextRightX, nextHeight, dataInd + 1);
                    }

                    findNextPoints(this, 0, this.width, 0, 0);
                    return trapezoids;
                };

                FunnelChart.prototype.draw = function (elem, speed) {
                    var DEFAULT_SPEED = 50;
                    speed = typeof speed !== 'undefined' ? speed : DEFAULT_SPEED;

                    var funnelSvg = d3.select(dom).select(elem).append('svg:svg')
                        .attr('class', 'funnel')
                        .attr('width', this.width)
                        .attr('height', this.height).on("click", function (d) {
                            if (event.target.classList.contains('funnel')) {
                                me.clearSelections();
                                me.endSelections();
                                return true;
                            } else {
                                return true;
                            }
                        })
                        .append('svg:g');


                    // Creates the correct d3 line for the funnel
                    var funnelPath = d3.svg.line()
                        .x(function (d) {
                            return d[0];
                        })
                        .y(function (d) {
                            return d[1];
                        });

                    // Automatically generates colors for each trapezoid in funnel

                    var paths = this._createPaths();

                    var colorScale = d3.scale.category10();

                    var rawData = me.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ADV, dataConfig);

                    var thisChart = this;


                    function drawTrapezoids(funnel, i) {


                        var getFillColor = function () {
                            if (!is10point2) {
                                if (funnel.index >= 0) {
                                    if (rawData.children[funnel.index].children[i].values[0].threshold) {
                                        return rawData.children[funnel.index].children[i].values[0].threshold.fillColor;
                                    }
                                    else {
                                        return colorScale(i);
                                    }

                                }
                                else {
                                    if (rawData.children[i].values[0].threshold) {
                                        return rawData.children[i].values[0].threshold.fillColor;
                                    }
                                    else {
                                        return colorScale(i);
                                    }
                                }
                            }
                            else {
                                return colorScale(i);
                            }
                        };


                        var trapezoid = funnelSvg
                            .append('svg:path')
                            .attr('class', 'trapezoid')
                            .attr('d', function (d) {
                                return funnelPath(
                                    [paths[i][0], paths[i][1], paths[i][2],
                                        paths[i][2], paths[i][1], paths[i][2]
                                    ]);
                            })
                            .attr('fill', function (d, i) {
                                    return getFillColor();
                                }
                            )
                            .on("click", function (d) {
                                // Use the selector API when clicking on a bar;
                                var selection;
                                if (funnel.index >= 0)
                                    selection = rawData.children[funnel.index].children[i].attributeSelector;
                                else
                                    selection = rawData.children[i].attributeSelector;

                                if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.selectionDataJSONString) { //for mobile
                                    selection.messageType = "selection";
                                    window.webkit.messageHandlers.selectionDataJSONString.postMessage(selection);
                                } else {
                                    me.applySelection(selection); //for web
                                }

                            });
                        nextHeight = paths[i][
                        [paths[i].length] - 1
                            ];

                        var totalLength = trapezoid.node().getTotalLength();

                        var transition;
                        if (window.mstrApp && window.mstrApp.isExporting) {
                            // For New Export Engine: If open in NewEE, using '0' duration to disable animation
                            transition = trapezoid
                                .attr("d", function (d) {
                                    return funnelPath(paths[i]);
                                })
                                .attr("fill", function (d) {
                                    return getFillColor();
                                })
                                .attr("stroke-width", "1")
                                .attr("stroke", function (d, i) {
                                    return getFillColor();
                                })
                                .attr("opacity", "1").attr("fill-opacity", "0.70");
                        } else {
                            transition = trapezoid
                                .transition()
                                .duration(totalLength / speed)
                                .ease("linear")
                                .attr("d", function (d) {
                                    return funnelPath(paths[i]);
                                })
                                .attr("fill", function (d) {
                                    return getFillColor();
                                })
                                .attr("stroke-width", "1")
                                .attr("stroke", function (d, i) {
                                    return getFillColor();
                                })
                                .attr("opacity", "1").attr("fill-opacity", "0.70");
                        }

                        var label = "";

                        //This makes sure that the saved dashboard with modified custom properties are reflected on the dashboard
                        if (!is10point2) {


                            var labels = me.getProperty("labels");
                            if (labels && labels.text === "true") {
                                label += funnel._getLabel(i);
                                if (labels.values === "true") {
                                    label += ": "
                                }
                            }

                            if (labels && labels.values === "true") {
                                label += funnel._getEngagementCount(i);
                            }


                        } else {
                            label += funnel._getLabel(i) + ": " + funnel._getEngagementCount(i);
                        }

                        funnelSvg
                            .append('svg:text')
                            .text(label)
                            .attr("x", function (d) {
                                return funnel.width / 2;
                            })
                            .attr("y", function (d) {
                                return (paths[i][0][1] + paths[i][1][1]) / 2;
                            }) // Average height of bases
                            .attr("text-anchor", "middle")
                            .attr("dominant-baseline", "middle")
                            .attr("fill", "#fff")
                            .style("font", VIformat.font)
                            .style("display", function (d) {
                                return (paths[i][0][1] - paths[i][1][1]) < parseFloat(d3.select(this).style('font-size')) ? 'none' : 'inline';
                            });

                        trapezoid
                            .append('svg:title')
                            .text(label);

                        if (window.mstrApp && window.mstrApp.isExporting) {
                            if (i + 1 < paths.length) {
                                drawTrapezoids(funnel, i + 1);
                            } else if (!(thisChart.index >= 0) || thisChart.index >= rawD.children.length - 1) {
                                // raise event for New Export Engine
                                setTimeout(function() {
                                    me.raiseEvent({
                                        name: 'renderFinished',
                                        id: me.k
                                    });
                                }, 0);
                            }
                        } else {
                            transition.each('end', function () {
                                if (i + 1 < paths.length) {
                                    drawTrapezoids(funnel, i + 1);
                                }
                            });
                        }

                        //This makes sure that the saved dashboard with modified custom properties are reflected on the dashboard
                        if (!is10point2) {
                            //Get the label styles from the charactorGroup
                            var labelStyle = me.getProperty("labelStyle");
                            var dom = me.domNode;
                            var domText = d3.select(dom).selectAll("text");
                            me.applyCharGroup(domText, labelStyle);
                        }

                    }

                    drawTrapezoids(this, 0);
                };


                var total_width = parseInt(this.width, 10);
                var total_height = parseInt(this.height, 10);
                var margin = {
                        top: 40,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },
                    width = parseInt(this.width, 10) - margin.left - margin.right,
                    height = parseInt(this.height, 10) - margin.top - margin.bottom;
                var fWidth = width * 0.5,
                    fHeight = height * 0.8;
                /*var    fWidth= 0.5*width,
                 fHeight= 0.8*0.5*width>height*0.8? 0.8*width:height*0.8,
                 minSide = Math.min(width, height);*/

                var MIN_WIDTH = 400;
                var MIN_HEIGHT = 400;
                var partText = 0.90;

                var svg = d3.select(dom).select("svg");
                if (svg.empty()) {
                    var frame = d3.select(dom).append("div")
                        .attr("class", "outer")
                        .append("div")
                        .attr("class", "middle")
                        .append("div")
                        .attr("class", "inner");


                    if (this.dataInterface.getRowHeaders().titles.length === 1) {
                        frame.append("div")
                            .attr("id", "funnelContainer");
                        var data = [];
                        d3.select(dom).select(".inner").style("display", "inline");

                        for (var i = 0; i < rawD.children.length; i++) {
                            data[i] = [rawD.children[i].name, Math.round(rawD.children[i].value), rawD.children[i].formattedValue];
                        }
                        var w = fWidth;
                        if (w < MIN_WIDTH) {
                            w = MIN_WIDTH;
                            dom.style.overflow = "scroll";
                        }

                        var h = fHeight;
                        if (h < MIN_HEIGHT) {
                            h = MIN_HEIGHT;
                            dom.style.overflow = "scroll";
                        }

                        var chart = new FunnelChart({
                            data: data,
                            width: w,
                            height: h,
                            bottomPct: 0.4
                        });
                        chart.draw('#funnelContainer', 1000);

                    } else if (this.dataInterface.getRowHeaders().titles.length === 2) {
                        for (var j = 0; j < rawD.children.length; j++) {
                            var data = [];


                            var funnel = frame.append("div")
                                .attr("class", "funnel")
                                .attr("id", "funnelContainer" + j); //.style("float", "left")

                            funnel.append("h1").html(rawD.children[j].name).attr("class", "title");

                            for (var i = 0; i < rawD.children[j].children.length; i++) {
                                data[i] = [rawD.children[j].children[i].name, Math.round(rawD.children[j].children[i].value), rawD.children[j].children[i].formattedValue];
                            }
                            var w = fWidth / 2;


                            if (w < MIN_WIDTH) {
                                w = MIN_WIDTH;
                            }
                            var widthfunnelcontainer = parseInt(d3.select(dom).select(".funnel").style("width"), 10) + parseInt(d3.select(dom).select(".funnel").style("padding-left"), 10) + parseInt(d3.select(dom).select(".funnel").style("padding-right"), 10);
                            var w_allfunnels = widthfunnelcontainer * rawD.children.length;
                            if (w_allfunnels >= width)
                                this.domNode.style.overflow = "scroll";

                            var h = fHeight;
                            if (h < MIN_HEIGHT) h = MIN_HEIGHT;
                            var chart = new FunnelChart({
                                data: data,
                                width: w,
                                height: h,
                                bottomPct: 0.4,
                                index: j
                            });
                            chart.draw('#funnelContainer' + j, 1000);
                        }
                    } else {
                        if (window.mstrApp && window.mstrApp.isExporting) {
                            // raise event for New Export Engine to avoid timeout for this special case that doesn't render anything
                            setTimeout(function() {
                                me.raiseEvent({
                                    name: 'renderFinished',
                                    id: me.k
                                });
                            }, 0);
                        }
                    }

                }
            }
        })
}());
//@ sourceURL=D3Funnel.js