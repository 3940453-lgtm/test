(function () {
    if (!mstrmojo.plugins.D3Funnel) {
        mstrmojo.plugins.D3Funnel = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel",
        "mstrmojo.array"
    );

    var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE;

    mstrmojo.plugins.D3Funnel.D3FunnelEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            scriptClass: "mstrmojo.plugins.D3Funnel.D3FunnelEditorModel",
            cssClass: "d3funneleditormodel",
            getCustomProperty: function getCustomProperty() {

                var myViz = this.getHost();

                //Variable used to pass value from onPropertyChange to callback methods
                var labels;
                var labelStyle;
                return [
                    {
                        name: 'Label Editor',
                        value: [
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.LABEL,
                                        labelText: "Label Options:"
                                    },

                                    {
                                        style: $WT.BUTTONBAR,
                                        propertyName: "labels",
                                        items: [
                                            {
                                                labelText: "Text",
                                                propertyName: "text"
                                            },
                                            {
                                                labelText: "Values",
                                                propertyName: "values"
                                            }
                                        ],
                                        config: {
                                            suppressData: true,
                                            clientUndoRedoCallback: function () {
                                            },
                                            onPropertyChange: function (propertyName, newValue) {
                                                if (propertyName === "labels") {
                                                    labels = newValue;
                                                }
                                                return {};
                                            },
                                            callback: function () {

                                                //Get the data to get the label from it
                                                rawD = myViz.dataInterface.getRawData(mstrmojo.models.template.DataInterface.ENUM_RAW_DATA_FORMAT.ADV);

                                                //Update the label format
                                                myViz.updateLabelFormat(rawD, labels);
                                            }
                                        },
                                        multiSelect: true
                                    }

                                ]
                            },
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.LABEL,
                                        labelText: "Label Format:"
                                    },
                                    {
                                        style: $WT.CHARACTERGROUP,
                                        propertyName: "labelStyle",
                                        config: {
                                            suppressData: true,
                                            onPropertyChange: function (propertyName, newLabelStyle) {

                                                if (propertyName === "labelStyle") {
                                                    labelStyle = newLabelStyle;
                                                }
                                                return {};
                                            },
                                            callback: function () {
                                                myViz.updateLabelStyle(labelStyle);
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ];

            }
        })
}());
//@ sourceURL=D3FunnelEditorModel.js