(function () {
    if (!mstrmojo.plugins.CircularTreeMap) {
        mstrmojo.plugins.CircularTreeMap = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    var me = null;
    var root = null;
    var text = null;
    var circle = null;

    // For Colors
    var outerRangeCircleColor = null;
    var defaultOuterRangeCircleColor = "#ff2f2f";
    var innerRangeCircleColor = null;
    var defaultInnerRangeCircleColor = "#ffffff";
    var textColor = null;
    var defaultTextColor = "#000000";
    var color = null;
    function createColorArray() {
        var colorChooser = d3.scaleLinear()
            .domain([0, root.height])
            .range([d3.rgb(outerRangeCircleColor), d3.rgb(innerRangeCircleColor)])
            .interpolate(d3.interpolateRgb);
        color = [];
        for (var depth = 0; depth <= root.height; depth++) {
            color.push(colorChooser(depth));
        }
    }

    var defaultColorByColors = ["#00000f", "#0000f0", "#000f00", "#00f000", "#0f0000", "#f00000", "#0000ff", "#000ff0", "#00ff00", "#0ff000", "#ff0000", "#000f0f", "#0f0f0f", "#00f0f0", "#f0f0f0", "#222222", "#444444", "#666666", "#888888", "#123456"];
    function assignColors() {
        console.log(root.children);
    }

    function setDefaultEditorProperties() {
        var defaultPropertyValues = {
            outerColorFillGroup: {
                fillColor: outerRangeCircleColor
            },
            innerColorFillGroup: {
                fillColor: innerRangeCircleColor
            },
            textColorFillGroup: {
                fillColor: textColor
            }
        };
        // Update color spectrum
        for (var depth = 0; depth <= root.height; depth++) {
            var colorDepthPropertyName = "colorDepth" + (depth + 1);
            defaultPropertyValues[colorDepthPropertyName] = {
                fillColor: color[depth+1]
            }
        }
        // Set the rest to transparent
        for (var depth = root.height; depth <= 5; depth++) {
            var colorDepthPropertyName = "colorDepth" + depth;
            defaultPropertyValues[colorDepthPropertyName] = {
                fillColor: "transparent"
            } 
        }
        me.setDefaultPropertyValues(defaultPropertyValues);
    }

    mstrmojo.plugins.CircularTreeMap.CircularTreeMap = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.CircularTreeMap.CircularTreeMap",
            cssClass: "circulartreemap",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{url: "//d3js.org/d3.v4.min.js"}],
            useRichTooltip: true,
            reuseDOMNode: false,
            supportNEE: true, // indicate the widget supports PDF exporting by New Export Engine

            setOuterColor: function (outerColor) {
                outerRangeCircleColor = outerColor["fillColor"];
                createColorArray();
                setDefaultEditorProperties();
                circle.style("fill", function (d) {
                    return color[d.depth];
                });
            },

            setInnerColor: function (innerColor) {
                innerRangeCircleColor = innerColor["fillColor"];
                createColorArray();
                setDefaultEditorProperties();
                circle.style("fill", function (d) {
                    return color[d.depth];
                });
            },

            setTextColor: function (textColorFill) {
                textColor = textColorFill["fillColor"];
                text.style("fill", function (d) {
                    return d3.rgb(textColor);
                });
            },

            updateColorByOption: function (colorOption) {

            },


            displayOuterCircle: function (displayOuterCircleObj) {
                circle.filter(function (d) {
                        return d.parent;
                    })
                    .style("display", (displayOuterCircleObj) ? "inline" : "none");
            },

            plot: function () {

                me = this; 

                // Dimensions of root level circle.
                var margin = 5;
                var width = parseInt(this.width, 10);
                var height = parseInt(this.height, 10);
                var diameter = Math.min(width, height) - (2 * margin);

                var topTextHeight = (width > 400) ? 50 : 30;
                diameter = diameter - topTextHeight;

                // For Top Labels
                var b = {
                    w: 75, h: ((width > 400) ? 50 : 30), s: 3, t: 10
                };
                var bws = []; // contains the length of polygon
                var VIformat = this.defn.fmts;
                var font = VIformat.ttl.font;
                var marginBreadCrumb = 10;
                var posStartLabel = function (i) {
                    if (i === 0)
                        return 0;
                    else {
                        return bws[i - 1] + posStartLabel(i - 1);
                    }
                };

                // Set Metrics and Atrributes names
                var metric = this.dataInterface.data.gsi.mx[0].n;
                var attributes = [];
                var rows = this.dataInterface.data.gsi.rows;
                for (var i  = 0; i < rows.length; i++) {
                    attributes.push(rows[i].n);
                }

                // Retrieving data from server.
                var json = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE);
                var rawData = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.TREE, {hasSelection: true});
                this.addUseAsFilterMenuItem();

                // Parsing data to format required by pack model.
                root = d3.hierarchy(json)
                    .sum(function (d) {
                        return d.value;
                    })
                    .sort(function (a, b) {
                        return b.value - a.value;
                    });

                // Getting initial properties from the editor
                var properties = me.getProperties();
                (properties["outerColorFillGroup"]) ? outerRangeCircleColor = properties["outerColorFillGroup"]["fillColor"] : outerRangeCircleColor = defaultOuterRangeCircleColor;
                (properties["innerColorFillGroup"]) ? innerRangeCircleColor = properties["innerColorFillGroup"]["fillColor"] : innerRangeCircleColor = defaultInnerRangeCircleColor;
                (properties["textColorFillGroup"]) ? textColor = properties["textColorFillGroup"]["fillColor"] : textColor = defaultTextColor;

                // Creating colors using properties
                createColorArray();
                assignColors();

                // Set initial default properties for the rest
                setDefaultEditorProperties();

                var topTextAreaSvg = d3.select(this.domNode).select("#topTextArea");
                var vizSvg = d3.select(this.domNode).select("#container");

                if (vizSvg.empty() || topTextAreaSvg.empty()) {
                    topTextAreaSvg = d3.select(this.domNode).append("svg")
                        .attr("width", width)
                        .attr("height", topTextHeight);

                    vizSvg = d3.select(this.domNode).append("svg")
                        .attr("class", "vizCanvas")
                        .attr("width", width)
                        .attr("height", height - topTextHeight)
                        .on("click", function (d) {
                            if (event.target.classList.contains('vizCanvas')) {
                                me.clearSelections();
                                me.endSelections();
                                return true;
                            } else {
                                return true;
                            }
                        });

                    var g = vizSvg.append("g")
                        .attr("id", "container")
                        .attr("transform", "translate(" + width / 2 + "," + diameter / 2 + ")");

                    var topTextArea = topTextAreaSvg.append("g")
                        .attr("id", "topTextArea");

                    var pack = d3.pack()
                        .size([diameter - margin, diameter - margin])
                        .padding(1);
                }

                createVisualization(root);

                // Main function to draw and set up the visualization, once we have the data.
                function createVisualization(root) {
                    var focus = root;
                    var nodes = pack(root).descendants();
                    var view;

                    var updatedFontSizeNodes = new Set();

                    var zoomInButton = topTextArea.append("polygon")
                        .attr("points", "15,5 20,5 20,15 30,15 30,20 20,20 20,30 15,30 15,20 5,20 5,15 15,15")
                        .attr("transform", "translate(" + (width - 65) + ",0)")
                        .style("fill", "black")
                        .on("mouseover", function () {
                            d3.select(this).style("fill", "grey");
                        })
                        .on("mouseout", function () {
                            d3.select(this).style("fill", "black");
                        })
                        .on("click", function () {
                            if (focus.children && focus.children[0].children) {
                                focus = focus.children[0];
                                zoom();
                                d3.event.stopPropagation();
                                updateCurrFocusTextFontSize();
                                updateTopText();
                            }
                        })
                        .append("svg:title").text("Zoom In");

                    var zoomOutButton = topTextArea.append("rect")
                        .attr("width", 20)
                        .attr("height", 5)
                        .attr("transform", "translate(" + (width - 30) + "," + 15 + ")")
                        .style("fill", "black")
                        .on("mouseover", function () {
                            d3.select(this).style("fill", "grey");
                        })
                        .on("mouseout", function () {
                            d3.select(this).style("fill", "black");
                        })
                        .on("click", function () {
                            if (focus.parent) {
                                focus = focus.parent;
                                zoom();
                                d3.event.stopPropagation();
                                updateCurrFocusTextFontSize();
                                updateTopText();
                            }
                        })
                        .append("svg:title").text("Zoom Out");

                    vizSvg.on("click", function () {
                        focus = root;
                        zoom();
                        d3.event.stopPropagation();
                        updateCurrFocusTextFontSize();
                        updateTopText();
                    });

                    circle = g.selectAll("circle")
                        .data(nodes)
                        .enter()
                        .append("circle");

                    circle.attr("class", function (d) {
                            return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
                        })
                        .style("fill", function (d) {
                            return color[d.depth];
                        })
                        .on("click", function (d) {
                            if (!((focus === d) || (!d.children && focus === d.parent))) {
                                focus = (d.children) ? d : d.parent;
                                zoom();
                                d3.event.stopPropagation();
                                updateCurrFocusTextFontSize();
                                updateTopText(focus);
                            }
                            var selection = getSelectionNode(d);
                            if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.selectionDataJSONString) { //for mobile
                                selection.messageType = "selection";
                                window.webkit.messageHandlers.selectionDataJSONString.postMessage(selection);
                            } else {
                                me.applySelection(selection); //for web
                            }
                        })
                        .on("mouseover", function (d) {
                            updateTopText(d);
                        })
                        .on("mouseout", function () {
                            updateTopText(focus);
                        });

                    // Tooltip
                    circle.append("svg:title")
                        .text(function (d) {
                            if (!d.parent) {
                                return "";
                            }
                            // TODO: Inspect why escape characters are ignored when useRichTooltip is true.
                            // return getCompleteTitlePath(d, "") + 
                            //     metric + ": " + getNodeValue(d) + "\n" + 
                            //     ((d.parent != root) ? ((getNodeValue(d) * 100 / getNodeValue(d.parent)).toFixed(5) + "% of " + d.parent.data.name + "\n") : "") + 
                            //     "Overall Percent: " + (getNodeValue(d) * 100 / getNodeValue(root)).toFixed(5) + "%";
                            return metric + ": " + getNodeValue(d);
                        });

                    text = g.selectAll("text")
                        .data(nodes)
                        .enter().append("text")
                        .attr("class", "label")
                        .text(function (d) {
                            return d.data.name;
                        })
                        .style("fill-opacity", function (d) {
                            return d.parent === root ? 1 : 0;
                        })
                        .style("display", function (d) {
                            return d.parent === root ? "inline" : "none";
                        })
                        .style("fill", function (d) {
                            return d3.rgb(textColor);
                        });

                    updateCurrFocusTextFontSize();

                    var node = g.selectAll("circle,text");

                    zoomTo([root.x, root.y, root.r * 2]);

                    function zoom() {
                        var transition = d3.transition()
                            .duration(d3.event.altKey ? 7500 : 1000)
                            .tween("zoom", function (d) {
                                var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                                return function (t) {
                                    zoomTo(i(t));
                                };
                            });
                        transition.selectAll("text")
                            .filter(function (d) {
                                return (d3.select(this).attr("class") === "label") && (d.parent === focus || this.style.display === "inline");
                            })
                            .style("fill-opacity", function (d) {
                                return d.parent === focus ? 1 : 0;
                            })
                            .on("start", function (d) {
                                if (d.parent === focus) this.style.display = "inline";
                            })
                            .on("end", function (d) {
                                if (d.parent !== focus) this.style.display = "none";
                            });
                    }

                    function zoomTo(v) {
                        var k = diameter / v[2];
                        view = v;
                        circle.attr("r", function (d) {
                            return d.r * k;
                        });
                        node.attr("transform", function (d) {
                            return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
                        });
                    }

                    /* Helper/Utility Functions */

                    // Single Selector
                    function getSelectionNode(d) {
                        var selectionNode = rawData;
                        if (d.depth === 0) {
                            me.clearSelections();
                            me.endSelections();
                            return selectionNode;
                        }
                        var ancestry = getAncestry(d);
                        for (var i = 0; i < ancestry.length; i++) {
                            for (var j = 0; j < selectionNode.children.length; j++) {
                                if (selectionNode.children[j].name === ancestry[i]) {                                    
                                    selectionNode = selectionNode.children[j];
                                    break;
                                }
                            }
                        }
                        return selectionNode.attributeSelector;
                    }

                    // Multiple Selectors
                    // function getSelectionNode(d) {
                    //     var selectionNode = rawData;
                    //     if (d.depth === 0) {
                    //         me.clearSelections();
                    //         me.endSelections();
                    //         return selectionNode;
                    //     }
                    //     var selectionNodes = []
                    //     var ancestry = getAncestry(d);
                    //     for (var i = 0; i < ancestry.length; i++) {
                    //         for (var j = 0; j < selectionNode.children.length; j++) {
                    //             if (selectionNode.children[j].name === ancestry[i]) {                                    
                    //                 selectionNode = selectionNode.children[j];
                    //                 selectionNodes.push(selectionNode.attributeSelector);
                    //                 break;
                    //             }
                    //         }
                    //     }
                    //     console.log(selectionNodes);
                    //     return selectionNodes;
                    // }

                    // Given a node d, return the total value of the node
                    function getNodeValue(d) {
                        if (d.children) {
                            var sum = 0;
                            for (var i = 0; i < d.children.length; i++) {
                                sum += getNodeValue(d.children[i]);
                            }
                            return sum;
                        }
                        else {
                            return d.data.value;
                        }
                    };

                    // Given a text node d and the available width, return the font size (scales font size for inner nodes to work with zoom)
                    function getFontSize(d, labelWidth) {
                        var fontSize = ((2 * d.r) / labelWidth) * 0.8;
                        // Scale for inner nodes
                        if (d != root && d.parent != root) {
                            fontSize = fontSize * diameter / (d.parent.r * 2);
                        }
                        if (fontSize < 0.1) {
                            return 0;
                        }
                        return fontSize;
                    }

                    // Returns px for a certain element (context)
                    function getElementFontSize(context) {
                        return parseFloat(getComputedStyle(context).fontSize);
                    }

                    // Converts em into px
                    function convertEmToPx(value, context) {
                        return value * getElementFontSize(context);
                    }

                    // Update text font size for the current level aka focus
                    function updateCurrFocusTextFontSize() {
                        if (!updatedFontSizeNodes.has(focus)) {
                            updatedFontSizeNodes.add(focus);
                            text.filter(function (d) {
                                    return (d.parent === focus);
                                })
                                .style("display", "inline")
                                .style("font-size", function (d) {
                                    var fontSize = getFontSize(d, this.getComputedTextLength());
                                    // Only render text with font size > 8px
                                    if (convertEmToPx(fontSize, this) < 8) {
                                        return "0em"
                                    } else {
                                        return fontSize + "em";
                                    }
                                })
                                // Fix position of text
                                .attr("dy", function (d) {
                                    return (parseFloat(window.getComputedStyle(d3.select(this).node()).fontSize, 10)/3);
                                });
                        }
                    }

                    // Returns the list of ancestors of a node d (root node is not included in the ancestry list)
                    function getAncestry(d) {
                        var ancestry = [];
                        while (d && d.parent) {
                            ancestry.push(d.data.name);
                            d = d.parent;
                        }
                        return ancestry.reverse();
                    }

                    // Generate a string that describes the points of a breadcrumb polygon.
                    function breadcrumbPoints(d, i) {
                        var points = [];
                        //Adapt the width of the label polygon with the size of the  label string
                        var labelN = d;
                        function getTextWidth(text, ft) {
                            // re-use canvas object for better performance
                            var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
                            var context = canvas.getContext("2d");
                            context.font = ft;
                            var metrics = context.measureText(text);
                            return metrics.width;
                        };
                        var wl = getTextWidth(labelN, font);
                        b.w = wl + marginBreadCrumb * 2 + b.t;
                        bws[i] = b.w;
                        points.push("0,0");
                        points.push(b.w + ",0");
                        points.push(b.w + b.t + "," + (b.h / 2));
                        points.push(b.w + "," + b.h);
                        points.push("0," + b.h);
                        if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
                            points.push(b.t + "," + (b.h / 2));
                        }
                        return points.join(" ");
                    }

                    // Updates the top text based on a given node d
                    function updateTopText(d) {
                        var ancestry = getAncestry(d);
                        var trail = topTextArea.selectAll("g")
                            .data(ancestry, function (d) {
                                return d + ancestry.indexOf(d);
                            });
                        var entering = trail.enter().append("g");
                        entering.append("polygon")
                            .attr("points", breadcrumbPoints)
                            .style("fill", function (d, i) {
                                // +1 since there is no label for the root
                                return color[i+1];
                            });
                        entering.append("text")
                            .attr("class", "info")
                            .attr("x", function (d, i) {
                                return b.t + marginBreadCrumb;
                            })
                            .attr("y", b.h / 2)
                            .attr("dy", "0.35em")
                            .attr("text-anchor", "left")
                            .text(function (d) {
                                return d;
                            })
                            .style("fill", function (d) {
                                // +1 since there is no label for the root
                                return d3.rgb(textColor);
                            });
                        // Set position for entering and updating nodes.
                        entering.attr("transform", function (d, i) {
                            return "translate(" + posStartLabel(i) + ",0)";
                        });
                        trail.exit().remove();
                    }

                    // Used to get information for the tooltip
                    function getCompleteTitlePath(d, s) {
                        if (!d.parent) {
                            return s;
                        }
                        else {
                            s = attributes[d.depth-1] + ": " + d.data.name + "\n" + s;
                            return getCompleteTitlePath(d.parent, s);
                        }
                    }

                };
            }
        })
}());