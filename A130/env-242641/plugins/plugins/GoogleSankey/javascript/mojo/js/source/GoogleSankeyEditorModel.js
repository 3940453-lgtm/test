(function () {
    if (!mstrmojo.plugins.GoogleSankey) {
        mstrmojo.plugins.GoogleSankey = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel",
        "mstrmojo.array"
    );
    var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE,
        GS_PROPERTIES = mstrmojo.plugins.GoogleSankey.GS_PROPERTIES;

    mstrmojo.plugins.GoogleSankey.GoogleSankeyEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            scriptClass: "mstrmojo.plugins.GoogleSankey.GoogleSankeyEditorModel",
            cssClass: "googlesankeyeditormodel",
            getCustomProperty: function getCustomProperty() {

                return [
                    {
                        name: 'Sankey Settings',
                        value: [{
                            style: $WT.EDITORGROUP,
                            items: [{
                                style: $WT.LABEL,
                                name: "text",
                                width: "100%",
                                labelText: "Label Style:"
                            }, {
                                style: $WT.CHARACTERGROUP,
                                propertyName: 'labelFont',

                                config: {
                                    suppressData: true
                                }
                            }]
                        }, {
                            style: $WT.EDITORGROUP,
                            items: [{
                                style: $WT.LABEL,
                                name: "text",
                                width: "100%",
                                labelText: "Tooltip Style:"
                            }, {
                                style: $WT.CHARACTERGROUP,
                                propertyName: 'tooltipFont',
                                config: {
                                    suppressData: true
                                }
                            }]
                        }, {
                            style: $WT.EDITORGROUP,
                            items: [{
                                style: $WT.LABEL,
                                name: "text",
                                width: "100%",
                                labelText: "Node Width:"
                            }, {
                                style: $WT.STEPPER,
                                propertyName: "nodeWidth",
                                min: 1,
                                max: 20
                            }]
                        }]

                    }];


            }
        })
}());
//@ sourceURL=GoogleSankeyEditorModel.js