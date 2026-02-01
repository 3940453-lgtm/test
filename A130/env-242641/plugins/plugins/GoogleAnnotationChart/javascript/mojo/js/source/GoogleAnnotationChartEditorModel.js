(function () {
    // Define this code as a plugin in the mstrmojo object
    if (!mstrmojo.plugins.GoogleAnnotationChart) {
        mstrmojo.plugins.GoogleAnnotationChart = {};
    }
    // Import the necessary library
    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel"
    );
    //variable that represent the enum of all the widget type
    var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE;
    /**

     */
    mstrmojo.plugins.GoogleAnnotationChart.GoogleAnnotationChartEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            // Define the JavaScript class that renders your visualization properties
            scriptClass: 'mstrmojo.plugins.GoogleAnnotationChart.GoogleAnnotationChartEditorModel',
            getCustomProperty: function getCustomProperty() {
                var myViz = this.getHost();

                var numOfMetrics = myViz.zonesModel.getDropZones().zones[1].items.length;
                var allowHtmlFlag;
                var totalsFlag, lineFlag;
                // Fill the property data here

                return [
                    {
                        name: 'Annotation Chart',
                        value: [
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.LABEL,
                                        labelText: "Annotation List"
                                    },
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "displayAnnotations",
                                        labelText: "Show annotations"
                                    },
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        disabled: this.getHost().getProperty('displayAnnotations') === "false",
                                        propertyName: "displayAnnotationsFilter",
                                        labelText: "Show annotations search"
                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [
                                            {
                                                style: $WT.LABEL,
                                                width: "30%",
                                                disabled: this.getHost().getProperty('sortAscending') === "false",
                                                labelText: "Sort By"
                                            },
                                            {
                                                style: $WT.PULLDOWN,
                                                width: "70%",
                                                disabled: this.getHost().getProperty('sortAscending') === "false",
                                                propertyName: "sortBy",
                                                items: [
                                                    {
                                                        name: "Label",
                                                        value: "label"
                                                    },
                                                    {
                                                        name: "Text",
                                                        value: "text"
                                                    }
                                                ]
                                            }
                                        ]

                                    },
                                    {
                                        style: $WT.BUTTONBAR,
                                        disabled: this.getHost().getProperty('displayAnnotations') === "false",
                                        propertyName: "sortOrder",
                                        items: [
                                            {
                                                labelText: "Ascending",
                                                propertyName: "asc"
                                            },
                                            {
                                                labelText: "Descending",
                                                propertyName: "desc"
                                            }
                                        ],
                                        multiSelect: false

                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [{
                                            width: "90%",
                                            style: $WT.TWOCOLUMN,
                                            items: [{
                                                style: $WT.LABEL,
                                                disabled: this.getHost().getProperty('displayAnnotations') === "false",
                                                width: "60%",
                                                labelText: "List Width:"
                                            }, {
                                                style: $WT.TEXTBOX,
                                                disabled: this.getHost().getProperty('displayAnnotations') === "false",
                                                width: "40%",
                                                propertyName: 'annotationsWidth'
                                            }]
                                        }, {
                                            style: $WT.LABEL,
                                            width: "10%",
                                            labelText: "%"
                                        }]
                                    }
                                ]
                            },
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.LABEL,
                                        labelText: "Timeline Adjustment"
                                    },
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "displayRangeSelector",
                                        labelText: "Show range selector"
                                    },
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        disabled: this.getHost().getProperty('displayRangeSelector') === "false",
                                        propertyName: "displayZoomButtons",
                                        labelText: "Show zoom buttons"
                                    }
                                ]
                            },
                            {
                                style: $WT.EDITORGROUP,
                                items: (function () {
                                    var x = [
                                        {
                                            style: $WT.LABEL,
                                            labelText: "Legend Colors"
                                        }];
                                    for (var i = 0; i < numOfMetrics; i++) {
                                        var color;
                                        x.push(
                                            {
                                                style: $WT.LABEL,
                                                labelText: myViz.zonesModel.getDropZones().zones[1].items[i].n
                                            },
                                            {
                                                style: $WT.FILLGROUP,
                                                propertyName: "lineColor" + i,
                                                items: [
                                                    {
                                                        childName: 'fillAlpha',
                                                        disabled: true
                                                    }
                                                ],
                                                config: {
                                                    suppressData: true,
                                                    clientUndoRedoCallback: function () {
                                                    },
                                                    onPropertyChange: function (propertyName, newValue) {
                                                        color = newValue;
                                                        color["lineName"] = propertyName;
                                                        var ind = parseInt(propertyName.charAt(propertyName.length - 1));
                                                        color["metricName"] = myViz.zonesModel.getDropZones().zones[1].items[ind].n;
                                                        return {};
                                                    },
                                                    callback: function () {
                                                        myViz.setColors(color);
                                                        myViz.refresh();
                                                    }
                                                }
                                            }
                                        );
                                    }
                                    return x;
                                })()
                            }
                        ]
                    }


                ];
            }
        }
    );
}());