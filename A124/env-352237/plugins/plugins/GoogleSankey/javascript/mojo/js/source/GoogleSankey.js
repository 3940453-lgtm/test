(function () {
    if (!mstrmojo.plugins.GoogleSankey) {
        mstrmojo.plugins.GoogleSankey = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    mstrmojo.plugins.GoogleSankey.GS_PROPERTIES = {
        LABEL_FONT: 'labelFont',
        TOOLTIP_FONT: 'tooltipFont',
        NODE_WIDTH: 'nodeWidth'
    };

    mstrmojo.plugins.GoogleSankey.GoogleSankey = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null,
        {
            scriptClass: "mstrmojo.plugins.GoogleSankey.GoogleSankey",
            cssClass: "googlesankey",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            errorDetails: "This visualization requires one or more attributes and one metric.",
            externalLibraries: [{url: "//www.google.com/jsapi"},{url:"//d3js.org/d3.v3.min.js"}],
            useRichTooltip: true,
            reuseDOMNode: true,
            supportNEE: true, // indicate the widget supports PDF exporting by New Export Engine
            getLabelFontStyle: function getLabelFontStyle() {
                var GS_PROPERTIES = mstrmojo.plugins.GoogleSankey.GS_PROPERTIES,
                    getFontStyle = this.getProperty(GS_PROPERTIES.LABEL_FONT);
                return getFontStyle;
            },
            getTooltipFontStyle: function getTooltipFontStyle() {
                var GS_PROPERTIES = mstrmojo.plugins.GoogleSankey.GS_PROPERTIES,
                    getFontStyle = this.getProperty(GS_PROPERTIES.TOOLTIP_FONT);
                return getFontStyle;
            },
            getNodeWidth: function getNodeWidth() {
                var GS_PROPERTIES = mstrmojo.plugins.GoogleSankey.GS_PROPERTIES,
                    getNodeWidth = this.getProperty(GS_PROPERTIES.NODE_WIDTH);
                return getNodeWidth;
            },
            plot: function () {


                /**
                 * Google SanKey altered by Darren Holmblad dholmblad@microstrategy.com on 12/29/2015.
                 * Version 1.0
                 * This code is dependent on the Google Visualization Library
                 */

                var me = this;
                var chart; 
                var is10point2 = true;
                if (typeof me.addThresholdMenuItem == 'function') {
                    me.addThresholdMenuItem();
                    is10point2 = false;
                    me.setDefaultPropertyValues({
                        labelFont: {
                            fontSize: '12pt',
                            fontFamily: 'Arial',
                            fontColor: '#000'
                        },
                        tooltipFont: {
                            fontSize: '14pt',
                            fontFamily: 'Arial',
                            fontColor: '#000'
                        },
                        nodeWidth: 10

                    });

                }
                var dataConfig = {};
                dataConfig.hasSelection = true;
                if (!is10point2)
                    dataConfig.hasThreshold = true;
                var selectorData = [];
                var thresholdColor = [];

            //    var dict = new Object();

                /* function used to search collection and obtain attribute selector */
                var getSelectorValue = function (search) {
                    var result;
                    for (var p = 0; p < selectorData.length; p++) {
                        if (selectorData[p].att == search) {
                            result = selectorData[p].sel;
                            break;
                        }
                    }
                    return result;
                };
                /* function designed to flatten data */
                var processData = function (raw, table) {
                    var result = [];

                    var rawChildren = raw.children;
                    for (var i = 0; i < rawChildren.length; i++) {
                        var child = rawChildren[i];
                        var firstAttribute = child.name;
                        selectorData.push({
                            att: firstAttribute,
                            sel: child.attributeSelector
                        });


                        if (typeof child.children != 'undefined') {
                            for (var a = 0; a < child.children.length; a++) {
                               
                            if (typeof child.children[i] != 'undefined') {
                                var att = child.children[i].name;
                                  selectorData.push({
                                    att: att,
                                    sel: child.children[i].attributeSelector
                                });  
                            }
                            }
                        }
                        // Add a dict to save the state of being clicked or not for the labels.
                        //dict[firstAttribute] = false;

                        for (var z = 0; z < rawChildren[i].children.length; z++) {
                            result.push([firstAttribute.trim(), rawChildren[i].children[z].name.trim(), rawChildren[i].children[z].value]);
                            if (!is10point2 && rawChildren[i].children[z].values && rawChildren[i].children[z].values[0].threshold) {
                                thresholdColor.push(rawChildren[i].children[z].values[0].threshold.fillColor);
                            }
                        }

                    }
                    //add raw data to the Google DataTable
                    table.addRows(result);
                    return table;
                };
                this.addUseAsFilterMenuItem();
                var me = this,
                    model = new mstrmojo.models.template.DataInterface(me.model.data);
                if (model.getTotalRows() <= 0) {
                    this.displayError();
                    return;
                }
                if (!google.visualization || !google.visualization.Sankey) {
                    google.load('visualization', '1.1', {"callback": drawChart, packages: ["sankey"]});
                    //google.charts.load('current', {'packages': ['sankey']});
                    //google.charts.setOnLoadCallback(drawChart);
                } else {
                    drawChart();
                }


                function drawChart() {

                    if (d3.sankey) {
                        google.sankey = d3.sankey; // I save it on google, but you can save it somewhere else
                    } else {
                        d3.sankey = google.sankey;
                    }


                    //Create new DataTable and define columns
                    var dataTable = new google.visualization.DataTable();
                    dataTable.addColumn('string', 'From');
                    dataTable.addColumn('string', 'To');
                    dataTable.addColumn('number', 'Weight');
                    //  dataTable.addRows(data);
                    var rawData = {};
                    //Obtain raw data from the microstrategy api
                    rawData = me.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ADV, dataConfig);

                    // dataTable.addRows(data);
                    var googData = processData(rawData, dataTable);

                    //preset colors, users can enhance if desired
                    var colors = ['#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6', '#ffff99', '#1f78b4', '#33a02c'];


                    // Sets chart options.
                    var options = {
                        sankey: {
                            node: {
                                colors: colors,
                                labelPadding: 5,
                                width: 10,
                                interactivity: true, //necessary for sankey to have selector functionality
                                label: {
                                    fontName: '',
                                    fontSize: 14,
                                    color: '#000',
                                    bold: false,
                                    italic: false,
                                    underline: false
                                }

                            },
                            link: {
                                colorMode: 'gradient',
                                colors: colors
                            }
                        },
                        tooltip: {
                            textStyle: {
                                fontName: 'Arial',
                                color: '#000',
                                fontSize: '14',
                                bold: false,
                                italic: false,
                                underline: false
                            },
                            isHtml: true

                        }
                    };

                    //if it is 10.3 and above
                    if (!is10point2) {
                        var labelFontStyle = me.getLabelFontStyle();
                        var tooltipFontStyle = me.getTooltipFontStyle();
                        var nodeWidth = me.getNodeWidth();


                        //check label font style
                        if (labelFontStyle) {
                            //modify label font size
                            if (labelFontStyle.fontSize) {
                                var fontSize = labelFontStyle.fontSize;
                                var len = fontSize.length;
                                var newSize = fontSize.substr(0, len - 2);
                                options.sankey.node.label.fontSize = newSize;
                            }
                            //modify label font 
                            if (labelFontStyle.fontFamily) {
                                options.sankey.node.label.fontName = labelFontStyle.fontFamily;
                            }
                            //modify label color
                            if (labelFontStyle.fontColor) {
                                options.sankey.node.label.color = labelFontStyle.fontColor;
                            }
                            //check to see if italic 
                            if (labelFontStyle.fontItalic && labelFontStyle.fontItalic === true) {
                                options.sankey.node.label.italic = true;
                            }
                            //check to see if bold
                            if (labelFontStyle.fontWeight && labelFontStyle.fontWeight === true) {
                                options.sankey.node.label.bold = true;
                            }
                            //check to see if underline
                            if (labelFontStyle.fontUnderline && labelFontStyle.fontUnderline === true) {
                                options.sankey.node.label.underline = true;
                            }
                        }


                        //check tooltip font style
                        if (tooltipFontStyle) {
                            //modify tooltip font size
                            if (tooltipFontStyle.fontSize) {
                                var fontSize = tooltipFontStyle.fontSize;
                                var len = fontSize.length;
                                var newSize = fontSize.substr(0, len - 2);
                                options.tooltip.textStyle.fontSize = newSize;
                            }
                            //modify tooltip font 
                            if (tooltipFontStyle.fontFamily) {
                                options.tooltip.textStyle.fontName = tooltipFontStyle.fontFamily;
                            }
                            //modify tooltip font color
                            if (tooltipFontStyle.fontColor) {
                                options.tooltip.textStyle.color = tooltipFontStyle.fontColor;
                            }
                            //check to see if italic 
                            if (tooltipFontStyle.fontItalic && tooltipFontStyle.fontItalic === true) {
                                options.tooltip.textStyle.italic = true;
                            }
                            //check to see if bold
                            if (tooltipFontStyle.fontWeight && tooltipFontStyle.fontWeight === true) {
                                options.tooltip.textStyle.bold = true;
                            }
                            //check to see if underline
                            if (tooltipFontStyle.fontUnderline && tooltipFontStyle.fontUnderline === true) {
                                options.tooltip.textStyle.underline = true;
                            }
                        }

                        //check node width
                        if (nodeWidth) {
                            options.sankey.node.width = nodeWidth;
                        }
                    }
                    // Instantiate and draw our chart, passing in some options.
                    chart = new google.visualization.Sankey(me.domNode);

                    google.visualization.events.addListener(chart, 'ready', function() {
                        // raise event for New Export Engine
                        me.raiseEvent({
                            name: 'renderFinished',
                            id: me.k
                        });
                    });

                    if (!is10point2 && thresholdColor.length > 0) {
                        options.sankey.node.colors = thresholdColor;
                        options.sankey.link.colors = thresholdColor;
                    }

                    chart.draw(googData, options);
                    google.visualization.events.addListener(chart, 'select', function () {
                        var sel = chart.getSelection();
                       
                         if (sel.length) {
                            var attributeSelector;
                            attributeSelector = getSelectorValue(sel[0].name);
                             if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.selectionDataJSONString) { //for mobile
                                    attributeSelector.messageType = "selection";
                                    window.webkit.messageHandlers.selectionDataJSONString.postMessage(attributeSelector);
                                } else {
                                    me.applySelection(attributeSelector); //for web
                                }
                        }

                    });



                    d3.select(me.domNode).select("div").select("div").select("div").select("svg")
                        .on("click", function(d) {
                            if(!isSvgElm(event.target.tagName)) {
                                 chart.setSelection([]);
                                 me.clearSelections();
                                 me.endSelections();
                            }
                        });

                    function isSvgElm(elm) {
                        var svgElms = ['rect', 'path', 'text'];
                        if (svgElms.indexOf(elm) >= 0) {
                            return true;
                        }
                        return false;
                    };

                }

            }
        })
}());
//@ sourceURL=GoogleSankey.js