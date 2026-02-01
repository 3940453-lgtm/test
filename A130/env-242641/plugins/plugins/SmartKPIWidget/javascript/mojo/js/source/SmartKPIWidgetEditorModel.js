(function () {
    if (!mstrmojo.plugins.SmartKPIWidget) {
        mstrmojo.plugins.SmartKPIWidget = {};
    }
    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel",
        "mstrmojo.plugins.SmartKPIWidget.SmartKPIWidget",
        "mstrmojo.array"
    );

    var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE;

    mstrmojo.plugins.SmartKPIWidget.SmartKPIWidgetEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,

        null,
        {
            scriptClass: 'mstrmojo.plugins.SmartKPIWidget.SmartKPIWidgetEditorModel',

            getCustomProperty: function getCustomProperty() {
                var host = this.getHost();
                return [
                    {
                        name: 'KPI Settings',
                        value: [{
                            style: $WT.EDITORGROUP,
                            items: [{
                                style: $WT.LABEL,
                                name: "text",
                                width: "100%",
                                labelText: "Display Mode:"
                            }, {
                                style: $WT.PULLDOWN,
                                propertyName: "displayMode",
                                items: [
                                    {
                                        name: "Stacked",
                                        value: "0"
                                    }, {

                                        name: "Responsive",
                                        value: "1"
                                    },{
                                        name: "Horizontal",
                                        value: "2"
                                    }, {

                                        name: "Vertical",
                                        value: "3"
                                    }
                                ]
                            }]

                        }, {
                            style: $WT.EDITORGROUP,
                            items: [{
                                style: $WT.LABEL,
                                name: "text",
                                width: "100%",
                                labelText: "Auto Play:"
                            }, {
                                disabled: host.getProperty('displayMode') !== "0",
                                style: $WT.CHECKBOXANDLABEL,
                                propertyName: 'enableAutoPlay',
                                labelText: "Auto play",
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
                                labelText: "Theme:"
                            }, {
                                style: $WT.PULLDOWN,
                                propertyName: "kpiTheme",
                                items: [
                                    {
                                        name: "dark theme",
                                        value: "dark-theme"
                                    }, {

                                        name: "light theme",
                                        value: "light-theme"
                                    }
                                ]
                            }]

                        },{
                            style: $WT.EDITORGROUP,
                            items: [{
                                style: $WT.CHECKBOXANDLABEL,
                                propertyName: "invertThresholdColor",
                                labelText: "Invert threshold color",
                                config: {
                                    suppressData: true
                                }
                            }]

                        }]
                    }
                ];
            }
        }
    );
}());
//@ sourceURL=SmartKPIWidgetEditorModel.js
