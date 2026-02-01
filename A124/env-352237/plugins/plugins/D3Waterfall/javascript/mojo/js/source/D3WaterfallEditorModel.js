(function () {
    if (!mstrmojo.plugins.D3Waterfall) {
        mstrmojo.plugins.D3Waterfall = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel",
        "mstrmojo.array"
    );

    var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE;

    mstrmojo.plugins.D3Waterfall.D3WaterfallEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            scriptClass: "mstrmojo.plugins.D3Waterfall.D3WaterfallEditorModel",
            cssClass: "d3waterfalleditormodel",
            getCustomProperty: function getCustomProperty() {
                //Retrieve the viz created in the D3Waterfall.js
                var myViz = this.getHost();
                var model = new mstrmojo.models.template.DataInterface(myViz.model.data);
                var metrics = model.getColTitles().titles;
                var attributes = model.getRowTitles().titles;

                var continuousFlag, totalsFlag, lineFlag, totalsColor, metricColor;
                // Fill the property data here
                return [
                    {
                        name: 'Visualization Mode',
                        value: [
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "showYAxis",
                                        labelText: "Show Y Axis"
                                    },
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "continuousMode",
                                        labelText: "Continuous Mode",
                                        config: {
                                            suppressData: true,
                                            clientUndoRedoCallback: function () {
                                            },
                                            onPropertyChange: function (propertyName, newValue) {
                                                if (propertyName === "continuousMode") {
                                                    continuousFlag = newValue;
                                                }
                                                return {};
                                            },
                                            callback: function () {
                                                myViz.switchContinuousMode(continuousFlag);
                                                myViz.refresh();
                                            }
                                        }
                                    },
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "showTotals",
                                        labelText: "Show Totals",
                                        config: {
                                            suppressData: true,
                                            clientUndoRedoCallback: function () {
                                            },
                                            onPropertyChange: function (propertyName, newValue) {
                                                if (propertyName === "showTotals") {
                                                    totalsFlag = newValue;
                                                }
                                                return {};
                                            },
                                            callback: function () {

                                                myViz.showTotal(totalsFlag);
                                                myViz.refresh();
                                            }
                                        }
                                    },
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "showLine",
                                        labelText: "Show Horizontal Lines",
                                        config: {
                                            suppressData: true,
                                            clientUndoRedoCallback: function () {
                                            },
                                            onPropertyChange: function (propertyName, newValue) {
                                                if (propertyName === "showLine") {
                                                    lineFlag = newValue;
                                                }
                                                return {};
                                            },
                                            callback: function () {

                                                myViz.showLine(lineFlag);
                                                myViz.refresh();
                                            }
                                        }

                                    },

                                    {
                                        style: $WT.TWOCOLUMN,
                                        disabled:
                                            (function () {
                                              return attributes.length>0;
                                            })
                                        (),
                                        items: [{
                                            style: $WT.LABEL,
                                            width: "80%",
                                            labelText: "Start with value (when using only metrics) :"
                                        }, {
                                            style: $WT.TEXTBOX,
                                            width: "20%",
                                            propertyName: 'startWith',
                                            config: {
                                                suppressData: true,
                                                clientUndoRedoCallback: function () {
                                                },
                                                onPropertyChange: function (propertyName, newValue) {
                                                    if (propertyName === "startWith") {
                                                        startWith = newValue;
                                                    }
                                                    return {};
                                                },
                                                callback: function () {
                                                    myViz.startWith(startWith);
                                                    myViz.refresh();
                                                }
                                            }
                                        }
                                        ]
                                    }

                                ]
                            },
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.LABEL,
                                        labelText: "Totals Bar Color"
                                    },
                                    {
                                        style: $WT.FILLGROUP,
                                        propertyName: "totalsColor",
                                        disabled: (function () {
                                            if (typeof myViz.getProperty('showTotals') === "undefined") {
                                                return "false";
                                            }
                                            else{
                                                return myViz.getProperty('showTotals') === "false";
                                            }

                                        })()
                                    },
                                    {
                                        style: $WT.LABEL,
                                        labelText: "Positive Values Color"
                                    },
                                    {
                                        style: $WT.FILLGROUP,
                                        propertyName: "positiveColor"
                                    },
                                    {
                                        style: $WT.LABEL,
                                        labelText: "Negative Values Color"
                                    },
                                    {
                                        style: $WT.FILLGROUP,
                                        propertyName: "negativeColor"
                                    }
                                ]
                            },
                            {
                                style: $WT.EDITORGROUP,
                                items: (function () {
                                    var x = [
                                        {
                                            style: $WT.LABEL,
                                            labelText: "Metric Colors"
                                        }];
                                    if(metrics[0] && metrics[0].es){
                                        for (var i = 0; i < metrics[0].es.length; i++) {
                                            var color;
                                            x.push(
                                                {
                                                    style: $WT.LABEL,
                                                    labelText: metrics[0].es[i].n
                                                },
                                                {
                                                    style: $WT.FILLGROUP,
                                                    propertyName: metrics[0].es[i].n.replace(/\s/g, ''),
                                                    items: [
                                                        {
                                                            childName: 'fillAlpha',
                                                            disabled: true
                                                        }
                                                    ]
                                                }
                                            );
                                        }
                                    }
                                    return x;
                                })()
                            },
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.LABEL,
                                        labelText: "Labels"
                                    },
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "showLabel",
                                        labelText: "Show Label"
                                    },
                                    {
                                        style: $WT.CHARACTERGROUP,
                                        propertyName: "labelFont"
                                    }

                                ]
                            }
                        ]
                    }


                ];
            }
        })
}());
//@ sourceURL=D3WaterfallEditorModel.js