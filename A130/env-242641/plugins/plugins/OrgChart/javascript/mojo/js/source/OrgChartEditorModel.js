(function () {
    if (!mstrmojo.plugins.OrgChart) {
        mstrmojo.plugins.OrgChart = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel",
        "mstrmojo.array"
    );

    var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE,
        OC_PROPERTIES = mstrmojo.plugins.OrgChart.OC_PROPERTIES;

    mstrmojo.plugins.OrgChart.OrgChartEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            scriptClass: "mstrmojo.plugins.OrgChart.OrgChartEditorModel",
            cssClass: "orgcharteditormodel",
            getCustomProperty: function getCustomProperty(){
                var host = this.getHost();
                var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE;
                return [{
                    name: 'OrgChart Settings',
                    value: [
                        {
                            style: $WT.EDITORGROUP,
                            items: [{
                                style: $WT.LABEL,
                                name: "text",
                                width: "100%",
                                labelText: "Chart Size:"
                            }, {
                                style: $WT.BUTTONBAR,
                                propertyName: "size",
                                items: [
                                    {
                                        labelText: "Small",
                                        propertyName: "small"
                                    },
                                    {
                                        labelText: "Medium",
                                        propertyName: "medium"
                                    },
                                    {
                                        labelText: "Large",
                                        propertyName: "large"
                                    }
                                ],
                                multiSelect: false,
                                config: {
                                    suppressData: true
                                }
                            }]
                        },

                        {
                            style: $WT.EDITORGROUP,
                            items: [{
                                style: $WT.LABEL,
                                name: "text",
                                width: "100%",
                                labelText: "Collapse Option:"
                            }, {
                                style: $WT.CHECKBOXANDLABEL,
                                propertyName: "noCollapse",
                                labelText: "Disable collapse"
                            }]
                        }, {
                            style: $WT.EDITORGROUP,
                            items: [{
                                style: $WT.LABEL,
                                name: "text",
                                width: "100%",
                                labelText: "Backgroud Color:"
                            }, {
                                style: $WT.FILLGROUP,
                                propertyName: "bgFillColor",
                                items: [{
                                    childName: 'fillAlpha',
                                    disabled: true
                                }]
                            }]
                        }, {
                            style: $WT.EDITORGROUP,
                            items: [{
                                style: $WT.LABEL,
                                name: "text",
                                width: "100%",
                                labelText: "Selection Color:"
                            }, {
                                style: $WT.FILLGROUP,
                                propertyName: "selectionFillColor",
                                items: [{
                                    childName: 'fillAlpha',
                                    disabled: true
                                }]
                            }]
                        }
                    ]

                }];


            }
        })}());
//@ sourceURL=OrgChartEditorModel.js