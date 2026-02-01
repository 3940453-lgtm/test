(function () { 
    if (!mstrmojo.plugins.RadarChart) {
        mstrmojo.plugins.RadarChart = {};
    }

    mstrmojo.requiresCls(
        "mstrmojo.vi.models.editors.CustomVisEditorModel"
    );

    var $WT = mstrmojo.vi.models.editors.CustomVisEditorModel.WIDGET_TYPE,
        RC_PROPERTIES = mstrmojo.plugins.RadarChart.RC_PROPERTIES;

    mstrmojo.plugins.RadarChart.RadarChartEditorModel = mstrmojo.declare(
        mstrmojo.vi.models.editors.CustomVisEditorModel,
        null,
        {
            scriptClass: "mstrmojo.plugins.RadarChart.RadarChartEditorModel",
            cssClass: "radarcharteditormodel",
            getCustomProperty: function getCustomProperty(){
                var host = this.getHost();
                return [
                    {
                        name: 'Radar Chart Settings',
                        value: [{
                            style: $WT.EDITORGROUP,
                            items: [{
                                style: $WT.LABEL,
                                name: "text",
                                width: "100%",
                                labelText: "Scale Settings:"
                            }, {
                                style: $WT.CHECKBOXANDLABEL,
                                propertyName: 'reverseScale',
                                labelText: "Reverse scale"
                            }]
                        }]
                    }]









}
})}());
//@ sourceURL=RadarChartEditorModel.js