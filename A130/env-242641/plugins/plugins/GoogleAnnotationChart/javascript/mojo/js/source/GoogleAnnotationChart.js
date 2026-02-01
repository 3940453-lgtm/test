(function () {
    if (!mstrmojo.plugins.GoogleAnnotationChart) {
        mstrmojo.plugins.GoogleAnnotationChart = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.CustomVisBase",
        "mstrmojo.models.template.DataInterface"
    );

    var colors = []; //to maintain the color object for each metric
    var defaultcolors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"]; //Set of 20 Colors from which colors for new lines will be allocated

    mstrmojo.plugins.GoogleAnnotationChart.GoogleAnnotationChart = mstrmojo.declare(
        mstrmojo.CustomVisBase,
        null, {
            scriptClass: "mstrmojo.plugins.GoogleAnnotationChart.GoogleAnnotationChart",
            cssClass: "googleannotationchart",
            errorMessage: "Either there is not enough data to display the visualization or the visualization configuration is incomplete.",
            externalLibraries: [{url: "//www.google.com/jsapi"},{url:"//d3js.org/d3.v3.min.js"}],
            useRichTooltip: false,
            reuseDOMNode: false,
            supportNEE: true, // indicate the widget supports PDF exporting by New Export Engine
            draggable: true,
            isDragValid: function isDragValid() {
                // US17907: Don't do anything for DnD here.
                return false;
            },
            shouldDragBubble: function shouldDragBubble() {
                // US17907: Don't propagate DnD event to parent to prevent triggering DnD on UnitContainer.
                return true;
            },
            setColors: function (color) {
                var index = parseInt(color.lineName.charAt(color.lineName.length - 1));

                if (typeof colors[index] !== "undefined") {
                    colors[index] = color;
                    var value = color.fillColor.toString();
                    var pos = defaultcolors.indexOf(value);
                    if (pos != -1) {
                        defaultcolors.splice(pos, 1);
                        defaultcolors.push(value);
                    }
                }
                else {
                    colors.push(color);
                }
            },
            plot: function () {
                /**
                 * Created by ctouret on 12/29/2015.
                 */
                var is10point2 = !(typeof this.addThresholdMenuItem === 'function'); //True if we are using MSTR 10.2
                if (!is10point2) {
                    this.setDefaultPropertyValues({
                        displayAnnotations: 'true',
                        displayAnnotationsFilter: 'true',
                        displayRangeSelector: 'true',
                        displayZoomButtons: 'true',
                        annotationsWidth: '25',
                        sortOrder: {desc: 'true', asc: 'false'}
                    });
                }
                this.addUseAsFilterMenuItem(); // Enable the "use as selector" option on the visualization menu

                var TITLE_PREFIX = "Title_";
                var SUBTITLE_PREFIX = "Subtitle_";
                var metrics = [],
                    metricsWithAnnotTitle = [],
                    metricsWithAnnotSubtitle = [],
                    annotations = [];

                String.prototype.contains = function (it) {
                    return (this.indexOf(it) != -1) && (this.length);
                };

                //Global Variables
                var me = this, //Used in the select handler
                    model = new mstrmojo.models.template.DataInterface(me.model.data), //Retrieve the data
                    annotatedchart; //Used in the select handler

                var hasAnnotation = false;

                //If there is no data display error
                if (model.getTotalRows() <= 0) {
                    this.displayError();
                    return;
                }

                if (model.getRowTitles().size() > 1)
                    hasAnnotation = true;

                //Create the annotation chart from the model
                google.load('visualization', '1', {
                    callback: function () {
                        try {
                                               
                            var data = new google.visualization.DataTable(),
                                colHeaders = model.getColHeaders(0),
                                columnSize = model.getTotalCols(),
                                i,
                                j,
                                dataRows = [],
                                dataRow;

                            data.addColumn('date', model.getRowTitles().getTitle(0).getName());

                            var totalCols = model.getColumnHeaderCount();
                            var colObj = model.getColTitles();

                            for (var i = 0, ann = 0, met = 0; i < totalCols; i++) {
                                var name = colObj.titles[0].es[i].n;
                                if (name.contains(TITLE_PREFIX) || name.contains(SUBTITLE_PREFIX))
                                    annotations[ann++] = name;
                                else
                                    metrics[met++] = name;
                            }

                            for (var i = 0; i < metrics.length; i++) {
                                var metricName = metrics[i];
                                data.addColumn('number', metricName);
                                metricsWithAnnotTitle[i] = -1;
                                metricsWithAnnotSubtitle[i] = -1;

                                var hasAnnotation = false;
                                for (var j = 0; j < annotations.length; j++) {
                                    if (annotations[j] && (annotations[j].contains(TITLE_PREFIX))) {
                                        var annotationMetric = annotations[j].substring(TITLE_PREFIX.length);
                                        if ((annotationMetric.trim()) === (metricName.trim())) {
                                            data.addColumn('string', annotations[j]);
                                            metricsWithAnnotTitle[i] = "" + (metrics.length + j);
                                            hasAnnotation = true;
                                        }
                                    }
                                }
                                if (!hasAnnotation)
                                    data.addColumn('string', "Empty");

                                hasAnnotation = false;
                                for (var j = 0; j < annotations.length; j++) {

                                    if (annotations[j] && (annotations[j].contains(SUBTITLE_PREFIX))) {
                                        var annotationMetric = annotations[j].substring(SUBTITLE_PREFIX.length);
                                        if ((annotationMetric.trim()) === (metricName.trim())) {
                                            data.addColumn('string', annotations[j]);
                                            metricsWithAnnotSubtitle[i] = "" + (metrics.length + j);
                                            hasAnnotation = true;
                                        }
                                    }
                                }
                                if (!hasAnnotation)
                                    data.addColumn('string', "Empty");

                            }


                            //Process the model into data that will be used to draw the chart

                            for (i = 0; i < model.getTotalRows(); i++) {
                                //This code is to make sure we use the date in the proper way no matter his format
                                var formattedDate = model.getRowHeaders(i).getHeader(0).getName();
                                var dateformat = mstrmojo.locales.datetime.DATEOUTPUTFORMAT
                                var mojoDate = mstrmojo.date.parseDate(formattedDate, true, dateformat);
                                var date;
                                if(mojoDate !== null) {
                                    date = [new Date(mojoDate.year, mojoDate.month-1, mojoDate.day)];
                                 } else {
                                    date = [Date.parse(model.getRowHeaders(i).getHeader(0).getName())];
                                 }
                                dataRow = date;
                                if (typeof dataRow[0] === "number")
                                    dataRow[0] = new Date(dataRow[0]);
                                for (j = 0; j < metrics.length; j++) {
                                    dataRow.push(model.getMetricValue(i, j).getRawValue());
                                    if (metricsWithAnnotTitle[j] >= 0) {
                                        dataRow.push("" + model.getMetricValue(i, metricsWithAnnotTitle[j]).getRawValue());
                                    } else {
                                        dataRow.push(undefined);
                                    }
                                    if (metricsWithAnnotSubtitle[j] >= 0) {
                                        dataRow.push("" + model.getMetricValue(i, metricsWithAnnotSubtitle[j]).getRawValue());
                                    } else {
                                        dataRow.push(undefined);
                                    }
                                }

                                dataRows.push(dataRow);
                            }
                            data.addRows(dataRows);

                            //Create the chart into the Visualization frame
                            annotatedchart = new google.visualization.AnnotationChart(me.domNode);

                            //Add option to the chart, see Google Chart Annotation to see the different option available for this chart
                            if (!is10point2) {
                                var options = {
                                    thickness: 3, //Define the thickness of the lines
                                    displayAnnotations: me.getProperty("displayAnnotations") === 'true',
                                    annotationsWidth: me.getProperty("annotationsWidth") ? parseInt(me.getProperty("annotationsWidth")) : 25,
                                    displayAnnotationsFilter: me.getProperty("displayAnnotationsFilter") === 'true',
                                    displayRangeSelector: me.getProperty("displayRangeSelector") === 'true',
                                    displayZoomButtons: me.getProperty("displayZoomButtons") === 'true' && me.getProperty("displayRangeSelector") === 'true',
                                    table: {
                                        sortAscending: me.getProperty("sortOrder").asc === 'true',
                                        sortColumn: (function () {
                                            return me.getProperty("sortBy") === 'label' ? 0 : 1;
                                        })()
                                    }

                                };

                                var properties = me.getProperties();

                                //*****logic needs to be improved once getProperties() is fixed******
                                //After save load, populate colors from properties
                                if (properties['lineColor0'] && colors.length == 0) {
                                    for (var i = 0; i < metrics.length; i++) {
                                        var colorval = defaultcolors.shift();
                                        defaultcolors.push(colorval);
                                        var colorObj = {};
                                        var str = "lineColor" + i;
                                        colorObj["fillColor"] = properties[str].fillColor;
                                        colorObj["lineName"] = str;
                                        colorObj["metricName"] = metrics[i];
                                        colors.push(colorObj);
                                    }
                                }


                                //when lines are removed from the chart
                                if (colors.length > metrics.length) {
                                    var temp = [];
                                    for (var i = 0; i < metrics.length; i++) {
                                        colors.forEach(function (obj) {
                                            if (obj.metricName == metrics[i]) {
                                                temp.push(obj);
                                            }
                                        });
                                    }
                                    colors = temp;
                                    for (var i = 0; i < colors.length; i++) {
                                        colors[i].lineName = "lineColor" + i;
                                        if (me.getProperty(colors[i].lineName))
                                            me.setProperty(colors[i].lineName, {fillColor: colors[i].fillColor}); // might not be required when getProperties() is fixed
                                        properties[colors[i].lineName] = {fillColor: colors[i].fillColor};
                                    }


                                }
                                //to remove excess lineColors from properties - logic might not be required in future
                                var ind = colors.length;
                                while (properties['lineColor' + ind]) {
                                    delete properties['lineColor' + ind];
                                    ind++;
                                }

                                for (var i = 0; i < colors.length; i++) {
                                    properties[colors[i].lineName] = {fillColor: colors[i].fillColor};
                                }


                                //when new lines are added to the chart
                                for (var i = colors.length; i < metrics.length; i++) {
                                    var colorObj = {};
                                    var str = "lineColor" + i;
                                    colorObj["fillColor"] = defaultcolors.shift();
                                    defaultcolors.push(colorObj["fillColor"]);
                                    colorObj["lineName"] = str;
                                    colorObj["metricName"] = metrics[i];
                                    colors.push(colorObj);
                                    properties[colorObj.lineName] = {fillColor: colorObj.fillColor};
                                }

                                var colorValues = [];
                                colors.forEach(function (object) {
                                    colorValues.push(object.fillColor.toString());
                                });

                                //send colors to the google chart
                                options["colors"] = colorValues;
                            }
                            else {
                                var options = {
                                    thickness: 3, //Define the thickness of the lines
                                    displayAnnotations: true
                                };
                            }
                            //Draw the chart from the processed data
                            annotatedchart.draw(data, options);
                         
                            //Implementation of the selector capability, i.e. allows this chart to be used as a filter for another chart
                            google.visualization.events.addListener(annotatedchart, 'select', selectHandler);

                            function selectHandler() {
                              var sel = annotatedchart.getSelection();
                                if (sel.length) {
                                    var rowSelected, dataWithSelectors, attributeSelector;
                                    rowSelected = sel[0].row;
                                    dataWithSelectors = model.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ROWS_ADV, {
                                        hasSelection: true
                                    });
                                    attributeSelector = dataWithSelectors[rowSelected].headers[0].attributeSelector;
                                    if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.selectionDataJSONString) { //for mobile
                                        attributeSelector.messageType = "selection";
                                        window.webkit.messageHandlers.selectionDataJSONString.postMessage(attributeSelector);
                                    } else {
                                        me.applySelection(attributeSelector); //for web
                                    }
                                }
                            };
                        } catch (e) {
                            me.displayError();
                        }

                        // raise event for New Export Engine
                        me.raiseEvent({
                            name: 'renderFinished',
                            id: me.k
                        });

                        d3.select(me.domNode)
                            .on("click", function(d) {
                                if(!isSvgElm(event.target.tagName)) {
                                    annotatedchart.setSelection([]);
                                    me.clearSelections();
                                    me.endSelections();
                                }
                            });
                        function isSvgElm(elm) {
                            var svgElms = ['circle'];
                            if (svgElms.indexOf(elm) >= 0) {
                                return true;
                            }
                            return false;
                         };
                    },
                    packages: ['annotationchart']
                });
            }
        })
}());