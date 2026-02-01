(function () {
    if (!mstrmojo.plugins.ParaCoorDataProcessing) {
        mstrmojo.plugins.ParaCoorDataProcessing = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel",
        "mstrmojo.array"
    );



    mstrmojo.plugins.ParaCoorDataProcessing.ParaCoorDataProcessingEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            scriptClass: "mstrmojo.plugins.ParaCoorDataProcessing.ParaCoorDataProcessingEditorModel",
            cssClass: "paracoordataprocessingeditormodel",
            getCustomProperty: function getCustomProperty() {

                var myViz = this.getHost();
                var colorChangeFlag;

                var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE;
                // Fill the property data here

                return [
                    {
                        name: 'My Custom Properties',
                        value: 
                        [
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.FILLGROUP,
                                        propertyName: "lineFillColor",
                                        labelText: "Color the line: ",
                                        config: {
                                            suppressData: true,
                                            clientUndoRedoCallback: function () {
                                            },
                                            onPropertyChange: function (propertyName, newValue) {
                                                if (propertyName === "lineFillColor") {
                                                    colorChangeFlag = newValue;
                                                }
                                                return {};
                                            },
                                            callback: function () {
                                                myViz.changeLineColorMode(colorChangeFlag);
                                                myViz.refresh();
                                            }
                                        }
                                    },

                                    //{
                                    //
                                    //
                                    //    style: $WT.EDITORGROUP,
                                    //    items: [{
                                    //        style: $WT.CHECKBOXANDLABEL,
                                    //        propertyName: "showLegend",
                                    //        labelText: "Show Legend",
                                    //    }, {
                                    //        style: $WT.TWOCOLUMN,
                                    //        items: [{
                                    //            style: $WT.LABEL,
                                    //            width: "40%",
                                    //            labelText: "Viz Name:",
                                    //            /*    config: {
                                    //             callback: function () {
                                    //             myViz.refresh();
                                    //             // You can also call other functions in your viz, such as myViz.updateLabel()
                                    //             }
                                    //             }   */
                                    //        }, {
                                    //            style: $WT.TEXTBOX,
                                    //            width: "60%",
                                    //            propertyName: 'vizName'
                                    //        }
                                    //        ]
                                    //    }
                                    //    ]
                                    //},


                                    //{
                                    //    style: $WT.TWOCOLUMN,
                                    //    items: [{
                                    //        style: $WT.LABEL,
                                    //        width: "40%",
                                    //        labelText: "Change Color:",
                                    //         //   config: {
                                    //         //callback: function () {
                                    //         //myViz.refresh();
                                    //         //// You can also call other functions in your viz, such as myViz.updateLabel()
                                    //         //}
                                    //         //}
                                    //    }, {
                                    //        style: $WT.PULLDOWN,
                                    //        propertyName: "pd",
                                    //        items: [
                                    //
                                    //            {
                                    //                name: "Red",
                                    //                value: "0",
                                    //                config: {
                                    //                    callback: function () {
                                    //                        myViz.refresh();
                                    //                        // You can also call other functions in your viz, such as myViz.updateLabel()
                                    //                    }
                                    //                }
                                    //            },
                                    //            {
                                    //                name: "Green",
                                    //                value: "1",
                                    //                config: {
                                    //                    callback: function () {
                                    //                        myViz.refresh();
                                    //                        // You can also call other functions in your viz, such as myViz.updateLabel()
                                    //                    }
                                    //                }
                                    //            },
                                    //            {
                                    //                name: "Blue",
                                    //                value: "2",
                                    //                config: {
                                    //                    callback: function () {
                                    //                        myViz.refresh();
                                    //                        // You can also call other functions in your viz, such as myViz.updateLabel()
                                    //                    }
                                    //                }
                                    //            },
                                    //            {
                                    //                name: "Yellow",
                                    //                value: "3",
                                    //                config: {
                                    //                    callback: function () {
                                    //                        myViz.refresh();
                                    //                        // You can also call other functions in your viz, such as myViz.updateLabel()
                                    //                    }
                                    //                }
                                    //            }
                                    //        ]
                                    //    }
                                    //    ]
                                    //}
                                ]
                            }
                        ]
                    }
                ];

            }

        })
}());
//@ sourceURL=ParaCoorDataProcessingEditorModel.js