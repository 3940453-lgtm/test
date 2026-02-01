(function () {
    if (!mstrmojo.plugins.D3BubbleChartNew) {
        mstrmojo.plugins.D3BubbleChartNew = {};
    }
    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel",
        "mstrmojo.array",
        "mstrmojo.CustomVisUtility"
    );
    var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE;
    var $CUSTOM_VIZ_UTIL = mstrmojo.CustomVisUtility;

    mstrmojo.plugins.D3BubbleChartNew.D3BubbleChartNewEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            scriptClass: 'mstrmojo.plugins.D3BubbleChartNew.D3BubbleChartNewEditorModel',
            getCustomProperty: function getCustomProperty() {
                var host = this.getHost();

                return [
                    {
                        name: "Custom Category Name",
                        value: [
                            {
                                style: $WT.EDITORGROUP,
                                items: [{
                                    style: $WT.CHECKBOXANDLABEL,
                                    propertyName: "showMetricValue",
                                    labelText: "Show Metric Value"
                                },{
                                    style: $WT.TWOCOLUMN,
                                    items: [
                                        {
                                            style: $WT.LABEL,
                                            width: "40%",
                                            labelText: "Label Text:"
                                        },
                                        {
                                            style: $WT.PULLDOWN,
                                            propertyName: "dataLabel",
                                            width: "60%",
                                            items: [
                                                {
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
                                        }
                                    ]
                                }]
                            }
                        ]
                    },{
                        name: "Colorby attribute",
                        value: [
                            {
                                style: $WT.COLORBYGROUP
                            }
                        ]
                    },{
                        name: 'Format',
                        value: [
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [
                                            {
                                                style: $WT.LABEL,
                                                width: "40%",
                                                labelText: "Label Text:"
                                            },
                                            {
                                                style: $WT.PULLDOWN,
                                                propertyName: "pd",
                                                width: "60%",
                                                items: [
                                                    {
                                                        name: "10",
                                                        value: "10"
                                                    },
                                                    {
                                                        name: "20",
                                                        value: "20"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        style:  $WT.CHECKBOXANDLABEL,
                                        propertyName:  "cc",
                                        labelText:  "ivy"
                                    },
                                    {
                                        propertyName: "ButtonBar",
                                        style: $WT.BUTTONBAR,
                                        items: [
                                            {
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
                                        ],
                                        multiSelect: true
                                    },
                                    {
                                        style: $WT.CHECKLIST,
                                        propertyName: "cl2",
                                        items: [
                                            {
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
                                        ],
                                        multiSelect: true,
                                        orientation: "v"
                                    },
                                    {
                                        style: $WT.STEPPER,
                                        propertyName: "ff",
                                        min: 0,
                                        max: 10
                                    },
                                    {
                                        style: $WT.COMBOBOX,
                                        propertyName: "d11",
                                        items: [
                                            {
                                                name: 1
                                            },
                                            {
                                                name: 2
                                            }
                                        ]

                                    },
                                    {
                                        style: $WT.TEXTBOX,
                                        propertyName: "textbox"
                                    }, {
                                        style: $WT.CHARACTERGROUP,
                                        propertyName: 'cg',
                                        items: [{
                                            childName: 'fontSize',
                                            disabled: host.getProperty('cc') === "true"
                                        }, {
                                            childName: 'fontStyle',
                                            disabled: false
                                        }]
                                    }, {
                                        style: $WT.FILLGROUP,
                                        propertyName: 'fg',
                                        items: [{
                                            childName: 'fillColor',
                                            disabled: host.getProperty('cc') === "true"
                                        }, {
                                            childName: 'fillAlpha',
                                            disabled: false
                                        }]
                                    }, {
                                        style: $WT.LINEGROUP,
                                        propertyName: 'lg',
                                        items: [{
                                            childName: 'lineColor',
                                            disabled: host.getProperty('cc') === "true"
                                        }, {
                                            childName: 'lineStyle',
                                            disabled: false
                                        }]
                                    }
                                ]
                            }
                        ]
                    }
                ];
            }
        }
    );
}());
//@ sourceURL=D3BubbleChartEditorModel.js
