(function () {
    if (!mstrmojo.plugins.D3BubbleChartNew) {
        mstrmojo.plugins.D3BubbleChartNew = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface",
        "mstrmojo.array",
        "mstrmojo.customviz.GraphicModel",
        "mstrmojo.customviz.CustomVisEnums"
    );

    var $CUSTOM_CONTEXT_MENU = mstrmojo.CUSTOM_CONTEXT_MENU,
        $FORMAT_CONTROL_TYPE = mstrmojo.FormatControlHelper.FORMAT_CONTROL_TYPE,
        $DEFAULT_CONTEXT_MENU = mstrmojo.DEFAULT_CONTEXT_MENU,
        $ARR = mstrmojo.array,
        GraphicModel = mstrmojo.customviz.GraphicModel,
        $CustomVisEnums = mstrmojo.customviz.CustomVisEnums,
        $ENUM_LEGEND_PROPS = $CustomVisEnums.ENUM_LEGEND_PROPS,
        $PT = mstrmojo.customviz.PICKED_TYPE,
        $PC = mstrmojo.customviz.PICKED_CRITERIA;

    function handleMousemove(graphicModel, evt, vis) {
        var pos = {
            x: evt.clientX,
            y: evt.clientY
        };
        if (graphicModel) {
            vis.showTooltip(graphicModel, pos);
        } else {
            vis.hideTooltip(false);
        }
    }

    mstrmojo.plugins.D3BubbleChartNew.D3BubbleChartNew = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null, {
            scriptClass: "mstrmojo.plugins.D3BubbleChartNew.D3BubbleChartNew",

            cssClass: "d3bubblechartNew",

            errorDetails: "This visualization requires one or more attributes and one metric.",

            externalLibraries: [{
                url: "//d3js.org/d3.v3.min.js"
            }],

            reuseDOMNode: false,

            enableLegend: true,

            init: function (props) {
                this._super(props);

                var defaultProps = {
                        showMetricValue: 'false',
                        dataLabel: '0'
                    },
                    legendProps;
                legendProps = defaultProps[$CustomVisEnums.LEGEND_PROPERTY_SET] = {};
                legendProps[$ENUM_LEGEND_PROPS.LEGEND_FONT_ITALIC] = true;

                this.setDefaultPropertyValues(defaultProps);
            },

            plot: function () {
                console.log('Plot START');

                this.addUseAsFilterMenuItem();

                var containerSize = this.getCanvasContainerSize();

                var viz = this,
                    width = containerSize.width,
                    height = containerSize.height,
                    diameter = Math.min(width, height),
                    color = d3.scale.category20c(),
                    transitionDuration = 750,
                    getFillColor = function (graphicModel) {
                        var colorInfo = graphicModel.getCustomProperty("colorInfo"),
                            threshold = graphicModel.getCustomProperty("threshold"),
                            packageName = graphicModel.getCustomProperty("packageName");

                        if (colorInfo && colorInfo.length > 0) {
                            return viz.getColorBy(colorInfo);

                        } else if(threshold && threshold.fillColor) {
                            return threshold.fillColor;
                        } else {
                            var key = packageName;
                            this.colorMap = this.colorMap || {};

                            return (this.colorMap[key] = this.colorMap[key] || color(key));
                        }

                    };

                var bubble = d3.layout.pack()
                    .sort(null)
                    .size([diameter, diameter])
                    .padding(1.5);

                var data = this.getGraphicModels();

                var svg = d3.select(this.canvasContainer).select("svg");

                if (svg.empty()) {
                    svg = d3.select(this.canvasContainer).append("svg")
                        .attr("class", "bubble");
                }

                svg.attr("width", width)
                    .attr("height", height);

                var g = svg.select("g");

                if (g.empty()) {
                    g = svg.append("g");
                }

                g.attr("transform", "translate(" + (width - diameter) / 2 + "," + (height - diameter) / 2 + ")");

                var node = g.selectAll(".node")
                    .data(bubble.nodes(data)
                        .filter(function (d) {
                            return !d.children;
                        }));

                var newNode = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {
                        return "translate(" + width / 2 + "," + height / 2 + ")";
                    })
                    .style("opacity", 0);


                node.exit().remove();

                node.transition()
                    .duration(transitionDuration)
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    })
                    .style("opacity", 1);

                //newNode.append("title");
                //The bigger circle to show selection
                newNode.append("circle")
                    .attr("class", "outer");

                //The smaller circle to show context menu selection
                newNode.append("circle")
                    .attr("class", "inner");

                newNode.append("text");

                // node.select("title")
                //     .text(function (graphicModel) {
                //         var //graphicModel = d.graphicModel,
                //             packageName = graphicModel.getCustomProperty("packageName"),
                //             className = graphicModel.getCustomProperty("className"),
                //             formattedValue = graphicModel.getCustomProperty("formattedValue");
                //         return packageName + ", " + className + ": " + formattedValue;
                //     });

                node.select(".outer")
                    .attr("r", function (d) {
                        return d.r;
                    })
                    .style("fill", function (d) {
                        return getFillColor(d);
                    });

                node.select(".inner")
                    .attr("r", function (d) {
                        return d.r >= 2 ? d.r - 2 : 0;
                    })
                    .style("fill", function (d) {
                        return getFillColor(d);
                    });

                var showMetricValue = this.getProperty('showMetricValue'),
                    dataLabel = this.getProperty('dataLabel');

                node.select("text")
                    .attr("dy", ".3em")
                    .style("text-anchor", "middle")
                    .text(function (graphicModel) {
                        var text,
                            packageName = graphicModel.getCustomProperty("packageName"),
                            className = graphicModel.getCustomProperty("className"),
                            value = graphicModel.getCustomProperty("value");
                        switch (dataLabel) {
                            case '0':
                                text = className;
                                break;
                            case '1':
                                text = packageName;
                                break;
                            case '2':
                                text = packageName + ' ' + className;
                                break;
                        }

                        if (showMetricValue === 'true') {
                            text += ': ' + value;
                        }
                        return text.substring(0, graphicModel.r / 3);
                    });

                //Link the graphic to the graphic model.
                d3.select(this.domNode).selectAll(".node")
                    .attr("unique-id", function(graphicModel) {
                        graphicModel.setGraphicCenter(graphicModel.x + graphicModel.r / 2 + (width - diameter) / 2, graphicModel.y + graphicModel.r / 2 + (height - diameter) / 2);
                        graphicModel.setCustomProperties({graphic: this});
                        return graphicModel.getId();
                    });

                //IE SVG refresh bug: re-insert SVG node to update/redraw contents.
                var svgNode = this.canvasContainer.firstChild;
                this.canvasContainer.insertBefore(svgNode, svgNode);

                this.updateHighlight();//?when rebuilding, before plot, initialHighlight is called, so maybe no use.
                console.log('Plot END - ' + new Date());
            },

            createGraphicModels: function createGraphicModels() {
                var viz = this,
                    dropZoneModel = this.zonesModel,
                    colObjects,
                    colorbyZoneItems,
                    sizebyZoneItems,
                    colorbyMetricIdx,
                    sizebyMetricIdx,
                    graphicModels = { children: []};

                if (dropZoneModel) {
                    colObjects = this.dataInterface.getColTitles().titles[0].es;
                    //get color by unit
                    colorbyZoneItems = dropZoneModel.getDropZoneObjectsByName('Colorby');
                    if (colorbyZoneItems.length > 0) {
                        this.isColorbyAttribute = dropZoneModel.isAttribute(colorbyZoneItems[0]);
                        if (this.isColorbyAttribute) {
                            //colorby attribute
    
                        } else {
                            //colorby metric
                            colorbyMetricIdx = this.dataInterface.getUnitById(colorbyZoneItems[0].id).depth - 1;
                        }
    
                    }
                    //get size by unit
                    sizebyZoneItems = dropZoneModel.getDropZoneObjectsByName('Size');
                    if (sizebyZoneItems.length > 0) {
                        sizebyMetricIdx = this.dataInterface.getUnitById(sizebyZoneItems[0].id).depth - 1;
                    }
                } else {
                    //create on RWD, use first metric as sizeby, use second metric as colorby is there are more than one metrics
                    sizebyMetricIdx = 0; 
                    colorbyMetricIdx = this.dataInterface.getColumnHeaderCount() > 1 ? 1: 0;
                }

                var rawData = this.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ROWS_ADV, {
                    hasSelection: true,
                    hasTitleName: true,
                    hasThreshold: true,
                    colorByInfo: dropZoneModel ? dropZoneModel.getColorByAttributes() : [],
                    additionalAttrIds: viz.additionalAttrIds
                });

                $ARR.forEach(rawData, function (row) {
                    var headers = row.headers,
                        values = row.values,
                        value = values[sizebyMetricIdx],
                        graphicModel = new GraphicModel();

                    graphicModel.idValueMapping = row.idValueMapping;
                    if (viz.additionalAttrIds.length) {
                        graphicModel.additional = row.additional;
                    }
                    graphicModel.values = row.values;

                    graphicModel.setCustomProperties({
                        packageName: headers[0].name,
                        className: headers[1].name,
                        value: Math.abs(value.rv),
                        formattedValue: value.v,
                        threshold: colorbyMetricIdx >= 0 && values[colorbyMetricIdx] && values[colorbyMetricIdx].threshold,
                        colorInfo: row.colorInfo
                    });
                    graphicModel.setId(viz.getSelectorHash(row.metricSelector));
                    graphicModel.setSelector(row.metricSelector, false);
                    graphicModel.setGroupOptions(row.headers);
                    graphicModel.setDrillOptions(headers[0].attributeSelector, [{
                            dropZoneIndex: 0,
                            keepParent: false
                        }/** {
                            dropZoneIndex: 1,
                            keepParent: true
                        }*/]);
                    graphicModels.children.push(graphicModel);
                });

                return graphicModels;
            },

            getContextMenuConfig: function getContextMenuConfig(graphicModel) {
                var hasGraphicModel = !!graphicModel,
                    vis = this;
                var commonConfig = [
                    {
                        type: $DEFAULT_CONTEXT_MENU.KEEP_ONLY
                    }, {
                        type: $DEFAULT_CONTEXT_MENU.EXCLUDE
                    }, {
                        type: $DEFAULT_CONTEXT_MENU.DRILL
                    }, {
                        type: $DEFAULT_CONTEXT_MENU.GROUP
                    }, {
                        type: $DEFAULT_CONTEXT_MENU.CALCULATION
                    }, {
                        type: $DEFAULT_CONTEXT_MENU.SHOW_DATA
                    }, {
                        type: $DEFAULT_CONTEXT_MENU.GO_TO_TARGETS
                    }, {
                        type: $DEFAULT_CONTEXT_MENU.SHOW_LEGEND
                    }
                ];

                var customConfig = [{
                    type: $CUSTOM_CONTEXT_MENU.TOGGLE,
                    name: "Show metric value",
                    propertyName: "showMetricValue",
                    showFormatPanel: true,
                    isShown: hasGraphicModel
                }, {
                    type: $CUSTOM_CONTEXT_MENU.SUBMENU,
                    name: "data label",
                    isShown: hasGraphicModel,
                    subMenuConfig: [{
                        type: $CUSTOM_CONTEXT_MENU.SINGLE_SELECT_LIST,
                        propertyName: "dataLabel",
                        items: [{
                            name: "class name",
                            value: "0"
                        },
                            {
                                name: "package name",
                                value: "1"
                            },
                            {
                                name: "both",
                                value: "2"
                            }
                        ]
                    }]
                }, {
                    type: $CUSTOM_CONTEXT_MENU.SEPARATOR
                }, {
                    type: $CUSTOM_CONTEXT_MENU.NORMAL,
                    name: 'Show threshold editor',
                    isShown: vis.zonesModel.getDropZoneObjectsByName('Colorby').length > 0 && !vis.isColorbyAttribute,
                    onClick: function () {
                        var colorbyMetrics = vis.zonesModel.getDropZoneObjectsByName('Colorby'),
                            zoneItem = colorbyMetrics && colorbyMetrics[0];
                        vis.model.openThresholdEditor(zoneItem, true, false);
                    }
                }, {
                    type: $CUSTOM_CONTEXT_MENU.SEPARATOR
                }, {
                    type: $CUSTOM_CONTEXT_MENU.SUBMENU,
                    name: "single select / pulldown list",
                    subMenuConfig: [{
                        propertyName: "pd",
                        showFormatPanel: true,
                        type: $CUSTOM_CONTEXT_MENU.SINGLE_SELECT_LIST,
                        items: [{
                            name: "10",
                            value: "10"
                        },
                            {
                                name: "20",
                                value: "20"
                            }
                        ]
                    }]
                }, {
                    type: $CUSTOM_CONTEXT_MENU.TOGGLE,
                    name: "toggle / checkbox",
                    propertyName: "cc",
                    showFormatPanel: false
                }, {
                    type: $CUSTOM_CONTEXT_MENU.SUBMENU,
                    name: "multi select / ButtonBar",
                    subMenuConfig: [{
                        propertyName: "ButtonBar",
                        showFormatPanel: true,
                        type: $CUSTOM_CONTEXT_MENU.MULTI_SELECT_LIST,
                        items: [{
                            labelText: mstrmojo.desc(7575, 'Top'),
                            propertyName: "t"
                        },
                            {
                                labelText: mstrmojo.desc(8631, 'Middle'),
                                propertyName: "m"
                            },
                            {
                                labelText: mstrmojo.desc(2257, 'Bottom'),
                                propertyName: "b"
                            }
                        ]
                    }]
                }, {
                    type: $CUSTOM_CONTEXT_MENU.SUBMENU,
                    name: "multi select / checklist",
                    subMenuConfig: [{
                        type: $CUSTOM_CONTEXT_MENU.NORMAL,
                        isDisabled: true,
                        name: 'sync with check box:'
                    }, {
                        propertyName: "cl2",
                        showFormatPanel: true,
                        type: $CUSTOM_CONTEXT_MENU.MULTI_SELECT_LIST,
                        items: [{
                            labelText: "aaa",
                            propertyName: "a"
                        },
                            {
                                labelText: "bbb",
                                propertyName: "b"
                            },
                            {
                                labelText: "ccc",
                                propertyName: "c"
                            }
                        ]
                    }]
                }, {
                    type: $CUSTOM_CONTEXT_MENU.FORMAT,
                    isShown: hasGraphicModel,
                    formatConfig: [{
                        type: $FORMAT_CONTROL_TYPE.COLORBYGROUP,
                        isShown: vis.isColorbyAttribute,
                        colorInfo: graphicModel && graphicModel.colorInfo,
                        width: '150px',
                        label: {
                            text: 'Fill',
                            width: '50px'
                        }
                    }, {
                        type: $FORMAT_CONTROL_TYPE.LINEGROUP,
                        propertyName: 'lg',
                        hideColorControl: true,
                        showFormatPanel: false,
                        items: [{
                            childName: 'lineColor',
                            disabled: vis.getProperty('cc') === "true"
                        }, {
                            childName: 'lineStyle',
                            disabled: false
                        }],
                        label: {
                            text: 'Border',
                            width: '50px'
                        }
                    }, {
                        type: $FORMAT_CONTROL_TYPE.CHARACTERGROUP,
                        propertyName: 'cg',
                        label: {
                            text: 'Font',
                            width: "50px"
                        },
                        items: [{
                            childName: 'fontSize',
                            disabled: vis.getProperty('cc') === "true"
                        }, {
                            childName: 'fontStyle',
                            disabled: false
                        }]
                    }],
                    showFormatPanelName: 'Colorby attribute'
                }];

                return {
                    common: commonConfig,
                    custom: customConfig
                };
            },

            updateHighlight: function updateHighlight() {
                var viz = this;

                //highlight effect for selection
                /**implementation #1 */
                d3.select(this.domNode).selectAll(".node").select(".outer")
                    .style("stroke", "black")
                    .style("stroke-width", function(graphicModel) {
                        return viz.graphicNeedsHighlight(graphicModel, false) ? '2px' : '0px';
                    });

                d3.select(this.domNode).selectAll(".node").select(".inner")
                    .style("stroke", "white")
                    .style("stroke-width", function(graphicModel) {
                        return viz.graphicNeedsHighlight(graphicModel, true) ? '2px' : '0px';
                    });
                /**implementation #1 */

                ///**implementation #2 */
                //var graphicModels = viz.getGraphicModels();
                //$ARR.forEach(graphicModels.children, function(graphicModel) {
                //    graphicModel.graphic.getElementsByClassName('inner')[0].style.strokeWidth = '0px';
                //    graphicModel.graphic.getElementsByClassName('outer')[0].style.strokeWidth = '0px';
                //});
                //
                //$ARR.forEach(viz.getSelExtraInfo(), function(graphicModel) {
                //    graphicModel.graphic.getElementsByClassName('outer')[0].style.stroke = 'black';
                //    graphicModel.graphic.getElementsByClassName('outer')[0].style.strokeWidth = '2px';
                //});
                //
                //$ARR.forEach(viz.getContextMenuSelExtraInfo(), function(graphicModel) {
                //    graphicModel.graphic.getElementsByClassName('inner')[0].style.stroke = 'white';
                //    graphicModel.graphic.getElementsByClassName('inner')[0].style.strokeWidth = '1px';
                //});
                ///**implementation #2 */


            },

            oncontextmenu: function oncontextmenu(evt) {
                var targetNode = evt.getTarget(),
                    d = d3.select(targetNode).datum();

                this.hideTooltip(false);
                this.handleContextMenuSelection(evt.e, d);
            },

            onclick: function onclick(evt) {
                var targetNode = evt.getTarget(),
                d = d3.select(targetNode).datum();

                this.handleSelection(evt.e, d);
            },
            onmousemove: function onmousemove(evt) {
                var targetNode = evt.getTarget(),
                    d = d3.select(targetNode).datum();

                handleMousemove(d, evt.e, this);
            },
            getGraphicModelsBySelector: function getGraphicModelsBySelector(selector, isAttrSelector) {
                var ret = [],
                    viz = this,
                    graphicModels = this.getGraphicModels(),
                    pickOptions = {
                        attribute: $PT.BOTH,
                        metric: $PT.METRIC,
                        criteria: $PC.INTERSECTION
                    };

                $ARR.forEach(graphicModels.children, function(graphicModel) {

                    if (viz.canPickGraphicModel(selector, isAttrSelector, graphicModel, pickOptions)) {
                        ret.push(graphicModel);
                    }
                });
                return ret;
            }
        }
    );
}());
//@ sourceURL=D3BubbleChart.js
