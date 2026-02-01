(function () {
    if (!mstrmojo.plugins.GoogleGauge) {
        mstrmojo.plugins.GoogleGauge = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel",
        "mstrmojo.array"
    );

    var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE,
        GG_PROPERTIES = mstrmojo.plugins.GoogleGauge.GG_PROPERTIES;

    mstrmojo.plugins.GoogleGauge.GoogleGaugeEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            scriptClass: "mstrmojo.plugins.GoogleGauge.GoogleGaugeEditorModel",
            cssClass: "googlegaugeeditormodel",
            getCustomProperty: function getCustomProperty() {

                //var myViz = this.getHost();

                return [
                    {
                        name: 'Gauge Properties',
                        value: [
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.CHECKBOXANDLABEL,
                                        propertyName: "displayMetric",
                                        labelText: "Display Percentage",
                                        config: {
                                            suppressData: true
                                            //  callback: function () {
                                            // guageViz.toggleMetrics();
                                            //  }
                                        }
                                    }
                                ]
                            },
                            {
                                style: $WT.EDITORGROUP,
                                items: [
                                    {
                                        style: $WT.LABEL,
                                        labelText: "Percentage Settings:"
                                    },
                                    //Sample Display:
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [
                                            {
                                                style: $WT.LABEL,
                                                labelText: "Low: "
                                            }, {
                                                style: $WT.LABEL,
                                                labelText: "From 0 %  to  L %"
                                            }]

                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [
                                            {
                                                style: $WT.LABEL,
                                                labelText: "Medium: "
                                            }, {
                                                style: $WT.LABEL,
                                                labelText: "From M %  to  H %"
                                            }]

                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [
                                            {
                                                style: $WT.LABEL,
                                                labelText: "High: "
                                            }, {
                                                style: $WT.LABEL,
                                                labelText: "From H %  to  100 %"
                                            }]

                                    },
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [
                                            {
                                                style: $WT.LABEL,
                                                width: "50%",
                                                labelText: " Fill Color"
                                            },
                                            {
                                                style: $WT.LABEL,
                                                width: "50%",
                                                labelText: "Percentage"
                                            }
                                        ]
                                    },
                                    //Green
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [
                                            {
                                                style: $WT.LABEL,
                                                width: "10%",
                                                labelText: "L: "
                                            },
                                            {

                                                style: $WT.FILLGROUP,
                                                width: "90%",
                                                propertyName: "GF"

                                            }
                                        ]
                                    },
                                    //Yellow
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [
                                            {
                                                style: $WT.LABEL,
                                                width: "10%",
                                                labelText: "M: "
                                            },
                                            {

                                                style: $WT.FILLGROUP,
                                                width: "90%",
                                                propertyName: "YF"

                                            }
                                        ]
                                    },
                                    //Red
                                    {
                                        style: $WT.TWOCOLUMN,
                                        items: [
                                            {
                                                style: $WT.LABEL,
                                                width: "10%",
                                                labelText: "H: "
                                            },
                                            {

                                                style: $WT.FILLGROUP,
                                                width: "90%",
                                                propertyName: "RF"

                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ];
            }
        })
}());
//@ sourceURL=GoogleGaugeEditorModel.js