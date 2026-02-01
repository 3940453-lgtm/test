(function () {
    if (!mstrmojo.plugins.CircularTreeMap) {
        mstrmojo.plugins.CircularTreeMap = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel",
        "mstrmojo.array"
    );
    var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE;

    mstrmojo.plugins.CircularTreeMap.CircularTreeMapEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            scriptClass: "mstrmojo.plugins.CircularTreeMap.CircularTreeMapEditorModel",
            cssClass: "circulartreemapeditormodel",
            getCustomProperty: function getCustomProperty() {
                var circularViz = this.getHost();
                return [{
                    name: 'Circular Tree Map Settings',
                    value: 
                    [
                        {
                            style: $WT.EDITORGROUP,
                            items: 
                            [
                                {
                                    style: $WT.TWOCOLUMN,
                                    cssClass: "two-column-fill-group",
                                    items: [
                                        {
                                            style: $WT.LABEL,
                                            width: "35%",
                                            labelText: "Text Color:"
                                        },
                                        {
                                            style: $WT.FILLGROUP,
                                            width: "65%",
                                            propertyName: "textColorFillGroup",
                                            items: [
                                                {
                                                    childName: "fillAlpha",
                                                    disabled: true
                                                }
                                            ],
                                            config: {
                                                suppressData: true,
                                                onPropertyChange: function (propertyName, newValue) {
                                                    if (newValue) {
                                                        textColorFillObj = newValue;
                                                    }
                                                    return {};
                                                },
                                                callback: function () {
                                                    circularViz.setTextColor(textColorFillObj);
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },  
                        {
                            style: $WT.EDITORGROUP,
                            items:
                            [
                                {
                                    style: $WT.LABEL,
                                    labelText: "Circle Color Spectrum"
                                },
                                {
                                    style: $WT.TWOCOLUMN,
                                    cssClass: "two-column-fill-group",
                                    items: [
                                        {
                                            style: $WT.LABEL,
                                            width: "35%",
                                            labelText: "Outer:"
                                        },
                                        {
                                            style: $WT.FILLGROUP,
                                            propertyName: "outerColorFillGroup",
                                            width: "65%",
                                            items: [
                                                // {
                                                //     childName: "fillColor",
                                                //     disabled: circularViz.getProperty("colorByOption")
                                                // },
                                                {
                                                    childName: "fillAlpha",
                                                    disabled: true
                                                }
                                            ],
                                            config: {
                                                suppressData: true,
                                                onPropertyChange: function (propertyName, newValue) {
                                                    if (newValue) {
                                                        outerColorObj = newValue;
                                                    }
                                                    return {};
                                                },
                                                callback: function () {
                                                    circularViz.setOuterColor(outerColorObj);
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    style: $WT.TWOCOLUMN,
                                    cssClass: ((circularViz.gridInfo.rows.length) > 1) ? "two-column-fill-group color-spectrum-fill-group" : "hide-block",
                                    items: [
                                        {
                                            style: $WT.LABEL,
                                            width: "35%",
                                            labelText: ""
                                        },
                                        {
                                            style: $WT.FILLGROUP,
                                            width: "65%",
                                            propertyName: "colorDepth1",
                                            items: [
                                                {
                                                    childName: "fillAlpha",
                                                    disabled: true
                                                }
                                            ],
                                            config: {
                                                suppressData: true,
                                                onPropertyChange: function (propertyName, newValue) {
                                                    return {};
                                                },
                                                callback: function () {}
                                            }
                                        }
                                    ]
                                },
                                {
                                    style: $WT.TWOCOLUMN,
                                    cssClass: ((circularViz.gridInfo.rows.length) > 2) ? "two-column-fill-group color-spectrum-fill-group" : "hide-block",
                                    items: [
                                        {
                                            style: $WT.LABEL,
                                            width: "35%",
                                            labelText: ""
                                        },
                                        {
                                            style: $WT.FILLGROUP,
                                            width: "65%",
                                            propertyName: "colorDepth2",
                                            items: [
                                                {
                                                    childName: "fillAlpha",
                                                    disabled: true
                                                }
                                            ],
                                            config: {
                                                suppressData: true,
                                                onPropertyChange: function (propertyName, newValue) {
                                                    return {};
                                                },
                                                callback: function () {}
                                            }
                                        }
                                    ]
                                },
                                {
                                    style: $WT.TWOCOLUMN,
                                    cssClass: ((circularViz.gridInfo.rows.length) > 3) ? "two-column-fill-group color-spectrum-fill-group" : "hide-block",
                                    items: [
                                        {
                                            style: $WT.LABEL,
                                            width: "35%",
                                            labelText: ""
                                        },
                                        {
                                            style: $WT.FILLGROUP,
                                            width: "65%",
                                            propertyName: "colorDepth3",
                                            items: [
                                                {
                                                    childName: "fillAlpha",
                                                    disabled: true
                                                }
                                            ],
                                            config: {
                                                suppressData: true,
                                                onPropertyChange: function (propertyName, newValue) {
                                                    return {};
                                                },
                                                callback: function () {}
                                            }
                                        }
                                    ]
                                },
                                {
                                    style: $WT.TWOCOLUMN,
                                    cssClass: ((circularViz.gridInfo.rows.length) > 4) ? "two-column-fill-group color-spectrum-fill-group" : "hide-block",
                                    items: [
                                        {
                                            style: $WT.LABEL,
                                            width: "35%",
                                            labelText: ""
                                        },
                                        {
                                            style: $WT.FILLGROUP,
                                            width: "65%",
                                            propertyName: "colorDepth4",
                                            items: [
                                                {
                                                    childName: "fillAlpha",
                                                    disabled: true
                                                }
                                            ],
                                            config: {
                                                suppressData: true,
                                                onPropertyChange: function (propertyName, newValue) {
                                                    return {};
                                                },
                                                callback: function () {}
                                            }
                                        }
                                    ]
                                },
                                {
                                    style: $WT.TWOCOLUMN,
                                    cssClass: ((circularViz.gridInfo.rows.length) > 5) ? "two-column-fill-group color-spectrum-fill-group" : "hide-block",
                                    items: [
                                        {
                                            style: $WT.LABEL,
                                            width: "35%",
                                            labelText: ""
                                        },
                                        {
                                            style: $WT.FILLGROUP,
                                            width: "65%",
                                            propertyName: "colorDepth5",
                                            items: [
                                                {
                                                    childName: "fillAlpha",
                                                    disabled: true
                                                }
                                            ],
                                            config: {
                                                suppressData: true,
                                                onPropertyChange: function (propertyName, newValue) {
                                                    return {};
                                                },
                                                callback: function () {}
                                            }
                                        }
                                    ]
                                },
                                {
                                    style: $WT.TWOCOLUMN,
                                    cssClass: "two-column-fill-group",
                                    items: [
                                        {
                                            style: $WT.LABEL,
                                            width: "35%",
                                            labelText: "Inner:"
                                        },
                                        {
                                            style: $WT.FILLGROUP,
                                            width: "65%",
                                            propertyName: "innerColorFillGroup",
                                            items: [
                                                {
                                                    childName: "fillAlpha",
                                                    disabled: true
                                                }
                                            ],
                                            config: {
                                                suppressData: true,
                                                onPropertyChange: function (propertyName, newValue) {
                                                    if (newValue) {
                                                        innerColorObj = newValue;
                                                    }
                                                    return {};
                                                },
                                                callback: function () {
                                                    circularViz.setInnerColor(innerColorObj);
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
                                    style: $WT.CHECKBOXANDLABEL,
                                    propertyName: "colorByOption",
                                    labelText: "Color By First Attribute",
                                    config: {
                                        suppressData: true,
                                        onPropertyChange: function (propertyName, newValue) {
                                            if (newValue) {
                                                colorByObj = newValue;
                                            }
                                            return {};
                                        },
                                        callback: function () {
                                            circularViz.updateColorByOption(colorByObj);
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            style: $WT.EDITORGROUP,
                            items: [
                                {
                                    style: $WT.CHECKBOXANDLABEL,
                                    propertyName: "displayOuterCircle",
                                    labelText: "Display Outer Circle",
                                    config: {
                                        suppressData: true,
                                        onPropertyChange: function (propertyName, newValue) {
                                            if (newValue) {
                                                displayOuterCircleObj = newValue;
                                            }
                                            return {};
                                        },
                                        callback: function () {
                                            circularViz.displayOuterCircle(displayOuterCircleObj);
                                        }
                                    }
                                }
                            ]
                        } 
                    ]
                }];
            }
        }
    )
}());